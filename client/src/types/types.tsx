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
