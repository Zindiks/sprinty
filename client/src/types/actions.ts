import { LucideIcon } from "lucide-react";

/**
 * Action groups for organizing commands
 */
export type ActionGroup = "create" | "navigate" | "assign" | "search" | "settings";

/**
 * Action interface for command palette
 */
export interface Action {
  id: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  keywords: string[];
  group: ActionGroup;
  shortcut?: string;
  handler: () => void | Promise<void>;
  /**
   * Context requirements - action only shown when these are met
   */
  context?: {
    requiresBoard?: boolean;
    requiresCard?: boolean;
    requiresOrganization?: boolean;
  };
}

/**
 * Action result for filtering and display
 */
export interface ActionWithScore extends Action {
  score: number;
}
