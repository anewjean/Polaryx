import { create } from "zustand";

interface SectionStore {
    openSections: Record<string, boolean>;
    toggleSection: (id: string) => void;
}

export const useSectionStore = create<SectionStore>((set) => ({    
    openSections: {} as Record<string, boolean>,
    toggleSection: (id: string) =>
      set(state => ({
        openSections: {
          ...state.openSections,
          [id]: !state.openSections[id],
        },
      })),
  }));