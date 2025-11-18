import { FastifyInstance } from "fastify";
import { BoardSchema } from "./board.schema";
import { BoardController } from "./board.controller";
import {
  requireBoardAccess,
  requireOrgAccessForBoards,
  requireOrgAdmin,
  requireBoardOrgAdmin
} from "../../middleware/authorization.middleware";

const boardController = new BoardController();

export default async function boardRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/:id",
    {
      preHandler: [requireBoardAccess],
      schema: {
        params: { type: "object", properties: { id: { type: "string" } } },
        response: { 200: BoardSchema.BoardResponseSchema },
        tags: ["board"],
        description: "Get a board",
      },
    },
    boardController.getBoardController.bind(boardController),
  );

  fastify.get(
    "/:organization_id/all",
    {
      preHandler: [requireOrgAccessForBoards],
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
    boardController.getAllBoardsController.bind(boardController),
  );

  fastify.post(
    "/",
    {
      preHandler: [requireOrgAdmin],
      schema: {
        body: BoardSchema.CreateBoardSchema,
        response: {
          200: BoardSchema.BoardResponseSchema,
        },
        tags: ["board"],
        description: "Create a new Board",
      },
    },
    boardController.createBoardController.bind(boardController),
  );

  fastify.put(
    "/:id",
    {
      preHandler: [requireBoardAccess],
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
    boardController.updateBoardController.bind(boardController),
  );

  fastify.delete(
    "/:id",
    {
      preHandler: [requireBoardOrgAdmin],
      schema: {
        params: BoardSchema.DeleteBoardSchema,
        response: { 200: BoardSchema.DeleteBoardSchema },
        tags: ["board"],
        description: "Delete a board",
      },
    },
    boardController.removeBoardController.bind(boardController),
  );
}
