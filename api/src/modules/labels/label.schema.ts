import { Type, Static } from "@sinclair/typebox";

const id = Type.String({ format: "uuid" });
const board_id = Type.String({ format: "uuid" });
const card_id = Type.String({ format: "uuid" });
const label_id = Type.String({ format: "uuid" });
const created_at = Type.String({ format: "date-time" });
const updated_at = Type.String({ format: "date-time" });
const added_at = Type.String({ format: "date-time" });

const name = Type.String({ minLength: 1, maxLength: 50 });
const color = Type.String({ pattern: "^#[0-9A-Fa-f]{6}$" }); // Hex color

export class LabelSchema {
  // Label CRUD schemas
  static CreateLabelSchema = Type.Object(
    {
      board_id,
      name,
      color,
    },
    { $id: "CreateLabelSchema" },
  );

  static UpdateLabelSchema = Type.Object(
    {
      id,
      board_id,
      name: Type.Optional(name),
      color: Type.Optional(color),
    },
    { $id: "UpdateLabelSchema" },
  );

  static DeleteLabelSchema = Type.Object(
    {
      id,
      board_id,
    },
    { $id: "DeleteLabelSchema" },
  );

  static LabelResponseSchema = Type.Object(
    {
      id,
      board_id,
      name,
      color,
      created_at,
      updated_at,
    },
    { $id: "LabelResponseSchema" },
  );

  static LabelResponseSchemaArray = Type.Array(
    LabelSchema.LabelResponseSchema,
    {
      $id: "LabelResponseSchemaArray",
    },
  );

  // Card-Label association schemas
  static AddLabelToCardSchema = Type.Object(
    {
      card_id,
      label_id,
    },
    { $id: "AddLabelToCardSchema" },
  );

  static RemoveLabelFromCardSchema = Type.Object(
    {
      card_id,
      label_id,
    },
    { $id: "RemoveLabelFromCardSchema" },
  );

  static CardLabelResponseSchema = Type.Object(
    {
      id,
      card_id,
      label_id,
      added_at,
    },
    { $id: "CardLabelResponseSchema" },
  );

  static LabelWithCardsCountSchema = Type.Object(
    {
      id,
      board_id,
      name,
      color,
      created_at,
      updated_at,
      cards_count: Type.Number(),
    },
    { $id: "LabelWithCardsCountSchema" },
  );

  static LabelWithCardsCountSchemaArray = Type.Array(
    LabelSchema.LabelWithCardsCountSchema,
    {
      $id: "LabelWithCardsCountSchemaArray",
    },
  );
}

export type CreateLabel = Static<typeof LabelSchema.CreateLabelSchema>;
export type UpdateLabel = Static<typeof LabelSchema.UpdateLabelSchema>;
export type DeleteLabel = Static<typeof LabelSchema.DeleteLabelSchema>;
export type LabelResponse = Static<typeof LabelSchema.LabelResponseSchema>;
export type LabelResponseArray = Static<
  typeof LabelSchema.LabelResponseSchemaArray
>;

export type AddLabelToCard = Static<typeof LabelSchema.AddLabelToCardSchema>;
export type RemoveLabelFromCard = Static<
  typeof LabelSchema.RemoveLabelFromCardSchema
>;
export type CardLabelResponse = Static<
  typeof LabelSchema.CardLabelResponseSchema
>;

export type LabelWithCardsCount = Static<
  typeof LabelSchema.LabelWithCardsCountSchema
>;
export type LabelWithCardsCountArray = Static<
  typeof LabelSchema.LabelWithCardsCountSchemaArray
>;
