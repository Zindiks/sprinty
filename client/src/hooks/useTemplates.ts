import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  Template,
  TemplatesCollection,
  CreateBoardFromTemplateRequest,
  CreateTemplateFromBoardRequest,
  UpdateTemplateRequest,
  Board,
} from "@/types/types";

const API_HOST = import.meta.env.VITE_API_HOST;
const API_PORT = import.meta.env.VITE_API_PORT;
const API_VERSION = import.meta.env.VITE_API_VERSION;

const API_URL = `${API_HOST}:${API_PORT}${API_VERSION}`;

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
      const response = await axios.get(`${API_URL}/templates`, { params });
      return response.data;
    } catch (err) {
      throw new Error("Error fetching templates: " + err);
    }
  };

  // Fetch single template by ID
  const fetchTemplate = async (template_id: string): Promise<Template> => {
    try {
      const response = await axios.get(`${API_URL}/templates/${template_id}`);
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
      return axios.post(
        `${API_URL}/templates/create-board`,
        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
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
      return axios.post(
        `${API_URL}/templates/from-board`,
        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
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
      return axios.put(
        `${API_URL}/templates/${id}?organization_id=${organization_id}`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
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
      return axios.delete(
        `${API_URL}/templates/${template_id}?organization_id=${organization_id}`,
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
