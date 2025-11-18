import type { Knex } from "knex";
import type { Reminder, CreateReminder } from "./reminder.schema";

export class ReminderRepository {
  constructor(private db: Knex) {}

  /**
   * Create a new reminder
   */
  async create(data: CreateReminder): Promise<Reminder> {
    const [reminder] = await this.db("card_reminders")
      .insert({
        card_id: data.card_id,
        user_id: data.user_id,
        reminder_time: data.reminder_time,
        reminder_type: data.reminder_type,
        sent: false,
      })
      .returning("*");

    return reminder;
  }

  /**
   * Get all reminders for a card
   */
  async findByCardId(cardId: string): Promise<Reminder[]> {
    return await this.db("card_reminders")
      .where({ card_id: cardId })
      .orderBy("reminder_time", "asc");
  }

  /**
   * Get all reminders for a user
   */
  async findByUserId(userId: string): Promise<Reminder[]> {
    return await this.db("card_reminders")
      .where({ user_id: userId })
      .orderBy("reminder_time", "asc");
  }

  /**
   * Get a single reminder by ID
   */
  async findById(id: string): Promise<Reminder | undefined> {
    return await this.db("card_reminders").where({ id }).first();
  }

  /**
   * Get upcoming reminders that haven't been sent
   * Used by the scheduler
   */
  async findUpcoming(limit: number = 100): Promise<Reminder[]> {
    const now = new Date().toISOString();

    return await this.db("card_reminders")
      .where("sent", false)
      .where("reminder_time", "<=", now)
      .limit(limit)
      .orderBy("reminder_time", "asc");
  }

  /**
   * Mark a reminder as sent
   */
  async markAsSent(id: string): Promise<void> {
    await this.db("card_reminders").where({ id }).update({ sent: true });
  }

  /**
   * Delete a reminder
   */
  async delete(id: string): Promise<void> {
    await this.db("card_reminders").where({ id }).delete();
  }

  /**
   * Delete all reminders for a card
   */
  async deleteByCardId(cardId: string): Promise<void> {
    await this.db("card_reminders").where({ card_id: cardId }).delete();
  }

  /**
   * Check if a reminder already exists for a card/user/type combination
   */
  async exists(cardId: string, userId: string, reminderType: string): Promise<boolean> {
    const reminder = await this.db("card_reminders")
      .where({
        card_id: cardId,
        user_id: userId,
        reminder_type: reminderType,
        sent: false,
      })
      .first();

    return !!reminder;
  }
}
