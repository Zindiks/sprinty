import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  WebSocketEvent,
  ConnectionStatus,
  PresenceUser,
  BoardPresencePayload,
  CardCreatedPayload,
  CardUpdatedPayload,
  CardMovedPayload,
  CardDeletedPayload,
  ListCreatedPayload,
  ListUpdatedPayload,
  ListMovedPayload,
  ListDeletedPayload,
  BoardUpdatedPayload,
  WebSocketEventPayload,
} from '../types/websocket.types';

/**
 * WebSocket Context Value
 */
interface WebSocketContextValue {
  socket: Socket | null;
  connectionStatus: ConnectionStatus;
  presenceUsers: PresenceUser[];
  joinBoard: (boardId: string) => Promise<void>;
  leaveBoard: (boardId: string) => Promise<void>;

  // Event listeners
  onCardCreated: (
    callback: (data: WebSocketEventPayload<CardCreatedPayload>) => void,
  ) => () => void;
  onCardUpdated: (
    callback: (data: WebSocketEventPayload<CardUpdatedPayload>) => void,
  ) => () => void;
  onCardMoved: (callback: (data: WebSocketEventPayload<CardMovedPayload>) => void) => () => void;
  onCardDeleted: (
    callback: (data: WebSocketEventPayload<CardDeletedPayload>) => void,
  ) => () => void;
  onListCreated: (
    callback: (data: WebSocketEventPayload<ListCreatedPayload>) => void,
  ) => () => void;
  onListUpdated: (
    callback: (data: WebSocketEventPayload<ListUpdatedPayload>) => void,
  ) => () => void;
  onListMoved: (callback: (data: WebSocketEventPayload<ListMovedPayload>) => void) => () => void;
  onListDeleted: (
    callback: (data: WebSocketEventPayload<ListDeletedPayload>) => void,
  ) => () => void;
  onBoardUpdated: (
    callback: (data: WebSocketEventPayload<BoardUpdatedPayload>) => void,
  ) => () => void;
  onPresenceUpdate: (
    callback: (data: WebSocketEventPayload<BoardPresencePayload>) => void,
  ) => () => void;
}

const WebSocketContext = createContext<WebSocketContextValue | undefined>(undefined);

/**
 * WebSocket Provider Props
 */
interface WebSocketProviderProps {
  children: React.ReactNode;
  serverUrl?: string;
  userId?: string;
  userEmail?: string;
}

/**
 * WebSocket Provider Component
 */
export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
  serverUrl = 'http://localhost:3000',
  userId,
  userEmail,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    ConnectionStatus.DISCONNECTED,
  );
  const [presenceUsers, setPresenceUsers] = useState<PresenceUser[]>([]);
  const currentBoardId = useRef<string | null>(null);

  /**
   * Initialize WebSocket connection
   */
  useEffect(() => {
    if (!userId || !userEmail) {
      console.warn('WebSocket: No user credentials provided, skipping connection');
      return;
    }

    setConnectionStatus(ConnectionStatus.CONNECTING);

    // Create authentication token (base64 encoded JSON)
    // TODO: Replace with proper JWT token from auth system
    const authToken = btoa(JSON.stringify({ userId, email: userEmail }));

    const newSocket = io(serverUrl, {
      auth: {
        token: authToken,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('WebSocket connected:', newSocket.id);
      setConnectionStatus(ConnectionStatus.CONNECTED);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      setConnectionStatus(ConnectionStatus.DISCONNECTED);
      setPresenceUsers([]);
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setConnectionStatus(ConnectionStatus.ERROR);
    });

    newSocket.on('error', (error: { message: string; code: string }) => {
      console.error('WebSocket error:', error);
      setConnectionStatus(ConnectionStatus.ERROR);
    });

    // Presence updates
    newSocket.on(
      WebSocketEvent.BOARD_PRESENCE,
      (payload: WebSocketEventPayload<BoardPresencePayload>) => {
        console.log('Presence update:', payload.data);
        setPresenceUsers(payload.data.users);
      },
    );

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      console.log('WebSocket: Cleaning up connection');
      if (currentBoardId.current) {
        newSocket.emit(WebSocketEvent.BOARD_LEAVE, { boardId: currentBoardId.current });
      }
      newSocket.disconnect();
    };
  }, [serverUrl, userId, userEmail]);

  /**
   * Join a board room
   */
  const joinBoard = useCallback(
    async (boardId: string) => {
      if (!socket || connectionStatus !== ConnectionStatus.CONNECTED) {
        console.warn('WebSocket: Cannot join board, not connected');
        return;
      }

      return new Promise<void>((resolve, reject) => {
        socket.emit(
          WebSocketEvent.BOARD_JOIN,
          { boardId },
          (response: {
            success: boolean;
            message?: string;
            error?: string;
            presence?: PresenceUser[];
          }) => {
            if (response.success) {
              console.log(`Joined board: ${boardId}`);
              currentBoardId.current = boardId;
              if (response.presence) {
                setPresenceUsers(response.presence);
              }
              resolve();
            } else {
              console.error(`Failed to join board: ${response.error}`);
              reject(new Error(response.error || 'Failed to join board'));
            }
          },
        );
      });
    },
    [socket, connectionStatus],
  );

  /**
   * Leave a board room
   */
  const leaveBoard = useCallback(
    async (boardId: string) => {
      if (!socket) {
        return;
      }

      return new Promise<void>((resolve) => {
        socket.emit(WebSocketEvent.BOARD_LEAVE, { boardId }, (response: { success: boolean }) => {
          if (response.success) {
            console.log(`Left board: ${boardId}`);
            currentBoardId.current = null;
            setPresenceUsers([]);
          }
          resolve();
        });
      });
    },
    [socket],
  );

  /**
   * Event listener helper
   */
  const createEventListener = useCallback(
    <T,>(event: WebSocketEvent, callback: (data: WebSocketEventPayload<T>) => void) => {
      if (!socket) {
        return () => {};
      }

      const handler = (payload: WebSocketEventPayload<T>) => {
        callback(payload);
      };

      socket.on(event, handler);

      // Return cleanup function
      return () => {
        socket.off(event, handler);
      };
    },
    [socket],
  );

  /**
   * Event listener methods
   */
  const onCardCreated = useCallback(
    (callback: (data: WebSocketEventPayload<CardCreatedPayload>) => void) =>
      createEventListener(WebSocketEvent.CARD_CREATED, callback),
    [createEventListener],
  );

  const onCardUpdated = useCallback(
    (callback: (data: WebSocketEventPayload<CardUpdatedPayload>) => void) =>
      createEventListener(WebSocketEvent.CARD_UPDATED, callback),
    [createEventListener],
  );

  const onCardMoved = useCallback(
    (callback: (data: WebSocketEventPayload<CardMovedPayload>) => void) =>
      createEventListener(WebSocketEvent.CARD_MOVED, callback),
    [createEventListener],
  );

  const onCardDeleted = useCallback(
    (callback: (data: WebSocketEventPayload<CardDeletedPayload>) => void) =>
      createEventListener(WebSocketEvent.CARD_DELETED, callback),
    [createEventListener],
  );

  const onListCreated = useCallback(
    (callback: (data: WebSocketEventPayload<ListCreatedPayload>) => void) =>
      createEventListener(WebSocketEvent.LIST_CREATED, callback),
    [createEventListener],
  );

  const onListUpdated = useCallback(
    (callback: (data: WebSocketEventPayload<ListUpdatedPayload>) => void) =>
      createEventListener(WebSocketEvent.LIST_UPDATED, callback),
    [createEventListener],
  );

  const onListMoved = useCallback(
    (callback: (data: WebSocketEventPayload<ListMovedPayload>) => void) =>
      createEventListener(WebSocketEvent.LIST_MOVED, callback),
    [createEventListener],
  );

  const onListDeleted = useCallback(
    (callback: (data: WebSocketEventPayload<ListDeletedPayload>) => void) =>
      createEventListener(WebSocketEvent.LIST_DELETED, callback),
    [createEventListener],
  );

  const onBoardUpdated = useCallback(
    (callback: (data: WebSocketEventPayload<BoardUpdatedPayload>) => void) =>
      createEventListener(WebSocketEvent.BOARD_UPDATED, callback),
    [createEventListener],
  );

  const onPresenceUpdate = useCallback(
    (callback: (data: WebSocketEventPayload<BoardPresencePayload>) => void) =>
      createEventListener(WebSocketEvent.BOARD_PRESENCE, callback),
    [createEventListener],
  );

  const value: WebSocketContextValue = {
    socket,
    connectionStatus,
    presenceUsers,
    joinBoard,
    leaveBoard,
    onCardCreated,
    onCardUpdated,
    onCardMoved,
    onCardDeleted,
    onListCreated,
    onListUpdated,
    onListMoved,
    onListDeleted,
    onBoardUpdated,
    onPresenceUpdate,
  };

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};

/**
 * Custom hook to use WebSocket context
 */
export const useWebSocket = (): WebSocketContextValue => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
