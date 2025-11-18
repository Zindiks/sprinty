import { TimeTrackingService } from "../modules/time-tracking/time-tracking.service";
import {
  TimeTrackingRepository,
  CreateTimeLogInput,
  UpdateTimeLogInput,
} from "../modules/time-tracking/time-tracking.repository";
import { Knex } from "knex";

// Mock the repository
jest.mock("../modules/time-tracking/time-tracking.repository");

class MockedTimeTrackingRepository {
  createTimeLog = jest.fn();
  getTimeLogById = jest.fn();
  getTimeLogsByCard = jest.fn();
  getTimeLogsByUser = jest.fn();
  updateTimeLog = jest.fn();
  deleteTimeLog = jest.fn();
  getTotalTimeForCard = jest.fn();
  getTimeLogsInRange = jest.fn();
}

describe("TimeTrackingService", () => {
  let timeTrackingService: TimeTrackingService;
  let timeTrackingRepository: jest.Mocked<TimeTrackingRepository>;
  let mockKnex: Knex;

  beforeEach(() => {
    mockKnex = {} as Knex;
    timeTrackingRepository =
      new MockedTimeTrackingRepository() as unknown as jest.Mocked<TimeTrackingRepository>;

    // Mock the repository constructor
    (
      TimeTrackingRepository as jest.MockedClass<typeof TimeTrackingRepository>
    ).mockImplementation(() => timeTrackingRepository);

    timeTrackingService = new TimeTrackingService(mockKnex);
    jest.clearAllMocks();
  });

  describe("logTime", () => {
    it("should create time log with required fields", async () => {
      const input: CreateTimeLogInput = {
        cardId: "card-123",
        userId: "user-456",
        durationMinutes: 60,
      };
      const expectedResponse = {
        id: "time-log-001",
        card_id: "card-123",
        user_id: "user-456",
        duration_minutes: 60,
        description: null,
        logged_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      timeTrackingRepository.createTimeLog.mockResolvedValue(expectedResponse);

      const result = await timeTrackingService.logTime(input);

      expect(timeTrackingRepository.createTimeLog).toHaveBeenCalledWith(input);
      expect(result).toEqual(expectedResponse);
      expect(result.duration_minutes).toBe(60);
    });

    it("should create time log with description", async () => {
      const input: CreateTimeLogInput = {
        cardId: "card-123",
        userId: "user-456",
        durationMinutes: 120,
        description: "Worked on feature implementation",
      };
      const expectedResponse = {
        id: "time-log-002",
        card_id: "card-123",
        user_id: "user-456",
        duration_minutes: 120,
        description: "Worked on feature implementation",
        logged_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      timeTrackingRepository.createTimeLog.mockResolvedValue(expectedResponse);

      const result = await timeTrackingService.logTime(input);

      expect(result.description).toBe("Worked on feature implementation");
    });

    it("should create time log with custom logged_at date", async () => {
      const customDate = new Date("2025-01-01T10:00:00Z");
      const input: CreateTimeLogInput = {
        cardId: "card-123",
        userId: "user-456",
        durationMinutes: 30,
        loggedAt: customDate,
      };
      const expectedResponse = {
        id: "time-log-003",
        card_id: "card-123",
        user_id: "user-456",
        duration_minutes: 30,
        description: null,
        logged_at: customDate.toISOString(),
        created_at: new Date().toISOString(),
      };

      timeTrackingRepository.createTimeLog.mockResolvedValue(expectedResponse);

      const result = await timeTrackingService.logTime(input);

      expect(result.logged_at).toBe(customDate.toISOString());
    });

    it("should create time log with minimum duration (1 minute)", async () => {
      const input: CreateTimeLogInput = {
        cardId: "card-123",
        userId: "user-456",
        durationMinutes: 1,
      };
      const expectedResponse = {
        id: "time-log-004",
        card_id: "card-123",
        user_id: "user-456",
        duration_minutes: 1,
        description: null,
        logged_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      timeTrackingRepository.createTimeLog.mockResolvedValue(expectedResponse);

      const result = await timeTrackingService.logTime(input);

      expect(result.duration_minutes).toBe(1);
    });

    it("should create time log with large duration", async () => {
      const input: CreateTimeLogInput = {
        cardId: "card-123",
        userId: "user-456",
        durationMinutes: 480, // 8 hours
        description: "Full day of work",
      };
      const expectedResponse = {
        id: "time-log-005",
        card_id: "card-123",
        user_id: "user-456",
        duration_minutes: 480,
        description: "Full day of work",
        logged_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      timeTrackingRepository.createTimeLog.mockResolvedValue(expectedResponse);

      const result = await timeTrackingService.logTime(input);

      expect(result.duration_minutes).toBe(480);
    });

    it("should handle database errors during time log creation", async () => {
      const input: CreateTimeLogInput = {
        cardId: "card-123",
        userId: "user-456",
        durationMinutes: 60,
      };
      const error = new Error("Database connection failed");

      timeTrackingRepository.createTimeLog.mockRejectedValue(error);

      await expect(timeTrackingService.logTime(input)).rejects.toThrow(
        "Database connection failed",
      );
    });
  });

  describe("getTimeLog", () => {
    it("should return time log by id with card and user details", async () => {
      const id = "time-log-001";
      const expectedResponse = {
        id: "time-log-001",
        card_id: "card-123",
        user_id: "user-456",
        duration_minutes: 60,
        description: "Worked on feature",
        logged_at: "2025-01-01T10:00:00Z",
        created_at: "2025-01-01T10:00:00Z",
        card_title: "Implement login feature",
        user_email: "john@example.com",
      };

      timeTrackingRepository.getTimeLogById.mockResolvedValue(expectedResponse);

      const result = await timeTrackingService.getTimeLog(id);

      expect(timeTrackingRepository.getTimeLogById).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResponse);
      expect(result.card_title).toBe("Implement login feature");
      expect(result.user_email).toBe("john@example.com");
    });

    it("should return undefined when time log not found", async () => {
      const id = "time-log-999";

      timeTrackingRepository.getTimeLogById.mockResolvedValue(undefined);

      const result = await timeTrackingService.getTimeLog(id);

      expect(result).toBeUndefined();
    });

    it("should return time log with null description", async () => {
      const id = "time-log-002";
      const expectedResponse = {
        id: "time-log-002",
        card_id: "card-123",
        user_id: "user-456",
        duration_minutes: 30,
        description: null,
        logged_at: "2025-01-01T10:00:00Z",
        created_at: "2025-01-01T10:00:00Z",
        card_title: "Fix bug",
        user_email: "john@example.com",
      };

      timeTrackingRepository.getTimeLogById.mockResolvedValue(expectedResponse);

      const result = await timeTrackingService.getTimeLog(id);

      expect(result.description).toBeNull();
    });
  });

  describe("getCardTimeLogs", () => {
    it("should return all time logs for a card", async () => {
      const cardId = "card-123";
      const expectedLogs = [
        {
          id: "time-log-001",
          card_id: "card-123",
          user_id: "user-456",
          duration_minutes: 60,
          description: "First session",
          logged_at: "2025-01-01T15:00:00Z",
          created_at: "2025-01-01T15:00:00Z",
          user_email: "john@example.com",
        },
        {
          id: "time-log-002",
          card_id: "card-123",
          user_id: "user-789",
          duration_minutes: 30,
          description: "Review session",
          logged_at: "2025-01-01T14:00:00Z",
          created_at: "2025-01-01T14:00:00Z",
          user_email: "jane@example.com",
        },
      ];

      timeTrackingRepository.getTimeLogsByCard.mockResolvedValue(expectedLogs);

      const result = await timeTrackingService.getCardTimeLogs(cardId);

      expect(timeTrackingRepository.getTimeLogsByCard).toHaveBeenCalledWith(
        cardId,
      );
      expect(result).toEqual(expectedLogs);
      expect(result).toHaveLength(2);
    });

    it("should return empty array when card has no time logs", async () => {
      const cardId = "card-empty";

      timeTrackingRepository.getTimeLogsByCard.mockResolvedValue([]);

      const result = await timeTrackingService.getCardTimeLogs(cardId);

      expect(result).toEqual([]);
    });

    it("should return logs ordered by logged_at desc", async () => {
      const cardId = "card-123";
      const expectedLogs = [
        {
          id: "time-log-003",
          card_id: "card-123",
          user_id: "user-456",
          duration_minutes: 45,
          description: null,
          logged_at: "2025-01-01T16:00:00Z",
          created_at: "2025-01-01T16:00:00Z",
          user_email: "john@example.com",
        },
        {
          id: "time-log-002",
          card_id: "card-123",
          user_id: "user-456",
          duration_minutes: 30,
          description: null,
          logged_at: "2025-01-01T14:00:00Z",
          created_at: "2025-01-01T14:00:00Z",
          user_email: "john@example.com",
        },
      ];

      timeTrackingRepository.getTimeLogsByCard.mockResolvedValue(expectedLogs);

      const result = await timeTrackingService.getCardTimeLogs(cardId);

      // Most recent first
      expect(result[0].logged_at).toBe("2025-01-01T16:00:00Z");
      expect(result[1].logged_at).toBe("2025-01-01T14:00:00Z");
    });

    it("should return logs from multiple users", async () => {
      const cardId = "card-123";
      const expectedLogs = [
        {
          id: "time-log-001",
          card_id: "card-123",
          user_id: "user-456",
          duration_minutes: 60,
          description: null,
          logged_at: "2025-01-01T15:00:00Z",
          created_at: "2025-01-01T15:00:00Z",
          user_email: "john@example.com",
        },
        {
          id: "time-log-002",
          card_id: "card-123",
          user_id: "user-789",
          duration_minutes: 30,
          description: null,
          logged_at: "2025-01-01T14:00:00Z",
          created_at: "2025-01-01T14:00:00Z",
          user_email: "jane@example.com",
        },
      ];

      timeTrackingRepository.getTimeLogsByCard.mockResolvedValue(expectedLogs);

      const result = await timeTrackingService.getCardTimeLogs(cardId);

      expect(result[0].user_id).toBe("user-456");
      expect(result[1].user_id).toBe("user-789");
    });
  });

  describe("getUserTimeLogs", () => {
    it("should return all time logs for a user", async () => {
      const userId = "user-456";
      const expectedLogs = [
        {
          id: "time-log-001",
          card_id: "card-123",
          user_id: "user-456",
          duration_minutes: 60,
          description: "Feature work",
          logged_at: "2025-01-01T15:00:00Z",
          created_at: "2025-01-01T15:00:00Z",
          card_title: "Implement login",
          board_title: "Project A",
          board_id: "board-001",
        },
        {
          id: "time-log-002",
          card_id: "card-456",
          user_id: "user-456",
          duration_minutes: 30,
          description: "Bug fix",
          logged_at: "2025-01-01T14:00:00Z",
          created_at: "2025-01-01T14:00:00Z",
          card_title: "Fix validation",
          board_title: "Project B",
          board_id: "board-002",
        },
      ];

      timeTrackingRepository.getTimeLogsByUser.mockResolvedValue(expectedLogs);

      const result = await timeTrackingService.getUserTimeLogs(userId);

      expect(timeTrackingRepository.getTimeLogsByUser).toHaveBeenCalledWith(
        userId,
        undefined,
      );
      expect(result).toEqual(expectedLogs);
      expect(result).toHaveLength(2);
    });

    it("should return empty array when user has no time logs", async () => {
      const userId = "user-999";

      timeTrackingRepository.getTimeLogsByUser.mockResolvedValue([]);

      const result = await timeTrackingService.getUserTimeLogs(userId);

      expect(result).toEqual([]);
    });

    it("should filter by organization", async () => {
      const userId = "user-456";
      const organizationId = "org-001";
      const expectedLogs = [
        {
          id: "time-log-001",
          card_id: "card-123",
          user_id: "user-456",
          duration_minutes: 60,
          description: null,
          logged_at: "2025-01-01T15:00:00Z",
          created_at: "2025-01-01T15:00:00Z",
          card_title: "Task 1",
          board_title: "Project A",
          board_id: "board-001",
        },
      ];

      timeTrackingRepository.getTimeLogsByUser.mockResolvedValue(expectedLogs);

      const result = await timeTrackingService.getUserTimeLogs(
        userId,
        organizationId,
      );

      expect(timeTrackingRepository.getTimeLogsByUser).toHaveBeenCalledWith(
        userId,
        organizationId,
      );
      expect(result).toHaveLength(1);
    });

    it("should return logs with board and card details", async () => {
      const userId = "user-456";
      const expectedLogs = [
        {
          id: "time-log-001",
          card_id: "card-123",
          user_id: "user-456",
          duration_minutes: 120,
          description: "Development",
          logged_at: "2025-01-01T15:00:00Z",
          created_at: "2025-01-01T15:00:00Z",
          card_title: "Feature X",
          board_title: "Sprint 1",
          board_id: "board-001",
        },
      ];

      timeTrackingRepository.getTimeLogsByUser.mockResolvedValue(expectedLogs);

      const result = await timeTrackingService.getUserTimeLogs(userId);

      expect(result[0].card_title).toBe("Feature X");
      expect(result[0].board_title).toBe("Sprint 1");
      expect(result[0].board_id).toBe("board-001");
    });
  });

  describe("updateTimeLog", () => {
    it("should update duration_minutes", async () => {
      const input: UpdateTimeLogInput = {
        id: "time-log-001",
        durationMinutes: 90,
      };
      const expectedResponse = {
        id: "time-log-001",
        card_id: "card-123",
        user_id: "user-456",
        duration_minutes: 90,
        description: "Original description",
        logged_at: "2025-01-01T10:00:00Z",
        created_at: "2025-01-01T10:00:00Z",
      };

      timeTrackingRepository.updateTimeLog.mockResolvedValue(expectedResponse);

      const result = await timeTrackingService.updateTimeLog(input);

      expect(timeTrackingRepository.updateTimeLog).toHaveBeenCalledWith(input);
      expect(result.duration_minutes).toBe(90);
    });

    it("should update description", async () => {
      const input: UpdateTimeLogInput = {
        id: "time-log-001",
        description: "Updated description",
      };
      const expectedResponse = {
        id: "time-log-001",
        card_id: "card-123",
        user_id: "user-456",
        duration_minutes: 60,
        description: "Updated description",
        logged_at: "2025-01-01T10:00:00Z",
        created_at: "2025-01-01T10:00:00Z",
      };

      timeTrackingRepository.updateTimeLog.mockResolvedValue(expectedResponse);

      const result = await timeTrackingService.updateTimeLog(input);

      expect(result.description).toBe("Updated description");
    });

    it("should update both duration and description", async () => {
      const input: UpdateTimeLogInput = {
        id: "time-log-001",
        durationMinutes: 120,
        description: "Extended work session",
      };
      const expectedResponse = {
        id: "time-log-001",
        card_id: "card-123",
        user_id: "user-456",
        duration_minutes: 120,
        description: "Extended work session",
        logged_at: "2025-01-01T10:00:00Z",
        created_at: "2025-01-01T10:00:00Z",
      };

      timeTrackingRepository.updateTimeLog.mockResolvedValue(expectedResponse);

      const result = await timeTrackingService.updateTimeLog(input);

      expect(result.duration_minutes).toBe(120);
      expect(result.description).toBe("Extended work session");
    });

    it("should return undefined when time log not found", async () => {
      const input: UpdateTimeLogInput = {
        id: "time-log-999",
        durationMinutes: 60,
      };

      timeTrackingRepository.updateTimeLog.mockResolvedValue(undefined);

      const result = await timeTrackingService.updateTimeLog(input);

      expect(result).toBeUndefined();
    });
  });

  describe("deleteTimeLog", () => {
    it("should delete time log successfully", async () => {
      const id = "time-log-001";

      timeTrackingRepository.deleteTimeLog.mockResolvedValue(1);

      const result = await timeTrackingService.deleteTimeLog(id);

      expect(timeTrackingRepository.deleteTimeLog).toHaveBeenCalledWith(id);
      expect(result).toBe(1);
    });

    it("should return 0 when time log not found", async () => {
      const id = "time-log-999";

      timeTrackingRepository.deleteTimeLog.mockResolvedValue(0);

      const result = await timeTrackingService.deleteTimeLog(id);

      expect(result).toBe(0);
    });
  });

  describe("getCardTimeTotal", () => {
    it("should calculate total time for card", async () => {
      const cardId = "card-123";
      const expectedTotal = {
        totalMinutes: 150,
        totalHours: 2.5,
        logCount: 3,
      };

      timeTrackingRepository.getTotalTimeForCard.mockResolvedValue(
        expectedTotal,
      );

      const result = await timeTrackingService.getCardTimeTotal(cardId);

      expect(timeTrackingRepository.getTotalTimeForCard).toHaveBeenCalledWith(
        cardId,
      );
      expect(result.totalMinutes).toBe(150);
      expect(result.totalHours).toBe(2.5);
      expect(result.logCount).toBe(3);
    });

    it("should return zero totals when card has no time logs", async () => {
      const cardId = "card-empty";
      const expectedTotal = {
        totalMinutes: 0,
        totalHours: 0,
        logCount: 0,
      };

      timeTrackingRepository.getTotalTimeForCard.mockResolvedValue(
        expectedTotal,
      );

      const result = await timeTrackingService.getCardTimeTotal(cardId);

      expect(result.totalMinutes).toBe(0);
      expect(result.totalHours).toBe(0);
      expect(result.logCount).toBe(0);
    });

    it("should calculate correct hours from minutes", async () => {
      const cardId = "card-123";
      const expectedTotal = {
        totalMinutes: 480,
        totalHours: 8.0,
        logCount: 1,
      };

      timeTrackingRepository.getTotalTimeForCard.mockResolvedValue(
        expectedTotal,
      );

      const result = await timeTrackingService.getCardTimeTotal(cardId);

      expect(result.totalMinutes).toBe(480);
      expect(result.totalHours).toBe(8.0);
    });

    it("should handle fractional hours correctly", async () => {
      const cardId = "card-123";
      const expectedTotal = {
        totalMinutes: 75,
        totalHours: 1.25,
        logCount: 2,
      };

      timeTrackingRepository.getTotalTimeForCard.mockResolvedValue(
        expectedTotal,
      );

      const result = await timeTrackingService.getCardTimeTotal(cardId);

      expect(result.totalMinutes).toBe(75);
      expect(result.totalHours).toBe(1.25);
    });

    it("should count multiple log entries", async () => {
      const cardId = "card-123";
      const expectedTotal = {
        totalMinutes: 300,
        totalHours: 5.0,
        logCount: 10,
      };

      timeTrackingRepository.getTotalTimeForCard.mockResolvedValue(
        expectedTotal,
      );

      const result = await timeTrackingService.getCardTimeTotal(cardId);

      expect(result.logCount).toBe(10);
    });
  });

  describe("getTimeLogsInDateRange", () => {
    it("should return time logs within date range", async () => {
      const userId = "user-456";
      const startDate = new Date("2025-01-01T00:00:00Z");
      const endDate = new Date("2025-01-31T23:59:59Z");
      const expectedLogs = [
        {
          id: "time-log-001",
          card_id: "card-123",
          user_id: "user-456",
          duration_minutes: 60,
          description: "January work",
          logged_at: "2025-01-15T10:00:00Z",
          created_at: "2025-01-15T10:00:00Z",
          card_title: "Feature A",
          board_title: "Project 1",
        },
        {
          id: "time-log-002",
          card_id: "card-456",
          user_id: "user-456",
          duration_minutes: 30,
          description: null,
          logged_at: "2025-01-20T14:00:00Z",
          created_at: "2025-01-20T14:00:00Z",
          card_title: "Feature B",
          board_title: "Project 1",
        },
      ];

      timeTrackingRepository.getTimeLogsInRange.mockResolvedValue(expectedLogs);

      const result = await timeTrackingService.getTimeLogsInDateRange(
        userId,
        startDate,
        endDate,
      );

      expect(timeTrackingRepository.getTimeLogsInRange).toHaveBeenCalledWith(
        userId,
        startDate,
        endDate,
        undefined,
      );
      expect(result).toEqual(expectedLogs);
      expect(result).toHaveLength(2);
    });

    it("should return empty array when no logs in range", async () => {
      const userId = "user-456";
      const startDate = new Date("2025-02-01T00:00:00Z");
      const endDate = new Date("2025-02-28T23:59:59Z");

      timeTrackingRepository.getTimeLogsInRange.mockResolvedValue([]);

      const result = await timeTrackingService.getTimeLogsInDateRange(
        userId,
        startDate,
        endDate,
      );

      expect(result).toEqual([]);
    });

    it("should filter by organization in date range", async () => {
      const userId = "user-456";
      const startDate = new Date("2025-01-01T00:00:00Z");
      const endDate = new Date("2025-01-31T23:59:59Z");
      const organizationId = "org-001";
      const expectedLogs = [
        {
          id: "time-log-001",
          card_id: "card-123",
          user_id: "user-456",
          duration_minutes: 60,
          description: null,
          logged_at: "2025-01-15T10:00:00Z",
          created_at: "2025-01-15T10:00:00Z",
          card_title: "Task",
          board_title: "Board",
        },
      ];

      timeTrackingRepository.getTimeLogsInRange.mockResolvedValue(expectedLogs);

      const result = await timeTrackingService.getTimeLogsInDateRange(
        userId,
        startDate,
        endDate,
        organizationId,
      );

      expect(timeTrackingRepository.getTimeLogsInRange).toHaveBeenCalledWith(
        userId,
        startDate,
        endDate,
        organizationId,
      );
      expect(result).toHaveLength(1);
    });

    it("should return logs ordered by logged_at desc in range", async () => {
      const userId = "user-456";
      const startDate = new Date("2025-01-01T00:00:00Z");
      const endDate = new Date("2025-01-31T23:59:59Z");
      const expectedLogs = [
        {
          id: "time-log-003",
          card_id: "card-123",
          user_id: "user-456",
          duration_minutes: 45,
          description: null,
          logged_at: "2025-01-25T10:00:00Z",
          created_at: "2025-01-25T10:00:00Z",
          card_title: "Task C",
          board_title: "Board",
        },
        {
          id: "time-log-001",
          card_id: "card-123",
          user_id: "user-456",
          duration_minutes: 60,
          description: null,
          logged_at: "2025-01-15T10:00:00Z",
          created_at: "2025-01-15T10:00:00Z",
          card_title: "Task A",
          board_title: "Board",
        },
      ];

      timeTrackingRepository.getTimeLogsInRange.mockResolvedValue(expectedLogs);

      const result = await timeTrackingService.getTimeLogsInDateRange(
        userId,
        startDate,
        endDate,
      );

      // Most recent first
      expect(result[0].logged_at).toBe("2025-01-25T10:00:00Z");
      expect(result[1].logged_at).toBe("2025-01-15T10:00:00Z");
    });

    it("should handle single day range", async () => {
      const userId = "user-456";
      const startDate = new Date("2025-01-15T00:00:00Z");
      const endDate = new Date("2025-01-15T23:59:59Z");
      const expectedLogs = [
        {
          id: "time-log-001",
          card_id: "card-123",
          user_id: "user-456",
          duration_minutes: 60,
          description: null,
          logged_at: "2025-01-15T10:00:00Z",
          created_at: "2025-01-15T10:00:00Z",
          card_title: "Task",
          board_title: "Board",
        },
      ];

      timeTrackingRepository.getTimeLogsInRange.mockResolvedValue(expectedLogs);

      const result = await timeTrackingService.getTimeLogsInDateRange(
        userId,
        startDate,
        endDate,
      );

      expect(result).toHaveLength(1);
    });
  });
});
