import { FastifyRequest } from "fastify"
import { oauth2Options } from "./model"
import { OAuth2Namespace } from "@fastify/oauth2"

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

export async function fetchUserData(accessToken: string) {
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
