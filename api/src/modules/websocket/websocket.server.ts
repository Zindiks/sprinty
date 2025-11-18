import { Server as HttpServer } from "http";
import { Server, ServerOptions } from "socket.io";
import {
  AuthenticatedSocket,
  WebSocketEvent,
  BoardJoinPayload,
  BoardLeavePayload,
} from "./websocket.types";
import { WebSocketService } from "./websocket.service";
import {
  authenticationMiddleware,
  errorHandler,
  rateLimitMiddleware,
} from "./websocket.middleware";

/**
 * Initialize WebSocket Server
 */
export function initializeWebSocketServer(
  httpServer: HttpServer,
  corsOrigin: string,
): { io: Server; wsService: WebSocketService } {
  // Socket.io server options
  const options: Partial<ServerOptions> = {
    cors: {
      origin: corsOrigin,
      credentials: true,
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
    pingTimeout: 60000,
    pingInterval: 25000,
  };

  // Create Socket.io server
  const io = new Server(httpServer, options);

  // Create WebSocket service
  const wsService = new WebSocketService(io);

  // Apply global middleware
  io.use(authenticationMiddleware);
  io.use(rateLimitMiddleware(100)); // 100 events per minute per connection

  // Connection handler
  io.on(WebSocketEvent.CONNECTION, (socket: AuthenticatedSocket) => {
    console.log(`Client connected: ${socket.id} (User: ${socket.userId})`);

    // Set up event handlers
    setupEventHandlers(socket, wsService);

    // Handle disconnect
    socket.on(WebSocketEvent.DISCONNECT, () => {
      console.log(`Client disconnected: ${socket.id} (User: ${socket.userId})`);
      wsService.handleDisconnect(socket);
    });

    // Handle errors
    socket.on(WebSocketEvent.ERROR, (error: Error) => {
      errorHandler(socket, error);
    });
  });

  console.log("WebSocket server initialized");

  return { io, wsService };
}

/**
 * Set up event handlers for a socket connection
 */
function setupEventHandlers(
  socket: AuthenticatedSocket,
  wsService: WebSocketService,
): void {
  const { userId, userEmail } = socket;

  if (!userId || !userEmail) {
    socket.disconnect();
    return;
  }

  /**
   * Handle board join
   */
  socket.on(
    WebSocketEvent.BOARD_JOIN,
    async (
      payload: BoardJoinPayload,
      callback?: (response: unknown) => void,
    ) => {
      try {
        const { boardId } = payload;

        // TODO: Add authorization check here
        // Verify user has access to the board

        await wsService.joinBoard(socket, boardId, userId, userEmail);

        // Send success response if callback provided
        if (callback) {
          callback({
            success: true,
            message: `Joined board ${boardId}`,
            presence: wsService.getBoardPresence(boardId),
          });
        }
      } catch (error) {
        console.error("Error joining board:", error);
        if (callback) {
          callback({
            success: false,
            error: "Failed to join board",
          });
        }
      }
    },
  );

  /**
   * Handle board leave
   */
  socket.on(
    WebSocketEvent.BOARD_LEAVE,
    async (
      payload: BoardLeavePayload,
      callback?: (response: unknown) => void,
    ) => {
      try {
        const { boardId } = payload;

        await wsService.leaveBoard(socket, boardId, userId);

        if (callback) {
          callback({
            success: true,
            message: `Left board ${boardId}`,
          });
        }
      } catch (error) {
        console.error("Error leaving board:", error);
        if (callback) {
          callback({
            success: false,
            error: "Failed to leave board",
          });
        }
      }
    },
  );

  /**
   * Ping/pong for connection health check
   */
  socket.on("ping", () => {
    socket.emit("pong");
  });
}

/**
 * Gracefully shutdown WebSocket server
 */
export async function shutdownWebSocketServer(io: Server): Promise<void> {
  console.log("Shutting down WebSocket server...");

  return new Promise((resolve) => {
    io.close(() => {
      console.log("WebSocket server closed");
      resolve();
    });
  });
}
