import { Knex } from "knex";
import {
  CreateChecklistItem,
  UpdateChecklistItem,
  ToggleChecklistItem,
  DeleteChecklistItem,
  ChecklistItemResponse,
  ChecklistItemResponseArray,
  ChecklistProgress,
  ChecklistWithProgress,
} from "./checklist.schema";
import knexInstance from "../../db/knexInstance";

const table = "checklist_items";

export class ChecklistRepository {
  private readonly knex: Knex;

  constructor() {
    this.knex = knexInstance;
  }

  async createChecklistItem(
    input: CreateChecklistItem,
    _created_by_id?: string,
  ): Promise<ChecklistItemResponse> {
    const { card_id, title, order: orderInput } = input;

    // If no order provided, put at the end
    let itemOrder = orderInput;
    if (itemOrder === undefined) {
      const lastItem = await this.knex(table)
        .where({ card_id })
        .orderBy("order", "desc")
        .select("order")
        .first();

      itemOrder = lastItem ? lastItem.order + 1 : 0;
    }

    const [item] = await this.knex(table)
      .insert({
        card_id,
        title,
        order: itemOrder,
        completed: false,
      })
      .returning("*");

    return item;
  }

  async updateChecklistItem(
    input: UpdateChecklistItem,
  ): Promise<ChecklistItemResponse | undefined> {
    const { id, card_id, title, completed, order } = input;

    const updateData: Record<string, any> = {};
    if (title !== undefined) updateData.title = title;
    if (completed !== undefined) updateData.completed = completed;
    if (order !== undefined) updateData.order = order;
    updateData.updated_at = this.knex.fn.now();

    const [item] = await this.knex(table)
      .update(updateData)
      .where({ id, card_id })
      .returning("*");

    return item;
  }

  async toggleChecklistItem(
    input: ToggleChecklistItem,
    user_id?: string,
  ): Promise<ChecklistItemResponse | undefined> {
    const { id, card_id } = input;

    // Get current state
    const currentItem = await this.knex(table).where({ id, card_id }).first();

    if (!currentItem) {
      return undefined;
    }

    const newCompleted = !currentItem.completed;

    const updateData: Record<string, any> = {
      completed: newCompleted,
      updated_at: this.knex.fn.now(),
    };

    if (newCompleted) {
      updateData.completed_at = this.knex.fn.now();
      updateData.completed_by = user_id || null;
    } else {
      updateData.completed_at = null;
      updateData.completed_by = null;
    }

    const [item] = await this.knex(table)
      .update(updateData)
      .where({ id, card_id })
      .returning("*");

    return item;
  }

  async deleteChecklistItem(input: DeleteChecklistItem): Promise<boolean> {
    const { id, card_id } = input;

    const deleted = await this.knex(table).where({ id, card_id }).delete();

    return deleted > 0;
  }

  async getChecklistItemById(
    id: string,
    card_id: string,
  ): Promise<ChecklistItemResponse | undefined> {
    const item = await this.knex(table).where({ id, card_id }).first();

    return item;
  }

  async getChecklistItemsByCardId(
    card_id: string,
  ): Promise<ChecklistItemResponseArray> {
    const items = await this.knex(table)
      .where({ card_id })
      .orderBy("order", "asc")
      .select("*");

    return items;
  }

  async getChecklistProgress(card_id: string): Promise<ChecklistProgress> {
    const result = await this.knex(table)
      .where({ card_id })
      .select(
        this.knex.raw("COUNT(*)::int as total"),
        this.knex.raw(
          "COUNT(*) FILTER (WHERE completed = true)::int as completed",
        ),
      )
      .first();

    const total = result?.total || 0;
    const completed = result?.completed || 0;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      percentage,
    };
  }

  async getChecklistWithProgress(
    card_id: string,
  ): Promise<ChecklistWithProgress> {
    const items = await this.getChecklistItemsByCardId(card_id);
    const progress = await this.getChecklistProgress(card_id);

    return {
      items,
      progress,
    };
  }

  async reorderChecklistItems(
    card_id: string,
    itemOrders: Array<{ id: string; order: number }>,
  ): Promise<void> {
    await this.knex.transaction(async (trx) => {
      for (const item of itemOrders) {
        await trx(table)
          .where({ id: item.id, card_id })
          .update({ order: item.order, updated_at: this.knex.fn.now() });
      }
    });
  }
}
