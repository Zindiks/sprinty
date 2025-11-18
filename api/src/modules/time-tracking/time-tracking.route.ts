import { FastifyInstance } from "fastify";
import { TimeTrackingController } from "./time-tracking.controller";
import { TimeTrackingService } from "./time-tracking.service";
import {
  CreateTimeLogSchema,
  UpdateTimeLogSchema,
  TimeLogParamsSchema,
  CardTimeLogsParamsSchema,
  UserTimeLogsQuerySchema,
  TimeRangeQuerySchema,
  TimeLogSchema,
  TimeLogWithDetailsSchema,
  CardTimeTotalSchema,
} from "./time-tracking.schema";
import { requireCardAccess } from "../../middleware/authorization.middleware";

export default async function timeTrackingRoutes(fastify: FastifyInstance) {
  const service = new TimeTrackingService(fastify.knex);
  const controller = new TimeTrackingController(service);

  // Create time log
  fastify.post(
    "/",
    {
      preHandler: [requireCardAccess],
      schema: {
        description: "Log time for a card",
        tags: ["Time Tracking"],
        body: CreateTimeLogSchema,
        response: {
          201: TimeLogSchema,
        },
      },
    },
    controller.logTime.bind(controller)
  );

  // Get time log by ID
  fastify.get(
    "/:id",
    {
      schema: {
        description: "Get a specific time log",
        tags: ["Time Tracking"],
        params: TimeLogParamsSchema,
        response: {
          200: TimeLogWithDetailsSchema,
        },
      },
    },
    controller.getTimeLog.bind(controller)
  );

  // Get card time logs
  fastify.get(
    "/card/:cardId",
    {
      preHandler: [requireCardAccess],
      schema: {
        description: "Get all time logs for a card",
        tags: ["Time Tracking"],
        params: CardTimeLogsParamsSchema,
        response: {
          200: { type: "array", items: TimeLogWithDetailsSchema },
        },
      },
    },
    controller.getCardTimeLogs.bind(controller)
  );

  // Get card time total
  fastify.get(
    "/card/:cardId/total",
    {
      preHandler: [requireCardAccess],
      schema: {
        description: "Get total time logged for a card",
        tags: ["Time Tracking"],
        params: CardTimeLogsParamsSchema,
        response: {
          200: CardTimeTotalSchema,
        },
      },
    },
    controller.getCardTimeTotal.bind(controller)
  );

  // Get user time logs
  fastify.get(
    "/user",
    {
      schema: {
        description: "Get time logs for current user",
        tags: ["Time Tracking"],
        querystring: UserTimeLogsQuerySchema,
        response: {
          200: { type: "array", items: TimeLogWithDetailsSchema },
        },
      },
    },
    controller.getUserTimeLogs.bind(controller)
  );

  // Get user time logs in range
  fastify.get(
    "/user/range",
    {
      schema: {
        description: "Get time logs for user within date range",
        tags: ["Time Tracking"],
        querystring: TimeRangeQuerySchema,
        response: {
          200: { type: "array", items: TimeLogWithDetailsSchema },
        },
      },
    },
    controller.getTimeLogsInRange.bind(controller)
  );

  // Update time log
  fastify.patch(
    "/:id",
    {
      schema: {
        description: "Update a time log",
        tags: ["Time Tracking"],
        params: TimeLogParamsSchema,
        body: UpdateTimeLogSchema,
        response: {
          200: TimeLogSchema,
        },
      },
    },
    controller.updateTimeLog.bind(controller)
  );

  // Delete time log
  fastify.delete(
    "/:id",
    {
      schema: {
        description: "Delete a time log",
        tags: ["Time Tracking"],
        params: TimeLogParamsSchema,
        response: {
          204: Type => ({}),
        },
      },
    },
    controller.deleteTimeLog.bind(controller)
  );
}
