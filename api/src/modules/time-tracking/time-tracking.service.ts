import { Knex } from "knex";
import {
  TimeTrackingRepository,
  CreateTimeLogInput,
  UpdateTimeLogInput,
} from "./time-tracking.repository";

export class TimeTrackingService {
  private repository: TimeTrackingRepository;

  constructor(knex: Knex) {
    this.repository = new TimeTrackingRepository(knex);
  }

  async logTime(input: CreateTimeLogInput) {
    return this.repository.createTimeLog(input);
  }

  async getTimeLog(id: string) {
    return this.repository.getTimeLogById(id);
  }

  async getCardTimeLogs(cardId: string) {
    return this.repository.getTimeLogsByCard(cardId);
  }

  async getUserTimeLogs(userId: string, organizationId?: string) {
    return this.repository.getTimeLogsByUser(userId, organizationId);
  }

  async updateTimeLog(input: UpdateTimeLogInput) {
    return this.repository.updateTimeLog(input);
  }

  async deleteTimeLog(id: string) {
    return this.repository.deleteTimeLog(id);
  }

  async getCardTimeTotal(cardId: string) {
    return this.repository.getTotalTimeForCard(cardId);
  }

  async getTimeLogsInDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
    organizationId?: string
  ) {
    return this.repository.getTimeLogsInRange(userId, startDate, endDate, organizationId);
  }
}
