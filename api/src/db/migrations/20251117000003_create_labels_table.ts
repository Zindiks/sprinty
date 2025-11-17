import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("labels", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("board_id")
      .notNullable()
      .references("id")
      .inTable("boards")
      .onDelete("CASCADE");
    table.string("name", 50).notNullable();
    table.string("color", 7).notNullable(); // Hex color (#FF5733)
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.unique(["board_id", "name"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("labels");
}
