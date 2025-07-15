import { create } from "zustand";
import { Group } from "@/apis/groupApi";
import { getGroups } from "@/apis/groupApi";

interface GroupState {
  groups: Group[];
  loadingGroups: boolean;
  workspaceId: string | null;
  refreshTrigger: number;

  fetchGroups: (workspaceId: string) => Promise<void>;
  triggerRefresh: () => void;
}

export const useGroupStore = create<GroupState>((set, get) => ({
  groups: [],
  loadingGroups: false,
  workspaceId: null,
  refreshTrigger: 0,

  fetchGroups: async (workspaceId: string) => {
    // 이미 같은 워크스페이스의 데이터가 있고 로딩 중이 아니면 다시 불러오지 않음
    if (get().groups.length > 0 && get().workspaceId === workspaceId && !get().loadingGroups) {
      return;
    }

    set({ loadingGroups: true });
    try {
      const groups = await getGroups(workspaceId);
      console.log("API 응답 데이터:", groups);
      
      // user_names 필드가 없는 경우 빈 배열로 초기화
      const processedGroups = groups.map(group => ({
        ...group,
        user_names: group.user_names || []
      }));
      
      console.log("처리된 그룹 데이터:", processedGroups);
      set({ groups: processedGroups, workspaceId });
    } catch (error) {
      console.error("그룹을 불러오는데 실패했습니다:", error);
    } finally {
      set({ loadingGroups: false });
    }
  },

  triggerRefresh: () => {
    set((state) => ({
      refreshTrigger: state.refreshTrigger + 1
    }));
    
    // 현재 워크스페이스 ID가 있으면 데이터 다시 불러오기
    const { workspaceId } = get();
    if (workspaceId) {
      get().fetchGroups(workspaceId);
    }
  },
}));
