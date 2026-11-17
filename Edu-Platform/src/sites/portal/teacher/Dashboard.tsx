import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Award, CalendarCheck, Clock, GraduationCap, PenSquare } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useAuthStore } from "@/features/auth/authStore";
import { staffService } from "@/features/staff/staffService";
import { timetableService } from "@/features/academics/timetableService";
import { queryKeys } from "@/lib/queryKeys";

const TODAY = "Friday";

export default function TeacherDashboard() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const staffId = currentUser?.staffId;

  const { data: assignments, isLoading: loadingAssignments } = useQuery({
    queryKey: queryKeys.staffAssignments(staffId ?? ""),
    queryFn: () => staffService.getAssignments(staffId!),
    enabled: !!staffId,
  });
  const { data: timetable, isLoading: loadingTimetable } = useQuery({
    queryKey: queryKeys.timetableStaff(staffId ?? ""),
    queryFn: () => timetableService.getForStaff(staffId!),
    enabled: !!staffId,
  });

  if (!staffId) {
    return (
      <div>
        <AdminPageHeader title="Welcome" description="Your teaching schedule at a glance." />
        <EmptyState title="No staff record linked" description="This demo persona isn't linked to a staff record." />
      </div>
    );
  }

  if (loadingAssignments || loadingTimetable) return <PageLoadingSkeleton />;

  const todaysPeriods = (timetable ?? []).filter((e) => e.day === TODAY).sort((a, b) => a.periodIndex - b.periodIndex);
  const classCount = new Set((assignments ?? []).map((a) => `${a.classOrProgrammeId}::${a.section}`)).size;
  const isNaacFaculty = currentUser?.role === "faculty";

  return (
    <div>
      <AdminPageHeader title={`Welcome, ${currentUser?.name?.split(" ").pop() ?? "Teacher"}`} description="Your teaching schedule and classes at a glance." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Classes Taught" value={classCount} icon={GraduationCap} />
        <StatCard label="Weekly Periods" value={(timetable ?? []).length} icon={Clock} />
        <StatCard label="Today's Periods" value={todaysPeriods.length} icon={CalendarCheck} />
        <StatCard label="Subjects" value={new Set((assignments ?? []).map((a) => a.subject)).size} icon={PenSquare} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Today's schedule ({TODAY})</CardTitle>
          </CardHeader>
          <CardContent>
            {todaysPeriods.length === 0 ? (
              <EmptyState title="No periods today" />
            ) : (
              <ul className="divide-border divide-y">
                {todaysPeriods.map((p) => (
                  <li key={p.id} className="flex items-center justify-between py-2 text-sm">
                    <span>
                      {p.startTime}–{p.endTime} · {p.subject}
                    </span>
                    <Badge variant="outline">{p.room}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">My classes</CardTitle>
          </CardHeader>
          <CardContent>
            {(assignments ?? []).length === 0 ? (
              <EmptyState title="No classes assigned" />
            ) : (
              <ul className="divide-border divide-y">
                {(assignments ?? []).map((a) => (
                  <li key={`${a.classOrProgrammeId}::${a.section}::${a.subject}`} className="flex items-center justify-between py-2 text-sm">
                    <span>
                      {a.className} — {a.section}
                    </span>
                    <span className="text-muted-foreground">{a.subject}</span>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/portal/teacher/classes" className="text-accent mt-3 inline-block text-sm hover:underline">
              View all classes →
            </Link>
          </CardContent>
        </Card>

        {isNaacFaculty ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Award className="size-4" /> NAAC & IQAC
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <p className="text-muted-foreground text-sm">
                Upload research papers, course files, mentor-mentee registers and FDP certificates as accreditation evidence.
              </p>
              <Link to="/admin/naac" className="text-accent text-sm font-medium hover:underline">
                Open NAAC workspace →
              </Link>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
