import { Knex } from "knex";
import {
  CreateProfile,
  UpdateProfile,
  ProfileResponse,
} from "./profile.schema";
import knexInstance from "../../db/knexInstance";

const table = "profiles";

export class ProfileRepository {
  private readonly knex: Knex;

  constructor() {
    this.knex = knexInstance;
  }

  async getByUserId(user_id: string): Promise<ProfileResponse | null> {
    const profile = await this.knex(table).where({ user_id }).first();
    return profile || null;
  }

  async getById(id: string): Promise<ProfileResponse | null> {
    const profile = await this.knex(table).where({ id }).first();
    return profile || null;
  }

  async create(input: CreateProfile): Promise<ProfileResponse> {
    const [profile] = await this.knex(table)
      .insert({
        ...input,
        created_at: this.knex.fn.now(),
        updated_at: this.knex.fn.now(),
      })
      .returning("*");

    return profile;
  }

  async update(
    user_id: string,
    input: UpdateProfile,
  ): Promise<ProfileResponse> {
    const [profile] = await this.knex(table)
      .where({ user_id })
      .update({
        ...input,
        updated_at: this.knex.fn.now(),
      })
      .returning("*");

    return profile;
  }

  async delete(user_id: string): Promise<ProfileResponse> {
    const [profile] = await this.knex(table)
      .where({ user_id })
      .del()
      .returning("*");

    return profile;
  }

  async checkUsernameExists(
    username: string,
    excludeUserId?: string,
  ): Promise<boolean> {
    const query = this.knex(table).where({ username });

    if (excludeUserId) {
      query.whereNot({ user_id: excludeUserId });
    }

    const profile = await query.first();
    return !!profile;
  }

  async checkEmailExists(
    email: string,
    excludeUserId?: string,
  ): Promise<boolean> {
    const query = this.knex(table).where({ email });

    if (excludeUserId) {
      query.whereNot({ user_id: excludeUserId });
    }

    const profile = await query.first();
    return !!profile;
  }
}
