import { UserResponse } from "../modules/oauth/oauth.schema";

declare module "fastify" {
  interface FastifyRequest {
    user?: UserResponse;
  }
}
