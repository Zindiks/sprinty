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
          Type.Literal("comment"),
          Type.Literal("all"),
        ])
      ),
      limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100 })),
      // New filter parameters for Phase 2
      assignee_id: Type.Optional(Type.String({ format: "uuid" })),
      label_id: Type.Optional(Type.String({ format: "uuid" })),
      date_from: Type.Optional(Type.String({ format: "date-time" })),
      date_to: Type.Optional(Type.String({ format: "date-time" })),
      include_archived: Type.Optional(Type.Boolean()),
    },
    { $id: "SearchQuerySchema" }
  );

  // Individual result schemas
  static BoardResultSchema = Type.Object(
    {
      id,
      title: Type.String(),
      description: Type.Optional(Type.String()),
      organization_id: Type.String({ format: "uuid" }),
      created_at,
      updated_at,
      result_type: Type.Literal("board"),
    },
    { $id: "BoardResultSchema" }
  );

  static ListResultSchema = Type.Object(
    {
      id,
      title: Type.String(),
      board_id: Type.String({ format: "uuid" }),
      board_title: Type.String(),
      order: Type.Number(),
      created_at,
      updated_at,
      result_type: Type.Literal("list"),
    },
    { $id: "ListResultSchema" }
  );

  static CardResultSchema = Type.Object(
    {
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
    },
    { $id: "CardResultSchema" }
  );

  static CommentResultSchema = Type.Object(
    {
      id,
      content: Type.String(),
      card_id: Type.String({ format: "uuid" }),
      card_title: Type.String(),
      list_id: Type.String({ format: "uuid" }),
      list_title: Type.String(),
      board_id: Type.String({ format: "uuid" }),
      board_title: Type.String(),
      user_id: Type.String({ format: "uuid" }),
      user_email: Type.String(),
      created_at,
      updated_at,
      result_type: Type.Literal("comment"),
    },
    { $id: "CommentResultSchema" }
  );

  // Combined search response schema
  static SearchResponseSchema = Type.Object(
    {
      query: Type.String(),
      total: Type.Number(),
      results: Type.Object({
        boards: Type.Array(SearchSchema.BoardResultSchema),
        lists: Type.Array(SearchSchema.ListResultSchema),
        cards: Type.Array(SearchSchema.CardResultSchema),
        comments: Type.Array(SearchSchema.CommentResultSchema),
      }),
    },
    { $id: "SearchResponseSchema" }
  );
}

export type SearchQuery = Static<typeof SearchSchema.SearchQuerySchema>;
export type BoardResult = Static<typeof SearchSchema.BoardResultSchema>;
export type ListResult = Static<typeof SearchSchema.ListResultSchema>;
export type CardResult = Static<typeof SearchSchema.CardResultSchema>;
export type CommentResult = Static<typeof SearchSchema.CommentResultSchema>;
export type SearchResponse = Static<typeof SearchSchema.SearchResponseSchema>;
