import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  FileCheck,
  FileText,
  Clock,
  ShieldCheck,
  TrendingUp,
  FolderOpen,
  ArrowRight,
  Calendar,
  Sparkles,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { getNaacDashboardStats, type NaacDashboardStats } from "@/features/naac/naacService";

export default function NaacDashboard() {
  const [stats, setStats] = useState<NaacDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNaacDashboardStats()
      .then((data) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto w-full min-w-0">
        <Skeleton className="h-10 w-72" />
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  const { currentCycle, overallCompletion, criterionProgress, recentActivities, recentAuditLogs } = stats;

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full min-w-0">
      {/* Top Banner Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              NAAC & IQAC Management
            </h1>
            <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium shrink-0">
              Cycle {currentCycle.cycleNumber} · Grade {currentCycle.grade}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Accreditation Command Center · CGPA {currentCycle.cgpa} / 4.00 · Valid through {currentCycle.validUntil}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link to="/admin/naac/evidence">
              <FolderOpen className="size-4" />
              <span>Evidence Vault</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link to="/admin/naac/approvals">
              <ShieldCheck className="size-4" />
              <span>Approvals ({stats.pendingApprovalsCount})</span>
            </Link>
          </Button>
          <Button asChild size="sm" className="gap-1.5 bg-primary text-primary-foreground shadow-sm">
            <Link to="/admin/naac/reports">
              <FileText className="size-4" />
              <span>NAAC Reports</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* 6 Key Stat Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        <Card className="border-border/60 shadow-xs transition hover:shadow-sm">
          <CardHeader className="pb-2 p-3 sm:p-4">
            <CardDescription className="flex items-center justify-between text-[11px] font-semibold tracking-wide uppercase">
              <span>Accreditation</span>
              <Award className="size-4 text-amber-500" />
            </CardDescription>
            <CardTitle className="text-lg sm:text-xl font-bold text-foreground">
              Grade {currentCycle.grade}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
            <p className="text-xs text-muted-foreground">
              CGPA <span className="font-semibold text-foreground">{currentCycle.cgpa}</span>
            </p>
            <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              Valid till Nov 2028
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-xs transition hover:shadow-sm">
          <CardHeader className="pb-2 p-3 sm:p-4">
            <CardDescription className="flex items-center justify-between text-[11px] font-semibold tracking-wide uppercase">
              <span>SSR Readiness</span>
              <FileCheck className="size-4 text-blue-500" />
            </CardDescription>
            <CardTitle className="text-lg sm:text-xl font-bold text-foreground">
              {stats.ssrStatus}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Cycle 3</span>
              <span className="font-semibold text-foreground">98.4%</span>
            </div>
            <Progress value={98.4} className="mt-2 h-1.5" />
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-xs transition hover:shadow-sm">
          <CardHeader className="pb-2 p-3 sm:p-4">
            <CardDescription className="flex items-center justify-between text-[11px] font-semibold tracking-wide uppercase">
              <span>AQAR Status</span>
              <TrendingUp className="size-4 text-indigo-500" />
            </CardDescription>
            <CardTitle className="text-lg sm:text-xl font-bold text-foreground">
              {stats.aqarStatus}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>2025-26</span>
              <span className="font-semibold text-foreground">83.5%</span>
            </div>
            <Progress value={83.5} className="mt-2 h-1.5" />
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-xs transition hover:shadow-sm">
          <CardHeader className="pb-2 p-3 sm:p-4">
            <CardDescription className="flex items-center justify-between text-[11px] font-semibold tracking-wide uppercase">
              <span>Evidence Vault</span>
              <FolderOpen className="size-4 text-emerald-500" />
            </CardDescription>
            <CardTitle className="text-lg sm:text-xl font-bold text-foreground">
              {stats.evidenceCompletionRate}%
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{stats.pendingVerificationCount}</span> pending review
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              52 documents indexed
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-xs transition hover:shadow-sm">
          <CardHeader className="pb-2 p-3 sm:p-4">
            <CardDescription className="flex items-center justify-between text-[11px] font-semibold tracking-wide uppercase">
              <span>Pending</span>
              <ShieldCheck className="size-4 text-rose-500" />
            </CardDescription>
            <CardTitle className="text-lg sm:text-xl font-bold text-foreground">
              {stats.pendingApprovalsCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
            <p className="text-xs text-muted-foreground">
              Requires coordinator sign-off
            </p>
            <Link to="/admin/naac/approvals" className="mt-1 inline-block text-[11px] text-primary hover:underline">
              View queue →
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-xs transition hover:shadow-sm">
          <CardHeader className="pb-2 p-3 sm:p-4">
            <CardDescription className="flex items-center justify-between text-[11px] font-semibold tracking-wide uppercase">
              <span>Deadlines</span>
              <Clock className="size-4 text-amber-500" />
            </CardDescription>
            <CardTitle className="text-lg sm:text-xl font-bold text-foreground">
              {stats.upcomingDeadlinesCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
            <p className="text-xs text-muted-foreground">
              Tasks due this month
            </p>
            <Link to="/admin/naac/tasks" className="mt-1 inline-block text-[11px] text-primary hover:underline">
              Review tasks →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Seven Criteria Progress Matrix */}
      <Card className="border-border/60 shadow-xs">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              <CardTitle className="text-lg font-bold text-foreground">
                Seven NAAC Criteria Readiness Matrix
              </CardTitle>
            </div>
            <CardDescription>
              Quantitative & Qualitative institutional completion scores calibrated for Cycle 3 SSR & AQAR
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-primary/40 bg-primary/5 text-primary font-semibold">
              Institutional Average: {overallCompletion}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
            {criterionProgress.map((crit) => {
              const criterionId = crit.criterionId ?? crit.id;
              const weightage = crit.weightage ?? 100;
              const rawScore = crit.weightedScore ?? Math.round(((crit.score ?? 3.5) / 4) * weightage);
              const scoreDisplay = typeof rawScore === "number" ? rawScore.toFixed(0) : "85";

              return (
                <Link
                  key={criterionId}
                  to={`/admin/naac/criteria?tab=${criterionId}`}
                  className="group relative flex flex-col justify-between rounded-xl border border-border/70 bg-card p-3.5 transition-all hover:border-primary/50 hover:shadow-sm hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs uppercase tracking-wide text-primary">
                        C{criterionId}
                      </span>
                      <Badge variant="secondary" className="text-[10px] px-1 py-0 font-medium">
                        {crit.percentage}%
                      </Badge>
                    </div>
                    <h4 className="mt-2 text-xs font-semibold text-foreground group-hover:text-primary transition line-clamp-2">
                      {crit.name}
                    </h4>
                  </div>

                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
                      <span>Wt: {weightage}</span>
                      <span className="font-medium text-foreground">{scoreDisplay} pts</span>
                    </div>
                    <Progress value={crit.percentage} className="h-1.5" />
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
            <span>
              Calculated dynamically from <strong className="text-foreground">34 metrics</strong> and <strong className="text-foreground">52 uploaded dossiers</strong>.
            </span>
            <Link to="/admin/naac/criteria" className="flex items-center gap-1 font-semibold text-primary hover:underline mt-1 sm:mt-0">
              Open 7 Criteria Deep Dive <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Two-Column Activity & Audit Trail Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border/60 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Recent IQAC Activities & Initiatives
              </CardTitle>
              <CardDescription>
                Faculty Development, Green Audits, and Quality Circles
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin/naac/iqac">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 p-3 sm:p-6 sm:pt-0">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                className="flex items-start gap-3 rounded-lg border border-border/50 p-3 transition hover:bg-muted/40"
              >
                <div className="mt-0.5 rounded-md bg-primary/10 p-2 text-primary shrink-0">
                  <Activity className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs sm:text-sm font-semibold text-foreground">{act.title}</p>
                    <Badge variant="outline" className="text-[10px] shrink-0 font-medium">
                      {act.category}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{act.description}</p>
                  <div className="mt-2 flex items-center gap-4 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" /> {act.date}
                    </span>
                    <span>{act.participants} participants</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Tamper-Evident Audit Trail
              </CardTitle>
              <CardDescription>
                Real-time tracking of approvals, updates, and evidence verification
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin/naac/audit">Audit Log</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 p-3 sm:p-6 sm:pt-0">
            {recentAuditLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between rounded-lg border border-border/40 p-2.5 text-xs gap-2"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground truncate">{log.actorName}</span>
                    <Badge variant="secondary" className="text-[10px] px-1 py-0 shrink-0">
                      {log.actorRole}
                    </Badge>
                  </div>
                  <p className="mt-0.5 truncate text-muted-foreground">
                    <span className="font-medium text-foreground">{log.action}</span> · {log.entityTitle}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-[11px] text-muted-foreground">{log.timestamp.slice(5)}</span>
                  <div className="mt-0.5">
                    <Badge
                      variant="outline"
                      className={`text-[9px] px-1 py-0 ${
                        log.action === "Approved"
                          ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                          : log.action === "Verified"
                          ? "border-blue-500/40 text-blue-600 dark:text-blue-400"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {log.module}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
