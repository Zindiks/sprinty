import { Knex } from "knex";
import { AnalyticsRepository } from "./analytics.repository";

export class AnalyticsService {
  private repository: AnalyticsRepository;

  constructor(knex: Knex) {
    this.repository = new AnalyticsRepository(knex);
  }

  /**
   * Get personal dashboard data for a user
   */
  async getPersonalDashboard(userId: string, organizationId: string) {
    const stats = await this.repository.getPersonalStats(userId, organizationId);
    const assignedTasks = await this.repository.getAssignedTasks(
      userId,
      organizationId,
      20
    );

    return {
      stats,
      recentTasks: assignedTasks,
    };
  }

  /**
   * Get comprehensive board analytics
   */
  async getBoardAnalytics(boardId: string) {
    const [stats, activityTimeline, timeTracking] = await Promise.all([
      this.repository.getBoardStats(boardId),
      this.repository.getActivityTimeline(boardId, 50),
      this.repository.getTimeTrackingSummary(boardId),
    ]);

    return {
      stats,
      activityTimeline,
      timeTracking,
    };
  }

  /**
   * Get sprint burndown chart data
   */
  async getSprintBurndown(sprintId: string) {
    return this.repository.getBurndownData(sprintId);
  }

  /**
   * Get velocity metrics for a board
   */
  async getBoardVelocity(boardId: string) {
    return this.repository.getVelocityMetrics(boardId);
  }

  /**
   * Get assigned tasks for a user
   */
  async getUserAssignedTasks(userId: string, organizationId: string) {
    return this.repository.getAssignedTasks(userId, organizationId);
  }

  /**
   * Get due date analytics for a board
   */
  async getDueDateAnalytics(boardId: string) {
    return this.repository.getDueDateAnalytics(boardId);
  }
}
