import { FastifyReply, FastifyRequest } from "fastify";
import { SearchQuery } from "./search.schema";
import { SearchService } from "./search.service";

export class SearchController {
  private readonly searchService: SearchService;

  constructor() {
    this.searchService = new SearchService();
  }

  public async searchController(
    request: FastifyRequest<{
      Querystring: SearchQuery;
    }>,
    reply: FastifyReply,
  ) {
    const queryParams = request.query;

    try {
      const results = await this.searchService.search(queryParams);
      return reply.status(200).send(results);
    } catch (err) {
      return reply.status(500).send({
        error: "Internal server error",
        message: err instanceof Error ? err.message : "Search failed",
      });
    }
  }
}
