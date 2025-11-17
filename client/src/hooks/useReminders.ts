import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { useToast } from "@/hooks/use-toast";

const API_HOST = import.meta.env.VITE_API_HOST;
const API_PORT = import.meta.env.VITE_API_PORT;
const API_VERSION = import.meta.env.VITE_API_VERSION;

const API_URL = `${API_HOST}:${API_PORT}${API_VERSION}`;

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
      const response = await axios.get(`${API_URL}/reminders/card/${cardId}`);
      return response.data;
    },
    enabled: !!cardId,
  });

  // Create a new reminder
  const createReminder = useMutation<AxiosResponse, FetchError, CreateReminder>({
    mutationFn: (data) => {
      return axios.post(`${API_URL}/reminders`, JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
        },
      });
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
      return axios.delete(`${API_URL}/reminders/${reminderId}`);
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
