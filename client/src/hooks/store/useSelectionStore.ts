import { create } from "zustand";

interface SelectionState {
  // State
  selectedCardIds: Set<string>;
  selectionMode: boolean;
  lastSelectedCardId: string | null;

  // Actions
  toggleCard: (cardId: string) => void;
  selectCard: (cardId: string) => void;
  deselectCard: (cardId: string) => void;
  selectRange: (startId: string, endId: string, allCardIds: string[]) => void;
  selectAll: (cardIds: string[]) => void;
  clearSelection: () => void;
  setSelectionMode: (enabled: boolean) => void;

  // Getters
  isCardSelected: (cardId: string) => boolean;
  getSelectedCount: () => number;
  getSelectedCards: () => string[];
}

export const useSelectionStore = create<SelectionState>((set, get) => ({
  // Initial state
  selectedCardIds: new Set<string>(),
  selectionMode: false,
  lastSelectedCardId: null,

  // Toggle a card's selection state
  toggleCard: (cardId: string) => {
    const { selectedCardIds } = get();
    const newSelectedCardIds = new Set(selectedCardIds);

    if (newSelectedCardIds.has(cardId)) {
      newSelectedCardIds.delete(cardId);
    } else {
      newSelectedCardIds.add(cardId);
    }

    set({
      selectedCardIds: newSelectedCardIds,
      lastSelectedCardId: cardId,
    });
  },

  // Select a card (ensure it's selected)
  selectCard: (cardId: string) => {
    const { selectedCardIds } = get();
    const newSelectedCardIds = new Set(selectedCardIds);
    newSelectedCardIds.add(cardId);

    set({
      selectedCardIds: newSelectedCardIds,
      lastSelectedCardId: cardId,
    });
  },

  // Deselect a card (ensure it's not selected)
  deselectCard: (cardId: string) => {
    const { selectedCardIds } = get();
    const newSelectedCardIds = new Set(selectedCardIds);
    newSelectedCardIds.delete(cardId);

    set({
      selectedCardIds: newSelectedCardIds,
    });
  },

  // Select a range of cards (Shift+Click)
  selectRange: (startId: string, endId: string, allCardIds: string[]) => {
    const startIndex = allCardIds.indexOf(startId);
    const endIndex = allCardIds.indexOf(endId);

    if (startIndex === -1 || endIndex === -1) return;

    const [minIndex, maxIndex] =
      startIndex < endIndex
        ? [startIndex, endIndex]
        : [endIndex, startIndex];

    const { selectedCardIds } = get();
    const newSelectedCardIds = new Set(selectedCardIds);

    // Select all cards in the range
    for (let i = minIndex; i <= maxIndex; i++) {
      newSelectedCardIds.add(allCardIds[i]);
    }

    set({
      selectedCardIds: newSelectedCardIds,
      lastSelectedCardId: endId,
    });
  },

  // Select all cards (Cmd+A)
  selectAll: (cardIds: string[]) => {
    const newSelectedCardIds = new Set(cardIds);

    set({
      selectedCardIds: newSelectedCardIds,
      lastSelectedCardId: cardIds[cardIds.length - 1] || null,
    });
  },

  // Clear all selections
  clearSelection: () => {
    set({
      selectedCardIds: new Set<string>(),
      lastSelectedCardId: null,
    });
  },

  // Set selection mode
  setSelectionMode: (enabled: boolean) => {
    set({
      selectionMode: enabled,
    });

    // Clear selection when exiting selection mode
    if (!enabled) {
      set({
        selectedCardIds: new Set<string>(),
        lastSelectedCardId: null,
      });
    }
  },

  // Check if a card is selected
  isCardSelected: (cardId: string) => {
    const { selectedCardIds } = get();
    return selectedCardIds.has(cardId);
  },

  // Get count of selected cards
  getSelectedCount: () => {
    const { selectedCardIds } = get();
    return selectedCardIds.size;
  },

  // Get array of selected card IDs
  getSelectedCards: () => {
    const { selectedCardIds } = get();
    return Array.from(selectedCardIds);
  },
}));
