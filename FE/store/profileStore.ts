import { create } from "zustand";

interface ProfileStore {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
    isOpen: false,
    setOpen: (open: boolean) => set({ isOpen: open })
}));
  