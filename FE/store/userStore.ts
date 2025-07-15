import { create } from "zustand";
import { Profile } from "@/apis/profileApi";
import { getUsers } from "@/apis/userApi";

interface UserState {
  users: Record<string, Profile[]>; // key: workspaceId, value: users
  loadingUsers: Record<string, boolean>;
  refreshTrigger: Record<string, number>;
  
  // 사용자 목록 불러오기
  fetchUsers: (workspaceId: string) => Promise<Profile[]>;
  
  // 새로고침 트리거 업데이트
  triggerRefresh: (workspaceId: string) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: {},
  loadingUsers: {},
  refreshTrigger: {},
  
  fetchUsers: async (workspaceId: string) => {
    // 로딩 상태 설정
    set((state) => ({
      loadingUsers: {
        ...state.loadingUsers,
        [workspaceId]: true,
      },
    }));
    
    try {
      // API 호출
      const usersData = await getUsers(workspaceId);
      
      // 상태 업데이트
      set((state) => ({
        users: {
          ...state.users,
          [workspaceId]: usersData,
        },
        loadingUsers: {
          ...state.loadingUsers,
          [workspaceId]: false,
        },
      }));
      
      return usersData;
    } catch (error) {
      console.error("회원 목록을 불러오는데 실패했습니다:", error);
      
      // 로딩 상태 업데이트
      set((state) => ({
        loadingUsers: {
          ...state.loadingUsers,
          [workspaceId]: false,
        },
      }));
      
      return [];
    }
  },
  
  triggerRefresh: (workspaceId: string) => {
    set((state) => ({
      refreshTrigger: {
        ...state.refreshTrigger,
        [workspaceId]: (state.refreshTrigger[workspaceId] || 0) + 1,
      },
    }));
  },
}));
