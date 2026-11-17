import { useQuery } from "@tanstack/react-query";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useAuthStore } from "@/features/auth/authStore";
import { timetableService } from "@/features/academics/timetableService";
import { queryKeys } from "@/lib/queryKeys";
import type { TimetableEntry } from "@/types";

const DAYS: TimetableEntry["day"][] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function MyTimetable() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const staffId = currentUser?.staffId;

  const { data: entries, isLoading } = useQuery({
    queryKey: queryKeys.timetableStaff(staffId ?? ""),
    queryFn: () => timetableService.getForStaff(staffId!),
    enabled: !!staffId,
  });

  if (!staffId) return <EmptyState title="No staff record linked" />;
  if (isLoading) return <PageLoadingSkeleton />;
  if (!entries || entries.length === 0) return <EmptyState title="No timetable found" />;

  const periods = Array.from(new Set(entries.map((e) => e.periodIndex))).sort((a, b) => a - b);

  return (
    <div>
      <AdminPageHeader title="My Timetable" description="Your weekly teaching schedule across all classes." />
      <div className="overflow-x-auto">
        <table className="border-border w-full min-w-[800px] border-collapse rounded-lg border text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="border-border w-24 border p-2 text-left font-medium">Period</th>
              {DAYS.map((d) => (
                <th key={d} className="border-border border p-2 text-left font-medium">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map((periodIndex) => {
              const first = entries.find((e) => e.periodIndex === periodIndex);
              return (
                <tr key={periodIndex}>
                  <td className="border-border text-muted-foreground border p-2 text-xs">{first ? `${first.startTime}–${first.endTime}` : periodIndex + 1}</td>
                  {DAYS.map((day) => {
                    const entry = entries.find((e) => e.day === day && e.periodIndex === periodIndex);
                    return (
                      <td key={day} className="border-border border p-2 align-top">
                        {entry ? (
                          <>
                            <p className="font-medium">{entry.subject}</p>
                            <p className="text-muted-foreground text-xs">
                              {entry.classOrProgrammeId.startsWith("prog") ? entry.section : `Sec. ${entry.section}`}
                            </p>
                            <p className="text-muted-foreground text-xs">{entry.room}</p>
                          </>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
