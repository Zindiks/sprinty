import { Type, Static } from "@sinclair/typebox"

const id = Type.String({ format: "uuid" })
const created_at = Type.String({ format: "date-time" })
const updated_at = Type.String({ format: "date-time" })

const name = Type.String({ minLength: 3, maxLength: 50 })
const description = Type.Optional(Type.String({ maxLength: 100 }))

const BaseOrganizationSchema = Type.Object(
  {
    name,
    description,
  },
  { $id: "BaseOrganizationSchema" }
)

const UpdateOrganizationSchema = Type.Partial(BaseOrganizationSchema, {
  $id: "UpdateOrganizationSchema",
})

const DeleteOrganizationSchema = Type.Object(
  {
    id,
  },
  { $id: "DeleteOrganizationSchema" }
)

//RESPONSE SCHEMA
const OrganizationResponseSchema = Type.Intersect(
  [
    BaseOrganizationSchema,
    Type.Object({
      id,
      created_at,
      updated_at,
    }),
  ],
  { $id: "OrganizationResponseSchema" }
)

export type BaseOrganization = Static<typeof BaseOrganizationSchema>
export type CreateOrganization = Static<typeof BaseOrganizationSchema>
export type UpdateOrganization = Static<typeof UpdateOrganizationSchema>
export type DeleteOrganization = Static<typeof DeleteOrganizationSchema>

export type OrganizationResponse = Static<typeof OrganizationResponseSchema>

export const OrganizationSchema = {
  BaseOrganizationSchema,
  UpdateOrganizationSchema,
  DeleteOrganizationSchema,
  OrganizationResponseSchema,
}
