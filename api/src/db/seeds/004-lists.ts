import { Knex } from "knex";

export const seed = async (knex: Knex) => {
  await knex("lists").del();
  await knex("lists").insert([
    {
      id: knex.raw("gen_random_uuid()"),
      board_id: knex("boards").where("title", "Development Board").select("id"),
      title: "To Do",
      order: 1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: knex.raw("gen_random_uuid()"),
      board_id: knex("boards").where("title", "Development Board").select("id"),
      title: "In Progress",
      order: 2,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
};
