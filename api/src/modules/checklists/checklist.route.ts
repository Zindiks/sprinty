import { FastifyInstance } from "fastify";
import { ChecklistController } from "./checklist.controller";
import { ChecklistSchema } from "./checklist.schema";

const checklistController = new ChecklistController();

export default async function checklistRoutes(fastify: FastifyInstance) {
  // Create checklist item
  fastify.post(
    "/",
    {
      schema: {
        body: ChecklistSchema.CreateChecklistItemSchema,
        response: {
          201: ChecklistSchema.ChecklistItemResponseSchema,
        },
        tags: ["checklist"],
        description: "Create a new checklist item for a card",
      },
    },
    checklistController.createChecklistItemController.bind(checklistController),
  );

  // Update checklist item
  fastify.patch(
    "/",
    {
      schema: {
        body: ChecklistSchema.UpdateChecklistItemSchema,
        response: {
          200: ChecklistSchema.ChecklistItemResponseSchema,
          404: {
            type: "object",
            properties: { message: { type: "string" } },
          },
        },
        tags: ["checklist"],
        description: "Update a checklist item",
      },
    },
    checklistController.updateChecklistItemController.bind(checklistController),
  );

  // Toggle checklist item completion
  fastify.patch(
    "/:id/card/:card_id/toggle",
    {
      schema: {
        params: ChecklistSchema.ToggleChecklistItemSchema,
        response: {
          200: ChecklistSchema.ChecklistItemResponseSchema,
          404: {
            type: "object",
            properties: { message: { type: "string" } },
          },
        },
        tags: ["checklist"],
        description: "Toggle checklist item completion status",
      },
    },
    checklistController.toggleChecklistItemController.bind(checklistController),
  );

  // Delete checklist item
  fastify.delete(
    "/:id/card/:card_id",
    {
      schema: {
        params: ChecklistSchema.DeleteChecklistItemSchema,
        response: {
          200: {
            type: "object",
            properties: { message: { type: "string" } },
          },
          404: {
            type: "object",
            properties: { message: { type: "string" } },
          },
        },
        tags: ["checklist"],
        description: "Delete a checklist item",
      },
    },
    checklistController.deleteChecklistItemController.bind(checklistController),
  );

  // Get checklist item by ID
  fastify.get(
    "/:id/card/:card_id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            card_id: { type: "string", format: "uuid" },
          },
        },
        response: {
          200: ChecklistSchema.ChecklistItemResponseSchema,
          404: {
            type: "object",
            properties: { message: { type: "string" } },
          },
        },
        tags: ["checklist"],
        description: "Get a checklist item by ID",
      },
    },
    checklistController.getChecklistItemController.bind(checklistController),
  );

  // Get all checklist items for a card
  fastify.get(
    "/card/:card_id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            card_id: { type: "string", format: "uuid" },
          },
        },
        response: {
          200: ChecklistSchema.ChecklistItemResponseSchemaArray,
        },
        tags: ["checklist"],
        description: "Get all checklist items for a card",
      },
    },
    checklistController.getChecklistItemsByCardIdController.bind(
      checklistController,
    ),
  );

  // Get checklist progress for a card
  fastify.get(
    "/card/:card_id/progress",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            card_id: { type: "string", format: "uuid" },
          },
        },
        response: {
          200: ChecklistSchema.ChecklistProgressSchema,
        },
        tags: ["checklist"],
        description: "Get checklist progress for a card",
      },
    },
    checklistController.getChecklistProgressController.bind(
      checklistController,
    ),
  );

  // Get checklist with progress for a card
  fastify.get(
    "/card/:card_id/with-progress",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            card_id: { type: "string", format: "uuid" },
          },
        },
        response: {
          200: ChecklistSchema.ChecklistWithProgressSchema,
        },
        tags: ["checklist"],
        description: "Get checklist items with progress for a card",
      },
    },
    checklistController.getChecklistWithProgressController.bind(
      checklistController,
    ),
  );

  // Reorder checklist items
  fastify.put(
    "/card/:card_id/reorder",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            card_id: { type: "string", format: "uuid" },
          },
        },
        body: {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string", format: "uuid" },
                  order: { type: "number" },
                },
                required: ["id", "order"],
              },
            },
          },
          required: ["items"],
        },
        response: {
          200: {
            type: "object",
            properties: { message: { type: "string" } },
          },
        },
        tags: ["checklist"],
        description: "Reorder checklist items",
      },
    },
    checklistController.reorderChecklistItemsController.bind(
      checklistController,
    ),
  );
}
