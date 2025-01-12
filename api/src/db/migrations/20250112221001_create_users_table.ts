import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"))
    table.string("username")
    table.string("email").unique()
    table.string("oauth_provider").notNullable()
    table.string("oauth_provider_id").notNullable()
    table.timestamp("created_at").defaultTo(knex.fn.now())
    table.timestamp("updated_at").defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users")
}
