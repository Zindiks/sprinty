import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { useToast } from "@/hooks/use-toast";
import type { ChecklistItem, ChecklistProgress } from "@/types/types";

const API_HOST = import.meta.env.VITE_API_HOST;
const API_PORT = import.meta.env.VITE_API_PORT;
const API_VERSION = import.meta.env.VITE_API_VERSION;

const API_URL = `${API_HOST}:${API_PORT}${API_VERSION}`;

export interface ChecklistWithProgress {
  items: ChecklistItem[];
  progress: ChecklistProgress;
}

export interface CreateChecklistItemParams {
  card_id: string;
  title: string;
  order?: number;
}

export interface UpdateChecklistItemParams {
  id: string;
  card_id: string;
  title?: string;
}

export interface ToggleChecklistItemParams {
  id: string;
  card_id: string;
}

export interface DeleteChecklistItemParams {
  id: string;
  card_id: string;
}

export interface ReorderChecklistParams {
  card_id: string;
  items: Array<{ id: string; order: number }>;
}

interface FetchError {
  message: string;
  response: {
    data: {
      message: string;
    };
  };
}

export const useChecklists = (cardId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch checklist items with progress
  const { data, isLoading } = useQuery<ChecklistWithProgress, FetchError>({
    queryKey: ["checklists", cardId],
    queryFn: async () => {
      if (!cardId) throw new Error("Card ID is required");
      const response = await axios.get(`${API_URL}/checklists/card/${cardId}/with-progress`);
      return response.data;
    },
    enabled: !!cardId,
  });

  // Create checklist item
  const createItem = useMutation<AxiosResponse, FetchError, CreateChecklistItemParams>({
    mutationFn: (params) => {
      return axios.post(
        `${API_URL}/checklists/`,
        JSON.stringify(params),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["checklists", variables.card_id] });
      queryClient.invalidateQueries({ queryKey: ["card-details", variables.card_id] });
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      toast({
        description: "Checklist item added",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to add checklist item",
        description: error.response?.data?.message || "Something went wrong",
      });
    },
  });

  // Update checklist item
  const updateItem = useMutation<AxiosResponse, FetchError, UpdateChecklistItemParams>({
    mutationFn: ({ id, card_id, ...updates }) => {
      return axios.patch(
        `${API_URL}/checklists/`,
        JSON.stringify({ id, card_id, ...updates }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["checklists", variables.card_id] });
      queryClient.invalidateQueries({ queryKey: ["card-details", variables.card_id] });
      toast({
        description: "Checklist item updated",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to update checklist item",
        description: error.response?.data?.message || "Something went wrong",
      });
    },
  });

  // Toggle checklist item completion
  const toggleItem = useMutation<AxiosResponse, FetchError, ToggleChecklistItemParams>({
    mutationFn: ({ id, card_id }) => {
      return axios.patch(`${API_URL}/checklists/${id}/card/${card_id}/toggle`);
    },
    onMutate: async (params) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["checklists", params.card_id] });

      // Snapshot previous value
      const previousData = queryClient.getQueryData<ChecklistWithProgress>(["checklists", params.card_id]);

      // Optimistically update
      if (previousData) {
        const updatedItems = previousData.items.map((item) =>
          item.id === params.id ? { ...item, completed: !item.completed } : item
        );
        const completedCount = updatedItems.filter((item) => item.completed).length;
        const totalCount = updatedItems.length;

        queryClient.setQueryData<ChecklistWithProgress>(["checklists", params.card_id], {
          items: updatedItems,
          progress: {
            total: totalCount,
            completed: completedCount,
            percentage: totalCount > 0 ? (completedCount / totalCount) * 100 : 0,
          },
        });
      }

      return { previousData };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["checklists", variables.card_id] });
      queryClient.invalidateQueries({ queryKey: ["card-details", variables.card_id] });
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(["checklists", variables.card_id], context.previousData);
      }
      toast({
        variant: "destructive",
        title: "Failed to toggle checklist item",
        description: error.response?.data?.message || "Something went wrong",
      });
    },
  });

  // Delete checklist item
  const deleteItem = useMutation<AxiosResponse, FetchError, DeleteChecklistItemParams>({
    mutationFn: ({ id, card_id }) => {
      return axios.delete(`${API_URL}/checklists/${id}/card/${card_id}`);
    },
    onMutate: async (params) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["checklists", params.card_id] });

      // Snapshot previous value
      const previousData = queryClient.getQueryData<ChecklistWithProgress>(["checklists", params.card_id]);

      // Optimistically update
      if (previousData) {
        const updatedItems = previousData.items.filter((item) => item.id !== params.id);
        const completedCount = updatedItems.filter((item) => item.completed).length;
        const totalCount = updatedItems.length;

        queryClient.setQueryData<ChecklistWithProgress>(["checklists", params.card_id], {
          items: updatedItems,
          progress: {
            total: totalCount,
            completed: completedCount,
            percentage: totalCount > 0 ? (completedCount / totalCount) * 100 : 0,
          },
        });
      }

      return { previousData };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["checklists", variables.card_id] });
      queryClient.invalidateQueries({ queryKey: ["card-details", variables.card_id] });
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      toast({
        description: "Checklist item deleted",
        duration: 2000,
      });
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(["checklists", variables.card_id], context.previousData);
      }
      toast({
        variant: "destructive",
        title: "Failed to delete checklist item",
        description: error.response?.data?.message || "Something went wrong",
      });
    },
  });

  // Reorder checklist items
  const reorderItems = useMutation<AxiosResponse, FetchError, ReorderChecklistParams>({
    mutationFn: ({ card_id, items }) => {
      return axios.put(
        `${API_URL}/checklists/card/${card_id}/reorder`,
        JSON.stringify({ items }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
    onMutate: async (params) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["checklists", params.card_id] });

      // Snapshot previous value
      const previousData = queryClient.getQueryData<ChecklistWithProgress>(["checklists", params.card_id]);

      return { previousData };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["checklists", variables.card_id] });
      queryClient.invalidateQueries({ queryKey: ["card-details", variables.card_id] });
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(["checklists", variables.card_id], context.previousData);
      }
      toast({
        variant: "destructive",
        title: "Failed to reorder checklist items",
        description: error.response?.data?.message || "Something went wrong",
      });
    },
  });

  return {
    checklistItems: data?.items || [],
    checklistProgress: data?.progress || { total: 0, completed: 0, percentage: 0 },
    isLoading,
    createItem,
    updateItem,
    toggleItem,
    deleteItem,
    reorderItems,
  };
};
