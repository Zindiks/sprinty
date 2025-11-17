import { useEffect, useRef } from "react";
import { useWebSocket } from "../../contexts/WebSocketContext";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Custom hook for board-specific WebSocket integration
 * Automatically joins/leaves board rooms and handles real-time events
 */
export function useBoardWebSocket(boardId: string | undefined) {
  const {
    joinBoard,
    leaveBoard,
    presenceUsers,
    connectionStatus,
    onCardCreated,
    onCardUpdated,
    onCardMoved,
    onCardDeleted,
    onListCreated,
    onListUpdated,
    onListDeleted,
    onBoardUpdated,
  } = useWebSocket();

  const queryClient = useQueryClient();
  const hasJoined = useRef(false);

  /**
   * Join board room on mount, leave on unmount
   */
  useEffect(() => {
    if (!boardId || hasJoined.current) {
      return;
    }

    console.log(`[WebSocket] Joining board: ${boardId}`);

    joinBoard(boardId)
      .then(() => {
        hasJoined.current = true;
        console.log(`[WebSocket] Successfully joined board: ${boardId}`);
      })
      .catch((error) => {
        console.error(`[WebSocket] Failed to join board: ${boardId}`, error);
      });

    // Leave board on unmount
    return () => {
      if (boardId && hasJoined.current) {
        console.log(`[WebSocket] Leaving board: ${boardId}`);
        leaveBoard(boardId);
        hasJoined.current = false;
      }
    };
  }, [boardId, joinBoard, leaveBoard]);

  /**
   * Handle card created event
   */
  useEffect(() => {
    if (!boardId) return;

    const unsubscribe = onCardCreated((event) => {
      console.log("[WebSocket] Card created:", event.data);

      // Invalidate lists query to refetch with new card
      queryClient.invalidateQueries({ queryKey: ["lists", boardId] });

      // Optionally, you can update the cache directly for optimistic UI
      // This is more complex and requires knowing the cache structure
    });

    return unsubscribe;
  }, [boardId, onCardCreated, queryClient]);

  /**
   * Handle card updated event
   */
  useEffect(() => {
    if (!boardId) return;

    const unsubscribe = onCardUpdated((event) => {
      console.log("[WebSocket] Card updated:", event.data);

      // Invalidate lists query to refetch with updated card
      queryClient.invalidateQueries({ queryKey: ["lists", boardId] });
    });

    return unsubscribe;
  }, [boardId, onCardUpdated, queryClient]);

  /**
   * Handle card moved event
   */
  useEffect(() => {
    if (!boardId) return;

    const unsubscribe = onCardMoved((event) => {
      console.log("[WebSocket] Card moved:", event.data);

      // Invalidate lists query to refetch with reordered cards
      queryClient.invalidateQueries({ queryKey: ["lists", boardId] });
    });

    return unsubscribe;
  }, [boardId, onCardMoved, queryClient]);

  /**
   * Handle card deleted event
   */
  useEffect(() => {
    if (!boardId) return;

    const unsubscribe = onCardDeleted((event) => {
      console.log("[WebSocket] Card deleted:", event.data);

      // Invalidate lists query to refetch without deleted card
      queryClient.invalidateQueries({ queryKey: ["lists", boardId] });
    });

    return unsubscribe;
  }, [boardId, onCardDeleted, queryClient]);

  /**
   * Handle list created event
   */
  useEffect(() => {
    if (!boardId) return;

    const unsubscribe = onListCreated((event) => {
      console.log("[WebSocket] List created:", event.data);

      // Invalidate lists query to refetch with new list
      queryClient.invalidateQueries({ queryKey: ["lists", boardId] });
    });

    return unsubscribe;
  }, [boardId, onListCreated, queryClient]);

  /**
   * Handle list updated event
   */
  useEffect(() => {
    if (!boardId) return;

    const unsubscribe = onListUpdated((event) => {
      console.log("[WebSocket] List updated:", event.data);

      // Invalidate lists query to refetch with updated list
      queryClient.invalidateQueries({ queryKey: ["lists", boardId] });
    });

    return unsubscribe;
  }, [boardId, onListUpdated, queryClient]);

  /**
   * Handle list deleted event
   */
  useEffect(() => {
    if (!boardId) return;

    const unsubscribe = onListDeleted((event) => {
      console.log("[WebSocket] List deleted:", event.data);

      // Invalidate lists query to refetch without deleted list
      queryClient.invalidateQueries({ queryKey: ["lists", boardId] });
    });

    return unsubscribe;
  }, [boardId, onListDeleted, queryClient]);

  /**
   * Handle board updated event
   */
  useEffect(() => {
    if (!boardId) return;

    const unsubscribe = onBoardUpdated((event) => {
      console.log("[WebSocket] Board updated:", event.data);

      // Invalidate board query to refetch updated board data
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
    });

    return unsubscribe;
  }, [boardId, onBoardUpdated, queryClient]);

  return {
    presenceUsers,
    connectionStatus,
  };
}
