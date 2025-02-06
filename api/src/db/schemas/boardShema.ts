import { Knex } from "knex";

export const boardSchema = (knex: Knex) => {
  return knex.schema.createTable("boards", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("title").notNullable();
    table
      .string("creator_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE"); // ensure creator_id references users table
    table.string("org_id").notNullable();
    table.string("image_id").notNullable();
    table.text("image_thumb_url").notNullable();
    table.text("image_full_url").notNullable();
    table.text("image_link_html").notNullable();
    table.text("image_username").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};
