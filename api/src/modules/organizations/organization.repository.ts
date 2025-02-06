import { Knex } from "knex";
import {
  CreateOrganization,
  UpdateOrganization,
  OrganizationResponse,
} from "./organization.schema";
import knexInstance from "../../db/knexInstance";

const table = "organizations";

export class OrganizationRepository {
  private readonly knex: Knex;

  constructor() {
    this.knex = knexInstance;
  }

  async getById(id: string): Promise<OrganizationResponse> {
    const [organization] = await this.knex(table)
      .select("*")
      .where({ id })
      .returning("*");

    return organization;
  }

  async getAll(): Promise<OrganizationResponse[]> {
    return await this.knex(table).select("*");
  }

  async create(input: CreateOrganization): Promise<OrganizationResponse> {
    const [organization] = await this.knex(table).insert(input).returning("*");

    return organization;
  }

  async update(
    input: UpdateOrganization,
    id: string,
  ): Promise<OrganizationResponse> {
    const updatedInput = {
      ...input,
      updated_at: this.knex.fn.now(),
    };
    const [organization] = await this.knex(table)
      .update(updatedInput)
      .where({ id })
      .returning("*");

    return organization;
  }

  async deleteOrganization(id: string) {
    const [deleted] = await this.knex(table)
      .where({ id })
      .delete()
      .returning("id");

    return deleted;
  }
}
