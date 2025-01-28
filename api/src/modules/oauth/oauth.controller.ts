import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify"
import {
  getAccessTokenFromAuthorizationCodeFlow,
  fetchUserData,
  UserService,
} from "./oauth.service"

export class UserController {
  private readonly userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  async githubCallback(request: FastifyRequest, reply: FastifyReply) {
    const { token } = await getAccessTokenFromAuthorizationCodeFlow(request)

    const userData = await fetchUserData(token.access_token)

    if (!userData) {
      return reply.status(500).send({ error: "Failed to fetch user data" })
    }

    const user = await this.userService.getUser(userData.id)

    if (!user) {
      const user_id = await this.userService.setUserAndGetId(userData.id)
      await this.userService.setProfile(userData, user_id)
    }

    reply.setCookie("accessToken", token.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
    })

    reply.redirect(`http://localhost:5173?access_token=${token.access_token}`)
  }

  async getUserController(request: FastifyRequest, reply: FastifyReply) {
    const accessToken = request.cookies.accessToken

    if (!accessToken) {
      return reply.status(401).send({ error: "Unauthorized" })
    }

    const userData = await fetchUserData(accessToken)

    if (!userData) {
      return reply.status(500).send({ error: "Failed to fetch user data" })
    }

    const user = await this.userService.getUser(userData.id)

    if (!user) {
      return reply.status(404).send({ error: "User not found" })
    }

    const profile = await this.userService.getProfile(user.id)

    reply.send(profile)
  }

  async logout(_: FastifyRequest, reply: FastifyReply) {
    reply.clearCookie("accessToken", {
      path: "/",
    })
    reply.status(200).send({ message: "Logged out" })
  }
}
