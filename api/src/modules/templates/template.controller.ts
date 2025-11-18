import { FastifyReply, FastifyRequest } from "fastify";
import {
  CreateTemplate,
  UpdateTemplate,
  CreateBoardFromTemplate,
  CreateTemplateFromBoard,
} from "./template.schema";
import { TemplateService } from "./template.service";
import { getWebSocketService } from "../../bootstrap";

export class TemplateController {
  private readonly templateService: TemplateService;

  constructor() {
    this.templateService = new TemplateService();
  }

  public async getTemplateController(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    try {
      const result = await this.templateService.getById(id);
      return reply.status(200).send(result);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async getAllTemplatesController(
    request: FastifyRequest<{ Querystring: { organization_id?: string } }>,
    reply: FastifyReply
  ) {
    const { organization_id } = request.query;
    try {
      const result = await this.templateService.getAll(organization_id);
      return reply.status(200).send(result);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async createTemplateController(
    request: FastifyRequest<{ Body: CreateTemplate }>,
    reply: FastifyReply
  ) {
    const body = request.body;
    try {
      const template = await this.templateService.create(body);
      return reply.status(201).send(template);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async updateTemplateController(
    request: FastifyRequest<{
      Body: UpdateTemplate;
      Params: { id: string };
      Querystring: { organization_id: string };
    }>,
    reply: FastifyReply
  ) {
    const body = request.body;
    const { id } = request.params;
    const { organization_id } = request.query;

    try {
      const result = await this.templateService.update(body, id, organization_id);
      return reply.status(200).send(result);
    } catch (err: any) {
      if (err.message?.includes("Unauthorized")) {
        return reply.status(403).send({ error: err.message });
      }
      return reply.status(500).send(err);
    }
  }

  public async deleteTemplateController(
    request: FastifyRequest<{
      Params: { id: string };
      Querystring: { organization_id: string };
    }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const { organization_id } = request.query;

    try {
      const result = await this.templateService.deleteTemplate(id, organization_id);
      return reply.status(200).send(result);
    } catch (err: any) {
      if (err.message?.includes("Unauthorized")) {
        return reply.status(403).send({ error: err.message });
      }
      return reply.status(500).send(err);
    }
  }

  public async createBoardFromTemplateController(
    request: FastifyRequest<{ Body: CreateBoardFromTemplate }>,
    reply: FastifyReply
  ) {
    const body = request.body;
    try {
      const board = await this.templateService.createBoardFromTemplate(body);

      // TODO: Emit WebSocket event for board creation
      // const wsService = getWebSocketService();
      // if (wsService && board) {
      //   wsService.emitBoardUpdated(board.id, {
      //     id: board.id,
      //     title: board.title,
      //     description: board.description,
      //     updatedAt: board.updated_at,
      //   });
      // }

      return reply.status(201).send(board);
    } catch (err: any) {
      if (err.message?.includes("not found")) {
        return reply.status(404).send({ error: err.message });
      }
      return reply.status(500).send(err);
    }
  }

  public async createTemplateFromBoardController(
    request: FastifyRequest<{ Body: CreateTemplateFromBoard }>,
    reply: FastifyReply
  ) {
    const body = request.body;
    // TODO: Add user authentication middleware to populate request.user
    const userId = (request as any).user?.id;

    if (!userId) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    try {
      const template = await this.templateService.createTemplateFromBoard(body, userId);
      return reply.status(201).send(template);
    } catch (err: any) {
      if (err.message?.includes("not found")) {
        return reply.status(404).send({ error: err.message });
      }
      return reply.status(500).send(err);
    }
  }
}
