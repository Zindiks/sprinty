import { FastifyInstance } from "fastify";
import { AttachmentController } from "./attachment.controller";
import { AttachmentSchema } from "./attachment.schema";
import { requireCardAccess } from "../../middleware/authorization.middleware";

export default async function attachmentRoutes(server: FastifyInstance) {
  const attachmentController = new AttachmentController();

  // Upload attachment
  server.post(
    "/card/:card_id",
    {
      preHandler: [requireCardAccess],
      schema: {
        description: "Upload attachment to a card",
        tags: ["attachments"],
        params: {
          type: "object",
          properties: {
            card_id: { type: "string", format: "uuid" },
          },
          required: ["card_id"],
        },
        response: {
          201: { $ref: "AttachmentResponseSchema#" },
        },
      },
    },
    attachmentController.uploadAttachment.bind(attachmentController),
  );

  // Get attachment by ID with user details
  server.get(
    "/:id/card/:card_id",
    {
      preHandler: [requireCardAccess],
      schema: {
        description: "Get attachment by ID with user details",
        tags: ["attachments"],
        params: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            card_id: { type: "string", format: "uuid" },
          },
          required: ["id", "card_id"],
        },
        response: {
          200: { $ref: "AttachmentWithUserResponseSchema#" },
        },
      },
    },
    attachmentController.getAttachment.bind(attachmentController),
  );

  // Get all attachments for a card
  server.get(
    "/card/:card_id",
    {
      preHandler: [requireCardAccess],
      schema: {
        description: "Get all attachments for a card",
        tags: ["attachments"],
        params: {
          type: "object",
          properties: {
            card_id: { type: "string", format: "uuid" },
          },
          required: ["card_id"],
        },
        response: {
          200: { $ref: "AttachmentListResponseSchema#" },
        },
      },
    },
    attachmentController.getAttachmentsByCardId.bind(attachmentController),
  );

  // Download attachment
  server.get(
    "/:id/card/:card_id/download",
    {
      preHandler: [requireCardAccess],
      schema: {
        description: "Download attachment file",
        tags: ["attachments"],
        params: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            card_id: { type: "string", format: "uuid" },
          },
          required: ["id", "card_id"],
        },
      },
    },
    attachmentController.downloadAttachment.bind(attachmentController),
  );

  // Update attachment (rename)
  server.patch(
    "/",
    {
      preHandler: [requireCardAccess],
      schema: {
        description: "Update attachment metadata (rename)",
        tags: ["attachments"],
        body: { $ref: "UpdateAttachmentSchema#" },
        response: {
          200: { $ref: "AttachmentResponseSchema#" },
        },
      },
    },
    attachmentController.updateAttachment.bind(attachmentController),
  );

  // Delete attachment
  server.delete(
    "/:id/card/:card_id",
    {
      preHandler: [requireCardAccess],
      schema: {
        description: "Delete attachment",
        tags: ["attachments"],
        params: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            card_id: { type: "string", format: "uuid" },
          },
          required: ["id", "card_id"],
        },
        response: {
          204: { type: "null" },
        },
      },
    },
    attachmentController.deleteAttachment.bind(attachmentController),
  );

  // Get attachment count for a card
  server.get(
    "/card/:card_id/count",
    {
      preHandler: [requireCardAccess],
      schema: {
        description: "Get attachment count for a card",
        tags: ["attachments"],
        params: {
          type: "object",
          properties: {
            card_id: { type: "string", format: "uuid" },
          },
          required: ["card_id"],
        },
        response: {
          200: { $ref: "AttachmentCountResponseSchema#" },
        },
      },
    },
    attachmentController.getAttachmentCount.bind(attachmentController),
  );

  // Get attachments uploaded by a user
  server.get(
    "/user/:user_id",
    {
      schema: {
        description: "Get all attachments uploaded by a user",
        tags: ["attachments"],
        params: {
          type: "object",
          properties: {
            user_id: { type: "string", format: "uuid" },
          },
          required: ["user_id"],
        },
        response: {
          200: { $ref: "AttachmentListResponseSchema#" },
        },
      },
    },
    attachmentController.getAttachmentsByUserId.bind(attachmentController),
  );
}
