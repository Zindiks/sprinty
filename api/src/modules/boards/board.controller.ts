import { FastifyReply, FastifyRequest } from "fastify";
import { CreateBoard, UpdateBoard } from "./board.schema";
import { BoardService } from "./board.service";
import { getWebSocketService } from "../../bootstrap";

export class BoardController {
  private readonly boardService: BoardService;

  constructor() {
    this.boardService = new BoardService();
  }

  public async getBoardController(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    try {
      const result = await this.boardService.getById(id);
      return reply.status(200).send(result);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async getAllBoardsController(
    request: FastifyRequest<{ Params: { organization_id: string } }>,
    reply: FastifyReply
  ) {
    const { organization_id } = request.params;
    try {
      const result = await this.boardService.getAll(organization_id);
      return reply.status(200).send(result);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async createBoardController(
    request: FastifyRequest<{ Body: CreateBoard }>,
    reply: FastifyReply
  ) {
    const body = request.body;
    try {
      const board = await this.boardService.create(body);
      return reply.status(201).send(board);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async updateBoardController(
    request: FastifyRequest<{ Body: UpdateBoard; Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const body = request.body;
    const { id } = request.params;
    try {
      const result = await this.boardService.update(body, id);

      // Emit WebSocket event for board update
      const wsService = getWebSocketService();
      if (wsService && result) {
        wsService.emitBoardUpdated(id, {
          id: result.id,
          title: result.title,
          description: result.description,
          updatedAt: result.updated_at,
        });
      }

      return reply.status(200).send(result);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async removeBoardController(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    try {
      const result = await this.boardService.deleteBoard(id);

      // Emit WebSocket event for board deletion
      const wsService = getWebSocketService();
      if (wsService) {
        wsService.emitBoardDeleted(id, {
          boardId: id,
        });

        // Disconnect all users from the deleted board
        await wsService.disconnectAllFromBoard(id);
      }

      return reply.status(200).send(result);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }
}
