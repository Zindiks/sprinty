import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { ProductivityTrend, BoardOverview, WeeklyMetrics, MonthlyMetrics } from '../types/types';

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
  priority: 'low' | 'medium' | 'high' | 'critical';
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
    status: 'planned' | 'active' | 'completed' | 'cancelled';
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
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  cards_completed: string;
}

export interface DueDateCard {
  id: string;
  title: string;
  due_date: string | null;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: string | null;
  list_id: string;
  list_title: string;
}

export interface DueDateSummary {
  overdue: number;
  dueToday: number;
  dueThisWeek: number;
  upcoming: number;
  noDueDate: number;
}

export interface DueDateByPriority {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface DueDateAnalytics {
  summary: DueDateSummary;
  byPriority: DueDateByPriority;
  overdueCards: DueDateCard[];
  dueTodayCards: DueDateCard[];
}

// Hook to fetch personal dashboard
export const usePersonalDashboard = (organizationId: string | null) => {
  return useQuery<PersonalDashboard>({
    queryKey: ['dashboard', 'personal', organizationId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/analytics/dashboard/personal`, {
        params: { organizationId },
      });
      return data;
    },
    enabled: !!organizationId,
  });
};

// Hook to fetch board analytics
export const useBoardAnalytics = (boardId: string | null) => {
  return useQuery<BoardAnalytics>({
    queryKey: ['analytics', 'board', boardId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/analytics/board/${boardId}`);
      return data;
    },
    enabled: !!boardId,
  });
};

// Hook to fetch sprint burndown
export const useSprintBurndown = (sprintId: string | null) => {
  return useQuery<SprintBurndown>({
    queryKey: ['analytics', 'sprint', sprintId, 'burndown'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/analytics/sprint/${sprintId}/burndown`);
      return data;
    },
    enabled: !!sprintId,
  });
};

// Hook to fetch board velocity
export const useBoardVelocity = (boardId: string | null) => {
  return useQuery<VelocityMetric[]>({
    queryKey: ['analytics', 'board', boardId, 'velocity'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/analytics/board/${boardId}/velocity`);
      return data;
    },
    enabled: !!boardId,
  });
};

// Hook to fetch assigned tasks
export const useAssignedTasks = (organizationId: string | null) => {
  return useQuery<AssignedTask[]>({
    queryKey: ['analytics', 'tasks', 'assigned', organizationId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/analytics/tasks/assigned`, {
        params: { organizationId },
      });
      return data;
    },
    enabled: !!organizationId,
  });
};

// Hook to fetch due date analytics
export const useDueDateAnalytics = (boardId: string | null) => {
  return useQuery<DueDateAnalytics>({
    queryKey: ['analytics', 'board', boardId, 'due-dates'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/analytics/board/${boardId}/due-dates`);
      return data;
    },
    enabled: !!boardId,
  });
};

// Hook to fetch productivity trends
export const useProductivityTrends = (
  organizationId: string | null,
  period: 'weekly' | 'monthly' = 'weekly',
  daysBack?: number,
) => {
  return useQuery<ProductivityTrend>({
    queryKey: ['analytics', 'trends', 'personal', organizationId, period, daysBack],
    queryFn: async () => {
      const { data } = await apiClient.get(`/analytics/trends/personal`, {
        params: { organizationId, period, daysBack },
      });
      return data;
    },
    enabled: !!organizationId,
  });
};

// Hook to fetch boards overview
export const useBoardsOverview = (organizationId: string | null) => {
  return useQuery<BoardOverview[]>({
    queryKey: ['analytics', 'boards', 'overview', organizationId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/analytics/boards/overview`, {
        params: { organizationId },
      });
      return data;
    },
    enabled: !!organizationId,
  });
};

// Hook to fetch weekly metrics
export const useWeeklyMetrics = (organizationId: string | null, weeksBack: number = 4) => {
  return useQuery<WeeklyMetrics[]>({
    queryKey: ['analytics', 'metrics', 'weekly', organizationId, weeksBack],
    queryFn: async () => {
      const { data } = await apiClient.get(`/analytics/metrics/weekly`, {
        params: { organizationId, weeksBack },
      });
      return data;
    },
    enabled: !!organizationId,
  });
};

// Hook to fetch monthly metrics
export const useMonthlyMetrics = (organizationId: string | null, monthsBack: number = 6) => {
  return useQuery<MonthlyMetrics[]>({
    queryKey: ['analytics', 'metrics', 'monthly', organizationId, monthsBack],
    queryFn: async () => {
      const { data } = await apiClient.get(`/analytics/metrics/monthly`, {
        params: { organizationId, monthsBack },
      });
      return data;
    },
    enabled: !!organizationId,
  });
};
