import { FastifyInstance } from "fastify"
import { githubCallback, getUserController, logout } from "./controller"
import { oauth2Options } from "./model"
import fastifyOauth2 from "@fastify/oauth2"

async function oauthRoutes(server: FastifyInstance) {
  server.register(fastifyOauth2, oauth2Options)

  server.get("/github/callback", githubCallback)
  server.get("/user", getUserController)
  server.get("/logout", logout)
}

export default oauthRoutes
