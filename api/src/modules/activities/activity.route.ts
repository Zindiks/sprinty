import { FastifyInstance } from "fastify";
import { ActivityController } from "./activity.controller";
import { ActivitySchema } from "./activity.schema";

export default async function activityRoutes(server: FastifyInstance) {
  const activityController = new ActivityController();

  // Log new activity
  server.post(
    "/",
    {
      schema: {
        description: "Log a new card activity",
        tags: ["activities"],
        body: { $ref: "CreateActivitySchema#" },
        response: {
          201: { $ref: "ActivityResponseSchema#" },
        },
      },
    },
    activityController.logActivity.bind(activityController),
  );

  // Get activity by ID
  server.get(
    "/:id",
    {
      schema: {
        description: "Get activity by ID with user details",
        tags: ["activities"],
        params: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
          },
          required: ["id"],
        },
        response: {
          200: { $ref: "ActivityWithUserResponseSchema#" },
        },
      },
    },
    activityController.getActivity.bind(activityController),
  );

  // Get all activities for a card
  server.get(
    "/card/:card_id",
    {
      schema: {
        description: "Get all activities for a card with filtering and pagination",
        tags: ["activities"],
        params: {
          type: "object",
          properties: {
            card_id: { type: "string", format: "uuid" },
          },
          required: ["card_id"],
        },
        querystring: { $ref: "ActivityQueryParamsSchema#" },
        response: {
          200: { $ref: "ActivityListResponseSchema#" },
        },
      },
    },
    activityController.getActivitiesByCardId.bind(activityController),
  );

  // Get all activities by a user
  server.get(
    "/user/:user_id",
    {
      schema: {
        description: "Get all activities by a user with filtering and pagination",
        tags: ["activities"],
        params: {
          type: "object",
          properties: {
            user_id: { type: "string", format: "uuid" },
          },
          required: ["user_id"],
        },
        querystring: { $ref: "ActivityQueryParamsSchema#" },
        response: {
          200: { $ref: "ActivityListResponseSchema#" },
        },
      },
    },
    activityController.getActivitiesByUserId.bind(activityController),
  );

  // Get activities with filters
  server.get(
    "/",
    {
      schema: {
        description: "Get activities with filtering and pagination",
        tags: ["activities"],
        querystring: { $ref: "ActivityQueryParamsSchema#" },
        response: {
          200: { $ref: "ActivityListResponseSchema#" },
        },
      },
    },
    activityController.getActivities.bind(activityController),
  );

  // Get activity statistics for a card
  server.get(
    "/card/:card_id/stats",
    {
      schema: {
        description: "Get activity statistics for a card",
        tags: ["activities"],
        params: {
          type: "object",
          properties: {
            card_id: { type: "string", format: "uuid" },
          },
          required: ["card_id"],
        },
        response: {
          200: { $ref: "ActivityStatsResponseSchema#" },
        },
      },
    },
    activityController.getActivityStats.bind(activityController),
  );

  // Delete all activities for a card
  server.delete(
    "/card/:card_id",
    {
      schema: {
        description: "Delete all activities for a card",
        tags: ["activities"],
        params: {
          type: "object",
          properties: {
            card_id: { type: "string", format: "uuid" },
          },
          required: ["card_id"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              deleted: { type: "number" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    activityController.deleteActivitiesByCardId.bind(activityController),
  );
}
