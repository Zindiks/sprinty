import { FastifyInstance } from "fastify";
import { AnalyticsController } from "./analytics.controller";
import { AnalyticsService } from "./analytics.service";
import {
  PersonalDashboardQuerySchema,
  BoardAnalyticsParamsSchema,
  SprintBurndownParamsSchema,
  PersonalDashboardResponseSchema,
  BoardAnalyticsResponseSchema,
  SprintBurndownResponseSchema,
  VelocityResponseSchema,
  AssignedTaskSchema,
} from "./analytics.schema";

export default async function analyticsRoutes(fastify: FastifyInstance) {
  const service = new AnalyticsService(fastify.knex);
  const controller = new AnalyticsController(service);

  // Get personal dashboard
  fastify.get(
    "/dashboard/personal",
    {
      schema: {
        description: "Get personal dashboard with stats and assigned tasks",
        tags: ["Analytics"],
        querystring: PersonalDashboardQuerySchema,
        response: {
          200: PersonalDashboardResponseSchema,
        },
      },
    },
    controller.getPersonalDashboard.bind(controller)
  );

  // Get board analytics
  fastify.get(
    "/board/:boardId",
    {
      schema: {
        description: "Get comprehensive board analytics",
        tags: ["Analytics"],
        params: BoardAnalyticsParamsSchema,
        response: {
          200: BoardAnalyticsResponseSchema,
        },
      },
    },
    controller.getBoardAnalytics.bind(controller)
  );

  // Get sprint burndown
  fastify.get(
    "/sprint/:sprintId/burndown",
    {
      schema: {
        description: "Get sprint burndown chart data",
        tags: ["Analytics"],
        params: SprintBurndownParamsSchema,
        response: {
          200: SprintBurndownResponseSchema,
        },
      },
    },
    controller.getSprintBurndown.bind(controller)
  );

  // Get board velocity
  fastify.get(
    "/board/:boardId/velocity",
    {
      schema: {
        description: "Get board velocity metrics",
        tags: ["Analytics"],
        params: BoardAnalyticsParamsSchema,
        response: {
          200: VelocityResponseSchema,
        },
      },
    },
    controller.getBoardVelocity.bind(controller)
  );

  // Get assigned tasks
  fastify.get(
    "/tasks/assigned",
    {
      schema: {
        description: "Get user's assigned tasks",
        tags: ["Analytics"],
        querystring: PersonalDashboardQuerySchema,
        response: {
          200: { type: "array", items: AssignedTaskSchema },
        },
      },
    },
    controller.getAssignedTasks.bind(controller)
  );
}
