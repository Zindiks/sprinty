import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox"
import fastifyCors from "@fastify/cors"
import knexPlugin from "./db/knexPlugin"
import oauthRoutes from "./modules/oauth/oauth.route"

import swagger from "@fastify/swagger"
import swagger_ui from "@fastify/swagger-ui"

import organizationsRouter from "./modules/organizations/organization.route"
import boardRoutes from "./modules/boards/board.route"
import listRoutes from "./modules/lists/list.route"
import cardRoutes from "./modules/cards/card.route"

import { OrganizationSchema } from "./modules/organizations/organization.schema"
import { BoardSchema } from "./modules/boards/board.schema"
import { ListSchema } from "./modules/lists/list.schema"
import { CardSchema } from "./modules/cards/card.schema"
import { swaggerDocs } from "./swagger"

async function registerPlugins(server: FastifyInstance) {
  server.register(fastifyCors, {
    origin: "http://localhost:5173", // TODO: Change this to the env variable
    credentials: true,
  })

  server.register(swagger, swaggerDocs)
  server.register(swagger_ui, { routePrefix: "/docs" })
  server.register(knexPlugin)

  server.register(oauthRoutes, { prefix: "/api/v1/oauth" })
  server.register(organizationsRouter, { prefix: "/api/v1/organizations" })
  server.register(boardRoutes, { prefix: "/api/v1/boards" })
  server.register(listRoutes, { prefix: "/api/v1/lists" })
  server.register(cardRoutes, { prefix: "/api/v1/cards" })
}

async function addSchemas(server: FastifyInstance) {
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
}

async function registerRoutes(server: FastifyInstance) {
  server.get(
    "/health",
    async (request: FastifyRequest, reply: FastifyReply) => {
      reply.send({ status: "OK" })
    }
  )
}

export async function createServer() {
  const server = Fastify({
    logger: true,
  }).withTypeProvider<TypeBoxTypeProvider>()

  await registerPlugins(server)
  await addSchemas(server)
  await registerRoutes(server)

  return server
}


