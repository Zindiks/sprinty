import { Knex } from "knex";

export class AnalyticsRepository {
  constructor(private knex: Knex) {}

  /**
   * Get personal dashboard stats for a user
   */
  async getPersonalStats(userId: string, organizationId: string) {
    // Get assigned cards count
    const assignedCards = await this.knex("card_assignees")
      .join("cards", "card_assignees.card_id", "cards.id")
      .join("lists", "cards.list_id", "lists.id")
      .join("boards", "lists.board_id", "boards.id")
      .where("card_assignees.user_id", userId)
      .where("boards.organization_id", organizationId)
      .count("* as count")
      .first();

    // Get completed cards count (assuming completed status in lists)
    const completedCards = await this.knex("card_assignees")
      .join("cards", "card_assignees.card_id", "cards.id")
      .join("lists", "cards.list_id", "lists.id")
      .join("boards", "lists.board_id", "boards.id")
      .where("card_assignees.user_id", userId)
      .where("boards.organization_id", organizationId)
      .where("cards.status", "completed")
      .count("* as count")
      .first();

    // Get cards due soon (within 7 days)
    const dueSoon = await this.knex("card_assignees")
      .join("cards", "card_assignees.card_id", "cards.id")
      .join("lists", "cards.list_id", "lists.id")
      .join("boards", "lists.board_id", "boards.id")
      .where("card_assignees.user_id", userId)
      .where("boards.organization_id", organizationId)
      .whereNotNull("cards.due_date")
      .where("cards.due_date", "<=", this.knex.raw("NOW() + INTERVAL '7 days'"))
      .where("cards.due_date", ">=", this.knex.raw("NOW()"))
      .count("* as count")
      .first();

    // Get overdue cards
    const overdue = await this.knex("card_assignees")
      .join("cards", "card_assignees.card_id", "cards.id")
      .join("lists", "cards.list_id", "lists.id")
      .join("boards", "lists.board_id", "boards.id")
      .where("card_assignees.user_id", userId)
      .where("boards.organization_id", organizationId)
      .whereNotNull("cards.due_date")
      .where("cards.due_date", "<", this.knex.raw("NOW()"))
      .whereNot("cards.status", "completed")
      .count("* as count")
      .first();

    return {
      assignedCards: parseInt(assignedCards?.count as string) || 0,
      completedCards: parseInt(completedCards?.count as string) || 0,
      dueSoon: parseInt(dueSoon?.count as string) || 0,
      overdue: parseInt(overdue?.count as string) || 0,
    };
  }

  /**
   * Get assigned tasks for a user
   */
  async getAssignedTasks(userId: string, organizationId: string, limit = 20) {
    return this.knex("cards")
      .select(
        "cards.id",
        "cards.title",
        "cards.description",
        "cards.status",
        "cards.priority",
        "cards.due_date",
        "lists.title as list_title",
        "boards.id as board_id",
        "boards.title as board_title"
      )
      .join("card_assignees", "cards.id", "card_assignees.card_id")
      .join("lists", "cards.list_id", "lists.id")
      .join("boards", "lists.board_id", "boards.id")
      .where("card_assignees.user_id", userId)
      .where("boards.organization_id", organizationId)
      .orderBy("cards.due_date", "asc")
      .orderBy("cards.priority", "desc")
      .limit(limit);
  }

  /**
   * Get board statistics
   */
  async getBoardStats(boardId: string) {
    // Get cards count by status
    const cardsByStatus = await this.knex("cards")
      .join("lists", "cards.list_id", "lists.id")
      .where("lists.board_id", boardId)
      .select("cards.status")
      .count("* as count")
      .groupBy("cards.status");

    // Get cards count by priority
    const cardsByPriority = await this.knex("cards")
      .join("lists", "cards.list_id", "lists.id")
      .where("lists.board_id", boardId)
      .select("cards.priority")
      .count("* as count")
      .groupBy("cards.priority");

    // Get total cards
    const totalCards = await this.knex("cards")
      .join("lists", "cards.list_id", "lists.id")
      .where("lists.board_id", boardId)
      .count("* as count")
      .first();

    // Get completed cards
    const completedCards = await this.knex("cards")
      .join("lists", "cards.list_id", "lists.id")
      .where("lists.board_id", boardId)
      .where("cards.status", "completed")
      .count("* as count")
      .first();

    // Calculate completion rate
    const total = parseInt(totalCards?.count as string) || 0;
    const completed = parseInt(completedCards?.count as string) || 0;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return {
      totalCards: total,
      completedCards: completed,
      completionRate: Math.round(completionRate * 100) / 100,
      cardsByStatus: cardsByStatus.map((row) => ({
        status: row.status || "no_status",
        count: parseInt(row.count as string),
      })),
      cardsByPriority: cardsByPriority.map((row) => ({
        priority: row.priority,
        count: parseInt(row.count as string),
      })),
    };
  }

  /**
   * Get activity timeline for a board
   */
  async getActivityTimeline(boardId: string, limit = 50) {
    return this.knex("card_activities")
      .select(
        "card_activities.id",
        "card_activities.action_type",
        "card_activities.metadata",
        "card_activities.created_at",
        "cards.title as card_title",
        "users.oauth_provider_id as user_email"
      )
      .join("cards", "card_activities.card_id", "cards.id")
      .join("lists", "cards.list_id", "lists.id")
      .join("users", "card_activities.user_id", "users.id")
      .where("lists.board_id", boardId)
      .orderBy("card_activities.created_at", "desc")
      .limit(limit);
  }

  /**
   * Get time tracking summary for a board
   */
  async getTimeTrackingSummary(boardId: string) {
    const summary = await this.knex("time_logs")
      .join("cards", "time_logs.card_id", "cards.id")
      .join("lists", "cards.list_id", "lists.id")
      .where("lists.board_id", boardId)
      .sum("time_logs.duration_minutes as total_minutes")
      .count("* as log_count")
      .first();

    const byUser = await this.knex("time_logs")
      .join("cards", "time_logs.card_id", "cards.id")
      .join("lists", "cards.list_id", "lists.id")
      .join("users", "time_logs.user_id", "users.id")
      .where("lists.board_id", boardId)
      .select(
        "users.id as user_id",
        "users.oauth_provider_id as user_email"
      )
      .sum("time_logs.duration_minutes as total_minutes")
      .groupBy("users.id", "users.oauth_provider_id");

    return {
      totalMinutes: parseInt(summary?.total_minutes as string) || 0,
      totalHours:
        Math.round(((parseInt(summary?.total_minutes as string) || 0) / 60) * 100) / 100,
      logCount: parseInt(summary?.log_count as string) || 0,
      byUser: byUser.map((row) => ({
        userId: row.user_id,
        userEmail: row.user_email,
        totalMinutes: parseInt(row.total_minutes as string) || 0,
        totalHours:
          Math.round(((parseInt(row.total_minutes as string) || 0) / 60) * 100) / 100,
      })),
    };
  }

  /**
   * Get burndown chart data for a sprint
   */
  async getBurndownData(sprintId: string) {
    // Get sprint details
    const sprint = await this.knex("sprints")
      .where("id", sprintId)
      .first();

    if (!sprint) {
      return null;
    }

    // Get cards in sprint
    const totalCards = await this.knex("cards")
      .where("sprint_id", sprintId)
      .count("* as count")
      .first();

    // Get card completion over time
    const completionTimeline = await this.knex("card_activities")
      .join("cards", "card_activities.card_id", "cards.id")
      .where("cards.sprint_id", sprintId)
      .where("card_activities.action_type", "updated")
      .whereRaw("card_activities.metadata->>'status' = 'completed'")
      .select(
        this.knex.raw("DATE(card_activities.created_at) as date"),
        this.knex.raw("COUNT(*) as completed_count")
      )
      .groupBy(this.knex.raw("DATE(card_activities.created_at)"))
      .orderBy("date", "asc");

    const total = parseInt(totalCards?.count as string) || 0;
    let remainingCards = total;
    const burndownData = [];

    // Generate ideal burndown line
    const startDate = new Date(sprint.start_date);
    const endDate = new Date(sprint.end_date);
    const totalDays =
      Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;
    const idealBurnRate = total / totalDays;

    for (const entry of completionTimeline) {
      remainingCards -= parseInt(entry.completed_count as string);
      burndownData.push({
        date: entry.date,
        remaining: remainingCards,
        completed: total - remainingCards,
      });
    }

    // Generate ideal line data
    const idealLine = [];
    for (let i = 0; i <= totalDays; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      idealLine.push({
        date: date.toISOString().split("T")[0],
        ideal: Math.max(0, total - idealBurnRate * i),
      });
    }

    return {
      sprint: {
        id: sprint.id,
        name: sprint.name,
        startDate: sprint.start_date,
        endDate: sprint.end_date,
        status: sprint.status,
      },
      totalCards: total,
      burndownData,
      idealLine,
    };
  }

  /**
   * Get velocity metrics for a board (cards completed per sprint)
   */
  async getVelocityMetrics(boardId: string) {
    return this.knex("sprints")
      .select(
        "sprints.id",
        "sprints.name",
        "sprints.start_date",
        "sprints.end_date",
        "sprints.status"
      )
      .count("cards.id as cards_completed")
      .leftJoin("cards", function () {
        this.on("cards.sprint_id", "=", "sprints.id").andOn(
          "cards.status",
          "=",
          this.client.raw("?", ["completed"])
        );
      })
      .where("sprints.board_id", boardId)
      .groupBy("sprints.id", "sprints.name", "sprints.start_date", "sprints.end_date", "sprints.status")
      .orderBy("sprints.start_date", "desc");
  }
}
