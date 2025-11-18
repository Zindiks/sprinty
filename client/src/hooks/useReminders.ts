import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import apiClient from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";

export interface Reminder {
  id: string;
  card_id: string;
  user_id: string;
  reminder_time: string;
  reminder_type: "24h" | "1h" | "custom";
  sent: boolean;
  created_at: string;
}

export interface CreateReminder {
  card_id: string;
  user_id: string;
  reminder_time: string;
  reminder_type: "24h" | "1h" | "custom";
}

interface FetchError {
  message: string;
  response: {
    data: {
      message: string;
    };
  };
}

export const useReminders = (cardId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch reminders for a card
  const { data: reminders, isLoading } = useQuery<Reminder[]>({
    queryKey: ["reminders", cardId],
    queryFn: async () => {
      if (!cardId) return [];
      const response = await apiClient.get(`/reminders/card/${cardId}`);
      return response.data;
    },
    enabled: !!cardId,
  });

  // Create a new reminder
  const createReminder = useMutation<AxiosResponse, FetchError, CreateReminder>({
    mutationFn: (data) => {
      return apiClient.post(`/reminders`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders", cardId] });
      toast({
        description: "Reminder created successfully",
        duration: 2000,
      });
    },
    onError: ({ response }) => {
      toast({
        variant: "destructive",
        title: "Failed to create reminder",
        description: response.data.message,
      });
    },
  });

  // Delete a reminder
  const deleteReminder = useMutation<AxiosResponse, FetchError, string>({
    mutationFn: (reminderId) => {
      return apiClient.delete(`/reminders/${reminderId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders", cardId] });
      toast({
        description: "Reminder deleted",
        duration: 2000,
      });
    },
    onError: ({ response }) => {
      toast({
        variant: "destructive",
        title: "Failed to delete reminder",
        description: response?.data?.message || "An error occurred",
      });
    },
  });

  return {
    reminders: reminders || [],
    isLoading,
    createReminder,
    deleteReminder,
  };
};
