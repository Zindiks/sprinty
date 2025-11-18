import { Knex } from "knex";
import { OAuthResponse, ProfileResponse, UserResponse } from "./oauth.schema";
import knexInstance from "../../db/knexInstance";

const usersTable = "users";
const profilesTable = "profiles";

export class UserRepository {
  private readonly knex: Knex;

  constructor() {
    this.knex = knexInstance;
  }

  async getUser(id: number): Promise<UserResponse | null> {
    return await this.knex(usersTable)
      .where({ oauth_provider_id: id, oauth_provider: "github" })
      .first();
  }

  async getProfile(user_id: string): Promise<ProfileResponse> {
    return await this.knex(profilesTable).where({ user_id }).first();
  }

  async setUserAndGetId(id: number): Promise<string> {
    const [user] = await this.knex(usersTable)
      .insert({
        oauth_provider: "github",
        oauth_provider_id: id,
        created_at: this.knex.fn.now(),
        updated_at: this.knex.fn.now(),
      })
      .returning("*");

    return user.id;
  }

  async setProfile(userData: OAuthResponse, user_id: string) {
    await this.knex(profilesTable).insert({
      user_id,
      username: userData.login,
      email: userData.email,
      description: userData.bio,
      avatar_url: userData.avatar_url,
      created_at: this.knex.fn.now(),
      updated_at: this.knex.fn.now(),
    });
  }
}
