import { FastifyInstance } from "fastify"
import {
  createOrganizationController,
  getAllOrganizationController,
  getOrganizationController,
  removeOrganizationController,
  updateOrganizationController,
} from "./controller"
import { OrganizationSchema } from "./model"

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
    getOrganizationController
  )

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
    getAllOrganizationController
  )

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

    createOrganizationController
  )

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
    updateOrganizationController
  )

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
    removeOrganizationController
  )
}
