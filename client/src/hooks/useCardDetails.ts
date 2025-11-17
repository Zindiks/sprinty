import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { useToast } from "@/hooks/use-toast";
import type { CardWithDetails } from "@/types/types";

const API_HOST = import.meta.env.VITE_API_HOST;
const API_PORT = import.meta.env.VITE_API_PORT;
const API_VERSION = import.meta.env.VITE_API_VERSION;

const API_URL = `${API_HOST}:${API_PORT}${API_VERSION}`;

export interface UpdateCardDetailsParams {
  id: string;
  title?: string;
  description?: string;
  status?: string;
  due_date?: string;
  priority?: "low" | "medium" | "high" | "critical";
}

export interface DeleteCardParams {
  id: string;
  list_id: string;
}

interface FetchError {
  message: string;
  response: {
    data: {
      message: string;
    };
  };
}

export const useCardDetails = (cardId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch card details with all relations
  const { data: cardDetails, isLoading, error, refetch } = useQuery<CardWithDetails, FetchError>({
    queryKey: ["card-details", cardId],
    queryFn: async () => {
      if (!cardId) throw new Error("Card ID is required");
      const response = await axios.get(`${API_URL}/cards/${cardId}/details`);
      return response.data;
    },
    enabled: !!cardId,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  // Update card details (title, description, priority, status, due_date)
  const updateDetails = useMutation<AxiosResponse, FetchError, UpdateCardDetailsParams>({
    mutationFn: ({ id, ...updates }) => {
      return axios.patch(
        `${API_URL}/cards/${id}/details`,
        JSON.stringify(updates),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
    onMutate: async (updates) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["card-details", updates.id] });

      // Snapshot previous value
      const previousCard = queryClient.getQueryData<CardWithDetails>(["card-details", updates.id]);

      // Optimistically update
      if (previousCard) {
        queryClient.setQueryData<CardWithDetails>(["card-details", updates.id], {
          ...previousCard,
          ...updates,
        });
      }

      return { previousCard };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["card-details", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      toast({
        description: "Card updated successfully",
        duration: 2000,
      });
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousCard) {
        queryClient.setQueryData(["card-details", variables.id], context.previousCard);
      }
      toast({
        variant: "destructive",
        title: "Failed to update card",
        description: error.response?.data?.message || "Something went wrong",
      });
    },
  });

  // Delete card
  const deleteCard = useMutation<AxiosResponse, FetchError, DeleteCardParams>({
    mutationFn: ({ id, list_id }) => {
      return axios.delete(`${API_URL}/cards/${id}/list/${list_id}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      queryClient.removeQueries({ queryKey: ["card-details", variables.id] });
      toast({
        description: "Card deleted successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to delete card",
        description: error.response?.data?.message || "Something went wrong",
      });
    },
  });

  return {
    cardDetails,
    isLoading,
    error,
    refetch,
    updateDetails,
    deleteCard,
  };
};
