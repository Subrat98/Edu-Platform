import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useAuthStore } from "@/features/auth/authStore";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { studentService } from "@/features/students/studentService";
import { queryKeys } from "@/lib/queryKeys";
import { cn } from "@/lib/utils";
import { CalendarCheck, CalendarX, Clock, Calendar } from "lucide-react";

type AttendanceStatus = "Present" | "Absent" | "Late" | "Approved Leave" | "all";

function statusBadgeClass(status: string) {
  switch (status) {
    case "Present":
      return "border-success/30 bg-success/10 text-success";
    case "Absent":
      return "border-destructive/30 bg-destructive/10 text-destructive";
    case "Late":
      return "border-warning/30 bg-warning/10 text-warning";
    case "Approved Leave":
      return "border-blue-500/30 bg-blue-500/10 text-blue-600";
    default:
      return "";
  }
}

export default function AttendanceHistory() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const { institutionId } = useInstitutionData();
  const studentId = currentUser?.studentId;
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus>("all");

  void institutionId; // used for context, studentId is scoped per student

  const { data: attendance, isLoading } = useQuery({
    queryKey: queryKeys.studentAttendance(studentId ?? ""),
    queryFn: () => studentService.getAttendanceSummary(studentId!),
    enabled: !!studentId,
  });

  const filteredRecords = useMemo(() => {
    const records = attendance?.recent ?? [];
    if (statusFilter === "all") return records;
    return records.filter((r) => r.status === statusFilter);
  }, [attendance, statusFilter]);

  const absentDays = (attendance?.total ?? 0) - (attendance?.present ?? 0);

  if (isLoading) return <PageLoadingSkeleton />;

  if (!studentId) {
    return (
      <div>
        <AdminPageHeader title="Attendance" description="Your attendance history." />
        <EmptyState title="No student record linked" description="This account isn't linked to a student record." />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader title="Attendance" description="Your full attendance history and summary." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Attendance %"
          value={`${attendance?.percentage ?? 0}%`}
          icon={CalendarCheck}
          tone={attendance && attendance.percentage < 75 ? "warning" : "success"}
        />
        <StatCard label="Total Days" value={attendance?.total ?? 0} icon={Calendar} />
        <StatCard label="Present" value={attendance?.present ?? 0} icon={CalendarCheck} tone="success" />
        <StatCard label="Absent" value={absentDays} icon={CalendarX} tone={absentDays > 0 ? "warning" : "default"} />
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="text-base">Attendance Records</CardTitle>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as AttendanceStatus)}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Present">Present</SelectItem>
              <SelectItem value="Absent">Absent</SelectItem>
              <SelectItem value="Late">Late</SelectItem>
              <SelectItem value="Approved Leave">Approved Leave</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {filteredRecords.length === 0 ? (
            <EmptyState
              title="No records found"
              description={statusFilter === "all" ? "No attendance has been recorded yet." : `No "${statusFilter}" records found.`}
            />
          ) : (
            <ul className="divide-border divide-y">
              {filteredRecords.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Clock className="text-muted-foreground size-4 shrink-0" />
                    <div>
                      <p className="font-medium">{r.date}</p>
                      {"subject" in r && r.subject ? (
                        <p className="text-muted-foreground text-xs">{String(r.subject)}</p>
                      ) : null}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(statusBadgeClass(r.status))}
                  >
                    {r.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
