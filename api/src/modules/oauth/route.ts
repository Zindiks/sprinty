import { FastifyInstance } from "fastify"
import { githubCallback, getUser, logout } from "./controller"
import { oauth2Options } from "./model"
import fastifyOauth2 from "@fastify/oauth2"

export default async function oauthRoutes(server: FastifyInstance) {
    
  server.register(fastifyOauth2, oauth2Options)

  server.get("/login/github/callback", githubCallback)
  server.get("/user", getUser)
  server.post("/logout", logout)
}
