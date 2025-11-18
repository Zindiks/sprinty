import { FastifyInstance } from "fastify";
import { LabelController } from "./label.controller";
import { LabelSchema } from "./label.schema";
import {
  requireBoardAccess,
  requireCardAccess
} from "../../middleware/authorization.middleware";

const labelController = new LabelController();

export default async function labelRoutes(fastify: FastifyInstance) {
  // Label CRUD routes
  fastify.post(
    "/",
    {
      preHandler: [requireBoardAccess],
      schema: {
        body: LabelSchema.CreateLabelSchema,
        response: {
          201: LabelSchema.LabelResponseSchema,
          409: {
            type: "object",
            properties: { message: { type: "string" } },
          },
        },
        tags: ["label"],
        description: "Create a new label for a board",
      },
    },
    labelController.createLabelController.bind(labelController),
  );

  fastify.patch(
    "/",
    {
      preHandler: [requireBoardAccess],
      schema: {
        body: LabelSchema.UpdateLabelSchema,
        response: {
          200: LabelSchema.LabelResponseSchema,
          404: {
            type: "object",
            properties: { message: { type: "string" } },
          },
          409: {
            type: "object",
            properties: { message: { type: "string" } },
          },
        },
        tags: ["label"],
        description: "Update a label",
      },
    },
    labelController.updateLabelController.bind(labelController),
  );

  fastify.delete(
    "/:id/board/:board_id",
    {
      preHandler: [requireBoardAccess],
      schema: {
        params: LabelSchema.DeleteLabelSchema,
        response: {
          200: {
            type: "object",
            properties: { message: { type: "string" } },
          },
          404: {
            type: "object",
            properties: { message: { type: "string" } },
          },
        },
        tags: ["label"],
        description: "Delete a label",
      },
    },
    labelController.deleteLabelController.bind(labelController),
  );

  fastify.get(
    "/:id/board/:board_id",
    {
      preHandler: [requireBoardAccess],
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            board_id: { type: "string", format: "uuid" },
          },
        },
        response: {
          200: LabelSchema.LabelResponseSchema,
          404: {
            type: "object",
            properties: { message: { type: "string" } },
          },
        },
        tags: ["label"],
        description: "Get a label by ID",
      },
    },
    labelController.getLabelController.bind(labelController),
  );

  fastify.get(
    "/board/:board_id",
    {
      preHandler: [requireBoardAccess],
      schema: {
        params: {
          type: "object",
          properties: {
            board_id: { type: "string", format: "uuid" },
          },
        },
        response: {
          200: LabelSchema.LabelResponseSchemaArray,
        },
        tags: ["label"],
        description: "Get all labels for a board",
      },
    },
    labelController.getLabelsByBoardIdController.bind(labelController),
  );

  fastify.get(
    "/board/:board_id/with-count",
    {
      preHandler: [requireBoardAccess],
      schema: {
        params: {
          type: "object",
          properties: {
            board_id: { type: "string", format: "uuid" },
          },
        },
        response: {
          200: LabelSchema.LabelWithCardsCountSchemaArray,
        },
        tags: ["label"],
        description: "Get all labels for a board with cards count",
      },
    },
    labelController.getLabelsWithCardsCountController.bind(labelController),
  );

  // Card-Label association routes
  fastify.post(
    "/card",
    {
      preHandler: [requireCardAccess],
      schema: {
        body: LabelSchema.AddLabelToCardSchema,
        response: {
          201: LabelSchema.CardLabelResponseSchema,
        },
        tags: ["label"],
        description: "Add a label to a card",
      },
    },
    labelController.addLabelToCardController.bind(labelController),
  );

  fastify.delete(
    "/card/:card_id/label/:label_id",
    {
      preHandler: [requireCardAccess],
      schema: {
        params: LabelSchema.RemoveLabelFromCardSchema,
        response: {
          200: {
            type: "object",
            properties: { message: { type: "string" } },
          },
          404: {
            type: "object",
            properties: { message: { type: "string" } },
          },
        },
        tags: ["label"],
        description: "Remove a label from a card",
      },
    },
    labelController.removeLabelFromCardController.bind(labelController),
  );

  fastify.get(
    "/card/:card_id",
    {
      preHandler: [requireCardAccess],
      schema: {
        params: {
          type: "object",
          properties: {
            card_id: { type: "string", format: "uuid" },
          },
        },
        response: {
          200: LabelSchema.LabelResponseSchemaArray,
        },
        tags: ["label"],
        description: "Get all labels for a card",
      },
    },
    labelController.getLabelsByCardIdController.bind(labelController),
  );

  fastify.get(
    "/:label_id/cards",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            label_id: { type: "string", format: "uuid" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              card_ids: {
                type: "array",
                items: { type: "string", format: "uuid" },
              },
            },
          },
        },
        tags: ["label"],
        description: "Get all cards with a specific label",
      },
    },
    labelController.getCardsByLabelIdController.bind(labelController),
  );
}
