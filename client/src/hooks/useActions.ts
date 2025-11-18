import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useStore } from "@/hooks/store/useStore";
import { Action } from "@/types/actions";
import {
  Home,
  LayoutDashboard,
  Square,
  FileText,
  List as ListIcon,
  User,
  Search,
  UserPlus,
  Tag,
} from "lucide-react";

/**
 * Hook to get all available actions for the command palette
 * Actions are context-aware based on current page and app state
 */
export function useActions() {
  const navigate = useNavigate();
  const location = useLocation();
  const { board_id, organization_id } = useStore();

  const actions: Action[] = useMemo(() => {
    const allActions: Action[] = [
      // Create Actions
      {
        id: "create-board",
        label: "Create Board",
        description: "Create a new board in your organization",
        icon: Square,
        keywords: ["create", "new", "board", "add"],
        group: "create",
        shortcut: "⌘ + N",
        handler: () => {
          // TODO: Open create board modal
          console.log("Create board");
        },
        context: {
          requiresOrganization: true,
        },
      },
      {
        id: "create-card",
        label: "Create Card",
        description: "Create a new card in the current board",
        icon: FileText,
        keywords: ["create", "new", "card", "add", "task"],
        group: "create",
        handler: () => {
          // TODO: Open create card modal
          console.log("Create card");
        },
        context: {
          requiresBoard: true,
        },
      },
      {
        id: "create-list",
        label: "Create List",
        description: "Create a new list in the current board",
        icon: ListIcon,
        keywords: ["create", "new", "list", "add", "column"],
        group: "create",
        handler: () => {
          // TODO: Open create list modal
          console.log("Create list");
        },
        context: {
          requiresBoard: true,
        },
      },

      // Navigate Actions
      {
        id: "goto-dashboard",
        label: "Go to Dashboard",
        description: "Navigate to your dashboard",
        icon: LayoutDashboard,
        keywords: ["go", "navigate", "dashboard", "home"],
        group: "navigate",
        handler: () => navigate("/dashboard"),
      },
      {
        id: "goto-boards",
        label: "Go to Boards",
        description: "Navigate to boards overview",
        icon: Home,
        keywords: ["go", "navigate", "boards", "all"],
        group: "navigate",
        handler: () => navigate("/boards"),
      },
      {
        id: "goto-profile",
        label: "Go to Profile",
        description: "View and edit your profile",
        icon: User,
        keywords: ["go", "navigate", "profile", "account", "user"],
        group: "navigate",
        handler: () => navigate("/profile"),
      },

      // Search Actions
      {
        id: "search-boards",
        label: "Search Boards",
        description: "Search for boards",
        icon: Square,
        keywords: ["search", "find", "boards"],
        group: "search",
        handler: () => {
          // TODO: Open search with board filter
          console.log("Search boards");
        },
      },
      {
        id: "search-cards",
        label: "Search Cards",
        description: "Search for cards",
        icon: FileText,
        keywords: ["search", "find", "cards", "tasks"],
        group: "search",
        handler: () => {
          // TODO: Open search with card filter
          console.log("Search cards");
        },
      },
      {
        id: "search-everywhere",
        label: "Search Everywhere",
        description: "Search across all content",
        icon: Search,
        keywords: ["search", "find", "all", "everywhere"],
        group: "search",
        handler: () => {
          // TODO: Open search in all mode
          console.log("Search everywhere");
        },
      },

      // Assign Actions (only when on a board)
      {
        id: "assign-to-me",
        label: "Assign to Me",
        description: "Assign the current card to yourself",
        icon: UserPlus,
        keywords: ["assign", "me", "self"],
        group: "assign",
        handler: () => {
          // TODO: Assign current card to user
          console.log("Assign to me");
        },
        context: {
          requiresBoard: true,
        },
      },
      {
        id: "add-label",
        label: "Add Label",
        description: "Add a label to the current card",
        icon: Tag,
        keywords: ["label", "tag", "add"],
        group: "assign",
        handler: () => {
          // TODO: Open label picker
          console.log("Add label");
        },
        context: {
          requiresBoard: true,
        },
      },
    ];

    // Filter actions based on context
    return allActions.filter((action) => {
      if (!action.context) return true;

      if (action.context.requiresOrganization && !organization_id) {
        return false;
      }

      if (action.context.requiresBoard && !board_id) {
        return false;
      }

      if (action.context.requiresCard) {
        // TODO: Add card context when available
        return false;
      }

      return true;
    });
  }, [navigate, board_id, organization_id, location.pathname]);

  /**
   * Filter actions by search query
   */
  const filterActions = (query: string): Action[] => {
    if (!query) return actions;

    const lowerQuery = query.toLowerCase();

    return actions
      .filter((action) => {
        // Match against label, description, and keywords
        const matchesLabel = action.label.toLowerCase().includes(lowerQuery);
        const matchesDescription = action.description?.toLowerCase().includes(lowerQuery) || false;
        const matchesKeywords = action.keywords.some((keyword) =>
          keyword.toLowerCase().includes(lowerQuery)
        );

        return matchesLabel || matchesDescription || matchesKeywords;
      })
      .sort((a, b) => {
        // Prioritize label matches over keyword matches
        const aLabelMatch = a.label.toLowerCase().includes(lowerQuery);
        const bLabelMatch = b.label.toLowerCase().includes(lowerQuery);

        if (aLabelMatch && !bLabelMatch) return -1;
        if (!aLabelMatch && bLabelMatch) return 1;

        return 0;
      });
  };

  /**
   * Get actions grouped by category
   */
  const getGroupedActions = () => {
    const grouped = actions.reduce(
      (acc, action) => {
        if (!acc[action.group]) {
          acc[action.group] = [];
        }
        acc[action.group].push(action);
        return acc;
      },
      {} as Record<string, Action[]>
    );

    return grouped;
  };

  return {
    actions,
    filterActions,
    getGroupedActions,
  };
}
