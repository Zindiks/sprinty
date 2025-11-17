import { Type, Static } from "@sinclair/typebox";

// Request schemas
export const CreateSprintSchema = Type.Object(
  {
    boardId: Type.String({ format: "uuid" }),
    name: Type.String({ minLength: 1 }),
    goal: Type.Optional(Type.String()),
    startDate: Type.String({ format: "date-time" }),
    endDate: Type.String({ format: "date-time" }),
    status: Type.Optional(
      Type.Union([
        Type.Literal("planned"),
        Type.Literal("active"),
        Type.Literal("completed"),
        Type.Literal("cancelled"),
      ])
    ),
  },
  { $id: "CreateSprintSchema" }
);

export const UpdateSprintSchema = Type.Object(
  {
    name: Type.Optional(Type.String({ minLength: 1 })),
    goal: Type.Optional(Type.String()),
    startDate: Type.Optional(Type.String({ format: "date-time" })),
    endDate: Type.Optional(Type.String({ format: "date-time" })),
    status: Type.Optional(
      Type.Union([
        Type.Literal("planned"),
        Type.Literal("active"),
        Type.Literal("completed"),
        Type.Literal("cancelled"),
      ])
    ),
  },
  { $id: "UpdateSprintSchema" }
);

export const AddCardsToSprintSchema = Type.Object(
  {
    cardIds: Type.Array(Type.String({ format: "uuid" })),
  },
  { $id: "AddCardsToSprintSchema" }
);

export const RemoveCardsFromSprintSchema = Type.Object(
  {
    cardIds: Type.Array(Type.String({ format: "uuid" })),
  },
  { $id: "RemoveCardsFromSprintSchema" }
);

export const SprintParamsSchema = Type.Object(
  {
    id: Type.String({ format: "uuid" }),
  },
  { $id: "SprintParamsSchema" }
);

export const BoardSprintsParamsSchema = Type.Object(
  {
    boardId: Type.String({ format: "uuid" }),
  },
  { $id: "BoardSprintsParamsSchema" }
);

// Response schemas
export const SprintSchema = Type.Object(
  {
    id: Type.String({ format: "uuid" }),
    board_id: Type.String({ format: "uuid" }),
    name: Type.String(),
    goal: Type.Union([Type.String(), Type.Null()]),
    start_date: Type.String(),
    end_date: Type.String(),
    status: Type.Union([
      Type.Literal("planned"),
      Type.Literal("active"),
      Type.Literal("completed"),
      Type.Literal("cancelled"),
    ]),
    created_at: Type.String(),
    updated_at: Type.String(),
  },
  { $id: "SprintSchema" }
);

export const SprintWithStatsSchema = Type.Object(
  {
    id: Type.String({ format: "uuid" }),
    board_id: Type.String({ format: "uuid" }),
    name: Type.String(),
    goal: Type.Union([Type.String(), Type.Null()]),
    start_date: Type.String(),
    end_date: Type.String(),
    status: Type.Union([
      Type.Literal("planned"),
      Type.Literal("active"),
      Type.Literal("completed"),
      Type.Literal("cancelled"),
    ]),
    created_at: Type.String(),
    updated_at: Type.String(),
    totalCards: Type.Number(),
    completedCards: Type.Number(),
  },
  { $id: "SprintWithStatsSchema" }
);

export const SprintCardSchema = Type.Object(
  {
    id: Type.String({ format: "uuid" }),
    list_id: Type.String({ format: "uuid" }),
    title: Type.String(),
    description: Type.Union([Type.String(), Type.Null()]),
    order: Type.Number(),
    status: Type.Union([Type.String(), Type.Null()]),
    due_date: Type.Union([Type.String(), Type.Null()]),
    priority: Type.Union([
      Type.Literal("low"),
      Type.Literal("medium"),
      Type.Literal("high"),
      Type.Literal("critical"),
    ]),
    sprint_id: Type.Union([Type.String(), Type.Null()]),
    created_at: Type.String(),
    updated_at: Type.String(),
    list_title: Type.String(),
  },
  { $id: "SprintCardSchema" }
);

// Type exports
export type CreateSprint = Static<typeof CreateSprintSchema>;
export type UpdateSprint = Static<typeof UpdateSprintSchema>;
export type AddCardsToSprint = Static<typeof AddCardsToSprintSchema>;
export type RemoveCardsFromSprint = Static<typeof RemoveCardsFromSprintSchema>;
export type SprintParams = Static<typeof SprintParamsSchema>;
export type BoardSprintsParams = Static<typeof BoardSprintsParamsSchema>;
export type Sprint = Static<typeof SprintSchema>;
export type SprintWithStats = Static<typeof SprintWithStatsSchema>;
export type SprintCard = Static<typeof SprintCardSchema>;

// Schema collection for registration
export const SprintSchemas = {
  CreateSprintSchema,
  UpdateSprintSchema,
  AddCardsToSprintSchema,
  RemoveCardsFromSprintSchema,
  SprintParamsSchema,
  BoardSprintsParamsSchema,
  SprintSchema,
  SprintWithStatsSchema,
  SprintCardSchema,
};
