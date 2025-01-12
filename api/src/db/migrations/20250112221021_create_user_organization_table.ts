import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("user_organization", function (table) {
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
    table
      .uuid("organization_id")
      .notNullable()
      .references("id")
      .inTable("organizations")
      .onDelete("CASCADE")
    table.primary(["user_id", "organization_id"])
  })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("user_organization")
}
