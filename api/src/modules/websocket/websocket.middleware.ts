import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { AuthenticatedSocket, SocketAuthPayload } from "./websocket.types";

/**
 * WebSocket Authentication Middleware
 *
 * Authenticates WebSocket connections using token or session
 * In a real application, this would verify JWT tokens or session cookies
 */
export function authenticationMiddleware(socket: Socket, next: (err?: ExtendedError) => void) {
  const authSocket = socket as AuthenticatedSocket;
  const auth = socket.handshake.auth as SocketAuthPayload;
  const token = auth?.token;

  // For now, we'll use a simple token validation
  // In production, this should validate JWT or check session in database
  if (!token) {
    const error = new Error("Authentication required") as ExtendedError;
    error.data = { code: "AUTH_REQUIRED" };
    return next(error);
  }

  // TODO: Implement proper token validation
  // For development, we'll extract user info from a simple token format
  // In production, decode JWT and verify signature
  try {
    // Temporary: Parse token as JSON (replace with JWT verification)
    // Expected format: { userId: string, email: string }
    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));

    if (!decoded.userId || !decoded.email) {
      throw new Error("Invalid token format");
    }

    // Attach user info to socket
    authSocket.userId = decoded.userId;
    authSocket.userEmail = decoded.email;

    next();
  } catch (error) {
    const authError = new Error("Invalid authentication token") as ExtendedError;
    authError.data = { code: "INVALID_TOKEN" };
    return next(authError);
  }
}

/**
 * Authorization Middleware Factory
 * Creates middleware to check if user has access to a specific board
 */
export function createBoardAuthorizationMiddleware(
  checkBoardAccess: (userId: string, boardId: string) => Promise<boolean>
) {
  return async (socket: AuthenticatedSocket, boardId: string, next: (err?: Error) => void) => {
    const { userId } = socket;

    if (!userId) {
      return next(new Error("User not authenticated"));
    }

    try {
      const hasAccess = await checkBoardAccess(userId, boardId);

      if (!hasAccess) {
        return next(new Error("Access denied to board"));
      }

      next();
    } catch (error) {
      next(error as Error);
    }
  };
}

/**
 * Rate limiting middleware to prevent spam
 */
export function rateLimitMiddleware(maxEventsPerMinute: number = 60) {
  const eventCounts = new Map<string, { count: number; resetAt: number }>();

  return (socket: AuthenticatedSocket, next: (err?: ExtendedError) => void) => {
    const socketId = socket.id;
    const now = Date.now();
    const windowMs = 60000; // 1 minute

    let entry = eventCounts.get(socketId);

    if (!entry || now > entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs };
      eventCounts.set(socketId, entry);
    }

    entry.count++;

    if (entry.count > maxEventsPerMinute) {
      const error = new Error("Rate limit exceeded") as ExtendedError;
      error.data = { code: "RATE_LIMIT_EXCEEDED" };
      return next(error);
    }

    next();
  };
}

/**
 * Error handler for WebSocket errors
 */
export function errorHandler(socket: AuthenticatedSocket, error: Error) {
  console.error(`WebSocket error for socket ${socket.id}:`, error);

  socket.emit("error", {
    message: error.message,
    code: "WEBSOCKET_ERROR",
  });
}
