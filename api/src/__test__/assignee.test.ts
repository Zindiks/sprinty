import { AssigneeService } from "../modules/assignees/assignee.service";
import { AssigneeRepository } from "../modules/assignees/assignee.repository";
import {
  AddAssignee,
  RemoveAssignee,
  AssigneeResponse,
  AssigneeResponseArray,
  AssigneeWithUserDetailsArray,
} from "../modules/assignees/assignee.schema";

// Mock the repository
jest.mock("../modules/assignees/assignee.repository");

class MockedAssigneeRepository {
  knex = {} as unknown;
  addAssignee = jest.fn();
  removeAssignee = jest.fn();
  getAssigneesByCardId = jest.fn();
  getAssigneesWithUserDetails = jest.fn();
  isUserAssigned = jest.fn();
  getCardIdsByUserId = jest.fn();
}

describe("AssigneeService", () => {
  let assigneeService: AssigneeService;
  let assigneeRepository: jest.Mocked<AssigneeRepository>;

  beforeEach(() => {
    assigneeRepository =
      new MockedAssigneeRepository() as unknown as jest.Mocked<AssigneeRepository>;
    assigneeService = new AssigneeService();
    // @ts-expect-error - inject mocked repository
    assigneeService["assigneeRepository"] = assigneeRepository;
    jest.clearAllMocks();
  });

  describe("addAssignee", () => {
    it("should add assignee to card successfully", async () => {
      const input: AddAssignee = {
        card_id: "card-123",
        user_id: "user-456",
      };
      const assigned_by_id = "admin-789";
      const expectedResponse: AssigneeResponse = {
        id: "assignee-001",
        card_id: "card-123",
        user_id: "user-456",
        assigned_by: "admin-789",
        assigned_at: new Date().toISOString(),
      };

      assigneeRepository.addAssignee.mockResolvedValue(expectedResponse);

      const result = await assigneeService.addAssignee(input, assigned_by_id);

      expect(assigneeRepository.addAssignee).toHaveBeenCalledWith(
        input,
        assigned_by_id,
      );
      expect(result).toEqual(expectedResponse);
    });

    it("should add assignee without assigned_by tracking", async () => {
      const input: AddAssignee = {
        card_id: "card-123",
        user_id: "user-456",
      };
      const expectedResponse: AssigneeResponse = {
        id: "assignee-001",
        card_id: "card-123",
        user_id: "user-456",
        assigned_at: new Date().toISOString(),
      };

      assigneeRepository.addAssignee.mockResolvedValue(expectedResponse);

      const result = await assigneeService.addAssignee(input);

      expect(assigneeRepository.addAssignee).toHaveBeenCalledWith(
        input,
        undefined,
      );
      expect(result).toEqual(expectedResponse);
      expect(result.assigned_by).toBeUndefined();
    });

    it("should return existing assignee if already assigned (duplicate prevention)", async () => {
      const input: AddAssignee = {
        card_id: "card-123",
        user_id: "user-456",
      };
      const existingAssignee: AssigneeResponse = {
        id: "assignee-001",
        card_id: "card-123",
        user_id: "user-456",
        assigned_at: "2025-01-01T10:00:00Z",
      };

      assigneeRepository.addAssignee.mockResolvedValue(existingAssignee);

      const result = await assigneeService.addAssignee(input);

      expect(result).toEqual(existingAssignee);
    });

    it("should handle database errors during addition", async () => {
      const input: AddAssignee = {
        card_id: "card-123",
        user_id: "user-456",
      };
      const error = new Error("Database connection failed");

      assigneeRepository.addAssignee.mockRejectedValue(error);

      await expect(assigneeService.addAssignee(input)).rejects.toThrow(
        "Database connection failed",
      );
    });
  });

  describe("removeAssignee", () => {
    it("should remove assignee from card successfully", async () => {
      const input: RemoveAssignee = {
        card_id: "card-123",
        user_id: "user-456",
      };

      assigneeRepository.removeAssignee.mockResolvedValue(true);

      const result = await assigneeService.removeAssignee(input);

      expect(assigneeRepository.removeAssignee).toHaveBeenCalledWith(input);
      expect(result).toBe(true);
    });

    it("should return false when assignee not found", async () => {
      const input: RemoveAssignee = {
        card_id: "card-123",
        user_id: "user-999",
      };

      assigneeRepository.removeAssignee.mockResolvedValue(false);

      const result = await assigneeService.removeAssignee(input);

      expect(result).toBe(false);
    });

    it("should handle removing non-existent assignment gracefully", async () => {
      const input: RemoveAssignee = {
        card_id: "card-999",
        user_id: "user-999",
      };

      assigneeRepository.removeAssignee.mockResolvedValue(false);

      const result = await assigneeService.removeAssignee(input);

      expect(result).toBe(false);
    });
  });

  describe("getAssigneesByCardId", () => {
    it("should return all assignees for a card", async () => {
      const card_id = "card-123";
      const expectedAssignees: AssigneeResponseArray = [
        {
          id: "assignee-001",
          card_id: "card-123",
          user_id: "user-456",
          assigned_at: "2025-01-01T10:00:00Z",
        },
        {
          id: "assignee-002",
          card_id: "card-123",
          user_id: "user-789",
          assigned_by: "admin-001",
          assigned_at: "2025-01-02T10:00:00Z",
        },
      ];

      assigneeRepository.getAssigneesByCardId.mockResolvedValue(
        expectedAssignees,
      );

      const result = await assigneeService.getAssigneesByCardId(card_id);

      expect(assigneeRepository.getAssigneesByCardId).toHaveBeenCalledWith(
        card_id,
      );
      expect(result).toEqual(expectedAssignees);
      expect(result).toHaveLength(2);
    });

    it("should return empty array when card has no assignees", async () => {
      const card_id = "card-empty";

      assigneeRepository.getAssigneesByCardId.mockResolvedValue([]);

      const result = await assigneeService.getAssigneesByCardId(card_id);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should return assignees ordered by assigned_at", async () => {
      const card_id = "card-123";
      const expectedAssignees: AssigneeResponseArray = [
        {
          id: "assignee-001",
          card_id: "card-123",
          user_id: "user-456",
          assigned_at: "2025-01-01T10:00:00Z",
        },
        {
          id: "assignee-002",
          card_id: "card-123",
          user_id: "user-789",
          assigned_at: "2025-01-02T10:00:00Z",
        },
        {
          id: "assignee-003",
          card_id: "card-123",
          user_id: "user-999",
          assigned_at: "2025-01-03T10:00:00Z",
        },
      ];

      assigneeRepository.getAssigneesByCardId.mockResolvedValue(
        expectedAssignees,
      );

      const result = await assigneeService.getAssigneesByCardId(card_id);

      // Verify chronological order
      expect(result[0].assigned_at).toBe("2025-01-01T10:00:00Z");
      expect(result[1].assigned_at).toBe("2025-01-02T10:00:00Z");
      expect(result[2].assigned_at).toBe("2025-01-03T10:00:00Z");
    });
  });

  describe("getAssigneesWithUserDetails", () => {
    it("should return assignees with user information", async () => {
      const card_id = "card-123";
      const expectedAssignees: AssigneeWithUserDetailsArray = [
        {
          id: "assignee-001",
          card_id: "card-123",
          user_id: "user-456",
          assigned_at: "2025-01-01T10:00:00Z",
          user: {
            id: "user-456",
            email: "john@example.com",
            username: "johndoe",
          },
        },
        {
          id: "assignee-002",
          card_id: "card-123",
          user_id: "user-789",
          assigned_by: "admin-001",
          assigned_at: "2025-01-02T10:00:00Z",
          user: {
            id: "user-789",
            email: "jane@example.com",
            username: "janedoe",
          },
        },
      ];

      assigneeRepository.getAssigneesWithUserDetails.mockResolvedValue(
        expectedAssignees,
      );

      const result = await assigneeService.getAssigneesWithUserDetails(card_id);

      expect(
        assigneeRepository.getAssigneesWithUserDetails,
      ).toHaveBeenCalledWith(card_id);
      expect(result).toEqual(expectedAssignees);
      expect(result[0].user).toBeDefined();
      expect(result[0].user.email).toBe("john@example.com");
      expect(result[0].user.username).toBe("johndoe");
    });

    it("should return empty array when card has no assignees", async () => {
      const card_id = "card-empty";

      assigneeRepository.getAssigneesWithUserDetails.mockResolvedValue([]);

      const result = await assigneeService.getAssigneesWithUserDetails(card_id);

      expect(result).toEqual([]);
    });

    it("should handle users without profiles (username optional)", async () => {
      const card_id = "card-123";
      const expectedAssignees: AssigneeWithUserDetailsArray = [
        {
          id: "assignee-001",
          card_id: "card-123",
          user_id: "user-456",
          assigned_at: "2025-01-01T10:00:00Z",
          user: {
            id: "user-456",
            email: "john@example.com",
            // No username - profile not set up
          },
        },
      ];

      assigneeRepository.getAssigneesWithUserDetails.mockResolvedValue(
        expectedAssignees,
      );

      const result = await assigneeService.getAssigneesWithUserDetails(card_id);

      expect(result[0].user.email).toBe("john@example.com");
      expect(result[0].user.username).toBeUndefined();
    });
  });

  describe("isUserAssigned", () => {
    it("should return true when user is assigned to card", async () => {
      const card_id = "card-123";
      const user_id = "user-456";

      assigneeRepository.isUserAssigned.mockResolvedValue(true);

      const result = await assigneeService.isUserAssigned(card_id, user_id);

      expect(assigneeRepository.isUserAssigned).toHaveBeenCalledWith(
        card_id,
        user_id,
      );
      expect(result).toBe(true);
    });

    it("should return false when user is not assigned to card", async () => {
      const card_id = "card-123";
      const user_id = "user-999";

      assigneeRepository.isUserAssigned.mockResolvedValue(false);

      const result = await assigneeService.isUserAssigned(card_id, user_id);

      expect(result).toBe(false);
    });

    it("should handle non-existent card or user", async () => {
      const card_id = "card-999";
      const user_id = "user-999";

      assigneeRepository.isUserAssigned.mockResolvedValue(false);

      const result = await assigneeService.isUserAssigned(card_id, user_id);

      expect(result).toBe(false);
    });
  });

  describe("getCardIdsByUserId", () => {
    it("should return all card IDs assigned to user", async () => {
      const user_id = "user-456";
      const expectedCardIds = ["card-001", "card-002", "card-003"];

      assigneeRepository.getCardIdsByUserId.mockResolvedValue(expectedCardIds);

      const result = await assigneeService.getCardIdsByUserId(user_id);

      expect(assigneeRepository.getCardIdsByUserId).toHaveBeenCalledWith(
        user_id,
      );
      expect(result).toEqual(expectedCardIds);
      expect(result).toHaveLength(3);
    });

    it("should return empty array when user has no assigned cards", async () => {
      const user_id = "user-999";

      assigneeRepository.getCardIdsByUserId.mockResolvedValue([]);

      const result = await assigneeService.getCardIdsByUserId(user_id);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should handle user with single card assignment", async () => {
      const user_id = "user-456";
      const expectedCardIds = ["card-001"];

      assigneeRepository.getCardIdsByUserId.mockResolvedValue(expectedCardIds);

      const result = await assigneeService.getCardIdsByUserId(user_id);

      expect(result).toEqual(["card-001"]);
      expect(result).toHaveLength(1);
    });

    it("should handle user with many card assignments", async () => {
      const user_id = "user-456";
      const expectedCardIds = Array.from({ length: 50 }, (_, i) =>
        `card-${String(i + 1).padStart(3, "0")}`.toString(),
      );

      assigneeRepository.getCardIdsByUserId.mockResolvedValue(expectedCardIds);

      const result = await assigneeService.getCardIdsByUserId(user_id);

      expect(result).toHaveLength(50);
      expect(result[0]).toBe("card-001");
      expect(result[49]).toBe("card-050");
    });
  });
});
