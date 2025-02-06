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

export class CardSchema {
  static CreateCardSchema = Type.Object(
    {
      list_id,
      title,
      description,
      status,
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

  //RESPONSE SCHEMA
  static FullCardResponseSchema = Type.Object(
    {
      id,
      list_id,
      title,
      description,
      status,
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
}

export type CreateCard = Static<typeof CardSchema.CreateCardSchema>;
export type UpdateCardTitle = Static<typeof CardSchema.UpdateCardTitleSchema>;
export type UpdateCardOrder = Static<typeof CardSchema.UpdateCardOrderSchema>;
export type UpdateCardOrderArray = Static<
  typeof CardSchema.UpdateCardOrderSchemaArray
>;
export type DeleteCard = Static<typeof CardSchema.DeleteCardSchema>;

export type FullCardResponse = Static<typeof CardSchema.FullCardResponseSchema>;
export type FullCardResponseArray = Static<
  typeof CardSchema.FullCardResponseSchemaArray
>;
