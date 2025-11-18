import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("checklist_items", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("card_id").notNullable().references("id").inTable("cards").onDelete("CASCADE");
    table.string("title", 255).notNullable();
    table.boolean("completed").defaultTo(false);
    table.integer("order").notNullable();
    table.uuid("completed_by").nullable().references("id").inTable("users").onDelete("SET NULL");
    table.timestamp("completed_at").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("checklist_items");
}
