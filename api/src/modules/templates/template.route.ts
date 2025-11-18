import { FastifyInstance } from "fastify";
import { TemplateSchema } from "./template.schema";
import { TemplateController } from "./template.controller";
import {
  requireOrgMember,
  requireOrgAdmin,
  requireBoardAccess
} from "../../middleware/authorization.middleware";

const templateController = new TemplateController();

export default async function templateRoutes(fastify: FastifyInstance) {
  // Get single template by ID (public for system templates, org check for custom)
  fastify.get(
    "/:id",
    {
      schema: {
        params: { type: "object", properties: { id: { type: "string" } } },
        response: { 200: TemplateSchema.TemplateResponseSchema },
        tags: ["templates"],
        description: "Get a template by ID",
      },
    },
    templateController.getTemplateController.bind(templateController),
  );

  // Get all templates (system + custom for organization)
  fastify.get(
    "/",
    {
      preHandler: [requireOrgMember],
      schema: {
        querystring: {
          type: "object",
          properties: {
            organization_id: { type: "string", format: "uuid" },
          },
        },
        response: { 200: TemplateSchema.TemplatesCollectionSchema },
        tags: ["templates"],
        description:
          "Get all templates (system templates + custom templates for organization)",
      },
    },
    templateController.getAllTemplatesController.bind(templateController),
  );

  // Create a new template
  fastify.post(
    "/",
    {
      preHandler: [requireOrgAdmin],
      schema: {
        body: TemplateSchema.CreateTemplateSchema,
        response: { 201: TemplateSchema.TemplateResponseSchema },
        tags: ["templates"],
        description: "Create a new template",
      },
    },
    templateController.createTemplateController.bind(templateController),
  );

  // Update a template
  fastify.put(
    "/:id",
    {
      preHandler: [requireOrgAdmin],
      schema: {
        params: {
          type: "object",
          properties: { id: { type: "string" } },
        },
        querystring: {
          type: "object",
          properties: {
            organization_id: { type: "string", format: "uuid" },
          },
          required: ["organization_id"],
        },
        body: TemplateSchema.UpdateTemplateSchema,
        response: { 200: TemplateSchema.TemplateResponseSchema },
        tags: ["templates"],
        description: "Update a custom template (requires ownership)",
      },
    },
    templateController.updateTemplateController.bind(templateController),
  );

  // Delete a template
  fastify.delete(
    "/:id",
    {
      preHandler: [requireOrgAdmin],
      schema: {
        params: { type: "object", properties: { id: { type: "string" } } },
        querystring: {
          type: "object",
          properties: {
            organization_id: { type: "string", format: "uuid" },
          },
          required: ["organization_id"],
        },
        response: {
          200: {
            type: "object",
            properties: { id: { type: "string" } },
          },
        },
        tags: ["templates"],
        description: "Delete a custom template (requires ownership)",
      },
    },
    templateController.deleteTemplateController.bind(templateController),
  );

  // Create board from template
  fastify.post(
    "/create-board",
    {
      preHandler: [requireOrgAdmin],
      schema: {
        body: TemplateSchema.CreateBoardFromTemplateSchema,
        response: {
          201: {
            type: "object",
            properties: {
              id: { type: "string" },
              organization_id: { type: "string" },
              title: { type: "string" },
              description: { type: "string" },
              created_at: { type: "string" },
              updated_at: { type: "string" },
            },
          },
        },
        tags: ["templates"],
        description: "Create a board from a template",
      },
    },
    templateController.createBoardFromTemplateController.bind(
      templateController,
    ),
  );

  // Create template from board
  fastify.post(
    "/from-board",
    {
      preHandler: [requireBoardAccess],
      schema: {
        body: TemplateSchema.CreateTemplateFromBoardSchema,
        response: { 201: TemplateSchema.TemplateResponseSchema },
        tags: ["templates"],
        description: "Save a board as a template",
      },
    },
    templateController.createTemplateFromBoardController.bind(
      templateController,
    ),
  );
}
