import { ActivityService } from "../modules/activities/activity.service";
import { ActivityRepository } from "../modules/activities/activity.repository";
import {
  CreateActivity,
  ActivityResponse,
  ActivityWithUserResponse,
  ActivityListResponse,
  ActivityQueryParams,
  ActivityStatsResponse,
} from "../modules/activities/activity.schema";

// Mock the repository
jest.mock("../modules/activities/activity.repository");

class MockedActivityRepository {
  knex = {} as any;
  createActivity = jest.fn();
  getActivityById = jest.fn();
  getActivityWithUser = jest.fn();
  getActivitiesByCardId = jest.fn();
  getActivitiesByUserId = jest.fn();
  getActivities = jest.fn();
  getActivityStats = jest.fn();
  deleteActivitiesByCardId = jest.fn();
}

describe("ActivityService", () => {
  let activityService: ActivityService;
  let activityRepository: jest.Mocked<ActivityRepository>;

  beforeEach(() => {
    activityRepository = new MockedActivityRepository() as unknown as jest.Mocked<ActivityRepository>;
    activityService = new ActivityService();
    // @ts-ignore - inject mocked repository
    activityService["activityRepository"] = activityRepository;
    jest.clearAllMocks();
  });

  describe("logActivity", () => {
    it("should log activity with action type 'created'", async () => {
      const input: CreateActivity = {
        card_id: "card-123",
        user_id: "user-456",
        action_type: "created",
      };
      const expectedResponse: ActivityResponse = {
        id: "activity-001",
        card_id: "card-123",
        user_id: "user-456",
        action_type: "created",
        metadata: null,
        created_at: new Date().toISOString(),
      };

      activityRepository.createActivity.mockResolvedValue(expectedResponse);

      const result = await activityService.logActivity(input);

      expect(activityRepository.createActivity).toHaveBeenCalledWith(input);
      expect(result).toEqual(expectedResponse);
      expect(result.action_type).toBe("created");
    });

    it("should log activity with metadata", async () => {
      const input: CreateActivity = {
        card_id: "card-123",
        user_id: "user-456",
        action_type: "moved",
        metadata: {
          from_list_id: "list-001",
          to_list_id: "list-002",
          from_list_name: "To Do",
          to_list_name: "In Progress",
        },
      };
      const expectedResponse: ActivityResponse = {
        id: "activity-002",
        card_id: "card-123",
        user_id: "user-456",
        action_type: "moved",
        metadata: {
          from_list_id: "list-001",
          to_list_id: "list-002",
          from_list_name: "To Do",
          to_list_name: "In Progress",
        },
        created_at: new Date().toISOString(),
      };

      activityRepository.createActivity.mockResolvedValue(expectedResponse);

      const result = await activityService.logActivity(input);

      expect(result.metadata).toEqual({
        from_list_id: "list-001",
        to_list_id: "list-002",
        from_list_name: "To Do",
        to_list_name: "In Progress",
      });
    });

    it("should log assignee_added activity", async () => {
      const input: CreateActivity = {
        card_id: "card-123",
        user_id: "user-456",
        action_type: "assignee_added",
        metadata: {
          assignee_id: "user-789",
          assignee_email: "john@example.com",
        },
      };
      const expectedResponse: ActivityResponse = {
        id: "activity-003",
        card_id: "card-123",
        user_id: "user-456",
        action_type: "assignee_added",
        metadata: {
          assignee_id: "user-789",
          assignee_email: "john@example.com",
        },
        created_at: new Date().toISOString(),
      };

      activityRepository.createActivity.mockResolvedValue(expectedResponse);

      const result = await activityService.logActivity(input);

      expect(result.action_type).toBe("assignee_added");
      expect(result.metadata.assignee_id).toBe("user-789");
    });

    it("should log label_added activity", async () => {
      const input: CreateActivity = {
        card_id: "card-123",
        user_id: "user-456",
        action_type: "label_added",
        metadata: {
          label_id: "label-001",
          label_name: "Bug",
          label_color: "#FF0000",
        },
      };
      const expectedResponse: ActivityResponse = {
        id: "activity-004",
        card_id: "card-123",
        user_id: "user-456",
        action_type: "label_added",
        metadata: {
          label_id: "label-001",
          label_name: "Bug",
          label_color: "#FF0000",
        },
        created_at: new Date().toISOString(),
      };

      activityRepository.createActivity.mockResolvedValue(expectedResponse);

      const result = await activityService.logActivity(input);

      expect(result.action_type).toBe("label_added");
      expect(result.metadata.label_name).toBe("Bug");
    });

    it("should handle database errors during activity logging", async () => {
      const input: CreateActivity = {
        card_id: "card-123",
        user_id: "user-456",
        action_type: "updated",
      };
      const error = new Error("Database connection failed");

      activityRepository.createActivity.mockRejectedValue(error);

      await expect(activityService.logActivity(input)).rejects.toThrow(
        "Database connection failed",
      );
    });
  });

  describe("getActivityById", () => {
    it("should return activity when found", async () => {
      const id = "activity-001";
      const expectedResponse: ActivityResponse = {
        id: "activity-001",
        card_id: "card-123",
        user_id: "user-456",
        action_type: "created",
        metadata: null,
        created_at: "2025-01-01T10:00:00Z",
      };

      activityRepository.getActivityById.mockResolvedValue(expectedResponse);

      const result = await activityService.getActivityById(id);

      expect(activityRepository.getActivityById).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResponse);
    });

    it("should return undefined when activity not found", async () => {
      const id = "activity-999";

      activityRepository.getActivityById.mockResolvedValue(undefined);

      const result = await activityService.getActivityById(id);

      expect(result).toBeUndefined();
    });

    it("should return activity with metadata", async () => {
      const id = "activity-002";
      const expectedResponse: ActivityResponse = {
        id: "activity-002",
        card_id: "card-123",
        user_id: "user-456",
        action_type: "moved",
        metadata: { from_list_id: "list-001", to_list_id: "list-002" },
        created_at: "2025-01-01T10:00:00Z",
      };

      activityRepository.getActivityById.mockResolvedValue(expectedResponse);

      const result = await activityService.getActivityById(id);

      expect(result?.metadata).toEqual({
        from_list_id: "list-001",
        to_list_id: "list-002",
      });
    });
  });

  describe("getActivityWithUser", () => {
    it("should return activity with user details", async () => {
      const id = "activity-001";
      const expectedResponse: ActivityWithUserResponse = {
        id: "activity-001",
        card_id: "card-123",
        user_id: "user-456",
        action_type: "created",
        metadata: null,
        created_at: "2025-01-01T10:00:00Z",
        user: {
          id: "user-456",
          email: "john@example.com",
          username: "johndoe",
        },
      };

      activityRepository.getActivityWithUser.mockResolvedValue(expectedResponse);

      const result = await activityService.getActivityWithUser(id);

      expect(activityRepository.getActivityWithUser).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResponse);
      expect(result?.user.email).toBe("john@example.com");
    });

    it("should return undefined when activity not found", async () => {
      const id = "activity-999";

      activityRepository.getActivityWithUser.mockResolvedValue(undefined);

      const result = await activityService.getActivityWithUser(id);

      expect(result).toBeUndefined();
    });

    it("should handle user without profile (username optional)", async () => {
      const id = "activity-001";
      const expectedResponse: ActivityWithUserResponse = {
        id: "activity-001",
        card_id: "card-123",
        user_id: "user-456",
        action_type: "created",
        metadata: null,
        created_at: "2025-01-01T10:00:00Z",
        user: {
          id: "user-456",
          email: "john@example.com",
        },
      };

      activityRepository.getActivityWithUser.mockResolvedValue(expectedResponse);

      const result = await activityService.getActivityWithUser(id);

      expect(result?.user.email).toBe("john@example.com");
      expect(result?.user.username).toBeUndefined();
    });
  });

  describe("getActivitiesByCardId", () => {
    it("should return all activities for a card", async () => {
      const card_id = "card-123";
      const expectedActivities: ActivityListResponse = [
        {
          id: "activity-001",
          card_id: "card-123",
          user_id: "user-456",
          action_type: "created",
          metadata: null,
          created_at: "2025-01-01T10:00:00Z",
          user: {
            id: "user-456",
            email: "john@example.com",
            username: "johndoe",
          },
        },
        {
          id: "activity-002",
          card_id: "card-123",
          user_id: "user-789",
          action_type: "comment_added",
          metadata: { comment_text: "This looks good" },
          created_at: "2025-01-01T11:00:00Z",
          user: {
            id: "user-789",
            email: "jane@example.com",
            username: "janedoe",
          },
        },
      ];

      activityRepository.getActivitiesByCardId.mockResolvedValue(expectedActivities);

      const result = await activityService.getActivitiesByCardId(card_id);

      expect(activityRepository.getActivitiesByCardId).toHaveBeenCalledWith(
        card_id,
        undefined,
      );
      expect(result).toEqual(expectedActivities);
      expect(result).toHaveLength(2);
    });

    it("should return empty array when card has no activities", async () => {
      const card_id = "card-empty";

      activityRepository.getActivitiesByCardId.mockResolvedValue([]);

      const result = await activityService.getActivitiesByCardId(card_id);

      expect(result).toEqual([]);
    });

    it("should filter by action_type", async () => {
      const card_id = "card-123";
      const params: ActivityQueryParams = {
        action_type: "moved",
      };
      const expectedActivities: ActivityListResponse = [
        {
          id: "activity-002",
          card_id: "card-123",
          user_id: "user-456",
          action_type: "moved",
          metadata: { from_list_id: "list-001", to_list_id: "list-002" },
          created_at: "2025-01-01T11:00:00Z",
          user: {
            id: "user-456",
            email: "john@example.com",
            username: "johndoe",
          },
        },
      ];

      activityRepository.getActivitiesByCardId.mockResolvedValue(expectedActivities);

      const result = await activityService.getActivitiesByCardId(card_id, params);

      expect(activityRepository.getActivitiesByCardId).toHaveBeenCalledWith(
        card_id,
        params,
      );
      expect(result).toHaveLength(1);
      expect(result[0].action_type).toBe("moved");
    });

    it("should paginate with limit and offset", async () => {
      const card_id = "card-123";
      const params: ActivityQueryParams = {
        limit: 10,
        offset: 5,
      };
      const expectedActivities: ActivityListResponse = Array.from(
        { length: 10 },
        (_, i) => ({
          id: `activity-${i + 6}`,
          card_id: "card-123",
          user_id: "user-456",
          action_type: "updated",
          metadata: null,
          created_at: new Date(Date.now() - i * 1000).toISOString(),
          user: {
            id: "user-456",
            email: "john@example.com",
            username: "johndoe",
          },
        }),
      );

      activityRepository.getActivitiesByCardId.mockResolvedValue(expectedActivities);

      const result = await activityService.getActivitiesByCardId(card_id, params);

      expect(result).toHaveLength(10);
    });

    it("should return activities ordered by created_at desc", async () => {
      const card_id = "card-123";
      const expectedActivities: ActivityListResponse = [
        {
          id: "activity-003",
          card_id: "card-123",
          user_id: "user-456",
          action_type: "updated",
          metadata: null,
          created_at: "2025-01-01T12:00:00Z",
          user: {
            id: "user-456",
            email: "john@example.com",
            username: "johndoe",
          },
        },
        {
          id: "activity-002",
          card_id: "card-123",
          user_id: "user-456",
          action_type: "created",
          metadata: null,
          created_at: "2025-01-01T11:00:00Z",
          user: {
            id: "user-456",
            email: "john@example.com",
            username: "johndoe",
          },
        },
      ];

      activityRepository.getActivitiesByCardId.mockResolvedValue(expectedActivities);

      const result = await activityService.getActivitiesByCardId(card_id);

      // Most recent first
      expect(result[0].created_at).toBe("2025-01-01T12:00:00Z");
      expect(result[1].created_at).toBe("2025-01-01T11:00:00Z");
    });
  });

  describe("getActivitiesByUserId", () => {
    it("should return all activities by user", async () => {
      const user_id = "user-456";
      const expectedActivities: ActivityListResponse = [
        {
          id: "activity-001",
          card_id: "card-123",
          user_id: "user-456",
          action_type: "created",
          metadata: null,
          created_at: "2025-01-01T10:00:00Z",
          user: {
            id: "user-456",
            email: "john@example.com",
            username: "johndoe",
          },
        },
        {
          id: "activity-002",
          card_id: "card-456",
          user_id: "user-456",
          action_type: "updated",
          metadata: null,
          created_at: "2025-01-01T11:00:00Z",
          user: {
            id: "user-456",
            email: "john@example.com",
            username: "johndoe",
          },
        },
      ];

      activityRepository.getActivitiesByUserId.mockResolvedValue(expectedActivities);

      const result = await activityService.getActivitiesByUserId(user_id);

      expect(activityRepository.getActivitiesByUserId).toHaveBeenCalledWith(
        user_id,
        undefined,
      );
      expect(result).toEqual(expectedActivities);
      expect(result).toHaveLength(2);
    });

    it("should return empty array when user has no activities", async () => {
      const user_id = "user-999";

      activityRepository.getActivitiesByUserId.mockResolvedValue([]);

      const result = await activityService.getActivitiesByUserId(user_id);

      expect(result).toEqual([]);
    });

    it("should filter by card_id and action_type", async () => {
      const user_id = "user-456";
      const params: ActivityQueryParams = {
        card_id: "card-123",
        action_type: "comment_added",
      };
      const expectedActivities: ActivityListResponse = [
        {
          id: "activity-005",
          card_id: "card-123",
          user_id: "user-456",
          action_type: "comment_added",
          metadata: { comment_text: "Great work!" },
          created_at: "2025-01-01T12:00:00Z",
          user: {
            id: "user-456",
            email: "john@example.com",
            username: "johndoe",
          },
        },
      ];

      activityRepository.getActivitiesByUserId.mockResolvedValue(expectedActivities);

      const result = await activityService.getActivitiesByUserId(user_id, params);

      expect(result).toHaveLength(1);
      expect(result[0].card_id).toBe("card-123");
      expect(result[0].action_type).toBe("comment_added");
    });

    it("should paginate user activities", async () => {
      const user_id = "user-456";
      const params: ActivityQueryParams = {
        limit: 25,
        offset: 10,
      };
      const expectedActivities: ActivityListResponse = Array.from(
        { length: 25 },
        (_, i) => ({
          id: `activity-${i + 11}`,
          card_id: "card-123",
          user_id: "user-456",
          action_type: "updated",
          metadata: null,
          created_at: new Date(Date.now() - i * 1000).toISOString(),
          user: {
            id: "user-456",
            email: "john@example.com",
            username: "johndoe",
          },
        }),
      );

      activityRepository.getActivitiesByUserId.mockResolvedValue(expectedActivities);

      const result = await activityService.getActivitiesByUserId(user_id, params);

      expect(result).toHaveLength(25);
    });
  });

  describe("getActivities", () => {
    it("should return activities with all filters", async () => {
      const params: ActivityQueryParams = {
        card_id: "card-123",
        user_id: "user-456",
        action_type: "moved",
        limit: 20,
        offset: 0,
      };
      const expectedActivities: ActivityListResponse = [
        {
          id: "activity-001",
          card_id: "card-123",
          user_id: "user-456",
          action_type: "moved",
          metadata: { from_list_id: "list-001", to_list_id: "list-002" },
          created_at: "2025-01-01T10:00:00Z",
          user: {
            id: "user-456",
            email: "john@example.com",
            username: "johndoe",
          },
        },
      ];

      activityRepository.getActivities.mockResolvedValue(expectedActivities);

      const result = await activityService.getActivities(params);

      expect(activityRepository.getActivities).toHaveBeenCalledWith(params);
      expect(result).toEqual(expectedActivities);
    });

    it("should return all activities with default pagination", async () => {
      const params: ActivityQueryParams = {};
      const expectedActivities: ActivityListResponse = Array.from(
        { length: 50 },
        (_, i) => ({
          id: `activity-${i + 1}`,
          card_id: "card-123",
          user_id: "user-456",
          action_type: "updated",
          metadata: null,
          created_at: new Date(Date.now() - i * 1000).toISOString(),
          user: {
            id: "user-456",
            email: "john@example.com",
            username: "johndoe",
          },
        }),
      );

      activityRepository.getActivities.mockResolvedValue(expectedActivities);

      const result = await activityService.getActivities(params);

      expect(result).toHaveLength(50);
    });

    it("should filter by action_type only", async () => {
      const params: ActivityQueryParams = {
        action_type: "assignee_added",
      };
      const expectedActivities: ActivityListResponse = [
        {
          id: "activity-001",
          card_id: "card-123",
          user_id: "user-456",
          action_type: "assignee_added",
          metadata: { assignee_id: "user-789" },
          created_at: "2025-01-01T10:00:00Z",
          user: {
            id: "user-456",
            email: "john@example.com",
            username: "johndoe",
          },
        },
      ];

      activityRepository.getActivities.mockResolvedValue(expectedActivities);

      const result = await activityService.getActivities(params);

      expect(result[0].action_type).toBe("assignee_added");
    });
  });

  describe("getActivityStats", () => {
    it("should return activity statistics for card", async () => {
      const card_id = "card-123";
      const expectedStats: ActivityStatsResponse = {
        card_id: "card-123",
        total_activities: 10,
        activities_by_type: {
          created: 1,
          updated: 3,
          moved: 2,
          comment_added: 2,
          assignee_added: 1,
          label_added: 1,
        },
        recent_activity: {
          id: "activity-010",
          card_id: "card-123",
          user_id: "user-456",
          action_type: "comment_added",
          metadata: { comment_text: "Latest comment" },
          created_at: "2025-01-01T15:00:00Z",
          user: {
            id: "user-456",
            email: "john@example.com",
            username: "johndoe",
          },
        },
      };

      activityRepository.getActivityStats.mockResolvedValue(expectedStats);

      const result = await activityService.getActivityStats(card_id);

      expect(activityRepository.getActivityStats).toHaveBeenCalledWith(card_id);
      expect(result.total_activities).toBe(10);
      expect(result.activities_by_type.created).toBe(1);
      expect(result.activities_by_type.updated).toBe(3);
      expect(result.recent_activity?.action_type).toBe("comment_added");
    });

    it("should return zero stats when card has no activities", async () => {
      const card_id = "card-empty";
      const expectedStats: ActivityStatsResponse = {
        card_id: "card-empty",
        total_activities: 0,
        activities_by_type: {},
        recent_activity: undefined,
      };

      activityRepository.getActivityStats.mockResolvedValue(expectedStats);

      const result = await activityService.getActivityStats(card_id);

      expect(result.total_activities).toBe(0);
      expect(result.activities_by_type).toEqual({});
      expect(result.recent_activity).toBeUndefined();
    });

    it("should group activities by type correctly", async () => {
      const card_id = "card-123";
      const expectedStats: ActivityStatsResponse = {
        card_id: "card-123",
        total_activities: 5,
        activities_by_type: {
          moved: 5,
        },
        recent_activity: {
          id: "activity-005",
          card_id: "card-123",
          user_id: "user-456",
          action_type: "moved",
          metadata: { from_list_id: "list-001", to_list_id: "list-002" },
          created_at: "2025-01-01T12:00:00Z",
          user: {
            id: "user-456",
            email: "john@example.com",
            username: "johndoe",
          },
        },
      };

      activityRepository.getActivityStats.mockResolvedValue(expectedStats);

      const result = await activityService.getActivityStats(card_id);

      expect(result.activities_by_type.moved).toBe(5);
      expect(Object.keys(result.activities_by_type)).toHaveLength(1);
    });
  });

  describe("deleteActivitiesByCardId", () => {
    it("should delete all activities for a card", async () => {
      const card_id = "card-123";

      activityRepository.deleteActivitiesByCardId.mockResolvedValue(10);

      const result = await activityService.deleteActivitiesByCardId(card_id);

      expect(activityRepository.deleteActivitiesByCardId).toHaveBeenCalledWith(
        card_id,
      );
      expect(result).toBe(10);
    });

    it("should return 0 when card has no activities to delete", async () => {
      const card_id = "card-empty";

      activityRepository.deleteActivitiesByCardId.mockResolvedValue(0);

      const result = await activityService.deleteActivitiesByCardId(card_id);

      expect(result).toBe(0);
    });

    it("should delete large number of activities", async () => {
      const card_id = "card-123";

      activityRepository.deleteActivitiesByCardId.mockResolvedValue(500);

      const result = await activityService.deleteActivitiesByCardId(card_id);

      expect(result).toBe(500);
    });
  });
});
