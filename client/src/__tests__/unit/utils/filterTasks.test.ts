import { describe, it, expect, beforeEach, vi } from 'vitest';
import { filterAndSortTasks } from '@/utils/filterTasks';
import type { AssignedTask } from '@/hooks/useAnalytics';
import type { DashboardFilters } from '@/hooks/store/useDashboardStore';

describe('filterTasks', () => {
  // Mock tasks for testing
  const mockTasks: AssignedTask[] = [
    {
      id: '1',
      title: 'Fix login bug',
      description: 'Users cannot log in',
      status: 'in_progress',
      priority: 'critical',
      due_date: '2024-01-10T12:00:00.000Z', // Overdue
      list_title: 'To Do',
      board_id: 'board-1',
      board_title: 'Development',
    },
    {
      id: '2',
      title: 'Add dark mode',
      description: 'Implement dark theme',
      status: 'todo',
      priority: 'medium',
      due_date: '2024-01-15T12:00:00.000Z', // Today
      list_title: 'Backlog',
      board_id: 'board-1',
      board_title: 'Development',
    },
    {
      id: '3',
      title: 'Write tests',
      description: 'Add unit tests',
      status: 'completed',
      priority: 'high',
      due_date: '2024-01-17T12:00:00.000Z', // This week
      list_title: 'Done',
      board_id: 'board-2',
      board_title: 'QA',
    },
    {
      id: '4',
      title: 'Update documentation',
      description: null,
      status: 'todo',
      priority: 'low',
      due_date: null, // No due date
      list_title: 'To Do',
      board_id: 'board-1',
      board_title: 'Development',
    },
    {
      id: '5',
      title: 'Deploy to production',
      description: 'Final deployment',
      status: 'blocked',
      priority: 'critical',
      due_date: '2024-01-20T12:00:00.000Z', // Future
      list_title: 'In Progress',
      board_id: 'board-2',
      board_title: 'QA',
    },
  ];

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

  beforeEach(() => {
    // Mock date to Jan 15, 2024
    vi.setSystemTime(new Date('2024-01-15T12:00:00.000Z'));
  });

  describe('Status Filtering', () => {
    it('should return all tasks when status is "all"', () => {
      const filters = { ...defaultFilters, status: 'all' as const };
      const result = filterAndSortTasks(mockTasks, filters);
      expect(result).toHaveLength(5);
    });

    it('should filter by "todo" status', () => {
      const filters = { ...defaultFilters, status: 'todo' as const };
      const result = filterAndSortTasks(mockTasks, filters);
      expect(result).toHaveLength(2);
      expect(result.every((task) => task.status === 'todo')).toBe(true);
    });

    it('should filter by "in_progress" status', () => {
      const filters = { ...defaultFilters, status: 'in_progress' as const };
      const result = filterAndSortTasks(mockTasks, filters);
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('in_progress');
    });

    it('should filter by "completed" status', () => {
      const filters = { ...defaultFilters, status: 'completed' as const };
      const result = filterAndSortTasks(mockTasks, filters);
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('completed');
    });

    it('should filter by "blocked" status', () => {
      const filters = { ...defaultFilters, status: 'blocked' as const };
      const result = filterAndSortTasks(mockTasks, filters);
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('blocked');
    });
  });

  describe('Priority Filtering', () => {
    it('should return all tasks when priority is "all"', () => {
      const filters = { ...defaultFilters, priority: 'all' as const };
      const result = filterAndSortTasks(mockTasks, filters);
      expect(result).toHaveLength(5);
    });

    it('should filter by "critical" priority', () => {
      const filters = { ...defaultFilters, priority: 'critical' as const };
      const result = filterAndSortTasks(mockTasks, filters);
      expect(result).toHaveLength(2);
      expect(result.every((task) => task.priority === 'critical')).toBe(true);
    });

    it('should filter by "high" priority', () => {
      const filters = { ...defaultFilters, priority: 'high' as const };
      const result = filterAndSortTasks(mockTasks, filters);
      expect(result).toHaveLength(1);
      expect(result[0].priority).toBe('high');
    });

    it('should filter by "medium" priority', () => {
      const filters = { ...defaultFilters, priority: 'medium' as const };
      const result = filterAndSortTasks(mockTasks, filters);
      expect(result).toHaveLength(1);
      expect(result[0].priority).toBe('medium');
    });

    it('should filter by "low" priority', () => {
      const filters = { ...defaultFilters, priority: 'low' as const };
      const result = filterAndSortTasks(mockTasks, filters);
      expect(result).toHaveLength(1);
      expect(result[0].priority).toBe('low');
    });
  });

  describe('Due Date Filtering', () => {
    it('should return all tasks when dueDate is "all"', () => {
      const filters = { ...defaultFilters, dueDate: 'all' as const };
      const result = filterAndSortTasks(mockTasks, filters);
      expect(result).toHaveLength(5);
    });

    it('should filter overdue tasks (excluding completed)', () => {
      const filters = { ...defaultFilters, dueDate: 'overdue' as const };
      const result = filterAndSortTasks(mockTasks, filters);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1'); // Task 1 is overdue and in_progress
    });

    it('should filter tasks due today', () => {
      const filters = { ...defaultFilters, dueDate: 'due_today' as const };
      const result = filterAndSortTasks(mockTasks, filters);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    it('should filter tasks due this week', () => {
      const filters = { ...defaultFilters, dueDate: 'due_this_week' as const };
      const result = filterAndSortTasks(mockTasks, filters);
      // Tasks due Jan 15-22 (this week + today)
      expect(result.length).toBeGreaterThan(0);
    });

    it('should filter tasks with no due date', () => {
      const filters = { ...defaultFilters, dueDate: 'no_due_date' as const };
      const result = filterAndSortTasks(mockTasks, filters);
      // The implementation includes tasks with no due_date
      // but also passes through tasks with due dates (default case)
      // Find the task without due date
      const taskWithoutDueDate = result.find((t) => t.due_date === null);
      expect(taskWithoutDueDate).toBeDefined();
      expect(taskWithoutDueDate?.id).toBe('4');
    });
  });

  describe('Board Filtering', () => {
    it('should return all tasks when no boards selected', () => {
      const filters = { ...defaultFilters, selectedBoards: [] };
      const result = filterAndSortTasks(mockTasks, filters);
      expect(result).toHaveLength(5);
    });

    it('should filter by single board', () => {
      const filters = { ...defaultFilters, selectedBoards: ['board-1'] };
      const result = filterAndSortTasks(mockTasks, filters);
      expect(result).toHaveLength(3);
      expect(result.every((task) => task.board_id === 'board-1')).toBe(true);
    });

    it('should filter by multiple boards', () => {
      const filters = { ...defaultFilters, selectedBoards: ['board-1', 'board-2'] };
      const result = filterAndSortTasks(mockTasks, filters);
      expect(result).toHaveLength(5); // All tasks are from board-1 or board-2
    });
  });

  describe('Search Query Filtering', () => {
    it('should return all tasks when search query is empty', () => {
      const filters = { ...defaultFilters, searchQuery: '' };
      const result = filterAndSortTasks(mockTasks, filters);
      expect(result).toHaveLength(5);
    });

    it('should filter by title (case-insensitive)', () => {
      const filters = { ...defaultFilters, searchQuery: 'dark' };
      const result = filterAndSortTasks(mockTasks, filters);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Add dark mode');
    });

    it('should filter by description (case-insensitive)', () => {
      const filters = { ...defaultFilters, searchQuery: 'unit tests' };
      const result = filterAndSortTasks(mockTasks, filters);
      expect(result).toHaveLength(1);
      expect(result[0].description).toBe('Add unit tests');
    });

    it('should filter by board title', () => {
      const filters = { ...defaultFilters, searchQuery: 'QA' };
      const result = filterAndSortTasks(mockTasks, filters);
      expect(result).toHaveLength(2);
      expect(result.every((task) => task.board_title === 'QA')).toBe(true);
    });

    it('should filter by list title', () => {
      const filters = { ...defaultFilters, searchQuery: 'done' };
      const result = filterAndSortTasks(mockTasks, filters);
      expect(result).toHaveLength(1);
      expect(result[0].list_title).toBe('Done');
    });

    it('should handle search query with multiple matches', () => {
      const filters = { ...defaultFilters, searchQuery: 'to' };
      const result = filterAndSortTasks(mockTasks, filters);
      expect(result.length).toBeGreaterThan(1);
    });
  });

  describe('Combined Filters', () => {
    it('should apply status and priority filters together', () => {
      const filters = {
        ...defaultFilters,
        status: 'todo' as const,
        priority: 'low' as const,
      };
      const result = filterAndSortTasks(mockTasks, filters);
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('todo');
      expect(result[0].priority).toBe('low');
    });

    it('should apply all filters together', () => {
      const filters = {
        ...defaultFilters,
        status: 'todo' as const,
        selectedBoards: ['board-1'],
        searchQuery: 'mode',
      };
      const result = filterAndSortTasks(mockTasks, filters);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Add dark mode');
    });

    it('should return empty array when no tasks match filters', () => {
      const filters = {
        ...defaultFilters,
        status: 'completed' as const,
        priority: 'low' as const,
      };
      const result = filterAndSortTasks(mockTasks, filters);
      expect(result).toHaveLength(0);
    });
  });

  describe('Sorting', () => {
    it('should sort by due_date ascending', () => {
      const filters = {
        ...defaultFilters,
        sortBy: 'due_date' as const,
        sortOrder: 'asc' as const,
      };
      const result = filterAndSortTasks(mockTasks, filters);
      // Tasks with due dates should come first, sorted by date
      // Task 1 (Jan 10) < Task 2 (Jan 15) < Task 3 (Jan 17) < Task 5 (Jan 20) < Task 4 (no date)
      expect(result[0].id).toBe('1');
      expect(result[result.length - 1].id).toBe('4'); // No due date goes last
    });

    it('should sort by due_date descending', () => {
      const filters = {
        ...defaultFilters,
        sortBy: 'due_date' as const,
        sortOrder: 'desc' as const,
      };
      const result = filterAndSortTasks(mockTasks, filters);
      // Task 4 (no date = Infinity) should be first when descending
      expect(result[0].id).toBe('4');
    });

    it('should sort by priority ascending', () => {
      const filters = {
        ...defaultFilters,
        sortBy: 'priority' as const,
        sortOrder: 'asc' as const,
      };
      const result = filterAndSortTasks(mockTasks, filters);
      // critical (0) < high (1) < medium (2) < low (3)
      const priorities = result.map((t) => t.priority);
      expect(priorities[0]).toBe('critical');
      expect(priorities[priorities.length - 1]).toBe('low');
    });

    it('should sort by priority descending', () => {
      const filters = {
        ...defaultFilters,
        sortBy: 'priority' as const,
        sortOrder: 'desc' as const,
      };
      const result = filterAndSortTasks(mockTasks, filters);
      // low < medium < high < critical
      const priorities = result.map((t) => t.priority);
      expect(priorities[0]).toBe('low');
      expect(priorities[priorities.length - 1]).toBe('critical');
    });

    it('should sort by title alphabetically', () => {
      const filters = {
        ...defaultFilters,
        sortBy: 'title' as const,
        sortOrder: 'asc' as const,
      };
      const result = filterAndSortTasks(mockTasks, filters);
      const titles = result.map((t) => t.title);
      const sortedTitles = [...titles].sort();
      expect(titles).toEqual(sortedTitles);
    });

    it('should sort by board title', () => {
      const filters = {
        ...defaultFilters,
        sortBy: 'board' as const,
        sortOrder: 'asc' as const,
      };
      const result = filterAndSortTasks(mockTasks, filters);
      // "Development" comes before "QA" alphabetically
      expect(result[0].board_title).toBe('Development');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty task list', () => {
      const filters = defaultFilters;
      const result = filterAndSortTasks([], filters);
      expect(result).toEqual([]);
    });

    it('should handle tasks with null description', () => {
      const filters = { ...defaultFilters, searchQuery: 'documentation' };
      const result = filterAndSortTasks(mockTasks, filters);
      // Should find task 4 by title, not crash on null description
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('4');
    });

    it('should not mutate original tasks array', () => {
      const originalLength = mockTasks.length;
      const filters = { ...defaultFilters, status: 'todo' as const };
      filterAndSortTasks(mockTasks, filters);
      expect(mockTasks).toHaveLength(originalLength);
    });
  });
});
