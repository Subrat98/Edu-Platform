import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DemoUser } from "@/types";
import { storageKey } from "@/lib/storage";

interface AuthState {
  currentUser: DemoUser | null;
  setUser: (user: DemoUser | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      setUser: (user) => set({ currentUser: user }),
      logout: () => set({ currentUser: null }),
    }),
    { name: storageKey("auth") },
  ),
);
