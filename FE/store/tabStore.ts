import { create } from "zustand";

interface TabState {
  needsRefresh: boolean;
  refreshTabs: () => void;
  resetRefresh: () => void;
}

export const useTabStore = create<TabState>((set) => ({
  needsRefresh: false,
  refreshTabs: () => set({ needsRefresh: true }),
  resetRefresh: () => set({ needsRefresh: false }),
}));
