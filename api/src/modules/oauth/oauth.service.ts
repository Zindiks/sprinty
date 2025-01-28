import { FastifyRequest } from "fastify"
import {
  oauth2Options,
  OAuthResponse,
  ProfileResponse,
  UserResponse,
} from "./oauth.schema"
import { OAuth2Namespace } from "@fastify/oauth2"
import { UserRepository } from "./oauth.repository"

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

export class UserService {
  private readonly userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  async getUser(id: number): Promise<UserResponse | null> {
    return this.userRepository.getUser(id)
  }
  async getProfile(user_id: string): Promise<ProfileResponse> {
    return this.userRepository.getProfile(user_id)
  }
  async setUserAndGetId(id: number): Promise<string> {
    return this.userRepository.setUserAndGetId(id)
  }
  async setProfile(userData: OAuthResponse, user_id: string) {
    return this.userRepository.setProfile(userData, user_id)
  }
}
