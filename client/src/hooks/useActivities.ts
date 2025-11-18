import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import type { Activity, ActivityActionType } from '@/types/types';

export interface ActivityFilters {
  action_type?: ActivityActionType;
  user_id?: string;
  limit?: number;
  offset?: number;
}

interface FetchError {
  message: string;
  response: {
    data: {
      message: string;
    };
  };
}

export const useActivities = (cardId?: string, filters?: ActivityFilters) => {
  // Fetch activities for a card
  const {
    data: activities,
    isLoading,
    refetch,
  } = useQuery<Activity[], FetchError>({
    queryKey: ['activities', cardId, filters],
    queryFn: async () => {
      if (!cardId) throw new Error('Card ID is required');

      // Build query string
      const params = new URLSearchParams();
      if (filters?.action_type) params.append('action_type', filters.action_type);
      if (filters?.user_id) params.append('user_id', filters.user_id);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());

      const queryString = params.toString();
      const url = `/activities/card/${cardId}${queryString ? `?${queryString}` : ''}`;

      const response = await apiClient.get(url);
      return response.data;
    },
    enabled: !!cardId,
    staleTime: 10000, // Consider data fresh for 10 seconds
  });

  return {
    activities: activities || [],
    isLoading,
    refetch,
  };
};
