
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
  avatar_url?: string;
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

export type ActivityActionType =
  | "created"
  | "updated"
  | "moved"
  | "archived"
  | "assignee_added"
  | "assignee_removed"
  | "label_added"
  | "label_removed"
  | "comment_added"
  | "attachment_added"
  | "checklist_item_added"
  | "checklist_item_completed"
  | "due_date_set"
  | "due_date_changed"
  | "due_date_removed"
  | "priority_changed"
  | "description_changed"
  | "title_changed";

export interface Activity {
  id: string;
  card_id: string;
  user_id: string;
  action_type: ActivityActionType;
  metadata: any;
  created_at: string;
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
  activities: Activity[];
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
}

// Card label association
export interface CardLabel {
  card_id: string;
  label_id: string;
  label: Label;
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

export interface CommentResult {
  id: string;
  content: string;
  card_id: string;
  card_title: string;
  list_id: string;
  list_title: string;
  board_id: string;
  board_title: string;
  user_id: string;
  user_email: string;
  created_at: string;
  updated_at: string;
  result_type: "comment";
}

export interface SearchResponse {
  query: string;
  total: number;
  results: {
    boards: BoardResult[];
    lists: ListResult[];
    cards: CardResult[];
    comments: CommentResult[];
  };
}

export interface SearchParams {
  query: string;
  organization_id: string;
  board_id?: string;
  type?: "board" | "list" | "card" | "comment" | "all";
  limit?: number;
  // Phase 2 filters
  assignee_id?: string;
  label_id?: string;
  date_from?: string;
  date_to?: string;
  include_archived?: boolean;
}

// Dashboard & Analytics types
export interface ProductivityTrendDataPoint {
  date: string;
  cardsCreated: number;
  cardsCompleted: number;
  netChange: number;
}

export interface ProductivityTrend {
  period: "weekly" | "monthly";
  data: ProductivityTrendDataPoint[];
  summary: {
    totalCreated: number;
    totalCompleted: number;
    averagePerPeriod: number;
    trend: "increasing" | "decreasing" | "stable";
  };
}

export interface BoardOverview {
  id: string;
  title: string;
  organization_id: string;
  totalCards: number;
  completedCards: number;
  inProgressCards: number;
  overdueCards: number;
  completionRate: number;
  lastActivity: string | null;
  assignedToMeCount: number;
}

export interface WeeklyMetrics {
  weekStartDate: string;
  weekEndDate: string;
  cardsCreated: number;
  cardsCompleted: number;
  timeSpentHours: number;
  completionRate: number;
  topBoards: Array<{
    boardId: string;
    boardTitle: string;
    cardsCompleted: number;
  }>;
}

export interface MonthlyMetrics {
  month: string; // Format: "YYYY-MM"
  monthName: string; // Format: "January 2025"
  cardsCreated: number;
  cardsCompleted: number;
  timeSpentHours: number;
  completionRate: number;
  weeklyBreakdown: Array<{
    weekNumber: number;
    cardsCompleted: number;
    timeSpentHours: number;
  }>;
  topBoards: Array<{
    boardId: string;
    boardTitle: string;
    cardsCompleted: number;
    timeSpentHours: number;
  }>;
}

export type WidgetType =
  | "PERSONAL_STATS"
  | "ASSIGNED_TASKS"
  | "PRODUCTIVITY_TREND"
  | "BOARD_ANALYTICS"
  | "TIME_TRACKING"
  | "RECENT_ACTIVITY"
  | "BOARDS_OVERVIEW"
  | "SPRINT_BURNDOWN"
  | "VELOCITY_CHART"
  | "WEEKLY_METRICS"
  | "MONTHLY_METRICS"
  | "WEEKLY_COMPLETION"
  | "MONTHLY_COMPLETION"
  | "BURNDOWN_CHART";

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  enabled: boolean;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  settings?: Record<string, any>;
}

export interface DashboardLayout {
  id: string;
  user_id: string;
  name: string;
  widgets: WidgetConfig[];
  isDefault: boolean;
  created_at: string;
  updated_at: string;
}

// Template types
export interface TemplateCard {
  title: string;
  description?: string;
}

export interface TemplateList {
  title: string;
  order: number;
  exampleCards?: TemplateCard[];
}

export interface TemplateStructure {
  lists: TemplateList[];
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  category: string;
  icon?: string;
  is_system: boolean;
  organization_id?: string | null;
  created_by?: string | null;
  structure: TemplateStructure;
  created_at: string;
  updated_at: string;
}

export interface TemplatesCollection {
  system: Template[];
  custom: Template[];
}

export interface CreateBoardFromTemplateRequest {
  template_id: string;
  organization_id: string;
  board_title?: string;
  include_example_cards: boolean;
}

export interface CreateTemplateFromBoardRequest {
  board_id: string;
  template_name: string;
  description?: string;
  category: string;
  icon?: string;
  include_cards_as_examples: boolean;
}

export interface UpdateTemplateRequest {
  name?: string;
  description?: string;
  icon?: string;
  structure?: TemplateStructure;
}
