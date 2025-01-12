import { Knex } from "knex"

export const seed = async (knex: Knex) => {
  await knex("users").del()
  await knex("users").insert([
    {
      id: knex.raw("gen_random_uuid()"),
      username: "john_doe",
      email: "john@example.com",
      password: "hashed_password_123",
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: knex.raw("gen_random_uuid()"),
      username: "jane_smith",
      email: "jane@example.com",
      password: "hashed_password_456",
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ])
}
