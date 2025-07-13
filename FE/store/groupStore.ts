import { create } from "zustand";
import { Group } from "@/apis/groupApi";
import { getGroups } from "@/apis/groupApi";

interface GroupState {
  groups: Group[];
  loadingGroups: boolean;
  workspaceId: string | null;

  fetchGroups: (workspaceId: string) => Promise<void>;
}

export const useGroupStore = create<GroupState>((set, get) => ({
  groups: [],
  loadingGroups: false,
  workspaceId: null,

  fetchGroups: async (workspaceId: string) => {
    // 이미 같은 워크스페이스의 데이터가 있고 로딩 중이 아니면 다시 불러오지 않음
    if (get().groups.length > 0 && get().workspaceId === workspaceId) {
      return;
    }

    set({ loadingGroups: true });
    try {
      const groups = await getGroups(workspaceId);
      set({ groups, workspaceId });
    } catch (error) {
      console.error("그룹을 불러오는데 실패했습니다:", error);
    } finally {
      set({ loadingGroups: false });
    }
  },
}));
