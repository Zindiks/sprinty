import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("card_reminders", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("card_id").notNullable().references("id").inTable("cards").onDelete("CASCADE");
    table.uuid("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.timestamp("reminder_time").notNullable();
    table.enum("reminder_type", ["24h", "1h", "custom"]).notNullable();
    table.boolean("sent").defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());

    // Indexes for performance
    table.index(["reminder_time", "sent"], "idx_reminders_time_sent");
    table.index("card_id", "idx_reminders_card_id");
    table.index("user_id", "idx_reminders_user_id");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("card_reminders");
}
