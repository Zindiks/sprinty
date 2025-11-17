import { Knex } from "knex";

export interface CreateSprintInput {
  boardId: string;
  name: string;
  goal?: string;
  startDate: Date;
  endDate: Date;
  status?: "planned" | "active" | "completed" | "cancelled";
}

export interface UpdateSprintInput {
  id: string;
  name?: string;
  goal?: string;
  startDate?: Date;
  endDate?: Date;
  status?: "planned" | "active" | "completed" | "cancelled";
}

export class SprintRepository {
  constructor(private knex: Knex) {}

  /**
   * Create a new sprint
   */
  async createSprint(input: CreateSprintInput) {
    const [sprint] = await this.knex("sprints")
      .insert({
        board_id: input.boardId,
        name: input.name,
        goal: input.goal || null,
        start_date: input.startDate,
        end_date: input.endDate,
        status: input.status || "planned",
      })
      .returning("*");

    return sprint;
  }

  /**
   * Get sprint by ID
   */
  async getSprintById(id: string) {
    return this.knex("sprints").where("id", id).first();
  }

  /**
   * Get all sprints for a board
   */
  async getSprintsByBoard(boardId: string) {
    return this.knex("sprints")
      .where("board_id", boardId)
      .orderBy("start_date", "desc");
  }

  /**
   * Get active sprint for a board
   */
  async getActiveSprint(boardId: string) {
    return this.knex("sprints")
      .where("board_id", boardId)
      .where("status", "active")
      .first();
  }

  /**
   * Update a sprint
   */
  async updateSprint(input: UpdateSprintInput) {
    const updateData: any = {};

    if (input.name !== undefined) updateData.name = input.name;
    if (input.goal !== undefined) updateData.goal = input.goal;
    if (input.startDate !== undefined) updateData.start_date = input.startDate;
    if (input.endDate !== undefined) updateData.end_date = input.endDate;
    if (input.status !== undefined) updateData.status = input.status;

    updateData.updated_at = new Date();

    const [sprint] = await this.knex("sprints")
      .where("id", input.id)
      .update(updateData)
      .returning("*");

    return sprint;
  }

  /**
   * Delete a sprint
   */
  async deleteSprint(id: string) {
    return this.knex("sprints").where("id", id).delete();
  }

  /**
   * Get sprint with card count
   */
  async getSprintWithStats(id: string) {
    const sprint = await this.knex("sprints").where("id", id).first();

    if (!sprint) {
      return null;
    }

    const stats = await this.knex("cards")
      .where("sprint_id", id)
      .select(
        this.knex.raw("COUNT(*) as total_cards"),
        this.knex.raw(
          "COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_cards"
        )
      )
      .first();

    return {
      ...sprint,
      totalCards: parseInt(stats?.total_cards as string) || 0,
      completedCards: parseInt(stats?.completed_cards as string) || 0,
    };
  }

  /**
   * Get cards in a sprint
   */
  async getSprintCards(sprintId: string) {
    return this.knex("cards")
      .select(
        "cards.*",
        "lists.title as list_title",
        "lists.id as list_id"
      )
      .join("lists", "cards.list_id", "lists.id")
      .where("cards.sprint_id", sprintId)
      .orderBy("cards.order", "asc");
  }

  /**
   * Add cards to sprint
   */
  async addCardsToSprint(sprintId: string, cardIds: string[]) {
    return this.knex("cards")
      .whereIn("id", cardIds)
      .update({ sprint_id: sprintId });
  }

  /**
   * Remove cards from sprint
   */
  async removeCardsFromSprint(cardIds: string[]) {
    return this.knex("cards")
      .whereIn("id", cardIds)
      .update({ sprint_id: null });
  }
}
