import fastify from "fastify"
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox"

import { config } from "../src/configs/config"

import fastifyCors from "@fastify/cors"
import oauthRoutes from "./modules/oauth/route"



const server = fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>()

server.register(fastifyCors, {
  origin: "http://localhost:5173",
  credentials: true,
})

server.register(oauthRoutes)

server.listen({ port: config.api.port }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
