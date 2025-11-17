import Fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastifyEnv from "@fastify/env";
import fastifyCors from "@fastify/cors";
import fastifyMetrics from "fastify-metrics";
import fastifyMultipart from "@fastify/multipart";
import swagger from "@fastify/swagger";
import swagger_ui from "@fastify/swagger-ui";

import knexPlugin from "./db/knexPlugin";
import oauthRoutes from "./modules/oauth/oauth.route";
import organizationsRouter from "./modules/organizations/organization.route";
import boardRoutes from "./modules/boards/board.route";
import listRoutes from "./modules/lists/list.route";
import cardRoutes from "./modules/cards/card.route";
import assigneeRoutes from "./modules/assignees/assignee.route";
import labelRoutes from "./modules/labels/label.route";
import profileRoutes from "./modules/profiles/profile.route";
import checklistRoutes from "./modules/checklists/checklist.route";
import commentRoutes from "./modules/comments/comment.route";
import searchRoutes from "./modules/search/search.route";
import analyticsRoutes from "./modules/analytics/analytics.route";
import timeTrackingRoutes from "./modules/time-tracking/time-tracking.route";
import sprintRoutes from "./modules/sprints/sprint.route";
import reportRoutes from "./modules/reports/report.route";
import attachmentRoutes from "./modules/attachments/attachment.route";
import activityRoutes from "./modules/activities/activity.route";
import dashboardLayoutsRoutes from "./modules/dashboard-layouts/dashboard-layouts.route";
import templateRoutes from "./modules/templates/template.route";

import { OrganizationSchema } from "./modules/organizations/organization.schema";
import { TemplateSchema } from "./modules/templates/template.schema";
import { BoardSchema } from "./modules/boards/board.schema";
import { ListSchema } from "./modules/lists/list.schema";
import { CardSchema } from "./modules/cards/card.schema";
import { AssigneeSchema } from "./modules/assignees/assignee.schema";
import { LabelSchema } from "./modules/labels/label.schema";
import { ProfileSchema } from "./modules/profiles/profile.schema";
import { ChecklistSchema } from "./modules/checklists/checklist.schema";
import { CommentSchema } from "./modules/comments/comment.schema";
import { SearchSchema } from "./modules/search/search.schema";
import { AnalyticsSchema } from "./modules/analytics/analytics.schema";
import { TimeTrackingSchemas } from "./modules/time-tracking/time-tracking.schema";
import { SprintSchemas } from "./modules/sprints/sprint.schema";
import { AttachmentSchema } from "./modules/attachments/attachment.schema";
import { ActivitySchema } from "./modules/activities/activity.schema";
import { DashboardLayoutsSchema } from "./modules/dashboard-layouts/dashboard-layouts.schema";

import { swaggerDocs } from "./swagger";
import { options } from "./configs/config";
import { initializeWebSocketServer } from "./modules/websocket/websocket.server";
import { WebSocketService } from "./modules/websocket/websocket.service";

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
  server.register(fastifyMultipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  });
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

  for (const schema of Object.values(ProfileSchema)) {
    server.addSchema(schema);
  }

  for (const schema of Object.values(AssigneeSchema)) {
    server.addSchema(schema);
  }

  for (const schema of Object.values(LabelSchema)) {
    server.addSchema(schema);
  }

  for (const schema of Object.values(ChecklistSchema)) {
    server.addSchema(schema);
  }

  for (const schema of Object.values(CommentSchema)) {
    server.addSchema(schema);
  }

  for (const schema of Object.values(SearchSchema)) {
    server.addSchema(schema);
  }

  for (const schema of Object.values(AnalyticsSchema)) {
    server.addSchema(schema);
  }

  for (const schema of Object.values(TimeTrackingSchemas)) {
    server.addSchema(schema);
  }

  for (const schema of Object.values(SprintSchemas)) {
    server.addSchema(schema);
  }

  for (const schema of Object.values(AttachmentSchema)) {
    server.addSchema(schema);
  }

  for (const schema of Object.values(ActivitySchema)) {
    server.addSchema(schema);
  }

  for (const schema of Object.values(DashboardLayoutsSchema)) {
    server.addSchema(schema);
  }
  for (const schema of Object.values(TemplateSchema)) {
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
          v1.register(labelRoutes, { prefix: "/labels" });
          v1.register(profileRoutes, { prefix: "/profiles" });
          v1.register(checklistRoutes, { prefix: "/checklists" });
          v1.register(commentRoutes, { prefix: "/comments" });
          v1.register(searchRoutes, { prefix: "/search" });
          v1.register(analyticsRoutes, { prefix: "/analytics" });
          v1.register(timeTrackingRoutes, { prefix: "/time-tracking" });
          v1.register(sprintRoutes, { prefix: "/sprints" });
          v1.register(reportRoutes, { prefix: "/reports" });
          v1.register(attachmentRoutes, { prefix: "/attachments" });
          v1.register(activityRoutes, { prefix: "/activities" });
          v1.register(dashboardLayoutsRoutes, { prefix: "/dashboard-layouts" });
          v1.register(templateRoutes, { prefix: "/templates" });
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

// Global WebSocket service instance
let wsServiceInstance: WebSocketService | null = null;

export function getWebSocketService(): WebSocketService | null {
  return wsServiceInstance;
}

export async function createServer() {
  const server = Fastify({
    logger: true,
  }).withTypeProvider<TypeBoxTypeProvider>();

  await registerPlugins(server);
  await addSchemas(server);
  await registerRoutes(server);

  // Initialize WebSocket server after Fastify is ready
  await server.ready();

  // Get the underlying HTTP server
  const httpServer = server.server;

  // Get CORS origin from config
  const corsOrigin = `http://${server.config.CLIENT_HOST}:${server.config.CLIENT_PORT}`;

  // Initialize WebSocket
  const { io, wsService } = initializeWebSocketServer(httpServer, corsOrigin);
  wsServiceInstance = wsService;

  server.log.info("WebSocket server initialized and ready");

  // Decorate Fastify instance with WebSocket service
  server.decorate("wsService", wsService);
  server.decorate("io", io);

  return server;
}
