import { FastifyReply, FastifyRequest } from "fastify";
import { ReportService } from "./report.service";

interface BoardReportParams {
  boardId: string;
}

interface SprintReportParams {
  sprintId: string;
}

interface TimeTrackingReportQuery {
  boardId: string;
  startDate?: string;
  endDate?: string;
}

interface UserActivityReportQuery {
  organizationId: string;
  startDate?: string;
  endDate?: string;
}

export class ReportController {
  constructor(private service: ReportService) {}

  /**
   * GET /api/v1/reports/board/:boardId
   * Generate board report (CSV)
   */
  async generateBoardReport(
    request: FastifyRequest<{
      Params: BoardReportParams;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { boardId } = request.params;
      const csv = await this.service.generateBoardReport(boardId);

      reply
        .header("Content-Type", "text/csv")
        .header("Content-Disposition", `attachment; filename="board-${boardId}.csv"`)
        .send(csv);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  /**
   * GET /api/v1/reports/time-tracking
   * Generate time tracking report (CSV)
   */
  async generateTimeTrackingReport(
    request: FastifyRequest<{
      Querystring: TimeTrackingReportQuery;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { boardId, startDate, endDate } = request.query;
      const csv = await this.service.generateTimeTrackingReport(
        boardId,
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined
      );

      reply
        .header("Content-Type", "text/csv")
        .header("Content-Disposition", `attachment; filename="time-tracking-${boardId}.csv"`)
        .send(csv);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  /**
   * GET /api/v1/reports/sprint/:sprintId
   * Generate sprint report (CSV)
   */
  async generateSprintReport(
    request: FastifyRequest<{
      Params: SprintReportParams;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { sprintId } = request.params;
      const csv = await this.service.generateSprintReport(sprintId);

      reply
        .header("Content-Type", "text/csv")
        .header("Content-Disposition", `attachment; filename="sprint-${sprintId}.csv"`)
        .send(csv);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  /**
   * GET /api/v1/reports/user/activity
   * Generate user activity report (CSV)
   */
  async generateUserActivityReport(
    request: FastifyRequest<{
      Querystring: UserActivityReportQuery;
    }>,
    reply: FastifyReply
  ) {
    try {
      // @ts-ignore - user is added by auth middleware
      const userId = request.user?.id;

      if (!userId) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      const { organizationId, startDate, endDate } = request.query;
      const csv = await this.service.generateUserActivityReport(
        userId,
        organizationId,
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined
      );

      reply
        .header("Content-Type", "text/csv")
        .header("Content-Disposition", `attachment; filename="user-activity-${userId}.csv"`)
        .send(csv);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  /**
   * GET /api/v1/reports/board/:boardId/calendar
   * Generate board calendar export (.ics)
   */
  async generateBoardCalendar(
    request: FastifyRequest<{
      Params: BoardReportParams;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { boardId } = request.params;
      const ical = await this.service.generateBoardCalendar(boardId);

      reply
        .header("Content-Type", "text/calendar; charset=utf-8")
        .header("Content-Disposition", `attachment; filename="board-${boardId}-calendar.ics"`)
        .send(ical);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }
}
