import { Type, Static } from "@sinclair/typebox";

const id = Type.String({ format: "uuid" });
const list_id = Type.String({ format: "uuid" });
const created_at = Type.String({ format: "date-time" });
const updated_at = Type.String({ format: "date-time" });

const title = Type.String({ minLength: 3, maxLength: 100 });
const order = Type.Number();
const description = Type.Optional(
  Type.String({ minLength: 3, maxLength: 255 }),
);
const status = Type.Optional(Type.String());
const due_date = Type.Optional(Type.String({ format: "date-time" }));
const priority = Type.Optional(
  Type.Union([
    Type.Literal("low"),
    Type.Literal("medium"),
    Type.Literal("high"),
    Type.Literal("critical"),
  ]),
);

export class CardSchema {
  static CreateCardSchema = Type.Object(
    {
      list_id,
      title,
      description,
      status,
      due_date,
      priority,
    },
    { $id: "CreateCardSchema" },
  );

  static UpdateCardTitleSchema = Type.Object(
    {
      id,
      list_id,
      title,
    },
    { $id: "UpdateCardTitleSchema" },
  );
  static UpdateCardOrderSchema = Type.Object(
    {
      id,
      list_id,
      order,
    },
    { $id: "UpdateCardOrderSchema" },
  );

  static UpdateCardOrderSchemaArray = Type.Array(
    CardSchema.UpdateCardOrderSchema,
    {
      $id: "UpdateCardOrderSchemaArray",
    },
  );

  static DeleteCardSchema = Type.Object(
    {
      id,
      list_id,
    },
    { $id: "DeleteCardSchema" },
  );

  static UpdateCardDetailsSchema = Type.Object(
    {
      id,
      list_id,
      title: Type.Optional(title),
      description: Type.Optional(
        Type.Union([
          Type.String({ minLength: 3, maxLength: 255 }),
          Type.Null(),
        ]),
      ),
      status: Type.Optional(Type.String()),
      due_date: Type.Optional(
        Type.Union([Type.String({ format: "date-time" }), Type.Null()]),
      ),
      priority: Type.Optional(
        Type.Union([
          Type.Literal("low"),
          Type.Literal("medium"),
          Type.Literal("high"),
          Type.Literal("critical"),
        ]),
      ),
    },
    { $id: "UpdateCardDetailsSchema" },
  );

  static UpdateCardDetailsByIdSchema = Type.Object(
    {
      list_id,
      title: Type.Optional(title),
      description: Type.Optional(
        Type.Union([
          Type.String({ minLength: 3, maxLength: 255 }),
          Type.Null(),
        ]),
      ),
      status: Type.Optional(Type.String()),
      due_date: Type.Optional(
        Type.Union([Type.String({ format: "date-time" }), Type.Null()]),
      ),
      priority: Type.Optional(
        Type.Union([
          Type.Literal("low"),
          Type.Literal("medium"),
          Type.Literal("high"),
          Type.Literal("critical"),
        ]),
      ),
    },
    { $id: "UpdateCardDetailsByIdSchema" },
  );

  //RESPONSE SCHEMA
  static FullCardResponseSchema = Type.Object(
    {
      id,
      list_id,
      title,
      description,
      status,
      due_date,
      priority,
      order,
      created_at,
      updated_at,
    },
    { $id: "CardResponseSchema" },
  );

  static FullCardResponseSchemaArray = Type.Array(
    CardSchema.FullCardResponseSchema,
    {
      $id: "FullCardResponseSchemaArray",
    },
  );

  static CardWithAssigneesResponseSchema = Type.Object(
    {
      id,
      list_id,
      title,
      description,
      status,
      due_date,
      priority,
      order,
      created_at,
      updated_at,
      assignees: Type.Array(
        Type.Object({
          id: Type.String({ format: "uuid" }),
          card_id: Type.String({ format: "uuid" }),
          user_id: Type.String({ format: "uuid" }),
          assigned_at: Type.String({ format: "date-time" }),
          assigned_by: Type.Optional(Type.String({ format: "uuid" })),
          user: Type.Object({
            id: Type.String({ format: "uuid" }),
            email: Type.String(),
            username: Type.Optional(Type.String()),
          }),
        }),
      ),
    },
    { $id: "CardWithAssigneesResponseSchema" },
  );

  static CardWithDetailsResponseSchema = Type.Object(
    {
      id,
      list_id,
      title,
      description,
      status,
      due_date,
      priority,
      order,
      created_at,
      updated_at,
      assignees: Type.Array(
        Type.Object({
          id: Type.String({ format: "uuid" }),
          card_id: Type.String({ format: "uuid" }),
          user_id: Type.String({ format: "uuid" }),
          assigned_at: Type.String({ format: "date-time" }),
          assigned_by: Type.Optional(Type.String({ format: "uuid" })),
          user: Type.Object({
            id: Type.String({ format: "uuid" }),
            email: Type.String(),
            username: Type.Optional(Type.String()),
          }),
        }),
      ),
      labels: Type.Array(
        Type.Object({
          id: Type.String({ format: "uuid" }),
          board_id: Type.String({ format: "uuid" }),
          name: Type.String(),
          color: Type.String(),
          created_at: Type.String({ format: "date-time" }),
          updated_at: Type.String({ format: "date-time" }),
        }),
      ),
      checklist_items: Type.Array(
        Type.Object({
          id: Type.String({ format: "uuid" }),
          card_id: Type.String({ format: "uuid" }),
          title: Type.String(),
          completed: Type.Boolean(),
          order: Type.Number(),
          completed_by: Type.Optional(Type.String({ format: "uuid" })),
          completed_at: Type.Optional(Type.String({ format: "date-time" })),
          created_at: Type.String({ format: "date-time" }),
          updated_at: Type.String({ format: "date-time" }),
        }),
      ),
      checklist_progress: Type.Object({
        total: Type.Number(),
        completed: Type.Number(),
        percentage: Type.Number(),
      }),
      comments: Type.Array(
        Type.Object({
          id: Type.String({ format: "uuid" }),
          card_id: Type.String({ format: "uuid" }),
          user_id: Type.String({ format: "uuid" }),
          content: Type.String(),
          parent_comment_id: Type.Optional(Type.String({ format: "uuid" })),
          is_edited: Type.Boolean(),
          created_at: Type.String({ format: "date-time" }),
          updated_at: Type.String({ format: "date-time" }),
          user: Type.Object({
            id: Type.String({ format: "uuid" }),
            email: Type.String(),
            username: Type.Optional(Type.String()),
          }),
        }),
      ),
      attachments: Type.Array(
        Type.Object({
          id: Type.String({ format: "uuid" }),
          card_id: Type.String({ format: "uuid" }),
          filename: Type.String(),
          original_filename: Type.String(),
          mime_type: Type.String(),
          file_size: Type.Number(),
          uploaded_by: Type.String({ format: "uuid" }),
          uploaded_at: Type.String({ format: "date-time" }),
          user: Type.Object({
            id: Type.String({ format: "uuid" }),
            email: Type.String(),
            username: Type.Optional(Type.String()),
          }),
        }),
      ),
      activities: Type.Array(
        Type.Object({
          id: Type.String({ format: "uuid" }),
          card_id: Type.String({ format: "uuid" }),
          user_id: Type.String({ format: "uuid" }),
          action_type: Type.String(),
          metadata: Type.Any(),
          created_at: Type.String({ format: "date-time" }),
          user: Type.Object({
            id: Type.String({ format: "uuid" }),
            email: Type.String(),
            username: Type.Optional(Type.String()),
          }),
        }),
      ),
    },
    { $id: "CardWithDetailsResponseSchema" },
  );
}

export type CreateCard = Static<typeof CardSchema.CreateCardSchema>;
export type UpdateCardTitle = Static<typeof CardSchema.UpdateCardTitleSchema>;
export type UpdateCardDetails = Static<
  typeof CardSchema.UpdateCardDetailsSchema
>;
export type UpdateCardDetailsById = Static<
  typeof CardSchema.UpdateCardDetailsByIdSchema
>;
export type UpdateCardOrder = Static<typeof CardSchema.UpdateCardOrderSchema>;
export type UpdateCardOrderArray = Static<
  typeof CardSchema.UpdateCardOrderSchemaArray
>;
export type DeleteCard = Static<typeof CardSchema.DeleteCardSchema>;

export type FullCardResponse = Static<typeof CardSchema.FullCardResponseSchema>;
export type FullCardResponseArray = Static<
  typeof CardSchema.FullCardResponseSchemaArray
>;
export type CardWithAssigneesResponse = Static<
  typeof CardSchema.CardWithAssigneesResponseSchema
>;
export type CardWithDetailsResponse = Static<
  typeof CardSchema.CardWithDetailsResponseSchema
>;
