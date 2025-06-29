import { create } from "zustand";

interface ChannelStore {
  channelWidth: number;
  setChannelWidth: (width: number) => void;
}

export const useChannelStore = create<ChannelStore>((set) => ({
  channelWidth: 80,
  setChannelWidth: (width) => set({ channelWidth: width }),
}));
