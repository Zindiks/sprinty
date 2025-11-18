import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("board_templates", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("name", 50).notNullable();
    table.text("description");
    table.string("category", 30).notNullable();
    table.string("icon", 20);
    table.boolean("is_system").notNullable().defaultTo(false);
    table
      .uuid("organization_id")
      .nullable()
      .references("id")
      .inTable("organizations")
      .onDelete("CASCADE");
    table.uuid("created_by").nullable().references("id").inTable("users").onDelete("SET NULL");
    table.jsonb("structure").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    // Indexes for performance
    table.index("category", "idx_board_templates_category");
    table.index("organization_id", "idx_board_templates_organization");
    table.index("is_system", "idx_board_templates_system");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("board_templates");
}
