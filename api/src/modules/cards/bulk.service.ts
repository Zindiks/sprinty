import { Knex } from "knex";
import knexInstance from "../../db/knexInstance";

export interface BulkMoveCardsInput {
  card_ids: string[];
  target_list_id: string;
}

export interface BulkAssignUsersInput {
  card_ids: string[];
  user_ids: string[];
}

export interface BulkAddLabelsInput {
  card_ids: string[];
  label_ids: string[];
}

export interface BulkSetDueDateInput {
  card_ids: string[];
  due_date: string | null;
}

export interface BulkArchiveCardsInput {
  card_ids: string[];
}

export interface BulkDeleteCardsInput {
  card_ids: string[];
}

export interface BulkOperationResponse {
  success: boolean;
  updated: number;
  message: string;
}

export class BulkService {
  private readonly knex: Knex;

  constructor() {
    this.knex = knexInstance;
  }

  /**
   * Move multiple cards to a target list
   */
  async moveCards(input: BulkMoveCardsInput): Promise<BulkOperationResponse> {
    const { card_ids, target_list_id } = input;

    return this.knex.transaction(async (trx) => {
      // Get max order in target list
      const result = await trx("cards")
        .where("list_id", target_list_id)
        .max("order as max_order")
        .first();

      const maxOrder = result?.max_order ?? -1;
      const startOrder = maxOrder + 1;

      // Update all cards
      for (let i = 0; i < card_ids.length; i++) {
        const card_id = card_ids[i];

        await trx("cards")
          .where("id", card_id)
          .update({
            list_id: target_list_id,
            order: startOrder + i,
            updated_at: trx.fn.now(),
          });

        // Log activity
        await trx("card_activities").insert({
          card_id: card_id,
          action: "moved",
          details: `Moved to list ${target_list_id}`,
          created_at: trx.fn.now(),
        });
      }

      return {
        success: true,
        updated: card_ids.length,
        message: `${card_ids.length} card(s) moved successfully`,
      };
    });
  }

  /**
   * Assign users to multiple cards
   */
  async assignUsers(
    input: BulkAssignUsersInput,
  ): Promise<BulkOperationResponse> {
    const { card_ids, user_ids } = input;

    return this.knex.transaction(async (trx) => {
      let assignedCount = 0;

      for (const card_id of card_ids) {
        for (const user_id of user_ids) {
          // Insert or ignore if already assigned
          await trx("card_assignees")
            .insert({
              card_id,
              user_id,
              assigned_at: trx.fn.now(),
            })
            .onConflict(["card_id", "user_id"])
            .ignore();

          assignedCount++;
        }

        // Log activity
        await trx("card_activities").insert({
          card_id: card_id,
          action: "assignee_added",
          details: `Assigned ${user_ids.length} user(s)`,
          created_at: trx.fn.now(),
        });
      }

      return {
        success: true,
        updated: assignedCount,
        message: `Users assigned to ${card_ids.length} card(s)`,
      };
    });
  }

  /**
   * Add labels to multiple cards
   */
  async addLabels(input: BulkAddLabelsInput): Promise<BulkOperationResponse> {
    const { card_ids, label_ids } = input;

    return this.knex.transaction(async (trx) => {
      let labeledCount = 0;

      for (const card_id of card_ids) {
        for (const label_id of label_ids) {
          // Insert or ignore if label already exists
          await trx("card_labels")
            .insert({
              card_id,
              label_id,
              added_at: trx.fn.now(),
            })
            .onConflict(["card_id", "label_id"])
            .ignore();

          labeledCount++;
        }

        // Log activity
        await trx("card_activities").insert({
          card_id: card_id,
          action: "label_added",
          details: `Added ${label_ids.length} label(s)`,
          created_at: trx.fn.now(),
        });
      }

      return {
        success: true,
        updated: labeledCount,
        message: `Labels added to ${card_ids.length} card(s)`,
      };
    });
  }

  /**
   * Set due date on multiple cards
   */
  async setDueDate(input: BulkSetDueDateInput): Promise<BulkOperationResponse> {
    const { card_ids, due_date } = input;

    return this.knex.transaction(async (trx) => {
      // Update all cards
      await trx("cards").whereIn("id", card_ids).update({
        due_date: due_date,
        updated_at: trx.fn.now(),
      });

      // Log activity for each card
      for (const card_id of card_ids) {
        await trx("card_activities").insert({
          card_id: card_id,
          action: due_date ? "due_date_set" : "due_date_removed",
          details: due_date
            ? `Due date set to ${due_date}`
            : "Due date removed",
          created_at: trx.fn.now(),
        });
      }

      return {
        success: true,
        updated: card_ids.length,
        message: `Due date ${due_date ? "set" : "cleared"} on ${card_ids.length} card(s)`,
      };
    });
  }

  /**
   * Archive multiple cards
   */
  async archiveCards(
    input: BulkArchiveCardsInput,
  ): Promise<BulkOperationResponse> {
    const { card_ids } = input;

    return this.knex.transaction(async (trx) => {
      // Update all cards to archived status
      await trx("cards").whereIn("id", card_ids).update({
        status: "archived",
        updated_at: trx.fn.now(),
      });

      // Log activity for each card
      for (const card_id of card_ids) {
        await trx("card_activities").insert({
          card_id: card_id,
          action: "archived",
          details: "Card archived",
          created_at: trx.fn.now(),
        });
      }

      return {
        success: true,
        updated: card_ids.length,
        message: `${card_ids.length} card(s) archived successfully`,
      };
    });
  }

  /**
   * Delete multiple cards and their related data
   */
  async deleteCards(
    input: BulkDeleteCardsInput,
  ): Promise<BulkOperationResponse> {
    const { card_ids } = input;

    return this.knex.transaction(async (trx) => {
      // Delete related records first (cascade)
      await trx("card_assignees").whereIn("card_id", card_ids).del();
      await trx("card_labels").whereIn("card_id", card_ids).del();
      await trx("checklist_items").whereIn("card_id", card_ids).del();
      await trx("comments").whereIn("card_id", card_ids).del();
      await trx("attachments").whereIn("card_id", card_ids).del();
      await trx("card_activities").whereIn("card_id", card_ids).del();

      // Delete cards
      await trx("cards").whereIn("id", card_ids).del();

      return {
        success: true,
        updated: card_ids.length,
        message: `${card_ids.length} card(s) deleted successfully`,
      };
    });
  }
}
