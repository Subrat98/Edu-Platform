import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { InstitutionType } from "@/types";
import { storageKey } from "@/lib/storage";

export interface InstitutionVisibility {
  school: boolean;
  college: boolean;
}

export type WebsiteContentMode = "both" | "school_only" | "college_only";

interface InstitutionState {
  activeInstitutionId: InstitutionType;
  visibility: InstitutionVisibility;
  setInstitution: (id: InstitutionType) => void;
  setVisibility: (visibility: Partial<InstitutionVisibility>) => void;
  setContentMode: (mode: WebsiteContentMode) => void;
}

export const DEFAULT_VISIBILITY: InstitutionVisibility = {
  school: true,
  college: true,
};

export const useInstitutionStore = create<InstitutionState>()(
  persist(
    (set, get) => ({
      activeInstitutionId: "school",
      visibility: DEFAULT_VISIBILITY,
      setInstitution: (id) => {
        const state = get();
        const visibility = state?.visibility ?? DEFAULT_VISIBILITY;
        // If the requested wing is hidden, fall back to the other wing if it is visible
        if (!visibility[id]) {
          const fallback = id === "school" ? "college" : "school";
          if (visibility[fallback]) {
            set({ activeInstitutionId: fallback });
            return;
          }
        }
        set({ activeInstitutionId: id });
      },
      setVisibility: (newVisibility) => {
        const current = get()?.visibility ?? DEFAULT_VISIBILITY;
        const updated: InstitutionVisibility = {
          school: newVisibility.school ?? current.school ?? true,
          college: newVisibility.college ?? current.college ?? true,
        };
        // Ensure at least one institution wing remains visible
        if (!updated.school && !updated.college) {
          return;
        }
        let active = get()?.activeInstitutionId ?? "school";
        if (!updated[active]) {
          active = updated.college ? "college" : "school";
        }
        set({ visibility: updated, activeInstitutionId: active });
      },
      setContentMode: (mode) => {
        if (mode === "both") {
          set({
            visibility: { school: true, college: true },
          });
        } else if (mode === "school_only") {
          set({
            visibility: { school: true, college: false },
            activeInstitutionId: "school",
          });
        } else if (mode === "college_only") {
          set({
            visibility: { school: false, college: true },
            activeInstitutionId: "college",
          });
        }
      },
    }),
    {
      name: storageKey("institution"),
      partialize: (state) => ({
        activeInstitutionId: state.activeInstitutionId,
        visibility: state.visibility ?? DEFAULT_VISIBILITY,
      }),
    },
  ),
);
