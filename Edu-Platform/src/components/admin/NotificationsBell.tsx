import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Bell, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/features/auth/authStore";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { notificationService } from "@/features/notifications/notificationService";
import { studentService } from "@/features/students/studentService";
import { queryKeys } from "@/lib/queryKeys";

const CATEGORY_TONE: Record<string, string> = {
  Academics: "border-info/30 bg-info/10 text-info",
  Finance: "border-warning/30 bg-warning/10 text-warning",
  Admissions: "border-accent/30 bg-accent/10 text-accent",
  Library: "bg-muted text-muted-foreground",
  General: "bg-muted text-muted-foreground",
};

export function NotificationsBell() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const { institutionId } = useInstitutionData();

  const { data: guardian } = useQuery({
    queryKey: queryKeys.guardian(currentUser?.guardianId ?? ""),
    queryFn: () => studentService.getGuardian(currentUser!.guardianId!),
    enabled: !!currentUser?.guardianId,
  });

  const studentIds = currentUser?.studentId ? [currentUser.studentId] : guardian?.studentIds ?? [];

  const { data: notifications } = useQuery({
    queryKey: queryKeys.notifications(institutionId, currentUser?.id ?? ""),
    queryFn: () => notificationService.listFor(institutionId, currentUser!.role, studentIds),
    enabled: !!currentUser,
  });

  const list = notifications ?? [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Notifications" className="relative">
          <Bell className="size-4" />
          {list.length > 0 ? (
            <span className="bg-destructive absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full text-[10px] text-white">
              {list.length > 9 ? "9+" : list.length}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {list.length === 0 ? (
          <p className="text-muted-foreground px-2 py-4 text-center text-sm">You're all caught up.</p>
        ) : (
          <div className="max-h-80 space-y-1 overflow-y-auto">
            {list.slice(0, 15).map((n) => (
              <div key={n.id} className="hover:bg-muted/60 rounded-md px-2 py-2">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <Badge variant="outline" className={CATEGORY_TONE[n.category]}>
                    {n.category}
                  </Badge>
                  <span className="text-muted-foreground text-[11px]">{n.timestamp.slice(0, 10)}</span>
                </div>
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-muted-foreground text-xs">{n.body}</p>
              </div>
            ))}
          </div>
        )}
        <DropdownMenuSeparator />
        <Link to="/portal/notifications" className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 px-2 py-1.5 text-xs">
          <Settings2 className="size-3.5" /> Notification preferences
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
