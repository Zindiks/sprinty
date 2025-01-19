import { create } from "zustand"

interface StoreState {
  organization_id: string;
  setOrganizationId: (organization_id: string) => void;
  board_id: string;
  setBoardId: (board_id: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  organization_id: "",
  setOrganizationId: (organization_id: string) => set({ organization_id }),
  board_id: "",
  setBoardId: (board_id: string) => set({ board_id }),
}))
