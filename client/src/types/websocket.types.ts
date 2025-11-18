/**
 * WebSocket Event Types (Frontend)
 * These should match the backend event types
 */

export enum WebSocketEvent {
  // Connection events
  CONNECTION = 'connection',
  DISCONNECT = 'disconnect',
  ERROR = 'error',

  // Board events
  BOARD_JOIN = 'board:join',
  BOARD_LEAVE = 'board:leave',
  BOARD_UPDATED = 'board:updated',
  BOARD_DELETED = 'board:deleted',
  BOARD_PRESENCE = 'board:presence',

  // List events
  LIST_CREATED = 'list:created',
  LIST_UPDATED = 'list:updated',
  LIST_MOVED = 'list:moved',
  LIST_DELETED = 'list:deleted',

  // Card events
  CARD_CREATED = 'card:created',
  CARD_UPDATED = 'card:updated',
  CARD_MOVED = 'card:moved',
  CARD_DELETED = 'card:deleted',
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
 * Presence user
 */
export interface PresenceUser {
  id: string;
  email: string;
  avatarUrl?: string;
  joinedAt: number;
}

/**
 * Board presence payload
 */
export interface BoardPresencePayload {
  users: PresenceUser[];
  count: number;
}

/**
 * Card event payloads
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
 * List event payloads
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
 * Board event payloads
 */
export interface BoardUpdatedPayload {
  id: string;
  title?: string;
  description?: string;
  updatedAt: string;
}

export interface BoardDeletedPayload {
  boardId: string;
}

/**
 * Connection status
 */
export enum ConnectionStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  ERROR = 'error',
}
