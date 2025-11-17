import { FastifyReply, FastifyRequest } from "fastify";
import { AttachmentService } from "./attachment.service";
import {
  CreateAttachment,
  UpdateAttachment,
  DeleteAttachment,
} from "./attachment.schema";
import path from "path";
import fs from "fs/promises";
import { pipeline } from "stream/promises";
import crypto from "crypto";

export class AttachmentController {
  private readonly attachmentService: AttachmentService;
  private readonly uploadDir: string;
  private readonly maxFileSize: number = 10 * 1024 * 1024; // 10MB
  private readonly allowedMimeTypes: string[] = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "text/csv",
  ];

  constructor() {
    this.attachmentService = new AttachmentService();
    this.uploadDir = path.join(process.cwd(), "uploads");
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async uploadAttachment(
    request: FastifyRequest<{
      Params: { card_id: string };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { card_id } = request.params;

      // TODO: Replace with actual user_id from auth context
      const user_id = "550e8400-e29b-41d4-a716-446655440000";

      const data = await request.file();

      if (!data) {
        return reply.code(400).send({ error: "No file uploaded" });
      }

      // Validate file size
      if (data.file.bytesRead > this.maxFileSize) {
        return reply
          .code(400)
          .send({ error: "File size exceeds 10MB limit" });
      }

      // Validate MIME type
      if (!this.allowedMimeTypes.includes(data.mimetype)) {
        return reply.code(400).send({ error: "File type not allowed" });
      }

      // Generate unique filename
      const fileExt = path.extname(data.filename);
      const uniqueFilename = `${crypto.randomUUID()}${fileExt}`;
      const storagePath = path.join(this.uploadDir, uniqueFilename);

      // Save file to disk
      await pipeline(data.file, fs.createWriteStream(storagePath));

      // Get file stats for file size
      const stats = await fs.stat(storagePath);

      // Create attachment record
      const attachmentData: CreateAttachment = {
        card_id,
        filename: uniqueFilename,
        original_filename: data.filename,
        mime_type: data.mimetype,
        file_size: stats.size,
        storage_path: storagePath,
        uploaded_by: user_id,
      };

      const attachment =
        await this.attachmentService.createAttachment(attachmentData);

      return reply.code(201).send(attachment);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Failed to upload file" });
    }
  }

  async getAttachment(
    request: FastifyRequest<{
      Params: { id: string; card_id: string };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { id, card_id } = request.params;

      const attachment = await this.attachmentService.getAttachmentWithUser(
        id,
        card_id,
      );

      if (!attachment) {
        return reply.code(404).send({ error: "Attachment not found" });
      }

      return reply.send(attachment);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Failed to get attachment" });
    }
  }

  async getAttachmentsByCardId(
    request: FastifyRequest<{
      Params: { card_id: string };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { card_id } = request.params;

      const attachments =
        await this.attachmentService.getAttachmentsByCardId(card_id);

      return reply.send(attachments);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Failed to get attachments" });
    }
  }

  async downloadAttachment(
    request: FastifyRequest<{
      Params: { id: string; card_id: string };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { id, card_id } = request.params;

      const attachment = await this.attachmentService.getAttachmentById(
        id,
        card_id,
      );

      if (!attachment) {
        return reply.code(404).send({ error: "Attachment not found" });
      }

      // Check if file exists
      try {
        await fs.access(attachment.storage_path);
      } catch {
        return reply.code(404).send({ error: "File not found on server" });
      }

      // Set headers for file download
      reply.header("Content-Type", attachment.mime_type);
      reply.header(
        "Content-Disposition",
        `attachment; filename="${attachment.original_filename}"`,
      );

      // Stream file to response
      const fileStream = fs.createReadStream(attachment.storage_path);
      return reply.send(fileStream);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Failed to download file" });
    }
  }

  async updateAttachment(
    request: FastifyRequest<{
      Body: UpdateAttachment;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const attachment = await this.attachmentService.updateAttachment(
        request.body,
      );

      if (!attachment) {
        return reply.code(404).send({ error: "Attachment not found" });
      }

      return reply.send(attachment);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Failed to update attachment" });
    }
  }

  async deleteAttachment(
    request: FastifyRequest<{
      Params: { id: string; card_id: string };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { id, card_id } = request.params;

      // Get attachment to find file path
      const attachment = await this.attachmentService.getAttachmentById(
        id,
        card_id,
      );

      if (!attachment) {
        return reply.code(404).send({ error: "Attachment not found" });
      }

      // Delete database record
      const deleted = await this.attachmentService.deleteAttachment({
        id,
        card_id,
      });

      if (!deleted) {
        return reply.code(404).send({ error: "Attachment not found" });
      }

      // Delete file from disk
      try {
        await fs.unlink(attachment.storage_path);
      } catch (error) {
        request.log.error(
          `Failed to delete file: ${attachment.storage_path}`,
          error,
        );
        // Continue even if file deletion fails
      }

      return reply.code(204).send();
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Failed to delete attachment" });
    }
  }

  async getAttachmentCount(
    request: FastifyRequest<{
      Params: { card_id: string };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { card_id } = request.params;

      const count =
        await this.attachmentService.getAttachmentCount(card_id);

      return reply.send(count);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Failed to get attachment count" });
    }
  }

  async getAttachmentsByUserId(
    request: FastifyRequest<{
      Params: { user_id: string };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { user_id } = request.params;

      const attachments =
        await this.attachmentService.getAttachmentsByUserId(user_id);

      return reply.send(attachments);
    } catch (error) {
      request.log.error(error);
      return reply
        .code(500)
        .send({ error: "Failed to get user attachments" });
    }
  }
}
