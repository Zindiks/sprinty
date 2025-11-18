import { FastifyReply, FastifyRequest } from "fastify";
import { UpdateProfile, CreateProfile } from "./profile.schema";
import { ProfileService } from "./profile.service";

export class ProfileController {
  private readonly profileService: ProfileService;

  constructor() {
    this.profileService = new ProfileService();
  }

  async getProfileByUserIdController(
    request: FastifyRequest<{
      Params: { user_id: string };
    }>,
    reply: FastifyReply
  ) {
    const { user_id } = request.params;

    try {
      const profile = await this.profileService.getByUserId(user_id);

      if (!profile) {
        return reply.status(404).send({ message: "Profile not found" });
      }

      return reply.status(200).send(profile);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  async getProfileByIdController(
    request: FastifyRequest<{
      Params: { id: string };
    }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;

    try {
      const profile = await this.profileService.getById(id);

      if (!profile) {
        return reply.status(404).send({ message: "Profile not found" });
      }

      return reply.status(200).send(profile);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  async createProfileController(
    request: FastifyRequest<{
      Body: CreateProfile;
    }>,
    reply: FastifyReply
  ) {
    const body = request.body;

    try {
      const profile = await this.profileService.create(body);
      return reply.status(201).send(profile);
    } catch (err: any) {
      if (err.message === "Username already exists" || err.message === "Email already exists") {
        return reply.status(409).send({ message: err.message });
      }
      return reply.status(500).send(err);
    }
  }

  async updateProfileController(
    request: FastifyRequest<{
      Params: { user_id: string };
      Body: UpdateProfile;
    }>,
    reply: FastifyReply
  ) {
    const { user_id } = request.params;
    const body = request.body;

    try {
      const profile = await this.profileService.update(user_id, body);

      if (!profile) {
        return reply.status(404).send({ message: "Profile not found" });
      }

      return reply.status(200).send(profile);
    } catch (err: any) {
      if (err.message === "Username already exists" || err.message === "Email already exists") {
        return reply.status(409).send({ message: err.message });
      }
      return reply.status(500).send(err);
    }
  }

  async deleteProfileController(
    request: FastifyRequest<{
      Params: { user_id: string };
    }>,
    reply: FastifyReply
  ) {
    const { user_id } = request.params;

    try {
      const profile = await this.profileService.delete(user_id);

      if (!profile) {
        return reply.status(404).send({ message: "Profile not found" });
      }

      return reply.status(200).send(profile);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }
}
