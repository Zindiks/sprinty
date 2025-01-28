import { Type, Static } from "@sinclair/typebox"

const id = Type.String({ format: "uuid" })
const board_id = Type.String({ format: "uuid" })
const created_at = Type.String({ format: "date-time" })
const updated_at = Type.String({ format: "date-time" })
const title = Type.String({ minLength: 3, maxLength: 50 })
const order = Type.Number()

const CreateListSchema = Type.Object(
  {
    board_id,
    title,
  },
  { $id: "CreateListSchema" }
)

const UpdateListTitleSchema = Type.Object(
  {
    id,
    board_id,
    title,
  },
  { $id: "UpdateListTitleSchema" }
)

const UpdateListOrderSchema = Type.Object(
  {
    id,
    order,
  },
  { $id: "UpdateListOrderSchema" }
)

const UpdateListOrderSchemaArray = Type.Array(UpdateListOrderSchema, {
  $id: "UpdateListsOrderSchema",
})

const CopyListSchema = Type.Object(
  {
    id,
    board_id,
  },
  { $id: "CopyListSchema" }
)

const DeleteListSchema = Type.Object(
  {
    id,
    board_id,
  },
  { $id: "DeleteListSchema" }
)

// RESPONSE SCHEMA

const FullListResponseSchema = Type.Object(
  {
    id,
    board_id,
    title,
    order,
    created_at,
    updated_at,
  },
  { $id: "FullListResponseSchema" }
)

export type CreateList = Static<typeof CreateListSchema>
export type UpdateListTitle = Static<typeof UpdateListTitleSchema>
export type UpdateListOrderArray = Static<typeof UpdateListOrderSchemaArray>
export type CopyList = Static<typeof CopyListSchema>
export type DeleteList = Static<typeof DeleteListSchema>

export type FullListResponse = Static<typeof FullListResponseSchema>

export const ListSchema = {
  CreateListSchema,
  UpdateListTitleSchema,
  UpdateListOrderSchema,
  UpdateListOrderSchemaArray,
  DeleteListSchema,
  CopyListSchema,
  FullListResponseSchema,
}
