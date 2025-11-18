import { SearchController } from "../modules/search/search.controller";
import { SearchService } from "../modules/search/search.service";
import { FastifyRequest, FastifyReply } from "fastify";
import { SearchQuery } from "../modules/search/search.schema";

jest.mock("../modules/search/search.service");

const MockedSearchService = SearchService as jest.Mock<SearchService>;

describe("SearchController", () => {
  let searchController: SearchController;
  let searchService: jest.Mocked<SearchService>;
  let mockRequest: Partial<FastifyRequest>;
  let mockReply: Partial<FastifyReply>;

  beforeEach(() => {
    searchService = new MockedSearchService() as jest.Mocked<SearchService>;
    searchController = new SearchController();
    // @ts-ignore
    searchController["searchService"] = searchService;

    // Mock Fastify request and reply
    mockRequest = {
      query: {},
    };

    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  describe("searchController", () => {
    it("should return 200 with search results", async () => {
      const queryParams: SearchQuery = {
        query: "test",
        organization_id: "org-1",
        type: "all",
      };

      const mockResults = {
        query: "test",
        total: 3,
        results: {
          boards: [
            {
              id: "board-1",
              title: "Test Board",
              description: "Description",
              organization_id: "org-1",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              result_type: "board" as const,
            },
          ],
          lists: [],
          cards: [],
          comments: [],
        },
      };

      mockRequest.query = queryParams;
      searchService.search.mockResolvedValue(mockResults);

      await searchController.searchController(
        mockRequest as FastifyRequest<{ Querystring: SearchQuery }>,
        mockReply as FastifyReply
      );

      expect(searchService.search).toHaveBeenCalledWith(queryParams);
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith(mockResults);
    });

    it("should return 500 on service error", async () => {
      const queryParams: SearchQuery = {
        query: "test",
        organization_id: "org-1",
      };

      const error = new Error("Database connection failed");
      mockRequest.query = queryParams;
      searchService.search.mockRejectedValue(error);

      await searchController.searchController(
        mockRequest as FastifyRequest<{ Querystring: SearchQuery }>,
        mockReply as FastifyReply
      );

      expect(mockReply.status).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        error: "Internal server error",
        message: "Database connection failed",
      });
    });

    it("should handle non-Error exceptions", async () => {
      const queryParams: SearchQuery = {
        query: "test",
        organization_id: "org-1",
      };

      mockRequest.query = queryParams;
      searchService.search.mockRejectedValue("Unknown error");

      await searchController.searchController(
        mockRequest as FastifyRequest<{ Querystring: SearchQuery }>,
        mockReply as FastifyReply
      );

      expect(mockReply.status).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        error: "Internal server error",
        message: "Search failed",
      });
    });

    it("should handle empty search results", async () => {
      const queryParams: SearchQuery = {
        query: "nonexistent",
        organization_id: "org-1",
      };

      const mockResults = {
        query: "nonexistent",
        total: 0,
        results: {
          boards: [],
          lists: [],
          cards: [],
          comments: [],
        },
      };

      mockRequest.query = queryParams;
      searchService.search.mockResolvedValue(mockResults);

      await searchController.searchController(
        mockRequest as FastifyRequest<{ Querystring: SearchQuery }>,
        mockReply as FastifyReply
      );

      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith(mockResults);
    });

    it("should handle search with all optional parameters", async () => {
      const queryParams: SearchQuery = {
        query: "test",
        organization_id: "org-1",
        board_id: "board-1",
        type: "card",
        limit: 10,
      };

      const mockResults = {
        query: "test",
        total: 1,
        results: {
          boards: [],
          lists: [],
          cards: [
            {
              id: "card-1",
              title: "Test Card",
              description: "Description",
              status: "active",
              list_id: "list-1",
              list_title: "List",
              board_id: "board-1",
              board_title: "Board",
              order: 1,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              result_type: "card" as const,
            },
          ],
          comments: [],
        },
      };

      mockRequest.query = queryParams;
      searchService.search.mockResolvedValue(mockResults);

      await searchController.searchController(
        mockRequest as FastifyRequest<{ Querystring: SearchQuery }>,
        mockReply as FastifyReply
      );

      expect(searchService.search).toHaveBeenCalledWith(queryParams);
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith(mockResults);
    });
  });
});
