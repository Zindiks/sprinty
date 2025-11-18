import { Knex } from "knex";
import knexInstance from "../../db/knexInstance";
import { BoardResult, ListResult, CardResult, CommentResult, SearchQuery } from "./search.schema";

export class SearchRepository {
  private readonly knex: Knex;

  constructor() {
    this.knex = knexInstance;
  }

  /**
   * Search boards by title or description
   */
  async searchBoards(
    query: string,
    organization_id: string,
    limit: number = 50
  ): Promise<BoardResult[]> {
    const searchPattern = `%${query}%`;

    const results = await this.knex("boards")
      .where({ organization_id })
      .andWhere((builder) => {
        builder
          .whereRaw("LOWER(title) LIKE LOWER(?)", [searchPattern])
          .orWhereRaw("LOWER(description) LIKE LOWER(?)", [searchPattern]);
      })
      .select("id", "title", "description", "organization_id", "created_at", "updated_at")
      .orderBy("created_at", "desc")
      .limit(limit);

    return results.map((result) => ({
      ...result,
      result_type: "board" as const,
    }));
  }

  /**
   * Search lists by title with board information
   */
  async searchLists(
    query: string,
    organization_id: string,
    board_id?: string,
    limit: number = 50
  ): Promise<ListResult[]> {
    const searchPattern = `%${query}%`;

    const queryBuilder = this.knex("lists")
      .join("boards", "lists.board_id", "boards.id")
      .where({ "boards.organization_id": organization_id })
      .andWhereRaw("LOWER(lists.title) LIKE LOWER(?)", [searchPattern])
      .select(
        "lists.id",
        "lists.title",
        "lists.board_id",
        "boards.title as board_title",
        "lists.order",
        "lists.created_at",
        "lists.updated_at"
      )
      .orderBy("lists.created_at", "desc")
      .limit(limit);

    if (board_id) {
      queryBuilder.where({ "lists.board_id": board_id });
    }

    const results = await queryBuilder;

    return results.map((result) => ({
      ...result,
      result_type: "list" as const,
    }));
  }

  /**
   * Search cards by title or description with list and board information
   * Now supports filtering by assignee, label, and date range
   */
  async searchCards(
    query: string,
    organization_id: string,
    board_id?: string,
    limit: number = 50,
    filters?: {
      assignee_id?: string;
      label_id?: string;
      date_from?: string;
      date_to?: string;
      include_archived?: boolean;
    }
  ): Promise<CardResult[]> {
    const searchPattern = `%${query}%`;

    const queryBuilder = this.knex("cards")
      .join("lists", "cards.list_id", "lists.id")
      .join("boards", "lists.board_id", "boards.id")
      .where({ "boards.organization_id": organization_id })
      .andWhere((builder) => {
        builder
          .whereRaw("LOWER(cards.title) LIKE LOWER(?)", [searchPattern])
          .orWhereRaw("LOWER(cards.description) LIKE LOWER(?)", [searchPattern]);
      })
      .select(
        "cards.id",
        "cards.title",
        "cards.description",
        "cards.status",
        "cards.list_id",
        "lists.title as list_title",
        "lists.board_id",
        "boards.title as board_title",
        "cards.order",
        "cards.created_at",
        "cards.updated_at"
      )
      .orderBy("cards.created_at", "desc")
      .limit(limit);

    if (board_id) {
      queryBuilder.where({ "lists.board_id": board_id });
    }

    // Apply filters
    if (filters) {
      // Filter by assignee
      if (filters.assignee_id) {
        queryBuilder
          .join("card_assignees", "cards.id", "card_assignees.card_id")
          .where({ "card_assignees.user_id": filters.assignee_id });
      }

      // Filter by label
      if (filters.label_id) {
        queryBuilder
          .join("card_labels", "cards.id", "card_labels.card_id")
          .where({ "card_labels.label_id": filters.label_id });
      }

      // Filter by date range
      if (filters.date_from) {
        queryBuilder.where("cards.created_at", ">=", filters.date_from);
      }
      if (filters.date_to) {
        queryBuilder.where("cards.created_at", "<=", filters.date_to);
      }

      // Note: include_archived filter reserved for future implementation
      // when archived_at column is added to cards table
    }

    const results = await queryBuilder;

    return results.map((result) => ({
      ...result,
      result_type: "card" as const,
    }));
  }

  /**
   * Search comments by content with card, list, and board information
   */
  async searchComments(
    query: string,
    organization_id: string,
    board_id?: string,
    limit: number = 50
  ): Promise<CommentResult[]> {
    const searchPattern = `%${query}%`;

    const queryBuilder = this.knex("comments")
      .join("cards", "comments.card_id", "cards.id")
      .join("lists", "cards.list_id", "lists.id")
      .join("boards", "lists.board_id", "boards.id")
      .join("users", "comments.user_id", "users.id")
      .where({ "boards.organization_id": organization_id })
      .andWhereRaw("LOWER(comments.content) LIKE LOWER(?)", [searchPattern])
      .select(
        "comments.id",
        "comments.content",
        "comments.card_id",
        "cards.title as card_title",
        "cards.list_id",
        "lists.title as list_title",
        "lists.board_id",
        "boards.title as board_title",
        "comments.user_id",
        "users.email as user_email",
        "comments.created_at",
        "comments.updated_at"
      )
      .orderBy("comments.created_at", "desc")
      .limit(limit);

    if (board_id) {
      queryBuilder.where({ "lists.board_id": board_id });
    }

    const results = await queryBuilder;

    return results.map((result) => ({
      ...result,
      result_type: "comment" as const,
    }));
  }

  /**
   * Search across all entities (boards, lists, cards, comments)
   */
  async searchAll(params: SearchQuery): Promise<{
    boards: BoardResult[];
    lists: ListResult[];
    cards: CardResult[];
    comments: CommentResult[];
  }> {
    const {
      query,
      organization_id,
      board_id,
      limit = 50,
      assignee_id,
      label_id,
      date_from,
      date_to,
      include_archived,
    } = params;

    // Distribute limit across entity types (4 types now)
    const itemLimit = Math.floor(limit / 4);

    // Build filters object for cards
    const cardFilters = {
      assignee_id,
      label_id,
      date_from,
      date_to,
      include_archived,
    };

    const [boards, lists, cards, comments] = await Promise.all([
      this.searchBoards(query, organization_id, itemLimit),
      this.searchLists(query, organization_id, board_id, itemLimit),
      this.searchCards(query, organization_id, board_id, itemLimit, cardFilters),
      this.searchComments(query, organization_id, board_id, itemLimit),
    ]);

    return { boards, lists, cards, comments };
  }
}
