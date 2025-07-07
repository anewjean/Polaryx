import { create } from "zustand";

interface MessageProfile {
  nickname: string;
  timestamp: number; // 날짜를 number로 저장
  image: string;
}

interface MessageProfileStore {
  profiles: MessageProfile[];
  addProfile: (profile: MessageProfile) => void;
}

export const useMessageProfileStore = create<MessageProfileStore>((set) => ({
  profiles: [],
  addProfile: (profile) => set((state) => ({ profiles: [...state.profiles, profile] })),
}));
