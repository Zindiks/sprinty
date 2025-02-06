import { Knex } from "knex";

export const seed = async (knex: Knex) => {
  await knex("organizations").del();
  await knex("organizations").insert([
    {
      id: knex.raw("gen_random_uuid()"),
      title: "Tech Corp",
      description: "A leading tech company",
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: knex.raw("gen_random_uuid()"),
      title: "Design Studio",
      description: "Creative design solutions",
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
};
