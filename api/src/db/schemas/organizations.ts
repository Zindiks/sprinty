import { Knex } from "knex"

export const organizationSchema = (knex: Knex) => {
  return knex.schema.createTable("organizations", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"))
    table.string("title").notNullable()
    table.text("description")
    table.timestamp("created_at").defaultTo(knex.fn.now())
    table.timestamp("updated_at").defaultTo(knex.fn.now())
  })
}