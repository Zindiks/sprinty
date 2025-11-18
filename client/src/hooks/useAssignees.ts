import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import apiClient from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import type { Assignee } from "@/types/types";

export interface AddAssigneeParams {
  card_id: string;
  user_id: string;
}

export interface RemoveAssigneeParams {
  card_id: string;
  user_id: string;
}

interface FetchError {
  message: string;
  response: {
    data: {
      message: string;
    };
  };
}

export const useAssignees = (cardId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch assignees for a card
  const { data: assignees, isLoading } = useQuery<Assignee[], FetchError>({
    queryKey: ["assignees", cardId],
    queryFn: async () => {
      if (!cardId) throw new Error("Card ID is required");
      const response = await apiClient.get(`/assignees/card/${cardId}`);
      return response.data;
    },
    enabled: !!cardId,
  });

  // Add assignee to card
  const addAssignee = useMutation<AxiosResponse, FetchError, AddAssigneeParams>({
    mutationFn: (params) => {
      return apiClient.post(
        `/assignees/`,
        params
      );
    },
    onMutate: async (params) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["assignees", params.card_id] });

      // Snapshot previous value
      const previousAssignees = queryClient.getQueryData<Assignee[]>(["assignees", params.card_id]);

      return { previousAssignees };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["assignees", variables.card_id] });
      queryClient.invalidateQueries({ queryKey: ["card-details", variables.card_id] });
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      toast({
        description: "Assignee added successfully",
        duration: 2000,
      });
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousAssignees) {
        queryClient.setQueryData(["assignees", variables.card_id], context.previousAssignees);
      }
      toast({
        variant: "destructive",
        title: "Failed to add assignee",
        description: error.response?.data?.message || "Something went wrong",
      });
    },
  });

  // Remove assignee from card
  const removeAssignee = useMutation<AxiosResponse, FetchError, RemoveAssigneeParams>({
    mutationFn: ({ card_id, user_id }) => {
      return apiClient.delete(`/assignees/${card_id}/user/${user_id}`);
    },
    onMutate: async (params) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["assignees", params.card_id] });

      // Snapshot previous value
      const previousAssignees = queryClient.getQueryData<Assignee[]>(["assignees", params.card_id]);

      // Optimistically update
      if (previousAssignees) {
        queryClient.setQueryData<Assignee[]>(
          ["assignees", params.card_id],
          previousAssignees.filter((a) => a.user_id !== params.user_id)
        );
      }

      return { previousAssignees };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["assignees", variables.card_id] });
      queryClient.invalidateQueries({ queryKey: ["card-details", variables.card_id] });
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      toast({
        description: "Assignee removed successfully",
        duration: 2000,
      });
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousAssignees) {
        queryClient.setQueryData(["assignees", variables.card_id], context.previousAssignees);
      }
      toast({
        variant: "destructive",
        title: "Failed to remove assignee",
        description: error.response?.data?.message || "Something went wrong",
      });
    },
  });

  return {
    assignees,
    isLoading,
    addAssignee,
    removeAssignee,
  };
};
