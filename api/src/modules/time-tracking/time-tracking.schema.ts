import { Type, Static } from "@sinclair/typebox";

// Request schemas
export const CreateTimeLogSchema = Type.Object({
  cardId: Type.String({ format: "uuid" }),
  durationMinutes: Type.Number({ minimum: 1 }),
  description: Type.Optional(Type.String()),
  loggedAt: Type.Optional(Type.String({ format: "date-time" })),
});

export const UpdateTimeLogSchema = Type.Object({
  durationMinutes: Type.Optional(Type.Number({ minimum: 1 })),
  description: Type.Optional(Type.String()),
});

export const TimeLogParamsSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
});

export const CardTimeLogsParamsSchema = Type.Object({
  cardId: Type.String({ format: "uuid" }),
});

export const UserTimeLogsQuerySchema = Type.Object({
  organizationId: Type.Optional(Type.String({ format: "uuid" })),
});

export const TimeRangeQuerySchema = Type.Object({
  startDate: Type.String({ format: "date-time" }),
  endDate: Type.String({ format: "date-time" }),
  organizationId: Type.Optional(Type.String({ format: "uuid" })),
});

// Response schemas
export const TimeLogSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  card_id: Type.String({ format: "uuid" }),
  user_id: Type.String({ format: "uuid" }),
  duration_minutes: Type.Number(),
  description: Type.Union([Type.String(), Type.Null()]),
  logged_at: Type.String(),
  created_at: Type.String(),
});

export const TimeLogWithDetailsSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  card_id: Type.String({ format: "uuid" }),
  user_id: Type.String({ format: "uuid" }),
  duration_minutes: Type.Number(),
  description: Type.Union([Type.String(), Type.Null()]),
  logged_at: Type.String(),
  created_at: Type.String(),
  card_title: Type.Union([Type.String(), Type.Null()]),
  user_email: Type.Union([Type.String(), Type.Null()]),
  board_title: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  board_id: Type.Optional(Type.Union([Type.String(), Type.Null()])),
});

export const CardTimeTotalSchema = Type.Object({
  totalMinutes: Type.Number(),
  totalHours: Type.Number(),
  logCount: Type.Number(),
});

// Type exports
export type CreateTimeLog = Static<typeof CreateTimeLogSchema>;
export type UpdateTimeLog = Static<typeof UpdateTimeLogSchema>;
export type TimeLogParams = Static<typeof TimeLogParamsSchema>;
export type CardTimeLogsParams = Static<typeof CardTimeLogsParamsSchema>;
export type UserTimeLogsQuery = Static<typeof UserTimeLogsQuerySchema>;
export type TimeRangeQuery = Static<typeof TimeRangeQuerySchema>;
export type TimeLog = Static<typeof TimeLogSchema>;
export type TimeLogWithDetails = Static<typeof TimeLogWithDetailsSchema>;
export type CardTimeTotal = Static<typeof CardTimeTotalSchema>;

// Schema collection for registration
export const TimeTrackingSchemas = {
  CreateTimeLogSchema,
  UpdateTimeLogSchema,
  TimeLogParamsSchema,
  CardTimeLogsParamsSchema,
  UserTimeLogsQuerySchema,
  TimeRangeQuerySchema,
  TimeLogSchema,
  TimeLogWithDetailsSchema,
  CardTimeTotalSchema,
};
