import { Navigate } from "react-router-dom";
import { useAuthStore } from "./authStore";
import { landingPathFor } from "./roleRouting";
import { ComingSoon } from "@/components/common/ComingSoon";

export function PortalIndexRedirect() {
  const currentUser = useAuthStore((s) => s.currentUser);
  if (!currentUser) return <ComingSoon title="Your Portal" phase="sign-in" />;
  const path = landingPathFor(currentUser.role);
  if (path === "/portal") return <ComingSoon title="Your Portal" phase="a future phase" />;
  return <Navigate to={path} replace />;
}
