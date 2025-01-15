import { Type, Static } from "@sinclair/typebox"

const id = Type.String({ format: "uuid" })
const organization_id = Type.String({ format: "uuid" })
const created_at = Type.String({ format: "date-time" })
const updated_at = Type.String({ format: "date-time" })

const title = Type.String({ minLength: 3, maxLength: 50 })
const description = Type.Optional(Type.String({ maxLength: 100 }))

const BaseBoardSchema = Type.Object(
  {
    title,
    description,
  },
  { $id: "BaseBoardSchema" }
)

const CreateBoardSchema = Type.Object(
  {
    organization_id,
    title,
    description,
  },
  { $id: "CreateBoardSchema" }
)

const UpdateBoardSchema = Type.Partial(BaseBoardSchema, {
  $id: "UpdateBoardSchema",
})

const DeleteBoardSchema = Type.Object(
  {
    id,
  },
  { $id: "DeleteBoardSchema" }
)

//RESPONSE SCHEMA

const BoardResponseSchema = Type.Intersect(
  [
    BaseBoardSchema,
    Type.Object({
      id,
      organization_id,
      created_at,
      updated_at,
    }),
  ],
  { $id: "BoardResponseSchema" }
)

export type BaseBoard = Static<typeof BaseBoardSchema>
export type CreateBoard = Static<typeof CreateBoardSchema>
export type DeleteBoard = Static<typeof DeleteBoardSchema>
export type UpdateBoard = Static<typeof UpdateBoardSchema>
export type BoardResponse = Static<typeof BoardResponseSchema>

export const BoardSchema = {
  BaseBoardSchema,
  CreateBoardSchema,
  UpdateBoardSchema,
  DeleteBoardSchema,
  BoardResponseSchema,
}
