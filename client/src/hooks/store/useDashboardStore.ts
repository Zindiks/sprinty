import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type StatusFilter = 'all' | 'in_progress' | 'completed' | 'blocked' | 'todo';
export type PriorityFilter = 'all' | 'critical' | 'high' | 'medium' | 'low';
export type DueDateFilter = 'all' | 'overdue' | 'due_today' | 'due_this_week' | 'no_due_date';
export type SortBy = 'due_date' | 'priority' | 'created_date' | 'title' | 'board';
export type SortOrder = 'asc' | 'desc';

export interface DashboardFilters {
  status: StatusFilter;
  priority: PriorityFilter;
  dueDate: DueDateFilter;
  selectedBoards: string[];
  searchQuery: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
  showOnlyAssignedToMe: boolean;
}

interface DashboardStore {
  filters: DashboardFilters;
  setStatusFilter: (status: StatusFilter) => void;
  setPriorityFilter: (priority: PriorityFilter) => void;
  setDueDateFilter: (dueDate: DueDateFilter) => void;
  setSelectedBoards: (boards: string[]) => void;
  toggleBoard: (boardId: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: SortBy) => void;
  setSortOrder: (order: SortOrder) => void;
  toggleSortOrder: () => void;
  setShowOnlyAssignedToMe: (show: boolean) => void;
  clearAllFilters: () => void;
  getActiveFilterCount: () => number;
}

const defaultFilters: DashboardFilters = {
  status: 'all',
  priority: 'all',
  dueDate: 'all',
  selectedBoards: [],
  searchQuery: '',
  sortBy: 'due_date',
  sortOrder: 'asc',
  showOnlyAssignedToMe: false,
};

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set, get) => ({
      filters: defaultFilters,

      setStatusFilter: (status) =>
        set((state) => ({
          filters: { ...state.filters, status },
        })),

      setPriorityFilter: (priority) =>
        set((state) => ({
          filters: { ...state.filters, priority },
        })),

      setDueDateFilter: (dueDate) =>
        set((state) => ({
          filters: { ...state.filters, dueDate },
        })),

      setSelectedBoards: (boards) =>
        set((state) => ({
          filters: { ...state.filters, selectedBoards: boards },
        })),

      toggleBoard: (boardId) =>
        set((state) => {
          const selectedBoards = state.filters.selectedBoards.includes(boardId)
            ? state.filters.selectedBoards.filter((id) => id !== boardId)
            : [...state.filters.selectedBoards, boardId];
          return {
            filters: { ...state.filters, selectedBoards },
          };
        }),

      setSearchQuery: (query) =>
        set((state) => ({
          filters: { ...state.filters, searchQuery: query },
        })),

      setSortBy: (sortBy) =>
        set((state) => ({
          filters: { ...state.filters, sortBy },
        })),

      setSortOrder: (order) =>
        set((state) => ({
          filters: { ...state.filters, sortOrder: order },
        })),

      toggleSortOrder: () =>
        set((state) => ({
          filters: {
            ...state.filters,
            sortOrder: state.filters.sortOrder === 'asc' ? 'desc' : 'asc',
          },
        })),

      setShowOnlyAssignedToMe: (show) =>
        set((state) => ({
          filters: { ...state.filters, showOnlyAssignedToMe: show },
        })),

      clearAllFilters: () =>
        set(() => ({
          filters: defaultFilters,
        })),

      getActiveFilterCount: () => {
        const filters = get().filters;
        let count = 0;

        if (filters.status !== 'all') count++;
        if (filters.priority !== 'all') count++;
        if (filters.dueDate !== 'all') count++;
        if (filters.selectedBoards.length > 0) count++;
        if (filters.searchQuery.trim() !== '') count++;
        if (filters.showOnlyAssignedToMe) count++;

        return count;
      },
    }),
    {
      name: 'dashboard-filters-storage',
      partialize: (state) => ({ filters: state.filters }),
    },
  ),
);
