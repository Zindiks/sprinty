import { create } from 'zustand';

interface SelectionStore {
  selectedCards: Set<string>;
  selectionMode: boolean;
  lastSelectedCardId: string | null;
  toggleSelection: (cardId: string) => void;
  toggleCard: (cardId: string) => void;
  selectAll: (cardIds: string[]) => void;
  selectRange: (startId: string, endId: string, allCardIds: string[]) => void;
  clearSelection: () => void;
  isSelected: (cardId: string) => boolean;
  isCardSelected: (cardId: string) => boolean;
  getSelectedCount: () => number;
  getSelectedCards: () => string[];
  setSelectionMode: (mode: boolean) => void;
}

export const useSelectionStore = create<SelectionStore>((set, get) => ({
  selectedCards: new Set<string>(),
  selectionMode: false,
  lastSelectedCardId: null,

  toggleSelection: (cardId: string) => {
    set((state) => {
      const newSelected = new Set(state.selectedCards);
      if (newSelected.has(cardId)) {
        newSelected.delete(cardId);
      } else {
        newSelected.add(cardId);
      }
      return { selectedCards: newSelected, lastSelectedCardId: cardId };
    });
  },

  toggleCard: (cardId: string) => {
    set((state) => {
      const newSelected = new Set(state.selectedCards);
      if (newSelected.has(cardId)) {
        newSelected.delete(cardId);
      } else {
        newSelected.add(cardId);
      }
      return { selectedCards: newSelected, lastSelectedCardId: cardId };
    });
  },

  selectAll: (cardIds: string[]) => {
    set({ selectedCards: new Set(cardIds) });
  },

  selectRange: (startId: string, endId: string, allCardIds: string[]) => {
    const startIndex = allCardIds.indexOf(startId);
    const endIndex = allCardIds.indexOf(endId);

    if (startIndex === -1 || endIndex === -1) return;

    const [start, end] = startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex];
    const rangeIds = allCardIds.slice(start, end + 1);

    set((state) => {
      const newSelected = new Set(state.selectedCards);
      rangeIds.forEach((id) => newSelected.add(id));
      return { selectedCards: newSelected, lastSelectedCardId: endId };
    });
  },

  clearSelection: () => {
    set({ selectedCards: new Set<string>(), lastSelectedCardId: null });
  },

  isSelected: (cardId: string) => {
    return get().selectedCards.has(cardId);
  },

  isCardSelected: (cardId: string) => {
    return get().selectedCards.has(cardId);
  },

  getSelectedCount: () => {
    return get().selectedCards.size;
  },

  getSelectedCards: () => {
    return Array.from(get().selectedCards);
  },

  setSelectionMode: (mode: boolean) => {
    set({ selectionMode: mode });
    if (!mode) {
      get().clearSelection();
    }
  },
}));
