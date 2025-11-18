import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { SearchParams, SearchResponse } from "@/types/types";

export interface FetchError {
  message: string;
  response: {
    data: {
      message: string;
    };
  };
}

export const useSearch = () => {
  const fetchSearch = async (params: SearchParams): Promise<SearchResponse> => {
    try {
      const queryParams = new URLSearchParams({
        query: params.query,
        organization_id: params.organization_id,
        ...(params.board_id && { board_id: params.board_id }),
        ...(params.type && { type: params.type }),
        ...(params.limit && { limit: params.limit.toString() }),
        // Phase 2 filters
        ...(params.assignee_id && { assignee_id: params.assignee_id }),
        ...(params.label_id && { label_id: params.label_id }),
        ...(params.date_from && { date_from: params.date_from }),
        ...(params.date_to && { date_to: params.date_to }),
        ...(params.include_archived !== undefined && {
          include_archived: params.include_archived.toString(),
        }),
      });

      const response = await apiClient.get(
        `/search?${queryParams.toString()}`
      );
      return response.data;
    } catch (err) {
      throw new Error("Error searching: " + err);
    }
  };

  const search = (params: SearchParams, enabled: boolean = true) => {
    return useQuery<SearchResponse, FetchError>({
      queryKey: ["search", params],
      queryFn: () => fetchSearch(params),
      enabled: enabled && params.query.length >= 1,
      staleTime: 30000, // Cache results for 30 seconds
    });
  };

  return {
    search,
  };
};
