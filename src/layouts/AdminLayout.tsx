import { AppSidebarShell } from "@/components/admin/AppSidebarShell";
import { adminNavGroups, admissionOfficerNavGroups, accountantNavGroups, platformNavGroups } from "@/components/admin/adminNavConfig";
import { useAuthStore } from "@/features/auth/authStore";

export function AdminLayout() {
  const role = useAuthStore((s) => s.currentUser?.role);
  const groups =
    role === "platform_admin"
      ? [...adminNavGroups, ...platformNavGroups]
      : role === "admission_officer"
        ? admissionOfficerNavGroups
        : role === "accountant"
          ? accountantNavGroups
          : adminNavGroups;
  return <AppSidebarShell groups={groups} brandLabel="EduPlatform Admin" />;
}
