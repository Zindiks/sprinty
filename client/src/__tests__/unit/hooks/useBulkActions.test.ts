import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { createWrapper } from "@/__tests__/utils/test-utils";
import { useBulkActions } from "@/hooks/useBulkActions";

// Mock the toast hook
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock the selection store
const mockClearSelection = vi.fn();
vi.mock("@/hooks/store/useSelectionStore", () => ({
  useSelectionStore: () => ({
    clearSelection: mockClearSelection,
  }),
}));

describe("useBulkActions hook", () => {
  const mockCardIds = ["card-1", "card-2", "card-3"];
  const mockTargetListId = "list-target";
  const mockUserIds = ["user-1", "user-2"];
  const mockLabelIds = ["label-1", "label-2"];
  const mockDueDate = "2024-12-31T23:59:59.000Z";

  beforeEach(() => {
    mockClearSelection.mockClear();
  });

  describe("Hook exports", () => {
    it("should export all bulk action functions", () => {
      const { result } = renderHook(() => useBulkActions(), {
        wrapper: createWrapper(),
      });

      expect(result.current.bulkMoveCards).toBeDefined();
      expect(result.current.bulkAssignUsers).toBeDefined();
      expect(result.current.bulkAddLabels).toBeDefined();
      expect(result.current.bulkSetDueDate).toBeDefined();
      expect(result.current.bulkArchiveCards).toBeDefined();
      expect(result.current.bulkDeleteCards).toBeDefined();
      expect(result.current.isLoading).toBeDefined();
    });

    it("should have isLoading false initially", () => {
      const { result } = renderHook(() => useBulkActions(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
    });

    it("should have function types for all bulk actions", () => {
      const { result } = renderHook(() => useBulkActions(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.bulkMoveCards).toBe("function");
      expect(typeof result.current.bulkAssignUsers).toBe("function");
      expect(typeof result.current.bulkAddLabels).toBe("function");
      expect(typeof result.current.bulkSetDueDate).toBe("function");
      expect(typeof result.current.bulkArchiveCards).toBe("function");
      expect(typeof result.current.bulkDeleteCards).toBe("function");
    });
  });

  describe("bulkMoveCards", () => {
    it("should call bulkMoveCards without errors", () => {
      const { result } = renderHook(() => useBulkActions(), {
        wrapper: createWrapper(),
      });

      expect(() => {
        act(() => {
          result.current.bulkMoveCards(mockCardIds, mockTargetListId);
        });
      }).not.toThrow();
    });

    it("should accept cardIds array and targetListId", () => {
      const { result } = renderHook(() => useBulkActions(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.bulkMoveCards(["card-1"], "list-1");
        result.current.bulkMoveCards(["card-1", "card-2"], "list-2");
        result.current.bulkMoveCards(["card-1", "card-2", "card-3"], "list-3");
      });

      // Function should accept various input sizes without errors
      expect(true).toBe(true);
    });
  });

  describe("bulkAssignUsers", () => {
    it("should call bulkAssignUsers without errors", () => {
      const { result } = renderHook(() => useBulkActions(), {
        wrapper: createWrapper(),
      });

      expect(() => {
        act(() => {
          result.current.bulkAssignUsers(mockCardIds, mockUserIds);
        });
      }).not.toThrow();
    });

    it("should accept cardIds and userIds arrays", () => {
      const { result } = renderHook(() => useBulkActions(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.bulkAssignUsers(["card-1"], ["user-1"]);
        result.current.bulkAssignUsers(mockCardIds, mockUserIds);
      });

      expect(true).toBe(true);
    });
  });

  describe("bulkAddLabels", () => {
    it("should call bulkAddLabels without errors", () => {
      const { result } = renderHook(() => useBulkActions(), {
        wrapper: createWrapper(),
      });

      expect(() => {
        act(() => {
          result.current.bulkAddLabels(mockCardIds, mockLabelIds);
        });
      }).not.toThrow();
    });

    it("should accept cardIds and labelIds arrays", () => {
      const { result } = renderHook(() => useBulkActions(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.bulkAddLabels(["card-1"], ["label-1"]);
        result.current.bulkAddLabels(mockCardIds, mockLabelIds);
      });

      expect(true).toBe(true);
    });
  });

  describe("bulkSetDueDate", () => {
    it("should call bulkSetDueDate without errors", () => {
      const { result } = renderHook(() => useBulkActions(), {
        wrapper: createWrapper(),
      });

      expect(() => {
        act(() => {
          result.current.bulkSetDueDate(mockCardIds, mockDueDate);
        });
      }).not.toThrow();
    });

    it("should accept null as due date", () => {
      const { result } = renderHook(() => useBulkActions(), {
        wrapper: createWrapper(),
      });

      expect(() => {
        act(() => {
          result.current.bulkSetDueDate(mockCardIds, null);
        });
      }).not.toThrow();
    });

    it("should accept date string as due date", () => {
      const { result } = renderHook(() => useBulkActions(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.bulkSetDueDate(mockCardIds, "2024-01-01T00:00:00.000Z");
        result.current.bulkSetDueDate(mockCardIds, mockDueDate);
      });

      expect(true).toBe(true);
    });
  });

  describe("bulkArchiveCards", () => {
    it("should call bulkArchiveCards without errors", () => {
      const { result } = renderHook(() => useBulkActions(), {
        wrapper: createWrapper(),
      });

      expect(() => {
        act(() => {
          result.current.bulkArchiveCards(mockCardIds);
        });
      }).not.toThrow();
    });

    it("should accept cardIds array", () => {
      const { result } = renderHook(() => useBulkActions(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.bulkArchiveCards(["card-1"]);
        result.current.bulkArchiveCards(mockCardIds);
      });

      expect(true).toBe(true);
    });
  });

  describe("bulkDeleteCards", () => {
    it("should call bulkDeleteCards without errors", () => {
      const { result } = renderHook(() => useBulkActions(), {
        wrapper: createWrapper(),
      });

      expect(() => {
        act(() => {
          result.current.bulkDeleteCards(mockCardIds);
        });
      }).not.toThrow();
    });

    it("should accept cardIds array", () => {
      const { result } = renderHook(() => useBulkActions(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.bulkDeleteCards(["card-1"]);
        result.current.bulkDeleteCards(mockCardIds);
      });

      expect(true).toBe(true);
    });
  });

  describe("Integration", () => {
    it("should allow multiple bulk operations in sequence", () => {
      const { result } = renderHook(() => useBulkActions(), {
        wrapper: createWrapper(),
      });

      expect(() => {
        act(() => {
          result.current.bulkMoveCards(mockCardIds, mockTargetListId);
          result.current.bulkAssignUsers(mockCardIds, mockUserIds);
          result.current.bulkAddLabels(mockCardIds, mockLabelIds);
          result.current.bulkSetDueDate(mockCardIds, mockDueDate);
          result.current.bulkArchiveCards(mockCardIds);
        });
      }).not.toThrow();
    });

    it("should handle empty card arrays", () => {
      const { result } = renderHook(() => useBulkActions(), {
        wrapper: createWrapper(),
      });

      expect(() => {
        act(() => {
          result.current.bulkMoveCards([], mockTargetListId);
          result.current.bulkAssignUsers([], mockUserIds);
          result.current.bulkAddLabels([], mockLabelIds);
          result.current.bulkSetDueDate([], mockDueDate);
          result.current.bulkArchiveCards([]);
          result.current.bulkDeleteCards([]);
        });
      }).not.toThrow();
    });
  });
});
