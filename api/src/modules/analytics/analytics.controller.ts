import { FastifyReply, FastifyRequest } from "fastify";
import { AnalyticsService } from "./analytics.service";
import {
  PersonalDashboardQuery,
  BoardAnalyticsParams,
  SprintBurndownParams,
} from "./analytics.schema";

export class AnalyticsController {
  constructor(private service: AnalyticsService) {}

  /**
   * GET /api/v1/analytics/dashboard/personal
   * Get personal dashboard data
   */
  async getPersonalDashboard(
    request: FastifyRequest<{
      Querystring: PersonalDashboardQuery;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { organizationId } = request.query;
      // @ts-ignore - user is added by auth middleware
      const userId = request.user?.id;

      if (!userId) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      const dashboard = await this.service.getPersonalDashboard(
        userId,
        organizationId
      );
      return reply.code(200).send(dashboard);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  /**
   * GET /api/v1/analytics/board/:boardId
   * Get board analytics
   */
  async getBoardAnalytics(
    request: FastifyRequest<{
      Params: BoardAnalyticsParams;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { boardId } = request.params;
      const analytics = await this.service.getBoardAnalytics(boardId);
      return reply.code(200).send(analytics);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  /**
   * GET /api/v1/analytics/sprint/:sprintId/burndown
   * Get sprint burndown chart data
   */
  async getSprintBurndown(
    request: FastifyRequest<{
      Params: SprintBurndownParams;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { sprintId } = request.params;
      const burndown = await this.service.getSprintBurndown(sprintId);

      if (!burndown) {
        return reply.code(404).send({ error: "Sprint not found" });
      }

      return reply.code(200).send(burndown);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  /**
   * GET /api/v1/analytics/board/:boardId/velocity
   * Get board velocity metrics
   */
  async getBoardVelocity(
    request: FastifyRequest<{
      Params: BoardAnalyticsParams;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { boardId } = request.params;
      const velocity = await this.service.getBoardVelocity(boardId);
      return reply.code(200).send(velocity);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  /**
   * GET /api/v1/analytics/tasks/assigned
   * Get user's assigned tasks
   */
  async getAssignedTasks(
    request: FastifyRequest<{
      Querystring: PersonalDashboardQuery;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { organizationId } = request.query;
      // @ts-ignore - user is added by auth middleware
      const userId = request.user?.id;

      if (!userId) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      const tasks = await this.service.getUserAssignedTasks(
        userId,
        organizationId
      );
      return reply.code(200).send(tasks);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  /**
   * GET /api/v1/analytics/board/:boardId/due-dates
   * Get due date analytics for a board
   */
  async getDueDateAnalytics(
    request: FastifyRequest<{
      Params: BoardAnalyticsParams;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { boardId } = request.params;
      const analytics = await this.service.getDueDateAnalytics(boardId);
      return reply.code(200).send(analytics);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }
}
