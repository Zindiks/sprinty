import { Type, Static } from "@sinclair/typebox";

// Widget configuration schema
export const WidgetConfigSchema = Type.Object(
  {
    id: Type.String(),
    type: Type.Union([
      Type.Literal("PERSONAL_STATS"),
      Type.Literal("ASSIGNED_TASKS"),
      Type.Literal("PRODUCTIVITY_TREND"),
      Type.Literal("BOARDS_OVERVIEW"),
      Type.Literal("WEEKLY_COMPLETION"),
      Type.Literal("MONTHLY_COMPLETION"),
      Type.Literal("VELOCITY_CHART"),
      Type.Literal("BURNDOWN_CHART"),
    ]),
    position: Type.Object({
      x: Type.Number(),
      y: Type.Number(),
    }),
    size: Type.Object({
      width: Type.Number(),
      height: Type.Number(),
    }),
    config: Type.Optional(Type.Any()),
  },
  { $id: "WidgetConfigSchema" }
);

// Dashboard layout schema
export const DashboardLayoutSchema = Type.Object(
  {
    id: Type.String({ format: "uuid" }),
    user_id: Type.String({ format: "uuid" }),
    name: Type.String(),
    widgets: Type.Array(WidgetConfigSchema),
    is_default: Type.Boolean(),
    created_at: Type.String(),
    updated_at: Type.String(),
  },
  { $id: "DashboardLayoutSchema" }
);

// Request schemas
export const CreateLayoutBodySchema = Type.Object(
  {
    name: Type.String({ minLength: 1, maxLength: 255 }),
    widgets: Type.Array(WidgetConfigSchema),
    is_default: Type.Optional(Type.Boolean()),
  },
  { $id: "CreateLayoutBodySchema" }
);

export const UpdateLayoutBodySchema = Type.Object(
  {
    name: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
    widgets: Type.Optional(Type.Array(WidgetConfigSchema)),
    is_default: Type.Optional(Type.Boolean()),
  },
  { $id: "UpdateLayoutBodySchema" }
);

export const LayoutIdParamsSchema = Type.Object(
  {
    layoutId: Type.String({ format: "uuid" }),
  },
  { $id: "LayoutIdParamsSchema" }
);

// Response schemas
export const GetLayoutsResponseSchema = Type.Array(DashboardLayoutSchema, {
  $id: "GetLayoutsResponseSchema",
});
// These are just references to DashboardLayoutSchema, no need to register separately
export const GetLayoutResponseSchema = DashboardLayoutSchema;
export const CreateLayoutResponseSchema = DashboardLayoutSchema;
export const UpdateLayoutResponseSchema = DashboardLayoutSchema;
export const DeleteLayoutResponseSchema = Type.Object(
  {
    success: Type.Boolean(),
    message: Type.String(),
  },
  { $id: "DeleteLayoutResponseSchema" }
);

// Type exports
export type WidgetConfig = Static<typeof WidgetConfigSchema>;
export type DashboardLayout = Static<typeof DashboardLayoutSchema>;
export type CreateLayoutBody = Static<typeof CreateLayoutBodySchema>;
export type UpdateLayoutBody = Static<typeof UpdateLayoutBodySchema>;
export type LayoutIdParams = Static<typeof LayoutIdParamsSchema>;
export type GetLayoutsResponse = Static<typeof GetLayoutsResponseSchema>;
export type GetLayoutResponse = Static<typeof GetLayoutResponseSchema>;
export type CreateLayoutResponse = Static<typeof CreateLayoutResponseSchema>;
export type UpdateLayoutResponse = Static<typeof UpdateLayoutResponseSchema>;
export type DeleteLayoutResponse = Static<typeof DeleteLayoutResponseSchema>;

// Schema collection for registration
// Note: GetLayoutResponseSchema, CreateLayoutResponseSchema, and UpdateLayoutResponseSchema
// are just references to DashboardLayoutSchema and don't need separate registration
export const DashboardLayoutsSchema = {
  WidgetConfigSchema,
  DashboardLayoutSchema,
  CreateLayoutBodySchema,
  UpdateLayoutBodySchema,
  LayoutIdParamsSchema,
  GetLayoutsResponseSchema,
  DeleteLayoutResponseSchema,
};
