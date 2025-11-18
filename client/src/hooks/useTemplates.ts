import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import apiClient from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import {
  Template,
  TemplatesCollection,
  CreateBoardFromTemplateRequest,
  CreateTemplateFromBoardRequest,
  UpdateTemplateRequest,
  Board,
} from "@/types/types";

export interface FetchError {
  message: string;
  response: {
    data: {
      message: string;
    };
  };
}

export const useTemplates = (organization_id?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all templates (system + custom for organization)
  const fetchTemplates = async (
    organization_id?: string,
  ): Promise<TemplatesCollection> => {
    try {
      const params = organization_id ? { organization_id } : {};
      const response = await apiClient.get(`/templates`, { params });
      return response.data;
    } catch (err) {
      throw new Error("Error fetching templates: " + err);
    }
  };

  // Fetch single template by ID
  const fetchTemplate = async (template_id: string): Promise<Template> => {
    try {
      const response = await apiClient.get(`/templates/${template_id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching template: ${error}`);
    }
  };

  // Query: Get all templates
  const GetTemplates = () => {
    return useQuery<TemplatesCollection, FetchError>({
      queryKey: ["templates", organization_id],
      queryFn: () => fetchTemplates(organization_id),
    });
  };

  // Query: Get single template
  const GetTemplate = (template_id: string) => {
    return useQuery<Template, FetchError>({
      queryKey: ["template", template_id],
      queryFn: () => fetchTemplate(template_id),
      enabled: !!template_id,
    });
  };

  // Mutation: Create board from template
  const createBoardFromTemplate = useMutation<
    AxiosResponse<Board>,
    FetchError,
    CreateBoardFromTemplateRequest
  >({
    mutationFn: (formData) => {
      return apiClient.post(
        `/templates/create-board`,
        formData
      );
    },

    onSuccess: (response) => {
      // Invalidate boards query to show the new board
      queryClient.invalidateQueries({
        queryKey: ["boards", response.data.organization_id],
      });

      toast({
        title: "Success",
        description: `Board "${response.data.title}" created from template`,
      });
    },

    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create board from template: ${error.response?.data?.message || error.message}`,
        variant: "destructive",
      });
    },
  });

  // Mutation: Create template from board
  const createTemplateFromBoard = useMutation<
    AxiosResponse<Template>,
    FetchError,
    CreateTemplateFromBoardRequest
  >({
    mutationFn: (formData) => {
      return apiClient.post(
        `/templates/from-board`,
        formData
      );
    },

    onSuccess: (response) => {
      // Invalidate templates query to show the new template
      queryClient.invalidateQueries({
        queryKey: ["templates", organization_id],
      });

      toast({
        title: "Success",
        description: `Template "${response.data.name}" created successfully`,
      });
    },

    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save board as template: ${error.response?.data?.message || error.message}`,
        variant: "destructive",
      });
    },
  });

  // Mutation: Update template
  const updateTemplate = useMutation<
    AxiosResponse<Template>,
    FetchError,
    { id: string; data: UpdateTemplateRequest }
  >({
    mutationFn: ({ id, data }) => {
      return apiClient.put(
        `/templates/${id}?organization_id=${organization_id}`,
        data
      );
    },

    onSuccess: (response) => {
      // Invalidate templates queries
      queryClient.invalidateQueries({
        queryKey: ["templates"],
      });
      queryClient.invalidateQueries({
        queryKey: ["template", response.data.id],
      });

      toast({
        title: "Success",
        description: `Template "${response.data.name}" updated successfully`,
      });
    },

    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update template: ${error.response?.data?.message || error.message}`,
        variant: "destructive",
      });
    },
  });

  // Mutation: Delete template
  const deleteTemplate = useMutation<
    AxiosResponse,
    FetchError,
    string // template_id
  >({
    mutationFn: (template_id) => {
      return apiClient.delete(
        `/templates/${template_id}?organization_id=${organization_id}`
      );
    },

    onSuccess: () => {
      // Invalidate templates query
      queryClient.invalidateQueries({
        queryKey: ["templates", organization_id],
      });

      toast({
        title: "Success",
        description: "Template deleted successfully",
      });
    },

    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete template: ${error.response?.data?.message || error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    // Queries
    GetTemplates,
    GetTemplate,

    // Mutations
    createBoardFromTemplate,
    createTemplateFromBoard,
    updateTemplate,
    deleteTemplate,
  };
};
