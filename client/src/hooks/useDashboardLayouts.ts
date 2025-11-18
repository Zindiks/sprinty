import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { WidgetConfig } from '../types/types';

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
    queryKey: ['dashboardLayouts'],
    queryFn: async () => {
      const response = await apiClient.get(`/dashboard-layouts`);
      return response.data;
    },
  });
};

/**
 * Hook to get the default dashboard layout
 */
export const useDefaultLayout = () => {
  return useQuery<DashboardLayout>({
    queryKey: ['dashboardLayouts', 'default'],
    queryFn: async () => {
      const response = await apiClient.get(`/dashboard-layouts/default`);
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
    queryKey: ['dashboardLayouts', layoutId],
    queryFn: async () => {
      if (!layoutId) throw new Error('Layout ID is required');
      const response = await apiClient.get(`/dashboard-layouts/${layoutId}`);
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
      const response = await apiClient.post(`/dashboard-layouts`, input);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['dashboardLayouts'] });
    },
  });
};

/**
 * Hook to update a dashboard layout
 */
export const useUpdateLayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ layoutId, input }: { layoutId: string; input: UpdateLayoutInput }) => {
      const response = await apiClient.patch(`/dashboard-layouts/${layoutId}`, input);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['dashboardLayouts'] });
      queryClient.invalidateQueries({
        queryKey: ['dashboardLayouts', variables.layoutId],
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
      const response = await apiClient.delete(`/dashboard-layouts/${layoutId}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['dashboardLayouts'] });
    },
  });
};
