import { FastifyReply, FastifyRequest } from "fastify";
import {
  BulkService,
  BulkMoveCardsInput,
  BulkAssignUsersInput,
  BulkAddLabelsInput,
  BulkSetDueDateInput,
  BulkArchiveCardsInput,
  BulkDeleteCardsInput,
} from "./bulk.service";
import { getWebSocketService } from "../../bootstrap";

export class BulkController {
  private readonly bulkService: BulkService;

  constructor() {
    this.bulkService = new BulkService();
  }

  /**
   * POST /cards/bulk/move
   * Move multiple cards to a target list
   */
  public async bulkMoveCards(
    request: FastifyRequest<{
      Body: BulkMoveCardsInput;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { card_ids, target_list_id } = request.body;

      if (!card_ids || card_ids.length === 0) {
        return reply.status(400).send({ message: "card_ids is required" });
      }

      if (!target_list_id) {
        return reply.status(400).send({ message: "target_list_id is required" });
      }

      const result = await this.bulkService.moveCards(request.body);

      // TODO: Broadcast WebSocket event
      // Requires board_id to be added to input schema
      // const wsService = getWebSocketService();
      // if (wsService && result.board_id) {
      //   wsService.emitBoardUpdated(result.board_id, {
      //     id: result.board_id,
      //     updatedAt: new Date().toISOString(),
      //   });
      // }

      return reply.status(200).send(result);
    } catch (err) {
      console.error("Bulk move cards error:", err);
      return reply.status(500).send({ message: "Internal server error" });
    }
  }

  /**
   * POST /cards/bulk/assign
   * Assign users to multiple cards
   */
  public async bulkAssignUsers(
    request: FastifyRequest<{
      Body: BulkAssignUsersInput;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { card_ids, user_ids } = request.body;

      if (!card_ids || card_ids.length === 0) {
        return reply.status(400).send({ message: "card_ids is required" });
      }

      if (!user_ids || user_ids.length === 0) {
        return reply.status(400).send({ message: "user_ids is required" });
      }

      const result = await this.bulkService.assignUsers(request.body);

      // TODO: Broadcast WebSocket event
      // const wsService = getWebSocketService();
      // if (wsService && result.board_id) {
      //   wsService.emitBoardUpdated(result.board_id, {
      //     id: result.board_id,
      //     updatedAt: new Date().toISOString(),
      //   });
      // }

      return reply.status(200).send(result);
    } catch (err) {
      console.error("Bulk assign users error:", err);
      return reply.status(500).send({ message: "Internal server error" });
    }
  }

  /**
   * POST /cards/bulk/labels
   * Add labels to multiple cards
   */
  public async bulkAddLabels(
    request: FastifyRequest<{
      Body: BulkAddLabelsInput;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { card_ids, label_ids } = request.body;

      if (!card_ids || card_ids.length === 0) {
        return reply.status(400).send({ message: "card_ids is required" });
      }

      if (!label_ids || label_ids.length === 0) {
        return reply.status(400).send({ message: "label_ids is required" });
      }

      const result = await this.bulkService.addLabels(request.body);

      // TODO: Broadcast WebSocket event
      // const wsService = getWebSocketService();
      // if (wsService && result.board_id) {
      //   wsService.emitBoardUpdated(result.board_id, {
      //     id: result.board_id,
      //     updatedAt: new Date().toISOString(),
      //   });
      // }

      return reply.status(200).send(result);
    } catch (err) {
      console.error("Bulk add labels error:", err);
      return reply.status(500).send({ message: "Internal server error" });
    }
  }

  /**
   * POST /cards/bulk/due-date
   * Set due date on multiple cards
   */
  public async bulkSetDueDate(
    request: FastifyRequest<{
      Body: BulkSetDueDateInput;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { card_ids, due_date } = request.body;

      if (!card_ids || card_ids.length === 0) {
        return reply.status(400).send({ message: "card_ids is required" });
      }

      const result = await this.bulkService.setDueDate(request.body);

      // TODO: Broadcast WebSocket event
      // const wsService = getWebSocketService();
      // if (wsService && result.board_id) {
      //   wsService.emitBoardUpdated(result.board_id, {
      //     id: result.board_id,
      //     updatedAt: new Date().toISOString(),
      //   });
      // }

      return reply.status(200).send(result);
    } catch (err) {
      console.error("Bulk set due date error:", err);
      return reply.status(500).send({ message: "Internal server error" });
    }
  }

  /**
   * POST /cards/bulk/archive
   * Archive multiple cards
   */
  public async bulkArchiveCards(
    request: FastifyRequest<{
      Body: BulkArchiveCardsInput;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { card_ids } = request.body;

      if (!card_ids || card_ids.length === 0) {
        return reply.status(400).send({ message: "card_ids is required" });
      }

      const result = await this.bulkService.archiveCards(request.body);

      // TODO: Broadcast WebSocket event
      // const wsService = getWebSocketService();
      // if (wsService && result.board_id) {
      //   wsService.emitBoardUpdated(result.board_id, {
      //     id: result.board_id,
      //     updatedAt: new Date().toISOString(),
      //   });
      // }

      return reply.status(200).send(result);
    } catch (err) {
      console.error("Bulk archive cards error:", err);
      return reply.status(500).send({ message: "Internal server error" });
    }
  }

  /**
   * DELETE /cards/bulk
   * Delete multiple cards
   */
  public async bulkDeleteCards(
    request: FastifyRequest<{
      Body: BulkDeleteCardsInput;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { card_ids } = request.body;

      if (!card_ids || card_ids.length === 0) {
        return reply.status(400).send({ message: "card_ids is required" });
      }

      const result = await this.bulkService.deleteCards(request.body);

      // TODO: Broadcast WebSocket event
      // const wsService = getWebSocketService();
      // if (wsService && result.board_id) {
      //   wsService.emitBoardUpdated(result.board_id, {
      //     id: result.board_id,
      //     updatedAt: new Date().toISOString(),
      //   });
      // }

      return reply.status(200).send(result);
    } catch (err) {
      console.error("Bulk delete cards error:", err);
      return reply.status(500).send({ message: "Internal server error" });
    }
  }
}
