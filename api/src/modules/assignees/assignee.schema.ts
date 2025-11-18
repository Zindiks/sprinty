import { Type, Static } from "@sinclair/typebox";

const id = Type.String({ format: "uuid" });
const card_id = Type.String({ format: "uuid" });
const user_id = Type.String({ format: "uuid" });
const assigned_by = Type.String({ format: "uuid" });
const assigned_at = Type.String({ format: "date-time" });

export class AssigneeSchema {
  static AddAssigneeSchema = Type.Object(
    {
      card_id,
      user_id,
    },
    { $id: "AddAssigneeSchema" }
  );

  static RemoveAssigneeSchema = Type.Object(
    {
      card_id,
      user_id,
    },
    { $id: "RemoveAssigneeSchema" }
  );

  static AssigneeResponseSchema = Type.Object(
    {
      id,
      card_id,
      user_id,
      assigned_at,
      assigned_by: Type.Optional(assigned_by),
    },
    { $id: "AssigneeResponseSchema" }
  );

  static AssigneeResponseSchemaArray = Type.Array(AssigneeSchema.AssigneeResponseSchema, {
    $id: "AssigneeResponseSchemaArray",
  });

  static AssigneeWithUserDetailsSchema = Type.Object(
    {
      id,
      card_id,
      user_id,
      assigned_at,
      assigned_by: Type.Optional(assigned_by),
      user: Type.Object({
        id: Type.String({ format: "uuid" }),
        email: Type.String(),
        username: Type.Optional(Type.String()),
      }),
    },
    { $id: "AssigneeWithUserDetailsSchema" }
  );

  static AssigneeWithUserDetailsSchemaArray = Type.Array(
    AssigneeSchema.AssigneeWithUserDetailsSchema,
    {
      $id: "AssigneeWithUserDetailsSchemaArray",
    }
  );
}

export type AddAssignee = Static<typeof AssigneeSchema.AddAssigneeSchema>;
export type RemoveAssignee = Static<typeof AssigneeSchema.RemoveAssigneeSchema>;
export type AssigneeResponse = Static<typeof AssigneeSchema.AssigneeResponseSchema>;
export type AssigneeResponseArray = Static<typeof AssigneeSchema.AssigneeResponseSchemaArray>;
export type AssigneeWithUserDetails = Static<typeof AssigneeSchema.AssigneeWithUserDetailsSchema>;
export type AssigneeWithUserDetailsArray = Static<
  typeof AssigneeSchema.AssigneeWithUserDetailsSchemaArray
>;
