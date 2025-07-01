import { create } from "zustand";

interface MessageStore {
  message: string;
  setMessage: (msg: string) => void;
  sendFlag: boolean;
  setSendFlag: (flag: boolean) => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
  message: "",
  setMessage: (msg) => set({ message: msg }),
  sendFlag: false,
  setSendFlag: (flag) => set({ sendFlag: flag }),
}));
