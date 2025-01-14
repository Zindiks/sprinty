import Fastify from "fastify"
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox"
import fastifyCors from "@fastify/cors"
import knexPlugin from "./db/knexPlugin"
import oauthRoutes from "./modules/oauth/route"

import organizationsRouter from "./modules/organizations/route"
import boardRoutes from "./modules/boards/route"
import listRoutes from "./modules/lists/route"
import cardRoutes from "./modules/cards/route"

import { OrganizationSchema } from "./modules/organizations/model"
import { BoardSchema } from "./modules/boards/model"
import { ListSchema } from "./modules/lists/model"
import { CardSchema } from "./modules/cards/model"

export async function createServer() {
  const server = Fastify({
    logger: true,
  }).withTypeProvider<TypeBoxTypeProvider>()

  server.register(fastifyCors, {
    origin: "http://localhost:5173", // TODO: Change this to the env variable
    credentials: true,
  })

  for (const schema of Object.values(OrganizationSchema)) {
    server.addSchema(schema)
  }

  for (const schema of Object.values(BoardSchema)) {
    server.addSchema(schema)
  }

  for (const schema of Object.values(ListSchema)) {
    server.addSchema(schema)
  }

  for (const schema of Object.values(CardSchema)) {
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
          url: "http://localhost:4000 ", // TODO: Change this to the env variable
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
  server.register(boardRoutes, { prefix: "/api/v1/boards" })
  server.register(listRoutes, { prefix: "/api/v1/lists" })
  server.register(cardRoutes, { prefix: "/api/v1/cards" })

  server.get("/health", async (request, reply) => {
    reply.send({ status: "OK" })
  })

  return server
}
