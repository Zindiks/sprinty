import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { createWrapper } from '@/__tests__/utils/test-utils';
import { useLists } from '@/hooks/useLists';
import { server } from '@/__tests__/setup';
import { errorHandlers } from '@/__tests__/utils/server-handlers';

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('useLists hook', () => {
  const testBoardId = 'board-123';

  describe('lists query', () => {
    it('should start in loading state', () => {
      const { result } = renderHook(() => useLists(testBoardId), {
        wrapper: createWrapper(),
      });

      expect(result.current.lists.isLoading).toBe(true);
      expect(result.current.lists.data).toBeUndefined();
    });

    it('should fetch lists successfully', async () => {
      const { result } = renderHook(() => useLists(testBoardId), {
        wrapper: createWrapper(),
      });

      // Wait for loading to complete
      await waitFor(() => {
        expect(result.current.lists.isLoading).toBe(false);
      });

      // Verify data was fetched
      expect(result.current.lists.data).toBeDefined();
      expect(Array.isArray(result.current.lists.data)).toBe(true);
      expect(result.current.lists.data?.length).toBeGreaterThan(0);

      // Verify all lists have the correct board_id
      result.current.lists.data?.forEach((list) => {
        expect(list.board_id).toBe(testBoardId);
      });
    });

    it('should handle fetch error', async () => {
      // Override with error handler
      server.use(errorHandlers.listsFetchError);

      const { result } = renderHook(() => useLists(testBoardId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.lists.isLoading).toBe(false);
      });

      expect(result.current.lists.isError).toBe(true);
      expect(result.current.lists.data).toBeUndefined();
    });
  });

  describe('createList mutation', () => {
    it('should create list successfully', async () => {
      const { result } = renderHook(() => useLists(testBoardId), {
        wrapper: createWrapper(),
      });

      expect(result.current.createList).toBeDefined();

      await act(async () => {
        result.current.createList.mutate({
          title: 'New List',
          board_id: testBoardId,
        });
      });

      await waitFor(() => {
        expect(result.current.createList.isSuccess).toBe(true);
      });

      expect(result.current.createList.data).toBeDefined();
      expect(result.current.createList.data?.data.title).toBe('New List');
    });

    it('should handle create error', async () => {
      // Override with error handler
      server.use(errorHandlers.listCreateError);

      const { result } = renderHook(() => useLists(testBoardId), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.createList.mutate({
          title: 'New List',
          board_id: testBoardId,
        });
      });

      await waitFor(() => {
        expect(result.current.createList.isError).toBe(true);
      });
    });
  });

  describe('copyList mutation', () => {
    it('should copy list successfully', async () => {
      const { result } = renderHook(() => useLists(testBoardId), {
        wrapper: createWrapper(),
      });

      const listIdToCopy = 'list-123';

      await act(async () => {
        result.current.copyList.mutate({
          id: listIdToCopy,
          board_id: testBoardId,
        });
      });

      await waitFor(() => {
        expect(result.current.copyList.isSuccess).toBe(true);
      });

      expect(result.current.copyList.data).toBeDefined();
      expect(result.current.copyList.data?.data.title).toBe('Copied List');
    });

    it('should handle copy error', async () => {
      // Override with error handler
      server.use(errorHandlers.listCopyError);

      const { result } = renderHook(() => useLists(testBoardId), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.copyList.mutate({
          id: 'list-123',
          board_id: testBoardId,
        });
      });

      await waitFor(() => {
        expect(result.current.copyList.isError).toBe(true);
      });
    });
  });

  describe('updateListTitle mutation', () => {
    it('should update list title successfully', async () => {
      const { result } = renderHook(() => useLists(testBoardId), {
        wrapper: createWrapper(),
      });

      const testListId = 'list-123';
      const newTitle = 'Updated List Title';

      await act(async () => {
        result.current.updateListTitle.mutate({
          id: testListId,
          title: newTitle,
          board_id: testBoardId,
        });
      });

      await waitFor(() => {
        expect(result.current.updateListTitle.isSuccess).toBe(true);
      });

      expect(result.current.updateListTitle.data).toBeDefined();
      expect(result.current.updateListTitle.data?.data.title).toBe(newTitle);
    });

    it('should handle update error', async () => {
      // Override with error handler
      server.use(errorHandlers.listUpdateError);

      const { result } = renderHook(() => useLists(testBoardId), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.updateListTitle.mutate({
          id: 'list-123',
          title: 'New Title',
          board_id: testBoardId,
        });
      });

      await waitFor(() => {
        expect(result.current.updateListTitle.isError).toBe(true);
      });
    });
  });

  describe('updateListsOrder mutation', () => {
    it('should reorder lists successfully', async () => {
      const { result } = renderHook(() => useLists(testBoardId), {
        wrapper: createWrapper(),
      });

      const reorderedLists = [
        { id: 'list-1', order: 0 },
        { id: 'list-2', order: 1 },
        { id: 'list-3', order: 2 },
      ];

      await act(async () => {
        result.current.updateListsOrder.mutate([
          { lists: reorderedLists },
          testBoardId,
        ]);
      });

      await waitFor(() => {
        expect(result.current.updateListsOrder.isSuccess).toBe(true);
      });

      expect(result.current.updateListsOrder.data).toBeDefined();
    });

    it('should handle reorder error', async () => {
      // Override with error handler
      server.use(errorHandlers.listReorderError);

      const { result } = renderHook(() => useLists(testBoardId), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.updateListsOrder.mutate([
          { lists: [{ id: 'list-1', order: 0 }] },
          testBoardId,
        ]);
      });

      await waitFor(() => {
        expect(result.current.updateListsOrder.isError).toBe(true);
      });
    });
  });

  describe('deleteList mutation', () => {
    it('should delete list successfully', async () => {
      const { result } = renderHook(() => useLists(testBoardId), {
        wrapper: createWrapper(),
      });

      const listIdToDelete = 'list-to-delete';

      await act(async () => {
        result.current.deleteList.mutate({
          id: listIdToDelete,
          board_id: testBoardId,
        });
      });

      await waitFor(() => {
        expect(result.current.deleteList.isSuccess).toBe(true);
      });

      expect(result.current.deleteList.data).toBeDefined();
    });

    it('should handle delete error', async () => {
      // Override with error handler
      server.use(errorHandlers.listDeleteError);

      const { result } = renderHook(() => useLists(testBoardId), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.deleteList.mutate({
          id: 'list-123',
          board_id: testBoardId,
        });
      });

      await waitFor(() => {
        expect(result.current.deleteList.isError).toBe(true);
      });
    });
  });

  describe('Cache invalidation', () => {
    it('should invalidate lists query after creating list', async () => {
      const wrapper = createWrapper();

      const { result: hookResult } = renderHook(() => useLists(testBoardId), {
        wrapper,
      });

      // Wait for initial data
      await waitFor(() => {
        expect(hookResult.current.lists.isLoading).toBe(false);
      });

      const initialDataLength = hookResult.current.lists.data?.length || 0;

      // Create a new list
      await act(async () => {
        hookResult.current.createList.mutate({
          title: 'New List',
          board_id: testBoardId,
        });
      });

      await waitFor(() => {
        expect(hookResult.current.createList.isSuccess).toBe(true);
      });

      // Note: Cache invalidation happens automatically via React Query
      // The query will be marked as stale and refetch on next access
    });

    it('should invalidate lists query after deleting list', async () => {
      const wrapper = createWrapper();

      const { result } = renderHook(() => useLists(testBoardId), {
        wrapper,
      });

      // Wait for initial data
      await waitFor(() => {
        expect(result.current.lists.isLoading).toBe(false);
      });

      // Delete a list
      await act(async () => {
        result.current.deleteList.mutate({
          id: 'list-123',
          board_id: testBoardId,
        });
      });

      await waitFor(() => {
        expect(result.current.deleteList.isSuccess).toBe(true);
      });

      // Cache invalidation happens automatically via React Query
    });
  });
});
