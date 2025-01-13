import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify"
import {
  getAccessTokenFromAuthorizationCodeFlow,
  fetchUserData,
} from "./service"

export async function githubCallback(
  this: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { token } = await getAccessTokenFromAuthorizationCodeFlow(request)
  const userData = await fetchUserData(token.access_token)

  console.log(userData)

  if (!userData) {
    return reply.status(500).send({ error: "Failed to fetch user data" })
  }

  let user = await this.knex("users")
    .where({ oauth_provider_id: userData.id, oauth_provider: "github" })
    .first()

  if (!user) {
    ;[user] = await this.knex("users")
      .insert({
        oauth_provider: "github",
        oauth_provider_id: userData.id,
        created_at: this.knex.fn.now(),
        updated_at: this.knex.fn.now(),
      })
      .returning("*")

    await this.knex("profiles").insert({
      user_id: user.id,
      username: userData.login,
      email: userData.email,
      avatar_url: userData.avatar_url,
      created_at: this.knex.fn.now(),
      updated_at: this.knex.fn.now(),
    })
  }

  reply.setCookie("accessToken", token.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "strict",
  })

  reply.redirect(`http://localhost:5173?access_token=${token.access_token}`)
}

export async function getUser(
  this: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const accessToken = request.cookies.accessToken

  console.log(request.cookies)

  if (!accessToken) {
    return reply.status(401).send({ error: "Unauthorized" })
  }

  const userData = await fetchUserData(accessToken)
  if (!userData) {
    return reply.status(500).send({ error: "Failed to fetch user data" })
  }

  const user = await this.knex("users")
    .where({ oauth_provider_id: userData.id, oauth_provider: "github" })
    .first()

  if (!user) {
    return reply.status(404).send({ error: "User not found" })
  }

  const profile = await this.knex("profiles")
    .where({ user_id: user.id })
    .first()

  reply.send(profile)
}

export async function logout(_: FastifyRequest, reply: FastifyReply) {
  reply.clearCookie("accessToken", {
    path: "/",
  })
  reply.status(200).send({ message: "Logged out" })
}
