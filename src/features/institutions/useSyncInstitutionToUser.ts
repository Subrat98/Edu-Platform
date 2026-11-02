import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/authStore";
import { useInstitutionStore } from "./institutionStore";

/**
 * Admin and portal screens must always reflect the signed-in user's own
 * institution, never whatever the public-site institution switcher was
 * last set to (e.g. a visitor browsing /college right before logging in
 * as a School librarian). Call this once at the root of the admin/portal
 * layout so every page under it — all of which read the active
 * institution via useInstitutionData() — gets the correct tenant.
 */
export function useSyncInstitutionToUser() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const activeInstitutionId = useInstitutionStore((s) => s.activeInstitutionId);
  const setInstitution = useInstitutionStore((s) => s.setInstitution);

  useEffect(() => {
    if (currentUser && currentUser.institutionId !== activeInstitutionId) {
      setInstitution(currentUser.institutionId);
    }
  }, [currentUser, activeInstitutionId, setInstitution]);
}
