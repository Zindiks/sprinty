import { useState } from "react";
import { useDashboardStore } from "../../hooks/store/useDashboardStore";
import { useBoardsOverview } from "../../hooks/useAnalytics";
import { useStore } from "../../hooks/store/useStore";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
} from "lucide-react";

const DashboardFilters = () => {
  const { organization_id } = useStore();
  const {
    filters,
    setStatusFilter,
    setPriorityFilter,
    setDueDateFilter,
    toggleBoard,
    setSearchQuery,
    setSortBy,
    toggleSortOrder,
    clearAllFilters,
    getActiveFilterCount,
  } = useDashboardStore();

  const { data: boards } = useBoardsOverview(organization_id);
  const [isExpanded, setIsExpanded] = useState(false);

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      {/* Header with toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="font-semibold">Filters & Search</span>
            {activeFilterCount > 0 && (
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition"
          >
            <X className="w-4 h-4" />
            Clear all filters
          </button>
        )}
      </div>

      {/* Search Bar - Always visible */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Expanded Filter Panel */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={filters.priority}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Due Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <select
              value={filters.dueDate}
              onChange={(e) => setDueDateFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Dates</option>
              <option value="overdue">Overdue</option>
              <option value="due_today">Due Today</option>
              <option value="due_this_week">Due This Week</option>
              <option value="no_due_date">No Due Date</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <div className="flex gap-2">
              <select
                value={filters.sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="due_date">Due Date</option>
                <option value="priority">Priority</option>
                <option value="created_date">Created Date</option>
                <option value="title">Title</option>
                <option value="board">Board</option>
              </select>
              <button
                onClick={toggleSortOrder}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                title={`Sort ${filters.sortOrder === "asc" ? "Ascending" : "Descending"}`}
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Board Filter */}
          {boards && boards.length > 0 && (
            <div className="md:col-span-2 lg:col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Boards
              </label>
              <div className="flex flex-wrap gap-2">
                {boards.map((board) => (
                  <button
                    key={board.id}
                    onClick={() => toggleBoard(board.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                      filters.selectedBoards.includes(board.id)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {board.title}
                    {filters.selectedBoards.includes(board.id) && (
                      <X className="inline-block w-3 h-3 ml-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardFilters;
