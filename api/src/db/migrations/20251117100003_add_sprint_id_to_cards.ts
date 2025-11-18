import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("cards", function (table) {
    table.uuid("sprint_id").nullable().references("id").inTable("sprints").onDelete("SET NULL");

    // Index for filtering cards by sprint
    table.index("sprint_id");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("cards", function (table) {
    table.dropColumn("sprint_id");
  });
}
