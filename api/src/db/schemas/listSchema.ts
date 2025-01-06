import { Knex } from "knex"

export const listSchema = (knex: Knex) => {
  return knex.schema.createTable("lists", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"))
    table.string("title").notNullable()
    table.integer("order").notNullable()
    table
      .uuid("board_id")
      .notNullable()
      .references("id")
      .inTable("boards")
      .onDelete("CASCADE")
    table.timestamp("created_at").defaultTo(knex.fn.now())
    table.timestamp("updated_at").defaultTo(knex.fn.now())
  })
}
