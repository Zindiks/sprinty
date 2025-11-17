import { ChecklistService } from "../modules/checklists/checklist.service";
import { ChecklistRepository } from "../modules/checklists/checklist.repository";
import {
  CreateChecklistItem,
  UpdateChecklistItem,
  ToggleChecklistItem,
  DeleteChecklistItem,
  ChecklistItemResponse,
  ChecklistItemResponseArray,
  ChecklistProgress,
  ChecklistWithProgress,
} from "../modules/checklists/checklist.schema";

// Mock the repository
jest.mock("../modules/checklists/checklist.repository");

class MockedChecklistRepository {
  knex = {} as any;
  createChecklistItem = jest.fn();
  updateChecklistItem = jest.fn();
  toggleChecklistItem = jest.fn();
  deleteChecklistItem = jest.fn();
  getChecklistItemById = jest.fn();
  getChecklistItemsByCardId = jest.fn();
  getChecklistProgress = jest.fn();
  getChecklistWithProgress = jest.fn();
  reorderChecklistItems = jest.fn();
}

describe("ChecklistService", () => {
  let checklistService: ChecklistService;
  let checklistRepository: jest.Mocked<ChecklistRepository>;

  beforeEach(() => {
    checklistRepository = new MockedChecklistRepository() as unknown as jest.Mocked<ChecklistRepository>;
    checklistService = new ChecklistService();
    // @ts-ignore - inject mocked repository
    checklistService["checklistRepository"] = checklistRepository;
    jest.clearAllMocks();
  });

  describe("createChecklistItem", () => {
    it("should create checklist item with specified order", async () => {
      const input: CreateChecklistItem = {
        card_id: "card-123",
        title: "Complete documentation",
        order: 0,
      };
      const expectedResponse: ChecklistItemResponse = {
        id: "item-001",
        card_id: "card-123",
        title: "Complete documentation",
        completed: false,
        order: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      checklistRepository.createChecklistItem.mockResolvedValue(expectedResponse);

      const result = await checklistService.createChecklistItem(input);

      expect(checklistRepository.createChecklistItem).toHaveBeenCalledWith(input, undefined);
      expect(result).toEqual(expectedResponse);
      expect(result.completed).toBe(false);
    });

    it("should create checklist item without order (auto-ordering)", async () => {
      const input: CreateChecklistItem = {
        card_id: "card-123",
        title: "Write tests",
      };
      const expectedResponse: ChecklistItemResponse = {
        id: "item-002",
        card_id: "card-123",
        title: "Write tests",
        completed: false,
        order: 1, // Auto-assigned
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      checklistRepository.createChecklistItem.mockResolvedValue(expectedResponse);

      const result = await checklistService.createChecklistItem(input);

      expect(result.order).toBe(1);
    });

    it("should create checklist item with created_by tracking", async () => {
      const input: CreateChecklistItem = {
        card_id: "card-123",
        title: "Deploy to production",
        order: 2,
      };
      const created_by_id = "user-456";
      const expectedResponse: ChecklistItemResponse = {
        id: "item-003",
        card_id: "card-123",
        title: "Deploy to production",
        completed: false,
        order: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      checklistRepository.createChecklistItem.mockResolvedValue(expectedResponse);

      const result = await checklistService.createChecklistItem(input, created_by_id);

      expect(checklistRepository.createChecklistItem).toHaveBeenCalledWith(input, created_by_id);
      expect(result).toEqual(expectedResponse);
    });

    it("should handle maximum title length", async () => {
      const longTitle = "A".repeat(255);
      const input: CreateChecklistItem = {
        card_id: "card-123",
        title: longTitle,
      };
      const expectedResponse: ChecklistItemResponse = {
        id: "item-004",
        card_id: "card-123",
        title: longTitle,
        completed: false,
        order: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      checklistRepository.createChecklistItem.mockResolvedValue(expectedResponse);

      const result = await checklistService.createChecklistItem(input);

      expect(result.title).toHaveLength(255);
    });

    it("should handle database errors during creation", async () => {
      const input: CreateChecklistItem = {
        card_id: "card-123",
        title: "Test item",
      };
      const error = new Error("Database connection failed");

      checklistRepository.createChecklistItem.mockRejectedValue(error);

      await expect(checklistService.createChecklistItem(input)).rejects.toThrow(
        "Database connection failed",
      );
    });
  });

  describe("updateChecklistItem", () => {
    it("should update checklist item title", async () => {
      const input: UpdateChecklistItem = {
        id: "item-001",
        card_id: "card-123",
        title: "Updated title",
      };
      const expectedResponse: ChecklistItemResponse = {
        id: "item-001",
        card_id: "card-123",
        title: "Updated title",
        completed: false,
        order: 0,
        created_at: "2025-01-01T10:00:00Z",
        updated_at: new Date().toISOString(),
      };

      checklistRepository.updateChecklistItem.mockResolvedValue(expectedResponse);

      const result = await checklistService.updateChecklistItem(input);

      expect(checklistRepository.updateChecklistItem).toHaveBeenCalledWith(input);
      expect(result?.title).toBe("Updated title");
    });

    it("should update checklist item completed status", async () => {
      const input: UpdateChecklistItem = {
        id: "item-001",
        card_id: "card-123",
        completed: true,
      };
      const expectedResponse: ChecklistItemResponse = {
        id: "item-001",
        card_id: "card-123",
        title: "Original title",
        completed: true,
        order: 0,
        created_at: "2025-01-01T10:00:00Z",
        updated_at: new Date().toISOString(),
      };

      checklistRepository.updateChecklistItem.mockResolvedValue(expectedResponse);

      const result = await checklistService.updateChecklistItem(input);

      expect(result?.completed).toBe(true);
    });

    it("should update checklist item order", async () => {
      const input: UpdateChecklistItem = {
        id: "item-001",
        card_id: "card-123",
        order: 5,
      };
      const expectedResponse: ChecklistItemResponse = {
        id: "item-001",
        card_id: "card-123",
        title: "Original title",
        completed: false,
        order: 5,
        created_at: "2025-01-01T10:00:00Z",
        updated_at: new Date().toISOString(),
      };

      checklistRepository.updateChecklistItem.mockResolvedValue(expectedResponse);

      const result = await checklistService.updateChecklistItem(input);

      expect(result?.order).toBe(5);
    });

    it("should update multiple fields at once", async () => {
      const input: UpdateChecklistItem = {
        id: "item-001",
        card_id: "card-123",
        title: "New title",
        completed: true,
        order: 3,
      };
      const expectedResponse: ChecklistItemResponse = {
        id: "item-001",
        card_id: "card-123",
        title: "New title",
        completed: true,
        order: 3,
        created_at: "2025-01-01T10:00:00Z",
        updated_at: new Date().toISOString(),
      };

      checklistRepository.updateChecklistItem.mockResolvedValue(expectedResponse);

      const result = await checklistService.updateChecklistItem(input);

      expect(result?.title).toBe("New title");
      expect(result?.completed).toBe(true);
      expect(result?.order).toBe(3);
    });

    it("should return undefined when item not found", async () => {
      const input: UpdateChecklistItem = {
        id: "item-999",
        card_id: "card-123",
        title: "Updated title",
      };

      checklistRepository.updateChecklistItem.mockResolvedValue(undefined);

      const result = await checklistService.updateChecklistItem(input);

      expect(result).toBeUndefined();
    });

    it("should require card_id for security", async () => {
      const input: UpdateChecklistItem = {
        id: "item-001",
        card_id: "card-999",
        title: "Updated title",
      };

      checklistRepository.updateChecklistItem.mockResolvedValue(undefined);

      const result = await checklistService.updateChecklistItem(input);

      expect(result).toBeUndefined();
    });
  });

  describe("toggleChecklistItem", () => {
    it("should toggle item from uncompleted to completed", async () => {
      const input: ToggleChecklistItem = {
        id: "item-001",
        card_id: "card-123",
      };
      const user_id = "user-456";
      const expectedResponse: ChecklistItemResponse = {
        id: "item-001",
        card_id: "card-123",
        title: "Test item",
        completed: true,
        order: 0,
        completed_by: "user-456",
        completed_at: new Date().toISOString(),
        created_at: "2025-01-01T10:00:00Z",
        updated_at: new Date().toISOString(),
      };

      checklistRepository.toggleChecklistItem.mockResolvedValue(expectedResponse);

      const result = await checklistService.toggleChecklistItem(input, user_id);

      expect(checklistRepository.toggleChecklistItem).toHaveBeenCalledWith(input, user_id);
      expect(result?.completed).toBe(true);
      expect(result?.completed_by).toBe("user-456");
      expect(result?.completed_at).toBeDefined();
    });

    it("should toggle item from completed to uncompleted", async () => {
      const input: ToggleChecklistItem = {
        id: "item-001",
        card_id: "card-123",
      };
      const expectedResponse: ChecklistItemResponse = {
        id: "item-001",
        card_id: "card-123",
        title: "Test item",
        completed: false,
        order: 0,
        created_at: "2025-01-01T10:00:00Z",
        updated_at: new Date().toISOString(),
      };

      checklistRepository.toggleChecklistItem.mockResolvedValue(expectedResponse);

      const result = await checklistService.toggleChecklistItem(input);

      expect(result?.completed).toBe(false);
      expect(result?.completed_by).toBeUndefined();
      expect(result?.completed_at).toBeUndefined();
    });

    it("should toggle without user tracking", async () => {
      const input: ToggleChecklistItem = {
        id: "item-001",
        card_id: "card-123",
      };
      const expectedResponse: ChecklistItemResponse = {
        id: "item-001",
        card_id: "card-123",
        title: "Test item",
        completed: true,
        order: 0,
        completed_at: new Date().toISOString(),
        created_at: "2025-01-01T10:00:00Z",
        updated_at: new Date().toISOString(),
      };

      checklistRepository.toggleChecklistItem.mockResolvedValue(expectedResponse);

      const result = await checklistService.toggleChecklistItem(input);

      expect(checklistRepository.toggleChecklistItem).toHaveBeenCalledWith(input, undefined);
      expect(result?.completed).toBe(true);
      expect(result?.completed_by).toBeUndefined();
    });

    it("should return undefined when item not found", async () => {
      const input: ToggleChecklistItem = {
        id: "item-999",
        card_id: "card-123",
      };

      checklistRepository.toggleChecklistItem.mockResolvedValue(undefined);

      const result = await checklistService.toggleChecklistItem(input);

      expect(result).toBeUndefined();
    });
  });

  describe("deleteChecklistItem", () => {
    it("should delete checklist item successfully", async () => {
      const input: DeleteChecklistItem = {
        id: "item-001",
        card_id: "card-123",
      };

      checklistRepository.deleteChecklistItem.mockResolvedValue(true);

      const result = await checklistService.deleteChecklistItem(input);

      expect(checklistRepository.deleteChecklistItem).toHaveBeenCalledWith(input);
      expect(result).toBe(true);
    });

    it("should return false when item not found", async () => {
      const input: DeleteChecklistItem = {
        id: "item-999",
        card_id: "card-123",
      };

      checklistRepository.deleteChecklistItem.mockResolvedValue(false);

      const result = await checklistService.deleteChecklistItem(input);

      expect(result).toBe(false);
    });

    it("should require card_id for security", async () => {
      const input: DeleteChecklistItem = {
        id: "item-001",
        card_id: "card-999",
      };

      checklistRepository.deleteChecklistItem.mockResolvedValue(false);

      const result = await checklistService.deleteChecklistItem(input);

      expect(result).toBe(false);
    });
  });

  describe("getChecklistItemById", () => {
    it("should return checklist item when found", async () => {
      const id = "item-001";
      const card_id = "card-123";
      const expectedResponse: ChecklistItemResponse = {
        id: "item-001",
        card_id: "card-123",
        title: "Test item",
        completed: false,
        order: 0,
        created_at: "2025-01-01T10:00:00Z",
        updated_at: "2025-01-01T10:00:00Z",
      };

      checklistRepository.getChecklistItemById.mockResolvedValue(expectedResponse);

      const result = await checklistService.getChecklistItemById(id, card_id);

      expect(checklistRepository.getChecklistItemById).toHaveBeenCalledWith(id, card_id);
      expect(result).toEqual(expectedResponse);
    });

    it("should return undefined when item not found", async () => {
      const id = "item-999";
      const card_id = "card-123";

      checklistRepository.getChecklistItemById.mockResolvedValue(undefined);

      const result = await checklistService.getChecklistItemById(id, card_id);

      expect(result).toBeUndefined();
    });

    it("should require both id and card_id for security", async () => {
      const id = "item-001";
      const card_id = "card-999";

      checklistRepository.getChecklistItemById.mockResolvedValue(undefined);

      const result = await checklistService.getChecklistItemById(id, card_id);

      expect(result).toBeUndefined();
    });
  });

  describe("getChecklistItemsByCardId", () => {
    it("should return all checklist items for card", async () => {
      const card_id = "card-123";
      const expectedItems: ChecklistItemResponseArray = [
        {
          id: "item-001",
          card_id: "card-123",
          title: "First item",
          completed: false,
          order: 0,
          created_at: "2025-01-01T10:00:00Z",
          updated_at: "2025-01-01T10:00:00Z",
        },
        {
          id: "item-002",
          card_id: "card-123",
          title: "Second item",
          completed: true,
          order: 1,
          completed_by: "user-456",
          completed_at: "2025-01-02T10:00:00Z",
          created_at: "2025-01-01T11:00:00Z",
          updated_at: "2025-01-02T10:00:00Z",
        },
      ];

      checklistRepository.getChecklistItemsByCardId.mockResolvedValue(expectedItems);

      const result = await checklistService.getChecklistItemsByCardId(card_id);

      expect(checklistRepository.getChecklistItemsByCardId).toHaveBeenCalledWith(card_id);
      expect(result).toEqual(expectedItems);
      expect(result).toHaveLength(2);
    });

    it("should return empty array when card has no items", async () => {
      const card_id = "card-empty";

      checklistRepository.getChecklistItemsByCardId.mockResolvedValue([]);

      const result = await checklistService.getChecklistItemsByCardId(card_id);

      expect(result).toEqual([]);
    });

    it("should return items ordered by order field", async () => {
      const card_id = "card-123";
      const expectedItems: ChecklistItemResponseArray = [
        {
          id: "item-001",
          card_id: "card-123",
          title: "First",
          completed: false,
          order: 0,
          created_at: "2025-01-01T10:00:00Z",
          updated_at: "2025-01-01T10:00:00Z",
        },
        {
          id: "item-002",
          card_id: "card-123",
          title: "Second",
          completed: false,
          order: 1,
          created_at: "2025-01-01T11:00:00Z",
          updated_at: "2025-01-01T11:00:00Z",
        },
        {
          id: "item-003",
          card_id: "card-123",
          title: "Third",
          completed: false,
          order: 2,
          created_at: "2025-01-01T12:00:00Z",
          updated_at: "2025-01-01T12:00:00Z",
        },
      ];

      checklistRepository.getChecklistItemsByCardId.mockResolvedValue(expectedItems);

      const result = await checklistService.getChecklistItemsByCardId(card_id);

      expect(result[0].order).toBe(0);
      expect(result[1].order).toBe(1);
      expect(result[2].order).toBe(2);
    });
  });

  describe("getChecklistProgress", () => {
    it("should calculate progress correctly", async () => {
      const card_id = "card-123";
      const expectedProgress: ChecklistProgress = {
        total: 5,
        completed: 3,
        percentage: 60,
      };

      checklistRepository.getChecklistProgress.mockResolvedValue(expectedProgress);

      const result = await checklistService.getChecklistProgress(card_id);

      expect(checklistRepository.getChecklistProgress).toHaveBeenCalledWith(card_id);
      expect(result).toEqual(expectedProgress);
      expect(result.percentage).toBe(60);
    });

    it("should return zero progress when no items", async () => {
      const card_id = "card-empty";
      const expectedProgress: ChecklistProgress = {
        total: 0,
        completed: 0,
        percentage: 0,
      };

      checklistRepository.getChecklistProgress.mockResolvedValue(expectedProgress);

      const result = await checklistService.getChecklistProgress(card_id);

      expect(result.total).toBe(0);
      expect(result.percentage).toBe(0);
    });

    it("should calculate 100% completion", async () => {
      const card_id = "card-123";
      const expectedProgress: ChecklistProgress = {
        total: 4,
        completed: 4,
        percentage: 100,
      };

      checklistRepository.getChecklistProgress.mockResolvedValue(expectedProgress);

      const result = await checklistService.getChecklistProgress(card_id);

      expect(result.percentage).toBe(100);
    });

    it("should calculate 0% completion when nothing completed", async () => {
      const card_id = "card-123";
      const expectedProgress: ChecklistProgress = {
        total: 10,
        completed: 0,
        percentage: 0,
      };

      checklistRepository.getChecklistProgress.mockResolvedValue(expectedProgress);

      const result = await checklistService.getChecklistProgress(card_id);

      expect(result.percentage).toBe(0);
      expect(result.total).toBe(10);
    });
  });

  describe("getChecklistWithProgress", () => {
    it("should return items and progress together", async () => {
      const card_id = "card-123";
      const expectedResponse: ChecklistWithProgress = {
        items: [
          {
            id: "item-001",
            card_id: "card-123",
            title: "First item",
            completed: true,
            order: 0,
            completed_by: "user-456",
            completed_at: "2025-01-01T12:00:00Z",
            created_at: "2025-01-01T10:00:00Z",
            updated_at: "2025-01-01T12:00:00Z",
          },
          {
            id: "item-002",
            card_id: "card-123",
            title: "Second item",
            completed: false,
            order: 1,
            created_at: "2025-01-01T11:00:00Z",
            updated_at: "2025-01-01T11:00:00Z",
          },
        ],
        progress: {
          total: 2,
          completed: 1,
          percentage: 50,
        },
      };

      checklistRepository.getChecklistWithProgress.mockResolvedValue(expectedResponse);

      const result = await checklistService.getChecklistWithProgress(card_id);

      expect(checklistRepository.getChecklistWithProgress).toHaveBeenCalledWith(card_id);
      expect(result.items).toHaveLength(2);
      expect(result.progress.total).toBe(2);
      expect(result.progress.completed).toBe(1);
      expect(result.progress.percentage).toBe(50);
    });

    it("should return empty items and zero progress", async () => {
      const card_id = "card-empty";
      const expectedResponse: ChecklistWithProgress = {
        items: [],
        progress: {
          total: 0,
          completed: 0,
          percentage: 0,
        },
      };

      checklistRepository.getChecklistWithProgress.mockResolvedValue(expectedResponse);

      const result = await checklistService.getChecklistWithProgress(card_id);

      expect(result.items).toEqual([]);
      expect(result.progress.percentage).toBe(0);
    });
  });

  describe("reorderChecklistItems", () => {
    it("should reorder checklist items successfully", async () => {
      const card_id = "card-123";
      const itemOrders = [
        { id: "item-001", order: 2 },
        { id: "item-002", order: 0 },
        { id: "item-003", order: 1 },
      ];

      checklistRepository.reorderChecklistItems.mockResolvedValue(undefined);

      await checklistService.reorderChecklistItems(card_id, itemOrders);

      expect(checklistRepository.reorderChecklistItems).toHaveBeenCalledWith(card_id, itemOrders);
    });

    it("should handle reordering single item", async () => {
      const card_id = "card-123";
      const itemOrders = [{ id: "item-001", order: 5 }];

      checklistRepository.reorderChecklistItems.mockResolvedValue(undefined);

      await checklistService.reorderChecklistItems(card_id, itemOrders);

      expect(checklistRepository.reorderChecklistItems).toHaveBeenCalledWith(card_id, itemOrders);
    });

    it("should handle reordering many items", async () => {
      const card_id = "card-123";
      const itemOrders = Array.from({ length: 20 }, (_, i) => ({
        id: `item-${String(i + 1).padStart(3, "0")}`,
        order: 19 - i, // Reverse order
      }));

      checklistRepository.reorderChecklistItems.mockResolvedValue(undefined);

      await checklistService.reorderChecklistItems(card_id, itemOrders);

      expect(checklistRepository.reorderChecklistItems).toHaveBeenCalledWith(card_id, itemOrders);
    });

    it("should handle transaction errors during reordering", async () => {
      const card_id = "card-123";
      const itemOrders = [
        { id: "item-001", order: 1 },
        { id: "item-002", order: 0 },
      ];
      const error = new Error("Transaction failed");

      checklistRepository.reorderChecklistItems.mockRejectedValue(error);

      await expect(
        checklistService.reorderChecklistItems(card_id, itemOrders),
      ).rejects.toThrow("Transaction failed");
    });
  });
});
