import { FastifyReply, FastifyRequest } from "fastify";
import { DashboardLayoutsService } from "./dashboard-layouts.service";
import {
  CreateLayoutBody,
  UpdateLayoutBody,
  LayoutIdParams,
} from "./dashboard-layouts.schema";

export class DashboardLayoutsController {
  constructor(private service: DashboardLayoutsService) {}

  /**
   * GET /api/v1/dashboard-layouts
   * Get all dashboard layouts for the current user
   */
  async getUserLayouts(request: FastifyRequest, reply: FastifyReply) {
    try {
      // @ts-ignore - user is added by auth middleware
      const userId = request.user?.id;

      if (!userId) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      const layouts = await this.service.getUserLayouts(userId);
      return reply.code(200).send(layouts);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  /**
   * GET /api/v1/dashboard-layouts/default
   * Get the default dashboard layout for the current user
   */
  async getDefaultLayout(request: FastifyRequest, reply: FastifyReply) {
    try {
      // @ts-ignore - user is added by auth middleware
      const userId = request.user?.id;

      if (!userId) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      const layout = await this.service.getDefaultLayout(userId);

      if (!layout) {
        return reply.code(404).send({ error: "No default layout found" });
      }

      return reply.code(200).send(layout);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  /**
   * GET /api/v1/dashboard-layouts/:layoutId
   * Get a specific dashboard layout by ID
   */
  async getLayoutById(
    request: FastifyRequest<{
      Params: LayoutIdParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { layoutId } = request.params;
      // @ts-ignore - user is added by auth middleware
      const userId = request.user?.id;

      if (!userId) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      const layout = await this.service.getLayoutById(layoutId, userId);

      if (!layout) {
        return reply.code(404).send({ error: "Layout not found" });
      }

      return reply.code(200).send(layout);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  /**
   * POST /api/v1/dashboard-layouts
   * Create a new dashboard layout
   */
  async createLayout(
    request: FastifyRequest<{
      Body: CreateLayoutBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      // @ts-ignore - user is added by auth middleware
      const userId = request.user?.id;

      if (!userId) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      const layout = await this.service.createLayout({
        user_id: userId,
        ...request.body,
      });

      return reply.code(201).send(layout);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  /**
   * PATCH /api/v1/dashboard-layouts/:layoutId
   * Update an existing dashboard layout
   */
  async updateLayout(
    request: FastifyRequest<{
      Params: LayoutIdParams;
      Body: UpdateLayoutBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { layoutId } = request.params;
      // @ts-ignore - user is added by auth middleware
      const userId = request.user?.id;

      if (!userId) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      // Check if layout exists and belongs to user
      const exists = await this.service.layoutExists(layoutId, userId);
      if (!exists) {
        return reply.code(404).send({ error: "Layout not found" });
      }

      const layout = await this.service.updateLayout(
        layoutId,
        userId,
        request.body,
      );

      return reply.code(200).send(layout);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  /**
   * DELETE /api/v1/dashboard-layouts/:layoutId
   * Delete a dashboard layout
   */
  async deleteLayout(
    request: FastifyRequest<{
      Params: LayoutIdParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { layoutId } = request.params;
      // @ts-ignore - user is added by auth middleware
      const userId = request.user?.id;

      if (!userId) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      const deleted = await this.service.deleteLayout(layoutId, userId);

      if (!deleted) {
        return reply.code(404).send({ error: "Layout not found" });
      }

      return reply.code(200).send({
        success: true,
        message: "Layout deleted successfully",
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }
}
