import { Navigate } from "react-router-dom";
import { useInstitutionStore } from "./institutionStore";

export function InstitutionRootRedirect() {
  const activeInstitutionId = useInstitutionStore((s) => s.activeInstitutionId) ?? "school";
  const visibility = useInstitutionStore((s) => s.visibility);

  let target: "school" | "college" = activeInstitutionId === "college" ? "college" : "school";
  if (visibility) {
    if (target === "school" && !visibility.school && visibility.college) {
      target = "college";
    } else if (target === "college" && !visibility.college && visibility.school) {
      target = "school";
    }
  }

  return <Navigate to={`/${target}`} replace />;
}
