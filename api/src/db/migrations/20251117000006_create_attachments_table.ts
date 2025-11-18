import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("attachments", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("card_id").notNullable().references("id").inTable("cards").onDelete("CASCADE");
    table.string("filename", 255).notNullable();
    table.string("original_filename", 255).notNullable();
    table.string("mime_type", 100).notNullable();
    table.bigInteger("file_size").notNullable(); // bytes
    table.string("storage_path", 500).notNullable();
    table.uuid("uploaded_by").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.timestamp("uploaded_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("attachments");
}
