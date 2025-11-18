import { FastifyOAuth2Options } from "@fastify/oauth2";
import fastifyOauth2 from "@fastify/oauth2";
import { config } from "../../configs/envConfig";
import { Type, Static } from "@sinclair/typebox";

export const oauth2Options: FastifyOAuth2Options = {
  name: "githubOAuth2",
  credentials: {
    client: {
      id: config.api.githubClientId,
      secret: config.api.githubClientSecret,
    },
    auth: fastifyOauth2.GITHUB_CONFIGURATION,
  },
  startRedirectPath: "/github",
  callbackUri: "http://localhost:4000/api/v1/oauth/github/callback",
};

const login = Type.String();
const github_id = Type.Integer();
const user_id = Type.String({ format: "uuid" });

const avatar_url = Type.String();
const email = Type.String();
const bio = Type.String();

const created_at = Type.String({ format: "date-time" });
const updated_at = Type.String({ format: "date-time" });

export const OAuthResponseSchema = Type.Object(
  {
    login,
    id: github_id,
    avatar_url,
    email,
    bio,
  },
  { $id: "OAuthResponseSchema" }
);

export const UserResponseSchema = Type.Object(
  {
    id: user_id,
    oauth_provider: Type.String(),
    oauth_provider_id: github_id,
    created_at,
    updated_at,
  },
  { $id: "UserResponseSchema" }
);

export const ProfileResponseSchema = Type.Object({
  id: user_id,
  user_id,
  username: login,
  email,
  description: bio,
  date_of_birth: Type.String({ format: "date" }),
  avatar_url,
  created_at,
  updated_at,
});

export type OAuthResponse = Static<typeof OAuthResponseSchema>;
export type UserResponse = Static<typeof UserResponseSchema>;
export type ProfileResponse = Static<typeof ProfileResponseSchema>;
