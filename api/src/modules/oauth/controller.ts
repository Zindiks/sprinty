import { FastifyRequest, FastifyReply } from "fastify"
import {
  getAccessTokenFromAuthorizationCodeFlow,
  fetchUserData,
} from "./service"

export async function githubCallback(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { token } = await getAccessTokenFromAuthorizationCodeFlow(request)
  reply.setCookie("accessToken", token.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "strict",
  })
  reply.redirect(`http://localhost:5173?access_token=${token.access_token}`)
}

export async function getUser(request: FastifyRequest, reply: FastifyReply) {
  const accessToken = request.cookies.accessToken
  if (!accessToken) {
    return reply.status(401).send({ error: "Unauthorized" })
  }

  const userData = await fetchUserData(accessToken)
  if (!userData) {
    return reply.status(500).send({ error: "Failed to fetch user data" })
  }

  reply.send(userData)
}

export async function logout(request: FastifyRequest, reply: FastifyReply) {
  reply.clearCookie("accessToken", {
    path: "/",
  })
  reply.status(200).send({ message: "Logged out" })
}

