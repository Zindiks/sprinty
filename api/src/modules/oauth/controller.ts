import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify"
import {
  getAccessTokenFromAuthorizationCodeFlow,
  fetchUserData,
  getUser,
  getProfile,
  setUserAndGetId,
  setProfile,
} from "./service"

export async function githubCallback(
  this: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { token } = await getAccessTokenFromAuthorizationCodeFlow(request)

  const userData = await fetchUserData(token.access_token)

  if (!userData) {
    return reply.status(500).send({ error: "Failed to fetch user data" })
  }

  const user = await getUser(this.knex, userData.id)


  if (!user) {
    const user_id = await setUserAndGetId(this.knex, userData.id) 
    await setProfile(this.knex, userData, user_id)
  }

  reply.setCookie("accessToken", token.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "strict",
  })

  reply.redirect(`http://localhost:5173?access_token=${token.access_token}`)
}

export async function getUserController(
  this: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const accessToken = request.cookies.accessToken

  if (!accessToken) {
    return reply.status(401).send({ error: "Unauthorized" })
  }

  const userData = await fetchUserData(accessToken)

  if (!userData) {
    return reply.status(500).send({ error: "Failed to fetch user data" })
  }

  const user = await getUser(this.knex, userData.id)

  if (!user) {
    return reply.status(404).send({ error: "User not found" })
  }

  const profile = await getProfile(this.knex, user.id)

  reply.send(profile)
}

export async function logout(_: FastifyRequest, reply: FastifyReply) {
  reply.clearCookie("accessToken", {
    path: "/",
  })
  reply.status(200).send({ message: "Logged out" })
}
