import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("time_logs", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("card_id").notNullable().references("id").inTable("cards").onDelete("CASCADE");
    table.uuid("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.integer("duration_minutes").notNullable(); // Duration in minutes
    table.text("description").nullable();
    table.timestamp("logged_at").defaultTo(knex.fn.now());
    table.timestamp("created_at").defaultTo(knex.fn.now());

    // Indexes for performance
    table.index("card_id");
    table.index("user_id");
    table.index("logged_at");
    table.index(["card_id", "user_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("time_logs");
}
