import { Type, Static } from "@sinclair/typebox";

const id = Type.String({ format: "uuid" });
const card_id = Type.String({ format: "uuid" });
const user_id = Type.String({ format: "uuid" });
const created_at = Type.String({ format: "date-time" });
const updated_at = Type.String({ format: "date-time" });
const completed_at = Type.String({ format: "date-time" });

const title = Type.String({ minLength: 1, maxLength: 255 });
const completed = Type.Boolean();
const order = Type.Number();

export class ChecklistSchema {
  // Checklist item CRUD schemas
  static CreateChecklistItemSchema = Type.Object(
    {
      card_id,
      title,
      order: Type.Optional(order),
    },
    { $id: "CreateChecklistItemSchema" },
  );

  static UpdateChecklistItemSchema = Type.Object(
    {
      id,
      card_id,
      title: Type.Optional(title),
      completed: Type.Optional(completed),
      order: Type.Optional(order),
    },
    { $id: "UpdateChecklistItemSchema" },
  );

  static ToggleChecklistItemSchema = Type.Object(
    {
      id,
      card_id,
    },
    { $id: "ToggleChecklistItemSchema" },
  );

  static DeleteChecklistItemSchema = Type.Object(
    {
      id,
      card_id,
    },
    { $id: "DeleteChecklistItemSchema" },
  );

  static ChecklistItemResponseSchema = Type.Object(
    {
      id,
      card_id,
      title,
      completed,
      order,
      completed_by: Type.Optional(user_id),
      completed_at: Type.Optional(completed_at),
      created_at,
      updated_at,
    },
    { $id: "ChecklistItemResponseSchema" },
  );

  static ChecklistItemResponseSchemaArray = Type.Array(
    ChecklistSchema.ChecklistItemResponseSchema,
    {
      $id: "ChecklistItemResponseSchemaArray",
    },
  );

  static ChecklistProgressSchema = Type.Object(
    {
      total: Type.Number(),
      completed: Type.Number(),
      percentage: Type.Number(),
    },
    { $id: "ChecklistProgressSchema" },
  );

  static ChecklistWithProgressSchema = Type.Object(
    {
      items: ChecklistSchema.ChecklistItemResponseSchemaArray,
      progress: ChecklistSchema.ChecklistProgressSchema,
    },
    { $id: "ChecklistWithProgressSchema" },
  );
}

export type CreateChecklistItem = Static<
  typeof ChecklistSchema.CreateChecklistItemSchema
>;
export type UpdateChecklistItem = Static<
  typeof ChecklistSchema.UpdateChecklistItemSchema
>;
export type ToggleChecklistItem = Static<
  typeof ChecklistSchema.ToggleChecklistItemSchema
>;
export type DeleteChecklistItem = Static<
  typeof ChecklistSchema.DeleteChecklistItemSchema
>;
export type ChecklistItemResponse = Static<
  typeof ChecklistSchema.ChecklistItemResponseSchema
>;
export type ChecklistItemResponseArray = Static<
  typeof ChecklistSchema.ChecklistItemResponseSchemaArray
>;
export type ChecklistProgress = Static<
  typeof ChecklistSchema.ChecklistProgressSchema
>;
export type ChecklistWithProgress = Static<
  typeof ChecklistSchema.ChecklistWithProgressSchema
>;
