import { SearchRepository } from "./search.repository";
import {
  SearchQuery,
  SearchResponse,
  BoardResult,
  ListResult,
  CardResult,
  CommentResult,
} from "./search.schema";

export class SearchService {
  private readonly searchRepository: SearchRepository;

  constructor() {
    this.searchRepository = new SearchRepository();
  }

  /**
   * Perform search based on query parameters
   * Now supports comment search and advanced filters
   */
  async search(params: SearchQuery): Promise<SearchResponse> {
    const { query, type = "all" } = params;

    let results: {
      boards: BoardResult[];
      lists: ListResult[];
      cards: CardResult[];
      comments: CommentResult[];
    } = {
      boards: [],
      lists: [],
      cards: [],
      comments: [],
    };

    // Build filters object for cards
    const cardFilters = {
      assignee_id: params.assignee_id,
      label_id: params.label_id,
      date_from: params.date_from,
      date_to: params.date_to,
      include_archived: params.include_archived,
    };

    // Search based on type parameter
    switch (type) {
      case "board":
        results.boards = await this.searchRepository.searchBoards(
          params.query,
          params.organization_id,
          params.limit
        );
        break;

      case "list":
        results.lists = await this.searchRepository.searchLists(
          params.query,
          params.organization_id,
          params.board_id,
          params.limit
        );
        break;

      case "card":
        results.cards = await this.searchRepository.searchCards(
          params.query,
          params.organization_id,
          params.board_id,
          params.limit,
          cardFilters
        );
        break;

      case "comment":
        results.comments = await this.searchRepository.searchComments(
          params.query,
          params.organization_id,
          params.board_id,
          params.limit
        );
        break;

      case "all":
      default:
        results = await this.searchRepository.searchAll(params);
        break;
    }

    // Calculate total results
    const total =
      results.boards.length + results.lists.length + results.cards.length + results.comments.length;

    return {
      query,
      total,
      results,
    };
  }
}
