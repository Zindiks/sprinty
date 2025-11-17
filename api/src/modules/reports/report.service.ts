import { Knex } from "knex";

export class ReportService {
  constructor(private knex: Knex) {}

  /**
   * Generate CSV content from array of objects
   */
  private generateCSV(data: any[], headers: string[]): string {
    if (data.length === 0) {
      return headers.join(",");
    }

    const csvRows = [];
    csvRows.push(headers.join(","));

    for (const row of data) {
      const values = headers.map((header) => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma
        if (value === null || value === undefined) {
          return "";
        }
        const escaped = String(value).replace(/"/g, '""');
        return escaped.includes(",") ? `"${escaped}"` : escaped;
      });
      csvRows.push(values.join(","));
    }

    return csvRows.join("\n");
  }

  /**
   * Generate board analytics report (CSV)
   */
  async generateBoardReport(boardId: string): Promise<string> {
    const cards = await this.knex("cards")
      .select(
        "cards.id",
        "cards.title",
        "cards.description",
        "cards.status",
        "cards.priority",
        "cards.due_date",
        "cards.created_at",
        "cards.updated_at",
        "lists.title as list_title"
      )
      .join("lists", "cards.list_id", "lists.id")
      .where("lists.board_id", boardId)
      .orderBy("cards.created_at", "desc");

    const headers = [
      "id",
      "title",
      "description",
      "status",
      "priority",
      "due_date",
      "list_title",
      "created_at",
      "updated_at",
    ];

    return this.generateCSV(cards, headers);
  }

  /**
   * Generate time tracking report (CSV)
   */
  async generateTimeTrackingReport(
    boardId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<string> {
    let query = this.knex("time_logs")
      .select(
        "time_logs.id",
        "time_logs.duration_minutes",
        "time_logs.description",
        "time_logs.logged_at",
        "cards.title as card_title",
        "users.oauth_provider_id as user_email",
        "lists.title as list_title"
      )
      .join("cards", "time_logs.card_id", "cards.id")
      .join("lists", "cards.list_id", "lists.id")
      .join("users", "time_logs.user_id", "users.id")
      .where("lists.board_id", boardId);

    if (startDate) {
      query = query.where("time_logs.logged_at", ">=", startDate);
    }
    if (endDate) {
      query = query.where("time_logs.logged_at", "<=", endDate);
    }

    const timeLogs = await query.orderBy("time_logs.logged_at", "desc");

    const headers = [
      "id",
      "card_title",
      "user_email",
      "list_title",
      "duration_minutes",
      "description",
      "logged_at",
    ];

    return this.generateCSV(timeLogs, headers);
  }

  /**
   * Generate sprint report (CSV)
   */
  async generateSprintReport(sprintId: string): Promise<string> {
    const cards = await this.knex("cards")
      .select(
        "cards.id",
        "cards.title",
        "cards.description",
        "cards.status",
        "cards.priority",
        "cards.due_date",
        "cards.created_at",
        "cards.updated_at",
        "lists.title as list_title"
      )
      .join("lists", "cards.list_id", "lists.id")
      .where("cards.sprint_id", sprintId)
      .orderBy("cards.status", "asc")
      .orderBy("cards.priority", "desc");

    const headers = [
      "id",
      "title",
      "description",
      "status",
      "priority",
      "due_date",
      "list_title",
      "created_at",
      "updated_at",
    ];

    return this.generateCSV(cards, headers);
  }

  /**
   * Generate user activity report (CSV)
   */
  async generateUserActivityReport(
    userId: string,
    organizationId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<string> {
    let query = this.knex("card_activities")
      .select(
        "card_activities.id",
        "card_activities.action_type",
        "card_activities.created_at",
        "cards.title as card_title",
        "lists.title as list_title",
        "boards.title as board_title"
      )
      .join("cards", "card_activities.card_id", "cards.id")
      .join("lists", "cards.list_id", "lists.id")
      .join("boards", "lists.board_id", "boards.id")
      .where("card_activities.user_id", userId)
      .where("boards.organization_id", organizationId);

    if (startDate) {
      query = query.where("card_activities.created_at", ">=", startDate);
    }
    if (endDate) {
      query = query.where("card_activities.created_at", "<=", endDate);
    }

    const activities = await query.orderBy("card_activities.created_at", "desc");

    const headers = [
      "id",
      "action_type",
      "card_title",
      "list_title",
      "board_title",
      "created_at",
    ];

    return this.generateCSV(activities, headers);
  }
}
