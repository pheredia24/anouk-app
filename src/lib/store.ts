import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Id } from "../../convex/_generated/dataModel";

interface AppState {
  selectedProfileId: Id<"profiles"> | null;
  setSelectedProfileId: (id: Id<"profiles">) => void;
  clearSelectedProfile: () => void;
  currentExerciseId: Id<"exercises"> | null;
  setCurrentExerciseId: (id: Id<"exercises"> | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedProfileId: null,
      setSelectedProfileId: (id) => set({ selectedProfileId: id }),
      clearSelectedProfile: () => set({ selectedProfileId: null }),
      currentExerciseId: null,
      setCurrentExerciseId: (id) => set({ currentExerciseId: id }),
    }),
    {
      name: 'duolingo-app-storage',
    }
  )
);
