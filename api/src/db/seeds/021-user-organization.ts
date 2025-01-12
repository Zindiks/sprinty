import { Knex } from "knex"

export const seed = async (knex: Knex) => {
  await knex("user_organization").del()
  await knex("user_organization").insert([
    {
      user_id: knex("users").where("username", "john_doe").select("id"),
      organization_id: knex("organizations")
        .where("title", "Tech Corp")
        .select("id"),
    },
    {
      user_id: knex("users").where("username", "jane_smith").select("id"),
      organization_id: knex("organizations")
        .where("title", "Design Studio")
        .select("id"),
    },
  ])
}
