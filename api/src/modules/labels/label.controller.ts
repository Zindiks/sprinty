import { FastifyReply, FastifyRequest } from "fastify";
import {
  CreateLabel,
  UpdateLabel,
  DeleteLabel,
  AddLabelToCard,
  RemoveLabelFromCard,
} from "./label.schema";
import { LabelService } from "./label.service";

export class LabelController {
  private readonly labelService: LabelService;

  constructor() {
    this.labelService = new LabelService();
  }

  // Label CRUD controllers
  public async createLabelController(
    request: FastifyRequest<{
      Body: CreateLabel;
    }>,
    reply: FastifyReply,
  ) {
    const body = request.body;

    try {
      const label = await this.labelService.createLabel(body);
      return reply.status(201).send(label);
    } catch (err: any) {
      if (err.message?.includes("already exists")) {
        return reply.status(409).send({ message: err.message });
      }
      return reply.status(500).send(err);
    }
  }

  public async updateLabelController(
    request: FastifyRequest<{
      Body: UpdateLabel;
    }>,
    reply: FastifyReply,
  ) {
    const body = request.body;

    try {
      const label = await this.labelService.updateLabel(body);
      if (!label) {
        return reply.status(404).send({ message: "Label not found" });
      }
      return reply.status(200).send(label);
    } catch (err: any) {
      if (err.message?.includes("already exists")) {
        return reply.status(409).send({ message: err.message });
      }
      return reply.status(500).send(err);
    }
  }

  public async deleteLabelController(
    request: FastifyRequest<{
      Params: DeleteLabel;
    }>,
    reply: FastifyReply,
  ) {
    const params = request.params;

    try {
      const deleted = await this.labelService.deleteLabel(params);
      if (!deleted) {
        return reply.status(404).send({ message: "Label not found" });
      }
      return reply.status(200).send({ message: "Label deleted" });
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async getLabelController(
    request: FastifyRequest<{
      Params: { id: string; board_id: string };
    }>,
    reply: FastifyReply,
  ) {
    const { id, board_id } = request.params;

    try {
      const label = await this.labelService.getLabelById(id, board_id);
      if (!label) {
        return reply.status(404).send({ message: "Label not found" });
      }
      return reply.status(200).send(label);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async getLabelsByBoardIdController(
    request: FastifyRequest<{
      Params: { board_id: string };
    }>,
    reply: FastifyReply,
  ) {
    const { board_id } = request.params;

    try {
      const labels = await this.labelService.getLabelsByBoardId(board_id);
      return reply.status(200).send(labels);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async getLabelsWithCardsCountController(
    request: FastifyRequest<{
      Params: { board_id: string };
    }>,
    reply: FastifyReply,
  ) {
    const { board_id } = request.params;

    try {
      const labels = await this.labelService.getLabelsWithCardsCount(board_id);
      return reply.status(200).send(labels);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  // Card-Label association controllers
  public async addLabelToCardController(
    request: FastifyRequest<{
      Body: AddLabelToCard;
    }>,
    reply: FastifyReply,
  ) {
    const body = request.body;

    try {
      const cardLabel = await this.labelService.addLabelToCard(body);
      return reply.status(201).send(cardLabel);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async removeLabelFromCardController(
    request: FastifyRequest<{
      Params: RemoveLabelFromCard;
    }>,
    reply: FastifyReply,
  ) {
    const params = request.params;

    try {
      const removed = await this.labelService.removeLabelFromCard(params);
      if (!removed) {
        return reply.status(404).send({ message: "Label not found on card" });
      }
      return reply.status(200).send({ message: "Label removed from card" });
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async getLabelsByCardIdController(
    request: FastifyRequest<{
      Params: { card_id: string };
    }>,
    reply: FastifyReply,
  ) {
    const { card_id } = request.params;

    try {
      const labels = await this.labelService.getLabelsByCardId(card_id);
      return reply.status(200).send(labels);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async getCardsByLabelIdController(
    request: FastifyRequest<{
      Params: { label_id: string };
    }>,
    reply: FastifyReply,
  ) {
    const { label_id } = request.params;

    try {
      const cardIds = await this.labelService.getCardIdsByLabelId(label_id);
      return reply.status(200).send({ card_ids: cardIds });
    } catch (err) {
      return reply.status(500).send(err);
    }
  }
}
