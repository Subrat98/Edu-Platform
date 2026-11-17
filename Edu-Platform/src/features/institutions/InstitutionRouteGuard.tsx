import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useInstitutionStore } from "./institutionStore";
import type { InstitutionType } from "@/types";

/**
 * Syncs the /school or /college URL segment to the global institution
 * store on mount and whenever the route is visited.
 * If Super Admin has hidden this institution wing, redirects immediately
 * to the visible wing so no hidden content is accessible.
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
  const visibility = useInstitutionStore((s) => s.visibility);

  const isVisible = visibility?.[type] ?? true;
  const fallback = type === "school" ? "/college" : "/school";
  const fallbackWing = type === "school" ? "college" : "school";
  const fallbackVisible = visibility?.[fallbackWing] ?? true;

  useEffect(() => {
    if (isVisible && activeInstitutionId !== type) {
      setInstitution(type);
    }
  }, [type, activeInstitutionId, setInstitution, isVisible]);

  // Only redirect if this wing is hidden AND the other wing is actually visible (prevents infinite loop)
  if (!isVisible && fallbackVisible) {
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
}
