import { Socket } from "socket.io";

/**
 * WebSocket Event Types
 */
export enum WebSocketEvent {
  // Connection events
  CONNECTION = "connection",
  DISCONNECT = "disconnect",
  ERROR = "error",

  // Board events
  BOARD_JOIN = "board:join",
  BOARD_LEAVE = "board:leave",
  BOARD_UPDATED = "board:updated",
  BOARD_DELETED = "board:deleted",
  BOARD_PRESENCE = "board:presence",

  // List events
  LIST_CREATED = "list:created",
  LIST_UPDATED = "list:updated",
  LIST_MOVED = "list:moved",
  LIST_DELETED = "list:deleted",

  // Card events
  CARD_CREATED = "card:created",
  CARD_UPDATED = "card:updated",
  CARD_MOVED = "card:moved",
  CARD_DELETED = "card:deleted",
}

/**
 * Base event payload structure
 */
export interface WebSocketEventPayload<T = unknown> {
  event: WebSocketEvent;
  boardId: string;
  userId: string;
  timestamp: number;
  data: T;
}

/**
 * Board-related payloads
 */
export interface BoardJoinPayload {
  boardId: string;
}

export interface BoardLeavePayload {
  boardId: string;
}

export interface BoardUpdatedPayload {
  id: string;
  title?: string;
  description?: string;
  updatedAt: string;
}

export interface BoardDeletedPayload {
  boardId: string;
}

export interface PresenceUser {
  id: string;
  email: string;
  avatarUrl?: string;
  joinedAt: number;
}

export interface BoardPresencePayload {
  users: PresenceUser[];
  count: number;
}

/**
 * List-related payloads
 */
export interface ListCreatedPayload {
  id: string;
  boardId: string;
  title: string;
  order: number;
  createdAt: string;
}

export interface ListUpdatedPayload {
  id: string;
  title?: string;
  order?: number;
  updatedAt: string;
}

export interface ListMovedPayload {
  id: string;
  oldOrder: number;
  newOrder: number;
}

export interface ListDeletedPayload {
  listId: string;
}

/**
 * Card-related payloads
 */
export interface CardCreatedPayload {
  id: string;
  listId: string;
  title: string;
  description?: string;
  order: number;
  createdAt: string;
}

export interface CardUpdatedPayload {
  id: string;
  title?: string;
  description?: string;
  updatedAt: string;
}

export interface CardMovedPayload {
  cardId: string;
  sourceListId: string;
  destinationListId: string;
  sourceIndex: number;
  destinationIndex: number;
  newOrder: number;
}

export interface CardDeletedPayload {
  cardId: string;
  listId: string;
}

/**
 * Error payload
 */
export interface ErrorPayload {
  message: string;
  code: string;
  details?: unknown;
}

/**
 * Extended Socket interface with custom data
 */
export interface AuthenticatedSocket extends Socket {
  userId?: string;
  userEmail?: string;
  currentBoardId?: string;
}

/**
 * Socket authentication payload
 */
export interface SocketAuthPayload {
  token?: string;
  sessionId?: string;
}

/**
 * Room naming utilities
 */
export const getRoomName = (boardId: string): string => `board:${boardId}`;
