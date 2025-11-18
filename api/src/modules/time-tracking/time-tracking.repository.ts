import { Knex } from "knex";

export interface CreateTimeLogInput {
  cardId: string;
  userId: string;
  durationMinutes: number;
  description?: string;
  loggedAt?: Date;
}

export interface UpdateTimeLogInput {
  id: string;
  durationMinutes?: number;
  description?: string;
}

export class TimeTrackingRepository {
  constructor(private knex: Knex) {}

  /**
   * Create a new time log
   */
  async createTimeLog(input: CreateTimeLogInput) {
    const [timeLog] = await this.knex("time_logs")
      .insert({
        card_id: input.cardId,
        user_id: input.userId,
        duration_minutes: input.durationMinutes,
        description: input.description || null,
        logged_at: input.loggedAt || new Date(),
      })
      .returning("*");

    return timeLog;
  }

  /**
   * Get time log by ID
   */
  async getTimeLogById(id: string) {
    return this.knex("time_logs")
      .select(
        "time_logs.*",
        "cards.title as card_title",
        "users.oauth_provider_id as user_email",
      )
      .leftJoin("cards", "time_logs.card_id", "cards.id")
      .leftJoin("users", "time_logs.user_id", "users.id")
      .where("time_logs.id", id)
      .first();
  }

  /**
   * Get time logs for a card
   */
  async getTimeLogsByCard(cardId: string) {
    return this.knex("time_logs")
      .select("time_logs.*", "users.oauth_provider_id as user_email")
      .leftJoin("users", "time_logs.user_id", "users.id")
      .where("time_logs.card_id", cardId)
      .orderBy("time_logs.logged_at", "desc");
  }

  /**
   * Get time logs for a user
   */
  async getTimeLogsByUser(userId: string, organizationId?: string) {
    const query = this.knex("time_logs")
      .select(
        "time_logs.*",
        "cards.title as card_title",
        "boards.title as board_title",
        "boards.id as board_id",
      )
      .leftJoin("cards", "time_logs.card_id", "cards.id")
      .leftJoin("lists", "cards.list_id", "lists.id")
      .leftJoin("boards", "lists.board_id", "boards.id")
      .where("time_logs.user_id", userId);

    if (organizationId) {
      query.where("boards.organization_id", organizationId);
    }

    return query.orderBy("time_logs.logged_at", "desc");
  }

  /**
   * Update a time log
   */
  async updateTimeLog(input: UpdateTimeLogInput) {
    const updateData: any = {};

    if (input.durationMinutes !== undefined) {
      updateData.duration_minutes = input.durationMinutes;
    }
    if (input.description !== undefined) {
      updateData.description = input.description;
    }

    const [timeLog] = await this.knex("time_logs")
      .where("id", input.id)
      .update(updateData)
      .returning("*");

    return timeLog;
  }

  /**
   * Delete a time log
   */
  async deleteTimeLog(id: string) {
    return this.knex("time_logs").where("id", id).delete();
  }

  /**
   * Get total time logged for a card
   */
  async getTotalTimeForCard(cardId: string) {
    const result = await this.knex("time_logs")
      .where("card_id", cardId)
      .sum("duration_minutes as total_minutes")
      .count("* as log_count")
      .first();

    return {
      totalMinutes: parseInt(result?.total_minutes as string) || 0,
      totalHours:
        Math.round(
          ((parseInt(result?.total_minutes as string) || 0) / 60) * 100,
        ) / 100,
      logCount: parseInt(result?.log_count as string) || 0,
    };
  }

  /**
   * Get time logs within a date range
   */
  async getTimeLogsInRange(
    userId: string,
    startDate: Date,
    endDate: Date,
    organizationId?: string,
  ) {
    const query = this.knex("time_logs")
      .select(
        "time_logs.*",
        "cards.title as card_title",
        "boards.title as board_title",
      )
      .leftJoin("cards", "time_logs.card_id", "cards.id")
      .leftJoin("lists", "cards.list_id", "lists.id")
      .leftJoin("boards", "lists.board_id", "boards.id")
      .where("time_logs.user_id", userId)
      .whereBetween("time_logs.logged_at", [startDate, endDate]);

    if (organizationId) {
      query.where("boards.organization_id", organizationId);
    }

    return query.orderBy("time_logs.logged_at", "desc");
  }
}
