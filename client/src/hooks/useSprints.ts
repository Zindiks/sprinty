import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export interface Sprint {
  id: string;
  board_id: string;
  name: string;
  goal: string | null;
  start_date: string;
  end_date: string;
  status: "planned" | "active" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
  totalCards?: number;
  completedCards?: number;
}

export interface CreateSprintInput {
  boardId: string;
  name: string;
  goal?: string;
  startDate: string;
  endDate: string;
  status?: "planned" | "active" | "completed" | "cancelled";
}

export interface UpdateSprintInput {
  name?: string;
  goal?: string;
  startDate?: string;
  endDate?: string;
  status?: "planned" | "active" | "completed" | "cancelled";
}

// Hook to create a sprint
export const useCreateSprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateSprintInput) => {
      const { data } = await axios.post(`${API_URL}/api/v1/sprints`, input, {
        withCredentials: true,
      });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sprints", "board", data.board_id] });
    },
  });
};

// Hook to get board sprints
export const useBoardSprints = (boardId: string | null) => {
  return useQuery<Sprint[]>({
    queryKey: ["sprints", "board", boardId],
    queryFn: async () => {
      const { data } = await axios.get(
        `${API_URL}/api/v1/sprints/board/${boardId}`,
        { withCredentials: true }
      );
      return data;
    },
    enabled: !!boardId,
  });
};

// Hook to get active sprint
export const useActiveSprint = (boardId: string | null) => {
  return useQuery<Sprint>({
    queryKey: ["sprints", "board", boardId, "active"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${API_URL}/api/v1/sprints/board/${boardId}/active`,
        { withCredentials: true }
      );
      return data;
    },
    enabled: !!boardId,
    retry: false, // Don't retry if no active sprint
  });
};

// Hook to get a sprint with stats
export const useSprint = (sprintId: string | null) => {
  return useQuery<Sprint>({
    queryKey: ["sprints", sprintId],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/api/v1/sprints/${sprintId}`, {
        withCredentials: true,
      });
      return data;
    },
    enabled: !!sprintId,
  });
};

// Hook to update a sprint
export const useUpdateSprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateSprintInput & { id: string }) => {
      const { data } = await axios.patch(
        `${API_URL}/api/v1/sprints/${id}`,
        input,
        { withCredentials: true }
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sprints", data.id] });
      queryClient.invalidateQueries({ queryKey: ["sprints", "board", data.board_id] });
    },
  });
};

// Hook to start a sprint
export const useStartSprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sprintId: string) => {
      const { data } = await axios.post(
        `${API_URL}/api/v1/sprints/${sprintId}/start`,
        {},
        { withCredentials: true }
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sprints", data.id] });
      queryClient.invalidateQueries({ queryKey: ["sprints", "board", data.board_id] });
    },
  });
};

// Hook to complete a sprint
export const useCompleteSprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sprintId: string) => {
      const { data } = await axios.post(
        `${API_URL}/api/v1/sprints/${sprintId}/complete`,
        {},
        { withCredentials: true }
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sprints", data.id] });
      queryClient.invalidateQueries({ queryKey: ["sprints", "board", data.board_id] });
    },
  });
};

// Hook to delete a sprint
export const useDeleteSprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, boardId }: { id: string; boardId: string }) => {
      await axios.delete(`${API_URL}/api/v1/sprints/${id}`, {
        withCredentials: true,
      });
      return { id, boardId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sprints", data.id] });
      queryClient.invalidateQueries({ queryKey: ["sprints", "board", data.boardId] });
    },
  });
};
