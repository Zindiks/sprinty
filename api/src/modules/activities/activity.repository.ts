import { Knex } from "knex";
import {
  CreateActivity,
  ActivityResponse,
  ActivityWithUserResponse,
  ActivityListResponse,
  ActivityQueryParams,
  ActivityStatsResponse,
} from "./activity.schema";
import knexInstance from "../../db/knexInstance";

const table = "card_activities";

export class ActivityRepository {
  private readonly knex: Knex;

  constructor() {
    this.knex = knexInstance;
  }

  async createActivity(input: CreateActivity): Promise<ActivityResponse> {
    const { card_id, user_id, action_type, metadata } = input;

    const [activity] = await this.knex(table)
      .insert({
        card_id,
        user_id,
        action_type,
        metadata: metadata ? JSON.stringify(metadata) : null,
      })
      .returning("*");

    return {
      ...activity,
      metadata: activity.metadata ? JSON.parse(activity.metadata) : null,
    };
  }

  async getActivityById(id: string): Promise<ActivityResponse | undefined> {
    const activity = await this.knex(table).where({ id }).first("*");

    if (!activity) return undefined;

    return {
      ...activity,
      metadata: activity.metadata ? JSON.parse(activity.metadata) : null,
    };
  }

  async getActivityWithUser(
    id: string,
  ): Promise<ActivityWithUserResponse | undefined> {
    const activity = await this.knex(table)
      .where({ "card_activities.id": id })
      .join("users", "card_activities.user_id", "users.id")
      .leftJoin("profiles", "users.id", "profiles.user_id")
      .select(
        "card_activities.*",
        this.knex.raw(`
          json_build_object(
            'id', users.id,
            'email', users.email,
            'username', profiles.username
          ) as user
        `),
      )
      .first();

    if (!activity) return undefined;

    return {
      ...activity,
      metadata: activity.metadata ? JSON.parse(activity.metadata) : null,
    };
  }

  async getActivitiesByCardId(
    card_id: string,
    params?: ActivityQueryParams,
  ): Promise<ActivityListResponse> {
    const limit = params?.limit || 50;
    const offset = params?.offset || 0;

    let query = this.knex(table)
      .where({ "card_activities.card_id": card_id })
      .join("users", "card_activities.user_id", "users.id")
      .leftJoin("profiles", "users.id", "profiles.user_id")
      .select(
        "card_activities.*",
        this.knex.raw(`
          json_build_object(
            'id', users.id,
            'email', users.email,
            'username', profiles.username
          ) as user
        `),
      );

    if (params?.action_type) {
      query = query.where({ "card_activities.action_type": params.action_type });
    }

    if (params?.user_id) {
      query = query.where({ "card_activities.user_id": params.user_id });
    }

    const activities = await query
      .orderBy("card_activities.created_at", "desc")
      .limit(limit)
      .offset(offset);

    return activities.map((activity) => ({
      ...activity,
      metadata: activity.metadata ? JSON.parse(activity.metadata) : null,
    }));
  }

  async getActivitiesByUserId(
    user_id: string,
    params?: ActivityQueryParams,
  ): Promise<ActivityListResponse> {
    const limit = params?.limit || 50;
    const offset = params?.offset || 0;

    let query = this.knex(table)
      .where({ "card_activities.user_id": user_id })
      .join("users", "card_activities.user_id", "users.id")
      .leftJoin("profiles", "users.id", "profiles.user_id")
      .select(
        "card_activities.*",
        this.knex.raw(`
          json_build_object(
            'id', users.id,
            'email', users.email,
            'username', profiles.username
          ) as user
        `),
      );

    if (params?.card_id) {
      query = query.where({ "card_activities.card_id": params.card_id });
    }

    if (params?.action_type) {
      query = query.where({ "card_activities.action_type": params.action_type });
    }

    const activities = await query
      .orderBy("card_activities.created_at", "desc")
      .limit(limit)
      .offset(offset);

    return activities.map((activity) => ({
      ...activity,
      metadata: activity.metadata ? JSON.parse(activity.metadata) : null,
    }));
  }

  async getActivities(
    params: ActivityQueryParams,
  ): Promise<ActivityListResponse> {
    const limit = params.limit || 50;
    const offset = params.offset || 0;

    let query = this.knex(table)
      .join("users", "card_activities.user_id", "users.id")
      .leftJoin("profiles", "users.id", "profiles.user_id")
      .select(
        "card_activities.*",
        this.knex.raw(`
          json_build_object(
            'id', users.id,
            'email', users.email,
            'username', profiles.username
          ) as user
        `),
      );

    if (params.card_id) {
      query = query.where({ "card_activities.card_id": params.card_id });
    }

    if (params.user_id) {
      query = query.where({ "card_activities.user_id": params.user_id });
    }

    if (params.action_type) {
      query = query.where({ "card_activities.action_type": params.action_type });
    }

    const activities = await query
      .orderBy("card_activities.created_at", "desc")
      .limit(limit)
      .offset(offset);

    return activities.map((activity) => ({
      ...activity,
      metadata: activity.metadata ? JSON.parse(activity.metadata) : null,
    }));
  }

  async getActivityStats(
    card_id: string,
  ): Promise<ActivityStatsResponse> {
    // Get total count
    const totalResult = await this.knex(table)
      .where({ card_id })
      .count("id as count")
      .first();

    const total = Number(totalResult?.count) || 0;

    // Get counts by action type
    const typeCountsResult = await this.knex(table)
      .where({ card_id })
      .select("action_type")
      .count("id as count")
      .groupBy("action_type");

    const activities_by_type: Record<string, number> = {};
    typeCountsResult.forEach((row) => {
      activities_by_type[row.action_type] = Number(row.count);
    });

    // Get most recent activity
    const recentActivity = await this.knex(table)
      .where({ "card_activities.card_id": card_id })
      .join("users", "card_activities.user_id", "users.id")
      .leftJoin("profiles", "users.id", "profiles.user_id")
      .select(
        "card_activities.*",
        this.knex.raw(`
          json_build_object(
            'id', users.id,
            'email', users.email,
            'username', profiles.username
          ) as user
        `),
      )
      .orderBy("card_activities.created_at", "desc")
      .first();

    return {
      card_id,
      total_activities: total,
      activities_by_type,
      recent_activity: recentActivity
        ? {
            ...recentActivity,
            metadata: recentActivity.metadata
              ? JSON.parse(recentActivity.metadata)
              : null,
          }
        : undefined,
    };
  }

  async deleteActivitiesByCardId(card_id: string): Promise<number> {
    return await this.knex(table).where({ card_id }).del();
  }
}
