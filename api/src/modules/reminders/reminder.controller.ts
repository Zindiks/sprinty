import type { FastifyRequest, FastifyReply } from "fastify";
import { ReminderService } from "./reminder.service";
import type { CreateReminder, GetCardReminders, DeleteReminder } from "./reminder.schema";

export class ReminderController {
  constructor(private service: ReminderService) {}

  /**
   * POST /reminders
   * Create a new reminder
   */
  async create(request: FastifyRequest<{ Body: CreateReminder }>, reply: FastifyReply) {
    try {
      const reminder = await this.service.createReminder(request.body);
      return reply.code(201).send(reminder);
    } catch (error: any) {
      if (error.message.includes("already exists")) {
        return reply.code(409).send({ message: error.message });
      }
      request.log.error(error);
      return reply.code(500).send({ message: "Failed to create reminder" });
    }
  }

  /**
   * GET /reminders/card/:card_id
   * Get all reminders for a card
   */
  async getCardReminders(
    request: FastifyRequest<{ Params: GetCardReminders }>,
    reply: FastifyReply
  ) {
    try {
      const reminders = await this.service.getCardReminders(request.params.card_id);
      return reply.send(reminders);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ message: "Failed to fetch reminders" });
    }
  }

  /**
   * GET /reminders/user
   * Get all reminders for the current user
   */
  async getUserReminders(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Assuming user ID is available in request context
      // You may need to adjust this based on your auth setup
      const userId = (request as any).user?.id;

      if (!userId) {
        return reply.code(401).send({ message: "Unauthorized" });
      }

      const reminders = await this.service.getUserReminders(userId);
      return reply.send(reminders);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ message: "Failed to fetch reminders" });
    }
  }

  /**
   * DELETE /reminders/:id
   * Delete a reminder
   */
  async delete(request: FastifyRequest<{ Params: DeleteReminder }>, reply: FastifyReply) {
    try {
      await this.service.deleteReminder(request.params.id);
      return reply.code(204).send();
    } catch (error: any) {
      if (error.message.includes("not found")) {
        return reply.code(404).send({ message: error.message });
      }
      request.log.error(error);
      return reply.code(500).send({ message: "Failed to delete reminder" });
    }
  }
}
