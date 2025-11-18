import { Type, Static } from "@sinclair/typebox";

const ActionTypeEnum = Type.Union([
  Type.Literal("created"),
  Type.Literal("updated"),
  Type.Literal("moved"),
  Type.Literal("archived"),
  Type.Literal("assignee_added"),
  Type.Literal("assignee_removed"),
  Type.Literal("label_added"),
  Type.Literal("label_removed"),
  Type.Literal("comment_added"),
  Type.Literal("attachment_added"),
  Type.Literal("checklist_item_added"),
  Type.Literal("checklist_item_completed"),
  Type.Literal("due_date_set"),
  Type.Literal("due_date_changed"),
  Type.Literal("due_date_removed"),
  Type.Literal("priority_changed"),
  Type.Literal("description_changed"),
  Type.Literal("title_changed"),
]);

export class ActivitySchema {
  static CreateActivitySchema = Type.Object(
    {
      card_id: Type.String({ format: "uuid" }),
      user_id: Type.String({ format: "uuid" }),
      action_type: ActionTypeEnum,
      metadata: Type.Optional(Type.Any()),
    },
    { $id: "CreateActivitySchema" }
  );

  static ActivityResponseSchema = Type.Object(
    {
      id: Type.String({ format: "uuid" }),
      card_id: Type.String({ format: "uuid" }),
      user_id: Type.String({ format: "uuid" }),
      action_type: ActionTypeEnum,
      metadata: Type.Any(),
      created_at: Type.String({ format: "date-time" }),
    },
    { $id: "ActivityResponseSchema" }
  );

  static ActivityWithUserResponseSchema = Type.Object(
    {
      id: Type.String({ format: "uuid" }),
      card_id: Type.String({ format: "uuid" }),
      user_id: Type.String({ format: "uuid" }),
      action_type: ActionTypeEnum,
      metadata: Type.Any(),
      created_at: Type.String({ format: "date-time" }),
      user: Type.Object({
        id: Type.String({ format: "uuid" }),
        email: Type.String(),
        username: Type.Optional(Type.String()),
      }),
    },
    { $id: "ActivityWithUserResponseSchema" }
  );

  static ActivityListResponseSchema = Type.Array(ActivitySchema.ActivityWithUserResponseSchema, {
    $id: "ActivityListResponseSchema",
  });

  static ActivityQueryParamsSchema = Type.Object(
    {
      card_id: Type.Optional(Type.String({ format: "uuid" })),
      user_id: Type.Optional(Type.String({ format: "uuid" })),
      action_type: Type.Optional(ActionTypeEnum),
      limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100 })),
      offset: Type.Optional(Type.Number({ minimum: 0 })),
    },
    { $id: "ActivityQueryParamsSchema" }
  );

  static ActivityStatsResponseSchema = Type.Object(
    {
      card_id: Type.String({ format: "uuid" }),
      total_activities: Type.Number(),
      activities_by_type: Type.Record(Type.String(), Type.Number()),
      recent_activity: Type.Optional(ActivitySchema.ActivityWithUserResponseSchema),
    },
    { $id: "ActivityStatsResponseSchema" }
  );
}

export type CreateActivity = Static<typeof ActivitySchema.CreateActivitySchema>;
export type ActivityResponse = Static<typeof ActivitySchema.ActivityResponseSchema>;
export type ActivityWithUserResponse = Static<typeof ActivitySchema.ActivityWithUserResponseSchema>;
export type ActivityListResponse = Static<typeof ActivitySchema.ActivityListResponseSchema>;
export type ActivityQueryParams = Static<typeof ActivitySchema.ActivityQueryParamsSchema>;
export type ActivityStatsResponse = Static<typeof ActivitySchema.ActivityStatsResponseSchema>;
