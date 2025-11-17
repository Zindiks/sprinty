import { Type, Static } from "@sinclair/typebox";

export class AttachmentSchema {
  static CreateAttachmentSchema = Type.Object(
    {
      card_id: Type.String({ format: "uuid" }),
      filename: Type.String({ minLength: 1, maxLength: 255 }),
      original_filename: Type.String({ minLength: 1, maxLength: 255 }),
      mime_type: Type.String({ minLength: 1, maxLength: 100 }),
      file_size: Type.Number({ minimum: 0 }),
      storage_path: Type.String({ minLength: 1, maxLength: 500 }),
      uploaded_by: Type.String({ format: "uuid" }),
    },
    { $id: "CreateAttachmentSchema" },
  );

  static UpdateAttachmentSchema = Type.Object(
    {
      id: Type.String({ format: "uuid" }),
      card_id: Type.String({ format: "uuid" }),
      filename: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
    },
    { $id: "UpdateAttachmentSchema" },
  );

  static DeleteAttachmentSchema = Type.Object(
    {
      id: Type.String({ format: "uuid" }),
      card_id: Type.String({ format: "uuid" }),
    },
    { $id: "DeleteAttachmentSchema" },
  );

  static AttachmentResponseSchema = Type.Object(
    {
      id: Type.String({ format: "uuid" }),
      card_id: Type.String({ format: "uuid" }),
      filename: Type.String(),
      original_filename: Type.String(),
      mime_type: Type.String(),
      file_size: Type.Number(),
      storage_path: Type.String(),
      uploaded_by: Type.String({ format: "uuid" }),
      uploaded_at: Type.String({ format: "date-time" }),
    },
    { $id: "AttachmentResponseSchema" },
  );

  static AttachmentWithUserResponseSchema = Type.Object(
    {
      id: Type.String({ format: "uuid" }),
      card_id: Type.String({ format: "uuid" }),
      filename: Type.String(),
      original_filename: Type.String(),
      mime_type: Type.String(),
      file_size: Type.Number(),
      storage_path: Type.String(),
      uploaded_by: Type.String({ format: "uuid" }),
      uploaded_at: Type.String({ format: "date-time" }),
      user: Type.Object({
        id: Type.String({ format: "uuid" }),
        email: Type.String(),
        username: Type.Optional(Type.String()),
      }),
    },
    { $id: "AttachmentWithUserResponseSchema" },
  );

  static AttachmentListResponseSchema = Type.Array(
    AttachmentSchema.AttachmentWithUserResponseSchema,
    { $id: "AttachmentListResponseSchema" },
  );

  static AttachmentCountResponseSchema = Type.Object(
    {
      card_id: Type.String({ format: "uuid" }),
      count: Type.Number(),
    },
    { $id: "AttachmentCountResponseSchema" },
  );
}

export type CreateAttachment = Static<
  typeof AttachmentSchema.CreateAttachmentSchema
>;
export type UpdateAttachment = Static<
  typeof AttachmentSchema.UpdateAttachmentSchema
>;
export type DeleteAttachment = Static<
  typeof AttachmentSchema.DeleteAttachmentSchema
>;
export type AttachmentResponse = Static<
  typeof AttachmentSchema.AttachmentResponseSchema
>;
export type AttachmentWithUserResponse = Static<
  typeof AttachmentSchema.AttachmentWithUserResponseSchema
>;
export type AttachmentListResponse = Static<
  typeof AttachmentSchema.AttachmentListResponseSchema
>;
export type AttachmentCountResponse = Static<
  typeof AttachmentSchema.AttachmentCountResponseSchema
>;
