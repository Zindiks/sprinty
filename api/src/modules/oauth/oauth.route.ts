import { FastifyInstance } from "fastify";
import { UserController } from "./oauth.controller";
import { oauth2Options } from "./oauth.schema";
import fastifyOauth2 from "@fastify/oauth2";
import { requireAuth } from "../../middleware/auth.middleware";

const userController = new UserController();

async function oauthRoutes(fastify: FastifyInstance) {
  fastify.register(fastifyOauth2, oauth2Options);

  fastify.get(
    "/github/callback",
    userController.githubCallback.bind(userController),
  );
  fastify.get("/user", {
    preHandler: [requireAuth]
  }, userController.getUserController.bind(userController));
  fastify.get("/logout", {
    preHandler: [requireAuth]
  }, userController.logout.bind(userController));
}

export default oauthRoutes;
