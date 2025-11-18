import { FastifyReply, FastifyRequest } from "fastify";
import { OrganizationService } from "./organization.service";
import { CreateOrganization, UpdateOrganization } from "./organization.schema";

export class OrganizationController {
  private readonly organizationService: OrganizationService;

  constructor() {
    this.organizationService = new OrganizationService();
  }

  public async getOrganizationController(
    request: FastifyRequest<{
      Params: { id: string };
    }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    try {
      const result = await this.organizationService.getById(id);
      return reply.status(200).send(result);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async getAllOrganizationController(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await this.organizationService.getAll();
      return reply.status(200).send(result);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async createOrganizationController(
    request: FastifyRequest<{
      Body: CreateOrganization;
    }>,
    reply: FastifyReply
  ) {
    const body = request.body;

    try {
      const board = await this.organizationService.create(body);
      return reply.status(201).send(board);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async updateOrganizationController(
    request: FastifyRequest<{
      Body: UpdateOrganization;
      Params: { id: string };
    }>,
    reply: FastifyReply
  ) {
    const body = request.body;
    const { id } = request.params;

    try {
      const result = await this.organizationService.update(body, id);
      return reply.status(200).send(result);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async removeOrganizationController(
    request: FastifyRequest<{
      Params: { id: string };
    }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    try {
      const result = await this.organizationService.deleteOrganization(id);
      return reply.status(200).send(result);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }
}
