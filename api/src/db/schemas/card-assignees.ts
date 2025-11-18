import { Knex } from "knex";

export const cardAssigneeSchema = (knex: Knex) => {
  return knex.schema.createTable("card_assignees", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("card_id").notNullable().references("id").inTable("cards").onDelete("CASCADE");
    table.uuid("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.timestamp("assigned_at").defaultTo(knex.fn.now());
    table.uuid("assigned_by").nullable().references("id").inTable("users").onDelete("SET NULL");
    table.unique(["card_id", "user_id"]);
  });
};
