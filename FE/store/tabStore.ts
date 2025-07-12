import { create } from "zustand";
import { getTabInfo, Tab } from "@/apis/tabApi";

interface TabState {
  needsRefresh: boolean;
  refreshTabs: () => void;
  resetRefresh: () => void;
}

interface TabInfoState {
  tabInfoCache: Record<string, Tab>;
  loadingTabs: Record<string, boolean>;
  fetchTabInfo: (workspaceId: string, tabId: string) => Promise<void>;
}

export const useTabStore = create<TabState>((set) => ({
  needsRefresh: false,
  refreshTabs: () => set({ needsRefresh: true }),
  resetRefresh: () => set({ needsRefresh: false }),
}));

export const useTabInfoStore = create<TabInfoState>((set, get) => ({
  tabInfoCache: {},
  loadingTabs: {},
  fetchTabInfo: async (workspaceId, tabId) => {
    const { tabInfoCache, loadingTabs } = get();

    // 캐시에 있거나, 이미 로딩 중이면 실행하지 않음
    if (tabInfoCache[tabId] || loadingTabs[tabId]) {
      return;
    }

    // 로딩 시작
    set((state) => ({ loadingTabs: { ...state.loadingTabs, [tabId]: true } }));

    try {
      const info = await getTabInfo(workspaceId, tabId);
      // 데이터 저장
      set((state) => ({
        tabInfoCache: { ...state.tabInfoCache, [tabId]: info },
      }));
    } catch (error) {
      console.error("탭 정보 조회 실패:", error);
    } finally {
      // 로딩 종료
      set((state) => ({ loadingTabs: { ...state.loadingTabs, [tabId]: false } }));
    }
  },
}));
