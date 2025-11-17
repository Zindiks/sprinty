import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { useToast } from "@/hooks/use-toast";
import type { Attachment } from "@/types/types";

const API_HOST = import.meta.env.VITE_API_HOST;
const API_PORT = import.meta.env.VITE_API_PORT;
const API_VERSION = import.meta.env.VITE_API_VERSION;

const API_URL = `${API_HOST}:${API_PORT}${API_VERSION}`;

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
      const response = await axios.get(`${API_URL}/attachments/card/${cardId}`);
      return response.data;
    },
    enabled: !!cardId,
  });

  // Upload attachment
  const uploadAttachment = useMutation<AxiosResponse, FetchError, UploadAttachmentParams>({
    mutationFn: ({ card_id, file }) => {
      const formData = new FormData();
      formData.append("file", file);

      return axios.post(
        `${API_URL}/attachments/card/${card_id}`,
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
      return axios.delete(`${API_URL}/attachments/${id}/card/${card_id}`);
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
      return axios.patch(
        `${API_URL}/attachments/`,
        JSON.stringify({ id, card_id, filename }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
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

    const downloadUrl = `${API_URL}/attachments/${attachmentId}/card/${cardId}/download`;

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
