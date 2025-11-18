import { Knex } from "knex";

export const cardActivitySchema = (knex: Knex) => {
  return knex.schema.createTable("card_activities", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("card_id").notNullable().references("id").inTable("cards").onDelete("CASCADE");
    table.uuid("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table
      .enum("action_type", [
        "created",
        "updated",
        "moved",
        "archived",
        "assignee_added",
        "assignee_removed",
        "label_added",
        "label_removed",
        "comment_added",
        "attachment_added",
        "checklist_item_added",
        "checklist_item_completed",
        "due_date_set",
        "due_date_changed",
        "due_date_removed",
        "priority_changed",
        "description_changed",
        "title_changed",
      ])
      .notNullable();
    table.jsonb("metadata").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};
