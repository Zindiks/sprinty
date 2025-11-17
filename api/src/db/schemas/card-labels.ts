import { Knex } from "knex";

export const cardLabelSchema = (knex: Knex) => {
  return knex.schema.createTable("card_labels", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("card_id")
      .notNullable()
      .references("id")
      .inTable("cards")
      .onDelete("CASCADE");
    table
      .uuid("label_id")
      .notNullable()
      .references("id")
      .inTable("labels")
      .onDelete("CASCADE");
    table.timestamp("added_at").defaultTo(knex.fn.now());
    table.unique(["card_id", "label_id"]);
  });
};
