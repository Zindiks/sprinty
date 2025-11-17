import { useState, useMemo } from "react";
import type { Card } from "@/types/types";
import { isDueToday, isDueThisWeek, isOverdue } from "@/lib/dateUtils";

export type DueDateFilter = "all" | "today" | "week" | "overdue" | "none" | "upcoming";
export type SortOption = "due_date" | "priority" | "created_at" | "title";
export type SortDirection = "asc" | "desc";

interface FilterState {
  dueDate: DueDateFilter;
  sort: SortOption;
  sortDirection: SortDirection;
}

const PRIORITY_ORDER: Record<string, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export const useCardFilters = () => {
  const [filters, setFilters] = useState<FilterState>({
    dueDate: "all",
    sort: "created_at",
    sortDirection: "desc",
  });

  // Filter cards by due date
  const filterByDueDate = (cards: Card[]): Card[] => {
    if (filters.dueDate === "all") return cards;

    return cards.filter((card) => {
      if (!card.due_date && filters.dueDate === "none") return true;
      if (!card.due_date) return false;

      switch (filters.dueDate) {
        case "today":
          return isDueToday(card.due_date);
        case "week":
          return isDueThisWeek(card.due_date);
        case "overdue":
          return isOverdue(card.due_date);
        case "upcoming":
          return !isOverdue(card.due_date);
        case "none":
          return false; // Already handled above
        default:
          return true;
      }
    });
  };

  // Sort cards
  const sortCards = (cards: Card[]): Card[] => {
    const sorted = [...cards].sort((a, b) => {
      let comparison = 0;

      switch (filters.sort) {
        case "due_date":
          if (!a.due_date && !b.due_date) comparison = 0;
          else if (!a.due_date) comparison = 1;
          else if (!b.due_date) comparison = -1;
          else comparison = new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
          break;

        case "priority":
          const aPriority = PRIORITY_ORDER[a.priority || "medium"];
          const bPriority = PRIORITY_ORDER[b.priority || "medium"];
          comparison = bPriority - aPriority; // Higher priority first
          break;

        case "created_at":
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;

        case "title":
          comparison = a.title.localeCompare(b.title);
          break;

        default:
          comparison = 0;
      }

      return filters.sortDirection === "asc" ? comparison : -comparison;
    });

    return sorted;
  };

  // Apply all filters and sorting
  const filterAndSortCards = useMemo(
    () => (cards: Card[]): Card[] => {
      const filtered = filterByDueDate(cards);
      const sorted = sortCards(filtered);
      return sorted;
    },
    [filters]
  );

  // Get filter stats
  const getFilterStats = (cards: Card[]) => {
    return {
      all: cards.length,
      today: cards.filter((c) => c.due_date && isDueToday(c.due_date)).length,
      week: cards.filter((c) => c.due_date && isDueThisWeek(c.due_date)).length,
      overdue: cards.filter((c) => c.due_date && isOverdue(c.due_date)).length,
      none: cards.filter((c) => !c.due_date).length,
      upcoming: cards.filter((c) => c.due_date && !isOverdue(c.due_date)).length,
    };
  };

  // Update filter
  const setDueDateFilter = (filter: DueDateFilter) => {
    setFilters((prev) => ({ ...prev, dueDate: filter }));
  };

  // Update sort
  const setSortOption = (sort: SortOption) => {
    setFilters((prev) => ({ ...prev, sort }));
  };

  // Toggle sort direction
  const toggleSortDirection = () => {
    setFilters((prev) => ({
      ...prev,
      sortDirection: prev.sortDirection === "asc" ? "desc" : "asc",
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      dueDate: "all",
      sort: "created_at",
      sortDirection: "desc",
    });
  };

  return {
    filters,
    setDueDateFilter,
    setSortOption,
    toggleSortDirection,
    resetFilters,
    filterAndSortCards,
    getFilterStats,
  };
};
