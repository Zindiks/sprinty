import { Knex } from "knex"

import {
  CreateOrganization,
  UpdateOrganization,
  OrganizationResponse,
} from "./model"

export async function create(
  knex: Knex,
  input: CreateOrganization
): Promise<OrganizationResponse> {
  const [organization] = await knex("organizations")
    .insert(input)
    .returning("*")

  return organization
}

export async function update(
  knex: Knex,
  input: UpdateOrganization,
  id: string
): Promise<OrganizationResponse> {
  const updatedInput = {
    ...input,
    updated_at: knex.fn.now(),
  }
  const [organization] = await knex("organizations")
    .update(updatedInput)
    .where({ id })
    .returning("*")

  return organization
}

export async function getById(
  knex: Knex,
  id: string
): Promise<OrganizationResponse> {
  const [organization] = await knex("organizations")
    .select("*")
    .where({ id })
    .returning("*")

  return organization
}

export async function remove(knex: Knex, id: string) {
  const [deleted] = await knex("organizations")
    .where({ id })
    .delete()
    .returning("id")

  return deleted
}

export async function getAll(knex: Knex): Promise<OrganizationResponse[]> {
  return await knex("organizations").select("*")
}
