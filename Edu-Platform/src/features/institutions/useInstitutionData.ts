import { useQuery } from "@tanstack/react-query";
import { useInstitutionStore } from "./institutionStore";
import { institutionService } from "./institutionService";
import { queryKeys } from "@/lib/queryKeys";

/**
 * The single hook every institution-aware component uses to read the
 * currently active institution's data. Combines the lightweight
 * Zustand selector (which institution is active) with the TanStack
 * Query fetch of its full record, so switching institutions
 * automatically re-renders every consumer with fresh data.
 */
export function useInstitutionData() {
  const activeInstitutionId = useInstitutionStore((s) => s.activeInstitutionId);
  const query = useQuery({
    queryKey: queryKeys.institution(activeInstitutionId),
    queryFn: () => institutionService.get(activeInstitutionId),
  });

  return {
    institutionId: activeInstitutionId,
    institution: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
