import { FastifyInstance } from "fastify"

import {
  createListController,
  copyListController,
  updateListOrderController,
  updateListTitleController,
  deleteListController,
  getListsByBoardIdController,
} from "./controller"
import { ListSchema } from "./model"

export default async function listRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/:board_id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            board_id: { type: "string" },
          },
          required: ["board_id"],
        },
        response: {
          200: {
            type: "array",
            items: ListSchema.FullListResponseSchema,
          },
        },
        tags: ["list"],
        description: "Get all lists by board id",
      },
    },
    getListsByBoardIdController
  )

  fastify.post(
    "/",
    {
      schema: {
        body: ListSchema.CreateListSchema,
        response: {
          200: ListSchema.FullListResponseSchema,
        },
        tags: ["list"],
        description: "Create a new List",
      },
    },
    createListController
  )

  fastify.post(
    "/copy",
    {
      schema: {
        body: ListSchema.CopyListSchema,
        response: {
          200: ListSchema.FullListResponseSchema,
        },
        tags: ["list"],
        description: "Copy a list",
      },
    },
    copyListController
  )

  fastify.put(
    "/order/:board_id",
    {
      schema: {
        body: ListSchema.UpdateListOrderSchemaArray,
        params: {
          type: "object",
          properties: {
            board_id: { type: "string" },
          },
          required: ["board_id"],
        },
        tags: ["list"],
        description: "Update a list order",
      },
    },
    updateListOrderController
  )

  fastify.patch(
    "/update",
    {
      schema: {
        body: ListSchema.UpdateListTitleSchema,
        response: {
          200: ListSchema.FullListResponseSchema,
        },
        tags: ["list"],
        description: "Update a list title",
      },
    },
    updateListTitleController
  )

  fastify.delete(
    "/:id/board/:board_id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            board_id: { type: "string" },
            id: { type: "string" },
          },
          required: ["board_id", "id"],
        },
        response: {
          200: ListSchema.FullListResponseSchema,
        },
        tags: ["list"],
        description: "Delete a list",
      },
    },
    deleteListController
  )
}
