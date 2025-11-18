import { Type, Static } from "@sinclair/typebox";

const id = Type.String({ format: "uuid" });
const card_id = Type.String({ format: "uuid" });
const user_id = Type.String({ format: "uuid" });
const parent_comment_id = Type.String({ format: "uuid" });
const created_at = Type.String({ format: "date-time" });
const updated_at = Type.String({ format: "date-time" });

const content = Type.String({ minLength: 1, maxLength: 5000 });
const is_edited = Type.Boolean();

export class CommentSchema {
  // Comment CRUD schemas
  static CreateCommentSchema = Type.Object(
    {
      card_id,
      content,
      parent_comment_id: Type.Optional(parent_comment_id),
    },
    { $id: "CreateCommentSchema" },
  );

  static UpdateCommentSchema = Type.Object(
    {
      id,
      card_id,
      content,
    },
    { $id: "UpdateCommentSchema" },
  );

  static DeleteCommentSchema = Type.Object(
    {
      id,
      card_id,
    },
    { $id: "DeleteCommentSchema" },
  );

  static CommentResponseSchema = Type.Object(
    {
      id,
      card_id,
      user_id,
      content,
      parent_comment_id: Type.Optional(parent_comment_id),
      is_edited,
      created_at,
      updated_at,
    },
    { $id: "CommentResponseSchema" },
  );

  static CommentResponseSchemaArray = Type.Array(
    CommentSchema.CommentResponseSchema,
    {
      $id: "CommentResponseSchemaArray",
    },
  );

  static CommentWithUserDetailsSchema = Type.Object(
    {
      id,
      card_id,
      user_id,
      content,
      parent_comment_id: Type.Optional(parent_comment_id),
      is_edited,
      created_at,
      updated_at,
      user: Type.Object({
        id: Type.String({ format: "uuid" }),
        email: Type.String(),
        username: Type.Optional(Type.String()),
      }),
    },
    { $id: "CommentWithUserDetailsSchema" },
  );

  static CommentWithUserDetailsSchemaArray = Type.Array(
    CommentSchema.CommentWithUserDetailsSchema,
    {
      $id: "CommentWithUserDetailsSchemaArray",
    },
  );

  static CommentWithRepliesSchema = Type.Object(
    {
      id,
      card_id,
      user_id,
      content,
      parent_comment_id: Type.Optional(parent_comment_id),
      is_edited,
      created_at,
      updated_at,
      user: Type.Object({
        id: Type.String({ format: "uuid" }),
        email: Type.String(),
        username: Type.Optional(Type.String()),
      }),
      replies: Type.Array(CommentSchema.CommentWithUserDetailsSchema),
    },
    { $id: "CommentWithRepliesSchema" },
  );

  static CommentWithRepliesSchemaArray = Type.Array(
    CommentSchema.CommentWithRepliesSchema,
    {
      $id: "CommentWithRepliesSchemaArray",
    },
  );
}

export type CreateComment = Static<typeof CommentSchema.CreateCommentSchema>;
export type UpdateComment = Static<typeof CommentSchema.UpdateCommentSchema>;
export type DeleteComment = Static<typeof CommentSchema.DeleteCommentSchema>;
export type CommentResponse = Static<
  typeof CommentSchema.CommentResponseSchema
>;
export type CommentResponseArray = Static<
  typeof CommentSchema.CommentResponseSchemaArray
>;
export type CommentWithUserDetails = Static<
  typeof CommentSchema.CommentWithUserDetailsSchema
>;
export type CommentWithUserDetailsArray = Static<
  typeof CommentSchema.CommentWithUserDetailsSchemaArray
>;
export type CommentWithReplies = Static<
  typeof CommentSchema.CommentWithRepliesSchema
>;
export type CommentWithRepliesArray = Static<
  typeof CommentSchema.CommentWithRepliesSchemaArray
>;
