import type { Knex } from "knex";
import { ReminderRepository } from "./reminder.repository";
import type { Reminder, CreateReminder } from "./reminder.schema";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../shared/errors";

export class ReminderService {
  private repository: ReminderRepository;

  constructor(db: Knex) {
    this.repository = new ReminderRepository(db);
  }

  /**
   * Create a new reminder
   */
  async createReminder(data: CreateReminder): Promise<Reminder> {
    // Check if reminder already exists
    const exists = await this.repository.exists(
      data.card_id,
      data.user_id,
      data.reminder_type
    );

    if (exists) {
      throw new ConflictError(
        `A ${data.reminder_type} reminder already exists for this card`
      );
    }

    return await this.repository.create(data);
  }

  /**
   * Get all reminders for a card
   */
  async getCardReminders(cardId: string): Promise<Reminder[]> {
    return await this.repository.findByCardId(cardId);
  }

  /**
   * Get all reminders for a user
   */
  async getUserReminders(userId: string): Promise<Reminder[]> {
    return await this.repository.findByUserId(userId);
  }

  /**
   * Delete a reminder
   */
  async deleteReminder(id: string): Promise<void> {
    const reminder = await this.repository.findById(id);
    if (!reminder) {
      throw new NotFoundError("Reminder not found");
    }

    await this.repository.delete(id);
  }

  /**
   * Get upcoming reminders (for scheduler)
   */
  async getUpcomingReminders(limit?: number): Promise<Reminder[]> {
    return await this.repository.findUpcoming(limit);
  }

  /**
   * Mark reminder as sent (for scheduler)
   */
  async markReminderAsSent(id: string): Promise<void> {
    await this.repository.markAsSent(id);
  }

  /**
   * Calculate reminder time based on due date and type
   */
  calculateReminderTime(dueDate: string, type: "24h" | "1h" | "custom", customTime?: string): string {
    const due = new Date(dueDate);

    if (type === "24h") {
      const reminderTime = new Date(due.getTime() - 24 * 60 * 60 * 1000);
      return reminderTime.toISOString();
    } else if (type === "1h") {
      const reminderTime = new Date(due.getTime() - 60 * 60 * 1000);
      return reminderTime.toISOString();
    } else if (type === "custom" && customTime) {
      return new Date(customTime).toISOString();
    }

    throw new ValidationError("Invalid reminder type or missing custom time");
  }
}
