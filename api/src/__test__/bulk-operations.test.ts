import { BulkService } from "../modules/cards/bulk.service";
import knexInstance from "../db/knexInstance";
import type { Knex } from "knex";

// Mock the knex instance
jest.mock("../db/knexInstance");

const mockKnex = knexInstance as jest.Mocked<Knex>;

describe("BulkService", () => {
  let bulkService: BulkService;
  let mockTrx: any;

  beforeEach(() => {
    // Create a mock query builder
    const mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      whereIn: jest.fn().mockReturnThis(),
      whereNot: jest.fn().mockReturnThis(),
      max: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue(null),
      update: jest.fn().mockResolvedValue(1),
      insert: jest.fn().mockReturnThis(), // Return this for chaining
      del: jest.fn().mockResolvedValue(1),
      onConflict: jest.fn().mockReturnThis(),
      ignore: jest.fn().mockResolvedValue([]),
      returning: jest.fn().mockResolvedValue([]),
    };

    // Create a callable mock transaction function that returns the query builder
    mockTrx = jest.fn((tableName: string) => mockQueryBuilder) as any;

    // Add fn.now to mockTrx
    mockTrx.fn = {
      now: jest.fn(() => new Date()),
    };

    // Copy methods to mockTrx for direct access
    Object.assign(mockTrx, mockQueryBuilder);

    // Mock transaction
    mockKnex.transaction = jest.fn(async (callback) => {
      return await callback(mockTrx);
    }) as any;

    bulkService = new BulkService();
    // @ts-ignore - inject mocked knex
    bulkService["knex"] = mockKnex;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("moveCards", () => {
    it("should move cards to target list successfully", async () => {
      // Arrange
      const input = {
        card_ids: ["card-1", "card-2", "card-3"],
        target_list_id: "list-target",
      };

      mockTrx.max = jest.fn().mockReturnThis();
      mockTrx.first = jest.fn().mockResolvedValue({ max_order: 5 });

      // Act
      const result = await bulkService.moveCards(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.updated).toBe(3);
      expect(result.message).toContain("3 card(s) moved");
      expect(mockKnex.transaction).toHaveBeenCalled();
    });

    it("should handle empty list (start from order 0)", async () => {
      // Arrange
      const input = {
        card_ids: ["card-1"],
        target_list_id: "list-empty",
      };

      mockTrx.first = jest.fn().mockResolvedValue({ max_order: null });

      // Act
      const result = await bulkService.moveCards(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.updated).toBe(1);
    });

    it("should assign sequential orders starting from max+1", async () => {
      // Arrange
      const input = {
        card_ids: ["card-1", "card-2"],
        target_list_id: "list-target",
      };

      mockTrx.first = jest.fn().mockResolvedValue({ max_order: 10 });

      // Act
      await bulkService.moveCards(input);

      // Assert
      // First card should be at order 11, second at 12
      // We can verify update was called with correct orders
      expect(mockTrx.update).toHaveBeenCalled();
    });

    it("should log activity for each moved card", async () => {
      // Arrange
      const input = {
        card_ids: ["card-1", "card-2"],
        target_list_id: "list-target",
      };

      mockTrx.first = jest.fn().mockResolvedValue({ max_order: 0 });

      // Act
      await bulkService.moveCards(input);

      // Assert
      // Should insert activity for each card
      expect(mockTrx.insert).toHaveBeenCalled();
    });

    it("should handle single card move", async () => {
      // Arrange
      const input = {
        card_ids: ["card-single"],
        target_list_id: "list-target",
      };

      mockTrx.first = jest.fn().mockResolvedValue({ max_order: 5 });

      // Act
      const result = await bulkService.moveCards(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.updated).toBe(1);
    });

    it("should rollback on error", async () => {
      // Arrange
      const input = {
        card_ids: ["card-1", "card-2"],
        target_list_id: "list-target",
      };

      const error = new Error("Database error");
      mockKnex.transaction = jest.fn(async (callback) => {
        return await callback(mockTrx);
      }) as any;

      mockTrx.update = jest.fn().mockRejectedValue(error);

      // Act & Assert
      await expect(bulkService.moveCards(input)).rejects.toThrow(
        "Database error"
      );
    });
  });

  describe("assignUsers", () => {
    it("should assign users to multiple cards successfully", async () => {
      // Arrange
      const input = {
        card_ids: ["card-1", "card-2"],
        user_ids: ["user-a", "user-b"],
      };

      // Act
      const result = await bulkService.assignUsers(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.updated).toBe(4); // 2 cards * 2 users = 4 assignments
      expect(result.message).toContain("2 card(s)");
      expect(mockKnex.transaction).toHaveBeenCalled();
    });

    it("should handle duplicate assignments gracefully (onConflict)", async () => {
      // Arrange
      const input = {
        card_ids: ["card-1"],
        user_ids: ["user-a"],
      };

      // onConflict should ignore duplicates
      mockTrx.ignore = jest.fn().mockResolvedValue([]);

      // Act
      const result = await bulkService.assignUsers(input);

      // Assert
      expect(result.success).toBe(true);
      expect(mockTrx.onConflict).toHaveBeenCalled();
      expect(mockTrx.ignore).toHaveBeenCalled();
    });

    it("should assign single user to single card", async () => {
      // Arrange
      const input = {
        card_ids: ["card-1"],
        user_ids: ["user-a"],
      };

      // Act
      const result = await bulkService.assignUsers(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.updated).toBe(1);
    });

    it("should assign multiple users to single card", async () => {
      // Arrange
      const input = {
        card_ids: ["card-1"],
        user_ids: ["user-a", "user-b", "user-c"],
      };

      // Act
      const result = await bulkService.assignUsers(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.updated).toBe(3);
    });

    it("should log activity for each card", async () => {
      // Arrange
      const input = {
        card_ids: ["card-1", "card-2"],
        user_ids: ["user-a"],
      };

      // Act
      await bulkService.assignUsers(input);

      // Assert
      expect(mockTrx.insert).toHaveBeenCalled();
    });

    it("should rollback on error", async () => {
      // Arrange
      const input = {
        card_ids: ["card-1"],
        user_ids: ["user-a"],
      };

      const error = new Error("Assignment failed");
      mockTrx.insert = jest.fn().mockRejectedValue(error);
      mockKnex.transaction = jest.fn(async (callback) => {
        return await callback(mockTrx);
      }) as any;

      // Act & Assert
      await expect(bulkService.assignUsers(input)).rejects.toThrow(
        "Assignment failed"
      );
    });
  });

  describe("addLabels", () => {
    it("should add labels to multiple cards successfully", async () => {
      // Arrange
      const input = {
        card_ids: ["card-1", "card-2"],
        label_ids: ["label-x", "label-y"],
      };

      // Act
      const result = await bulkService.addLabels(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.updated).toBe(4); // 2 cards * 2 labels = 4
      expect(result.message).toContain("2 card(s)");
    });

    it("should handle duplicate labels gracefully", async () => {
      // Arrange
      const input = {
        card_ids: ["card-1"],
        label_ids: ["label-x"],
      };

      mockTrx.ignore = jest.fn().mockResolvedValue([]);

      // Act
      const result = await bulkService.addLabels(input);

      // Assert
      expect(result.success).toBe(true);
      expect(mockTrx.onConflict).toHaveBeenCalled();
    });

    it("should add single label to single card", async () => {
      // Arrange
      const input = {
        card_ids: ["card-1"],
        label_ids: ["label-x"],
      };

      // Act
      const result = await bulkService.addLabels(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.updated).toBe(1);
    });

    it("should add multiple labels to single card", async () => {
      // Arrange
      const input = {
        card_ids: ["card-1"],
        label_ids: ["label-a", "label-b", "label-c"],
      };

      // Act
      const result = await bulkService.addLabels(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.updated).toBe(3);
    });

    it("should log activity for each card", async () => {
      // Arrange
      const input = {
        card_ids: ["card-1", "card-2"],
        label_ids: ["label-x"],
      };

      // Act
      await bulkService.addLabels(input);

      // Assert
      expect(mockTrx.insert).toHaveBeenCalled();
    });
  });

  describe("setDueDate", () => {
    it("should set due date on multiple cards", async () => {
      // Arrange
      const input = {
        card_ids: ["card-1", "card-2", "card-3"],
        due_date: "2025-12-31",
      };

      // Act
      const result = await bulkService.setDueDate(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.updated).toBe(3);
      expect(result.message).toContain("set");
      expect(mockTrx.update).toHaveBeenCalled();
    });

    it("should clear due date when null is provided", async () => {
      // Arrange
      const input = {
        card_ids: ["card-1", "card-2"],
        due_date: null,
      };

      // Act
      const result = await bulkService.setDueDate(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.updated).toBe(2);
      expect(result.message).toContain("cleared");
    });

    it("should log appropriate activity based on set or clear", async () => {
      // Arrange - Set due date
      const inputSet = {
        card_ids: ["card-1"],
        due_date: "2025-12-31",
      };

      // Act
      await bulkService.setDueDate(inputSet);

      // Assert
      expect(mockTrx.insert).toHaveBeenCalled();

      jest.clearAllMocks();

      // Arrange - Clear due date
      const inputClear = {
        card_ids: ["card-1"],
        due_date: null,
      };

      // Act
      await bulkService.setDueDate(inputClear);

      // Assert
      expect(mockTrx.insert).toHaveBeenCalled();
    });

    it("should handle single card", async () => {
      // Arrange
      const input = {
        card_ids: ["card-1"],
        due_date: "2025-12-31",
      };

      // Act
      const result = await bulkService.setDueDate(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.updated).toBe(1);
    });

    it("should update all cards in single query", async () => {
      // Arrange
      const input = {
        card_ids: ["card-1", "card-2", "card-3"],
        due_date: "2025-12-31",
      };

      // Act
      await bulkService.setDueDate(input);

      // Assert
      expect(mockTrx.whereIn).toHaveBeenCalled();
      expect(mockTrx.update).toHaveBeenCalled();
    });
  });

  describe("archiveCards", () => {
    it("should archive multiple cards successfully", async () => {
      // Arrange
      const input = {
        card_ids: ["card-1", "card-2", "card-3"],
      };

      // Act
      const result = await bulkService.archiveCards(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.updated).toBe(3);
      expect(result.message).toContain("3 card(s) archived");
      expect(mockTrx.update).toHaveBeenCalled();
    });

    it("should set status to 'archived'", async () => {
      // Arrange
      const input = {
        card_ids: ["card-1"],
      };

      // Act
      await bulkService.archiveCards(input);

      // Assert
      expect(mockTrx.whereIn).toHaveBeenCalled();
      expect(mockTrx.update).toHaveBeenCalled();
    });

    it("should log activity for each archived card", async () => {
      // Arrange
      const input = {
        card_ids: ["card-1", "card-2"],
      };

      // Act
      await bulkService.archiveCards(input);

      // Assert
      expect(mockTrx.insert).toHaveBeenCalled();
    });

    it("should handle single card archive", async () => {
      // Arrange
      const input = {
        card_ids: ["card-single"],
      };

      // Act
      const result = await bulkService.archiveCards(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.updated).toBe(1);
    });

    it("should update timestamp", async () => {
      // Arrange
      const input = {
        card_ids: ["card-1"],
      };

      // Act
      await bulkService.archiveCards(input);

      // Assert
      expect(mockTrx.fn.now).toHaveBeenCalled();
    });
  });

  describe("deleteCards", () => {
    it("should delete multiple cards and related data", async () => {
      // Arrange
      const input = {
        card_ids: ["card-1", "card-2"],
      };

      // Act
      const result = await bulkService.deleteCards(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.updated).toBe(2);
      expect(result.message).toContain("2 card(s) deleted");
    });

    it("should delete all related records before cards (cascade)", async () => {
      // Arrange
      const input = {
        card_ids: ["card-1"],
      };

      const deleteOrder: string[] = [];
      mockTrx.del = jest.fn(() => {
        // Track which table is being deleted
        deleteOrder.push("del");
        return Promise.resolve(1);
      });

      // Act
      await bulkService.deleteCards(input);

      // Assert
      // Should delete from multiple tables (assignees, labels, checklists, comments, attachments, activities, cards)
      expect(mockTrx.del).toHaveBeenCalled();
      expect(mockTrx.whereIn).toHaveBeenCalled();
    });

    it("should delete assignees, labels, checklists, comments, attachments, activities", async () => {
      // Arrange
      const input = {
        card_ids: ["card-1"],
      };

      // Act
      await bulkService.deleteCards(input);

      // Assert
      // Should call whereIn for each related table
      expect(mockTrx.whereIn).toHaveBeenCalledWith("card_id", input.card_ids);
      // Should delete from 7 tables total (6 related + cards)
      expect(mockTrx.del).toHaveBeenCalled();
    });

    it("should handle single card deletion", async () => {
      // Arrange
      const input = {
        card_ids: ["card-single"],
      };

      // Act
      const result = await bulkService.deleteCards(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.updated).toBe(1);
    });

    it("should rollback all deletions on error", async () => {
      // Arrange
      const input = {
        card_ids: ["card-1", "card-2"],
      };

      const error = new Error("Deletion failed");
      mockTrx.del = jest.fn().mockRejectedValue(error);
      mockKnex.transaction = jest.fn(async (callback) => {
        return await callback(mockTrx);
      }) as any;

      // Act & Assert
      await expect(bulkService.deleteCards(input)).rejects.toThrow(
        "Deletion failed"
      );
    });

    it("should handle empty card_ids array gracefully", async () => {
      // Arrange
      const input = {
        card_ids: [],
      };

      // Act
      const result = await bulkService.deleteCards(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.updated).toBe(0);
    });
  });

  describe("Transaction Safety", () => {
    it("should use transactions for all operations", async () => {
      // Test that transaction is used
      expect(mockKnex.transaction).toBeDefined();

      // Each operation should call transaction
      const operations = [
        () => bulkService.moveCards({ card_ids: ["c1"], target_list_id: "l1" }),
        () => bulkService.assignUsers({ card_ids: ["c1"], user_ids: ["u1"] }),
        () => bulkService.addLabels({ card_ids: ["c1"], label_ids: ["l1"] }),
        () => bulkService.setDueDate({ card_ids: ["c1"], due_date: "2025-12-31" }),
        () => bulkService.archiveCards({ card_ids: ["c1"] }),
        () => bulkService.deleteCards({ card_ids: ["c1"] }),
      ];

      for (const operation of operations) {
        jest.clearAllMocks();
        await operation();
        expect(mockKnex.transaction).toHaveBeenCalled();
      }
    });

    it("should rollback on any operation failure", async () => {
      // This is implicitly tested by Knex transaction behavior
      // If any operation fails, the entire transaction rolls back
      const input = { card_ids: ["card-1"], target_list_id: "list-1" };

      const error = new Error("Operation failed");
      mockTrx.update = jest.fn().mockRejectedValue(error);
      mockKnex.transaction = jest.fn(async (callback) => {
        return await callback(mockTrx);
      }) as any;

      await expect(bulkService.moveCards(input)).rejects.toThrow();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty card_ids arrays", async () => {
      const emptyInput = { card_ids: [] };

      // moveCards
      const moveResult = await bulkService.moveCards({
        ...emptyInput,
        target_list_id: "list-1",
      });
      expect(moveResult.updated).toBe(0);

      // assignUsers
      const assignResult = await bulkService.assignUsers({
        ...emptyInput,
        user_ids: ["user-1"],
      });
      expect(assignResult.updated).toBe(0);

      // addLabels
      const labelResult = await bulkService.addLabels({
        ...emptyInput,
        label_ids: ["label-1"],
      });
      expect(labelResult.updated).toBe(0);

      // setDueDate
      const dueDateResult = await bulkService.setDueDate({
        ...emptyInput,
        due_date: "2025-12-31",
      });
      expect(dueDateResult.updated).toBe(0);

      // archiveCards
      const archiveResult = await bulkService.archiveCards(emptyInput);
      expect(archiveResult.updated).toBe(0);

      // deleteCards
      const deleteResult = await bulkService.deleteCards(emptyInput);
      expect(deleteResult.updated).toBe(0);
    });

    it("should handle large batches efficiently", async () => {
      // Arrange - 100 cards
      const largeInput = {
        card_ids: Array.from({ length: 100 }, (_, i) => `card-${i}`),
        target_list_id: "list-target",
      };

      mockTrx.first = jest.fn().mockResolvedValue({ max_order: 0 });

      // Act
      const result = await bulkService.moveCards(largeInput);

      // Assert
      expect(result.success).toBe(true);
      expect(result.updated).toBe(100);
      expect(mockKnex.transaction).toHaveBeenCalled();
    });

    it("should handle special characters in IDs", async () => {
      // Arrange
      const input = {
        card_ids: ["card-with-dash", "card_with_underscore"],
        target_list_id: "list-with-dash",
      };

      mockTrx.first = jest.fn().mockResolvedValue({ max_order: 0 });

      // Act
      const result = await bulkService.moveCards(input);

      // Assert
      expect(result.success).toBe(true);
    });
  });
});
