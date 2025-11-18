import { useEffect } from "react";
import { DateTime } from "luxon";
import { toISOString } from "@/lib/dateUtils";

export interface DueDateShortcuts {
  enableShortcuts: boolean;
  onSetDueDate: (date: string) => void;
}

/**
 * Hook to enable keyboard shortcuts for setting due dates
 *
 * Shortcuts:
 * - d + t: Set to today at 5 PM
 * - d + n: Set to tomorrow at 5 PM
 * - d + w: Set to end of week at 5 PM
 * - d + m: Set to end of month at 5 PM
 * - d + 3: Set to 3 days from now at 5 PM
 * - d + x: Clear due date
 */
export const useDueDateShortcuts = ({ enableShortcuts, onSetDueDate }: DueDateShortcuts) => {
  useEffect(() => {
    if (!enableShortcuts) return;

    let lastKey = "";
    let timeout: NodeJS.Timeout;

    const handleKeyPress = (event: KeyboardEvent) => {
      // Ignore shortcuts when typing in input fields
      const target = event.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      const key = event.key.toLowerCase();

      // Start shortcut sequence with 'd'
      if (key === "d" && lastKey === "") {
        lastKey = "d";
        clearTimeout(timeout);
        // Reset after 1.5 seconds of inactivity
        timeout = setTimeout(() => {
          lastKey = "";
        }, 1500);
        return;
      }

      // Handle second key in sequence
      if (lastKey === "d") {
        const now = DateTime.now();
        let dueDate: DateTime | null = null;

        switch (key) {
          case "t": // Today at 5 PM
            dueDate = now.set({ hour: 17, minute: 0, second: 0 });
            break;
          case "n": // Tomorrow at 5 PM
            dueDate = now.plus({ days: 1 }).set({ hour: 17, minute: 0, second: 0 });
            break;
          case "w": // End of week at 5 PM
            dueDate = now.endOf("week").set({ hour: 17, minute: 0, second: 0 });
            break;
          case "m": // End of month at 5 PM
            dueDate = now.endOf("month").set({ hour: 17, minute: 0, second: 0 });
            break;
          case "3": // 3 days from now at 5 PM
            dueDate = now.plus({ days: 3 }).set({ hour: 17, minute: 0, second: 0 });
            break;
          case "x": // Clear due date
            onSetDueDate("");
            lastKey = "";
            clearTimeout(timeout);
            return;
          default:
            lastKey = "";
            clearTimeout(timeout);
            return;
        }

        if (dueDate) {
          onSetDueDate(toISOString(dueDate.toJSDate()));
        }

        lastKey = "";
        clearTimeout(timeout);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      clearTimeout(timeout);
    };
  }, [enableShortcuts, onSetDueDate]);
};
