import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCheck } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AvatarInitials } from "@/components/common/AvatarInitials";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { useAuthStore } from "@/features/auth/authStore";
import { attendanceService } from "@/features/attendance/attendanceService";
import { queryKeys } from "@/lib/queryKeys";
import { cn } from "@/lib/utils";
import type { AttendanceStatus } from "@/types";

const STATUSES: AttendanceStatus[] = ["Present", "Absent", "Late", "Approved Leave"];
const STATUS_CLASSES: Record<AttendanceStatus, string> = {
  Present: "border-success/40 bg-success/10 text-success",
  Absent: "border-destructive/40 bg-destructive/10 text-destructive",
  Late: "border-warning/40 bg-warning/10 text-warning",
  "Approved Leave": "border-info/40 bg-info/10 text-info",
};

export default function MarkAttendance() {
  const { institutionId } = useInstitutionData();
  const currentUser = useAuthStore((s) => s.currentUser);
  const queryClient = useQueryClient();
  const [groupKey, setGroupKey] = useState<string>("");
  const [date, setDate] = useState("2026-10-30");
  const [subject, setSubject] = useState("Daily Attendance");
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>({});

  const { data: groups, isLoading: loadingGroups } = useQuery({ queryKey: queryKeys.attendanceGroups(institutionId), queryFn: () => attendanceService.getClassGroups(institutionId) });

  const selectedGroup = groups?.find((g) => `${g.classOrProgrammeId}::${g.section}` === groupKey);

  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: queryKeys.attendanceGroupStudents(institutionId, selectedGroup?.classOrProgrammeId ?? "", selectedGroup?.section ?? ""),
    queryFn: () => attendanceService.getStudentsForGroup(institutionId, selectedGroup!.classOrProgrammeId, selectedGroup!.section),
    enabled: !!selectedGroup,
  });

  useEffect(() => {
    if (students) {
      const initial: Record<string, AttendanceStatus> = {};
      students.forEach((s) => (initial[s.id] = "Present"));
      setStatuses(initial);
    }
  }, [students]);

  const saveMutation = useMutation({
    mutationFn: () =>
      attendanceService.markAttendance(institutionId, selectedGroup!.classOrProgrammeId, selectedGroup!.section, subject, date, currentUser?.name ?? "Teacher", statuses),
    onSuccess: () => {
      toast.success("Attendance saved", { description: `${Object.keys(statuses).length} students recorded for ${date}.` });
      queryClient.invalidateQueries({ queryKey: ["attendanceDaily"] });
    },
  });

  if (loadingGroups) return <PageLoadingSkeleton />;

  return (
    <div>
      <AdminPageHeader title="Mark Attendance" description="Select a class/section and record today's attendance." />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <Label>Class / Section</Label>
          <Select value={groupKey} onValueChange={setGroupKey}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Choose a class or section" />
            </SelectTrigger>
            <SelectContent>
              {(groups ?? []).map((g) => (
                <SelectItem key={`${g.classOrProgrammeId}::${g.section}`} value={`${g.classOrProgrammeId}::${g.section}`}>
                  {g.className} — {g.section} ({g.studentCount} students)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Date</Label>
          <Input type="date" className="mt-1.5" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <Label>Subject / Period</Label>
          <Input className="mt-1.5" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
      </div>

      {!selectedGroup ? (
        <EmptyState title="Choose a class and section" description="Attendance entry will appear once you select a group above." />
      ) : loadingStudents ? (
        <PageLoadingSkeleton />
      ) : (
        <>
          <div className="mb-3 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const next: Record<string, AttendanceStatus> = {};
                (students ?? []).forEach((s) => (next[s.id] = "Present"));
                setStatuses(next);
              }}
            >
              <CheckCheck className="size-4" /> Mark all present
            </Button>
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving…" : "Save Attendance"}
            </Button>
          </div>

          <div className="border-border divide-border divide-y rounded-lg border">
            {(students ?? []).map((s) => (
              <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 p-3">
                <div className="flex items-center gap-2">
                  <AvatarInitials name={s.name} size="sm" />
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-muted-foreground text-xs">Roll {s.rollNumber}</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {STATUSES.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatuses((prev) => ({ ...prev, [s.id]: st }))}
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                        statuses[s.id] === st ? STATUS_CLASSES[st] : "border-border text-muted-foreground hover:bg-muted",
                      )}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
