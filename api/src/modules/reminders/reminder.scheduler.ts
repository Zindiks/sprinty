import * as cron from "node-cron";

import type { FastifyInstance } from "fastify";
import { ReminderService } from "./reminder.service";

export class ReminderScheduler {
  private service: ReminderService;
  private fastify: FastifyInstance;
  private task: cron.ScheduledTask | null = null;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
    this.service = new ReminderService(fastify.knex);
  }

  /**
   * Start the reminder scheduler
   * Runs every 5 minutes to check for due reminders
   */
  start() {
    // Run every 5 minutes: "*/5 * * * *"
    // For testing, you can use "* * * * *" (every minute)
    this.task = cron.schedule("*/5 * * * *", async () => {
      this.fastify.log.info("Running reminder scheduler...");
      await this.processReminders();
    });

    this.fastify.log.info("Reminder scheduler started (runs every 5 minutes)");
  }

  /**
   * Stop the scheduler
   */
  stop() {
    if (this.task) {
      this.task.stop();
      this.fastify.log.info("Reminder scheduler stopped");
    }
  }

  /**
   * Process upcoming reminders
   */
  private async processReminders() {
    try {
      const reminders = await this.service.getUpcomingReminders(100);

      this.fastify.log.info(`Processing ${reminders.length} due reminders...`);

      for (const reminder of reminders) {
        try {
          // Get card and user details
          const card = await this.getCardDetails(reminder.card_id);
          const user = await this.getUserDetails(reminder.user_id);

          if (!card || !user) {
            this.fastify.log.warn(
              `Card or user not found for reminder ${reminder.id}`,
            );
            await this.service.markReminderAsSent(reminder.id);
            continue;
          }

          // Send reminder notification via WebSocket
          await this.sendReminderNotification(reminder, card, user);

          // Mark as sent
          await this.service.markReminderAsSent(reminder.id);

          this.fastify.log.info(
            `Reminder sent for card "${card.title}" to user ${user.email}`,
          );
        } catch (error) {
          this.fastify.log.error(
            { err: error },
            `Failed to process reminder ${reminder.id}:`,
          );
        }
      }
    } catch (error) {
      this.fastify.log.error({ err: error }, "Error in reminder scheduler:");
    }
  }

  /**
   * Get card details from database
   */
  private async getCardDetails(cardId: string) {
    try {
      const card = await this.fastify
        .knex("cards")
        .where({ id: cardId })
        .first();
      return card;
    } catch (error) {
      this.fastify.log.error({ err: error }, `Failed to fetch card ${cardId}:`);
      return null;
    }
  }

  /**
   * Get user details from database
   */
  private async getUserDetails(userId: string) {
    try {
      const user = await this.fastify
        .knex("users")
        .where({ id: userId })
        .first();
      return user;
    } catch (error) {
      this.fastify.log.error({ err: error }, `Failed to fetch user ${userId}:`);
      return null;
    }
  }

  /**
   * Send reminder notification via WebSocket
   */
  private async sendReminderNotification(reminder: any, card: any, user: any) {
    try {
      // Get board_id from the card's list
      const list = await this.fastify
        .knex("lists")
        .where({ id: card.list_id })
        .first();

      if (!list) {
        this.fastify.log.warn(`List not found for card ${card.id}`);
        return;
      }

      const boardId = list.board_id;

      // Emit WebSocket event to the board room
      const io = (this.fastify as any).io;
      if (io) {
        const reminderEvent = {
          type: "REMINDER_DUE",
          data: {
            reminder_id: reminder.id,
            card_id: card.id,
            card_title: card.title,
            due_date: card.due_date,
            reminder_type: reminder.reminder_type,
            board_id: boardId,
            list_id: card.list_id,
          },
          timestamp: new Date().toISOString(),
        };

        // Send to user's personal room
        io.to(`user:${user.id}`).emit("reminder", reminderEvent);

        // Also send to the board room
        io.to(`board:${boardId}`).emit("reminder", reminderEvent);

        this.fastify.log.info(
          `Reminder notification sent via WebSocket for card ${card.id}`,
        );
      } else {
        this.fastify.log.warn("WebSocket server not available");
      }
    } catch (error) {
      this.fastify.log.error(
        { err: error },
        "Failed to send reminder notification:",
      );
    }
  }
}

/**
 * Plugin to register reminder scheduler
 */
export async function registerReminderScheduler(fastify: FastifyInstance) {
  const scheduler = new ReminderScheduler(fastify);

  // Start scheduler when server starts
  fastify.addHook("onReady", async () => {
    scheduler.start();
  });

  // Stop scheduler when server closes
  fastify.addHook("onClose", async () => {
    scheduler.stop();
  });

  // Expose scheduler instance
  fastify.decorate("reminderScheduler", scheduler);
}
