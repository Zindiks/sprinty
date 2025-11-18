import { SearchService } from "../modules/search/search.service";
import { SearchRepository } from "../modules/search/search.repository";
import { SearchQuery } from "../modules/search/search.schema";

jest.mock("../modules/search/search.repository");

const MockedSearchRepository = SearchRepository as jest.Mock<SearchRepository>;

describe("SearchService", () => {
  let searchService: SearchService;
  let searchRepository: jest.Mocked<SearchRepository>;

  beforeEach(() => {
    searchRepository =
      new MockedSearchRepository() as jest.Mocked<SearchRepository>;
    searchService = new SearchService();
    // @ts-expect-error - inject mocked repository
    searchService["searchRepository"] = searchRepository;
  });

  describe("search", () => {
    const mockBoards = [
      {
        id: "board-1",
        title: "Test Board",
        description: "Test Description",
        organization_id: "org-1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        result_type: "board" as const,
      },
    ];

    const mockLists = [
      {
        id: "list-1",
        title: "Test List",
        board_id: "board-1",
        board_title: "Test Board",
        order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        result_type: "list" as const,
      },
    ];

    const mockCards = [
      {
        id: "card-1",
        title: "Test Card",
        description: "Card description",
        status: "active",
        list_id: "list-1",
        list_title: "Test List",
        board_id: "board-1",
        board_title: "Test Board",
        order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        result_type: "card" as const,
      },
    ];

    it("should search all entity types when type is 'all'", async () => {
      const params: SearchQuery = {
        query: "test",
        organization_id: "org-1",
        type: "all",
        limit: 50,
      };

      searchRepository.searchAll.mockResolvedValue({
        boards: mockBoards,
        lists: mockLists,
        cards: mockCards,
        comments: [],
      });

      const result = await searchService.search(params);

      expect(result).toEqual({
        query: "test",
        total: 3,
        results: {
          boards: mockBoards,
          lists: mockLists,
          cards: mockCards,
          comments: [],
        },
      });
      expect(searchRepository.searchAll).toHaveBeenCalledWith(params);
    });

    it("should search only boards when type is 'board'", async () => {
      const params: SearchQuery = {
        query: "test",
        organization_id: "org-1",
        type: "board",
        limit: 50,
      };

      searchRepository.searchBoards.mockResolvedValue(mockBoards);

      const result = await searchService.search(params);

      expect(result).toEqual({
        query: "test",
        total: 1,
        results: {
          boards: mockBoards,
          lists: [],
          cards: [],
          comments: [],
        },
      });
      expect(searchRepository.searchBoards).toHaveBeenCalledWith(
        "test",
        "org-1",
        50,
      );
    });

    it("should search only lists when type is 'list'", async () => {
      const params: SearchQuery = {
        query: "test",
        organization_id: "org-1",
        type: "list",
        limit: 50,
      };

      searchRepository.searchLists.mockResolvedValue(mockLists);

      const result = await searchService.search(params);

      expect(result).toEqual({
        query: "test",
        total: 1,
        results: {
          boards: [],
          lists: mockLists,
          cards: [],
          comments: [],
        },
      });
      expect(searchRepository.searchLists).toHaveBeenCalledWith(
        "test",
        "org-1",
        undefined,
        50,
      );
    });

    it("should search only cards when type is 'card'", async () => {
      const params: SearchQuery = {
        query: "test",
        organization_id: "org-1",
        type: "card",
        limit: 50,
      };

      searchRepository.searchCards.mockResolvedValue(mockCards);

      const result = await searchService.search(params);

      expect(result).toEqual({
        query: "test",
        total: 1,
        results: {
          boards: [],
          lists: [],
          cards: mockCards,
          comments: [],
        },
      });
      expect(searchRepository.searchCards).toHaveBeenCalledWith(
        "test",
        "org-1",
        undefined,
        50,
        {
          assignee_id: undefined,
          label_id: undefined,
          date_from: undefined,
          date_to: undefined,
          include_archived: undefined,
        },
      );
    });

    it("should search with board_id filter when provided", async () => {
      const params: SearchQuery = {
        query: "test",
        organization_id: "org-1",
        board_id: "board-1",
        type: "list",
        limit: 50,
      };

      searchRepository.searchLists.mockResolvedValue(mockLists);

      const result = await searchService.search(params);

      expect(result).toEqual({
        query: "test",
        total: 1,
        results: {
          boards: [],
          lists: mockLists,
          cards: [],
          comments: [],
        },
      });
      expect(searchRepository.searchLists).toHaveBeenCalledWith(
        "test",
        "org-1",
        "board-1",
        50,
      );
    });

    it("should default to 'all' type when type is not specified", async () => {
      const params: SearchQuery = {
        query: "test",
        organization_id: "org-1",
      };

      searchRepository.searchAll.mockResolvedValue({
        boards: mockBoards,
        lists: [],
        cards: [],
        comments: [],
      });

      const result = await searchService.search(params);

      expect(result.total).toBe(1);
      expect(searchRepository.searchAll).toHaveBeenCalledWith(params);
    });

    it("should calculate total correctly when there are no results", async () => {
      const params: SearchQuery = {
        query: "nonexistent",
        organization_id: "org-1",
        type: "all",
      };

      searchRepository.searchAll.mockResolvedValue({
        boards: [],
        lists: [],
        cards: [],
        comments: [],
      });

      const result = await searchService.search(params);

      expect(result).toEqual({
        query: "nonexistent",
        total: 0,
        results: {
          boards: [],
          lists: [],
          cards: [],
          comments: [],
        },
      });
    });

    it("should handle empty search results for boards", async () => {
      const params: SearchQuery = {
        query: "test",
        organization_id: "org-1",
        type: "board",
      };

      searchRepository.searchBoards.mockResolvedValue([]);

      const result = await searchService.search(params);

      expect(result.total).toBe(0);
      expect(result.results.boards).toEqual([]);
    });

    it("should pass limit parameter correctly", async () => {
      const params: SearchQuery = {
        query: "test",
        organization_id: "org-1",
        type: "board",
        limit: 10,
      };

      searchRepository.searchBoards.mockResolvedValue(mockBoards);

      await searchService.search(params);

      expect(searchRepository.searchBoards).toHaveBeenCalledWith(
        "test",
        "org-1",
        10,
      );
    });
  });
});
