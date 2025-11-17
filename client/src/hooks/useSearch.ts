import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SearchParams, SearchResponse } from "@/types/types";

const API_HOST = import.meta.env.VITE_API_HOST;
const API_PORT = import.meta.env.VITE_API_PORT;
const API_VERSION = import.meta.env.VITE_API_VERSION;

const API_URL = `${API_HOST}:${API_PORT}${API_VERSION}`;

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
      });

      const response = await axios.get(
        `${API_URL}/search?${queryParams.toString()}`,
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
