import { FastifyInstance } from "fastify";
import { ReportController } from "./report.controller";
import { ReportService } from "./report.service";
import { Type } from "@sinclair/typebox";

export default async function reportRoutes(fastify: FastifyInstance) {
  const service = new ReportService(fastify.knex);
  const controller = new ReportController(service);

  // Board report
  fastify.get(
    "/board/:boardId",
    {
      schema: {
        description: "Generate board report (CSV)",
        tags: ["Reports"],
        params: Type.Object({
          boardId: Type.String({ format: "uuid" }),
        }),
      },
    },
    controller.generateBoardReport.bind(controller),
  );

  // Time tracking report
  fastify.get(
    "/time-tracking",
    {
      schema: {
        description: "Generate time tracking report (CSV)",
        tags: ["Reports"],
        querystring: Type.Object({
          boardId: Type.String({ format: "uuid" }),
          startDate: Type.Optional(Type.String({ format: "date-time" })),
          endDate: Type.Optional(Type.String({ format: "date-time" })),
        }),
      },
    },
    controller.generateTimeTrackingReport.bind(controller),
  );

  // Sprint report
  fastify.get(
    "/sprint/:sprintId",
    {
      schema: {
        description: "Generate sprint report (CSV)",
        tags: ["Reports"],
        params: Type.Object({
          sprintId: Type.String({ format: "uuid" }),
        }),
      },
    },
    controller.generateSprintReport.bind(controller),
  );

  // User activity report
  fastify.get(
    "/user/activity",
    {
      schema: {
        description: "Generate user activity report (CSV)",
        tags: ["Reports"],
        querystring: Type.Object({
          organizationId: Type.String({ format: "uuid" }),
          startDate: Type.Optional(Type.String({ format: "date-time" })),
          endDate: Type.Optional(Type.String({ format: "date-time" })),
        }),
      },
    },
    controller.generateUserActivityReport.bind(controller),
  );

  // Board calendar export
  fastify.get(
    "/board/:boardId/calendar",
    {
      schema: {
        description: "Generate board calendar export (iCalendar .ics format)",
        tags: ["Reports"],
        params: Type.Object({
          boardId: Type.String({ format: "uuid" }),
        }),
      },
    },
    controller.generateBoardCalendar.bind(controller),
  );
}
