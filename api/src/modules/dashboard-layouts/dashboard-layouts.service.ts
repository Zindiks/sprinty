import { Knex } from "knex";
import {
  DashboardLayoutsRepository,
  CreateDashboardLayoutInput,
  UpdateDashboardLayoutInput,
} from "./dashboard-layouts.repository";

export class DashboardLayoutsService {
  private repository: DashboardLayoutsRepository;

  constructor(knex: Knex) {
    this.repository = new DashboardLayoutsRepository(knex);
  }

  /**
   * Get all layouts for a user
   */
  async getUserLayouts(userId: string) {
    return this.repository.getUserLayouts(userId);
  }

  /**
   * Get a specific layout by ID
   */
  async getLayoutById(layoutId: string, userId: string) {
    return this.repository.getLayoutById(layoutId, userId);
  }

  /**
   * Get the default layout for a user
   */
  async getDefaultLayout(userId: string) {
    return this.repository.getDefaultLayout(userId);
  }

  /**
   * Create a new dashboard layout
   */
  async createLayout(input: CreateDashboardLayoutInput) {
    return this.repository.createLayout(input);
  }

  /**
   * Update an existing dashboard layout
   */
  async updateLayout(layoutId: string, userId: string, input: UpdateDashboardLayoutInput) {
    return this.repository.updateLayout(layoutId, userId, input);
  }

  /**
   * Delete a dashboard layout
   */
  async deleteLayout(layoutId: string, userId: string) {
    return this.repository.deleteLayout(layoutId, userId);
  }

  /**
   * Check if a layout exists and belongs to the user
   */
  async layoutExists(layoutId: string, userId: string) {
    return this.repository.layoutExists(layoutId, userId);
  }
}
