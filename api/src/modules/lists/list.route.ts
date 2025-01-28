import { FastifyInstance } from "fastify"

import { ListController } from "./list.controller"
import { ListSchema } from "./list.schema"

const listController = new ListController()

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

        tags: ["list"],
        description: "Get all lists by board id",
      },
    },
    listController.getListsByBoardIdController.bind(listController)
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
    listController.createListController.bind(listController)
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
    listController.copyListController.bind(listController)
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
    listController.updateListOrderController.bind(listController)
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
    listController.updateListTitleController.bind(listController)
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
    listController.deleteListController.bind(listController)
  )
}
