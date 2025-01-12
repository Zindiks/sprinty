import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("organization_admin", function (table) {
    table
      .uuid("organization_id")
      .notNullable()
      .references("id")
      .inTable("organizations")
      .onDelete("CASCADE")
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
    table.primary(["organization_id", "user_id"])
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("organization_admin")
}
