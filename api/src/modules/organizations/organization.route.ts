import { FastifyInstance } from "fastify";
import { OrganizationController } from "./organization.controller";
import { OrganizationSchema } from "./organization.schema";

const organizationController = new OrganizationController();

export default async function organizationRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/:id",
    {
      schema: {
        params: { type: "object", properties: { id: { type: "string" } } },
        response: { 200: OrganizationSchema.OrganizationResponseSchema },
        tags: ["organization"],
        description: "Get an organization",
      },
    },
    organizationController.getOrganizationController.bind(organizationController)
  );

  fastify.get(
    "/all",
    {
      schema: {
        response: {
          200: {
            type: "array",
            items: OrganizationSchema.OrganizationResponseSchema,
          },
        },
        tags: ["organization"],
        description: "Get all organizations",
      },
    },
    organizationController.getAllOrganizationController.bind(organizationController)
  );

  fastify.post(
    "/",
    {
      schema: {
        body: OrganizationSchema.BaseOrganizationSchema,
        response: {
          200: OrganizationSchema.OrganizationResponseSchema,
        },
        tags: ["organization"],
        description: "Create a new organization",
      },
    },

    organizationController.createOrganizationController.bind(organizationController)
  );

  fastify.put(
    "/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
        },
        body: OrganizationSchema.UpdateOrganizationSchema,
        response: {
          200: OrganizationSchema.OrganizationResponseSchema,
        },
        tags: ["organization"],
        description: "Update an organization",
      },
    },
    organizationController.updateOrganizationController.bind(organizationController)
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: OrganizationSchema.DeleteOrganizationSchema,
        response: {
          204: OrganizationSchema.DeleteOrganizationSchema,
        },
        tags: ["organization"],
        description: "Delete an organization",
      },
    },
    organizationController.removeOrganizationController.bind(organizationController)
  );
}
