import { FastifyReply, FastifyRequest } from "fastify";
import { AddAssignee, RemoveAssignee } from "./assignee.schema";
import { AssigneeService } from "./assignee.service";

export class AssigneeController {
  private readonly assigneeService: AssigneeService;

  constructor() {
    this.assigneeService = new AssigneeService();
  }

  public async addAssigneeController(
    request: FastifyRequest<{
      Body: AddAssignee;
    }>,
    reply: FastifyReply
  ) {
    const body = request.body;
    // TODO: Get assigned_by from authenticated user
    const assigned_by_id = undefined; // Will be set from auth context

    try {
      const assignee = await this.assigneeService.addAssignee(body, assigned_by_id);
      return reply.status(201).send(assignee);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async removeAssigneeController(
    request: FastifyRequest<{
      Params: RemoveAssignee;
    }>,
    reply: FastifyReply
  ) {
    const params = request.params;

    try {
      const removed = await this.assigneeService.removeAssignee(params);
      if (!removed) {
        return reply.status(404).send({ message: "Assignee not found" });
      }
      return reply.status(200).send({ message: "Assignee removed" });
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async getAssigneesByCardIdController(
    request: FastifyRequest<{
      Params: { card_id: string };
    }>,
    reply: FastifyReply
  ) {
    const { card_id } = request.params;

    try {
      const assignees = await this.assigneeService.getAssigneesWithUserDetails(card_id);
      return reply.status(200).send(assignees);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async checkUserAssignedController(
    request: FastifyRequest<{
      Params: { card_id: string; user_id: string };
    }>,
    reply: FastifyReply
  ) {
    const { card_id, user_id } = request.params;

    try {
      const isAssigned = await this.assigneeService.isUserAssigned(card_id, user_id);
      return reply.status(200).send({ is_assigned: isAssigned });
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async getCardsByUserIdController(
    request: FastifyRequest<{
      Params: { user_id: string };
    }>,
    reply: FastifyReply
  ) {
    const { user_id } = request.params;

    try {
      const cardIds = await this.assigneeService.getCardIdsByUserId(user_id);
      return reply.status(200).send({ card_ids: cardIds });
    } catch (err) {
      return reply.status(500).send(err);
    }
  }
}
