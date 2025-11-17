import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useSelectionStore } from "./store/useSelectionStore";
import axios from "axios";

const API_HOST = import.meta.env.VITE_API_HOST;
const API_PORT = import.meta.env.VITE_API_PORT;
const API_VERSION = import.meta.env.VITE_API_VERSION;
const API_URL = `${API_HOST}:${API_PORT}${API_VERSION}`;

/**
 * Hook for bulk card operations
 * Phase 4: Real API integration
 */
export const useBulkActions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { clearSelection } = useSelectionStore();

  const bulkMoveCardsMutation = useMutation({
    mutationFn: async ({
      cardIds,
      targetListId,
    }: {
      cardIds: string[];
      targetListId: string;
    }) => {
      const response = await axios.post(`${API_URL}/cards/bulk/move`, {
        card_ids: cardIds,
        target_list_id: targetListId,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      toast({
        description: data.message || "Cards moved successfully",
      });
      clearSelection();
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "Failed to move cards",
      });
    },
  });

  const bulkAssignUsersMutation = useMutation({
    mutationFn: async ({
      cardIds,
      userIds,
    }: {
      cardIds: string[];
      userIds: string[];
    }) => {
      const response = await axios.post(`${API_URL}/cards/bulk/assign`, {
        card_ids: cardIds,
        user_ids: userIds,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      toast({
        description: data.message || "Users assigned successfully",
      });
      clearSelection();
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "Failed to assign users",
      });
    },
  });

  const bulkAddLabelsMutation = useMutation({
    mutationFn: async ({
      cardIds,
      labelIds,
    }: {
      cardIds: string[];
      labelIds: string[];
    }) => {
      const response = await axios.post(`${API_URL}/cards/bulk/labels`, {
        card_ids: cardIds,
        label_ids: labelIds,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      toast({
        description: data.message || "Labels added successfully",
      });
      clearSelection();
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "Failed to add labels",
      });
    },
  });

  const bulkSetDueDateMutation = useMutation({
    mutationFn: async ({
      cardIds,
      dueDate,
    }: {
      cardIds: string[];
      dueDate: string | null;
    }) => {
      const response = await axios.post(`${API_URL}/cards/bulk/due-date`, {
        card_ids: cardIds,
        due_date: dueDate,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      toast({
        description: data.message || "Due date set successfully",
      });
      clearSelection();
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "Failed to set due date",
      });
    },
  });

  const bulkArchiveCardsMutation = useMutation({
    mutationFn: async ({ cardIds }: { cardIds: string[] }) => {
      const response = await axios.post(`${API_URL}/cards/bulk/archive`, {
        card_ids: cardIds,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      toast({
        description: data.message || "Cards archived successfully",
      });
      clearSelection();
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "Failed to archive cards",
      });
    },
  });

  const bulkDeleteCardsMutation = useMutation({
    mutationFn: async ({ cardIds }: { cardIds: string[] }) => {
      const response = await axios.delete(`${API_URL}/cards/bulk`, {
        data: {
          card_ids: cardIds,
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      toast({
        description: data.message || "Cards deleted successfully",
      });
      clearSelection();
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "Failed to delete cards",
      });
    },
  });

  return {
    bulkMoveCards: (cardIds: string[], targetListId: string) =>
      bulkMoveCardsMutation.mutate({ cardIds, targetListId }),
    bulkAssignUsers: (cardIds: string[], userIds: string[]) =>
      bulkAssignUsersMutation.mutate({ cardIds, userIds }),
    bulkAddLabels: (cardIds: string[], labelIds: string[]) =>
      bulkAddLabelsMutation.mutate({ cardIds, labelIds }),
    bulkSetDueDate: (cardIds: string[], dueDate: string | null) =>
      bulkSetDueDateMutation.mutate({ cardIds, dueDate }),
    bulkArchiveCards: (cardIds: string[]) =>
      bulkArchiveCardsMutation.mutate({ cardIds }),
    bulkDeleteCards: (cardIds: string[]) =>
      bulkDeleteCardsMutation.mutate({ cardIds }),
    isLoading:
      bulkMoveCardsMutation.isPending ||
      bulkAssignUsersMutation.isPending ||
      bulkAddLabelsMutation.isPending ||
      bulkSetDueDateMutation.isPending ||
      bulkArchiveCardsMutation.isPending ||
      bulkDeleteCardsMutation.isPending,
  };
};
