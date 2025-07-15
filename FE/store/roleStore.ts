import { create } from 'zustand';
import { Role } from '@/apis/roleApi';
import { getRoles } from '@/apis/roleApi';


interface RoleState {
  roles: Role[];
  loadingRoles: boolean;
  workspaceId: string | null;
  refreshTrigger: number;
  
  fetchRoles: (workspaceId: string) => Promise<void>;
  triggerRefresh: () => void;
}

export const useRoleStore = create<RoleState>((set, get) => ({
  roles: [],
  loadingRoles: false,
  workspaceId: null,
  refreshTrigger: 0,
  
  fetchRoles: async (workspaceId: string) => {
    // 이미 같은 워크스페이스의 데이터가 있고 로딩 중이 아니면 다시 불러오지 않음
    if (get().roles.length > 0 && get().workspaceId === workspaceId && !get().loadingRoles) {
      return;
    }
    set({ loadingRoles: true });

    try {
      const roles = await getRoles(workspaceId);
      set({ roles, workspaceId });
    } catch (error) {
      console.error('역할을 불러오는데 실패했습니다:', error);
    } finally {
      set({ loadingRoles: false });
    }
  },
  
  triggerRefresh: () => {
    set((state) => ({
      refreshTrigger: state.refreshTrigger + 1
    }));
    
    // 현재 워크스페이스 ID가 있으면 데이터 다시 불러오기
    const { workspaceId } = get();
    if (workspaceId) {
      get().fetchRoles(workspaceId);
    }
  }
}));
