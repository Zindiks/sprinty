import { Knex } from "knex"

export const seed = async (knex: Knex) => {
  await knex("profiles").del()
  await knex("profiles").insert([
    {
      id: knex.raw("gen_random_uuid()"),
      user_id: knex("users").where("username", "john_doe").select("id"),
      description: "Software Developer from NY",
      date_of_birth: "1990-01-01",
      avatar_url: "https://example.com/avatar1.jpg",
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: knex.raw("gen_random_uuid()"),
      user_id: knex("users").where("username", "jane_smith").select("id"),
      description: "Graphic Designer from CA",
      date_of_birth: "1992-02-02",
      avatar_url: "https://example.com/avatar2.jpg",
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ])
}
