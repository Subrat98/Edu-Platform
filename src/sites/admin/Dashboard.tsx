import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  FileText,
  Megaphone,
  Image as ImageIcon,
  Clock,
  BookOpen,
  AlertTriangle,
  GraduationCap,
  ClipboardList,
  CalendarCheck,
  IndianRupee,
  Landmark,
  Layers,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { useAuthStore } from "@/features/auth/authStore";
import { getUnifiedInstitution } from "@/mocks/data/unifiedInstitutions";
import { cmsService } from "@/features/cms/cmsService";
import { libraryService } from "@/features/library/libraryService";
import { admissionService } from "@/features/admissions/admissionService";
import { studentService } from "@/features/students/studentService";
import { attendanceService } from "@/features/attendance/attendanceService";
import { financeService } from "@/features/finance/financeService";
import { queryKeys } from "@/lib/queryKeys";
import { useChartColors } from "@/lib/useChartColors";

export default function AdminDashboard() {
  const { institutionId, institution } = useInstitutionData();
  const CHART_COLORS = useChartColors(institutionId);
  const currentUser = useAuthStore((s) => s.currentUser);
  const unified = currentUser?.homeInstitutionId ? getUnifiedInstitution(currentUser.homeInstitutionId) : undefined;

  const { data: schoolStudentStats } = useQuery({
    queryKey: queryKeys.studentStats("school"),
    queryFn: () => studentService.getDashboardStats("school"),
    enabled: !!unified,
  });
  const { data: collegeStudentStats } = useQuery({
    queryKey: queryKeys.studentStats("college"),
    queryFn: () => studentService.getDashboardStats("college"),
    enabled: !!unified,
  });
  const { data: schoolAdmissionStats } = useQuery({
    queryKey: queryKeys.admissionStats("school"),
    queryFn: () => admissionService.getDashboardStats("school"),
    enabled: !!unified,
  });
  const { data: collegeAdmissionStats } = useQuery({
    queryKey: queryKeys.admissionStats("college"),
    queryFn: () => admissionService.getDashboardStats("college"),
    enabled: !!unified,
  });

  const { data: pages } = useQuery({ queryKey: queryKeys.cmsPages(institutionId), queryFn: () => cmsService.listPages(institutionId) });
  const { data: libraryStats } = useQuery({ queryKey: queryKeys.libraryDashboard(institutionId), queryFn: () => libraryService.getDashboardStats(institutionId) });
  const { data: admissionStats } = useQuery({ queryKey: queryKeys.admissionStats(institutionId), queryFn: () => admissionService.getDashboardStats(institutionId) });
  const { data: studentStats } = useQuery({ queryKey: queryKeys.studentStats(institutionId), queryFn: () => studentService.getDashboardStats(institutionId) });
  const { data: attendanceToday } = useQuery({ queryKey: queryKeys.attendanceDaily(institutionId, "2026-10-30"), queryFn: () => attendanceService.getDailySummary(institutionId, "2026-10-30") });
  const { data: financeStats } = useQuery({ queryKey: queryKeys.financeStats(institutionId), queryFn: () => financeService.getDashboardStats(institutionId) });

  const published = pages?.filter((p) => p.status === "Published").length ?? 0;
  const drafts = pages?.filter((p) => p.status === "Draft").length ?? 0;
  const pending = pages?.filter((p) => p.status === "Pending Approval").length ?? 0;
  const scheduled = pages?.filter((p) => p.status === "Scheduled").length ?? 0;

  const admissionsChartData = admissionStats
    ? [
        { name: "Submitted", value: admissionStats.submitted },
        { name: "Under Review", value: admissionStats.underReview },
        { name: "Accepted", value: admissionStats.accepted },
        { name: "Waitlisted", value: admissionStats.waitlisted },
        { name: "Rejected", value: admissionStats.rejected },
      ]
    : [];

  return (
    <div>
      <AdminPageHeader title="Admin Dashboard" description={`Overview for ${institution?.name ?? ""}`} />

      {unified ? (
        <Card className="mb-6 border-accent/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Layers className="size-4" /> Combined overview — {unified.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="border-border flex items-center gap-3 rounded-lg border p-3">
              <GraduationCap className="text-accent size-5" />
              <div>
                <p className="text-sm font-medium">School wing</p>
                <p className="text-muted-foreground text-xs">
                  {schoolStudentStats?.active ?? "—"} active students · {schoolAdmissionStats?.underReview ?? "—"} applications under review
                </p>
              </div>
            </div>
            <div className="border-border flex items-center gap-3 rounded-lg border p-3">
              <Landmark className="text-accent size-5" />
              <div>
                <p className="text-sm font-medium">College wing</p>
                <p className="text-muted-foreground text-xs">
                  {collegeStudentStats?.active ?? "—"} active students · {collegeAdmissionStats?.underReview ?? "—"} applications under review
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
        Education ERP {unified ? `— ${institutionId === "school" ? "School" : "College"} wing (currently viewing)` : ""}
      </p>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active Students" value={studentStats?.active ?? "—"} icon={GraduationCap} />
        <StatCard label="Applications Under Review" value={admissionStats?.underReview ?? "—"} icon={ClipboardList} tone="warning" />
        <StatCard label="Attendance Today" value={attendanceToday ? `${attendanceToday.percentage}%` : "—"} icon={CalendarCheck} tone="success" />
        <StatCard label="Fees Outstanding" value={financeStats ? `₹${financeStats.outstanding.toLocaleString("en-IN")}` : "—"} icon={IndianRupee} tone="warning" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Admission pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={admissionsChartData} margin={{ left: 4, right: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} fill={CHART_COLORS[0]} />
              </BarChart>
            </ResponsiveContainer>
            <Link to="/admin/admissions" className="text-accent mt-2 inline-block text-sm hover:underline">
              Review applications →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Fee collection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total due</span>
              <span className="font-medium">₹{(financeStats?.totalDue ?? 0).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Collected</span>
              <span className="text-success font-medium">₹{(financeStats?.totalCollected ?? 0).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Outstanding</span>
              <span className="text-warning font-medium">₹{(financeStats?.outstanding ?? 0).toLocaleString("en-IN")}</span>
            </div>
            <div className="bg-muted h-2 overflow-hidden rounded-full">
              <div
                className="bg-success h-full"
                style={{
                  width: `${financeStats && financeStats.totalDue > 0 ? Math.round((financeStats.totalCollected / financeStats.totalDue) * 100) : 0}%`,
                }}
              />
            </div>
            <Link to="/admin/finance/invoices" className="text-accent inline-block text-sm hover:underline">
              View invoices →
            </Link>
          </CardContent>
        </Card>
      </div>

      <p className="text-muted-foreground mt-8 mb-2 text-xs font-semibold tracking-wide uppercase">Website &amp; Library</p>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Published Pages" value={published} icon={FileText} />
        <StatCard label="Pending Approval" value={pending} icon={Clock} tone="warning" />
        <StatCard label="Scheduled" value={scheduled} icon={Clock} />
        <StatCard label="Draft Pages" value={drafts} icon={FileText} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Library Titles" value={libraryStats?.totalTitles ?? "—"} icon={BookOpen} />
        <StatCard label="Active Loans" value={libraryStats?.activeLoans ?? "—"} icon={BookOpen} />
        <StatCard label="Overdue Loans" value={libraryStats?.overdueLoans ?? "—"} icon={AlertTriangle} tone="error" />
        <StatCard
          label="Outstanding Fines"
          value={libraryStats ? `₹${libraryStats.outstandingFines}` : "—"}
          icon={AlertTriangle}
          tone="warning"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="size-4" /> Recent page activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-border divide-y">
              {(pages ?? []).slice(0, 6).map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-2 py-2.5 text-sm">
                  <Link to={`/admin/cms/pages/${p.id}`} className="text-foreground truncate hover:underline">
                    {p.title}
                  </Link>
                  <Badge variant="outline">{p.status}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Megaphone className="size-4" /> Quick links
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Link to="/admin/students" className="text-accent flex items-center gap-2 text-sm hover:underline">
              <GraduationCap className="size-4" /> Student directory
            </Link>
            <Link to="/admin/attendance/mark" className="text-accent flex items-center gap-2 text-sm hover:underline">
              <CalendarCheck className="size-4" /> Mark attendance
            </Link>
            <Link to="/admin/cms/pages" className="text-accent flex items-center gap-2 text-sm hover:underline">
              <FileText className="size-4" /> Manage pages
            </Link>
            <Link to="/admin/cms/notices" className="text-accent flex items-center gap-2 text-sm hover:underline">
              <Megaphone className="size-4" /> Publish a notice
            </Link>
            <Link to="/admin/cms/theme" className="text-accent flex items-center gap-2 text-sm hover:underline">
              <ImageIcon className="size-4" /> Customize theme
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
