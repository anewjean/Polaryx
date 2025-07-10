import { create } from "zustand";
import { Tab } from "@/apis/tabApi";

interface TabState {
  needsRefresh: boolean;
  refreshTabs: () => void;
  resetRefresh: () => void;
}

interface TabInfoState {
  tabInfoCache: Record<string, Tab>; // { [tabId: string]: Tab }
  setTabInfo: (tabId: string, tabInfo: Tab) => void;
}

export const useTabStore = create<TabState>((set) => ({
  needsRefresh: false,
  refreshTabs: () => set({ needsRefresh: true }),
  resetRefresh: () => set({ needsRefresh: false }),
}));

export const useTabInfoStore = create<TabInfoState>((set) => ({
  tabInfoCache: {},
  setTabInfo: (tabId, tabInfo) =>
    set((state) => ({
      tabInfoCache: {
        ...state.tabInfoCache,
        [tabId]: tabInfo,
      },
    })),
}));