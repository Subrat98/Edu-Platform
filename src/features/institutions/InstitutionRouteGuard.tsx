import { useEffect } from "react";
import { useInstitutionStore } from "./institutionStore";
import type { InstitutionType } from "@/types";

/**
 * Syncs the /school or /college URL segment to the global institution
 * store on mount and whenever the route is visited. The URL is the
 * source of truth for which institution is active; the header switcher
 * is just a navigation shortcut onto these routes (see Header.tsx).
 */
export function InstitutionRouteGuard({
  type,
  children,
}: {
  type: InstitutionType;
  children: React.ReactNode;
}) {
  const activeInstitutionId = useInstitutionStore((s) => s.activeInstitutionId);
  const setInstitution = useInstitutionStore((s) => s.setInstitution);

  useEffect(() => {
    if (activeInstitutionId !== type) setInstitution(type);
  }, [type, activeInstitutionId, setInstitution]);

  return <>{children}</>;
}
