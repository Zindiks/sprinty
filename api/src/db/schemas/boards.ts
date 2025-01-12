import { Knex } from "knex"

export const boardSchema = (knex: Knex) => {
  return knex.schema.createTable("boards", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"))
    table
      .uuid("organization_id")
      .notNullable()
      .references("id")
      .inTable("organizations")
      .onDelete("CASCADE")
    table.string("title").notNullable()
    table.text("description")
    table.timestamp("created_at").defaultTo(knex.fn.now())
    table.timestamp("updated_at").defaultTo(knex.fn.now())
  })
}