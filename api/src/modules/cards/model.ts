import { Type, Static } from "@sinclair/typebox"

const id = Type.String({ format: "uuid" })
const list_id = Type.String({ format: "uuid" })
const title = Type.String({ minLength: 3, maxLength: 100 })
const order = Type.Number()
const description = Type.Optional(Type.String({ minLength: 3, maxLength: 255 }))
const status = Type.Optional(Type.String())

const created_at = Type.String({ format: "date-time" })
const updated_at = Type.String({ format: "date-time" })

const CreateCardSchema = Type.Object(
  {
    list_id,
    title,
    description,
    status,
  },
  { $id: "CreateCardSchema" }
)

const UpdateCardTitleSchema = Type.Object(
  {
    id,
    list_id,
    title,
  },
  { $id: "UpdateCardTitleSchema" }
)

const UpdateCardOrderSchema = Type.Object(
  {
    id,
    list_id,
    order,
  },
  { $id: "UpdateCardOrderSchema" }
)

const UpdateCardOrderSchemaArray = Type.Array(UpdateCardOrderSchema, {
  $id: "UpdateCardOrderSchemaArray",
})

const DeleteCardSchema = Type.Object(
  {
    id,
    list_id,
  },
  { $id: "DeleteCardSchema" }
)

//RESPONSE SCHEMA
const FullCardResponseSchema = Type.Object(
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
  { $id: "CardResponseSchema" }
)

const FullCardResponseSchemaArray = Type.Array(FullCardResponseSchema, {
  $id: "FullCardResponseSchemaArray",
})

export type CreateCard = Static<typeof CreateCardSchema>
export type UpdateCardTitle = Static<typeof UpdateCardTitleSchema>
export type UpdateCardOrder = Static<typeof UpdateCardOrderSchema>
export type UpdateCardOrderArray = Static<typeof UpdateCardOrderSchemaArray>
export type DeleteCard = Static<typeof DeleteCardSchema>

export type FullCardResponse = Static<typeof FullCardResponseSchema>
export type FullCardResponseArray = Static<typeof FullCardResponseSchemaArray>

export const CardSchema = {
  CreateCardSchema,
  UpdateCardTitleSchema,
  UpdateCardOrderSchema,
  UpdateCardOrderSchemaArray,
  FullCardResponseSchema,
  FullCardResponseSchemaArray,
  DeleteCardSchema,
}
