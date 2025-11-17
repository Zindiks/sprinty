import { SearchRepository } from "./search.repository";
import {
  SearchQuery,
  SearchResponse,
  BoardResult,
  ListResult,
  CardResult,
} from "./search.schema";

export class SearchService {
  private readonly searchRepository: SearchRepository;

  constructor() {
    this.searchRepository = new SearchRepository();
  }

  /**
   * Perform search based on query parameters
   */
  async search(params: SearchQuery): Promise<SearchResponse> {
    const { query, type = "all" } = params;

    let results: {
      boards: BoardResult[];
      lists: ListResult[];
      cards: CardResult[];
    } = {
      boards: [],
      lists: [],
      cards: [],
    };

    // Search based on type parameter
    switch (type) {
      case "board":
        results.boards = await this.searchRepository.searchBoards(
          params.query,
          params.organization_id,
          params.limit,
        );
        break;

      case "list":
        results.lists = await this.searchRepository.searchLists(
          params.query,
          params.organization_id,
          params.board_id,
          params.limit,
        );
        break;

      case "card":
        results.cards = await this.searchRepository.searchCards(
          params.query,
          params.organization_id,
          params.board_id,
          params.limit,
        );
        break;

      case "all":
      default:
        results = await this.searchRepository.searchAll(params);
        break;
    }

    // Calculate total results
    const total =
      results.boards.length + results.lists.length + results.cards.length;

    return {
      query,
      total,
      results,
    };
  }
}
