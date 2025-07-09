"use client";

import { create } from "zustand";

interface ProfileStore {
  isOpen: boolean;
  setOpen: () => void;
  setClose: () => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  isOpen: false,
  setOpen: () => set({ isOpen: true }),
  setClose: () => set({ isOpen: false }),
}));
