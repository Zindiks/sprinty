import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("cards", function (table) {
    table.timestamp("due_date").nullable();
    table
      .enum("priority", ["low", "medium", "high", "critical"])
      .defaultTo("medium");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("cards", function (table) {
    table.dropColumn("due_date");
    table.dropColumn("priority");
  });
}
