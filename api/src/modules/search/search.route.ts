import { FastifyInstance } from "fastify";
import { SearchController } from "./search.controller";
import { SearchSchema } from "./search.schema";

const searchController = new SearchController();

export default async function searchRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      schema: {
        querystring: SearchSchema.SearchQuerySchema,
        response: { 200: SearchSchema.SearchResponseSchema },
        tags: ["search"],
        description: "Search across boards, lists, and cards within an organization",
        summary: "Global search",
      },
    },
    searchController.searchController.bind(searchController)
  );
}
