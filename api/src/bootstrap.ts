import Fastify, { FastifyInstance } from "fastify"
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox"
import fastifyCors from "@fastify/cors"
import knexPlugin from "./db/knexPlugin"
import oauthRoutes from "./modules/oauth/route"

import swagger from "@fastify/swagger"
import swagger_ui from "@fastify/swagger-ui"

import organizationsRouter from "./modules/organizations/organization.route"
import boardRoutes from "./modules/boards/board.route"
import listRoutes from "./modules/lists/list.route"
import cardRoutes from "./modules/cards/card.route"

import { OrganizationSchema } from "./modules/organizations/organization.schema"
import { BoardSchema } from "./modules/boards/board.schema"
import { ListSchema } from "./modules/lists/list.model"
import { CardSchema } from "./modules/cards/card.schema"
import { swaggerDocs } from "./swagger"

class Server {
  private server: FastifyInstance

  constructor() {
    this.server = Fastify({
      logger: true,
    }).withTypeProvider<TypeBoxTypeProvider>()
  }

  private async registerPlugins() {
    this.server.register(fastifyCors, {
      origin: "http://localhost:5173", // TODO: Change this to the env variable
      credentials: true,
    })

    this.server.register(swagger, swaggerDocs)

    this.server.register(swagger_ui, { routePrefix: "/docs" })

    this.server.register(knexPlugin)
    this.server.register(oauthRoutes, { prefix: "/api/v1/oauth" })
    this.server.register(organizationsRouter, {
      prefix: "/api/v1/organizations",
    })
    this.server.register(boardRoutes, { prefix: "/api/v1/boards" })
    this.server.register(listRoutes, { prefix: "/api/v1/lists" })
    this.server.register(cardRoutes, { prefix: "/api/v1/cards" })
  }

  private async addSchemas() {
    for (const schema of Object.values(OrganizationSchema)) {
      this.server.addSchema(schema)
    }

    for (const schema of Object.values(BoardSchema)) {
      this.server.addSchema(schema)
    }

    for (const schema of Object.values(ListSchema)) {
      this.server.addSchema(schema)
    }

    for (const schema of Object.values(CardSchema)) {
      this.server.addSchema(schema)
    }
  }

  private async registerRoutes() {
    this.server.get("/health", async (request, reply) => {
      reply.send({ status: "OK" })
    })
  }

  public async createServer() {
    await this.registerPlugins()
    await this.addSchemas()
    await this.registerRoutes()
    return this.server
  }
}

export async function createServer() {
  const server = new Server()
  return server.createServer()
}
