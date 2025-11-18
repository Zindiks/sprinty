import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import apiClient from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import type { Attachment } from "@/types/types";

export interface UploadAttachmentParams {
  card_id: string;
  file: File;
}

export interface DeleteAttachmentParams {
  id: string;
  card_id: string;
}

export interface UpdateAttachmentParams {
  id: string;
  card_id: string;
  filename: string;
}

interface FetchError {
  message: string;
  response: {
    data: {
      message: string;
    };
  };
}

export const useAttachments = (cardId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch attachments for a card
  const { data: attachments, isLoading } = useQuery<Attachment[], FetchError>({
    queryKey: ["attachments", cardId],
    queryFn: async () => {
      if (!cardId) throw new Error("Card ID is required");
      const response = await apiClient.get(`/attachments/card/${cardId}`);
      return response.data;
    },
    enabled: !!cardId,
  });

  // Upload attachment
  const uploadAttachment = useMutation<AxiosResponse, FetchError, UploadAttachmentParams>({
    mutationFn: ({ card_id, file }) => {
      const formData = new FormData();
      formData.append("file", file);

      return apiClient.post(
        `/attachments/card/${card_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["attachments", variables.card_id] });
      queryClient.invalidateQueries({ queryKey: ["card-details", variables.card_id] });
      toast({
        description: "File uploaded successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Failed to upload file";
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: errorMessage.includes("File size exceeds")
          ? "File size must be less than 10MB"
          : errorMessage,
      });
    },
  });

  // Delete attachment
  const deleteAttachment = useMutation<AxiosResponse, FetchError, DeleteAttachmentParams>({
    mutationFn: ({ id, card_id }) => {
      return apiClient.delete(`/attachments/${id}/card/${card_id}`);
    },
    onMutate: async (params) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["attachments", params.card_id] });

      // Snapshot previous value
      const previousAttachments = queryClient.getQueryData<Attachment[]>(["attachments", params.card_id]);

      // Optimistically update
      if (previousAttachments) {
        queryClient.setQueryData<Attachment[]>(
          ["attachments", params.card_id],
          previousAttachments.filter((a) => a.id !== params.id)
        );
      }

      return { previousAttachments };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["attachments", variables.card_id] });
      queryClient.invalidateQueries({ queryKey: ["card-details", variables.card_id] });
      toast({
        description: "Attachment deleted",
        duration: 2000,
      });
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousAttachments) {
        queryClient.setQueryData(["attachments", variables.card_id], context.previousAttachments);
      }
      toast({
        variant: "destructive",
        title: "Failed to delete attachment",
        description: error.response?.data?.message || "Something went wrong",
      });
    },
  });

  // Update attachment (rename)
  const updateAttachment = useMutation<AxiosResponse, FetchError, UpdateAttachmentParams>({
    mutationFn: ({ id, card_id, filename }) => {
      return apiClient.patch(
        `/attachments/`,
        { id, card_id, filename }
      );
    },
    onMutate: async (params) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["attachments", params.card_id] });

      // Snapshot previous value
      const previousAttachments = queryClient.getQueryData<Attachment[]>(["attachments", params.card_id]);

      // Optimistically update
      if (previousAttachments) {
        queryClient.setQueryData<Attachment[]>(
          ["attachments", params.card_id],
          previousAttachments.map((a) =>
            a.id === params.id ? { ...a, filename: params.filename } : a
          )
        );
      }

      return { previousAttachments };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["attachments", variables.card_id] });
      queryClient.invalidateQueries({ queryKey: ["card-details", variables.card_id] });
      toast({
        description: "Attachment renamed",
        duration: 2000,
      });
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousAttachments) {
        queryClient.setQueryData(["attachments", variables.card_id], context.previousAttachments);
      }
      toast({
        variant: "destructive",
        title: "Failed to rename attachment",
        description: error.response?.data?.message || "Something went wrong",
      });
    },
  });

  // Download attachment helper
  const downloadAttachment = (attachmentId: string, filename: string) => {
    if (!cardId) return;

    const downloadUrl = `/attachments/${attachmentId}/card/${cardId}/download`;

    // Create a temporary link and trigger download
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    attachments,
    isLoading,
    uploadAttachment,
    deleteAttachment,
    updateAttachment,
    downloadAttachment,
  };
};
