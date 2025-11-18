import { Knex } from "knex";

export const labelSchema = (knex: Knex) => {
  return knex.schema.createTable("labels", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("board_id").notNullable().references("id").inTable("boards").onDelete("CASCADE");
    table.string("name", 50).notNullable();
    table.string("color", 7).notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.unique(["board_id", "name"]);
  });
};
