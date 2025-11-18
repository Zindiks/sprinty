import { Knex } from "knex";
import {
  CreateAttachment,
  UpdateAttachment,
  DeleteAttachment,
  AttachmentResponse,
  AttachmentWithUserResponse,
  AttachmentListResponse,
  AttachmentCountResponse,
} from "./attachment.schema";
import knexInstance from "../../db/knexInstance";

const table = "attachments";

export class AttachmentRepository {
  private readonly knex: Knex;

  constructor() {
    this.knex = knexInstance;
  }

  async createAttachment(input: CreateAttachment): Promise<AttachmentResponse> {
    const {
      card_id,
      filename,
      original_filename,
      mime_type,
      file_size,
      storage_path,
      uploaded_by,
    } = input;

    const [attachment] = await this.knex(table)
      .insert({
        card_id,
        filename,
        original_filename,
        mime_type,
        file_size,
        storage_path,
        uploaded_by,
      })
      .returning("*");

    return attachment;
  }

  async getAttachmentById(id: string, card_id: string): Promise<AttachmentResponse | undefined> {
    const attachment = await this.knex(table).where({ id, card_id }).first("*");

    return attachment;
  }

  async getAttachmentWithUser(
    id: string,
    card_id: string
  ): Promise<AttachmentWithUserResponse | undefined> {
    const attachment = await this.knex(table)
      .where({ "attachments.id": id, "attachments.card_id": card_id })
      .join("users", "attachments.uploaded_by", "users.id")
      .leftJoin("profiles", "users.id", "profiles.user_id")
      .select(
        "attachments.*",
        this.knex.raw(`
          json_build_object(
            'id', users.id,
            'email', users.email,
            'username', profiles.username
          ) as user
        `)
      )
      .first();

    return attachment;
  }

  async getAttachmentsByCardId(card_id: string): Promise<AttachmentListResponse> {
    const attachments = await this.knex(table)
      .where({ "attachments.card_id": card_id })
      .join("users", "attachments.uploaded_by", "users.id")
      .leftJoin("profiles", "users.id", "profiles.user_id")
      .select(
        "attachments.*",
        this.knex.raw(`
          json_build_object(
            'id', users.id,
            'email', users.email,
            'username', profiles.username
          ) as user
        `)
      )
      .orderBy("attachments.uploaded_at", "desc");

    return attachments || [];
  }

  async updateAttachment(input: UpdateAttachment): Promise<AttachmentResponse | undefined> {
    const { id, card_id, filename } = input;

    const updateData: Partial<CreateAttachment> = {};

    if (filename) {
      updateData.filename = filename;
    }

    if (Object.keys(updateData).length === 0) {
      return this.getAttachmentById(id, card_id);
    }

    const [attachment] = await this.knex(table)
      .where({ id, card_id })
      .update(updateData)
      .returning("*");

    return attachment;
  }

  async deleteAttachment(input: DeleteAttachment): Promise<boolean> {
    const { id, card_id } = input;

    const deleted = await this.knex(table).where({ id, card_id }).del();

    return deleted > 0;
  }

  async getAttachmentCount(card_id: string): Promise<AttachmentCountResponse> {
    const result = await this.knex(table).where({ card_id }).count("id as count").first();

    return {
      card_id,
      count: Number(result?.count) || 0,
    };
  }

  async getAttachmentsByUserId(user_id: string): Promise<AttachmentListResponse> {
    const attachments = await this.knex(table)
      .where({ "attachments.uploaded_by": user_id })
      .join("users", "attachments.uploaded_by", "users.id")
      .leftJoin("profiles", "users.id", "profiles.user_id")
      .select(
        "attachments.*",
        this.knex.raw(`
          json_build_object(
            'id', users.id,
            'email', users.email,
            'username', profiles.username
          ) as user
        `)
      )
      .orderBy("attachments.uploaded_at", "desc");

    return attachments || [];
  }
}
