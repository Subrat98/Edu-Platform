import type { ReactNode } from "react";
import { useAuthStore } from "./authStore";
import type { RoleKey } from "@/types";

interface GuardProps {
  children: ReactNode;
  fallback: ReactNode;
}

export function RequireAuth({ children, fallback }: GuardProps) {
  const currentUser = useAuthStore((s) => s.currentUser);
  if (!currentUser) return <>{fallback}</>;
  return <>{children}</>;
}

interface RequireRoleProps extends GuardProps {
  roles?: RoleKey[];
}

export function RequireRole({ children, fallback, roles }: RequireRoleProps) {
  const currentUser = useAuthStore((s) => s.currentUser);
  if (!currentUser) return <>{fallback}</>;
  if (roles && roles.length > 0 && !roles.includes(currentUser.role)) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
}
