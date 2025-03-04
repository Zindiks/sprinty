import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { useToast } from "@/hooks/use-toast";

const API_HOST = import.meta.env.VITE_API_HOST;
const API_PORT = import.meta.env.VITE_API_PORT;
const API_VERSION = import.meta.env.VITE_API_VERSION;

const API_URL = `${API_HOST}:${API_PORT}${API_VERSION}`;

export interface ResponseCard {
  id: string;
  title: string;
  list_id: string;
  order: number;

  created_at: string;
  updated_at: string;
}

export interface CreateCard {
  title: string;
  list_id: string;
}

export interface UpdateCardTitle {
  id: string;
  title: string;
  list_id: string;
}

export interface DeleteCard {
  id: string;
  list_id: string;
}

export interface CopyCard {
  id: string;
  list_id: string;
}

export interface FetchError {
  message: string;
  response: {
    data: {
      message: string;
    };
  };
}

export const useCards = () => {
  const queryClient = useQueryClient();

  const { toast } = useToast();

  // const fetchCards = async (list_id: string) => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:4000/api/cards/${list_id}`,
  //     );
  //     return response.data; // Получаем данные из response.data
  //   } catch (error) {
  //     throw new Error(`Error fetching boards: ${error}`);
  //   }
  // };

  // const cards = useQuery<ResponseCard[], FetchError>({
  //   queryKey: ["cards", list_id],
  //   queryFn: () => fetchCards(list_id),
  // });

  const createCard = useMutation<AxiosResponse, FetchError, CreateCard>({
    mutationFn: (formData) => {
      return axios.post(`${API_URL}/cards`, JSON.stringify(formData), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lists"],
      });
    },
    onError: ({ response }) => {
      console.log(response);

      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: response.data.message,
      });
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateCardsOrder = useMutation<AxiosResponse, FetchError, any>({
    mutationFn: ([formData, list_id]) => {
      console.log(formData);
      console.log(list_id);
      return axios.put(`${API_URL}/cards/order`, JSON.stringify(formData), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list"],
      });
      toast({
        description: `lists succesfully reordered`,
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

  // const copyCard = useMutation<AxiosResponse, FetchError, CopyCard>({
  //   mutationFn: (formData) => {
  //     return axios.post(
  //       "http://localhost:4000/api/lists/copy",
  //       JSON.stringify(formData),
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       },
  //     );
  //   },
  //   onSuccess: ({ data }) => {
  //     queryClient.invalidateQueries({
  //       queryKey: ["list"],
  //     });
  //     toast({
  //       description: `List ${data.title} successfully created`,
  //     });
  //   },
  //   onError: ({ response }) => {
  //     console.log(response);

  //     toast({
  //       variant: "destructive",
  //       title: "Uh oh! Something went wrong.",
  //       description: response.data.message,
  //     });
  //   },
  // });

  // const updateListTitle = useMutation<
  //   AxiosResponse,
  //   FetchError,
  //   UpdateCardTitle
  // >({
  //   mutationFn: (formData) => {
  //     return axios.patch(
  //       "http://localhost:4000/api/lists/update",
  //       JSON.stringify(formData),
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       },
  //     );
  //   },
  //   onSuccess: () => {
  //     // queryClient.invalidateQueries();
  //     toast({
  //       description: `List title has been changed`,
  //       duration: 1000,
  //     });
  //   },
  //   onError: ({ response }) => {
  //     toast({
  //       variant: "destructive",
  //       title: "Uh oh! Something went wrong.",
  //       description: response.data.message,
  //     });
  //   },
  // });

  // const deleteList = useMutation<AxiosResponse, FetchError, DeleteCard>({
  //   mutationFn: ({ id, list_id }) => {
  //     return axios.delete(
  //       `http://localhost:4000/api/lists/${id}/board/${board_id}`,
  //     );
  //   },
  //   onSuccess: ({ data }) => {
  //     queryClient.invalidateQueries({
  //       queryKey: ["list"],
  //     });
  //     toast({
  //       description: `List ${data.title} successfully deleted`,
  //     });
  //   },
  //   onError: ({ message }) => {
  //     toast({
  //       variant: "destructive",
  //       title: "Uh oh! Something went wrong.",
  //       description: message,
  //     });
  //   },
  // });

  return {
    createCard,
    updateCardsOrder,
  };
};

// data,
//   error,
//   isError,
//   isLoading,
