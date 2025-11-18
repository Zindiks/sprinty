import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("dashboard_layouts", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.string("name", 255).notNullable();
    table.jsonb("widgets").notNullable().defaultTo("[]");
    table.boolean("is_default").defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    // Indexes for performance
    table.index("user_id");
    table.index(["user_id", "is_default"]);

    // Unique constraint: only one default layout per user
    table.unique(["user_id", "is_default"], {
      predicate: knex.whereRaw("is_default = true"),
    });
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("dashboard_layouts");
}
