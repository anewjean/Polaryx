"use client";

import { create } from "zustand";

interface ProfileStore {
  isOpen: boolean;
  userId: string | null;
  setUserId: (id: string) => void;
  setOpen: () => void;
  setClose: () => void;
  openWithId: (id: string) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  isOpen: false,
  userId: null,
  setUserId: (id) => set({ userId: id }),
  setOpen: () => set({ isOpen: true }),
  setClose: () => set({ isOpen: false }),
  openWithId: (id) => set({ userId: id, isOpen: true }),
}));
