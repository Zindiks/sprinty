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
  DueDateAnalyticsResponseSchema,
} from "./analytics.schema";
import {
  requireBoardAccess,
  requireSprintAccess,
  requireOrgMember
} from "../../middleware/authorization.middleware";

export default async function analyticsRoutes(fastify: FastifyInstance) {
  const service = new AnalyticsService(fastify.knex);
  const controller = new AnalyticsController(service);

  // Get personal dashboard (user-scoped, no additional auth needed)
  fastify.get(
    "/dashboard/personal",
    {
      preHandler: [requireOrgMember],
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

  // Get board analytics (requires board access)
  fastify.get(
    "/board/:boardId",
    {
      preHandler: [requireBoardAccess],
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

  // Get sprint burndown (requires sprint access)
  fastify.get(
    "/sprint/:sprintId/burndown",
    {
      preHandler: [requireSprintAccess],
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

  // Get board velocity (requires board access)
  fastify.get(
    "/board/:boardId/velocity",
    {
      preHandler: [requireBoardAccess],
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

  // Get assigned tasks (user-scoped)
  fastify.get(
    "/tasks/assigned",
    {
      preHandler: [requireOrgMember],
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

  // Get due date analytics (requires board access)
  fastify.get(
    "/board/:boardId/due-dates",
    {
      preHandler: [requireBoardAccess],
      schema: {
        description: "Get due date analytics for a board",
        tags: ["Analytics"],
        params: BoardAnalyticsParamsSchema,
        response: {
          200: DueDateAnalyticsResponseSchema,
        },
      },
    },
    controller.getDueDateAnalytics.bind(controller)
  );

  // Get productivity trends (user-scoped)
  fastify.get(
    "/trends/personal",
    {
      preHandler: [requireOrgMember],
      schema: {
        description: "Get productivity trends (cards created vs completed over time)",
        tags: ["Analytics"],
        querystring: {
          type: "object",
          required: ["organizationId"],
          properties: {
            organizationId: { type: "string" },
            period: { type: "string", enum: ["weekly", "monthly"] },
            daysBack: { type: "number" },
          },
        },
      },
    },
    controller.getProductivityTrends.bind(controller)
  );

  // Get boards overview (user-scoped)
  fastify.get(
    "/boards/overview",
    {
      preHandler: [requireOrgMember],
      schema: {
        description: "Get overview of all boards user is working on",
        tags: ["Analytics"],
        querystring: PersonalDashboardQuerySchema,
      },
    },
    controller.getBoardsOverview.bind(controller)
  );

  // Get weekly metrics (user-scoped)
  fastify.get(
    "/metrics/weekly",
    {
      preHandler: [requireOrgMember],
      schema: {
        description: "Get weekly metrics for a user",
        tags: ["Analytics"],
        querystring: {
          type: "object",
          required: ["organizationId"],
          properties: {
            organizationId: { type: "string" },
            weeksBack: { type: "number" },
          },
        },
      },
    },
    controller.getWeeklyMetrics.bind(controller)
  );

  // Get monthly metrics (user-scoped)
  fastify.get(
    "/metrics/monthly",
    {
      preHandler: [requireOrgMember],
      schema: {
        description: "Get monthly metrics for a user",
        tags: ["Analytics"],
        querystring: {
          type: "object",
          required: ["organizationId"],
          properties: {
            organizationId: { type: "string" },
            monthsBack: { type: "number" },
          },
        },
      },
    },
    controller.getMonthlyMetrics.bind(controller)
  );
}
