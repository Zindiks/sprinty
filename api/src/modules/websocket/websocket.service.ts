import { Server } from "socket.io";
import {
  AuthenticatedSocket,
  BoardPresencePayload,
  PresenceUser,
  WebSocketEvent,
  WebSocketEventPayload,
  getRoomName,
  BoardUpdatedPayload,
  BoardDeletedPayload,
  ListCreatedPayload,
  ListUpdatedPayload,
  ListMovedPayload,
  ListDeletedPayload,
  CardCreatedPayload,
  CardUpdatedPayload,
  CardMovedPayload,
  CardDeletedPayload,
} from "./websocket.types";

/**
 * WebSocket Service
 * Handles real-time communication, room management, and presence tracking
 */
export class WebSocketService {
  private io: Server;
  private boardPresence: Map<string, Map<string, PresenceUser>>;

  constructor(io: Server) {
    this.io = io;
    this.boardPresence = new Map();
  }

  /**
   * Join a board room
   */
  async joinBoard(
    socket: AuthenticatedSocket,
    boardId: string,
    userId: string,
    userEmail: string,
  ): Promise<void> {
    const roomName = getRoomName(boardId);

    // Join the Socket.io room
    await socket.join(roomName);

    // Update socket data
    socket.currentBoardId = boardId;

    // Track presence
    this.addUserPresence(boardId, userId, userEmail);

    // Broadcast updated presence to all users in the board
    this.emitPresenceUpdate(boardId);

    socket.emit("message", {
      type: "info",
      message: `Joined board ${boardId}`,
    });
  }

  /**
   * Leave a board room
   */
  async leaveBoard(
    socket: AuthenticatedSocket,
    boardId: string,
    userId: string,
  ): Promise<void> {
    const roomName = getRoomName(boardId);

    // Leave the Socket.io room
    await socket.leave(roomName);

    // Remove from presence
    this.removeUserPresence(boardId, userId);

    // Broadcast updated presence
    this.emitPresenceUpdate(boardId);

    // Clear socket data
    socket.currentBoardId = undefined;

    socket.emit("message", {
      type: "info",
      message: `Left board ${boardId}`,
    });
  }

  /**
   * Handle user disconnect
   */
  handleDisconnect(socket: AuthenticatedSocket): void {
    const { userId, currentBoardId } = socket;

    if (userId && currentBoardId) {
      this.removeUserPresence(currentBoardId, userId);
      this.emitPresenceUpdate(currentBoardId);
    }
  }

  /**
   * Add user to board presence
   */
  private addUserPresence(
    boardId: string,
    userId: string,
    userEmail: string,
  ): void {
    if (!this.boardPresence.has(boardId)) {
      this.boardPresence.set(boardId, new Map());
    }

    const boardUsers = this.boardPresence.get(boardId)!;
    boardUsers.set(userId, {
      id: userId,
      email: userEmail,
      joinedAt: Date.now(),
    });
  }

  /**
   * Remove user from board presence
   */
  private removeUserPresence(boardId: string, userId: string): void {
    const boardUsers = this.boardPresence.get(boardId);
    if (boardUsers) {
      boardUsers.delete(userId);

      // Clean up empty board presence maps
      if (boardUsers.size === 0) {
        this.boardPresence.delete(boardId);
      }
    }
  }

  /**
   * Get users currently viewing a board
   */
  getBoardPresence(boardId: string): PresenceUser[] {
    const boardUsers = this.boardPresence.get(boardId);
    return boardUsers ? Array.from(boardUsers.values()) : [];
  }

  /**
   * Emit presence update to all users in a board
   */
  private emitPresenceUpdate(boardId: string): void {
    const users = this.getBoardPresence(boardId);
    const payload: BoardPresencePayload = {
      users,
      count: users.length,
    };

    this.emitToBoard(boardId, WebSocketEvent.BOARD_PRESENCE, payload);
  }

  /**
   * Emit event to all users in a board room
   */
  emitToBoard<T>(
    boardId: string,
    event: WebSocketEvent,
    data: T,
    excludeSocketId?: string,
  ): void {
    const roomName = getRoomName(boardId);
    const payload: WebSocketEventPayload<T> = {
      event,
      boardId,
      userId: "", // Will be set by the caller if needed
      timestamp: Date.now(),
      data,
    };

    if (excludeSocketId) {
      this.io.to(roomName).except(excludeSocketId).emit(event, payload);
    } else {
      this.io.to(roomName).emit(event, payload);
    }
  }

  /**
   * Board event emitters
   */
  emitBoardUpdated(boardId: string, data: BoardUpdatedPayload): void {
    this.emitToBoard(boardId, WebSocketEvent.BOARD_UPDATED, data);
  }

  emitBoardDeleted(boardId: string, data: BoardDeletedPayload): void {
    this.emitToBoard(boardId, WebSocketEvent.BOARD_DELETED, data);
  }

  /**
   * List event emitters
   */
  emitListCreated(boardId: string, data: ListCreatedPayload): void {
    this.emitToBoard(boardId, WebSocketEvent.LIST_CREATED, data);
  }

  emitListUpdated(boardId: string, data: ListUpdatedPayload): void {
    this.emitToBoard(boardId, WebSocketEvent.LIST_UPDATED, data);
  }

  emitListMoved(boardId: string, data: ListMovedPayload): void {
    this.emitToBoard(boardId, WebSocketEvent.LIST_MOVED, data);
  }

  emitListDeleted(boardId: string, data: ListDeletedPayload): void {
    this.emitToBoard(boardId, WebSocketEvent.LIST_DELETED, data);
  }

  /**
   * Card event emitters
   */
  emitCardCreated(boardId: string, data: CardCreatedPayload): void {
    this.emitToBoard(boardId, WebSocketEvent.CARD_CREATED, data);
  }

  emitCardUpdated(boardId: string, data: CardUpdatedPayload): void {
    this.emitToBoard(boardId, WebSocketEvent.CARD_UPDATED, data);
  }

  emitCardMoved(boardId: string, data: CardMovedPayload): void {
    this.emitToBoard(boardId, WebSocketEvent.CARD_MOVED, data);
  }

  emitCardDeleted(boardId: string, data: CardDeletedPayload): void {
    this.emitToBoard(boardId, WebSocketEvent.CARD_DELETED, data);
  }

  /**
   * Get Socket.io server instance
   */
  getIO(): Server {
    return this.io;
  }

  /**
   * Get number of users in a board room
   */
  async getBoardUserCount(boardId: string): Promise<number> {
    const roomName = getRoomName(boardId);
    const sockets = await this.io.in(roomName).fetchSockets();
    return sockets.length;
  }

  /**
   * Disconnect all users from a board (useful for board deletion)
   */
  async disconnectAllFromBoard(boardId: string): Promise<void> {
    const roomName = getRoomName(boardId);
    const sockets = await this.io.in(roomName).fetchSockets();

    for (const socket of sockets) {
      socket.leave(roomName);
    }

    this.boardPresence.delete(boardId);
  }
}
