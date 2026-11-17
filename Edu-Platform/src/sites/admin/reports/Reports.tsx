import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { studentService } from "@/features/students/studentService";
import { financeService } from "@/features/finance/financeService";
import { examinationService } from "@/features/examinations/examinationService";
import { libraryService } from "@/features/library/libraryService";
import { queryKeys } from "@/lib/queryKeys";
import { useChartColors } from "@/lib/useChartColors";
import { downloadCsv } from "@/lib/downloadCsv";

export default function Reports() {
  const { institutionId } = useInstitutionData();
  const CHART_COLORS = useChartColors(institutionId);

  const { data: students, isLoading: loadingStudents } = useQuery({ queryKey: queryKeys.students(institutionId), queryFn: () => studentService.list(institutionId) });
  const { data: invoices, isLoading: loadingInvoices } = useQuery({ queryKey: queryKeys.invoices(institutionId), queryFn: () => financeService.listInvoices(institutionId) });
  const { data: performance, isLoading: loadingPerformance } = useQuery({
    queryKey: ["examPerformance", institutionId],
    queryFn: () => examinationService.getPerformanceByClass(institutionId),
  });
  const { data: libraryStats } = useQuery({ queryKey: queryKeys.libraryDashboard(institutionId), queryFn: () => libraryService.getDashboardStats(institutionId) });

  const enrollmentByClass = useMemo(() => {
    const counts = new Map<string, number>();
    (students ?? [])
      .filter((s) => s.status === "Active")
      .forEach((s) => counts.set(s.classOrProgrammeName, (counts.get(s.classOrProgrammeName) ?? 0) + 1));
    return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
  }, [students]);

  const invoiceStatusBreakdown = useMemo(() => {
    const counts = new Map<string, number>();
    (invoices ?? []).forEach((i) => counts.set(i.status, (counts.get(i.status) ?? 0) + 1));
    return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
  }, [invoices]);

  const isLoading = loadingStudents || loadingInvoices || loadingPerformance;
  if (isLoading) return <PageLoadingSkeleton />;

  return (
    <div>
      <AdminPageHeader title="Reports & Analytics" description="Cross-cutting enrollment, fee collection, exam performance and library usage." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Active enrollment by class / programme</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={enrollmentByClass} margin={{ left: 4, right: 8, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-30} textAnchor="end" height={70} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {enrollmentByClass.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Invoice status breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={invoiceStatusBreakdown} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                  {invoiceStatusBreakdown.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs">
              {invoiceStatusBreakdown.map((d, i) => (
                <span key={d.name} className="flex items-center gap-1.5">
                  <span className="inline-block size-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                  {d.name} ({d.value})
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Exam average % by class / programme</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={performance ?? []} margin={{ left: 4, right: 8, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="className" tick={{ fontSize: 10 }} interval={0} angle={-30} textAnchor="end" height={70} />
                <YAxis tick={{ fontSize: 11 }} unit="%" domain={[0, 100]} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="averagePercent" radius={[4, 4, 0, 0]} fill={CHART_COLORS[1 % CHART_COLORS.length]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Library usage snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total titles</span>
              <span className="font-medium">{libraryStats?.totalTitles ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Active loans</span>
              <span className="font-medium">{libraryStats?.activeLoans ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Overdue loans</span>
              <span className="text-destructive font-medium">{libraryStats?.overdueLoans ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Outstanding fines</span>
              <span className="text-warning font-medium">₹{libraryStats?.outstandingFines ?? 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Export data</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="gap-1.5"
              onClick={() => {
                const rows: (string | number)[][] = [["Name", "Admission No.", "Class/Programme", "Section", "Status"]];
                (students ?? []).forEach((s) => rows.push([s.name, s.admissionNo, s.classOrProgrammeName, s.section, s.status]));
                downloadCsv("students.csv", rows);
                toast.success("Student directory downloaded");
              }}
            >
              <Download className="size-4" /> Students (CSV)
            </Button>
            <Button
              variant="outline"
              className="gap-1.5"
              onClick={() => {
                const rows: (string | number)[][] = [["Invoice No.", "Student", "Amount", "Paid", "Status", "Due Date"]];
                (invoices ?? []).forEach((i) => rows.push([i.invoiceNo, i.studentId, i.amount, i.amountPaid, i.status, i.dueDate]));
                downloadCsv("invoices.csv", rows);
                toast.success("Invoices downloaded");
              }}
            >
              <Download className="size-4" /> Invoices (CSV)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
