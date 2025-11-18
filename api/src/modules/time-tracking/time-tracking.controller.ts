import { FastifyReply, FastifyRequest } from "fastify";
import { TimeTrackingService } from "./time-tracking.service";
import {
  CreateTimeLog,
  UpdateTimeLog,
  TimeLogParams,
  CardTimeLogsParams,
  UserTimeLogsQuery,
  TimeRangeQuery,
} from "./time-tracking.schema";

export class TimeTrackingController {
  constructor(private service: TimeTrackingService) {}

  /**
   * POST /api/v1/time-tracking
   * Log time for a card
   */
  async logTime(
    request: FastifyRequest<{
      Body: CreateTimeLog;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const userId = request.user?.id;

      if (!userId) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      const timeLog = await this.service.logTime({
        ...request.body,
        userId,
        loggedAt: request.body.loggedAt
          ? new Date(request.body.loggedAt)
          : undefined,
      });

      return reply.code(201).send(timeLog);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  /**
   * GET /api/v1/time-tracking/:id
   * Get a specific time log
   */
  async getTimeLog(
    request: FastifyRequest<{
      Params: TimeLogParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { id } = request.params;
      const timeLog = await this.service.getTimeLog(id);

      if (!timeLog) {
        return reply.code(404).send({ error: "Time log not found" });
      }

      return reply.code(200).send(timeLog);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  /**
   * GET /api/v1/time-tracking/card/:cardId
   * Get all time logs for a card
   */
  async getCardTimeLogs(
    request: FastifyRequest<{
      Params: CardTimeLogsParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { cardId } = request.params;
      const timeLogs = await this.service.getCardTimeLogs(cardId);
      return reply.code(200).send(timeLogs);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  /**
   * GET /api/v1/time-tracking/card/:cardId/total
   * Get total time logged for a card
   */
  async getCardTimeTotal(
    request: FastifyRequest<{
      Params: CardTimeLogsParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { cardId } = request.params;
      const total = await this.service.getCardTimeTotal(cardId);
      return reply.code(200).send(total);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  /**
   * GET /api/v1/time-tracking/user
   * Get time logs for current user
   */
  async getUserTimeLogs(
    request: FastifyRequest<{
      Querystring: UserTimeLogsQuery;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const userId = request.user?.id;

      if (!userId) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      const { organizationId } = request.query;
      const timeLogs = await this.service.getUserTimeLogs(
        userId,
        organizationId,
      );
      return reply.code(200).send(timeLogs);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  /**
   * GET /api/v1/time-tracking/user/range
   * Get time logs for user within date range
   */
  async getTimeLogsInRange(
    request: FastifyRequest<{
      Querystring: TimeRangeQuery;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const userId = request.user?.id;

      if (!userId) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      const { startDate, endDate, organizationId } = request.query;
      const timeLogs = await this.service.getTimeLogsInDateRange(
        userId,
        new Date(startDate),
        new Date(endDate),
        organizationId,
      );
      return reply.code(200).send(timeLogs);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  /**
   * PATCH /api/v1/time-tracking/:id
   * Update a time log
   */
  async updateTimeLog(
    request: FastifyRequest<{
      Params: TimeLogParams;
      Body: UpdateTimeLog;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { id } = request.params;
      const timeLog = await this.service.updateTimeLog({
        id,
        ...request.body,
      });

      if (!timeLog) {
        return reply.code(404).send({ error: "Time log not found" });
      }

      return reply.code(200).send(timeLog);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  /**
   * DELETE /api/v1/time-tracking/:id
   * Delete a time log
   */
  async deleteTimeLog(
    request: FastifyRequest<{
      Params: TimeLogParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { id } = request.params;
      await this.service.deleteTimeLog(id);
      return reply.code(204).send();
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }
}
