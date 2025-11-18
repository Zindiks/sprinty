import { AssignedTask } from "../hooks/useAnalytics";
import { DashboardFilters } from "../hooks/store/useDashboardStore";

export const filterAndSortTasks = (
  tasks: AssignedTask[],
  filters: DashboardFilters
): AssignedTask[] => {
  let filtered = [...tasks];

  // Apply status filter
  if (filters.status !== "all") {
    filtered = filtered.filter((task) => task.status === filters.status);
  }

  // Apply priority filter
  if (filters.priority !== "all") {
    filtered = filtered.filter((task) => task.priority === filters.priority);
  }

  // Apply due date filter
  if (filters.dueDate !== "all") {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfWeek = new Date(today);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    filtered = filtered.filter((task) => {
      if (!task.due_date && filters.dueDate === "no_due_date") return true;
      if (!task.due_date) return false;

      const dueDate = new Date(task.due_date);

      switch (filters.dueDate) {
        case "overdue":
          return dueDate < today && task.status !== "completed";
        case "due_today":
          return (
            dueDate.getFullYear() === today.getFullYear() &&
            dueDate.getMonth() === today.getMonth() &&
            dueDate.getDate() === today.getDate()
          );
        case "due_this_week":
          return dueDate >= today && dueDate <= endOfWeek;
        default:
          return true;
      }
    });
  }

  // Apply board filter
  if (filters.selectedBoards.length > 0) {
    filtered = filtered.filter((task) => filters.selectedBoards.includes(task.board_id));
  }

  // Apply search query
  if (filters.searchQuery.trim() !== "") {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.board_title.toLowerCase().includes(query) ||
        task.list_title.toLowerCase().includes(query)
    );
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let compareValue = 0;

    switch (filters.sortBy) {
      case "due_date":
        {
          const dateA = a.due_date ? new Date(a.due_date).getTime() : Infinity;
          const dateB = b.due_date ? new Date(b.due_date).getTime() : Infinity;
          compareValue = dateA - dateB;
        }
        break;

      case "priority":
        {
          const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          const priorityA = priorityOrder[a.priority] ?? 4;
          const priorityB = priorityOrder[b.priority] ?? 4;
          compareValue = priorityA - priorityB;
        }
        break;

      case "created_date":
        compareValue = new Date(a.id).getTime() - new Date(b.id).getTime();
        break;

      case "title":
        compareValue = a.title.localeCompare(b.title);
        break;

      case "board":
        compareValue = a.board_title.localeCompare(b.board_title);
        break;

      default:
        compareValue = 0;
    }

    return filters.sortOrder === "asc" ? compareValue : -compareValue;
  });

  return filtered;
};
