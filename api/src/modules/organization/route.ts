import { FastifyInstance } from "fastify"
import { createOrganizationController } from "./controller"
import { OrganizationSchema } from "./model"

export default async function organizationRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/",
    {
      schema: {
        body: OrganizationSchema.BaseOrganizationSchema,
        response: {
          201: OrganizationSchema.OrganizationResponseSchema,
        },
        tags: ["organization"],
        description: "Create a new organization",
      },
    },

    createOrganizationController
  )
}
