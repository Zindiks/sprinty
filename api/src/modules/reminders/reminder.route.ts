import type { FastifyInstance } from "fastify";
import { ReminderController } from "./reminder.controller";
import { ReminderService } from "./reminder.service";
import {
  CreateReminderSchema,
  GetCardRemindersSchema,
  DeleteReminderSchema,
} from "./reminder.schema";

async function reminderRoutes(fastify: FastifyInstance) {
  const service = new ReminderService(fastify.knex);
  const controller = new ReminderController(service);

  // Create a new reminder
  fastify.post(
    "/reminders",
    {
      schema: {
        description: "Create a new reminder for a card",
        tags: ["reminders"],
        body: CreateReminderSchema,
        response: {
          201: {
            description: "Reminder created successfully",
          },
          409: {
            description: "Reminder already exists",
          },
        },
      },
    },
    controller.create.bind(controller)
  );

  // Get all reminders for a card
  fastify.get(
    "/reminders/card/:card_id",
    {
      schema: {
        description: "Get all reminders for a specific card",
        tags: ["reminders"],
        params: GetCardRemindersSchema,
        response: {
          200: {
            description: "List of reminders",
          },
        },
      },
    },
    controller.getCardReminders.bind(controller)
  );

  // Get all reminders for the current user
  fastify.get(
    "/reminders/user",
    {
      schema: {
        description: "Get all reminders for the current user",
        tags: ["reminders"],
        response: {
          200: {
            description: "List of user's reminders",
          },
        },
      },
    },
    controller.getUserReminders.bind(controller)
  );

  // Delete a reminder
  fastify.delete(
    "/reminders/:id",
    {
      schema: {
        description: "Delete a reminder",
        tags: ["reminders"],
        params: DeleteReminderSchema,
        response: {
          204: {
            description: "Reminder deleted successfully",
          },
          404: {
            description: "Reminder not found",
          },
        },
      },
    },
    controller.delete.bind(controller)
  );
}

export default reminderRoutes;
