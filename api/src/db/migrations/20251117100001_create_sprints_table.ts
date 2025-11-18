import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("sprints", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("board_id").notNullable().references("id").inTable("boards").onDelete("CASCADE");
    table.string("name").notNullable();
    table.text("goal").nullable();
    table.timestamp("start_date").notNullable();
    table.timestamp("end_date").notNullable();
    table.enum("status", ["planned", "active", "completed", "cancelled"]).defaultTo("planned");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    // Indexes for performance
    table.index("board_id");
    table.index(["board_id", "status"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("sprints");
}
