import { AppSidebarShell } from "@/components/admin/AppSidebarShell";
import { adminNavGroups } from "@/components/admin/adminNavConfig";

export function AdminLayout() {
  return <AppSidebarShell groups={adminNavGroups} brandLabel="EduPlatform Admin" />;
}
