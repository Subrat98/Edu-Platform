import { AppSidebarShell } from "@/components/admin/AppSidebarShell";
import {
  adminNavGroups,
  admissionOfficerNavGroups,
  accountantNavGroups,
  platformNavGroups,
  naacRoleNavGroups,
} from "@/components/admin/adminNavConfig";
import { useAuthStore } from "@/features/auth/authStore";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";

export function AdminLayout() {
  const role = useAuthStore((s) => s.currentUser?.role);
  const { institutionId } = useInstitutionData();
  const groups =
    role === "platform_admin"
      ? [...adminNavGroups, ...platformNavGroups]
      : role === "admission_officer"
        ? admissionOfficerNavGroups
        : role === "accountant"
          ? accountantNavGroups
          : role === "iqac_coordinator" || role === "hod" || role === "faculty"
            ? naacRoleNavGroups
            : adminNavGroups;

  // NAAC & IQAC is a college-accreditation concern — hide it from School
  // admin sessions rather than threading institutionId through the whole
  // NAAC module for a single-tenant-per-type demo.
  const visibleGroups = institutionId === "college" ? groups : groups.filter((g) => g.label !== "NAAC & IQAC");

  return <AppSidebarShell groups={visibleGroups} brandLabel="EduPlatform Admin" />;
}
