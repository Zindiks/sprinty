import { FastifyInstance } from "fastify";
import { ProfileSchema } from "./profile.schema";
import { ProfileController } from "./profile.controller";

const profileController = new ProfileController();

export default async function profileRoutes(fastify: FastifyInstance) {
  // Get profile by user_id
  fastify.get(
    "/user/:user_id",
    {
      schema: {
        params: {
          type: "object",
          properties: { user_id: { type: "string", format: "uuid" } },
        },
        response: {
          200: ProfileSchema.ProfileResponseSchema,
          404: {
            type: "object",
            properties: { message: { type: "string" } },
          },
        },
        tags: ["profile"],
        description: "Get a profile by user ID",
      },
    },
    profileController.getProfileByUserIdController.bind(profileController)
  );

  // Get profile by profile id
  fastify.get(
    "/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: { id: { type: "string", format: "uuid" } },
        },
        response: {
          200: ProfileSchema.ProfileResponseSchema,
          404: {
            type: "object",
            properties: { message: { type: "string" } },
          },
        },
        tags: ["profile"],
        description: "Get a profile by profile ID",
      },
    },
    profileController.getProfileByIdController.bind(profileController)
  );

  // Create profile
  fastify.post(
    "/",
    {
      schema: {
        body: ProfileSchema.CreateProfileSchema,
        response: {
          201: ProfileSchema.ProfileResponseSchema,
          409: {
            type: "object",
            properties: { message: { type: "string" } },
          },
        },
        tags: ["profile"],
        description: "Create a new profile",
      },
    },
    profileController.createProfileController.bind(profileController)
  );

  // Update profile
  fastify.put(
    "/user/:user_id",
    {
      schema: {
        params: {
          type: "object",
          properties: { user_id: { type: "string", format: "uuid" } },
        },
        body: ProfileSchema.UpdateProfileSchema,
        response: {
          200: ProfileSchema.ProfileResponseSchema,
          404: {
            type: "object",
            properties: { message: { type: "string" } },
          },
          409: {
            type: "object",
            properties: { message: { type: "string" } },
          },
        },
        tags: ["profile"],
        description: "Update a profile by user ID",
      },
    },
    profileController.updateProfileController.bind(profileController)
  );

  // Delete profile
  fastify.delete(
    "/user/:user_id",
    {
      schema: {
        params: {
          type: "object",
          properties: { user_id: { type: "string", format: "uuid" } },
        },
        response: {
          200: ProfileSchema.ProfileResponseSchema,
          404: {
            type: "object",
            properties: { message: { type: "string" } },
          },
        },
        tags: ["profile"],
        description: "Delete a profile by user ID",
      },
    },
    profileController.deleteProfileController.bind(profileController)
  );
}
