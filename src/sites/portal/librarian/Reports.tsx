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
import { libraryService } from "@/features/library/libraryService";
import { getBookTitlesByInstitution } from "@/mocks/data/library/bookTitles";
import { getMember } from "@/mocks/data/library/members";
import { queryKeys } from "@/lib/queryKeys";
import { useChartColors } from "@/lib/useChartColors";

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Reports() {
  const { institutionId } = useInstitutionData();
  const CHART_COLORS = useChartColors(institutionId);
  const { data: loans, isLoading: loadingLoans } = useQuery({ queryKey: queryKeys.libraryLoans(institutionId), queryFn: () => libraryService.listLoans(institutionId) });
  const { data: fines, isLoading: loadingFines } = useQuery({ queryKey: queryKeys.libraryFines(institutionId), queryFn: () => libraryService.listFines(institutionId) });

  const holdingsByCategory = useMemo(() => {
    const titles = getBookTitlesByInstitution(institutionId);
    const counts = new Map<string, number>();
    titles.forEach((t) => counts.set(t.category, (counts.get(t.category) ?? 0) + 1));
    return Array.from(counts.entries()).map(([category, count]) => ({ category, count }));
  }, [institutionId]);

  const loanStatusBreakdown = useMemo(() => {
    const list = loans ?? [];
    const today = "2026-10-29";
    const active = list.filter((l) => l.status === "Active" && l.dueDate >= today).length;
    const overdue = list.filter((l) => l.status === "Overdue" || (l.status === "Active" && l.dueDate < today)).length;
    const returned = list.filter((l) => l.status === "Returned").length;
    return [
      { name: "Active", value: active },
      { name: "Overdue", value: overdue },
      { name: "Returned", value: returned },
    ].filter((d) => d.value > 0);
  }, [loans]);

  if (loadingLoans || loadingFines) return <PageLoadingSkeleton />;

  return (
    <div>
      <AdminPageHeader title="Library Reports" description="Holdings, circulation and fine-collection summaries." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Holdings by category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={holdingsByCategory} margin={{ left: 4, right: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} interval={0} angle={-25} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {holdingsByCategory.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Loan status breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={loanStatusBreakdown} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                  {loanStatusBreakdown.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs">
              {loanStatusBreakdown.map((d, i) => (
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
            <CardTitle className="text-base">Export reports</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="gap-1.5"
              onClick={() => {
                const rows: (string | number)[][] = [["Member", "Book", "Issue Date", "Due Date"]];
                (loans ?? [])
                  .filter((l) => l.status === "Overdue" || (l.status === "Active" && l.dueDate < "2026-10-29"))
                  .forEach((l) => rows.push([getMember(l.membershipId)?.memberName ?? "", l.titleId, l.issueDate, l.dueDate]));
                downloadCsv("overdue-books.csv", rows);
                toast.success("Overdue report downloaded");
              }}
            >
              <Download className="size-4" /> Overdue list (CSV)
            </Button>
            <Button
              variant="outline"
              className="gap-1.5"
              onClick={() => {
                const rows: (string | number)[][] = [["Member", "Amount", "Reason", "Status"]];
                (fines ?? []).forEach((f) => rows.push([getMember(f.membershipId)?.memberName ?? "", f.assessedAmount, f.reason, f.status]));
                downloadCsv("fine-collection.csv", rows);
                toast.success("Fine collection report downloaded");
              }}
            >
              <Download className="size-4" /> Fine collection (CSV)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
