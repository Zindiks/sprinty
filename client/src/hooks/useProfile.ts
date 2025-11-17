import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { useToast } from "@/hooks/use-toast";

const API_HOST = import.meta.env.VITE_API_HOST;
const API_PORT = import.meta.env.VITE_API_PORT;
const API_VERSION = import.meta.env.VITE_API_VERSION;

const API_URL = `${API_HOST}:${API_PORT}${API_VERSION}`;

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  email: string;
  description?: string;
  date_of_birth?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfile {
  username?: string;
  email?: string;
  description?: string;
  date_of_birth?: string;
  avatar_url?: string;
}

export interface FetchError {
  message: string;
  response: {
    data: {
      message: string;
    };
  };
}

export const useProfile = (user_id: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const fetchProfile = async (user_id: string) => {
    try {
      const response = await axios.get(`${API_URL}/profiles/user/${user_id}`);
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 404) {
        return null;
      }
      throw new Error("Error fetching profile: " + err);
    }
  };

  const GetProfile = useQuery<Profile | null, FetchError>({
    queryKey: ["profile", user_id],
    queryFn: () => fetchProfile(user_id),
    enabled: !!user_id,
  });

  const updateProfile = useMutation<AxiosResponse, FetchError, UpdateProfile>({
    mutationFn: (formData) => {
      return axios.put(
        `${API_URL}/profiles/user/${user_id}`,
        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user_id] });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const deleteProfile = useMutation<AxiosResponse, FetchError, void>({
    mutationFn: () => {
      return axios.delete(`${API_URL}/profiles/user/${user_id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user_id] });
      toast({
        title: "Success",
        description: "Profile deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete profile",
        variant: "destructive",
      });
    },
  });

  return {
    GetProfile,
    updateProfile,
    deleteProfile,
  };
};
