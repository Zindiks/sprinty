import { Type, Static } from "@sinclair/typebox";

const id = Type.String({ format: "uuid" });
const organization_id = Type.String({ format: "uuid" });
const board_id = Type.String({ format: "uuid" });
const created_by = Type.String({ format: "uuid" });
const created_at = Type.String({ format: "date-time" });
const updated_at = Type.String({ format: "date-time" });

const name = Type.String({ minLength: 3, maxLength: 50 });
const description = Type.Optional(Type.String({ maxLength: 200 }));
const category = Type.String({ minLength: 3, maxLength: 30 });
const icon = Type.Optional(Type.String({ maxLength: 20 }));
const is_system = Type.Boolean();

// Template structure schemas
const TemplateCardSchema = Type.Object({
  title: Type.String({ minLength: 1, maxLength: 100 }),
  description: Type.Optional(Type.String({ maxLength: 500 })),
});

const TemplateListSchema = Type.Object({
  title: Type.String({ minLength: 1, maxLength: 50 }),
  order: Type.Integer({ minimum: 0 }),
  exampleCards: Type.Optional(Type.Array(TemplateCardSchema)),
});

const TemplateStructureSchema = Type.Object({
  lists: Type.Array(TemplateListSchema),
});

export class TemplateSchema {
  static BaseTemplateSchema = Type.Object(
    {
      name,
      description,
      category,
      icon,
      structure: TemplateStructureSchema,
    },
    { $id: "BaseTemplateSchema" },
  );

  static CreateTemplateSchema = Type.Object(
    {
      name,
      description,
      category,
      icon,
      is_system: Type.Optional(is_system),
      organization_id: Type.Optional(organization_id),
      created_by: Type.Optional(created_by),
      structure: TemplateStructureSchema,
    },
    { $id: "CreateTemplateSchema" },
  );

  static UpdateTemplateSchema = Type.Object(
    {
      name: Type.Optional(name),
      description,
      icon,
      structure: Type.Optional(TemplateStructureSchema),
    },
    { $id: "UpdateTemplateSchema" },
  );

  static DeleteTemplateSchema = Type.Object(
    {
      id,
    },
    { $id: "DeleteTemplateSchema" },
  );

  // Response schema (used for single template responses)
  static TemplateResponseSchema = Type.Object(
    {
      id,
      name,
      description,
      category,
      icon,
      is_system,
      organization_id: Type.Union([organization_id, Type.Null()]),
      created_by: Type.Union([created_by, Type.Null()]),
      structure: TemplateStructureSchema,
      created_at,
      updated_at,
    },
    { $id: "TemplateResponseSchema" },
  );

  // Templates collection response (uses direct reference to avoid duplicate registration)
  static TemplatesCollectionSchema = Type.Object(
    {
      system: Type.Array(
        Type.Object({
          id,
          name,
          description,
          category,
          icon,
          is_system,
          organization_id: Type.Union([organization_id, Type.Null()]),
          created_by: Type.Union([created_by, Type.Null()]),
          structure: TemplateStructureSchema,
          created_at,
          updated_at,
        })
      ),
      custom: Type.Array(
        Type.Object({
          id,
          name,
          description,
          category,
          icon,
          is_system,
          organization_id: Type.Union([organization_id, Type.Null()]),
          created_by: Type.Union([created_by, Type.Null()]),
          structure: TemplateStructureSchema,
          created_at,
          updated_at,
        })
      ),
    },
    { $id: "TemplatesCollectionSchema" },
  );

  // Create board from template schema
  static CreateBoardFromTemplateSchema = Type.Object(
    {
      template_id: id,
      organization_id,
      board_title: Type.Optional(Type.String({ minLength: 3, maxLength: 50 })),
      include_example_cards: Type.Boolean(),
    },
    { $id: "CreateBoardFromTemplateSchema" },
  );

  // Create template from board schema
  static CreateTemplateFromBoardSchema = Type.Object(
    {
      board_id,
      template_name: name,
      description,
      category,
      icon,
      include_cards_as_examples: Type.Boolean(),
    },
    { $id: "CreateTemplateFromBoardSchema" },
  );
}

// Type exports
export type TemplateCard = Static<typeof TemplateCardSchema>;
export type TemplateList = Static<typeof TemplateListSchema>;
export type TemplateStructure = Static<typeof TemplateStructureSchema>;

export type BaseTemplate = Static<typeof TemplateSchema.BaseTemplateSchema>;
export type CreateTemplate = Static<typeof TemplateSchema.CreateTemplateSchema>;
export type UpdateTemplate = Static<typeof TemplateSchema.UpdateTemplateSchema>;
export type DeleteTemplate = Static<typeof TemplateSchema.DeleteTemplateSchema>;
export type TemplateResponse = Static<typeof TemplateSchema.TemplateResponseSchema>;
export type TemplatesCollection = Static<typeof TemplateSchema.TemplatesCollectionSchema>;
export type CreateBoardFromTemplate = Static<typeof TemplateSchema.CreateBoardFromTemplateSchema>;
export type CreateTemplateFromBoard = Static<typeof TemplateSchema.CreateTemplateFromBoardSchema>;
