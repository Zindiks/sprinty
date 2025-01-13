import Fastify from "fastify"
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox"
import fastifyCors from "@fastify/cors"
import knexPlugin from "./db/knexPlugin"
import oauthRoutes from "./modules/oauth/route"

import organizationsRouter from "./modules/organization/route"
import { OrganizationSchema } from "./modules/organization/model"

export async function createServer() {
  const server = Fastify({
    logger: true,
  }).withTypeProvider<TypeBoxTypeProvider>()

  server.register(fastifyCors, {
    origin: "http://localhost:5173",
    credentials: true,
  })



  for (const schema of Object.values(OrganizationSchema)) {
    server.addSchema(schema)
  }

  server.register(import("@fastify/swagger"), {
    openapi: {
      info: {
        title: "API Documentation",
        description: "API for managing borders, lists and cards",
        version: "1.0.0",
      },
      servers: [
        {
          url: "http://localhost:4000 ",
        },
      ],
      components: {},
      security: [],
    },
  })

  server.register(import("@fastify/swagger-ui"), {
    routePrefix: "/docs",
  })

  server.register(knexPlugin)
  server.register(oauthRoutes, { prefix: "/api/v1/oauth" })
  server.register(organizationsRouter, { prefix: "/api/v1/organizations" })

  server.get("/health", async (request, reply) => {
    reply.send({ status: "OK" })
  })

  return server
}
