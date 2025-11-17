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
        Type.Union([Type.String({ minLength: 3, maxLength: 255 }), Type.Null()]),
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
}

export type CreateCard = Static<typeof CardSchema.CreateCardSchema>;
export type UpdateCardTitle = Static<typeof CardSchema.UpdateCardTitleSchema>;
export type UpdateCardDetails = Static<typeof CardSchema.UpdateCardDetailsSchema>;
export type UpdateCardOrder = Static<typeof CardSchema.UpdateCardOrderSchema>;
export type UpdateCardOrderArray = Static<
  typeof CardSchema.UpdateCardOrderSchemaArray
>;
export type DeleteCard = Static<typeof CardSchema.DeleteCardSchema>;

export type FullCardResponse = Static<typeof CardSchema.FullCardResponseSchema>;
export type FullCardResponseArray = Static<
  typeof CardSchema.FullCardResponseSchemaArray
>;
export type CardWithAssigneesResponse = Static<typeof CardSchema.CardWithAssigneesResponseSchema>;
