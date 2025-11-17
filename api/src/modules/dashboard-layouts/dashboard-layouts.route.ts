import { FastifyInstance } from "fastify";
import { DashboardLayoutsController } from "./dashboard-layouts.controller";
import { DashboardLayoutsService } from "./dashboard-layouts.service";
import {
  CreateLayoutBodySchema,
  UpdateLayoutBodySchema,
  LayoutIdParamsSchema,
  GetLayoutsResponseSchema,
  GetLayoutResponseSchema,
  CreateLayoutResponseSchema,
  UpdateLayoutResponseSchema,
  DeleteLayoutResponseSchema,
} from "./dashboard-layouts.schema";

export default async function dashboardLayoutsRoutes(fastify: FastifyInstance) {
  const service = new DashboardLayoutsService(fastify.knex);
  const controller = new DashboardLayoutsController(service);

  // Get all layouts for current user
  fastify.get(
    "/",
    {
      schema: {
        description: "Get all dashboard layouts for the current user",
        tags: ["Dashboard Layouts"],
        response: {
          200: GetLayoutsResponseSchema,
        },
      },
    },
    controller.getUserLayouts.bind(controller)
  );

  // Get default layout
  fastify.get(
    "/default",
    {
      schema: {
        description: "Get the default dashboard layout for the current user",
        tags: ["Dashboard Layouts"],
        response: {
          200: GetLayoutResponseSchema,
        },
      },
    },
    controller.getDefaultLayout.bind(controller)
  );

  // Get layout by ID
  fastify.get(
    "/:layoutId",
    {
      schema: {
        description: "Get a specific dashboard layout by ID",
        tags: ["Dashboard Layouts"],
        params: LayoutIdParamsSchema,
        response: {
          200: GetLayoutResponseSchema,
        },
      },
    },
    controller.getLayoutById.bind(controller)
  );

  // Create new layout
  fastify.post(
    "/",
    {
      schema: {
        description: "Create a new dashboard layout",
        tags: ["Dashboard Layouts"],
        body: CreateLayoutBodySchema,
        response: {
          201: CreateLayoutResponseSchema,
        },
      },
    },
    controller.createLayout.bind(controller)
  );

  // Update layout
  fastify.patch(
    "/:layoutId",
    {
      schema: {
        description: "Update an existing dashboard layout",
        tags: ["Dashboard Layouts"],
        params: LayoutIdParamsSchema,
        body: UpdateLayoutBodySchema,
        response: {
          200: UpdateLayoutResponseSchema,
        },
      },
    },
    controller.updateLayout.bind(controller)
  );

  // Delete layout
  fastify.delete(
    "/:layoutId",
    {
      schema: {
        description: "Delete a dashboard layout",
        tags: ["Dashboard Layouts"],
        params: LayoutIdParamsSchema,
        response: {
          200: DeleteLayoutResponseSchema,
        },
      },
    },
    controller.deleteLayout.bind(controller)
  );
}
