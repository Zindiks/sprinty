import { useEffect } from "react";
import { useSearchDialog } from "@/contexts/SearchContext";
import { CommandPalette } from "./CommandPalette";

/**
 * GlobalSearch Component
 *
 * Provides global command palette with search and quick actions:
 * - Cmd+K / Ctrl+K: Open command palette
 * - /: Open command palette (when not in input field)
 *
 * Phase 3: Now includes quick actions alongside search
 *
 * This component should be mounted at the app root level.
 */
export function GlobalSearch() {
  const { searchOpen, setSearchOpen, openSearch } = useSearchDialog();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openSearch();
        return;
      }

      // "/" key - only if not in an input field
      if (e.key === "/" && !isInputElement(e.target)) {
        e.preventDefault();
        openSearch();
        return;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [openSearch]);

  return <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />;
}

/**
 * Helper function to check if the event target is an input element
 * Prevents "/" shortcut from triggering when user is typing in input fields
 */
function isInputElement(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();
  const isContentEditable = target.isContentEditable;

  return (
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    isContentEditable
  );
}
