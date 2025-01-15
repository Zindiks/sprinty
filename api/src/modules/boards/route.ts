import { FastifyInstance } from "fastify"

import {
  createBoardController,
  getBoardController,
  removeBoardController,
  updateBoardController,
  getAllBoardsController,
} from "./controller"
import { BoardSchema } from "./model"

export default async function boardRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/:id",
    {
      schema: {
        params: { type: "object", properties: { id: { type: "string" } } },
        response: { 200: BoardSchema.BoardResponseSchema },
        tags: ["board"],
        description: "Get an board",
      },
    },
    getBoardController
  )

  fastify.get(
    "/:organization_id/all",
    {
      schema: {
        params: {
          type: "object",
          properties: { organization_id: { type: "string" } },
        },
        response: {
          200: {
            type: "array",
            items: BoardSchema.BoardResponseSchema,
          },
        },
        tags: ["board"],
        description: "Get all boards",
      },
    },
    getAllBoardsController
  )

  fastify.post(
    "/",
    {
      schema: {
        body: BoardSchema.CreateBoardSchema,
        response: {
          200: BoardSchema.BoardResponseSchema,
        },
        tags: ["board"],
        description: "Create a new Board",
      },
    },

    createBoardController
  )

  fastify.put(
    "/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
        },
        body: BoardSchema.UpdateBoardSchema,
        response: {
          200: BoardSchema.BoardResponseSchema,
        },
        tags: ["board"],
        description: "Update a board",
      },
    },
    updateBoardController
  )

  fastify.delete(
    "/:id",
    {
      schema: {
        params: BoardSchema.DeleteBoardSchema,
        response: { 200: BoardSchema.DeleteBoardSchema },
        tags: ["board"],
        description: "Delete a board",
      },
    },
    removeBoardController
  )
}
