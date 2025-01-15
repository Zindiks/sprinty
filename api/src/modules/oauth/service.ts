import { FastifyRequest } from "fastify"
import {
  oauth2Options,
  OAuthResponse,
  ProfileResponse,
  UserResponse,
} from "./model"
import { OAuth2Namespace } from "@fastify/oauth2"
import { Knex } from "knex"

declare module "fastify" {
  interface FastifyInstance {
    githubOAuth2: OAuth2Namespace
  }
}

export async function getAccessTokenFromAuthorizationCodeFlow(
  request: FastifyRequest
) {
  return await request.server.githubOAuth2.getAccessTokenFromAuthorizationCodeFlow(
    request
  )
}

export async function fetchUserData(
  accessToken: string
): Promise<OAuthResponse | null> {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `token ${accessToken}`,
    },
  })

  if (!response.ok) {
    console.log("Failed to fetch user data")
    return null
  }

  return await response.json()
}

export async function getUser(
  knex: Knex,
  id: number
): Promise<UserResponse | null> {
  return await knex("users")
    .where({ oauth_provider_id: id, oauth_provider: "github" })
    .first()
}

export async function getProfile(
  knex: Knex,
  user_id: string
): Promise<ProfileResponse> {
  return await knex("profiles").where({ user_id }).first()
}

export async function setUserAndGetId(knex: Knex, id: number): Promise<string> {
  let user: UserResponse
  ;[user] = await knex("users")
    .insert({
      oauth_provider: "github",
      oauth_provider_id: id,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    })
    .returning("*")

  return user.id
}

export async function setProfile(
  knex: Knex,
  userData: OAuthResponse,
  user_id: string
) {
  await knex("profiles").insert({
    user_id,
    username: userData.login,
    email: userData.email,
    description: userData.bio,
    avatar_url: userData.avatar_url,
    created_at: knex.fn.now(),
    updated_at: knex.fn.now(),
  })

  
}
