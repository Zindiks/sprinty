import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("oauth_tokens", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"))
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
    table.string("access_token").notNullable()
    table.string("refresh_token")
    table.timestamp("expires_at")
    table.timestamp("created_at").defaultTo(knex.fn.now())
    table.timestamp("updated_at").defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("oauth_tokens")
}
