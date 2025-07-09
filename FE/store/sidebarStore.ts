"use client";

import { create } from "zustand";

interface SectionStore {
    openSections: Record<string, boolean>;
    toggleSection: (id: string) => void;
}

export const useSectionStore = create<SectionStore>((set) => ({    
  openSections: {
    "1": true,
    "2": true,
    "3": true,
    "4": true,
  },
  toggleSection: (id: string) =>
    set(state => ({
      openSections: {
        ...state.openSections,
        [id]: !state.openSections[id],
      },
    })),
}));