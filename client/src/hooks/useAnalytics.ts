import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  ProductivityTrend,
  BoardOverview,
  WeeklyMetrics,
  MonthlyMetrics,
} from "../types/types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export interface PersonalStats {
  assignedCards: number;
  completedCards: number;
  dueSoon: number;
  overdue: number;
}

export interface AssignedTask {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
  priority: "low" | "medium" | "high" | "critical";
  due_date: string | null;
  list_title: string;
  board_id: string;
  board_title: string;
}

export interface PersonalDashboard {
  stats: PersonalStats;
  recentTasks: AssignedTask[];
}

export interface BoardStats {
  totalCards: number;
  completedCards: number;
  completionRate: number;
  cardsByStatus: Array<{ status: string; count: number }>;
  cardsByPriority: Array<{ priority: string; count: number }>;
}

export interface ActivityTimelineItem {
  id: string;
  action_type: string;
  metadata: any;
  created_at: string;
  card_title: string;
  user_email: string;
}

export interface TimeTrackingUser {
  userId: string;
  userEmail: string;
  totalMinutes: number;
  totalHours: number;
}

export interface TimeTrackingSummary {
  totalMinutes: number;
  totalHours: number;
  logCount: number;
  byUser: TimeTrackingUser[];
}

export interface BoardAnalytics {
  stats: BoardStats;
  activityTimeline: ActivityTimelineItem[];
  timeTracking: TimeTrackingSummary;
}

export interface SprintBurndown {
  sprint: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    status: "planned" | "active" | "completed" | "cancelled";
  };
  totalCards: number;
  burndownData: Array<{ date: string; remaining: number; completed: number }>;
  idealLine: Array<{ date: string; ideal: number }>;
}

export interface VelocityMetric {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: "planned" | "active" | "completed" | "cancelled";
  cards_completed: string;
}

// Hook to fetch personal dashboard
export const usePersonalDashboard = (organizationId: string | null) => {
  return useQuery<PersonalDashboard>({
    queryKey: ["dashboard", "personal", organizationId],
    queryFn: async () => {
      const { data } = await axios.get(
        `${API_URL}/api/v1/analytics/dashboard/personal`,
        {
          params: { organizationId },
          withCredentials: true,
        }
      );
      return data;
    },
    enabled: !!organizationId,
  });
};

// Hook to fetch board analytics
export const useBoardAnalytics = (boardId: string | null) => {
  return useQuery<BoardAnalytics>({
    queryKey: ["analytics", "board", boardId],
    queryFn: async () => {
      const { data } = await axios.get(
        `${API_URL}/api/v1/analytics/board/${boardId}`,
        { withCredentials: true }
      );
      return data;
    },
    enabled: !!boardId,
  });
};

// Hook to fetch sprint burndown
export const useSprintBurndown = (sprintId: string | null) => {
  return useQuery<SprintBurndown>({
    queryKey: ["analytics", "sprint", sprintId, "burndown"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${API_URL}/api/v1/analytics/sprint/${sprintId}/burndown`,
        { withCredentials: true }
      );
      return data;
    },
    enabled: !!sprintId,
  });
};

// Hook to fetch board velocity
export const useBoardVelocity = (boardId: string | null) => {
  return useQuery<VelocityMetric[]>({
    queryKey: ["analytics", "board", boardId, "velocity"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${API_URL}/api/v1/analytics/board/${boardId}/velocity`,
        { withCredentials: true }
      );
      return data;
    },
    enabled: !!boardId,
  });
};

// Hook to fetch assigned tasks
export const useAssignedTasks = (organizationId: string | null) => {
  return useQuery<AssignedTask[]>({
    queryKey: ["analytics", "tasks", "assigned", organizationId],
    queryFn: async () => {
      const { data } = await axios.get(
        `${API_URL}/api/v1/analytics/tasks/assigned`,
        {
          params: { organizationId },
          withCredentials: true,
        }
      );
      return data;
    },
    enabled: !!organizationId,
  });
};

// Hook to fetch productivity trends
export const useProductivityTrends = (
  organizationId: string | null,
  period: "weekly" | "monthly" = "weekly",
  daysBack?: number
) => {
  return useQuery<ProductivityTrend>({
    queryKey: ["analytics", "trends", "personal", organizationId, period, daysBack],
    queryFn: async () => {
      const { data } = await axios.get(
        `${API_URL}/api/v1/analytics/trends/personal`,
        {
          params: { organizationId, period, daysBack },
          withCredentials: true,
        }
      );
      return data;
    },
    enabled: !!organizationId,
  });
};

// Hook to fetch boards overview
export const useBoardsOverview = (organizationId: string | null) => {
  return useQuery<BoardOverview[]>({
    queryKey: ["analytics", "boards", "overview", organizationId],
    queryFn: async () => {
      const { data } = await axios.get(
        `${API_URL}/api/v1/analytics/boards/overview`,
        {
          params: { organizationId },
          withCredentials: true,
        }
      );
      return data;
    },
    enabled: !!organizationId,
  });
};

// Hook to fetch weekly metrics
export const useWeeklyMetrics = (
  organizationId: string | null,
  weeksBack: number = 4
) => {
  return useQuery<WeeklyMetrics[]>({
    queryKey: ["analytics", "metrics", "weekly", organizationId, weeksBack],
    queryFn: async () => {
      const { data } = await axios.get(
        `${API_URL}/api/v1/analytics/metrics/weekly`,
        {
          params: { organizationId, weeksBack },
          withCredentials: true,
        }
      );
      return data;
    },
    enabled: !!organizationId,
  });
};

// Hook to fetch monthly metrics
export const useMonthlyMetrics = (
  organizationId: string | null,
  monthsBack: number = 6
) => {
  return useQuery<MonthlyMetrics[]>({
    queryKey: ["analytics", "metrics", "monthly", organizationId, monthsBack],
    queryFn: async () => {
      const { data } = await axios.get(
        `${API_URL}/api/v1/analytics/metrics/monthly`,
        {
          params: { organizationId, monthsBack },
          withCredentials: true,
        }
      );
      return data;
    },
    enabled: !!organizationId,
  });
};
