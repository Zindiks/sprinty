import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { useToast } from "@/hooks/use-toast";
import type { Comment } from "@/types/types";

const API_HOST = import.meta.env.VITE_API_HOST;
const API_PORT = import.meta.env.VITE_API_PORT;
const API_VERSION = import.meta.env.VITE_API_VERSION;

const API_URL = `${API_HOST}:${API_PORT}${API_VERSION}`;

export interface CreateCommentParams {
  card_id: string;
  content: string;
  parent_comment_id?: string;
}

export interface UpdateCommentParams {
  id: string;
  card_id: string;
  content: string;
}

export interface DeleteCommentParams {
  id: string;
  card_id: string;
}

interface FetchError {
  message: string;
  response: {
    data: {
      message: string;
    };
  };
}

export const useComments = (cardId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch comments with threading
  const { data: comments, isLoading } = useQuery<Comment[], FetchError>({
    queryKey: ["comments", cardId],
    queryFn: async () => {
      if (!cardId) throw new Error("Card ID is required");
      const response = await axios.get(`${API_URL}/comments/card/${cardId}/threaded`);
      return response.data;
    },
    enabled: !!cardId,
  });

  // Create comment or reply
  const createComment = useMutation<AxiosResponse, FetchError, CreateCommentParams>({
    mutationFn: (params) => {
      return axios.post(
        `${API_URL}/comments/`,
        JSON.stringify(params),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.card_id] });
      queryClient.invalidateQueries({ queryKey: ["card-details", variables.card_id] });
      toast({
        description: variables.parent_comment_id ? "Reply added" : "Comment added",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to add comment",
        description: error.response?.data?.message || "Something went wrong",
      });
    },
  });

  // Update comment
  const updateComment = useMutation<AxiosResponse, FetchError, UpdateCommentParams>({
    mutationFn: ({ id, card_id, content }) => {
      return axios.patch(
        `${API_URL}/comments/`,
        JSON.stringify({ id, card_id, content }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
    onMutate: async (params) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["comments", params.card_id] });

      // Snapshot previous value
      const previousComments = queryClient.getQueryData<Comment[]>(["comments", params.card_id]);

      // Optimistically update
      if (previousComments) {
        const updateCommentInTree = (comments: Comment[]): Comment[] => {
          return comments.map((comment) => {
            if (comment.id === params.id) {
              return { ...comment, content: params.content, is_edited: true };
            }
            if (comment.replies && comment.replies.length > 0) {
              return { ...comment, replies: updateCommentInTree(comment.replies) };
            }
            return comment;
          });
        };

        queryClient.setQueryData<Comment[]>(
          ["comments", params.card_id],
          updateCommentInTree(previousComments)
        );
      }

      return { previousComments };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.card_id] });
      queryClient.invalidateQueries({ queryKey: ["card-details", variables.card_id] });
      toast({
        description: "Comment updated",
        duration: 2000,
      });
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousComments) {
        queryClient.setQueryData(["comments", variables.card_id], context.previousComments);
      }
      toast({
        variant: "destructive",
        title: "Failed to update comment",
        description: error.response?.data?.message || "Something went wrong",
      });
    },
  });

  // Delete comment
  const deleteComment = useMutation<AxiosResponse, FetchError, DeleteCommentParams>({
    mutationFn: ({ id, card_id }) => {
      return axios.delete(`${API_URL}/comments/${id}/card/${card_id}`);
    },
    onMutate: async (params) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["comments", params.card_id] });

      // Snapshot previous value
      const previousComments = queryClient.getQueryData<Comment[]>(["comments", params.card_id]);

      // Optimistically update
      if (previousComments) {
        const deleteCommentFromTree = (comments: Comment[]): Comment[] => {
          return comments
            .filter((comment) => comment.id !== params.id)
            .map((comment) => {
              if (comment.replies && comment.replies.length > 0) {
                return { ...comment, replies: deleteCommentFromTree(comment.replies) };
              }
              return comment;
            });
        };

        queryClient.setQueryData<Comment[]>(
          ["comments", params.card_id],
          deleteCommentFromTree(previousComments)
        );
      }

      return { previousComments };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.card_id] });
      queryClient.invalidateQueries({ queryKey: ["card-details", variables.card_id] });
      toast({
        description: "Comment deleted",
        duration: 2000,
      });
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousComments) {
        queryClient.setQueryData(["comments", variables.card_id], context.previousComments);
      }
      toast({
        variant: "destructive",
        title: "Failed to delete comment",
        description: error.response?.data?.message || "Something went wrong",
      });
    },
  });

  return {
    comments,
    isLoading,
    createComment,
    updateComment,
    deleteComment,
  };
};
