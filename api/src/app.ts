import fastify, { FastifyReply, FastifyRequest, FastifyInstance } from "fastify"
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox"
import fastifyOauth2, {
  OAuth2Namespace,
  FastifyOAuth2Options,
} from "@fastify/oauth2"
import { config } from "../src/configs/config"

import fastifyCors from "@fastify/cors"


declare module "fastify" {
  interface FastifyInstance {
    githubOAuth2: OAuth2Namespace
  }
}

const server = fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>()

server.register(fastifyCors, {
  origin: "http://localhost:5173",
  credentials: true,
})



const oauth2Options: FastifyOAuth2Options = {
  name: "githubOAuth2",
  credentials: {
    client: {
      id: config.api.githubClientId,
      secret: config.api.githubClientSecret,
    },
    auth: fastifyOauth2.GITHUB_CONFIGURATION,
  },
  startRedirectPath: "/login/github",
  callbackUri: "http://localhost:4000/login/github/callback",
}

server.register(fastifyOauth2, oauth2Options)

server.get(
  "/login/github/callback",
  async function (request: FastifyRequest, reply: FastifyReply) {
    const { token } =
      await this.githubOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)
    reply.setCookie("accessToken", token.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
    })
    reply.redirect(`http://localhost:5173?access_token=${token.access_token}`)
  }
)

server.get("/user", async (request: FastifyRequest, reply: FastifyReply) => {
  const accessToken = request.cookies.accessToken
  if (!accessToken) {
    return reply.status(401).send({ error: "Unauthorized" })
  }

  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `token ${accessToken}`,
    },
  })

  if (!response.ok) {
    console.log("Failed to fetch user data") // Log error message to the console
    return reply
      .status(response.status)
      .send({ error: "Failed to fetch user data" })
  }

  const userData = await response.json()

  console.log(userData) // Log user data to the console
  reply.send(userData)
})

server.post("/logout", async (request: FastifyRequest, reply: FastifyReply) => {
  reply.clearCookie("accessToken", {
    path: "/",
  })
  reply.send({ message: "Logged out" })
})

server.listen({ port: config.api.port }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
