import {Knex }from "knex"

import {
  BaseOrganization,
  CreateOrganization,
  UpdateOrganization,
  DeleteOrganization,
  OrganizationResponse,
} from "./model"



export async function createOrganization(knex: Knex, input: CreateOrganization): Promise<OrganizationResponse> {
  const [organization] = await knex("organizations")
    .insert(input)
    .returning("*")

  return organization
}