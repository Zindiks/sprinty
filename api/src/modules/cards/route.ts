import { FastifyInstance } from "fastify"

import {
  createCardController,
  updateCardOrderController,
  updateCardTitleController,
  getCardController,
  deleteCardController,
  getCardsByListIdController,
} from "./controller"

import { CardSchema } from "./model"

export default async function cardRoutes(fastify: FastifyInstance) {
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
    createCardController
  )

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
    updateCardTitleController
  )

  fastify.patch(
    "/order",
    {
      schema: {
        body: CardSchema.UpdateCardOrderSchemaArray,
        tags: ["card"],
        description: "Update a card order",
      },
    },
    updateCardOrderController
  )

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
    getCardController
  )

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
    getCardsByListIdController
  )

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
    deleteCardController
  )
}
