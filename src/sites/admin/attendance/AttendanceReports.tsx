import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { Users, UserCheck, UserX, Clock } from "lucide-react";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { attendanceService } from "@/features/attendance/attendanceService";
import { studentService } from "@/features/students/studentService";
import { queryKeys } from "@/lib/queryKeys";
import { useChartColors } from "@/lib/useChartColors";

const LAST_10_DAYS = ["2026-10-19", "2026-10-20", "2026-10-21", "2026-10-22", "2026-10-23", "2026-10-26", "2026-10-27", "2026-10-28", "2026-10-29", "2026-10-30"];

export default function AttendanceReports() {
  const { institutionId } = useInstitutionData();
  const CHART_COLORS = useChartColors(institutionId);
  const [date, setDate] = useState("2026-10-30");

  const { data: summary, isLoading } = useQuery({ queryKey: queryKeys.attendanceDaily(institutionId, date), queryFn: () => attendanceService.getDailySummary(institutionId, date) });
  const { data: students } = useQuery({ queryKey: queryKeys.students(institutionId), queryFn: () => studentService.list(institutionId) });

  const trendQueries = useQuery({
    queryKey: ["attendanceTrend", institutionId],
    queryFn: async () => {
      const results = await Promise.all(LAST_10_DAYS.map((d) => attendanceService.getDailySummary(institutionId, d)));
      return LAST_10_DAYS.map((d, i) => ({ date: d.slice(5), percentage: results[i]!.percentage }));
    },
  });

  const lowAttendance = useMemo(() => {
    return (students ?? []).slice(0, 8).map((s) => ({ name: s.name, percentage: 60 + ((s.id.length * 7) % 35) })).sort((a, b) => a.percentage - b.percentage).slice(0, 5);
  }, [students]);

  if (isLoading) return <PageLoadingSkeleton />;

  return (
    <div>
      <AdminPageHeader title="Attendance Reports" description="Daily summaries and trends across the institution." />

      <div className="mb-4 max-w-xs">
        <Label>Date</Label>
        <Input type="date" className="mt-1.5" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Marked" value={summary?.total ?? 0} icon={Users} />
        <StatCard label="Present" value={summary?.present ?? 0} icon={UserCheck} tone="success" />
        <StatCard label="Absent" value={summary?.absent ?? 0} icon={UserX} tone="error" />
        <StatCard label="Late" value={summary?.late ?? 0} icon={Clock} tone="warning" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">10-day attendance trend</CardTitle>
          </CardHeader>
          <CardContent>
            {trendQueries.data ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={trendQueries.data} margin={{ left: 4, right: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" domain={[0, 100]} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Bar dataKey="percentage" radius={[4, 4, 0, 0]} fill={CHART_COLORS[0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <PageLoadingSkeleton />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lowest attendance (demo sample)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-border divide-y">
              {lowAttendance.map((s) => (
                <li key={s.name} className="flex items-center justify-between py-2 text-sm">
                  <span>{s.name}</span>
                  <Badge variant="outline" className={s.percentage < 75 ? "border-destructive/30 text-destructive" : ""}>
                    {s.percentage}%
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
