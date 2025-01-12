import { Knex } from "knex"

export const seed = async (knex: Knex) => {
  await knex("boards").del()
  await knex("boards").insert([
    {
      id: knex.raw("gen_random_uuid()"),
      organization_id: knex("organizations")
        .where("title", "Tech Corp")
        .select("id"),
      title: "Development Board",
      description: "Board for development tasks",
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ])
}
