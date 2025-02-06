import { Type, Static } from "@sinclair/typebox";

const id = Type.String({ format: "uuid" });
const created_at = Type.String({ format: "date-time" });
const updated_at = Type.String({ format: "date-time" });

const name = Type.String({ minLength: 3, maxLength: 50 });
const description = Type.Optional(Type.String({ maxLength: 100 }));

export class OrganizationSchema {
  static BaseOrganizationSchema = Type.Object(
    {
      name,
      description,
    },
    { $id: "BaseOrganizationSchema" },
  );

  static UpdateOrganizationSchema = Type.Partial(
    OrganizationSchema.BaseOrganizationSchema,
    {
      $id: "UpdateOrganizationSchema",
    },
  );

  static DeleteOrganizationSchema = Type.Object(
    {
      id,
    },
    { $id: "DeleteOrganizationSchema" },
  );

  //RESPONSE SCHEMA
  static OrganizationResponseSchema = Type.Intersect(
    [
      OrganizationSchema.BaseOrganizationSchema,
      Type.Object({
        id,
        created_at,
        updated_at,
      }),
    ],
    { $id: "OrganizationResponseSchema" },
  );
}

export type BaseOrganization = Static<
  typeof OrganizationSchema.BaseOrganizationSchema
>;
export type CreateOrganization = Static<
  typeof OrganizationSchema.BaseOrganizationSchema
>;
export type UpdateOrganization = Static<
  typeof OrganizationSchema.UpdateOrganizationSchema
>;
export type DeleteOrganization = Static<
  typeof OrganizationSchema.DeleteOrganizationSchema
>;

export type OrganizationResponse = Static<
  typeof OrganizationSchema.OrganizationResponseSchema
>;
