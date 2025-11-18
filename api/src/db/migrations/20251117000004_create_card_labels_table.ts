import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("card_labels", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("card_id").notNullable().references("id").inTable("cards").onDelete("CASCADE");
    table.uuid("label_id").notNullable().references("id").inTable("labels").onDelete("CASCADE");
    table.timestamp("added_at").defaultTo(knex.fn.now());
    table.unique(["card_id", "label_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("card_labels");
}
