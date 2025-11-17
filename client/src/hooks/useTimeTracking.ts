import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export interface TimeLog {
  id: string;
  card_id: string;
  user_id: string;
  duration_minutes: number;
  description: string | null;
  logged_at: string;
  created_at: string;
  card_title?: string | null;
  user_email?: string | null;
  board_title?: string | null;
  board_id?: string | null;
}

export interface CardTimeTotal {
  totalMinutes: number;
  totalHours: number;
  logCount: number;
}

export interface CreateTimeLogInput {
  cardId: string;
  durationMinutes: number;
  description?: string;
  loggedAt?: string;
}

export interface UpdateTimeLogInput {
  durationMinutes?: number;
  description?: string;
}

// Hook to create a time log
export const useCreateTimeLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTimeLogInput) => {
      const { data } = await axios.post(
        `${API_URL}/api/v1/time-tracking`,
        input,
        { withCredentials: true }
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["time-logs", "card", variables.cardId] });
      queryClient.invalidateQueries({ queryKey: ["time-logs", "user"] });
      queryClient.invalidateQueries({ queryKey: ["time-total", variables.cardId] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
};

// Hook to get card time logs
export const useCardTimeLogs = (cardId: string | null) => {
  return useQuery<TimeLog[]>({
    queryKey: ["time-logs", "card", cardId],
    queryFn: async () => {
      const { data } = await axios.get(
        `${API_URL}/api/v1/time-tracking/card/${cardId}`,
        { withCredentials: true }
      );
      return data;
    },
    enabled: !!cardId,
  });
};

// Hook to get card time total
export const useCardTimeTotal = (cardId: string | null) => {
  return useQuery<CardTimeTotal>({
    queryKey: ["time-total", cardId],
    queryFn: async () => {
      const { data } = await axios.get(
        `${API_URL}/api/v1/time-tracking/card/${cardId}/total`,
        { withCredentials: true }
      );
      return data;
    },
    enabled: !!cardId,
  });
};

// Hook to get user time logs
export const useUserTimeLogs = (organizationId?: string) => {
  return useQuery<TimeLog[]>({
    queryKey: ["time-logs", "user", organizationId],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/api/v1/time-tracking/user`, {
        params: organizationId ? { organizationId } : {},
        withCredentials: true,
      });
      return data;
    },
  });
};

// Hook to update a time log
export const useUpdateTimeLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateTimeLogInput & { id: string }) => {
      const { data } = await axios.patch(
        `${API_URL}/api/v1/time-tracking/${id}`,
        input,
        { withCredentials: true }
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["time-logs"] });
      queryClient.invalidateQueries({ queryKey: ["time-total", data.card_id] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
};

// Hook to delete a time log
export const useDeleteTimeLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${API_URL}/api/v1/time-tracking/${id}`, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-logs"] });
      queryClient.invalidateQueries({ queryKey: ["time-total"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
};
