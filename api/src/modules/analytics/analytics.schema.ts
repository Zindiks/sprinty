import { Type, Static } from "@sinclair/typebox";

// Query parameter schemas
export const PersonalDashboardQuerySchema = Type.Object(
  {
    organizationId: Type.String({ format: "uuid" }),
  },
  { $id: "PersonalDashboardQuerySchema" }
);

export const BoardAnalyticsParamsSchema = Type.Object(
  {
    boardId: Type.String({ format: "uuid" }),
  },
  { $id: "BoardAnalyticsParamsSchema" }
);

export const SprintBurndownParamsSchema = Type.Object(
  {
    sprintId: Type.String({ format: "uuid" }),
  },
  { $id: "SprintBurndownParamsSchema" }
);

// Response schemas
export const PersonalStatsSchema = Type.Object(
  {
    assignedCards: Type.Number(),
    completedCards: Type.Number(),
    dueSoon: Type.Number(),
    overdue: Type.Number(),
  },
  { $id: "PersonalStatsSchema" }
);

export const AssignedTaskSchema = Type.Object(
  {
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
  },
  { $id: "AssignedTaskSchema" }
);

export const PersonalDashboardResponseSchema = Type.Object(
  {
    stats: Type.Ref("PersonalStatsSchema"),
    recentTasks: Type.Array(Type.Ref("AssignedTaskSchema")),
  },
  { $id: "PersonalDashboardResponseSchema" }
);

export const CardsByStatusSchema = Type.Object(
  {
    status: Type.String(),
    count: Type.Number(),
  },
  { $id: "CardsByStatusSchema" }
);

export const CardsByPrioritySchema = Type.Object(
  {
    priority: Type.Union([
      Type.Literal("low"),
      Type.Literal("medium"),
      Type.Literal("high"),
      Type.Literal("critical"),
    ]),
    count: Type.Number(),
  },
  { $id: "CardsByPrioritySchema" }
);

export const BoardStatsSchema = Type.Object(
  {
    totalCards: Type.Number(),
    completedCards: Type.Number(),
    completionRate: Type.Number(),
    cardsByStatus: Type.Array(CardsByStatusSchema),
    cardsByPriority: Type.Array(CardsByPrioritySchema),
  },
  { $id: "BoardStatsSchema" }
);

export const ActivityTimelineItemSchema = Type.Object(
  {
    id: Type.String({ format: "uuid" }),
    action_type: Type.String(),
    metadata: Type.Any(),
    created_at: Type.String(),
    card_title: Type.String(),
    user_email: Type.String(),
  },
  { $id: "ActivityTimelineItemSchema" }
);

export const TimeTrackingUserSchema = Type.Object(
  {
    userId: Type.String({ format: "uuid" }),
    userEmail: Type.String(),
    totalMinutes: Type.Number(),
    totalHours: Type.Number(),
  },
  { $id: "TimeTrackingUserSchema" }
);

export const TimeTrackingSummarySchema = Type.Object(
  {
    totalMinutes: Type.Number(),
    totalHours: Type.Number(),
    logCount: Type.Number(),
    byUser: Type.Array(TimeTrackingUserSchema),
  },
  { $id: "TimeTrackingSummarySchema" }
);

export const BoardAnalyticsResponseSchema = Type.Object(
  {
    stats: Type.Ref("BoardStatsSchema"),
    activityTimeline: Type.Array(Type.Ref("ActivityTimelineItemSchema")),
    timeTracking: Type.Ref("TimeTrackingSummarySchema"),
  },
  { $id: "BoardAnalyticsResponseSchema" }
);

export const BurndownDataPointSchema = Type.Object(
  {
    date: Type.String(),
    remaining: Type.Number(),
    completed: Type.Number(),
  },
  { $id: "BurndownDataPointSchema" }
);

export const IdealLineDataPointSchema = Type.Object(
  {
    date: Type.String(),
    ideal: Type.Number(),
  },
  { $id: "IdealLineDataPointSchema" }
);

export const SprintInfoSchema = Type.Object(
  {
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
  },
  { $id: "SprintInfoSchema" }
);

export const SprintBurndownResponseSchema = Type.Object(
  {
    sprint: Type.Ref("SprintInfoSchema"),
    totalCards: Type.Number(),
    burndownData: Type.Array(Type.Ref("BurndownDataPointSchema")),
    idealLine: Type.Array(Type.Ref("IdealLineDataPointSchema")),
  },
  { $id: "SprintBurndownResponseSchema" }
);

export const VelocityMetricSchema = Type.Object(
  {
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
  },
  { $id: "VelocityMetricSchema" }
);

export const VelocityResponseSchema = Type.Array(
  Type.Ref("VelocityMetricSchema"),
  {
    $id: "VelocityResponseSchema",
  }
);

// Due Date Analytics Schemas
export const DueDateCardSchema = Type.Object(
  {
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
  },
  { $id: "DueDateCardSchema" }
);

export const DueDateSummarySchema = Type.Object(
  {
    overdue: Type.Number(),
    dueToday: Type.Number(),
    dueThisWeek: Type.Number(),
    upcoming: Type.Number(),
    noDueDate: Type.Number(),
  },
  { $id: "DueDateSummarySchema" }
);

export const DueDateByPrioritySchema = Type.Object(
  {
    critical: Type.Number(),
    high: Type.Number(),
    medium: Type.Number(),
    low: Type.Number(),
  },
  { $id: "DueDateByPrioritySchema" }
);

export const DueDateAnalyticsResponseSchema = Type.Object(
  {
    summary: Type.Ref("DueDateSummarySchema"),
    byPriority: Type.Ref("DueDateByPrioritySchema"),
    overdueCards: Type.Array(Type.Ref("DueDateCardSchema")),
    dueTodayCards: Type.Array(Type.Ref("DueDateCardSchema")),
  },
  { $id: "DueDateAnalyticsResponseSchema" }
);

// Type exports
export type PersonalDashboardQuery = Static<
  typeof PersonalDashboardQuerySchema
>;
export type BoardAnalyticsParams = Static<typeof BoardAnalyticsParamsSchema>;
export type SprintBurndownParams = Static<typeof SprintBurndownParamsSchema>;
export type PersonalDashboardResponse = Static<
  typeof PersonalDashboardResponseSchema
>;
export type BoardAnalyticsResponse = Static<
  typeof BoardAnalyticsResponseSchema
>;
export type SprintBurndownResponse = Static<
  typeof SprintBurndownResponseSchema
>;
export type VelocityResponse = Static<typeof VelocityResponseSchema>;
export type DueDateAnalyticsResponse = Static<
  typeof DueDateAnalyticsResponseSchema
>;

// Schema collection for registration
// Only register top-level schemas used directly in routes.
// Nested schemas will be automatically registered by Fastify when processing parent schemas
// that reference them via their $id. We register nested schemas first so they're available
// when parent schemas are processed.
export const AnalyticsSchemaNested = {
  PersonalStatsSchema,
  CardsByStatusSchema,
  CardsByPrioritySchema,
  BoardStatsSchema,
  ActivityTimelineItemSchema,
  TimeTrackingUserSchema,
  TimeTrackingSummarySchema,
  BurndownDataPointSchema,
  IdealLineDataPointSchema,
  SprintInfoSchema,
  VelocityMetricSchema,
  DueDateCardSchema,
  DueDateSummarySchema,
  DueDateByPrioritySchema,
};

export const AnalyticsSchema = {
  PersonalDashboardQuerySchema,
  BoardAnalyticsParamsSchema,
  SprintBurndownParamsSchema,
  PersonalDashboardResponseSchema,
  BoardAnalyticsResponseSchema,
  SprintBurndownResponseSchema,
  VelocityResponseSchema,
  DueDateAnalyticsResponseSchema,
  AssignedTaskSchema, // Used directly in routes
};
