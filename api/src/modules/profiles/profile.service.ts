import {
  CreateProfile,
  UpdateProfile,
  ProfileResponse,
} from "./profile.schema";
import { ProfileRepository } from "./profile.repository";
import {
  UsernameAlreadyExistsError,
  EmailAlreadyExistsError,
} from "../../shared/errors";

export class ProfileService {
  private readonly profileRepository: ProfileRepository;

  constructor() {
    this.profileRepository = new ProfileRepository();
  }

  async getByUserId(user_id: string): Promise<ProfileResponse | null> {
    return this.profileRepository.getByUserId(user_id);
  }

  async getById(id: string): Promise<ProfileResponse | null> {
    return this.profileRepository.getById(id);
  }

  async create(input: CreateProfile): Promise<ProfileResponse> {
    // Check if username already exists
    if (input.username) {
      const usernameExists = await this.profileRepository.checkUsernameExists(
        input.username,
      );
      if (usernameExists) {
        throw new UsernameAlreadyExistsError();
      }
    }

    // Check if email already exists
    if (input.email) {
      const emailExists = await this.profileRepository.checkEmailExists(
        input.email,
      );
      if (emailExists) {
        throw new EmailAlreadyExistsError();
      }
    }

    return this.profileRepository.create(input);
  }

  async update(
    user_id: string,
    input: UpdateProfile,
  ): Promise<ProfileResponse> {
    // Check if username already exists (excluding current user)
    if (input.username) {
      const usernameExists = await this.profileRepository.checkUsernameExists(
        input.username,
        user_id,
      );
      if (usernameExists) {
        throw new UsernameAlreadyExistsError();
      }
    }

    // Check if email already exists (excluding current user)
    if (input.email) {
      const emailExists = await this.profileRepository.checkEmailExists(
        input.email,
        user_id,
      );
      if (emailExists) {
        throw new EmailAlreadyExistsError();
      }
    }

    return this.profileRepository.update(user_id, input);
  }

  async delete(user_id: string): Promise<ProfileResponse> {
    return this.profileRepository.delete(user_id);
  }
}
