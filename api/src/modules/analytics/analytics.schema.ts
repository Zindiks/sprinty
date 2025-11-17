import { Type, Static } from "@sinclair/typebox";

// Query parameter schemas
export const PersonalDashboardQuerySchema = Type.Object({
  organizationId: Type.String({ format: "uuid" }),
});

export const BoardAnalyticsParamsSchema = Type.Object({
  boardId: Type.String({ format: "uuid" }),
});

export const SprintBurndownParamsSchema = Type.Object({
  sprintId: Type.String({ format: "uuid" }),
});

// Response schemas
export const PersonalStatsSchema = Type.Object({
  assignedCards: Type.Number(),
  completedCards: Type.Number(),
  dueSoon: Type.Number(),
  overdue: Type.Number(),
});

export const AssignedTaskSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  title: Type.String(),
  description: Type.Union([Type.String(), Type.Null()]),
  status: Type.Union([Type.String(), Type.Null()]),
  priority: Type.Union([
    Type.Literal("low"),
    Type.Literal("medium"),
    Type.Literal("high"),
    Type.Literal("critical"),
  ]),
  due_date: Type.Union([Type.String(), Type.Null()]),
  list_title: Type.String(),
  board_id: Type.String({ format: "uuid" }),
  board_title: Type.String(),
});

export const PersonalDashboardResponseSchema = Type.Object({
  stats: PersonalStatsSchema,
  recentTasks: Type.Array(AssignedTaskSchema),
});

export const CardsByStatusSchema = Type.Object({
  status: Type.String(),
  count: Type.Number(),
});

export const CardsByPrioritySchema = Type.Object({
  priority: Type.Union([
    Type.Literal("low"),
    Type.Literal("medium"),
    Type.Literal("high"),
    Type.Literal("critical"),
  ]),
  count: Type.Number(),
});

export const BoardStatsSchema = Type.Object({
  totalCards: Type.Number(),
  completedCards: Type.Number(),
  completionRate: Type.Number(),
  cardsByStatus: Type.Array(CardsByStatusSchema),
  cardsByPriority: Type.Array(CardsByPrioritySchema),
});

export const ActivityTimelineItemSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  action_type: Type.String(),
  metadata: Type.Any(),
  created_at: Type.String(),
  card_title: Type.String(),
  user_email: Type.String(),
});

export const TimeTrackingUserSchema = Type.Object({
  userId: Type.String({ format: "uuid" }),
  userEmail: Type.String(),
  totalMinutes: Type.Number(),
  totalHours: Type.Number(),
});

export const TimeTrackingSummarySchema = Type.Object({
  totalMinutes: Type.Number(),
  totalHours: Type.Number(),
  logCount: Type.Number(),
  byUser: Type.Array(TimeTrackingUserSchema),
});

export const BoardAnalyticsResponseSchema = Type.Object({
  stats: BoardStatsSchema,
  activityTimeline: Type.Array(ActivityTimelineItemSchema),
  timeTracking: TimeTrackingSummarySchema,
});

export const BurndownDataPointSchema = Type.Object({
  date: Type.String(),
  remaining: Type.Number(),
  completed: Type.Number(),
});

export const IdealLineDataPointSchema = Type.Object({
  date: Type.String(),
  ideal: Type.Number(),
});

export const SprintInfoSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  name: Type.String(),
  startDate: Type.String(),
  endDate: Type.String(),
  status: Type.Union([
    Type.Literal("planned"),
    Type.Literal("active"),
    Type.Literal("completed"),
    Type.Literal("cancelled"),
  ]),
});

export const SprintBurndownResponseSchema = Type.Object({
  sprint: SprintInfoSchema,
  totalCards: Type.Number(),
  burndownData: Type.Array(BurndownDataPointSchema),
  idealLine: Type.Array(IdealLineDataPointSchema),
});

export const VelocityMetricSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  name: Type.String(),
  start_date: Type.String(),
  end_date: Type.String(),
  status: Type.Union([
    Type.Literal("planned"),
    Type.Literal("active"),
    Type.Literal("completed"),
    Type.Literal("cancelled"),
  ]),
  cards_completed: Type.String(), // Knex returns count as string
});

export const VelocityResponseSchema = Type.Array(VelocityMetricSchema);

// Due Date Analytics Schemas
export const DueDateCardSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  title: Type.String(),
  due_date: Type.Union([Type.String(), Type.Null()]),
  priority: Type.Union([
    Type.Literal("low"),
    Type.Literal("medium"),
    Type.Literal("high"),
    Type.Literal("critical"),
  ]),
  status: Type.Union([Type.String(), Type.Null()]),
  list_id: Type.String({ format: "uuid" }),
  list_title: Type.String(),
});

export const DueDateSummarySchema = Type.Object({
  overdue: Type.Number(),
  dueToday: Type.Number(),
  dueThisWeek: Type.Number(),
  upcoming: Type.Number(),
  noDueDate: Type.Number(),
});

export const DueDateByPrioritySchema = Type.Object({
  critical: Type.Number(),
  high: Type.Number(),
  medium: Type.Number(),
  low: Type.Number(),
});

export const DueDateAnalyticsResponseSchema = Type.Object({
  summary: DueDateSummarySchema,
  byPriority: DueDateByPrioritySchema,
  overdueCards: Type.Array(DueDateCardSchema),
  dueTodayCards: Type.Array(DueDateCardSchema),
});

// Type exports
export type PersonalDashboardQuery = Static<typeof PersonalDashboardQuerySchema>;
export type BoardAnalyticsParams = Static<typeof BoardAnalyticsParamsSchema>;
export type SprintBurndownParams = Static<typeof SprintBurndownParamsSchema>;
export type PersonalDashboardResponse = Static<typeof PersonalDashboardResponseSchema>;
export type BoardAnalyticsResponse = Static<typeof BoardAnalyticsResponseSchema>;
export type SprintBurndownResponse = Static<typeof SprintBurndownResponseSchema>;
export type VelocityResponse = Static<typeof VelocityResponseSchema>;
export type DueDateAnalyticsResponse = Static<typeof DueDateAnalyticsResponseSchema>;

// Schema collection for registration
export const AnalyticsSchema = {
  PersonalDashboardQuerySchema,
  BoardAnalyticsParamsSchema,
  SprintBurndownParamsSchema,
  PersonalDashboardResponseSchema,
  BoardAnalyticsResponseSchema,
  SprintBurndownResponseSchema,
  VelocityResponseSchema,
  DueDateAnalyticsResponseSchema,
};
