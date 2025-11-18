import { vi } from "vitest";
import { DateTime, Settings } from "luxon";

/**
 * Test helper utilities
 */

/**
 * Mock Luxon's DateTime.now() to return a specific date
 * Useful for testing date-related functions
 *
 * @param date - The date to mock as "now"
 * @returns cleanup function to restore the original DateTime.now()
 *
 * @example
 * const cleanup = mockLuxonNow(new Date('2024-01-15'));
 * // ... run tests
 * cleanup();
 */
export function mockLuxonNow(date: Date) {
  const originalNow = Settings.now;
  Settings.now = () => date.getTime();

  return () => {
    Settings.now = originalNow;
  };
}

/**
 * Mock the current system time for Vitest
 *
 * @param date - The date to set as current time
 *
 * @example
 * mockSystemTime(new Date('2024-01-15'));
 */
export function mockSystemTime(date: Date | string) {
  vi.setSystemTime(date);
}

/**
 * Restore the system time to real time
 */
export function restoreSystemTime() {
  vi.useRealTimers();
}

/**
 * Wait for a specific amount of time
 *
 * @param ms - milliseconds to wait
 *
 * @example
 * await wait(100);
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create a mock localStorage for tests
 */
export function createMockLocalStorage() {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }),
  };
}

/**
 * Suppress console errors during tests
 * Useful when testing error boundaries or expected errors
 *
 * @example
 * const restore = suppressConsoleError();
 * // ... test code that triggers errors
 * restore();
 */
export function suppressConsoleError() {
  const originalError = console.error;
  console.error = vi.fn();

  return () => {
    console.error = originalError;
  };
}

/**
 * Suppress console warnings during tests
 */
export function suppressConsoleWarning() {
  const originalWarn = console.warn;
  console.warn = vi.fn();

  return () => {
    console.warn = originalWarn;
  };
}

/**
 * Create a mock File object for testing file uploads
 *
 * @param name - file name
 * @param size - file size in bytes
 * @param type - MIME type
 */
export function createMockFile(
  name: string = "test.txt",
  size: number = 1024,
  type: string = "text/plain"
): File {
  const blob = new Blob(["a".repeat(size)], { type });
  return new File([blob], name, { type });
}

/**
 * Assert that a date string is valid ISO 8601 format
 */
export function expectValidISODate(dateString: string | undefined) {
  if (!dateString) {
    throw new Error("Expected date string, got undefined");
  }
  const date = DateTime.fromISO(dateString);
  if (!date.isValid) {
    throw new Error(`Invalid ISO date: ${dateString}`);
  }
}

/**
 * Compare two dates ignoring milliseconds
 */
export function expectDatesEqual(date1: Date | string, date2: Date | string) {
  const dt1 = DateTime.fromJSDate(new Date(date1)).startOf("second");
  const dt2 = DateTime.fromJSDate(new Date(date2)).startOf("second");
  return dt1.equals(dt2);
}

/**
 * Check if a date is within a range
 */
export function isDateInRange(
  date: Date | string,
  start: Date | string,
  end: Date | string
): boolean {
  const dt = DateTime.fromJSDate(new Date(date));
  const startDt = DateTime.fromJSDate(new Date(start));
  const endDt = DateTime.fromJSDate(new Date(end));
  return dt >= startDt && dt <= endDt;
}
