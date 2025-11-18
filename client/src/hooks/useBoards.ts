import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import apiClient from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import { Board } from "@/types/types";

export interface CreateBoard {
  title: string;
  description: string;
  organization_id?: string;
}

export interface UpdateBoardTitle {
  id: string;
  title: string;
}

export interface FetchError {
  message: string;
  response: {
    data: {
      message: string;
    };
  };
}

export const useBoard = (organization_id: string) => {
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const fetchBoards = async (organization_id: string) => {
    try {
      const response = await apiClient.get(
        `/boards/${organization_id}/all`,
      );
      return response.data;
    } catch (err) {
      throw new Error("Error fetching boards: " + err);
    }
  };

  const fetchBoard = async (board_id: string) => {
    try {
      const response = await apiClient.get(`/boards/${board_id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching boards: ${error}`);
    }
  };

  const GetBoard = (board_id: string) => {
    return useQuery<Board, FetchError>({
      queryKey: ["board", board_id],
      queryFn: () => fetchBoard(board_id),
    });
  };

  const GetBoards = () => {
    return useQuery<Board[], FetchError>({
      queryKey: ["boards", organization_id],
      queryFn: () => fetchBoards(organization_id),
    });
  };

  const createBoard = useMutation<AxiosResponse, FetchError, CreateBoard>({
    mutationFn: (formData) => {
      formData.organization_id = organization_id;

      return apiClient.post(`/boards`, formData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["boards", organization_id],
      });
    },

    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create board: ${error}`,
        variant: "destructive",
      });
    },
  });

  const deleteBoard = useMutation<AxiosResponse, FetchError, string>({
    mutationFn: (board_id) => {
      return apiClient.delete(`/boards/${board_id}`);
    },

    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: ["boards", organization_id],
      });

      toast({
        title: "Success",
        description: `Board ${data.title} deleted successfully`,
      });
    },

    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete board: ${error}`,
        variant: "destructive",
      });
    },
  });

  const updateBoardTitle = useMutation<
    AxiosResponse,
    FetchError,
    UpdateBoardTitle
  >({
    mutationFn: (formData) => {
      return apiClient.put(
        `/boards/${formData.id}`,
        formData,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["board"],
      });

      toast({
        description: `Board title has been changed`,
        duration: 1000,
      });
    },

    onError: ({ response }) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: response.data.message,
      });
    },
  });

  return {
    createBoard,
    deleteBoard,
    updateBoardTitle,
    GetBoard,
    GetBoards,
  };
};
