import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { WidgetConfig } from "../types/types";

const API_BASE_URL = "http://localhost:8080/api/v1";

export interface DashboardLayout {
  id: string;
  user_id: string;
  name: string;
  widgets: WidgetConfig[];
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateLayoutInput {
  name: string;
  widgets: WidgetConfig[];
  is_default?: boolean;
}

export interface UpdateLayoutInput {
  name?: string;
  widgets?: WidgetConfig[];
  is_default?: boolean;
}

/**
 * Hook to get all dashboard layouts for the current user
 */
export const useDashboardLayouts = () => {
  return useQuery<DashboardLayout[]>({
    queryKey: ["dashboardLayouts"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/dashboard-layouts`, {
        withCredentials: true,
      });
      return response.data;
    },
  });
};

/**
 * Hook to get the default dashboard layout
 */
export const useDefaultLayout = () => {
  return useQuery<DashboardLayout>({
    queryKey: ["dashboardLayouts", "default"],
    queryFn: async () => {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard-layouts/default`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    retry: false, // Don't retry if no default layout exists
  });
};

/**
 * Hook to get a specific dashboard layout by ID
 */
export const useDashboardLayout = (layoutId: string | null) => {
  return useQuery<DashboardLayout>({
    queryKey: ["dashboardLayouts", layoutId],
    queryFn: async () => {
      if (!layoutId) throw new Error("Layout ID is required");
      const response = await axios.get(
        `${API_BASE_URL}/dashboard-layouts/${layoutId}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    enabled: !!layoutId,
  });
};

/**
 * Hook to create a new dashboard layout
 */
export const useCreateLayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateLayoutInput) => {
      const response = await axios.post(
        `${API_BASE_URL}/dashboard-layouts`,
        input,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["dashboardLayouts"] });
    },
  });
};

/**
 * Hook to update a dashboard layout
 */
export const useUpdateLayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      layoutId,
      input,
    }: {
      layoutId: string;
      input: UpdateLayoutInput;
    }) => {
      const response = await axios.patch(
        `${API_BASE_URL}/dashboard-layouts/${layoutId}`,
        input,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["dashboardLayouts"] });
      queryClient.invalidateQueries({
        queryKey: ["dashboardLayouts", variables.layoutId],
      });
    },
  });
};

/**
 * Hook to delete a dashboard layout
 */
export const useDeleteLayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (layoutId: string) => {
      const response = await axios.delete(
        `${API_BASE_URL}/dashboard-layouts/${layoutId}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["dashboardLayouts"] });
    },
  });
};
