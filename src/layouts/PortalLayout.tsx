import { Outlet } from "react-router-dom";
import { UserCircle } from "lucide-react";
import { AppSidebarShell } from "@/components/admin/AppSidebarShell";
import {
  studentNavGroups,
  librarianNavGroups,
  teacherNavGroups,
  parentNavGroups,
  examCellNavGroups,
  hodNavGroups,
} from "@/components/admin/adminNavConfig";
import { useAuthStore } from "@/features/auth/authStore";
import { useSyncInstitutionToUser } from "@/features/institutions/useSyncInstitutionToUser";
import { ROLE_LABELS } from "@/types";

function SimplePortalShell() {
  useSyncInstitutionToUser();
  const currentUser = useAuthStore((s) => s.currentUser);
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <header className="border-b border-border bg-card px-6 py-4 sm:px-10">
        <div className="flex items-center gap-2">
          <UserCircle className="text-accent size-5" />
          <span className="font-heading text-sm font-semibold">
            {currentUser ? `${currentUser.name}'s Portal` : "Portal"}
          </span>
          {currentUser ? (
            <span className="text-muted-foreground text-xs">· {ROLE_LABELS[currentUser.role]}</span>
          ) : null}
        </div>
      </header>
      <main className="flex-1 p-6 sm:p-10">
        <Outlet />
      </main>
    </div>
  );
}

export function PortalLayout() {
  const currentUser = useAuthStore((s) => s.currentUser);

  if (currentUser?.role === "student") {
    return <AppSidebarShell groups={studentNavGroups} brandLabel="Student Portal" />;
  }
  if (currentUser?.role === "librarian") {
    return <AppSidebarShell groups={librarianNavGroups} brandLabel="Librarian Desk" />;
  }
  if (currentUser?.role === "teacher" || currentUser?.role === "faculty") {
    return <AppSidebarShell groups={teacherNavGroups} brandLabel="Teacher Portal" />;
  }
  if (currentUser?.role === "parent") {
    return <AppSidebarShell groups={parentNavGroups} brandLabel="Parent Portal" />;
  }
  if (currentUser?.role === "exam_cell") {
    return <AppSidebarShell groups={examCellNavGroups} brandLabel="Examination Cell" />;
  }
  if (currentUser?.role === "hod") {
    return <AppSidebarShell groups={hodNavGroups} brandLabel="Department Portal" />;
  }
  return <SimplePortalShell />;
}
