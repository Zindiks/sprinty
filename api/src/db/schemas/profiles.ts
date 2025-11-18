import { Knex } from "knex";

export const profileSchema = (knex: Knex) => {
  return knex.schema.createTable("profiles", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.text("description");
    table.date("date_of_birth");
    table.string("avatar_url");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};
