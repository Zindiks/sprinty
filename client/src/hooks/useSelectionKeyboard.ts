import { useEffect } from 'react';
import { useSelectionStore } from './store/useSelectionStore';

interface UseSelectionKeyboardProps {
  listId: string;
  cardIds: string[];
  enabled?: boolean;
}

/**
 * Hook to handle keyboard shortcuts for card selection
 * - Cmd/Ctrl + A: Select all cards in the list
 * - Escape: Clear selection
 */
export const useSelectionKeyboard = ({
  listId,
  cardIds,
  enabled = true,
}: UseSelectionKeyboardProps) => {
  const { selectionMode, selectAll, clearSelection } = useSelectionStore();

  useEffect(() => {
    if (!enabled || !selectionMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + A - Select all cards in this list
      if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
        e.preventDefault();
        selectAll(cardIds);
      }

      // Escape - Clear selection
      if (e.key === 'Escape') {
        e.preventDefault();
        clearSelection();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectionMode, enabled, listId, cardIds, selectAll, clearSelection]);
};
