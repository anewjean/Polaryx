"use client";

import { create } from "zustand";

interface ProfileStore {
  isOpen: boolean;
  userId: Buffer | null;
  setUserId: (id: Buffer) => void;
  setOpen: () => void;
  setClose: () => void;
  openWithId: (id: Buffer | null) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  isOpen: false,
  userId: null,
  setUserId: (id) => set({ userId: id }),
  setOpen: () => set({ isOpen: true }),
  setClose: () => set({ isOpen: false }),
  openWithId: (id) => set({ userId: id, isOpen: true }),
}));
