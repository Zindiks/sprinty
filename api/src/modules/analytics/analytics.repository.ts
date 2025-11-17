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
        this.on("cards.sprint_id", "=", "sprints.id").andOnVal(
          "cards.status",
          "=",
          "completed"
        );
      })
      .where("sprints.board_id", boardId)
      .groupBy("sprints.id", "sprints.name", "sprints.start_date", "sprints.end_date", "sprints.status")
      .orderBy("sprints.start_date", "desc");
  }

  /**
   * Get detailed due date analytics for a board
   */
  async getDueDateAnalytics(boardId: string) {
    const now = this.knex.raw("NOW()");

    // Get overdue cards count
    const overdueCards = await this.knex("cards")
      .join("lists", "cards.list_id", "lists.id")
      .where("lists.board_id", boardId)
      .whereNotNull("cards.due_date")
      .where("cards.due_date", "<", now)
      .whereNot("cards.status", "completed")
      .count("* as count")
      .first();

    // Get cards due today
    const dueToday = await this.knex("cards")
      .join("lists", "cards.list_id", "lists.id")
      .where("lists.board_id", boardId)
      .whereNotNull("cards.due_date")
      .whereRaw("DATE(cards.due_date) = CURRENT_DATE")
      .whereNot("cards.status", "completed")
      .count("* as count")
      .first();

    // Get cards due this week
    const dueThisWeek = await this.knex("cards")
      .join("lists", "cards.list_id", "lists.id")
      .where("lists.board_id", boardId)
      .whereNotNull("cards.due_date")
      .where("cards.due_date", ">=", now)
      .where("cards.due_date", "<=", this.knex.raw("NOW() + INTERVAL '7 days'"))
      .whereNot("cards.status", "completed")
      .count("* as count")
      .first();

    // Get upcoming cards (beyond this week)
    const upcoming = await this.knex("cards")
      .join("lists", "cards.list_id", "lists.id")
      .where("lists.board_id", boardId)
      .whereNotNull("cards.due_date")
      .where("cards.due_date", ">", this.knex.raw("NOW() + INTERVAL '7 days'"))
      .whereNot("cards.status", "completed")
      .count("* as count")
      .first();

    // Get cards with no due date
    const noDueDate = await this.knex("cards")
      .join("lists", "cards.list_id", "lists.id")
      .where("lists.board_id", boardId)
      .whereNull("cards.due_date")
      .whereNot("cards.status", "completed")
      .count("* as count")
      .first();

    // Get breakdown by priority
    const byPriority = await this.knex("cards")
      .join("lists", "cards.list_id", "lists.id")
      .where("lists.board_id", boardId)
      .whereNotNull("cards.due_date")
      .where("cards.due_date", "<", now)
      .whereNot("cards.status", "completed")
      .select("cards.priority")
      .count("* as count")
      .groupBy("cards.priority");

    // Get overdue cards list
    const overdueCardsList = await this.knex("cards")
      .select(
        "cards.id",
        "cards.title",
        "cards.due_date",
        "cards.priority",
        "cards.status",
        "lists.id as list_id",
        "lists.title as list_title"
      )
      .join("lists", "cards.list_id", "lists.id")
      .where("lists.board_id", boardId)
      .whereNotNull("cards.due_date")
      .where("cards.due_date", "<", now)
      .whereNot("cards.status", "completed")
      .orderBy("cards.due_date", "asc")
      .limit(20);

    // Get cards due today list
    const dueTodayList = await this.knex("cards")
      .select(
        "cards.id",
        "cards.title",
        "cards.due_date",
        "cards.priority",
        "cards.status",
        "lists.id as list_id",
        "lists.title as list_title"
      )
      .join("lists", "cards.list_id", "lists.id")
      .where("lists.board_id", boardId)
      .whereNotNull("cards.due_date")
      .whereRaw("DATE(cards.due_date) = CURRENT_DATE")
      .whereNot("cards.status", "completed")
      .orderBy("cards.due_date", "asc")
      .limit(20);

    return {
      summary: {
        overdue: parseInt(overdueCards?.count as string) || 0,
        dueToday: parseInt(dueToday?.count as string) || 0,
        dueThisWeek: parseInt(dueThisWeek?.count as string) || 0,
        upcoming: parseInt(upcoming?.count as string) || 0,
        noDueDate: parseInt(noDueDate?.count as string) || 0,
      },
      byPriority: {
        critical: byPriority.find((p) => p.priority === "critical")
          ? parseInt(byPriority.find((p) => p.priority === "critical")!.count as string)
          : 0,
        high: byPriority.find((p) => p.priority === "high")
          ? parseInt(byPriority.find((p) => p.priority === "high")!.count as string)
          : 0,
        medium: byPriority.find((p) => p.priority === "medium")
          ? parseInt(byPriority.find((p) => p.priority === "medium")!.count as string)
          : 0,
        low: byPriority.find((p) => p.priority === "low")
          ? parseInt(byPriority.find((p) => p.priority === "low")!.count as string)
          : 0,
      },
      overdueCards: overdueCardsList,
      dueTodayCards: dueTodayList,
    };
  }

  /**
   * Get productivity trends (cards created vs completed over time)
   */
  async getProductivityTrends(
    userId: string,
    organizationId: string,
    period: "weekly" | "monthly",
    daysBack: number = 90
  ) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    // Get cards created over time
    const cardsCreated = await this.knex("cards")
      .join("lists", "cards.list_id", "lists.id")
      .join("boards", "lists.board_id", "boards.id")
      .join("card_assignees", "cards.id", "card_assignees.card_id")
      .where("card_assignees.user_id", userId)
      .where("boards.organization_id", organizationId)
      .where("cards.created_at", ">=", startDate.toISOString())
      .select(
        this.knex.raw("DATE(cards.created_at) as date"),
        this.knex.raw("COUNT(*) as count")
      )
      .groupBy(this.knex.raw("DATE(cards.created_at)"))
      .orderBy("date", "asc");

    // Get cards completed over time (using card_activities)
    const cardsCompleted = await this.knex("card_activities")
      .join("cards", "card_activities.card_id", "cards.id")
      .join("lists", "cards.list_id", "lists.id")
      .join("boards", "lists.board_id", "boards.id")
      .join("card_assignees", "cards.id", "card_assignees.card_id")
      .where("card_assignees.user_id", userId)
      .where("boards.organization_id", organizationId)
      .where("card_activities.action_type", "updated")
      .whereRaw("card_activities.metadata->>'status' = 'completed'")
      .where("card_activities.created_at", ">=", startDate.toISOString())
      .select(
        this.knex.raw("DATE(card_activities.created_at) as date"),
        this.knex.raw("COUNT(*) as count")
      )
      .groupBy(this.knex.raw("DATE(card_activities.created_at)"))
      .orderBy("date", "asc");

    // Merge data by date
    const dataMap = new Map<string, { date: string; cardsCreated: number; cardsCompleted: number }>();

    cardsCreated.forEach((row: any) => {
      const date = row.date;
      dataMap.set(date, {
        date,
        cardsCreated: parseInt(row.count as string),
        cardsCompleted: 0,
      });
    });

    cardsCompleted.forEach((row: any) => {
      const date = row.date;
      const existing = dataMap.get(date) || { date, cardsCreated: 0, cardsCompleted: 0 };
      existing.cardsCompleted = parseInt(row.count as string);
      dataMap.set(date, existing);
    });

    const data = Array.from(dataMap.values()).map((item) => ({
      ...item,
      netChange: item.cardsCreated - item.cardsCompleted,
    }));

    // Calculate summary
    const totalCreated = data.reduce((sum, item) => sum + item.cardsCreated, 0);
    const totalCompleted = data.reduce((sum, item) => sum + item.cardsCompleted, 0);
    const averagePerPeriod = data.length > 0 ? totalCompleted / data.length : 0;

    // Determine trend (simple linear regression slope)
    let trend: "increasing" | "decreasing" | "stable" = "stable";
    if (data.length > 1) {
      const recentHalf = data.slice(Math.floor(data.length / 2));
      const recentAvg = recentHalf.reduce((sum, item) => sum + item.cardsCompleted, 0) / recentHalf.length;
      const earlierHalf = data.slice(0, Math.floor(data.length / 2));
      const earlierAvg = earlierHalf.reduce((sum, item) => sum + item.cardsCompleted, 0) / earlierHalf.length;

      if (recentAvg > earlierAvg * 1.1) trend = "increasing";
      else if (recentAvg < earlierAvg * 0.9) trend = "decreasing";
    }

    return {
      period,
      data,
      summary: {
        totalCreated,
        totalCompleted,
        averagePerPeriod: Math.round(averagePerPeriod * 100) / 100,
        trend,
      },
    };
  }

  /**
   * Get boards overview for a user
   */
  async getBoardsOverview(userId: string, organizationId: string) {
    // Get all boards where user has assigned cards
    const boards = await this.knex("boards")
      .distinct("boards.id", "boards.title", "boards.organization_id")
      .join("lists", "boards.id", "lists.board_id")
      .join("cards", "lists.id", "cards.list_id")
      .join("card_assignees", "cards.id", "card_assignees.card_id")
      .where("card_assignees.user_id", userId)
      .where("boards.organization_id", organizationId);

    // For each board, get statistics
    const boardOverviews = await Promise.all(
      boards.map(async (board) => {
        const [totalCards, completedCards, inProgressCards, overdueCards, lastActivity, assignedToMeCount] = await Promise.all([
          // Total cards
          this.knex("cards")
            .join("lists", "cards.list_id", "lists.id")
            .where("lists.board_id", board.id)
            .count("* as count")
            .first(),

          // Completed cards
          this.knex("cards")
            .join("lists", "cards.list_id", "lists.id")
            .where("lists.board_id", board.id)
            .where("cards.status", "completed")
            .count("* as count")
            .first(),

          // In progress cards
          this.knex("cards")
            .join("lists", "cards.list_id", "lists.id")
            .where("lists.board_id", board.id)
            .where("cards.status", "in_progress")
            .count("* as count")
            .first(),

          // Overdue cards
          this.knex("cards")
            .join("lists", "cards.list_id", "lists.id")
            .where("lists.board_id", board.id)
            .whereNotNull("cards.due_date")
            .where("cards.due_date", "<", this.knex.raw("NOW()"))
            .whereNot("cards.status", "completed")
            .count("* as count")
            .first(),

          // Last activity
          this.knex("card_activities")
            .join("cards", "card_activities.card_id", "cards.id")
            .join("lists", "cards.list_id", "lists.id")
            .where("lists.board_id", board.id)
            .orderBy("card_activities.created_at", "desc")
            .select("card_activities.created_at")
            .first(),

          // Cards assigned to me
          this.knex("cards")
            .join("lists", "cards.list_id", "lists.id")
            .join("card_assignees", "cards.id", "card_assignees.card_id")
            .where("lists.board_id", board.id)
            .where("card_assignees.user_id", userId)
            .count("* as count")
            .first(),
        ]);

        const total = parseInt(totalCards?.count as string) || 0;
        const completed = parseInt(completedCards?.count as string) || 0;
        const completionRate = total > 0 ? (completed / total) * 100 : 0;

        return {
          id: board.id,
          title: board.title,
          organization_id: board.organization_id,
          totalCards: total,
          completedCards: completed,
          inProgressCards: parseInt(inProgressCards?.count as string) || 0,
          overdueCards: parseInt(overdueCards?.count as string) || 0,
          completionRate: Math.round(completionRate * 100) / 100,
          lastActivity: lastActivity?.created_at || null,
          assignedToMeCount: parseInt(assignedToMeCount?.count as string) || 0,
        };
      })
    );

    return boardOverviews;
  }

  /**
   * Get weekly metrics for a user
   */
  async getWeeklyMetrics(userId: string, organizationId: string, weeksBack: number = 4) {
    const metrics = [];

    for (let i = 0; i < weeksBack; i++) {
      const weekEnd = new Date();
      weekEnd.setDate(weekEnd.getDate() - (i * 7));
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekStart.getDate() - 6);

      // Cards created this week
      const cardsCreated = await this.knex("cards")
        .join("lists", "cards.list_id", "lists.id")
        .join("boards", "lists.board_id", "boards.id")
        .join("card_assignees", "cards.id", "card_assignees.card_id")
        .where("card_assignees.user_id", userId)
        .where("boards.organization_id", organizationId)
        .whereBetween("cards.created_at", [weekStart.toISOString(), weekEnd.toISOString()])
        .count("* as count")
        .first();

      // Cards completed this week
      const cardsCompleted = await this.knex("card_activities")
        .join("cards", "card_activities.card_id", "cards.id")
        .join("lists", "cards.list_id", "lists.id")
        .join("boards", "lists.board_id", "boards.id")
        .join("card_assignees", "cards.id", "card_assignees.card_id")
        .where("card_assignees.user_id", userId)
        .where("boards.organization_id", organizationId)
        .where("card_activities.action_type", "updated")
        .whereRaw("card_activities.metadata->>'status' = 'completed'")
        .whereBetween("card_activities.created_at", [weekStart.toISOString(), weekEnd.toISOString()])
        .count("* as count")
        .first();

      // Time spent this week
      const timeSpent = await this.knex("time_logs")
        .join("cards", "time_logs.card_id", "cards.id")
        .join("lists", "cards.list_id", "lists.id")
        .join("boards", "lists.board_id", "boards.id")
        .where("time_logs.user_id", userId)
        .where("boards.organization_id", organizationId)
        .whereBetween("time_logs.logged_at", [weekStart.toISOString(), weekEnd.toISOString()])
        .sum("time_logs.duration_minutes as total_minutes")
        .first();

      // Top boards this week
      const topBoards = await this.knex("cards")
        .join("lists", "cards.list_id", "lists.id")
        .join("boards", "lists.board_id", "boards.id")
        .join("card_assignees", "cards.id", "card_assignees.card_id")
        .join("card_activities", "cards.id", "card_activities.card_id")
        .where("card_assignees.user_id", userId)
        .where("boards.organization_id", organizationId)
        .where("card_activities.action_type", "updated")
        .whereRaw("card_activities.metadata->>'status' = 'completed'")
        .whereBetween("card_activities.created_at", [weekStart.toISOString(), weekEnd.toISOString()])
        .select("boards.id as board_id", "boards.title as board_title")
        .count("* as cards_completed")
        .groupBy("boards.id", "boards.title")
        .orderBy("cards_completed", "desc")
        .limit(3);

      const created = parseInt(cardsCreated?.count as string) || 0;
      const completed = parseInt(cardsCompleted?.count as string) || 0;
      const completionRate = created > 0 ? (completed / created) * 100 : 0;
      const totalMinutes = parseInt(timeSpent?.total_minutes as string) || 0;

      metrics.push({
        weekStartDate: weekStart.toISOString().split("T")[0],
        weekEndDate: weekEnd.toISOString().split("T")[0],
        cardsCreated: created,
        cardsCompleted: completed,
        timeSpentHours: Math.round((totalMinutes / 60) * 100) / 100,
        completionRate: Math.round(completionRate * 100) / 100,
        topBoards: topBoards.map((board) => ({
          boardId: board.board_id,
          boardTitle: board.board_title,
          cardsCompleted: parseInt(board.cards_completed as string),
        })),
      });
    }

    return metrics.reverse(); // Return oldest to newest
  }

  /**
   * Get monthly metrics for a user
   */
  async getMonthlyMetrics(userId: string, organizationId: string, monthsBack: number = 6) {
    const metrics = [];

    for (let i = 0; i < monthsBack; i++) {
      const monthEnd = new Date();
      monthEnd.setMonth(monthEnd.getMonth() - i);
      monthEnd.setDate(1);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      monthEnd.setDate(0); // Last day of month

      const monthStart = new Date(monthEnd);
      monthStart.setDate(1);

      const month = monthStart.toISOString().split("T")[0].substring(0, 7); // YYYY-MM
      const monthName = monthStart.toLocaleString("default", { month: "long", year: "numeric" });

      // Cards created this month
      const cardsCreated = await this.knex("cards")
        .join("lists", "cards.list_id", "lists.id")
        .join("boards", "lists.board_id", "boards.id")
        .join("card_assignees", "cards.id", "card_assignees.card_id")
        .where("card_assignees.user_id", userId)
        .where("boards.organization_id", organizationId)
        .whereBetween("cards.created_at", [monthStart.toISOString(), monthEnd.toISOString()])
        .count("* as count")
        .first();

      // Cards completed this month
      const cardsCompleted = await this.knex("card_activities")
        .join("cards", "card_activities.card_id", "cards.id")
        .join("lists", "cards.list_id", "lists.id")
        .join("boards", "lists.board_id", "boards.id")
        .join("card_assignees", "cards.id", "card_assignees.card_id")
        .where("card_assignees.user_id", userId)
        .where("boards.organization_id", organizationId)
        .where("card_activities.action_type", "updated")
        .whereRaw("card_activities.metadata->>'status' = 'completed'")
        .whereBetween("card_activities.created_at", [monthStart.toISOString(), monthEnd.toISOString()])
        .count("* as count")
        .first();

      // Time spent this month
      const timeSpent = await this.knex("time_logs")
        .join("cards", "time_logs.card_id", "cards.id")
        .join("lists", "cards.list_id", "lists.id")
        .join("boards", "lists.board_id", "boards.id")
        .where("time_logs.user_id", userId)
        .where("boards.organization_id", organizationId)
        .whereBetween("time_logs.logged_at", [monthStart.toISOString(), monthEnd.toISOString()])
        .sum("time_logs.duration_minutes as total_minutes")
        .first();

      // Weekly breakdown
      const weeklyBreakdown = [];
      const weeksInMonth = Math.ceil((monthEnd.getTime() - monthStart.getTime()) / (7 * 24 * 60 * 60 * 1000));

      for (let week = 0; week < weeksInMonth; week++) {
        const weekStartDate = new Date(monthStart);
        weekStartDate.setDate(monthStart.getDate() + (week * 7));
        const weekEndDate = new Date(weekStartDate);
        weekEndDate.setDate(weekEndDate.getDate() + 6);
        if (weekEndDate > monthEnd) weekEndDate.setTime(monthEnd.getTime());

        const weekCompleted = await this.knex("card_activities")
          .join("cards", "card_activities.card_id", "cards.id")
          .join("lists", "cards.list_id", "lists.id")
          .join("boards", "lists.board_id", "boards.id")
          .join("card_assignees", "cards.id", "card_assignees.card_id")
          .where("card_assignees.user_id", userId)
          .where("boards.organization_id", organizationId)
          .where("card_activities.action_type", "updated")
          .whereRaw("card_activities.metadata->>'status' = 'completed'")
          .whereBetween("card_activities.created_at", [weekStartDate.toISOString(), weekEndDate.toISOString()])
          .count("* as count")
          .first();

        const weekTime = await this.knex("time_logs")
          .join("cards", "time_logs.card_id", "cards.id")
          .join("lists", "cards.list_id", "lists.id")
          .join("boards", "lists.board_id", "boards.id")
          .where("time_logs.user_id", userId)
          .where("boards.organization_id", organizationId)
          .whereBetween("time_logs.logged_at", [weekStartDate.toISOString(), weekEndDate.toISOString()])
          .sum("time_logs.duration_minutes as total_minutes")
          .first();

        weeklyBreakdown.push({
          weekNumber: week + 1,
          cardsCompleted: parseInt(weekCompleted?.count as string) || 0,
          timeSpentHours: Math.round(((parseInt(weekTime?.total_minutes as string) || 0) / 60) * 100) / 100,
        });
      }

      // Top boards this month
      const topBoards = await this.knex("cards")
        .join("lists", "cards.list_id", "lists.id")
        .join("boards", "lists.board_id", "boards.id")
        .join("card_assignees", "cards.id", "card_assignees.card_id")
        .join("card_activities", "cards.id", "card_activities.card_id")
        .leftJoin("time_logs", "cards.id", "time_logs.card_id")
        .where("card_assignees.user_id", userId)
        .where("boards.organization_id", organizationId)
        .where("card_activities.action_type", "updated")
        .whereRaw("card_activities.metadata->>'status' = 'completed'")
        .whereBetween("card_activities.created_at", [monthStart.toISOString(), monthEnd.toISOString()])
        .select("boards.id as board_id", "boards.title as board_title")
        .count("cards.id as cards_completed")
        .sum("time_logs.duration_minutes as total_minutes")
        .groupBy("boards.id", "boards.title")
        .orderBy("cards_completed", "desc")
        .limit(5);

      const created = parseInt(cardsCreated?.count as string) || 0;
      const completed = parseInt(cardsCompleted?.count as string) || 0;
      const completionRate = created > 0 ? (completed / created) * 100 : 0;
      const totalMinutes = parseInt(timeSpent?.total_minutes as string) || 0;

      metrics.push({
        month,
        monthName,
        cardsCreated: created,
        cardsCompleted: completed,
        timeSpentHours: Math.round((totalMinutes / 60) * 100) / 100,
        completionRate: Math.round(completionRate * 100) / 100,
        weeklyBreakdown,
        topBoards: topBoards.map((board) => ({
          boardId: board.board_id,
          boardTitle: board.board_title,
          cardsCompleted: parseInt(board.cards_completed as string),
          timeSpentHours: Math.round(((parseInt(board.total_minutes as string) || 0) / 60) * 100) / 100,
        })),
      });
    }

    return metrics.reverse(); // Return oldest to newest
  }
}
