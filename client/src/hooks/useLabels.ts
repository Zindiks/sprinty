import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import apiClient from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import type { Label } from "@/types/types";

export interface CreateLabelParams {
  board_id: string;
  name: string;
  color: string;
}

export interface UpdateLabelParams {
  id: string;
  board_id: string;
  name?: string;
  color?: string;
}

export interface DeleteLabelParams {
  id: string;
  board_id: string;
}

export interface AddLabelToCardParams {
  card_id: string;
  label_id: string;
}

export interface RemoveLabelFromCardParams {
  card_id: string;
  label_id: string;
}

interface FetchError {
  message: string;
  response: {
    data: {
      message: string;
    };
  };
}

export const useLabels = (boardId?: string, cardId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all labels for a board
  const { data: boardLabels, isLoading: isLoadingBoardLabels } = useQuery<Label[], FetchError>({
    queryKey: ["labels", "board", boardId],
    queryFn: async () => {
      if (!boardId) throw new Error("Board ID is required");
      const response = await apiClient.get(`/labels/board/${boardId}`);
      return response.data;
    },
    enabled: !!boardId,
  });

  // Fetch labels for a specific card
  const { data: cardLabels, isLoading: isLoadingCardLabels } = useQuery<Label[], FetchError>({
    queryKey: ["labels", "card", cardId],
    queryFn: async () => {
      if (!cardId) throw new Error("Card ID is required");
      const response = await apiClient.get(`/labels/card/${cardId}`);
      return response.data;
    },
    enabled: !!cardId,
  });

  // Create new label
  const createLabel = useMutation<AxiosResponse, FetchError, CreateLabelParams>({
    mutationFn: (params) => {
      return apiClient.post(`/labels/`, params);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["labels", "board", variables.board_id] });
      toast({
        description: "Label created successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to create label",
        description: error.response?.data?.message || "Something went wrong",
      });
    },
  });

  // Update label
  const updateLabel = useMutation<AxiosResponse, FetchError, UpdateLabelParams>({
    mutationFn: ({ id, board_id, ...updates }) => {
      return apiClient.patch(`/labels/`, { id, board_id, ...updates });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["labels", "board", variables.board_id] });
      if (cardId) {
        queryClient.invalidateQueries({ queryKey: ["labels", "card", cardId] });
      }
      toast({
        description: "Label updated successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to update label",
        description: error.response?.data?.message || "Something went wrong",
      });
    },
  });

  // Delete label
  const deleteLabel = useMutation<AxiosResponse, FetchError, DeleteLabelParams>({
    mutationFn: ({ id, board_id }) => {
      return apiClient.delete(`/labels/${id}/board/${board_id}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["labels", "board", variables.board_id] });
      if (cardId) {
        queryClient.invalidateQueries({ queryKey: ["labels", "card", cardId] });
      }
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      toast({
        description: "Label deleted successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to delete label",
        description: error.response?.data?.message || "Something went wrong",
      });
    },
  });

  // Add label to card
  const addLabelToCard = useMutation<AxiosResponse, FetchError, AddLabelToCardParams>({
    mutationFn: (params) => {
      return apiClient.post(`/labels/card`, params);
    },
    onMutate: async (params) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["labels", "card", params.card_id] });

      // Snapshot previous value
      const previousLabels = queryClient.getQueryData<Label[]>(["labels", "card", params.card_id]);

      return { previousLabels };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["labels", "card", variables.card_id] });
      queryClient.invalidateQueries({ queryKey: ["card-details", variables.card_id] });
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      toast({
        description: "Label added to card",
        duration: 2000,
      });
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousLabels) {
        queryClient.setQueryData(["labels", "card", variables.card_id], context.previousLabels);
      }
      toast({
        variant: "destructive",
        title: "Failed to add label",
        description: error.response?.data?.message || "Something went wrong",
      });
    },
  });

  // Remove label from card
  const removeLabelFromCard = useMutation<AxiosResponse, FetchError, RemoveLabelFromCardParams>({
    mutationFn: ({ card_id, label_id }) => {
      return apiClient.delete(`/labels/card/${card_id}/label/${label_id}`);
    },
    onMutate: async (params) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["labels", "card", params.card_id] });

      // Snapshot previous value
      const previousLabels = queryClient.getQueryData<Label[]>(["labels", "card", params.card_id]);

      // Optimistically update
      if (previousLabels) {
        queryClient.setQueryData<Label[]>(
          ["labels", "card", params.card_id],
          previousLabels.filter((l) => l.id !== params.label_id)
        );
      }

      return { previousLabels };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["labels", "card", variables.card_id] });
      queryClient.invalidateQueries({ queryKey: ["card-details", variables.card_id] });
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      toast({
        description: "Label removed from card",
        duration: 2000,
      });
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousLabels) {
        queryClient.setQueryData(["labels", "card", variables.card_id], context.previousLabels);
      }
      toast({
        variant: "destructive",
        title: "Failed to remove label",
        description: error.response?.data?.message || "Something went wrong",
      });
    },
  });

  return {
    boardLabels,
    cardLabels,
    isLoadingBoardLabels,
    isLoadingCardLabels,
    createLabel,
    updateLabel,
    deleteLabel,
    addLabelToCard,
    removeLabelFromCard,
  };
};
