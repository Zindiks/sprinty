import { ActivityRepository } from "./activity.repository";
import {
  CreateActivity,
  ActivityResponse,
  ActivityWithUserResponse,
  ActivityListResponse,
  ActivityQueryParams,
  ActivityStatsResponse,
} from "./activity.schema";

export class ActivityService {
  private readonly activityRepository: ActivityRepository;

  constructor() {
    this.activityRepository = new ActivityRepository();
  }

  async logActivity(input: CreateActivity): Promise<ActivityResponse> {
    return this.activityRepository.createActivity(input);
  }

  async getActivityById(id: string): Promise<ActivityResponse | undefined> {
    return this.activityRepository.getActivityById(id);
  }

  async getActivityWithUser(
    id: string,
  ): Promise<ActivityWithUserResponse | undefined> {
    return this.activityRepository.getActivityWithUser(id);
  }

  async getActivitiesByCardId(
    card_id: string,
    params?: ActivityQueryParams,
  ): Promise<ActivityListResponse> {
    return this.activityRepository.getActivitiesByCardId(card_id, params);
  }

  async getActivitiesByUserId(
    user_id: string,
    params?: ActivityQueryParams,
  ): Promise<ActivityListResponse> {
    return this.activityRepository.getActivitiesByUserId(user_id, params);
  }

  async getActivities(
    params: ActivityQueryParams,
  ): Promise<ActivityListResponse> {
    return this.activityRepository.getActivities(params);
  }

  async getActivityStats(card_id: string): Promise<ActivityStatsResponse> {
    return this.activityRepository.getActivityStats(card_id);
  }

  async deleteActivitiesByCardId(card_id: string): Promise<number> {
    return this.activityRepository.deleteActivitiesByCardId(card_id);
  }
}
