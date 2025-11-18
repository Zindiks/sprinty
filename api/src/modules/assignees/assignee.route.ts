import { FastifyInstance } from "fastify";
import { AssigneeController } from "./assignee.controller";
import { AssigneeSchema } from "./assignee.schema";
import { requireCardAccess, requireSelfOrOrgMember } from "../../middleware/authorization.middleware";
import { requireAuth } from "../../middleware/auth.middleware";

const assigneeController = new AssigneeController();

export default async function assigneeRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/",
    {
      preHandler: [requireCardAccess],
      schema: {
        body: AssigneeSchema.AddAssigneeSchema,
        response: {
          201: AssigneeSchema.AssigneeResponseSchema,
        },
        tags: ["assignee"],
        description: "Add assignee to a card",
      },
    },
    assigneeController.addAssigneeController.bind(assigneeController),
  );

  fastify.delete(
    "/:card_id/user/:user_id",
    {
      preHandler: [requireCardAccess],
      schema: {
        params: AssigneeSchema.RemoveAssigneeSchema,
        response: {
          200: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
        tags: ["assignee"],
        description: "Remove assignee from a card",
      },
    },
    assigneeController.removeAssigneeController.bind(assigneeController),
  );

  fastify.get(
    "/card/:card_id",
    {
      preHandler: [requireCardAccess],
      schema: {
        params: {
          type: "object",
          properties: {
            card_id: { type: "string", format: "uuid" },
          },
        },
        response: {
          200: AssigneeSchema.AssigneeWithUserDetailsSchemaArray,
        },
        tags: ["assignee"],
        description: "Get all assignees for a card with user details",
      },
    },
    assigneeController.getAssigneesByCardIdController.bind(assigneeController),
  );

  fastify.get(
    "/check/:card_id/user/:user_id",
    {
      preHandler: [requireCardAccess],
      schema: {
        params: {
          type: "object",
          properties: {
            card_id: { type: "string", format: "uuid" },
            user_id: { type: "string", format: "uuid" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              is_assigned: { type: "boolean" },
            },
          },
        },
        tags: ["assignee"],
        description: "Check if a user is assigned to a card",
      },
    },
    assigneeController.checkUserAssignedController.bind(assigneeController),
  );

  fastify.get(
    "/user/:user_id/cards",
    {
      preHandler: [requireAuth, requireSelfOrOrgMember],
      schema: {
        params: {
          type: "object",
          properties: {
            user_id: { type: "string", format: "uuid" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              card_ids: {
                type: "array",
                items: { type: "string", format: "uuid" },
              },
            },
          },
        },
        tags: ["assignee"],
        description: "Get all card IDs assigned to a user",
      },
    },
    assigneeController.getCardsByUserIdController.bind(assigneeController),
  );
}
