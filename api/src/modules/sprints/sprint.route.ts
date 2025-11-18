import { FastifyInstance } from "fastify";
import { SprintController } from "./sprint.controller";
import { SprintService } from "./sprint.service";
import {
  CreateSprintSchema,
  UpdateSprintSchema,
  AddCardsToSprintSchema,
  RemoveCardsFromSprintSchema,
  SprintParamsSchema,
  BoardSprintsParamsSchema,
  SprintSchema,
  SprintWithStatsSchema,
  SprintCardSchema,
} from "./sprint.schema";
import { Type } from "@sinclair/typebox";
import {
  requireBoardAccess,
  requireSprintAccess,
  requireBulkCardAccess
} from "../../middleware/authorization.middleware";

export default async function sprintRoutes(fastify: FastifyInstance) {
  const service = new SprintService(fastify.knex);
  const controller = new SprintController(service);

  // Create sprint
  fastify.post(
    "/",
    {
      preHandler: [requireBoardAccess],
      schema: {
        description: "Create a new sprint",
        tags: ["Sprints"],
        body: CreateSprintSchema,
        response: {
          201: SprintSchema,
        },
      },
    },
    controller.createSprint.bind(controller)
  );

  // Get sprint
  fastify.get(
    "/:id",
    {
      preHandler: [requireSprintAccess],
      schema: {
        description: "Get a sprint with stats",
        tags: ["Sprints"],
        params: SprintParamsSchema,
        response: {
          200: SprintWithStatsSchema,
        },
      },
    },
    controller.getSprint.bind(controller)
  );

  // Get board sprints
  fastify.get(
    "/board/:boardId",
    {
      preHandler: [requireBoardAccess],
      schema: {
        description: "Get all sprints for a board",
        tags: ["Sprints"],
        params: BoardSprintsParamsSchema,
        response: {
          200: { type: "array", items: SprintSchema },
        },
      },
    },
    controller.getBoardSprints.bind(controller)
  );

  // Get active sprint
  fastify.get(
    "/board/:boardId/active",
    {
      preHandler: [requireBoardAccess],
      schema: {
        description: "Get active sprint for a board",
        tags: ["Sprints"],
        params: BoardSprintsParamsSchema,
        response: {
          200: SprintSchema,
        },
      },
    },
    controller.getActiveSprint.bind(controller)
  );

  // Update sprint
  fastify.patch(
    "/:id",
    {
      preHandler: [requireSprintAccess],
      schema: {
        description: "Update a sprint",
        tags: ["Sprints"],
        params: SprintParamsSchema,
        body: UpdateSprintSchema,
        response: {
          200: SprintSchema,
        },
      },
    },
    controller.updateSprint.bind(controller)
  );

  // Delete sprint
  fastify.delete(
    "/:id",
    {
      preHandler: [requireSprintAccess],
      schema: {
        description: "Delete a sprint",
        tags: ["Sprints"],
        params: SprintParamsSchema,
        response: {
          204: Type.Object({}),
        },
      },
    },
    controller.deleteSprint.bind(controller)
  );

  // Get sprint cards
  fastify.get(
    "/:id/cards",
    {
      preHandler: [requireSprintAccess],
      schema: {
        description: "Get cards in a sprint",
        tags: ["Sprints"],
        params: SprintParamsSchema,
        response: {
          200: { type: "array", items: SprintCardSchema },
        },
      },
    },
    controller.getSprintCards.bind(controller)
  );

  // Add cards to sprint
  fastify.post(
    "/:id/cards",
    {
      preHandler: [requireSprintAccess, requireBulkCardAccess],
      schema: {
        description: "Add cards to a sprint",
        tags: ["Sprints"],
        params: SprintParamsSchema,
        body: AddCardsToSprintSchema,
        response: {
          200: Type.Object({ message: Type.String() }),
        },
      },
    },
    controller.addCardsToSprint.bind(controller)
  );

  // Remove cards from sprint
  fastify.post(
    "/cards/remove",
    {
      preHandler: [requireBulkCardAccess],
      schema: {
        description: "Remove cards from sprint",
        tags: ["Sprints"],
        body: RemoveCardsFromSprintSchema,
        response: {
          200: Type.Object({ message: Type.String() }),
        },
      },
    },
    controller.removeCardsFromSprint.bind(controller)
  );

  // Start sprint
  fastify.post(
    "/:id/start",
    {
      preHandler: [requireSprintAccess],
      schema: {
        description: "Start a sprint",
        tags: ["Sprints"],
        params: SprintParamsSchema,
        response: {
          200: SprintSchema,
        },
      },
    },
    controller.startSprint.bind(controller)
  );

  // Complete sprint
  fastify.post(
    "/:id/complete",
    {
      preHandler: [requireSprintAccess],
      schema: {
        description: "Complete a sprint",
        tags: ["Sprints"],
        params: SprintParamsSchema,
        response: {
          200: SprintSchema,
        },
      },
    },
    controller.completeSprint.bind(controller)
  );
}
