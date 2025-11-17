import { FastifyReply, FastifyRequest } from "fastify";
import {
  CreateCard,
  UpdateCardOrderArray,
  UpdateCardTitle,
  UpdateCardDetails,
  DeleteCard,
} from "./card.schema";
import { CardService } from "./card.service";
import { getWebSocketService } from "../../bootstrap";
import { ListService } from "../lists/list.service";

export class CardController {
  private readonly cardService: CardService;
  private readonly listService: ListService;

  constructor() {
    this.cardService = new CardService();
    this.listService = new ListService();
  }

  public async getCardController(
    request: FastifyRequest<{
      Params: { id: string };
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;

    try {
      const card = await this.cardService.getCardById(id);
      return reply.status(200).send(card);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async getCardWithAssigneesController(
    request: FastifyRequest<{
      Params: { id: string };
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;

    try {
      const card = await this.cardService.getCardWithAssignees(id);
      if (!card) {
        return reply.status(404).send({ message: "Card not found" });
      }
      return reply.status(200).send(card);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async getCardWithDetailsController(
    request: FastifyRequest<{
      Params: { id: string };
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;

    try {
      const card = await this.cardService.getCardWithDetails(id);
      if (!card) {
        return reply.status(404).send({ message: "Card not found" });
      }
      return reply.status(200).send(card);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async getCardsByListIdController(
    request: FastifyRequest<{
      Params: { list_id: string };
    }>,
    reply: FastifyReply,
  ) {
    const { list_id } = request.params;

    try {
      const cards = await this.cardService.getCardsByListId(list_id);
      return reply.status(200).send(cards);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async createCardController(
    request: FastifyRequest<{
      Body: CreateCard;
    }>,
    reply: FastifyReply,
  ) {
    const body = request.body;

    try {
      const card = await this.cardService.create(body);

      // Emit WebSocket event for real-time update
      const wsService = getWebSocketService();
      if (wsService && card) {
        // Get the list to find board_id
        const list = await this.listService.getListById(card.list_id);
        if (list && list.board_id) {
          wsService.emitCardCreated(list.board_id, {
            id: card.id,
            listId: card.list_id,
            title: card.title,
            description: card.description || undefined,
            order: card.order,
            createdAt: card.created_at,
          });
        }
      }

      return reply.status(201).send(card);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async updateCardTitleController(
    request: FastifyRequest<{
      Body: UpdateCardTitle;
    }>,
    reply: FastifyReply,
  ) {
    const body = request.body;

    try {
      const card = await this.cardService.updateTitle(body);

      // Emit WebSocket event for real-time update
      const wsService = getWebSocketService();
      if (wsService && card) {
        const list = await this.listService.getListById(card.list_id);
        if (list && list.board_id) {
          wsService.emitCardUpdated(list.board_id, {
            id: card.id,
            title: card.title,
            description: card.description || undefined,
            updatedAt: card.updated_at,
          });
        }
      }

      return reply.status(200).send(card);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async updateCardDetailsController(
    request: FastifyRequest<{
      Body: UpdateCardDetails;
    }>,
    reply: FastifyReply,
  ) {
    const body = request.body;

    try {
      const card = await this.cardService.updateDetails(body);
      return reply.status(200).send(card);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async updateCardOrderController(
    request: FastifyRequest<{
      Body: UpdateCardOrderArray;
    }>,
    reply: FastifyReply,
  ) {
    const body = request.body;

    try {
      await this.cardService.updateOrder(body);

      // Emit WebSocket event for card reordering/movement
      const wsService = getWebSocketService();
      if (wsService && body.length > 0) {
        // Get board_id from the first card's list
        const list = await this.listService.getListById(body[0].list_id);
        if (list && list.board_id) {
          // Emit a batch update event for all cards that moved
          for (const cardUpdate of body) {
            wsService.emitCardMoved(list.board_id, {
              cardId: cardUpdate.id,
              sourceListId: cardUpdate.list_id,
              destinationListId: cardUpdate.list_id,
              sourceIndex: cardUpdate.order,
              destinationIndex: cardUpdate.order,
              newOrder: cardUpdate.order,
            });
          }
        }
      }

      return reply.status(200).send();
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async deleteCardController(
    request: FastifyRequest<{
      Params: DeleteCard;
    }>,
    reply: FastifyReply,
  ) {
    const body = request.params;

    try {
      // Get board_id before deletion
      const wsService = getWebSocketService();
      let boardId: string | undefined;

      if (wsService) {
        const list = await this.listService.getListById(body.list_id);
        if (list) {
          boardId = list.board_id;
        }
      }

      await this.cardService.deleteCard(body);

      // Emit WebSocket event for card deletion
      if (wsService && boardId) {
        wsService.emitCardDeleted(boardId, {
          cardId: body.id,
          listId: body.list_id,
        });
      }

      return reply.status(200).send();
    } catch (err) {
      return reply.status(500).send(err);
    }
  }
}
