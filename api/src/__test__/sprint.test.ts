import { SprintService } from "../modules/sprints/sprint.service";
import {
  SprintRepository,
  CreateSprintInput,
  UpdateSprintInput,
} from "../modules/sprints/sprint.repository";
import { Knex } from "knex";

// Mock the repository
jest.mock("../modules/sprints/sprint.repository");

class MockedSprintRepository {
  createSprint = jest.fn();
  getSprintById = jest.fn();
  getSprintsByBoard = jest.fn();
  getActiveSprint = jest.fn();
  updateSprint = jest.fn();
  deleteSprint = jest.fn();
  getSprintWithStats = jest.fn();
  getSprintCards = jest.fn();
  addCardsToSprint = jest.fn();
  removeCardsFromSprint = jest.fn();
}

describe("SprintService", () => {
  let sprintService: SprintService;
  let sprintRepository: jest.Mocked<SprintRepository>;
  let mockKnex: Knex;

  beforeEach(() => {
    mockKnex = {} as Knex;
    sprintRepository = new MockedSprintRepository() as unknown as jest.Mocked<SprintRepository>;

    // Mock the repository constructor
    (SprintRepository as jest.MockedClass<typeof SprintRepository>).mockImplementation(
      () => sprintRepository
    );

    sprintService = new SprintService(mockKnex);
    jest.clearAllMocks();
  });

  describe("createSprint", () => {
    it("should create sprint with required fields", async () => {
      const input: CreateSprintInput = {
        boardId: "board-123",
        name: "Sprint 1",
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-01-14"),
      };
      const expectedResponse = {
        id: "sprint-001",
        board_id: "board-123",
        name: "Sprint 1",
        goal: null,
        start_date: "2025-01-01T00:00:00Z",
        end_date: "2025-01-14T00:00:00Z",
        status: "planned",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      sprintRepository.createSprint.mockResolvedValue(expectedResponse);

      const result = await sprintService.createSprint(input);

      expect(sprintRepository.createSprint).toHaveBeenCalledWith(input);
      expect(result).toEqual(expectedResponse);
      expect(result.status).toBe("planned");
    });

    it("should create sprint with goal", async () => {
      const input: CreateSprintInput = {
        boardId: "board-123",
        name: "Sprint 2",
        goal: "Complete user authentication",
        startDate: new Date("2025-01-15"),
        endDate: new Date("2025-01-29"),
      };
      const expectedResponse = {
        id: "sprint-002",
        board_id: "board-123",
        name: "Sprint 2",
        goal: "Complete user authentication",
        start_date: "2025-01-15T00:00:00Z",
        end_date: "2025-01-29T00:00:00Z",
        status: "planned",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      sprintRepository.createSprint.mockResolvedValue(expectedResponse);

      const result = await sprintService.createSprint(input);

      expect(result.goal).toBe("Complete user authentication");
    });

    it("should create sprint with specific status", async () => {
      const input: CreateSprintInput = {
        boardId: "board-123",
        name: "Sprint 3",
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-01-14"),
        status: "active",
      };
      const expectedResponse = {
        id: "sprint-003",
        board_id: "board-123",
        name: "Sprint 3",
        goal: null,
        start_date: "2025-01-01T00:00:00Z",
        end_date: "2025-01-14T00:00:00Z",
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      sprintRepository.createSprint.mockResolvedValue(expectedResponse);

      const result = await sprintService.createSprint(input);

      expect(result.status).toBe("active");
    });

    it("should create sprint with 2-week duration", async () => {
      const startDate = new Date("2025-01-01");
      const endDate = new Date("2025-01-15");
      const input: CreateSprintInput = {
        boardId: "board-123",
        name: "Two Week Sprint",
        startDate,
        endDate,
      };
      const expectedResponse = {
        id: "sprint-004",
        board_id: "board-123",
        name: "Two Week Sprint",
        goal: null,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        status: "planned",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      sprintRepository.createSprint.mockResolvedValue(expectedResponse);

      const result = await sprintService.createSprint(input);

      expect(result).toEqual(expectedResponse);
    });

    it("should handle database errors during creation", async () => {
      const input: CreateSprintInput = {
        boardId: "board-123",
        name: "Sprint 1",
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-01-14"),
      };
      const error = new Error("Database connection failed");

      sprintRepository.createSprint.mockRejectedValue(error);

      await expect(sprintService.createSprint(input)).rejects.toThrow(
        "Database connection failed",
      );
    });
  });

  describe("getSprint", () => {
    it("should return sprint by id", async () => {
      const id = "sprint-001";
      const expectedResponse = {
        id: "sprint-001",
        board_id: "board-123",
        name: "Sprint 1",
        goal: "Complete features",
        start_date: "2025-01-01T00:00:00Z",
        end_date: "2025-01-14T00:00:00Z",
        status: "active",
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z",
      };

      sprintRepository.getSprintById.mockResolvedValue(expectedResponse);

      const result = await sprintService.getSprint(id);

      expect(sprintRepository.getSprintById).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResponse);
    });

    it("should return undefined when sprint not found", async () => {
      const id = "sprint-999";

      sprintRepository.getSprintById.mockResolvedValue(undefined);

      const result = await sprintService.getSprint(id);

      expect(result).toBeUndefined();
    });

    it("should return sprint with null goal", async () => {
      const id = "sprint-002";
      const expectedResponse = {
        id: "sprint-002",
        board_id: "board-123",
        name: "Sprint 2",
        goal: null,
        start_date: "2025-01-15T00:00:00Z",
        end_date: "2025-01-29T00:00:00Z",
        status: "planned",
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z",
      };

      sprintRepository.getSprintById.mockResolvedValue(expectedResponse);

      const result = await sprintService.getSprint(id);

      expect(result.goal).toBeNull();
    });
  });

  describe("getSprintWithStats", () => {
    it("should return sprint with card statistics", async () => {
      const id = "sprint-001";
      const expectedResponse = {
        id: "sprint-001",
        board_id: "board-123",
        name: "Sprint 1",
        goal: "Complete authentication",
        start_date: "2025-01-01T00:00:00Z",
        end_date: "2025-01-14T00:00:00Z",
        status: "active",
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z",
        totalCards: 10,
        completedCards: 7,
      };

      sprintRepository.getSprintWithStats.mockResolvedValue(expectedResponse);

      const result = await sprintService.getSprintWithStats(id);

      expect(sprintRepository.getSprintWithStats).toHaveBeenCalledWith(id);
      expect(result.totalCards).toBe(10);
      expect(result.completedCards).toBe(7);
    });

    it("should return null when sprint not found", async () => {
      const id = "sprint-999";

      sprintRepository.getSprintWithStats.mockResolvedValue(null);

      const result = await sprintService.getSprintWithStats(id);

      expect(result).toBeNull();
    });

    it("should return sprint with zero cards", async () => {
      const id = "sprint-002";
      const expectedResponse = {
        id: "sprint-002",
        board_id: "board-123",
        name: "Sprint 2",
        goal: null,
        start_date: "2025-01-15T00:00:00Z",
        end_date: "2025-01-29T00:00:00Z",
        status: "planned",
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z",
        totalCards: 0,
        completedCards: 0,
      };

      sprintRepository.getSprintWithStats.mockResolvedValue(expectedResponse);

      const result = await sprintService.getSprintWithStats(id);

      expect(result.totalCards).toBe(0);
      expect(result.completedCards).toBe(0);
    });
  });

  describe("getBoardSprints", () => {
    it("should return all sprints for a board", async () => {
      const boardId = "board-123";
      const expectedSprints = [
        {
          id: "sprint-003",
          board_id: "board-123",
          name: "Sprint 3",
          goal: null,
          start_date: "2025-02-01T00:00:00Z",
          end_date: "2025-02-14T00:00:00Z",
          status: "planned",
          created_at: "2025-01-20T00:00:00Z",
          updated_at: "2025-01-20T00:00:00Z",
        },
        {
          id: "sprint-002",
          board_id: "board-123",
          name: "Sprint 2",
          goal: "Complete features",
          start_date: "2025-01-15T00:00:00Z",
          end_date: "2025-01-29T00:00:00Z",
          status: "active",
          created_at: "2025-01-10T00:00:00Z",
          updated_at: "2025-01-15T00:00:00Z",
        },
        {
          id: "sprint-001",
          board_id: "board-123",
          name: "Sprint 1",
          goal: null,
          start_date: "2025-01-01T00:00:00Z",
          end_date: "2025-01-14T00:00:00Z",
          status: "completed",
          created_at: "2024-12-25T00:00:00Z",
          updated_at: "2025-01-14T00:00:00Z",
        },
      ];

      sprintRepository.getSprintsByBoard.mockResolvedValue(expectedSprints);

      const result = await sprintService.getBoardSprints(boardId);

      expect(sprintRepository.getSprintsByBoard).toHaveBeenCalledWith(boardId);
      expect(result).toEqual(expectedSprints);
      expect(result).toHaveLength(3);
    });

    it("should return empty array when board has no sprints", async () => {
      const boardId = "board-empty";

      sprintRepository.getSprintsByBoard.mockResolvedValue([]);

      const result = await sprintService.getBoardSprints(boardId);

      expect(result).toEqual([]);
    });

    it("should return sprints ordered by start_date desc", async () => {
      const boardId = "board-123";
      const expectedSprints = [
        {
          id: "sprint-002",
          board_id: "board-123",
          name: "Sprint 2",
          goal: null,
          start_date: "2025-01-15T00:00:00Z",
          end_date: "2025-01-29T00:00:00Z",
          status: "planned",
          created_at: "2025-01-01T00:00:00Z",
          updated_at: "2025-01-01T00:00:00Z",
        },
        {
          id: "sprint-001",
          board_id: "board-123",
          name: "Sprint 1",
          goal: null,
          start_date: "2025-01-01T00:00:00Z",
          end_date: "2025-01-14T00:00:00Z",
          status: "completed",
          created_at: "2024-12-25T00:00:00Z",
          updated_at: "2025-01-14T00:00:00Z",
        },
      ];

      sprintRepository.getSprintsByBoard.mockResolvedValue(expectedSprints);

      const result = await sprintService.getBoardSprints(boardId);

      // Most recent start_date first
      expect(result[0].start_date).toBe("2025-01-15T00:00:00Z");
      expect(result[1].start_date).toBe("2025-01-01T00:00:00Z");
    });
  });

  describe("getActiveSprint", () => {
    it("should return active sprint for board", async () => {
      const boardId = "board-123";
      const expectedResponse = {
        id: "sprint-002",
        board_id: "board-123",
        name: "Current Sprint",
        goal: "Finish Q1 features",
        start_date: "2025-01-15T00:00:00Z",
        end_date: "2025-01-29T00:00:00Z",
        status: "active",
        created_at: "2025-01-10T00:00:00Z",
        updated_at: "2025-01-15T00:00:00Z",
      };

      sprintRepository.getActiveSprint.mockResolvedValue(expectedResponse);

      const result = await sprintService.getActiveSprint(boardId);

      expect(sprintRepository.getActiveSprint).toHaveBeenCalledWith(boardId);
      expect(result).toEqual(expectedResponse);
      expect(result.status).toBe("active");
    });

    it("should return undefined when no active sprint", async () => {
      const boardId = "board-123";

      sprintRepository.getActiveSprint.mockResolvedValue(undefined);

      const result = await sprintService.getActiveSprint(boardId);

      expect(result).toBeUndefined();
    });

    it("should return only one active sprint", async () => {
      const boardId = "board-123";
      const expectedResponse = {
        id: "sprint-001",
        board_id: "board-123",
        name: "Active Sprint",
        goal: null,
        start_date: "2025-01-01T00:00:00Z",
        end_date: "2025-01-14T00:00:00Z",
        status: "active",
        created_at: "2024-12-25T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z",
      };

      sprintRepository.getActiveSprint.mockResolvedValue(expectedResponse);

      const result = await sprintService.getActiveSprint(boardId);

      expect(result.status).toBe("active");
    });
  });

  describe("updateSprint", () => {
    it("should update sprint name", async () => {
      const input: UpdateSprintInput = {
        id: "sprint-001",
        name: "Updated Sprint Name",
      };
      const expectedResponse = {
        id: "sprint-001",
        board_id: "board-123",
        name: "Updated Sprint Name",
        goal: null,
        start_date: "2025-01-01T00:00:00Z",
        end_date: "2025-01-14T00:00:00Z",
        status: "planned",
        created_at: "2025-01-01T00:00:00Z",
        updated_at: new Date().toISOString(),
      };

      sprintRepository.updateSprint.mockResolvedValue(expectedResponse);

      const result = await sprintService.updateSprint(input);

      expect(sprintRepository.updateSprint).toHaveBeenCalledWith(input);
      expect(result.name).toBe("Updated Sprint Name");
    });

    it("should update sprint goal", async () => {
      const input: UpdateSprintInput = {
        id: "sprint-001",
        goal: "New sprint goal",
      };
      const expectedResponse = {
        id: "sprint-001",
        board_id: "board-123",
        name: "Sprint 1",
        goal: "New sprint goal",
        start_date: "2025-01-01T00:00:00Z",
        end_date: "2025-01-14T00:00:00Z",
        status: "planned",
        created_at: "2025-01-01T00:00:00Z",
        updated_at: new Date().toISOString(),
      };

      sprintRepository.updateSprint.mockResolvedValue(expectedResponse);

      const result = await sprintService.updateSprint(input);

      expect(result.goal).toBe("New sprint goal");
    });

    it("should update sprint dates", async () => {
      const newStartDate = new Date("2025-01-05");
      const newEndDate = new Date("2025-01-19");
      const input: UpdateSprintInput = {
        id: "sprint-001",
        startDate: newStartDate,
        endDate: newEndDate,
      };
      const expectedResponse = {
        id: "sprint-001",
        board_id: "board-123",
        name: "Sprint 1",
        goal: null,
        start_date: newStartDate.toISOString(),
        end_date: newEndDate.toISOString(),
        status: "planned",
        created_at: "2025-01-01T00:00:00Z",
        updated_at: new Date().toISOString(),
      };

      sprintRepository.updateSprint.mockResolvedValue(expectedResponse);

      const result = await sprintService.updateSprint(input);

      expect(result.start_date).toBe(newStartDate.toISOString());
      expect(result.end_date).toBe(newEndDate.toISOString());
    });

    it("should update sprint status", async () => {
      const input: UpdateSprintInput = {
        id: "sprint-001",
        status: "completed",
      };
      const expectedResponse = {
        id: "sprint-001",
        board_id: "board-123",
        name: "Sprint 1",
        goal: null,
        start_date: "2025-01-01T00:00:00Z",
        end_date: "2025-01-14T00:00:00Z",
        status: "completed",
        created_at: "2025-01-01T00:00:00Z",
        updated_at: new Date().toISOString(),
      };

      sprintRepository.updateSprint.mockResolvedValue(expectedResponse);

      const result = await sprintService.updateSprint(input);

      expect(result.status).toBe("completed");
    });

    it("should update multiple fields at once", async () => {
      const input: UpdateSprintInput = {
        id: "sprint-001",
        name: "Updated Sprint",
        goal: "Updated goal",
        status: "active",
      };
      const expectedResponse = {
        id: "sprint-001",
        board_id: "board-123",
        name: "Updated Sprint",
        goal: "Updated goal",
        start_date: "2025-01-01T00:00:00Z",
        end_date: "2025-01-14T00:00:00Z",
        status: "active",
        created_at: "2025-01-01T00:00:00Z",
        updated_at: new Date().toISOString(),
      };

      sprintRepository.updateSprint.mockResolvedValue(expectedResponse);

      const result = await sprintService.updateSprint(input);

      expect(result.name).toBe("Updated Sprint");
      expect(result.goal).toBe("Updated goal");
      expect(result.status).toBe("active");
    });

    it("should return undefined when sprint not found", async () => {
      const input: UpdateSprintInput = {
        id: "sprint-999",
        name: "Updated",
      };

      sprintRepository.updateSprint.mockResolvedValue(undefined);

      const result = await sprintService.updateSprint(input);

      expect(result).toBeUndefined();
    });
  });

  describe("deleteSprint", () => {
    it("should delete sprint successfully", async () => {
      const id = "sprint-001";

      sprintRepository.deleteSprint.mockResolvedValue(1);

      const result = await sprintService.deleteSprint(id);

      expect(sprintRepository.deleteSprint).toHaveBeenCalledWith(id);
      expect(result).toBe(1);
    });

    it("should return 0 when sprint not found", async () => {
      const id = "sprint-999";

      sprintRepository.deleteSprint.mockResolvedValue(0);

      const result = await sprintService.deleteSprint(id);

      expect(result).toBe(0);
    });
  });

  describe("getSprintCards", () => {
    it("should return all cards in sprint", async () => {
      const sprintId = "sprint-001";
      const expectedCards = [
        {
          id: "card-001",
          list_id: "list-123",
          title: "Implement login",
          description: "User authentication",
          order: 0,
          status: "completed",
          due_date: "2025-01-10T00:00:00Z",
          priority: "high",
          sprint_id: "sprint-001",
          created_at: "2025-01-01T00:00:00Z",
          updated_at: "2025-01-10T00:00:00Z",
          list_title: "Done",
        },
        {
          id: "card-002",
          list_id: "list-456",
          title: "Fix bug",
          description: null,
          order: 1,
          status: "in_progress",
          due_date: null,
          priority: "medium",
          sprint_id: "sprint-001",
          created_at: "2025-01-02T00:00:00Z",
          updated_at: "2025-01-05T00:00:00Z",
          list_title: "In Progress",
        },
      ];

      sprintRepository.getSprintCards.mockResolvedValue(expectedCards);

      const result = await sprintService.getSprintCards(sprintId);

      expect(sprintRepository.getSprintCards).toHaveBeenCalledWith(sprintId);
      expect(result).toEqual(expectedCards);
      expect(result).toHaveLength(2);
    });

    it("should return empty array when sprint has no cards", async () => {
      const sprintId = "sprint-empty";

      sprintRepository.getSprintCards.mockResolvedValue([]);

      const result = await sprintService.getSprintCards(sprintId);

      expect(result).toEqual([]);
    });

    it("should return cards with list information", async () => {
      const sprintId = "sprint-001";
      const expectedCards = [
        {
          id: "card-001",
          list_id: "list-123",
          title: "Task 1",
          description: null,
          order: 0,
          status: "todo",
          due_date: null,
          priority: "low",
          sprint_id: "sprint-001",
          created_at: "2025-01-01T00:00:00Z",
          updated_at: "2025-01-01T00:00:00Z",
          list_title: "To Do",
        },
      ];

      sprintRepository.getSprintCards.mockResolvedValue(expectedCards);

      const result = await sprintService.getSprintCards(sprintId);

      expect(result[0].list_title).toBe("To Do");
      expect(result[0].list_id).toBe("list-123");
    });

    it("should return cards ordered by order field", async () => {
      const sprintId = "sprint-001";
      const expectedCards = [
        {
          id: "card-001",
          list_id: "list-123",
          title: "First",
          description: null,
          order: 0,
          status: "todo",
          due_date: null,
          priority: "low",
          sprint_id: "sprint-001",
          created_at: "2025-01-01T00:00:00Z",
          updated_at: "2025-01-01T00:00:00Z",
          list_title: "To Do",
        },
        {
          id: "card-002",
          list_id: "list-123",
          title: "Second",
          description: null,
          order: 1,
          status: "todo",
          due_date: null,
          priority: "low",
          sprint_id: "sprint-001",
          created_at: "2025-01-01T00:00:00Z",
          updated_at: "2025-01-01T00:00:00Z",
          list_title: "To Do",
        },
      ];

      sprintRepository.getSprintCards.mockResolvedValue(expectedCards);

      const result = await sprintService.getSprintCards(sprintId);

      expect(result[0].order).toBe(0);
      expect(result[1].order).toBe(1);
    });
  });

  describe("addCardsToSprint", () => {
    it("should add cards to sprint successfully", async () => {
      const sprintId = "sprint-001";
      const cardIds = ["card-001", "card-002", "card-003"];

      sprintRepository.addCardsToSprint.mockResolvedValue(3);

      const result = await sprintService.addCardsToSprint(sprintId, cardIds);

      expect(sprintRepository.addCardsToSprint).toHaveBeenCalledWith(sprintId, cardIds);
      expect(result).toBe(3);
    });

    it("should handle adding single card", async () => {
      const sprintId = "sprint-001";
      const cardIds = ["card-001"];

      sprintRepository.addCardsToSprint.mockResolvedValue(1);

      const result = await sprintService.addCardsToSprint(sprintId, cardIds);

      expect(result).toBe(1);
    });

    it("should handle adding many cards", async () => {
      const sprintId = "sprint-001";
      const cardIds = Array.from({ length: 50 }, (_, i) => `card-${i + 1}`);

      sprintRepository.addCardsToSprint.mockResolvedValue(50);

      const result = await sprintService.addCardsToSprint(sprintId, cardIds);

      expect(result).toBe(50);
    });

    it("should return 0 when no cards match", async () => {
      const sprintId = "sprint-001";
      const cardIds = ["card-999"];

      sprintRepository.addCardsToSprint.mockResolvedValue(0);

      const result = await sprintService.addCardsToSprint(sprintId, cardIds);

      expect(result).toBe(0);
    });
  });

  describe("removeCardsFromSprint", () => {
    it("should remove cards from sprint successfully", async () => {
      const cardIds = ["card-001", "card-002"];

      sprintRepository.removeCardsFromSprint.mockResolvedValue(2);

      const result = await sprintService.removeCardsFromSprint(cardIds);

      expect(sprintRepository.removeCardsFromSprint).toHaveBeenCalledWith(cardIds);
      expect(result).toBe(2);
    });

    it("should handle removing single card", async () => {
      const cardIds = ["card-001"];

      sprintRepository.removeCardsFromSprint.mockResolvedValue(1);

      const result = await sprintService.removeCardsFromSprint(cardIds);

      expect(result).toBe(1);
    });

    it("should return 0 when no cards match", async () => {
      const cardIds = ["card-999"];

      sprintRepository.removeCardsFromSprint.mockResolvedValue(0);

      const result = await sprintService.removeCardsFromSprint(cardIds);

      expect(result).toBe(0);
    });
  });

  describe("startSprint", () => {
    it("should start sprint by setting status to active", async () => {
      const sprintId = "sprint-001";
      const expectedResponse = {
        id: "sprint-001",
        board_id: "board-123",
        name: "Sprint 1",
        goal: "Complete features",
        start_date: "2025-01-01T00:00:00Z",
        end_date: "2025-01-14T00:00:00Z",
        status: "active",
        created_at: "2025-01-01T00:00:00Z",
        updated_at: new Date().toISOString(),
      };

      sprintRepository.updateSprint.mockResolvedValue(expectedResponse);

      const result = await sprintService.startSprint(sprintId);

      expect(sprintRepository.updateSprint).toHaveBeenCalledWith({
        id: sprintId,
        status: "active",
      });
      expect(result.status).toBe("active");
    });

    it("should transition from planned to active", async () => {
      const sprintId = "sprint-002";
      const expectedResponse = {
        id: "sprint-002",
        board_id: "board-123",
        name: "Sprint 2",
        goal: null,
        start_date: "2025-01-15T00:00:00Z",
        end_date: "2025-01-29T00:00:00Z",
        status: "active",
        created_at: "2025-01-10T00:00:00Z",
        updated_at: new Date().toISOString(),
      };

      sprintRepository.updateSprint.mockResolvedValue(expectedResponse);

      const result = await sprintService.startSprint(sprintId);

      expect(result.status).toBe("active");
    });
  });

  describe("completeSprint", () => {
    it("should complete sprint by setting status to completed", async () => {
      const sprintId = "sprint-001";
      const expectedResponse = {
        id: "sprint-001",
        board_id: "board-123",
        name: "Sprint 1",
        goal: "Complete features",
        start_date: "2025-01-01T00:00:00Z",
        end_date: "2025-01-14T00:00:00Z",
        status: "completed",
        created_at: "2025-01-01T00:00:00Z",
        updated_at: new Date().toISOString(),
      };

      sprintRepository.updateSprint.mockResolvedValue(expectedResponse);

      const result = await sprintService.completeSprint(sprintId);

      expect(sprintRepository.updateSprint).toHaveBeenCalledWith({
        id: sprintId,
        status: "completed",
      });
      expect(result.status).toBe("completed");
    });

    it("should transition from active to completed", async () => {
      const sprintId = "sprint-002";
      const expectedResponse = {
        id: "sprint-002",
        board_id: "board-123",
        name: "Sprint 2",
        goal: null,
        start_date: "2025-01-15T00:00:00Z",
        end_date: "2025-01-29T00:00:00Z",
        status: "completed",
        created_at: "2025-01-10T00:00:00Z",
        updated_at: new Date().toISOString(),
      };

      sprintRepository.updateSprint.mockResolvedValue(expectedResponse);

      const result = await sprintService.completeSprint(sprintId);

      expect(result.status).toBe("completed");
    });
  });
});
