import Fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastifyEnv from "@fastify/env";
import fastifyCors from "@fastify/cors";
import fastifyMetrics from "fastify-metrics";
import swagger from "@fastify/swagger";
import swagger_ui from "@fastify/swagger-ui";

import knexPlugin from "./db/knexPlugin";
import oauthRoutes from "./modules/oauth/oauth.route";
import organizationsRouter from "./modules/organizations/organization.route";
import boardRoutes from "./modules/boards/board.route";
import listRoutes from "./modules/lists/list.route";
import cardRoutes from "./modules/cards/card.route";
import assigneeRoutes from "./modules/assignees/assignee.route";

import { OrganizationSchema } from "./modules/organizations/organization.schema";
import { BoardSchema } from "./modules/boards/board.schema";
import { ListSchema } from "./modules/lists/list.schema";
import { CardSchema } from "./modules/cards/card.schema";
import { AssigneeSchema } from "./modules/assignees/assignee.schema";

import { swaggerDocs } from "./swagger";
import { options } from "./configs/config";

async function registerPlugins(server: FastifyInstance) {
  await server.register(fastifyEnv, options);
  server.register(fastifyCors, {
    origin: `http://${server.config.CLIENT_HOST}:${server.config.CLIENT_PORT}`,
    credentials: true,
  });

  server.log.info(
    `http://${server.config.CLIENT_HOST}:${server.config.CLIENT_PORT}`,
  );

  server.register(swagger, swaggerDocs);
  server.register(swagger_ui, { routePrefix: "/docs" });
  server.register(knexPlugin);
  server.register(fastifyMetrics, { endpoint: "/metrics" });
}

async function addSchemas(server: FastifyInstance) {
  for (const schema of Object.values(OrganizationSchema)) {
    server.addSchema(schema);
  }

  for (const schema of Object.values(BoardSchema)) {
    server.addSchema(schema);
  }

  for (const schema of Object.values(ListSchema)) {
    server.addSchema(schema);
  }

  for (const schema of Object.values(CardSchema)) {
    server.addSchema(schema);
  }

  for (const schema of Object.values(AssigneeSchema)) {
    server.addSchema(schema);
  }
}

async function registerRoutes(server: FastifyInstance) {
  server.register(
    (api) => {
      api.register(
        (v1) => {
          v1.register(oauthRoutes, { prefix: "/oauth" });
          v1.register(organizationsRouter, { prefix: "/organizations" });
          v1.register(boardRoutes, { prefix: "/boards" });
          v1.register(listRoutes, { prefix: "/lists" });
          v1.register(cardRoutes, { prefix: "/cards" });
          v1.register(assigneeRoutes, { prefix: "/assignees" });
        },
        { prefix: "/v1" },
      );
    },
    { prefix: "/api" },
  );

  server.get(
    "/health",
    async (request: FastifyRequest, reply: FastifyReply) => {
      reply.send({ status: "OK" });
    },
  );
}

export async function createServer() {
  const server = Fastify({
    logger: true,
  }).withTypeProvider<TypeBoxTypeProvider>();

  await registerPlugins(server);
  await addSchemas(server);
  await registerRoutes(server);

  return server;
}
