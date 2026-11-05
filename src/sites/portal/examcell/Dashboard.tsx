import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { CheckCircle2, Clock, FileQuestion, PenSquare } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useAuthStore } from "@/features/auth/authStore";
import { examinationService } from "@/features/examinations/examinationService";
import { revaluationService } from "@/features/examinations/revaluationService";
import { queryKeys } from "@/lib/queryKeys";

export default function ExamCellDashboard() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const { data: exams, isLoading } = useQuery({ queryKey: queryKeys.examinations("college"), queryFn: () => examinationService.list("college") });
  const { data: revaluations } = useQuery({ queryKey: queryKeys.revaluations("college"), queryFn: () => revaluationService.listByInstitution("college") });

  if (isLoading) return <PageLoadingSkeleton />;

  const list = exams ?? [];
  const pendingReval = (revaluations ?? []).filter((r) => r.status === "Pending").length;

  return (
    <div>
      <AdminPageHeader title={`Welcome, ${currentUser?.name?.split(" ")[0] ?? "Examination Cell"}`} description="Exam scheduling, verification and result publication for every programme." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Examinations" value={list.length} icon={PenSquare} />
        <StatCard label="Marks Entry" value={list.filter((e) => e.status === "Marks Entry").length} icon={Clock} tone="warning" />
        <StatCard label="Under Verification" value={list.filter((e) => e.status === "Under Verification").length} icon={Clock} />
        <StatCard label="Pending Revaluations" value={pendingReval} icon={FileQuestion} tone={pendingReval ? "warning" : "default"} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Examinations awaiting action</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-border divide-y">
              {list
                .filter((e) => e.status !== "Published")
                .slice(0, 8)
                .map((e) => (
                  <li key={e.id} className="flex items-center justify-between py-2.5 text-sm">
                    <Link to={`/portal/examcell/examinations/${e.id}`} className="text-foreground hover:underline">
                      {e.name} — {e.className}
                    </Link>
                    <Badge variant="outline">{e.status}</Badge>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="size-4" /> Quick links
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Link to="/portal/examcell/examinations" className="text-accent flex items-center gap-2 text-sm hover:underline">
              <PenSquare className="size-4" /> All examinations
            </Link>
            <Link to="/portal/examcell/revaluation" className="text-accent flex items-center gap-2 text-sm hover:underline">
              <FileQuestion className="size-4" /> Revaluation requests
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
