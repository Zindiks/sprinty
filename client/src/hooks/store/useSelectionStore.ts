import { create } from 'zustand';

interface SelectionStore {
  selectedCards: Set<string>;
  selectionMode: boolean;
  toggleSelection: (cardId: string) => void;
  selectAll: (cardIds: string[]) => void;
  clearSelection: () => void;
  isSelected: (cardId: string) => boolean;
  getSelectedCount: () => number;
  getSelectedCards: () => string[];
  setSelectionMode: (mode: boolean) => void;
}

export const useSelectionStore = create<SelectionStore>((set, get) => ({
  selectedCards: new Set<string>(),
  selectionMode: false,

  toggleSelection: (cardId: string) => {
    set((state) => {
      const newSelected = new Set(state.selectedCards);
      if (newSelected.has(cardId)) {
        newSelected.delete(cardId);
      } else {
        newSelected.add(cardId);
      }
      return { selectedCards: newSelected };
    });
  },

  selectAll: (cardIds: string[]) => {
    set({ selectedCards: new Set(cardIds) });
  },

  clearSelection: () => {
    set({ selectedCards: new Set<string>() });
  },

  isSelected: (cardId: string) => {
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
