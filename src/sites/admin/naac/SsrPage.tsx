import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Layers,
  ArrowRight,
  ShieldCheck,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResponsiveTableContainer } from "@/components/admin/ResponsiveTableContainer";
import { getSsrData } from "@/features/naac/naacService";
import type { SsrRecord, NaacCriterionId } from "@/types";

const CRITERIA_DETAILS: Record<NaacCriterionId, { name: string; weight: number }> = {
  1: { name: "Curricular Aspects", weight: 100 },
  2: { name: "Teaching-Learning and Evaluation", weight: 350 },
  3: { name: "Research, Innovations and Extension", weight: 110 },
  4: { name: "Infrastructure and Learning Resources", weight: 100 },
  5: { name: "Student Support and Progression", weight: 140 },
  6: { name: "Governance, Leadership and Management", weight: 100 },
  7: { name: "Institutional Values and Best Practices", weight: 100 },
};

export default function SsrPage() {
  const [ssr, setSsr] = useState<SsrRecord | null>(null);
  const [, setLoading] = useState(true);

  useEffect(() => {
    getSsrData()
      .then((data) => setSsr(data))
      .finally(() => setLoading(false));
  }, []);

  if (!ssr) {
    return <div className="p-6">Loading Self Study Report (SSR)...</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full min-w-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Self Study Report (SSR) Management
            </h1>
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
              Cycle {ssr.cycleNumber} Dossier
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            5-Year consolidated institutional self-evaluation, qualitative descriptive metrics, and DVV data validation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {ssr.finalPdfUrl && (
            <Button size="sm" variant="outline" className="gap-1.5" asChild>
              <a href={ssr.finalPdfUrl} target="_blank" rel="noopener noreferrer">
                <Download className="size-4" />
                <span>Download SSR Dossier</span>
              </a>
            </Button>
          )}
          <Button size="sm" asChild>
            <Link to="/admin/naac/reports" className="gap-1.5">
              <Layers className="size-4" />
              <span>Executive SSR Summary</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Cycle Progress & Submission Status */}
      <Card className="border-border/60 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardDescription className="text-xs uppercase font-semibold text-primary">
                NAAC Accreditation Cycle {ssr.cycleNumber}
              </CardDescription>
              <CardTitle className="text-lg font-bold sm:text-xl text-foreground">
                SSR Submission Status: {ssr.status}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-600 text-white font-medium px-3 py-1">
                <ShieldCheck className="size-3.5 mr-1" />
                Overall Readiness: {ssr.overallProgress}%
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-1">
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
              <span className="text-xs text-muted-foreground">Assessment Window</span>
              <p className="font-semibold text-sm text-foreground mt-0.5">{ssr.assessmentPeriod}</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
              <span className="text-xs text-muted-foreground">Submission Deadline</span>
              <p className="font-semibold text-sm text-foreground mt-0.5">{ssr.submissionDeadline}</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
              <span className="text-xs text-muted-foreground">SSR Coordinated By</span>
              <p className="font-semibold text-sm text-foreground mt-0.5">{ssr.compiledBy}</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
              <span className="text-xs text-muted-foreground">Executive Clearance</span>
              <p className="font-semibold text-sm text-foreground mt-0.5">{ssr.approvedBy}</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-muted-foreground">Cumulative 5-Year Data Validation & Verification (DVV)</span>
              <span className="text-foreground">{ssr.overallProgress}% Complete</span>
            </div>
            <Progress value={ssr.overallProgress} className="h-2" />
          </div>

          {ssr.diasRemarks && (
            <div className="rounded-lg bg-muted/30 border border-border/50 p-3 text-xs text-muted-foreground">
              <strong className="text-foreground">DVV & Peer Team Remarks: </strong>
              {ssr.diasRemarks}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Criterion-Wise SSR Verification Status */}
      <Card className="border-border/60 shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-bold text-foreground">
            Criterion-Wise SSR Verification Status
          </CardTitle>
          <CardDescription>
            Metric readiness, evidentiary back-links, and quantitative calculations across the 5 assessment years
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          {/* Mobile Card List (< md) */}
          <div className="md:hidden space-y-3">
            {(Object.keys(ssr.criteriaProgress) as unknown as NaacCriterionId[]).map((cid) => {
              const pct = ssr.criteriaProgress[cid];
              const detail = CRITERIA_DETAILS[cid];
              return (
                <Card key={cid} className="border-border/70 p-3.5 shadow-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-xs text-primary">Criterion {cid}</span>
                      <h4 className="font-semibold text-sm text-foreground mt-0.5">{detail.name}</h4>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] shrink-0 font-medium ${
                        pct === 100
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      {pct === 100 ? "Verified" : "Under Review"}
                    </Badge>
                  </div>

                  <div className="mt-3 space-y-2 border-t border-border/50 pt-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Weightage: {detail.weight} Marks</span>
                      <span className="font-bold text-foreground">{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                  </div>

                  <div className="mt-3 flex items-center justify-end border-t border-border/50 pt-2">
                    <Button asChild size="xs" variant="ghost">
                      <Link to={`/admin/naac/criteria?tab=${cid}`} className="gap-1 text-primary">
                        <span>Open QIF</span>
                        <ArrowRight className="size-3" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Desktop Table (md+) */}
          <div className="hidden md:block">
            <ResponsiveTableContainer>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="font-semibold min-w-[110px]">Criterion</TableHead>
                    <TableHead className="font-semibold min-w-[240px]">Criterion Name</TableHead>
                    <TableHead className="font-semibold min-w-[130px]">NAAC Weightage</TableHead>
                    <TableHead className="font-semibold min-w-[160px]">SSR Readiness</TableHead>
                    <TableHead className="font-semibold min-w-[140px]">DVV Status</TableHead>
                    <TableHead className="font-semibold text-right min-w-[110px]">Dossier Link</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(Object.keys(ssr.criteriaProgress) as unknown as NaacCriterionId[]).map((cid) => {
                    const pct = ssr.criteriaProgress[cid];
                    const detail = CRITERIA_DETAILS[cid];
                    return (
                      <TableRow key={cid}>
                        <TableCell className="font-bold text-foreground">
                          Criterion {cid}
                        </TableCell>
                        <TableCell className="font-semibold text-xs sm:text-sm text-foreground">
                          {detail.name}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {detail.weight} Marks
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={pct} className="w-24 h-2" />
                            <span className="text-xs font-bold text-foreground">{pct}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              pct === 100
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
                                : "bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium"
                            }
                          >
                            {pct === 100 ? "Verified & Uploaded" : "Final Verification"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild size="xs" variant="ghost">
                            <Link to={`/admin/naac/criteria?tab=${cid}`} className="gap-1 text-primary">
                              <span>Open QIF</span>
                              <ArrowRight className="size-3" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ResponsiveTableContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
