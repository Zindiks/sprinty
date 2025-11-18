import { Type, Static } from "@sinclair/typebox";

const id = Type.String({ format: "uuid" });
const board_id = Type.String({ format: "uuid" });
const created_at = Type.String({ format: "date-time" });
const updated_at = Type.String({ format: "date-time" });

const title = Type.String({ minLength: 3, maxLength: 50 });
const order = Type.Number();

export class ListSchema {
  static CreateListSchema = Type.Object(
    {
      board_id,
      title,
    },
    { $id: "CreateListSchema" }
  );

  static UpdateListTitleSchema = Type.Object(
    {
      id,
      board_id,
      title,
    },
    { $id: "UpdateListTitleSchema" }
  );

  static UpdateListOrderSchema = Type.Object(
    {
      id,
      order,
    },
    { $id: "UpdateListOrderSchema" }
  );

  static UpdateListOrderSchemaArray = Type.Array(ListSchema.UpdateListOrderSchema, {
    $id: "UpdateListsOrderSchema",
  });

  static CopyListSchema = Type.Object(
    {
      id,
      board_id,
    },
    { $id: "CopyListSchema" }
  );

  static DeleteListSchema = Type.Object(
    {
      id,
      board_id,
    },
    { $id: "DeleteListSchema" }
  );

  // RESPONSE SCHEMA

  static FullListResponseSchema = Type.Object(
    {
      id,
      board_id,
      title,
      order,
      created_at,
      updated_at,
    },
    { $id: "FullListResponseSchema" }
  );
}

export type CreateList = Static<typeof ListSchema.CreateListSchema>;
export type UpdateListTitle = Static<typeof ListSchema.UpdateListTitleSchema>;
export type UpdateListOrderArray = Static<typeof ListSchema.UpdateListOrderSchemaArray>;
export type CopyList = Static<typeof ListSchema.CopyListSchema>;
export type DeleteList = Static<typeof ListSchema.DeleteListSchema>;

export type FullListResponse = Static<typeof ListSchema.FullListResponseSchema>;
