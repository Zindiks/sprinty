import { FastifyInstance } from "fastify";
import { UserController } from "./oauth.controller";
import { oauth2Options } from "./oauth.schema";
import fastifyOauth2 from "@fastify/oauth2";

const userController = new UserController();

async function oauthRoutes(fastify: FastifyInstance) {
  fastify.register(fastifyOauth2, oauth2Options);

  fastify.get("/github/callback", userController.githubCallback.bind(userController));
  fastify.get("/user", userController.getUserController.bind(userController));
  fastify.get("/logout", userController.logout.bind(userController));
}

export default oauthRoutes;
