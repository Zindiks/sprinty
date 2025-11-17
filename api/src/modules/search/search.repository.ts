import { Knex } from "knex";
import knexInstance from "../../db/knexInstance";
import {
  BoardResult,
  ListResult,
  CardResult,
  SearchQuery,
} from "./search.schema";

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
    limit: number = 50,
  ): Promise<BoardResult[]> {
    const searchPattern = `%${query}%`;

    const results = await this.knex("boards")
      .where({ organization_id })
      .andWhere((builder) => {
        builder
          .whereRaw("LOWER(title) LIKE LOWER(?)", [searchPattern])
          .orWhereRaw("LOWER(description) LIKE LOWER(?)", [searchPattern]);
      })
      .select(
        "id",
        "title",
        "description",
        "organization_id",
        "created_at",
        "updated_at",
      )
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
    limit: number = 50,
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
        "lists.updated_at",
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
   */
  async searchCards(
    query: string,
    organization_id: string,
    board_id?: string,
    limit: number = 50,
  ): Promise<CardResult[]> {
    const searchPattern = `%${query}%`;

    const queryBuilder = this.knex("cards")
      .join("lists", "cards.list_id", "lists.id")
      .join("boards", "lists.board_id", "boards.id")
      .where({ "boards.organization_id": organization_id })
      .andWhere((builder) => {
        builder
          .whereRaw("LOWER(cards.title) LIKE LOWER(?)", [searchPattern])
          .orWhereRaw("LOWER(cards.description) LIKE LOWER(?)", [
            searchPattern,
          ]);
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
        "cards.updated_at",
      )
      .orderBy("cards.created_at", "desc")
      .limit(limit);

    if (board_id) {
      queryBuilder.where({ "lists.board_id": board_id });
    }

    const results = await queryBuilder;

    return results.map((result) => ({
      ...result,
      result_type: "card" as const,
    }));
  }

  /**
   * Search across all entities (boards, lists, cards)
   */
  async searchAll(params: SearchQuery): Promise<{
    boards: BoardResult[];
    lists: ListResult[];
    cards: CardResult[];
  }> {
    const { query, organization_id, board_id, limit = 50 } = params;
    const itemLimit = Math.floor(limit / 3); // Distribute limit across entity types

    const [boards, lists, cards] = await Promise.all([
      this.searchBoards(query, organization_id, itemLimit),
      this.searchLists(query, organization_id, board_id, itemLimit),
      this.searchCards(query, organization_id, board_id, itemLimit),
    ]);

    return { boards, lists, cards };
  }
}
