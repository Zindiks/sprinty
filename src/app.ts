import fastify, { FastifyReply, FastifyRequest } from "fastify"
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox"
import fastifyOauth2, {
  OAuth2Namespace,
  FastifyOAuth2Options,
} from "@fastify/oauth2"
import { config } from "../src/configs/config"

declare module "fastify" {
  interface FastifyInstance {
    githubOAuth2: OAuth2Namespace
  }
}

const server = fastify().withTypeProvider<TypeBoxTypeProvider>()

server.get("/ping", async (request: FastifyRequest, reply: FastifyReply) => {
  return "pong\n"
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
  callbackUri: "http://localhost:8080/login/github/callback",
}

server.register(fastifyOauth2, oauth2Options)

server.get("/login/github/callback", async function (request, reply) {
  const { token } =
    await this.githubOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)
  reply.send({ access_token: token.access_token })
})

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
