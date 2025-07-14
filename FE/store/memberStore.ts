// store/memberStore.ts
import { create } from "zustand";

interface Member {
  email: string;
  name: string;
  role: string;
  group: string;
  github: string;
  blog: string;
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
