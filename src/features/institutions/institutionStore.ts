import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { InstitutionType } from "@/types";
import { storageKey } from "@/lib/storage";

interface InstitutionState {
  activeInstitutionId: InstitutionType;
  setInstitution: (id: InstitutionType) => void;
}

export const useInstitutionStore = create<InstitutionState>()(
  persist(
    (set) => ({
      activeInstitutionId: "school",
      setInstitution: (id) => set({ activeInstitutionId: id }),
    }),
    { name: storageKey("institution") },
  ),
);
