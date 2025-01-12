import { Knex } from "knex"

export const seed = async (knex: Knex) => {
  await knex("organization_admin").del()
  await knex("organization_admin").insert([
    {
      organization_id: knex("organizations")
        .where("title", "Tech Corp")
        .select("id"),
      user_id: knex("users").where("username", "john_doe").select("id"),
    },
  ])
}
