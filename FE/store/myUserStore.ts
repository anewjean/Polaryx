import { create } from "zustand";

interface MyUserState {
  userId: string | null;
  setUserId: (id: string) => void;
}

export const useMyUserStore = create<MyUserState>((set) => ({
  userId: null,
  setUserId: (id) => set({ userId: id }),
}));
