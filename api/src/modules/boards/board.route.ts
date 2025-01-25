import { FastifyInstance } from "fastify"
import { BoardSchema } from "./board.schema"
import { BoardController } from "./board.controller"

class BoardRoutes {
  private boardController: BoardController

  constructor() {
    this.boardController = new BoardController()
  }

  public async registerRoutes(fastify: FastifyInstance) {
    fastify.get(
      "/:id",
      {
        schema: {
          params: { type: "object", properties: { id: { type: "string" } } },
          response: { 200: BoardSchema.BoardResponseSchema },
          tags: ["board"],
          description: "Get a board",
        },
      },
      this.boardController.getBoardController.bind(this.boardController)
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
      this.boardController.getAllBoardsController.bind(this.boardController)
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
      this.boardController.createBoardController.bind(this.boardController)
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
      this.boardController.updateBoardController.bind(this.boardController)
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
      this.boardController.removeBoardController.bind(this.boardController)
    )
  }
}

export default async function boardRoutes(fastify: FastifyInstance) {
  const boardRoutes = new BoardRoutes()
  await boardRoutes.registerRoutes(fastify)
}
