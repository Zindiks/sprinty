import Fastify from "fastify"
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox"
import fastifyCors from "@fastify/cors"
import knexPlugin from "./db/knexPlugin"
import oauthRoutes from "./modules/oauth/route"

export async function createServer() {
  const server = Fastify({
    logger: true,
  }).withTypeProvider<TypeBoxTypeProvider>()

  server.register(fastifyCors, {
    origin: "http://localhost:5173",
    credentials: true,
  })



  server.register(knexPlugin)
  server.register(oauthRoutes, { prefix: "/api/v1/oauth" })

  server.get("/", async (request, reply) => {
    reply.send({ hello: "world" })
  })

  return server
}
