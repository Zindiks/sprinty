import { Knex } from "knex"

import { CreateBoard, UpdateBoard, BoardResponse } from "./model"

export async function create(
  knex: Knex,
  input: CreateBoard
): Promise<BoardResponse> {
  const [board] = await knex("boards").insert(input).returning("*")

  return board
}

export async function update(
  knex: Knex,
  input: UpdateBoard,
  id: string
): Promise<BoardResponse> {
  const updatedInput = {
    ...input,
    updated_at: knex.fn.now(),
  }

  const [board] = await knex("boards")
    .update(updatedInput)
    .where({ id })
    .returning("*")

  return board
}

export async function getById(knex: Knex, id: string): Promise<BoardResponse> {
  const [board] = await knex("boards").select("*").where({ id }).returning("*")

  return board
}

export async function remove(knex: Knex, id: string) {
  const [deleted] = await knex("boards").where({ id }).delete().returning("id")

  return deleted
}

export async function getAll(
  knex: Knex,
  organization_id: string
): Promise<BoardResponse[]> {
  return await knex("boards")
    .select("*")
    .where({ organization_id })
    .returning("*")
}
