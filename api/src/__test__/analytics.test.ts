import { AnalyticsService } from "../modules/analytics/analytics.service";
import { AnalyticsRepository } from "../modules/analytics/analytics.repository";
import { Knex } from "knex";

// Mock the repository
jest.mock("../modules/analytics/analytics.repository");

class MockedAnalyticsRepository {
  private knex = {} as unknown;
  getPersonalStats = jest.fn();
  getAssignedTasks = jest.fn();
  getBoardStats = jest.fn();
  getActivityTimeline = jest.fn();
  getTimeTrackingSummary = jest.fn();
  getBurndownData = jest.fn();
  getVelocityMetrics = jest.fn();
  getDueDateAnalytics = jest.fn();
  getProductivityTrends = jest.fn();
  getBoardsOverview = jest.fn();
  getWeeklyMetrics = jest.fn();
  getMonthlyMetrics = jest.fn();
}

describe("AnalyticsService", () => {
  let analyticsService: AnalyticsService;
  let analyticsRepository: MockedAnalyticsRepository;
  let mockKnex: Knex;

  beforeEach(() => {
    mockKnex = {} as Knex;
    // @ts-expect-error - mock private property mismatch
    analyticsRepository =
      new MockedAnalyticsRepository() as unknown as jest.Mocked<AnalyticsRepository>;
    // Mock the repository constructor
    (
      AnalyticsRepository as jest.MockedClass<typeof AnalyticsRepository>
    ).mockImplementation(() => analyticsRepository);

    analyticsService = new AnalyticsService(mockKnex);
    jest.clearAllMocks();
  });

  describe("getPersonalDashboard", () => {
    it("should return personal dashboard with stats and recent tasks", async () => {
      const userId = "user-123";
      const organizationId = "org-456";
      const expectedStats = {
        assignedCards: 10,
        completedCards: 7,
        dueSoon: 2,
        overdue: 1,
      };
      const expectedTasks = [
        {
          id: "card-001",
          title: "Fix bug",
          description: "Critical bug",
          status: "in_progress",
          priority: "high",
          due_date: "2025-01-20T00:00:00Z",
          list_title: "In Progress",
          board_id: "board-001",
          board_title: "Project A",
        },
      ];

      analyticsRepository.getPersonalStats.mockResolvedValue(expectedStats);
      analyticsRepository.getAssignedTasks.mockResolvedValue(expectedTasks);

      const result = await analyticsService.getPersonalDashboard(
        userId,
        organizationId,
      );

      expect(analyticsRepository.getPersonalStats).toHaveBeenCalledWith(
        userId,
        organizationId,
      );
      expect(analyticsRepository.getAssignedTasks).toHaveBeenCalledWith(
        userId,
        organizationId,
        20,
      );
      expect(result.stats).toEqual(expectedStats);
      expect(result.recentTasks).toEqual(expectedTasks);
    });

    it("should handle zero assigned cards", async () => {
      const userId = "user-123";
      const organizationId = "org-456";
      const expectedStats = {
        assignedCards: 0,
        completedCards: 0,
        dueSoon: 0,
        overdue: 0,
      };

      analyticsRepository.getPersonalStats.mockResolvedValue(expectedStats);
      analyticsRepository.getAssignedTasks.mockResolvedValue([]);

      const result = await analyticsService.getPersonalDashboard(
        userId,
        organizationId,
      );

      expect(result.stats.assignedCards).toBe(0);
      expect(result.recentTasks).toEqual([]);
    });
  });

  describe("getBoardAnalytics", () => {
    it("should return comprehensive board analytics", async () => {
      const boardId = "board-123";
      const expectedStats = {
        totalCards: 20,
        completedCards: 15,
        completionRate: 75.0,
        cardsByStatus: [
          { status: "todo", count: 3 },
          { status: "in_progress", count: 2 },
          { status: "completed", count: 15 },
        ],
        cardsByPriority: [
          { priority: "critical", count: 2 },
          { priority: "high", count: 5 },
          { priority: "medium", count: 8 },
          { priority: "low", count: 5 },
        ],
      };
      const expectedTimeline = [
        {
          id: "activity-001",
          action_type: "created",
          metadata: null,
          created_at: "2025-01-15T10:00:00Z",
          card_title: "New Feature",
          user_email: "john@example.com",
        },
      ];
      const expectedTimeTracking = {
        totalMinutes: 480,
        totalHours: 8.0,
        logCount: 10,
        byUser: [
          {
            userId: "user-123",
            userEmail: "john@example.com",
            totalMinutes: 240,
            totalHours: 4.0,
          },
        ],
      };

      analyticsRepository.getBoardStats.mockResolvedValue(expectedStats);
      analyticsRepository.getActivityTimeline.mockResolvedValue(
        expectedTimeline,
      );
      analyticsRepository.getTimeTrackingSummary.mockResolvedValue(
        expectedTimeTracking,
      );

      const result = await analyticsService.getBoardAnalytics(boardId);

      expect(analyticsRepository.getBoardStats).toHaveBeenCalledWith(boardId);
      expect(analyticsRepository.getActivityTimeline).toHaveBeenCalledWith(
        boardId,
        50,
      );
      expect(analyticsRepository.getTimeTrackingSummary).toHaveBeenCalledWith(
        boardId,
      );
      expect(result.stats).toEqual(expectedStats);
      expect(result.activityTimeline).toEqual(expectedTimeline);
      expect(result.timeTracking).toEqual(expectedTimeTracking);
    });

    it("should handle board with no cards", async () => {
      const boardId = "board-empty";
      const expectedStats = {
        totalCards: 0,
        completedCards: 0,
        completionRate: 0,
        cardsByStatus: [],
        cardsByPriority: [],
      };

      analyticsRepository.getBoardStats.mockResolvedValue(expectedStats);
      analyticsRepository.getActivityTimeline.mockResolvedValue([]);
      analyticsRepository.getTimeTrackingSummary.mockResolvedValue({
        totalMinutes: 0,
        totalHours: 0,
        logCount: 0,
        byUser: [],
      });

      const result = await analyticsService.getBoardAnalytics(boardId);

      expect(result.stats.totalCards).toBe(0);
      expect(result.stats.completionRate).toBe(0);
    });
  });

  describe("getSprintBurndown", () => {
    it("should return sprint burndown chart data", async () => {
      const sprintId = "sprint-001";
      const expectedData = {
        sprint: {
          id: "sprint-001",
          name: "Sprint 1",
          startDate: "2025-01-01",
          endDate: "2025-01-14",
          status: "active",
        },
        totalCards: 20,
        burndownData: [
          { date: "2025-01-02", remaining: 18, completed: 2 },
          { date: "2025-01-03", remaining: 15, completed: 5 },
        ],
        idealLine: [
          { date: "2025-01-01", ideal: 20 },
          { date: "2025-01-14", ideal: 0 },
        ],
      };

      analyticsRepository.getBurndownData.mockResolvedValue(expectedData);

      const result = await analyticsService.getSprintBurndown(sprintId);

      expect(analyticsRepository.getBurndownData).toHaveBeenCalledWith(
        sprintId,
      );
      expect(result).toEqual(expectedData);
      expect(result?.totalCards).toBe(20);
    });

    it("should return null when sprint not found", async () => {
      const sprintId = "sprint-999";

      analyticsRepository.getBurndownData.mockResolvedValue(null);

      const result = await analyticsService.getSprintBurndown(sprintId);

      expect(result).toBeNull();
    });

    it("should handle sprint with no cards", async () => {
      const sprintId = "sprint-002";
      const expectedData = {
        sprint: {
          id: "sprint-002",
          name: "Sprint 2",
          startDate: "2025-01-15",
          endDate: "2025-01-29",
          status: "planned",
        },
        totalCards: 0,
        burndownData: [],
        idealLine: [],
      };

      analyticsRepository.getBurndownData.mockResolvedValue(expectedData);

      const result = await analyticsService.getSprintBurndown(sprintId);

      expect(result?.totalCards).toBe(0);
    });
  });

  describe("getBoardVelocity", () => {
    it("should return velocity metrics for board sprints", async () => {
      const boardId = "board-123";
      const expectedMetrics = [
        {
          id: "sprint-003",
          name: "Sprint 3",
          start_date: "2025-02-01T00:00:00Z",
          end_date: "2025-02-14T00:00:00Z",
          status: "active",
          cards_completed: "8",
        },
        {
          id: "sprint-002",
          name: "Sprint 2",
          start_date: "2025-01-15T00:00:00Z",
          end_date: "2025-01-29T00:00:00Z",
          status: "completed",
          cards_completed: "12",
        },
        {
          id: "sprint-001",
          name: "Sprint 1",
          start_date: "2025-01-01T00:00:00Z",
          end_date: "2025-01-14T00:00:00Z",
          status: "completed",
          cards_completed: "10",
        },
      ];

      analyticsRepository.getVelocityMetrics.mockResolvedValue(expectedMetrics);

      const result = await analyticsService.getBoardVelocity(boardId);

      expect(analyticsRepository.getVelocityMetrics).toHaveBeenCalledWith(
        boardId,
      );
      expect(result).toEqual(expectedMetrics);
      expect(result).toHaveLength(3);
    });

    it("should handle board with no sprints", async () => {
      const boardId = "board-new";

      analyticsRepository.getVelocityMetrics.mockResolvedValue([]);

      const result = await analyticsService.getBoardVelocity(boardId);

      expect(result).toEqual([]);
    });
  });

  describe("getUserAssignedTasks", () => {
    it("should return assigned tasks for user", async () => {
      const userId = "user-123";
      const organizationId = "org-456";
      const expectedTasks = [
        {
          id: "card-001",
          title: "Implement feature",
          description: "Add new feature",
          status: "in_progress",
          priority: "high",
          due_date: "2025-01-25T00:00:00Z",
          list_title: "In Progress",
          board_id: "board-001",
          board_title: "Project A",
        },
        {
          id: "card-002",
          title: "Fix bug",
          description: null,
          status: "todo",
          priority: "critical",
          due_date: "2025-01-20T00:00:00Z",
          list_title: "To Do",
          board_id: "board-001",
          board_title: "Project A",
        },
      ];

      analyticsRepository.getAssignedTasks.mockResolvedValue(expectedTasks);

      const result = await analyticsService.getUserAssignedTasks(
        userId,
        organizationId,
      );

      expect(analyticsRepository.getAssignedTasks).toHaveBeenCalledWith(
        userId,
        organizationId,
      );
      expect(result).toEqual(expectedTasks);
      expect(result).toHaveLength(2);
    });

    it("should return empty array when user has no tasks", async () => {
      const userId = "user-999";
      const organizationId = "org-456";

      analyticsRepository.getAssignedTasks.mockResolvedValue([]);

      const result = await analyticsService.getUserAssignedTasks(
        userId,
        organizationId,
      );

      expect(result).toEqual([]);
    });
  });

  describe("getDueDateAnalytics", () => {
    it("should return due date analytics for board", async () => {
      const boardId = "board-123";
      const expectedAnalytics = {
        summary: {
          overdue: 3,
          dueToday: 2,
          dueThisWeek: 5,
          upcoming: 10,
          noDueDate: 15,
        },
        byPriority: {
          critical: 1,
          high: 2,
          medium: 0,
          low: 0,
        },
        overdueCards: [
          {
            id: "card-001",
            title: "Overdue task",
            due_date: "2025-01-10T00:00:00Z",
            priority: "critical",
            status: "in_progress",
            list_id: "list-123",
            list_title: "In Progress",
          },
        ],
        dueTodayCards: [
          {
            id: "card-002",
            title: "Today's task",
            due_date: new Date().toISOString(),
            priority: "high",
            status: "todo",
            list_id: "list-456",
            list_title: "To Do",
          },
        ],
      };

      analyticsRepository.getDueDateAnalytics.mockResolvedValue(
        expectedAnalytics,
      );

      const result = await analyticsService.getDueDateAnalytics(boardId);

      expect(analyticsRepository.getDueDateAnalytics).toHaveBeenCalledWith(
        boardId,
      );
      expect(result.summary.overdue).toBe(3);
      expect(result.summary.dueToday).toBe(2);
      expect(result.byPriority.critical).toBe(1);
    });

    it("should handle board with no due dates", async () => {
      const boardId = "board-123";
      const expectedAnalytics = {
        summary: {
          overdue: 0,
          dueToday: 0,
          dueThisWeek: 0,
          upcoming: 0,
          noDueDate: 20,
        },
        byPriority: {
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
        },
        overdueCards: [],
        dueTodayCards: [],
      };

      analyticsRepository.getDueDateAnalytics.mockResolvedValue(
        expectedAnalytics,
      );

      const result = await analyticsService.getDueDateAnalytics(boardId);

      expect(result.summary.overdue).toBe(0);
      expect(result.summary.noDueDate).toBe(20);
    });
  });

  describe("getProductivityTrends", () => {
    it("should return weekly productivity trends", async () => {
      const userId = "user-123";
      const organizationId = "org-456";
      const expectedTrends = {
        period: "weekly",
        data: [
          {
            date: "2025-01-01",
            cardsCreated: 5,
            cardsCompleted: 4,
            netChange: 1,
          },
          {
            date: "2025-01-08",
            cardsCreated: 6,
            cardsCompleted: 7,
            netChange: -1,
          },
        ],
        summary: {
          totalCreated: 11,
          totalCompleted: 11,
          averagePerPeriod: 5.5,
          trend: "stable",
        },
      };

      analyticsRepository.getProductivityTrends.mockResolvedValue(
        expectedTrends,
      );

      const result = await analyticsService.getProductivityTrends(
        userId,
        organizationId,
        "weekly",
      );

      expect(analyticsRepository.getProductivityTrends).toHaveBeenCalledWith(
        userId,
        organizationId,
        "weekly",
        undefined,
      );
      expect(result.period).toBe("weekly");
      expect(result.summary.trend).toBe("stable");
    });

    it("should return monthly productivity trends", async () => {
      const userId = "user-123";
      const organizationId = "org-456";
      const expectedTrends = {
        period: "monthly",
        data: [
          {
            date: "2025-01-01",
            cardsCreated: 20,
            cardsCompleted: 22,
            netChange: -2,
          },
        ],
        summary: {
          totalCreated: 20,
          totalCompleted: 22,
          averagePerPeriod: 22,
          trend: "increasing",
        },
      };

      analyticsRepository.getProductivityTrends.mockResolvedValue(
        expectedTrends,
      );

      const result = await analyticsService.getProductivityTrends(
        userId,
        organizationId,
        "monthly",
        60,
      );

      expect(analyticsRepository.getProductivityTrends).toHaveBeenCalledWith(
        userId,
        organizationId,
        "monthly",
        60,
      );
      expect(result.period).toBe("monthly");
      expect(result.summary.trend).toBe("increasing");
    });

    it("should handle zero activity", async () => {
      const userId = "user-999";
      const organizationId = "org-456";
      const expectedTrends = {
        period: "weekly",
        data: [],
        summary: {
          totalCreated: 0,
          totalCompleted: 0,
          averagePerPeriod: 0,
          trend: "stable",
        },
      };

      analyticsRepository.getProductivityTrends.mockResolvedValue(
        expectedTrends,
      );

      const result = await analyticsService.getProductivityTrends(
        userId,
        organizationId,
        "weekly",
      );

      expect(result.summary.totalCompleted).toBe(0);
    });
  });

  describe("getBoardsOverview", () => {
    it("should return overview for user's boards", async () => {
      const userId = "user-123";
      const organizationId = "org-456";
      const expectedOverview = [
        {
          id: "board-001",
          title: "Project A",
          organization_id: "org-456",
          totalCards: 20,
          completedCards: 15,
          inProgressCards: 3,
          overdueCards: 1,
          completionRate: 75.0,
          lastActivity: "2025-01-15T10:00:00Z",
          assignedToMeCount: 5,
        },
        {
          id: "board-002",
          title: "Project B",
          organization_id: "org-456",
          totalCards: 10,
          completedCards: 8,
          inProgressCards: 2,
          overdueCards: 0,
          completionRate: 80.0,
          lastActivity: "2025-01-14T10:00:00Z",
          assignedToMeCount: 3,
        },
      ];

      analyticsRepository.getBoardsOverview.mockResolvedValue(expectedOverview);

      const result = await analyticsService.getBoardsOverview(
        userId,
        organizationId,
      );

      expect(analyticsRepository.getBoardsOverview).toHaveBeenCalledWith(
        userId,
        organizationId,
      );
      expect(result).toEqual(expectedOverview);
      expect(result).toHaveLength(2);
    });

    it("should return empty array when user has no boards", async () => {
      const userId = "user-999";
      const organizationId = "org-456";

      analyticsRepository.getBoardsOverview.mockResolvedValue([]);

      const result = await analyticsService.getBoardsOverview(
        userId,
        organizationId,
      );

      expect(result).toEqual([]);
    });
  });

  describe("getWeeklyMetrics", () => {
    it("should return weekly metrics for user", async () => {
      const userId = "user-123";
      const organizationId = "org-456";
      const expectedMetrics = [
        {
          weekStartDate: "2025-01-01",
          weekEndDate: "2025-01-07",
          cardsCreated: 5,
          cardsCompleted: 6,
          timeSpentHours: 8.5,
          completionRate: 120.0,
          topBoards: [
            {
              boardId: "board-001",
              boardTitle: "Project A",
              cardsCompleted: 4,
            },
          ],
        },
      ];

      analyticsRepository.getWeeklyMetrics.mockResolvedValue(expectedMetrics);

      const result = await analyticsService.getWeeklyMetrics(
        userId,
        organizationId,
      );

      expect(analyticsRepository.getWeeklyMetrics).toHaveBeenCalledWith(
        userId,
        organizationId,
        undefined,
      );
      expect(result).toEqual(expectedMetrics);
    });

    it("should return metrics for specific weeks back", async () => {
      const userId = "user-123";
      const organizationId = "org-456";
      const weeksBack = 8;

      analyticsRepository.getWeeklyMetrics.mockResolvedValue([]);

      await analyticsService.getWeeklyMetrics(
        userId,
        organizationId,
        weeksBack,
      );

      expect(analyticsRepository.getWeeklyMetrics).toHaveBeenCalledWith(
        userId,
        organizationId,
        weeksBack,
      );
    });
  });

  describe("getMonthlyMetrics", () => {
    it("should return monthly metrics for user", async () => {
      const userId = "user-123";
      const organizationId = "org-456";
      const expectedMetrics = [
        {
          month: "2025-01",
          monthName: "January 2025",
          cardsCreated: 20,
          cardsCompleted: 22,
          timeSpentHours: 40.5,
          completionRate: 110.0,
          weeklyBreakdown: [
            {
              weekNumber: 1,
              cardsCompleted: 6,
              timeSpentHours: 10.5,
            },
          ],
          topBoards: [
            {
              boardId: "board-001",
              boardTitle: "Project A",
              cardsCompleted: 15,
              timeSpentHours: 30.0,
            },
          ],
        },
      ];

      analyticsRepository.getMonthlyMetrics.mockResolvedValue(expectedMetrics);

      const result = await analyticsService.getMonthlyMetrics(
        userId,
        organizationId,
      );

      expect(analyticsRepository.getMonthlyMetrics).toHaveBeenCalledWith(
        userId,
        organizationId,
        undefined,
      );
      expect(result).toEqual(expectedMetrics);
    });

    it("should return metrics for specific months back", async () => {
      const userId = "user-123";
      const organizationId = "org-456";
      const monthsBack = 12;

      analyticsRepository.getMonthlyMetrics.mockResolvedValue([]);

      await analyticsService.getMonthlyMetrics(
        userId,
        organizationId,
        monthsBack,
      );

      expect(analyticsRepository.getMonthlyMetrics).toHaveBeenCalledWith(
        userId,
        organizationId,
        monthsBack,
      );
    });

    it("should handle months with zero activity", async () => {
      const userId = "user-999";
      const organizationId = "org-456";
      const expectedMetrics = [
        {
          month: "2025-01",
          monthName: "January 2025",
          cardsCreated: 0,
          cardsCompleted: 0,
          timeSpentHours: 0,
          completionRate: 0,
          weeklyBreakdown: [],
          topBoards: [],
        },
      ];

      analyticsRepository.getMonthlyMetrics.mockResolvedValue(expectedMetrics);

      const result = await analyticsService.getMonthlyMetrics(
        userId,
        organizationId,
      );

      expect(result[0].cardsCompleted).toBe(0);
    });
  });
});
