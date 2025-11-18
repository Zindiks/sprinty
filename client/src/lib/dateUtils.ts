import { DateTime } from 'luxon';

/**
 * Date utility functions using Luxon
 * Handles date formatting, comparisons, and status calculations for due dates
 */

/**
 * Format a date string or Date object to a readable format
 * @param date - ISO date string or Date object
 * @param format - Luxon format tokens (default: 'MMM dd, yyyy')
 * @returns Formatted date string
 */
export const formatDueDate = (date: string | Date, format: string = 'MMM dd, yyyy'): string => {
  const dt = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date);
  return dt.toFormat(format);
};

/**
 * Format date with time
 */
export const formatDueDateWithTime = (date: string | Date): string => {
  const dt = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date);
  return dt.toFormat('MMM dd, yyyy h:mm a');
};

/**
 * Format date for short display (e.g., "Jan 15")
 */
export const formatDueDateShort = (date: string | Date): string => {
  const dt = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date);
  return dt.toFormat('MMM dd');
};

/**
 * Check if a date is today
 */
export const isDueToday = (date: string | Date): boolean => {
  const dt = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date);
  const today = DateTime.now().startOf('day');
  return dt.startOf('day').equals(today);
};

/**
 * Check if a date is within the current week
 */
export const isDueThisWeek = (date: string | Date): boolean => {
  const dt = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date);
  const now = DateTime.now();
  const weekStart = now.startOf('week');
  const weekEnd = now.endOf('week');
  return dt >= weekStart && dt <= weekEnd;
};

/**
 * Check if a date is in the past (overdue)
 */
export const isOverdue = (date: string | Date): boolean => {
  const dt = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date);
  return dt < DateTime.now();
};

/**
 * Check if a date is tomorrow
 */
export const isTomorrow = (date: string | Date): boolean => {
  const dt = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date);
  const tomorrow = DateTime.now().plus({ days: 1 }).startOf('day');
  return dt.startOf('day').equals(tomorrow);
};

/**
 * Get due date status for UI styling
 */
export const getDueDateStatus = (
  date: string | Date,
): 'overdue' | 'today' | 'tomorrow' | 'this-week' | 'upcoming' => {
  if (isOverdue(date)) return 'overdue';
  if (isDueToday(date)) return 'today';
  if (isTomorrow(date)) return 'tomorrow';
  if (isDueThisWeek(date)) return 'this-week';
  return 'upcoming';
};

/**
 * Get hours until due date
 */
export const getHoursUntilDue = (date: string | Date): number => {
  const dt = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date);
  const now = DateTime.now();
  return Math.floor(dt.diff(now, 'hours').hours);
};

/**
 * Get days until due date
 */
export const getDaysUntilDue = (date: string | Date): number => {
  const dt = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date);
  const now = DateTime.now();
  return Math.floor(dt.diff(now, 'days').days);
};

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 */
export const getRelativeTime = (date: string | Date): string => {
  const dt = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date);
  return dt.toRelative() || '';
};

/**
 * Get color variant for due date badge
 */
export const getDueDateColor = (
  date: string | Date,
): 'destructive' | 'warning' | 'info' | 'success' => {
  const status = getDueDateStatus(date);
  switch (status) {
    case 'overdue':
      return 'destructive'; // Red
    case 'today':
      return 'warning'; // Orange/Yellow
    case 'tomorrow':
    case 'this-week':
      return 'info'; // Blue
    default:
      return 'success'; // Green
  }
};

/**
 * Convert Date to ISO string for API
 */
export const toISOString = (date: Date): string => {
  return DateTime.fromJSDate(date).toISO() || '';
};

/**
 * Parse ISO string to Date object
 */
export const parseISOToDate = (isoString: string): Date => {
  return DateTime.fromISO(isoString).toJSDate();
};

/**
 * Get start of day for a date
 */
export const startOfDay = (date: Date): Date => {
  return DateTime.fromJSDate(date).startOf('day').toJSDate();
};

/**
 * Get end of day for a date
 */
export const endOfDay = (date: Date): Date => {
  return DateTime.fromJSDate(date).endOf('day').toJSDate();
};

/**
 * Add days to a date
 */
export const addDays = (date: Date, days: number): Date => {
  return DateTime.fromJSDate(date).plus({ days }).toJSDate();
};

/**
 * Subtract days from a date
 */
export const subtractDays = (date: Date, days: number): Date => {
  return DateTime.fromJSDate(date).minus({ days }).toJSDate();
};

/**
 * Get quick date presets
 */
export const getQuickDatePresets = () => {
  const now = DateTime.now();
  return {
    today: now.endOf('day').toJSDate(),
    tomorrow: now.plus({ days: 1 }).endOf('day').toJSDate(),
    nextWeek: now.plus({ weeks: 1 }).endOf('day').toJSDate(),
    nextMonth: now.plus({ months: 1 }).endOf('day').toJSDate(),
  };
};

/**
 * Format due date with relative time for display
 * Examples: "Today at 5:00 PM", "Tomorrow", "Jan 15, 2025"
 */
export const formatDueDateDisplay = (date: string | Date): string => {
  const dt = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date);

  if (isDueToday(date)) {
    return `Today at ${dt.toFormat('h:mm a')}`;
  }

  if (isTomorrow(date)) {
    return `Tomorrow at ${dt.toFormat('h:mm a')}`;
  }

  if (isDueThisWeek(date)) {
    return dt.toFormat('EEE, h:mm a'); // "Mon, 5:00 PM"
  }

  return dt.toFormat('MMM dd, yyyy');
};
