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
  CardWithDetailsResponse,
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
            'email', profiles.email,
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

  async getCardWithDetails(
    id: string,
  ): Promise<CardWithDetailsResponse | undefined> {
    const card = await this.getCardById(id);
    if (!card) {
      return undefined;
    }

    // Get assignees
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
            'email', profiles.email,
            'username', profiles.username
          ) as user
        `),
      )
      .orderBy("card_assignees.assigned_at", "asc");

    // Get labels
    const labels = await this.knex("labels")
      .join("card_labels", "labels.id", "card_labels.label_id")
      .where({ "card_labels.card_id": id })
      .select("labels.*")
      .orderBy("labels.name", "asc");

    // Get checklist items
    const checklistItems = await this.knex("checklist_items")
      .where({ card_id: id })
      .orderBy("order", "asc")
      .select("*");

    // Calculate checklist progress
    const total = checklistItems.length;
    const completed = checklistItems.filter((item) => item.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Get comments with user details
    const comments = await this.knex("comments")
      .where({ "comments.card_id": id })
      .join("users", "comments.user_id", "users.id")
      .leftJoin("profiles", "users.id", "profiles.user_id")
      .select(
        "comments.*",
        this.knex.raw(`
          json_build_object(
            'id', users.id,
            'email', profiles.email,
            'username', profiles.username
          ) as user
        `),
      )
      .orderBy("comments.created_at", "asc");

    // Get attachments with user details
    const attachments = await this.knex("attachments")
      .where({ "attachments.card_id": id })
      .join("users", "attachments.uploaded_by", "users.id")
      .leftJoin("profiles", "users.id", "profiles.user_id")
      .select(
        "attachments.id",
        "attachments.card_id",
        "attachments.filename",
        "attachments.original_filename",
        "attachments.mime_type",
        "attachments.file_size",
        "attachments.uploaded_by",
        "attachments.uploaded_at",
        this.knex.raw(`
          json_build_object(
            'id', users.id,
            'email', profiles.email,
            'username', profiles.username
          ) as user
        `),
      )
      .orderBy("attachments.uploaded_at", "desc");

    // Get activities with user details
    const activities = await this.knex("card_activities")
      .where({ "card_activities.card_id": id })
      .join("users", "card_activities.user_id", "users.id")
      .leftJoin("profiles", "users.id", "profiles.user_id")
      .select(
        "card_activities.*",
        this.knex.raw(`
          json_build_object(
            'id', users.id,
            'email', profiles.email,
            'username', profiles.username
          ) as user
        `),
      )
      .orderBy("card_activities.created_at", "desc")
      .limit(20);

    return {
      ...card,
      assignees: assignees || [],
      labels: labels || [],
      checklist_items: checklistItems || [],
      checklist_progress: {
        total,
        completed,
        percentage,
      },
      comments: comments || [],
      attachments: attachments || [],
      activities: activities.map((activity) => ({
        ...activity,
        metadata: activity.metadata ? JSON.parse(activity.metadata) : null,
      })) || [],
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
