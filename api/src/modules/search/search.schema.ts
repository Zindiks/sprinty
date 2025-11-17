import { Type, Static } from "@sinclair/typebox";

const id = Type.String({ format: "uuid" });
const created_at = Type.String({ format: "date-time" });
const updated_at = Type.String({ format: "date-time" });

export class SearchSchema {
  // Query parameters schema
  static SearchQuerySchema = Type.Object(
    {
      query: Type.String({ minLength: 1, maxLength: 100 }),
      organization_id: Type.String({ format: "uuid" }),
      board_id: Type.Optional(Type.String({ format: "uuid" })),
      type: Type.Optional(
        Type.Union([
          Type.Literal("board"),
          Type.Literal("list"),
          Type.Literal("card"),
          Type.Literal("all"),
        ]),
      ),
      limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100 })),
    },
    { $id: "SearchQuerySchema" },
  );

  // Individual result schemas
  static BoardResultSchema = Type.Object({
    id,
    title: Type.String(),
    description: Type.Optional(Type.String()),
    organization_id: Type.String({ format: "uuid" }),
    created_at,
    updated_at,
    result_type: Type.Literal("board"),
  });

  static ListResultSchema = Type.Object({
    id,
    title: Type.String(),
    board_id: Type.String({ format: "uuid" }),
    board_title: Type.String(),
    order: Type.Number(),
    created_at,
    updated_at,
    result_type: Type.Literal("list"),
  });

  static CardResultSchema = Type.Object({
    id,
    title: Type.String(),
    description: Type.Optional(Type.String()),
    status: Type.Optional(Type.String()),
    list_id: Type.String({ format: "uuid" }),
    list_title: Type.String(),
    board_id: Type.String({ format: "uuid" }),
    board_title: Type.String(),
    order: Type.Number(),
    created_at,
    updated_at,
    result_type: Type.Literal("card"),
  });

  // Combined search response schema
  static SearchResponseSchema = Type.Object(
    {
      query: Type.String(),
      total: Type.Number(),
      results: Type.Object({
        boards: Type.Array(SearchSchema.BoardResultSchema),
        lists: Type.Array(SearchSchema.ListResultSchema),
        cards: Type.Array(SearchSchema.CardResultSchema),
      }),
    },
    { $id: "SearchResponseSchema" },
  );
}

export type SearchQuery = Static<typeof SearchSchema.SearchQuerySchema>;
export type BoardResult = Static<typeof SearchSchema.BoardResultSchema>;
export type ListResult = Static<typeof SearchSchema.ListResultSchema>;
export type CardResult = Static<typeof SearchSchema.CardResultSchema>;
export type SearchResponse = Static<typeof SearchSchema.SearchResponseSchema>;
