import { Knex } from "knex";

export const seed = async (knex: Knex) => {
  await knex("cards").del();
  await knex("cards").insert([
    {
      id: knex.raw("gen_random_uuid()"),
      list_id: knex("lists").where("title", "To Do").select("id"),
      title: "Set up project",
      order: 1,
      description: "Initialize the project structure",
      status: "pending",
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
};
