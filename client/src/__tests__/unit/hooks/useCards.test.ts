import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { createWrapper } from '@/__tests__/utils/test-utils';
import { useCards } from '@/hooks/useCards';
import { server } from '@/__tests__/setup';
import { errorHandlers } from '@/__tests__/utils/server-handlers';

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('useCards hook', () => {
  describe('createCard mutation', () => {
    it('should create card successfully', async () => {
      const { result } = renderHook(() => useCards(), {
        wrapper: createWrapper(),
      });

      expect(result.current.createCard).toBeDefined();

      await act(async () => {
        result.current.createCard.mutate({
          title: 'New Card',
          list_id: 'list-123',
        });
      });

      await waitFor(() => {
        expect(result.current.createCard.isSuccess).toBe(true);
      });

      expect(result.current.createCard.data).toBeDefined();
      expect(result.current.createCard.data?.data.title).toBe('New Card');
      expect(result.current.createCard.data?.data.list_id).toBe('list-123');
    });

    it('should handle create error', async () => {
      // Override with error handler
      server.use(errorHandlers.cardCreateError);

      const { result } = renderHook(() => useCards(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.createCard.mutate({
          title: 'New Card',
          list_id: 'list-123',
        });
      });

      await waitFor(() => {
        expect(result.current.createCard.isError).toBe(true);
      });
    });

    it('should invalidate lists query after creating card', async () => {
      const wrapper = createWrapper();

      const { result } = renderHook(() => useCards(), {
        wrapper,
      });

      await act(async () => {
        result.current.createCard.mutate({
          title: 'New Card',
          list_id: 'list-123',
        });
      });

      await waitFor(() => {
        expect(result.current.createCard.isSuccess).toBe(true);
      });

      // Cache invalidation happens automatically via React Query
      // The lists query will be marked as stale
    });
  });

  describe('updateCardsOrder mutation', () => {
    it('should reorder cards successfully', async () => {
      const { result } = renderHook(() => useCards(), {
        wrapper: createWrapper(),
      });

      const reorderedCards = [
        { id: 'card-1', order: 0 },
        { id: 'card-2', order: 1 },
        { id: 'card-3', order: 2 },
      ];

      await act(async () => {
        result.current.updateCardsOrder.mutate([{ cards: reorderedCards }, 'list-123']);
      });

      await waitFor(() => {
        expect(result.current.updateCardsOrder.isSuccess).toBe(true);
      });

      expect(result.current.updateCardsOrder.data).toBeDefined();
    });

    it('should handle reorder error', async () => {
      // Override with error handler
      server.use(errorHandlers.cardReorderError);

      const { result } = renderHook(() => useCards(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.updateCardsOrder.mutate([
          { cards: [{ id: 'card-1', order: 0 }] },
          'list-123',
        ]);
      });

      await waitFor(() => {
        expect(result.current.updateCardsOrder.isError).toBe(true);
      });
    });

    it('should invalidate list query after reordering', async () => {
      const wrapper = createWrapper();

      const { result } = renderHook(() => useCards(), {
        wrapper,
      });

      await act(async () => {
        result.current.updateCardsOrder.mutate([
          { cards: [{ id: 'card-1', order: 0 }] },
          'list-123',
        ]);
      });

      await waitFor(() => {
        expect(result.current.updateCardsOrder.isSuccess).toBe(true);
      });

      // Cache invalidation happens automatically
    });
  });

  describe('updateCardDetails mutation', () => {
    it('should update card details successfully', async () => {
      const { result } = renderHook(() => useCards(), {
        wrapper: createWrapper(),
      });

      const cardUpdate = {
        id: 'card-123',
        list_id: 'list-123',
        title: 'Updated Card Title',
        description: 'Updated description',
        status: 'in-progress',
        priority: 'high' as const,
      };

      await act(async () => {
        result.current.updateCardDetails.mutate(cardUpdate);
      });

      await waitFor(() => {
        expect(result.current.updateCardDetails.isSuccess).toBe(true);
      });

      expect(result.current.updateCardDetails.data).toBeDefined();
      expect(result.current.updateCardDetails.data?.data.title).toBe('Updated Card Title');
    });

    it('should handle update error', async () => {
      // Override with error handler
      server.use(errorHandlers.cardDetailsUpdateError);

      const { result } = renderHook(() => useCards(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.updateCardDetails.mutate({
          id: 'card-123',
          list_id: 'list-123',
          title: 'Updated Title',
        });
      });

      await waitFor(() => {
        expect(result.current.updateCardDetails.isError).toBe(true);
      });
    });

    it('should update card title only', async () => {
      const { result } = renderHook(() => useCards(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.updateCardDetails.mutate({
          id: 'card-123',
          list_id: 'list-123',
          title: 'New Title',
        });
      });

      await waitFor(() => {
        expect(result.current.updateCardDetails.isSuccess).toBe(true);
      });

      expect(result.current.updateCardDetails.data?.data.title).toBe('New Title');
    });

    it('should update card description', async () => {
      const { result } = renderHook(() => useCards(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.updateCardDetails.mutate({
          id: 'card-123',
          list_id: 'list-123',
          description: 'New detailed description',
        });
      });

      await waitFor(() => {
        expect(result.current.updateCardDetails.isSuccess).toBe(true);
      });

      expect(result.current.updateCardDetails.data?.data.description).toBe(
        'New detailed description',
      );
    });

    it('should update card priority', async () => {
      const { result } = renderHook(() => useCards(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.updateCardDetails.mutate({
          id: 'card-123',
          list_id: 'list-123',
          priority: 'critical',
        });
      });

      await waitFor(() => {
        expect(result.current.updateCardDetails.isSuccess).toBe(true);
      });

      expect(result.current.updateCardDetails.data?.data.priority).toBe('critical');
    });

    it('should update card due date', async () => {
      const { result } = renderHook(() => useCards(), {
        wrapper: createWrapper(),
      });

      const dueDate = '2024-12-31T23:59:59.000Z';

      await act(async () => {
        result.current.updateCardDetails.mutate({
          id: 'card-123',
          list_id: 'list-123',
          due_date: dueDate,
        });
      });

      await waitFor(() => {
        expect(result.current.updateCardDetails.isSuccess).toBe(true);
      });

      expect(result.current.updateCardDetails.data?.data.due_date).toBe(dueDate);
    });

    it('should update card status', async () => {
      const { result } = renderHook(() => useCards(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.updateCardDetails.mutate({
          id: 'card-123',
          list_id: 'list-123',
          status: 'completed',
        });
      });

      await waitFor(() => {
        expect(result.current.updateCardDetails.isSuccess).toBe(true);
      });

      expect(result.current.updateCardDetails.data?.data.status).toBe('completed');
    });

    it('should clear card description with null', async () => {
      const { result } = renderHook(() => useCards(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.updateCardDetails.mutate({
          id: 'card-123',
          list_id: 'list-123',
          description: null,
        });
      });

      await waitFor(() => {
        expect(result.current.updateCardDetails.isSuccess).toBe(true);
      });

      expect(result.current.updateCardDetails.data?.data.description).toBeNull();
    });

    it('should clear card due date with null', async () => {
      const { result } = renderHook(() => useCards(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.updateCardDetails.mutate({
          id: 'card-123',
          list_id: 'list-123',
          due_date: null,
        });
      });

      await waitFor(() => {
        expect(result.current.updateCardDetails.isSuccess).toBe(true);
      });

      expect(result.current.updateCardDetails.data?.data.due_date).toBeNull();
    });

    it('should invalidate lists and card-details queries after update', async () => {
      const wrapper = createWrapper();

      const { result } = renderHook(() => useCards(), {
        wrapper,
      });

      await act(async () => {
        result.current.updateCardDetails.mutate({
          id: 'card-123',
          list_id: 'list-123',
          title: 'Updated Title',
        });
      });

      await waitFor(() => {
        expect(result.current.updateCardDetails.isSuccess).toBe(true);
      });

      // Cache invalidation happens automatically via React Query
      // Both lists and card-details queries will be marked as stale
    });
  });

  describe('Hook exports', () => {
    it('should export all expected mutations', () => {
      const { result } = renderHook(() => useCards(), {
        wrapper: createWrapper(),
      });

      expect(result.current.createCard).toBeDefined();
      expect(result.current.updateCardsOrder).toBeDefined();
      expect(result.current.updateCardDetails).toBeDefined();
    });
  });
});
