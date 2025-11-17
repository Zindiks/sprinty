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

export interface User {
  id: string;
  email: string;
  username?: string;
}

export interface Assignee {
  id: string;
  card_id: string;
  user_id: string;
  assigned_at: string;
  assigned_by?: string;
  user: User;
}

export interface Label {
  id: string;
  board_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface ChecklistItem {
  id: string;
  card_id: string;
  title: string;
  completed: boolean;
  order: number;
  completed_by?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ChecklistProgress {
  total: number;
  completed: number;
  percentage: number;
}

export interface Comment {
  id: string;
  card_id: string;
  user_id: string;
  content: string;
  parent_comment_id?: string;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
  user: User;
  replies?: Comment[];
}

export interface Attachment {
  id: string;
  card_id: string;
  filename: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  uploaded_by: string;
  uploaded_at: string;
  user: User;
}

export interface Card {
  id: string;
  list_id: string;
  title: string;
  order: number;
  description?: string;
  status: string;
  due_date?: string;
  priority?: "low" | "medium" | "high" | "critical";
  created_at: string;
  updated_at: string;
}

export interface CardWithDetails extends Card {
  assignees: Assignee[];
  labels: Label[];
  checklist_items: ChecklistItem[];
  checklist_progress: ChecklistProgress;
  comments: Comment[];
  attachments: Attachment[];
}

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
