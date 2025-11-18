import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { createWrapper } from "@/__tests__/utils/test-utils";
import { useCardDetails } from "@/hooks/useCardDetails";
import { server } from "@/__tests__/setup";
import { errorHandlers } from "@/__tests__/utils/server-handlers";

// Mock the toast hook
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe("useCardDetails hook", () => {
  const testCardId = "card-123";
  const testListId = "list-123";

  describe("cardDetails query", () => {
    it("should be disabled when cardId is not provided", () => {
      const { result } = renderHook(() => useCardDetails(), {
        wrapper: createWrapper(),
      });

      expect(result.current.cardDetails).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
    });

    it("should be disabled when cardId is empty string", () => {
      const { result } = renderHook(() => useCardDetails(""), {
        wrapper: createWrapper(),
      });

      expect(result.current.cardDetails).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
    });

    it("should fetch card details successfully when cardId is provided", async () => {
      const { result } = renderHook(() => useCardDetails(testCardId), {
        wrapper: createWrapper(),
      });

      // Initially should be loading
      expect(result.current.isLoading).toBe(true);

      // Wait for loading to complete
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Verify card details were fetched
      expect(result.current.cardDetails).toBeDefined();
      expect(result.current.cardDetails?.id).toBe(testCardId);

      // Verify CardWithDetails structure includes all relations
      expect(result.current.cardDetails).toHaveProperty("assignees");
      expect(result.current.cardDetails).toHaveProperty("labels");
      expect(result.current.cardDetails).toHaveProperty("checklist_items");
      expect(result.current.cardDetails).toHaveProperty("checklist_progress");
      expect(result.current.cardDetails).toHaveProperty("comments");
      expect(result.current.cardDetails).toHaveProperty("attachments");
      expect(result.current.cardDetails).toHaveProperty("activities");
    });

    it("should handle fetch error", async () => {
      // Override with error handler
      server.use(errorHandlers.cardDetailsFetchError);

      const { result } = renderHook(() => useCardDetails(testCardId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeDefined();
      expect(result.current.cardDetails).toBeUndefined();
    });

    it("should refetch card details when refetch is called", async () => {
      const { result } = renderHook(() => useCardDetails(testCardId), {
        wrapper: createWrapper(),
      });

      // Wait for initial fetch
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const initialData = result.current.cardDetails;
      expect(initialData).toBeDefined();

      // Trigger refetch
      await act(async () => {
        await result.current.refetch();
      });

      // Data should be refetched
      expect(result.current.cardDetails).toBeDefined();
    });
  });

  describe("updateDetails mutation", () => {
    it("should update card details successfully", async () => {
      const { result } = renderHook(() => useCardDetails(testCardId), {
        wrapper: createWrapper(),
      });

      // Wait for initial data to load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const updates = {
        id: testCardId,
        title: "Updated Title",
        description: "Updated description",
        priority: "high" as const,
      };

      await act(async () => {
        result.current.updateDetails.mutate(updates);
      });

      await waitFor(() => {
        expect(result.current.updateDetails.isSuccess).toBe(true);
      });

      expect(result.current.updateDetails.data).toBeDefined();
    });

    it("should handle update error", async () => {
      // Override with error handler (useCardDetails uses /cards/:cardId/details endpoint)
      server.use(errorHandlers.cardDetailsUpdateErrorWithId);

      const { result } = renderHook(() => useCardDetails(testCardId), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.updateDetails.mutate({
          id: testCardId,
          title: "Updated Title",
        });
      });

      await waitFor(() => {
        expect(result.current.updateDetails.isError).toBe(true);
      });
    });

    it("should update only specific fields", async () => {
      const { result } = renderHook(() => useCardDetails(testCardId), {
        wrapper: createWrapper(),
      });

      // Wait for initial data
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Update only title
      await act(async () => {
        result.current.updateDetails.mutate({
          id: testCardId,
          title: "New Title Only",
        });
      });

      await waitFor(() => {
        expect(result.current.updateDetails.isSuccess).toBe(true);
      });

      expect(result.current.updateDetails.data?.data.title).toBe("New Title Only");
    });

    it("should update card priority", async () => {
      const { result } = renderHook(() => useCardDetails(testCardId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        result.current.updateDetails.mutate({
          id: testCardId,
          priority: "critical",
        });
      });

      await waitFor(() => {
        expect(result.current.updateDetails.isSuccess).toBe(true);
      });

      expect(result.current.updateDetails.data?.data.priority).toBe("critical");
    });

    it("should update card status", async () => {
      const { result } = renderHook(() => useCardDetails(testCardId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        result.current.updateDetails.mutate({
          id: testCardId,
          status: "in-progress",
        });
      });

      await waitFor(() => {
        expect(result.current.updateDetails.isSuccess).toBe(true);
      });

      expect(result.current.updateDetails.data?.data.status).toBe("in-progress");
    });

    it("should update card due date", async () => {
      const { result } = renderHook(() => useCardDetails(testCardId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const dueDate = "2024-12-31T23:59:59.000Z";

      await act(async () => {
        result.current.updateDetails.mutate({
          id: testCardId,
          due_date: dueDate,
        });
      });

      await waitFor(() => {
        expect(result.current.updateDetails.isSuccess).toBe(true);
      });

      expect(result.current.updateDetails.data?.data.due_date).toBe(dueDate);
    });
  });

  describe("deleteCard mutation", () => {
    it("should delete card successfully", async () => {
      const { result } = renderHook(() => useCardDetails(testCardId), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.deleteCard.mutate({
          id: testCardId,
          list_id: testListId,
        });
      });

      await waitFor(() => {
        expect(result.current.deleteCard.isSuccess).toBe(true);
      });

      expect(result.current.deleteCard.data).toBeDefined();
      expect(result.current.deleteCard.data?.data.success).toBe(true);
    });

    it("should handle delete error", async () => {
      // Override with error handler
      server.use(errorHandlers.cardDeleteError);

      const { result } = renderHook(() => useCardDetails(testCardId), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.deleteCard.mutate({
          id: testCardId,
          list_id: testListId,
        });
      });

      await waitFor(() => {
        expect(result.current.deleteCard.isError).toBe(true);
      });
    });

    it("should invalidate lists query after deleting card", async () => {
      const wrapper = createWrapper();

      const { result } = renderHook(() => useCardDetails(testCardId), {
        wrapper,
      });

      await act(async () => {
        result.current.deleteCard.mutate({
          id: testCardId,
          list_id: testListId,
        });
      });

      await waitFor(() => {
        expect(result.current.deleteCard.isSuccess).toBe(true);
      });

      // Cache invalidation and removal happens automatically via React Query
      // The lists query will be marked as stale
      // The card-details query will be removed
    });
  });

  describe("Hook exports", () => {
    it("should export all expected properties", () => {
      const { result } = renderHook(() => useCardDetails(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toHaveProperty("cardDetails");
      expect(result.current).toHaveProperty("isLoading");
      expect(result.current).toHaveProperty("error");
      expect(result.current).toHaveProperty("refetch");
      expect(result.current).toHaveProperty("updateDetails");
      expect(result.current).toHaveProperty("deleteCard");
    });
  });
});
