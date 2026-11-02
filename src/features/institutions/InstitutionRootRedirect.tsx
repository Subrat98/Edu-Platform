import { Navigate } from "react-router-dom";
import { useInstitutionStore } from "./institutionStore";

export function InstitutionRootRedirect() {
  const activeInstitutionId = useInstitutionStore((s) => s.activeInstitutionId);
  return <Navigate to={`/${activeInstitutionId}`} replace />;
}
