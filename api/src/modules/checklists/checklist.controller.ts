import { FastifyReply, FastifyRequest } from "fastify";
import {
  CreateChecklistItem,
  UpdateChecklistItem,
  ToggleChecklistItem,
  DeleteChecklistItem,
} from "./checklist.schema";
import { ChecklistService } from "./checklist.service";

export class ChecklistController {
  private readonly checklistService: ChecklistService;

  constructor() {
    this.checklistService = new ChecklistService();
  }

  public async createChecklistItemController(
    request: FastifyRequest<{
      Body: CreateChecklistItem;
    }>,
    reply: FastifyReply,
  ) {
    const body = request.body;
    // TODO: Get user_id from auth context
    const created_by_id = undefined;

    try {
      const item = await this.checklistService.createChecklistItem(
        body,
        created_by_id,
      );
      return reply.status(201).send(item);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async updateChecklistItemController(
    request: FastifyRequest<{
      Body: UpdateChecklistItem;
    }>,
    reply: FastifyReply,
  ) {
    const body = request.body;

    try {
      const item = await this.checklistService.updateChecklistItem(body);
      if (!item) {
        return reply.status(404).send({ message: "Checklist item not found" });
      }
      return reply.status(200).send(item);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async toggleChecklistItemController(
    request: FastifyRequest<{
      Params: ToggleChecklistItem;
    }>,
    reply: FastifyReply,
  ) {
    const params = request.params;
    // TODO: Get user_id from auth context
    const user_id = undefined;

    try {
      const item = await this.checklistService.toggleChecklistItem(
        params,
        user_id,
      );
      if (!item) {
        return reply.status(404).send({ message: "Checklist item not found" });
      }
      return reply.status(200).send(item);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async deleteChecklistItemController(
    request: FastifyRequest<{
      Params: DeleteChecklistItem;
    }>,
    reply: FastifyReply,
  ) {
    const params = request.params;

    try {
      const deleted = await this.checklistService.deleteChecklistItem(params);
      if (!deleted) {
        return reply.status(404).send({ message: "Checklist item not found" });
      }
      return reply.status(200).send({ message: "Checklist item deleted" });
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async getChecklistItemController(
    request: FastifyRequest<{
      Params: { id: string; card_id: string };
    }>,
    reply: FastifyReply,
  ) {
    const { id, card_id } = request.params;

    try {
      const item = await this.checklistService.getChecklistItemById(
        id,
        card_id,
      );
      if (!item) {
        return reply.status(404).send({ message: "Checklist item not found" });
      }
      return reply.status(200).send(item);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async getChecklistItemsByCardIdController(
    request: FastifyRequest<{
      Params: { card_id: string };
    }>,
    reply: FastifyReply,
  ) {
    const { card_id } = request.params;

    try {
      const items =
        await this.checklistService.getChecklistItemsByCardId(card_id);
      return reply.status(200).send(items);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async getChecklistProgressController(
    request: FastifyRequest<{
      Params: { card_id: string };
    }>,
    reply: FastifyReply,
  ) {
    const { card_id } = request.params;

    try {
      const progress =
        await this.checklistService.getChecklistProgress(card_id);
      return reply.status(200).send(progress);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async getChecklistWithProgressController(
    request: FastifyRequest<{
      Params: { card_id: string };
    }>,
    reply: FastifyReply,
  ) {
    const { card_id } = request.params;

    try {
      const checklist =
        await this.checklistService.getChecklistWithProgress(card_id);
      return reply.status(200).send(checklist);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async reorderChecklistItemsController(
    request: FastifyRequest<{
      Params: { card_id: string };
      Body: { items: Array<{ id: string; order: number }> };
    }>,
    reply: FastifyReply,
  ) {
    const { card_id } = request.params;
    const { items } = request.body;

    try {
      await this.checklistService.reorderChecklistItems(card_id, items);
      return reply.status(200).send({ message: "Checklist items reordered" });
    } catch (err) {
      return reply.status(500).send(err);
    }
  }
}
