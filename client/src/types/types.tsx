export interface Organization {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  boards: Board[];
}

export interface Board {
  id: string;
  title: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
  lists: List[];
}

export interface List {
  id: string;
  board_id: string;
  title: string;
  order: number;
  created_at: string;
  updated_at: string;
  cards: Card[];
}

export interface Card {
  id: string;
  list_id: string;
  title: string;
  order: number;
  description?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Search types
export interface BoardResult {
  id: string;
  title: string;
  description?: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
  result_type: "board";
}

export interface ListResult {
  id: string;
  title: string;
  board_id: string;
  board_title: string;
  order: number;
  created_at: string;
  updated_at: string;
  result_type: "list";
}

export interface CardResult {
  id: string;
  title: string;
  description?: string;
  status?: string;
  list_id: string;
  list_title: string;
  board_id: string;
  board_title: string;
  order: number;
  created_at: string;
  updated_at: string;
  result_type: "card";
}

export interface SearchResponse {
  query: string;
  total: number;
  results: {
    boards: BoardResult[];
    lists: ListResult[];
    cards: CardResult[];
  };
}

export interface SearchParams {
  query: string;
  organization_id: string;
  board_id?: string;
  type?: "board" | "list" | "card" | "all";
  limit?: number;
}
