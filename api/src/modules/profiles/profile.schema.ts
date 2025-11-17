import { Type, Static } from "@sinclair/typebox";

const id = Type.String({ format: "uuid" });
const user_id = Type.String({ format: "uuid" });
const created_at = Type.String({ format: "date-time" });
const updated_at = Type.String({ format: "date-time" });

const username = Type.String({ minLength: 3, maxLength: 50 });
const email = Type.String({ format: "email" });
const description = Type.Optional(Type.String({ maxLength: 500 }));
const date_of_birth = Type.Optional(Type.String({ format: "date" }));
const avatar_url = Type.Optional(Type.String({ format: "uri" }));

export class ProfileSchema {
  static GetProfileSchema = Type.Object(
    {
      user_id,
    },
    { $id: "GetProfileSchema" },
  );

  static UpdateProfileSchema = Type.Object(
    {
      username: Type.Optional(username),
      email: Type.Optional(email),
      description,
      date_of_birth,
      avatar_url,
    },
    { $id: "UpdateProfileSchema" },
  );

  static CreateProfileSchema = Type.Object(
    {
      user_id,
      username,
      email,
      description,
      date_of_birth,
      avatar_url,
    },
    { $id: "CreateProfileSchema" },
  );

  // RESPONSE SCHEMA
  static ProfileResponseSchema = Type.Object(
    {
      id,
      user_id,
      username,
      email,
      description,
      date_of_birth,
      avatar_url,
      created_at,
      updated_at,
    },
    { $id: "ProfileResponseSchema" },
  );
}

export type GetProfile = Static<typeof ProfileSchema.GetProfileSchema>;
export type UpdateProfile = Static<typeof ProfileSchema.UpdateProfileSchema>;
export type CreateProfile = Static<typeof ProfileSchema.CreateProfileSchema>;
export type ProfileResponse = Static<typeof ProfileSchema.ProfileResponseSchema>;
