// store/memberStore.ts
import { create } from "zustand";

interface Member {
  email: string;
  name: string;
  role_id: number;
  role_name: string;
  group_name?: string[];
  group_id?: number[];
  github?: string;
  blog?: string;
  workspace_id: string;
}

interface MemberState {
  memberList: Member[];
  setMemberList: (list: Member[]) => void;
}

export const useMemberStore = create<MemberState>((set) => ({
  memberList: [],
  setMemberList: (list) => set({ memberList: list }),
}));
