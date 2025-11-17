import { FastifyInstance } from "fastify";
import { CardController } from "./card.controller";
import { BulkController } from "./bulk.controller";
import { CardSchema } from "./card.schema";

const cardController = new CardController();
const bulkController = new BulkController();

export default async function cardRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/:id",
    {
      schema: {
        params: { type: "object", properties: { id: { type: "string" } } },
        response: { 200: CardSchema.FullCardResponseSchema },
        tags: ["card"],
        description: "Get a card",
      },
    },
    cardController.getCardController.bind(cardController),
  );

  fastify.get(
    "/:id/with-assignees",
    {
      schema: {
        params: { type: "object", properties: { id: { type: "string" } } },
        response: {
          200: CardSchema.CardWithAssigneesResponseSchema,
          404: {
            type: "object",
            properties: { message: { type: "string" } },
          },
        },
        tags: ["card"],
        description: "Get a card with assignee details",
      },
    },
    cardController.getCardWithAssigneesController.bind(cardController),
  );

  fastify.get(
    "/:id/details",
    {
      schema: {
        params: { type: "object", properties: { id: { type: "string" } } },
        response: {
          200: CardSchema.CardWithDetailsResponseSchema,
          404: {
            type: "object",
            properties: { message: { type: "string" } },
          },
        },
        tags: ["card"],
        description: "Get a card with full details (assignees and labels)",
      },
    },
    cardController.getCardWithDetailsController.bind(cardController),
  );

  fastify.get(
    "/list/:list_id",
    {
      schema: {
        params: { type: "object", properties: { list_id: { type: "string" } } },
        response: { 200: CardSchema.FullCardResponseSchemaArray },
        tags: ["card"],
        description: "Get cards by list_id",
      },
    },
    cardController.getCardsByListIdController.bind(cardController),
  );

  fastify.post(
    "/",
    {
      schema: {
        body: CardSchema.CreateCardSchema,
        response: {
          201: CardSchema.FullCardResponseSchema,
        },
        tags: ["card"],
        description: "Create a new Card",
      },
    },
    cardController.createCardController.bind(cardController),
  );

  fastify.patch(
    "/update",
    {
      schema: {
        body: CardSchema.UpdateCardTitleSchema,
        response: {
          200: CardSchema.FullCardResponseSchema,
        },
        tags: ["card"],
        description: "Update a card title",
      },
    },
    cardController.updateCardTitleController.bind(cardController),
  );

  fastify.patch(
    "/details",
    {
      schema: {
        body: CardSchema.UpdateCardDetailsSchema,
        response: {
          200: CardSchema.FullCardResponseSchema,
        },
        tags: ["card"],
        description: "Update card details (title, description, status, due_date, priority)",
      },
    },
    cardController.updateCardDetailsController.bind(cardController),
  );

  fastify.put(
    "/order",
    {
      schema: {
        body: CardSchema.UpdateCardOrderSchemaArray,
        tags: ["card"],
        description: "Update a card order",
      },
    },
    cardController.updateCardOrderController.bind(cardController),
  );

  fastify.delete(
    "/:id/list/:list_id",
    {
      schema: {
        params: CardSchema.DeleteCardSchema,
        response: {
          200: CardSchema.FullCardResponseSchema,
        },
        tags: ["card"],
        description: "Delete a card",
      },
    },
    cardController.deleteCardController.bind(cardController),
  );

  // Bulk operations
  fastify.post(
    "/bulk/move",
    {
      schema: {
        body: {
          type: "object",
          required: ["card_ids", "target_list_id"],
          properties: {
            card_ids: { type: "array", items: { type: "string" } },
            target_list_id: { type: "string" },
          },
        },
        tags: ["card", "bulk"],
        description: "Move multiple cards to a target list",
      },
    },
    bulkController.bulkMoveCards.bind(bulkController),
  );

  fastify.post(
    "/bulk/assign",
    {
      schema: {
        body: {
          type: "object",
          required: ["card_ids", "user_ids"],
          properties: {
            card_ids: { type: "array", items: { type: "string" } },
            user_ids: { type: "array", items: { type: "string" } },
          },
        },
        tags: ["card", "bulk"],
        description: "Assign users to multiple cards",
      },
    },
    bulkController.bulkAssignUsers.bind(bulkController),
  );

  fastify.post(
    "/bulk/labels",
    {
      schema: {
        body: {
          type: "object",
          required: ["card_ids", "label_ids"],
          properties: {
            card_ids: { type: "array", items: { type: "string" } },
            label_ids: { type: "array", items: { type: "string" } },
          },
        },
        tags: ["card", "bulk"],
        description: "Add labels to multiple cards",
      },
    },
    bulkController.bulkAddLabels.bind(bulkController),
  );

  fastify.post(
    "/bulk/due-date",
    {
      schema: {
        body: {
          type: "object",
          required: ["card_ids"],
          properties: {
            card_ids: { type: "array", items: { type: "string" } },
            due_date: { type: ["string", "null"] },
          },
        },
        tags: ["card", "bulk"],
        description: "Set due date on multiple cards",
      },
    },
    bulkController.bulkSetDueDate.bind(bulkController),
  );

  fastify.post(
    "/bulk/archive",
    {
      schema: {
        body: {
          type: "object",
          required: ["card_ids"],
          properties: {
            card_ids: { type: "array", items: { type: "string" } },
          },
        },
        tags: ["card", "bulk"],
        description: "Archive multiple cards",
      },
    },
    bulkController.bulkArchiveCards.bind(bulkController),
  );

  fastify.delete(
    "/bulk",
    {
      schema: {
        body: {
          type: "object",
          required: ["card_ids"],
          properties: {
            card_ids: { type: "array", items: { type: "string" } },
          },
        },
        tags: ["card", "bulk"],
        description: "Delete multiple cards",
      },
    },
    bulkController.bulkDeleteCards.bind(bulkController),
  );
}
