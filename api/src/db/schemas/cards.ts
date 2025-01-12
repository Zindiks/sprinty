import { Knex } from "knex"

export const cardSchema = (knex: Knex) => {
  return knex.schema.createTable("cards", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"))
    table
      .uuid("list_id")
      .notNullable()
      .references("id")
      .inTable("lists")
      .onDelete("CASCADE")
    table.string("title").notNullable()
    table.integer("order").notNullable()
    table.text("description")
    table.string("status")
    table.timestamp("created_at").defaultTo(knex.fn.now())
    table.timestamp("updated_at").defaultTo(knex.fn.now())
  })
}