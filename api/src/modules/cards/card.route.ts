import { FastifyInstance } from "fastify";
import { CardController } from "./card.controller";
import { CardSchema } from "./card.schema";

const cardController = new CardController();

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
}
