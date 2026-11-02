import { useAuthStore } from "@/features/auth/authStore";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { getMembersByInstitution } from "@/mocks/data/library/members";

/**
 * Resolves the logged-in demo user to a LibraryMembership record by name
 * match within the active institution. Phase 3's Student entity will
 * replace this with a real membershipId on the user record.
 */
export function useCurrentMembership() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const { institutionId } = useInstitutionData();
  if (!currentUser) return null;
  return getMembersByInstitution(institutionId).find((m) => m.memberName === currentUser.name) ?? null;
}
