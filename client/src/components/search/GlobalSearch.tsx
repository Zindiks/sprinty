import { useEffect } from "react";
import { useSearchDialog } from "@/contexts/SearchContext";
import { EnhancedSearchDialog } from "./EnhancedSearchDialog";

/**
 * GlobalSearch Component
 *
 * Provides global search functionality with keyboard shortcuts:
 * - Cmd+K / Ctrl+K: Open search
 * - /: Open search (when not in input field)
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

  return <EnhancedSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />;
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
