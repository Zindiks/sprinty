import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DateTime } from 'luxon';
import {
  formatDueDate,
  formatDueDateWithTime,
  formatDueDateShort,
  formatDueDateDisplay,
  isDueToday,
  isTomorrow,
  isDueThisWeek,
  isOverdue,
  getDueDateStatus,
  getDueDateColor,
  getHoursUntilDue,
  getDaysUntilDue,
  getRelativeTime,
  toISOString,
  parseISOToDate,
  startOfDay,
  endOfDay,
  addDays,
  subtractDays,
  getQuickDatePresets,
} from '@/lib/dateUtils';

describe('dateUtils', () => {
  // Fixed "now" date for consistent testing
  const mockNow = new Date('2024-01-15T12:00:00.000Z');

  beforeEach(() => {
    // Mock Luxon's "now" to return a consistent date
    vi.setSystemTime(mockNow);
  });

  afterEach(() => {
    // Restore real time after each test
    vi.useRealTimers();
  });

  describe('Formatting Functions', () => {
    describe('formatDueDate', () => {
      it('should format ISO string with default format', () => {
        const date = '2024-01-20T10:00:00.000Z';
        const result = formatDueDate(date);
        expect(result).toBe('Jan 20, 2024');
      });

      it('should format Date object with default format', () => {
        const date = new Date('2024-01-20T10:00:00.000Z');
        const result = formatDueDate(date);
        expect(result).toBe('Jan 20, 2024');
      });

      it('should format with custom format string', () => {
        const date = '2024-01-20T10:00:00.000Z';
        const result = formatDueDate(date, 'yyyy-MM-dd');
        expect(result).toBe('2024-01-20');
      });
    });

    describe('formatDueDateWithTime', () => {
      it('should format ISO string with time', () => {
        const date = '2024-01-20T14:30:00.000Z';
        const result = formatDueDateWithTime(date);
        // Note: Result depends on system timezone, so we just check format
        expect(result).toMatch(/\w{3} \d{2}, \d{4} \d{1,2}:\d{2} (AM|PM)/);
      });

      it('should format Date object with time', () => {
        const date = new Date('2024-01-20T14:30:00.000Z');
        const result = formatDueDateWithTime(date);
        expect(result).toMatch(/\w{3} \d{2}, \d{4} \d{1,2}:\d{2} (AM|PM)/);
      });
    });

    describe('formatDueDateShort', () => {
      it('should format ISO string to short format', () => {
        const date = '2024-01-20T10:00:00.000Z';
        const result = formatDueDateShort(date);
        expect(result).toBe('Jan 20');
      });

      it('should format Date object to short format', () => {
        const date = new Date('2024-01-20T10:00:00.000Z');
        const result = formatDueDateShort(date);
        expect(result).toBe('Jan 20');
      });
    });

    describe('formatDueDateDisplay', () => {
      it('should display "Today at" for today dates', () => {
        const todayDate = '2024-01-15T14:30:00.000Z';
        const result = formatDueDateDisplay(todayDate);
        expect(result).toMatch(/^Today at \d{1,2}:\d{2} (AM|PM)$/);
      });

      it('should display "Tomorrow at" for tomorrow dates', () => {
        const tomorrowDate = '2024-01-16T14:30:00.000Z';
        const result = formatDueDateDisplay(tomorrowDate);
        expect(result).toMatch(/^Tomorrow at \d{1,2}:\d{2} (AM|PM)$/);
      });

      it('should display weekday with time for this week', () => {
        const thisWeekDate = '2024-01-17T14:30:00.000Z';
        const result = formatDueDateDisplay(thisWeekDate);
        expect(result).toMatch(/^\w{3}, \d{1,2}:\d{2} (AM|PM)$/);
      });

      it('should display full date for future dates beyond this week', () => {
        const futureDate = '2024-02-20T10:00:00.000Z';
        const result = formatDueDateDisplay(futureDate);
        expect(result).toBe('Feb 20, 2024');
      });
    });
  });

  describe('Comparison Functions', () => {
    describe('isDueToday', () => {
      it('should return true for today date (ISO string)', () => {
        const todayDate = '2024-01-15T18:00:00.000Z';
        expect(isDueToday(todayDate)).toBe(true);
      });

      it('should return true for today date (Date object)', () => {
        const todayDate = new Date('2024-01-15T18:00:00.000Z');
        expect(isDueToday(todayDate)).toBe(true);
      });

      it('should return false for yesterday', () => {
        const yesterdayDate = '2024-01-14T12:00:00.000Z';
        expect(isDueToday(yesterdayDate)).toBe(false);
      });

      it('should return false for tomorrow', () => {
        const tomorrowDate = '2024-01-16T12:00:00.000Z';
        expect(isDueToday(tomorrowDate)).toBe(false);
      });
    });

    describe('isTomorrow', () => {
      it('should return true for tomorrow date (ISO string)', () => {
        const tomorrowDate = '2024-01-16T12:00:00.000Z';
        expect(isTomorrow(tomorrowDate)).toBe(true);
      });

      it('should return true for tomorrow date (Date object)', () => {
        const tomorrowDate = new Date('2024-01-16T12:00:00.000Z');
        expect(isTomorrow(tomorrowDate)).toBe(true);
      });

      it('should return false for today', () => {
        const todayDate = '2024-01-15T12:00:00.000Z';
        expect(isTomorrow(todayDate)).toBe(false);
      });

      it('should return false for day after tomorrow', () => {
        const dayAfterTomorrow = '2024-01-17T12:00:00.000Z';
        expect(isTomorrow(dayAfterTomorrow)).toBe(false);
      });
    });

    describe('isDueThisWeek', () => {
      it('should return true for date within current week', () => {
        const thisWeekDate = '2024-01-17T12:00:00.000Z'; // Wednesday
        expect(isDueThisWeek(thisWeekDate)).toBe(true);
      });

      it('should return true for today (which is in current week)', () => {
        const todayDate = '2024-01-15T12:00:00.000Z';
        expect(isDueThisWeek(todayDate)).toBe(true);
      });

      it('should return false for date in next week', () => {
        const nextWeekDate = '2024-01-22T12:00:00.000Z';
        expect(isDueThisWeek(nextWeekDate)).toBe(false);
      });

      it('should return false for date in previous week', () => {
        const lastWeekDate = '2024-01-08T12:00:00.000Z';
        expect(isDueThisWeek(lastWeekDate)).toBe(false);
      });
    });

    describe('isOverdue', () => {
      it('should return true for past date', () => {
        const pastDate = '2024-01-10T12:00:00.000Z';
        expect(isOverdue(pastDate)).toBe(true);
      });

      it('should return false for future date', () => {
        const futureDate = '2024-01-20T12:00:00.000Z';
        expect(isOverdue(futureDate)).toBe(false);
      });

      it('should return true for date earlier today', () => {
        const earlierToday = '2024-01-15T10:00:00.000Z';
        expect(isOverdue(earlierToday)).toBe(true);
      });

      it('should return false for date later today', () => {
        const laterToday = '2024-01-15T14:00:00.000Z';
        expect(isOverdue(laterToday)).toBe(false);
      });
    });
  });

  describe('Calculation Functions', () => {
    describe('getHoursUntilDue', () => {
      it('should return positive hours for future date', () => {
        const futureDate = '2024-01-15T18:00:00.000Z'; // 6 hours from mock now
        const result = getHoursUntilDue(futureDate);
        expect(result).toBe(6);
      });

      it('should return negative hours for past date', () => {
        const pastDate = '2024-01-15T06:00:00.000Z'; // 6 hours before mock now
        const result = getHoursUntilDue(pastDate);
        expect(result).toBe(-6);
      });

      it('should return approximately 24 hours for tomorrow same time', () => {
        const tomorrowDate = '2024-01-16T12:00:00.000Z';
        const result = getHoursUntilDue(tomorrowDate);
        expect(result).toBe(24);
      });
    });

    describe('getDaysUntilDue', () => {
      it('should return positive days for future date', () => {
        const futureDate = '2024-01-20T12:00:00.000Z'; // 5 days from mock now
        const result = getDaysUntilDue(futureDate);
        expect(result).toBe(5);
      });

      it('should return negative days for past date', () => {
        const pastDate = '2024-01-10T12:00:00.000Z'; // 5 days before mock now
        const result = getDaysUntilDue(pastDate);
        expect(result).toBe(-5);
      });

      it('should return 0 for same day', () => {
        const sameDayDate = '2024-01-15T18:00:00.000Z';
        const result = getDaysUntilDue(sameDayDate);
        expect(result).toBe(0);
      });
    });

    describe('getRelativeTime', () => {
      it('should return relative time string for past date', () => {
        const pastDate = '2024-01-14T12:00:00.000Z'; // 1 day ago
        const result = getRelativeTime(pastDate);
        expect(result).toContain('ago');
      });

      it('should return relative time string for future date', () => {
        const futureDate = '2024-01-16T12:00:00.000Z'; // 1 day from now
        const result = getRelativeTime(futureDate);
        expect(result).toContain('in');
      });
    });

    describe('addDays', () => {
      it('should add days to a date', () => {
        const date = new Date('2024-01-15T12:00:00.000Z');
        const result = addDays(date, 5);
        expect(result.toISOString()).toBe('2024-01-20T12:00:00.000Z');
      });

      it('should handle negative days (subtract)', () => {
        const date = new Date('2024-01-15T12:00:00.000Z');
        const result = addDays(date, -5);
        expect(result.toISOString()).toBe('2024-01-10T12:00:00.000Z');
      });
    });

    describe('subtractDays', () => {
      it('should subtract days from a date', () => {
        const date = new Date('2024-01-15T12:00:00.000Z');
        const result = subtractDays(date, 5);
        expect(result.toISOString()).toBe('2024-01-10T12:00:00.000Z');
      });

      it('should handle negative days (add)', () => {
        const date = new Date('2024-01-15T12:00:00.000Z');
        const result = subtractDays(date, -5);
        expect(result.toISOString()).toBe('2024-01-20T12:00:00.000Z');
      });
    });
  });

  describe('Status & Utility Functions', () => {
    describe('getDueDateStatus', () => {
      it('should return "overdue" for past dates', () => {
        const pastDate = '2024-01-10T12:00:00.000Z';
        expect(getDueDateStatus(pastDate)).toBe('overdue');
      });

      it('should return "today" for today dates', () => {
        const todayDate = '2024-01-15T18:00:00.000Z';
        expect(getDueDateStatus(todayDate)).toBe('today');
      });

      it('should return "tomorrow" for tomorrow dates', () => {
        const tomorrowDate = '2024-01-16T12:00:00.000Z';
        expect(getDueDateStatus(tomorrowDate)).toBe('tomorrow');
      });

      it('should return "this-week" for dates within current week', () => {
        const thisWeekDate = '2024-01-17T12:00:00.000Z';
        expect(getDueDateStatus(thisWeekDate)).toBe('this-week');
      });

      it('should return "upcoming" for future dates beyond this week', () => {
        const futureDate = '2024-02-15T12:00:00.000Z';
        expect(getDueDateStatus(futureDate)).toBe('upcoming');
      });
    });

    describe('getDueDateColor', () => {
      it('should return "destructive" for overdue dates', () => {
        const pastDate = '2024-01-10T12:00:00.000Z';
        expect(getDueDateColor(pastDate)).toBe('destructive');
      });

      it('should return "warning" for today dates', () => {
        const todayDate = '2024-01-15T18:00:00.000Z';
        expect(getDueDateColor(todayDate)).toBe('warning');
      });

      it('should return "info" for tomorrow dates', () => {
        const tomorrowDate = '2024-01-16T12:00:00.000Z';
        expect(getDueDateColor(tomorrowDate)).toBe('info');
      });

      it('should return "info" for this week dates', () => {
        const thisWeekDate = '2024-01-17T12:00:00.000Z';
        expect(getDueDateColor(thisWeekDate)).toBe('info');
      });

      it('should return "success" for upcoming dates', () => {
        const futureDate = '2024-02-15T12:00:00.000Z';
        expect(getDueDateColor(futureDate)).toBe('success');
      });
    });

    describe('toISOString', () => {
      it('should convert Date to ISO string', () => {
        const date = new Date('2024-01-15T12:00:00.000Z');
        const result = toISOString(date);
        // Luxon can return either Z or +00:00 format for UTC
        expect(result).toMatch(/2024-01-15T12:00:00\.000(Z|\+00:00)/);
      });
    });

    describe('parseISOToDate', () => {
      it('should convert ISO string to Date object', () => {
        const isoString = '2024-01-15T12:00:00.000Z';
        const result = parseISOToDate(isoString);
        expect(result).toBeInstanceOf(Date);
        expect(result.toISOString()).toBe(isoString);
      });
    });

    describe('startOfDay', () => {
      it('should return start of day (midnight)', () => {
        const date = new Date('2024-01-15T18:30:45.123Z');
        const result = startOfDay(date);
        const dt = DateTime.fromJSDate(result);
        expect(dt.hour).toBe(0);
        expect(dt.minute).toBe(0);
        expect(dt.second).toBe(0);
        expect(dt.millisecond).toBe(0);
      });
    });

    describe('endOfDay', () => {
      it('should return end of day (last millisecond)', () => {
        const date = new Date('2024-01-15T10:30:45.123Z');
        const result = endOfDay(date);
        const dt = DateTime.fromJSDate(result);
        expect(dt.hour).toBe(23);
        expect(dt.minute).toBe(59);
        expect(dt.second).toBe(59);
        expect(dt.millisecond).toBe(999);
      });
    });

    describe('getQuickDatePresets', () => {
      it('should return all preset dates', () => {
        const presets = getQuickDatePresets();
        expect(presets).toHaveProperty('today');
        expect(presets).toHaveProperty('tomorrow');
        expect(presets).toHaveProperty('nextWeek');
        expect(presets).toHaveProperty('nextMonth');
      });

      it('should return today preset as end of today', () => {
        const presets = getQuickDatePresets();
        const todayDt = DateTime.fromJSDate(presets.today);
        expect(todayDt.day).toBe(15);
        expect(todayDt.month).toBe(1);
        expect(todayDt.year).toBe(2024);
        expect(todayDt.hour).toBe(23);
        expect(todayDt.minute).toBe(59);
      });

      it('should return tomorrow preset as end of tomorrow', () => {
        const presets = getQuickDatePresets();
        const tomorrowDt = DateTime.fromJSDate(presets.tomorrow);
        expect(tomorrowDt.day).toBe(16);
        expect(tomorrowDt.month).toBe(1);
        expect(tomorrowDt.year).toBe(2024);
      });

      it('should return next week preset as 7 days from now', () => {
        const presets = getQuickDatePresets();
        const nextWeekDt = DateTime.fromJSDate(presets.nextWeek);
        expect(nextWeekDt.day).toBe(22);
        expect(nextWeekDt.month).toBe(1);
        expect(nextWeekDt.year).toBe(2024);
      });

      it('should return next month preset as ~30 days from now', () => {
        const presets = getQuickDatePresets();
        const nextMonthDt = DateTime.fromJSDate(presets.nextMonth);
        expect(nextMonthDt.month).toBe(2);
        expect(nextMonthDt.year).toBe(2024);
      });
    });
  });
});
