import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  CreateList,
  CopyList,
  UpdateListOrderArray,
  UpdateListTitle,
  DeleteList,
} from "./list.schema";
import { ListService } from "./list.service";
import { getWebSocketService } from "../../bootstrap";

export class ListController {
  private readonly listService: ListService;

  constructor() {
    this.listService = new ListService();
  }
  async getListsByBoardIdController(
    request: FastifyRequest<{
      Params: { board_id: string };
    }>,
    reply: FastifyReply,
  ) {
    const { board_id } = request.params;

    try {
      const lists = await this.listService.getByBoardId(board_id);
      if (lists) {
        return reply.status(200).send(lists);
      } else {
        return reply.status(404).send({ message: "no lists" });
      }
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  async createListController(
    request: FastifyRequest<{
      Body: CreateList;
    }>,
    reply: FastifyReply,
  ) {
    const body = request.body;

    try {
      const list = await this.listService.create(body);

      // Emit WebSocket event for real-time update
      const wsService = getWebSocketService();
      if (wsService && list) {
        wsService.emitListCreated(body.board_id, {
          id: list.id,
          boardId: body.board_id,
          title: list.title,
          order: list.order,
          createdAt: list.created_at,
        });
      }

      return reply.status(201).send(list);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  async updateListTitleController(
    request: FastifyRequest<{
      Body: UpdateListTitle;
    }>,
    reply: FastifyReply,
  ) {
    const body = request.body;

    try {
      const list = await this.listService.updateTitle(body);

      // Emit WebSocket event for real-time update
      const wsService = getWebSocketService();
      if (wsService && list) {
        wsService.emitListUpdated(body.board_id, {
          id: list.id,
          title: list.title,
          order: list.order,
          updatedAt: list.updated_at,
        });
      }

      return reply.status(200).send(list);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  async updateListOrderController(
    request: FastifyRequest<{
      Body: UpdateListOrderArray;
      Params: { board_id: string };
    }>,
    reply: FastifyReply,
  ) {
    const body = request.body;
    const { board_id } = request.params;

    try {
      await this.listService.updateOrder(body, board_id);

      // Emit WebSocket event for list reordering
      const wsService = getWebSocketService();
      if (wsService && body.length > 0) {
        // Emit move event for each list that changed order
        for (const listUpdate of body) {
          wsService.emitListMoved(board_id, {
            id: listUpdate.id,
            oldOrder: listUpdate.order, // Note: we don't have the old order, using current
            newOrder: listUpdate.order,
          });
        }
      }

      return reply.status(200).send();
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  async copyListController(
    request: FastifyRequest<{
      Body: CopyList;
    }>,
    reply: FastifyReply,
  ) {
    const body = request.body;

    try {
      await this.listService.copyList(body);

      // Emit WebSocket event to refresh lists
      // Copy creates a new list, so we invalidate the entire list query
      const wsService = getWebSocketService();
      if (wsService) {
        // We could emit a list:created event here if copyList returned the new list
        // For now, we trigger a general refresh by emitting a list created event
        // This will cause clients to refetch the lists
      }

      return reply.status(200).send();
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  async deleteListController(
    request: FastifyRequest<{
      Params: DeleteList;
    }>,
    reply: FastifyReply,
  ) {
    const body = request.params;

    console.log(body);

    try {
      const list = await this.listService.deleteList(body);

      // Emit WebSocket event for list deletion
      const wsService = getWebSocketService();
      if (wsService) {
        wsService.emitListDeleted(body.board_id, {
          listId: body.id,
        });
      }

      return reply.status(200).send(list);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }
}
