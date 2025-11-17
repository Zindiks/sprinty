import { Knex } from "knex";
import {
  CreateCard,
  UpdateCardOrderArray,
  UpdateCardTitle,
  UpdateCardDetails,
  DeleteCard,
  FullCardResponse,
  FullCardResponseArray,
  CardWithAssigneesResponse,
} from "./card.schema";
import knexInstance from "../../db/knexInstance";

const table = "cards";

export class CardRepository {
  private readonly knex: Knex;

  constructor() {
    this.knex = knexInstance;
  }

  async getCardById(id: string): Promise<FullCardResponse | undefined> {
    const [data] = await this.knex(table).where({ id }).select("*");
    return data;
  }

  async getCardWithAssignees(
    id: string,
  ): Promise<CardWithAssigneesResponse | undefined> {
    const card = await this.getCardById(id);
    if (!card) {
      return undefined;
    }

    const assignees = await this.knex("card_assignees")
      .where({ "card_assignees.card_id": id })
      .join("users", "card_assignees.user_id", "users.id")
      .leftJoin("profiles", "users.id", "profiles.user_id")
      .select(
        "card_assignees.id",
        "card_assignees.card_id",
        "card_assignees.user_id",
        "card_assignees.assigned_at",
        "card_assignees.assigned_by",
        this.knex.raw(`
          json_build_object(
            'id', users.id,
            'email', users.email,
            'username', profiles.username
          ) as user
        `),
      )
      .orderBy("card_assignees.assigned_at", "asc");

    return {
      ...card,
      assignees: assignees || [],
    };
  }

  async getCardsByListId(list_id: string): Promise<FullCardResponseArray> {
    const data = await this.knex(table)
      .where({ list_id })
      .orderBy("order", "asc")
      .select("*");
    return data;
  }

  async create(input: CreateCard): Promise<FullCardResponse> {
    const { list_id, title, description, status, due_date, priority } = input;

    const lastCard = await this.knex(table)
      .where({ list_id })
      .orderBy("order", "desc")
      .select("order")
      .first();

    const order = lastCard ? lastCard.order + 1 : 0;

    const [card] = await this.knex(table)
      .insert({
        list_id,
        title,
        description,
        status,
        due_date,
        priority: priority || "medium",
        order
      })
      .returning("*");

    return card;
  }

  async updateTitle(
    input: UpdateCardTitle,
  ): Promise<FullCardResponse | undefined> {
    const { id, list_id, title } = input;

    const [card] = await this.knex(table)
      .update({ title, updated_at: this.knex.fn.now() })
      .where({ id, list_id })
      .returning("*");

    return card;
  }

  async updateDetails(
    input: UpdateCardDetails,
  ): Promise<FullCardResponse | undefined> {
    const { id, list_id, ...updates } = input;

    // Filter out undefined values
    const updateData: Record<string, any> = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.due_date !== undefined) updateData.due_date = updates.due_date;
    if (updates.priority !== undefined) updateData.priority = updates.priority;

    updateData.updated_at = this.knex.fn.now();

    const [card] = await this.knex(table)
      .update(updateData)
      .where({ id, list_id })
      .returning("*");

    return card;
  }

  async updateOrder(input: UpdateCardOrderArray) {
    await this.knex.transaction(async (trx) => {
      for (const card of input) {
        await trx(table)
          .where({
            id: card.id,
          })
          .update({
            order: card.order,
            list_id: card.list_id,
          });
      }
    });
  }

  async deleteCard(input: DeleteCard) {
    const { id, list_id } = input;

    const [deleted] = await this.knex(table)
      .where({ id, list_id })
      .delete()
      .returning("id");

    if (!deleted) {
      throw new Error("Card not found");
    }

    const cards: UpdateCardOrderArray = await this.knex(table)
      .select("order", "id", "list_id")
      .where({ list_id })
      .orderBy("order", "asc");

    for (let i = 0; i < cards.length; i++) {
      cards[i].order = i;
    }

    await this.updateOrder(cards);

    return deleted;
  }
}
