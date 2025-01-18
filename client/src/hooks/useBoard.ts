import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios, { AxiosResponse } from "axios"
import { useToast } from "@/hooks/use-toast"

const API_HOST = import.meta.env.VITE_API_HOST
const API_PORT = import.meta.env.VITE_API_PORT
const API_VERSION = import.meta.env.VITE_API_VERSION

const API_URL = `${API_HOST}:${API_PORT}${API_VERSION}`

export interface ResponseBoard {
  id: string
  organization_id: string

  title: string
  description: string

  created_at: string
  updated_at: string
}

export interface CreateBoard {
  title: string
  description: string
  organization_id?: string
}

export interface UpdateBoard {
  id: string
  title: string
  description: string
  organization_id: string
}

export interface FetchError {
  message: string
  response: {
    data: {
      message: string
    }
  }
}

export const useBoard = (organization_id: string) => {
  const queryClient = useQueryClient()

  const { toast } = useToast()

  const fetchBoards = async (organization_id: string) => {
    try {
      console.log(API_URL)
      const response = await axios.get(
        `${API_URL}/boards/${organization_id}/all`
      )
      return response.data
    } catch (err) {
      throw new Error("Error fetching boards: " + err)
    }
  }

  const boards = useQuery<ResponseBoard[], FetchError>({
    queryKey: ["boards", organization_id],
    queryFn: () => fetchBoards(organization_id),
  })

  const createBoard = useMutation<AxiosResponse, FetchError, CreateBoard>({
    mutationFn: (formData) => {
      formData.organization_id = organization_id

      return axios.post(`${API_URL}/boards`, JSON.stringify(formData), {
        headers: {
          "Content-Type": "application/json",
        },
      })
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["boards", organization_id],
      })
    },

    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create board: ${error}`,
        variant: "destructive",
      })
    },
  })

  const deleteBoard = useMutation<AxiosResponse, FetchError, string>({
    mutationFn: (board_id) => {
      return axios.delete(`${API_URL}/boards/${board_id}`)
    },

    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: ["boards", organization_id],
      })

      toast({
        title: "Success",
        description: `Board ${data.title} deleted successfully`,
      })
    },

    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete board: ${error}`,
        variant: "destructive",
      })
    },
  })

  const updateBoardTitle = useMutation<
    AxiosResponse,
    FetchError,
    [UpdateBoard, string]
  >({
    mutationFn: ([formData, board_id]) => {
      return axios.put(
        `${API_URL}/boards/${board_id}`,
        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["board"],
      })

      toast({
        description: `Board title has been changed`,
        duration: 1000,
      })
    },

    onError: ({ response }) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: response.data.message,
      })
    },
  })

  return {
    createBoard,
    deleteBoard,
    updateBoardTitle,
    boards,
  }
}
