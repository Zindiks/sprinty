import { Knex } from "knex";

export interface DashboardLayout {
  id: string;
  user_id: string;
  name: string;
  widgets: any[]; // Will be WidgetConfig[] on the frontend
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateDashboardLayoutInput {
  user_id: string;
  name: string;
  widgets: any[];
  is_default?: boolean;
}

export interface UpdateDashboardLayoutInput {
  name?: string;
  widgets?: any[];
  is_default?: boolean;
}

export class DashboardLayoutsRepository {
  constructor(private knex: Knex) {}

  /**
   * Get all dashboard layouts for a user
   */
  async getUserLayouts(userId: string): Promise<DashboardLayout[]> {
    return this.knex("dashboard_layouts")
      .where("user_id", userId)
      .orderBy("is_default", "desc")
      .orderBy("created_at", "desc");
  }

  /**
   * Get a specific layout by ID
   */
  async getLayoutById(layoutId: string, userId: string): Promise<DashboardLayout | undefined> {
    return this.knex("dashboard_layouts")
      .where("id", layoutId)
      .where("user_id", userId)
      .first();
  }

  /**
   * Get the default layout for a user
   */
  async getDefaultLayout(userId: string): Promise<DashboardLayout | undefined> {
    return this.knex("dashboard_layouts")
      .where("user_id", userId)
      .where("is_default", true)
      .first();
  }

  /**
   * Create a new dashboard layout
   */
  async createLayout(input: CreateDashboardLayoutInput): Promise<DashboardLayout> {
    // If this layout is being set as default, unset any existing default
    if (input.is_default) {
      await this.knex("dashboard_layouts")
        .where("user_id", input.user_id)
        .where("is_default", true)
        .update({ is_default: false, updated_at: this.knex.fn.now() });
    }

    const [layout] = await this.knex("dashboard_layouts")
      .insert({
        user_id: input.user_id,
        name: input.name,
        widgets: JSON.stringify(input.widgets),
        is_default: input.is_default ?? false,
      })
      .returning("*");

    return layout;
  }

  /**
   * Update an existing dashboard layout
   */
  async updateLayout(
    layoutId: string,
    userId: string,
    input: UpdateDashboardLayoutInput
  ): Promise<DashboardLayout | undefined> {
    // If this layout is being set as default, unset any existing default
    if (input.is_default) {
      await this.knex("dashboard_layouts")
        .where("user_id", userId)
        .where("is_default", true)
        .whereNot("id", layoutId)
        .update({ is_default: false, updated_at: this.knex.fn.now() });
    }

    const updateData: any = {
      updated_at: this.knex.fn.now(),
    };

    if (input.name !== undefined) updateData.name = input.name;
    if (input.widgets !== undefined) updateData.widgets = JSON.stringify(input.widgets);
    if (input.is_default !== undefined) updateData.is_default = input.is_default;

    const [layout] = await this.knex("dashboard_layouts")
      .where("id", layoutId)
      .where("user_id", userId)
      .update(updateData)
      .returning("*");

    return layout;
  }

  /**
   * Delete a dashboard layout
   */
  async deleteLayout(layoutId: string, userId: string): Promise<boolean> {
    const deletedCount = await this.knex("dashboard_layouts")
      .where("id", layoutId)
      .where("user_id", userId)
      .delete();

    return deletedCount > 0;
  }

  /**
   * Check if a layout exists and belongs to the user
   */
  async layoutExists(layoutId: string, userId: string): Promise<boolean> {
    const layout = await this.knex("dashboard_layouts")
      .where("id", layoutId)
      .where("user_id", userId)
      .first();

    return !!layout;
  }
}
