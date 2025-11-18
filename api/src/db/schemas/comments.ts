import { Knex } from "knex";

export const commentSchema = (knex: Knex) => {
  return knex.schema.createTable("comments", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("card_id").notNullable().references("id").inTable("cards").onDelete("CASCADE");
    table.uuid("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.text("content").notNullable();
    table
      .uuid("parent_comment_id")
      .nullable()
      .references("id")
      .inTable("comments")
      .onDelete("CASCADE");
    table.boolean("is_edited").defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};
