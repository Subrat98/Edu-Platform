import { useState, useEffect } from "react";
import {
  CheckCircle2,
  ShieldCheck,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ResponsiveTableContainer } from "@/components/admin/ResponsiveTableContainer";
import { getAqarRecords, updateAqarStatus } from "@/features/naac/naacService";
import type { AqarRecord, AqarStatus, NaacCriterionId } from "@/types";

const AQAR_STAGES: AqarStatus[] = [
  "Draft",
  "Data Collection",
  "Department Review",
  "IQAC Review",
  "Principal Approval",
  "Final AQAR",
  "Submitted",
];

const CRITERIA_NAMES: Record<NaacCriterionId, string> = {
  1: "Curricular Aspects",
  2: "Teaching-Learning & Evaluation",
  3: "Research, Innovations & Extension",
  4: "Infrastructure & Learning Resources",
  5: "Student Support & Progression",
  6: "Governance, Leadership & Management",
  7: "Institutional Values & Best Practices",
};

export default function AqarPage() {
  const [aqarList, setAqarList] = useState<AqarRecord[]>([]);
  const [selectedYear, setSelectedYear] = useState("2025-26");
  const [, setLoading] = useState(true);
  const [advanceModalOpen, setAdvanceModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<AqarStatus>("Principal Approval");
  const [advanceRemarks, setAdvanceRemarks] = useState("");

  const loadData = () => {
    setLoading(true);
    getAqarRecords()
      .then((records) => {
        setAqarList(records);
        if (records[0] && !selectedYear) {
          setSelectedYear(records[0].academicYear);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentAqar = aqarList.find((a) => a.academicYear === selectedYear) ?? aqarList[0];
  const currentStageIdx = currentAqar ? AQAR_STAGES.indexOf(currentAqar.status) : 0;

  const handleAdvanceStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAqar) return;

    await updateAqarStatus(
      currentAqar.id,
      targetStatus,
      { name: "Dr. Snigdha Mohanty", role: "IQAC Coordinator" },
      advanceRemarks
    );
    setAdvanceModalOpen(false);
    loadData();
  };

  const openAdvanceModal = () => {
    if (!currentAqar) return;
    const nextIdx = Math.min(currentStageIdx + 1, AQAR_STAGES.length - 1);
    const nextStage = AQAR_STAGES[nextIdx] ?? AQAR_STAGES[0]!;
    setTargetStatus(nextStage);
    setAdvanceRemarks(`Transitioning to ${nextStage} following review.`);
    setAdvanceModalOpen(true);
  };

  if (!currentAqar) {
    return <div className="p-6">Loading AQAR workspace...</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full min-w-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Annual Quality Assurance Report (AQAR)
            </h1>
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
              Statutory Submission
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Multi-stage workflow: Draft &rarr; Data Collection &rarr; Dept Review &rarr; IQAC Review &rarr; Principal Approval &rarr; Final &rarr; Submitted.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="w-36">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {aqarList.map((a) => (
                  <SelectItem key={a.id} value={a.academicYear}>
                    AY {a.academicYear}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button size="sm" onClick={openAdvanceModal} className="gap-1.5 shrink-0">
            <ShieldCheck className="size-4" />
            <span>Advance Workflow</span>
          </Button>
        </div>
      </div>

      <Card className="border-border/60 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardDescription className="text-xs uppercase font-semibold text-primary">
                AQAR {currentAqar.academicYear} Approval Pipeline
              </CardDescription>
              <CardTitle className="text-lg font-bold text-foreground">
                Current State: {currentAqar.status}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Deadline: <strong>{currentAqar.submissionDeadline}</strong>
              </span>
              <Badge
                className={
                  currentAqar.status === "Submitted"
                    ? "bg-emerald-600 text-white"
                    : "bg-blue-600 text-white"
                }
              >
                {currentAqar.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mt-2">
            <div className="overflow-x-auto pb-2 scrollbar-none">
              <div className="flex min-w-[650px] items-center justify-between">
                {AQAR_STAGES.map((st, idx) => {
                  const isCompleted = idx < currentStageIdx || currentAqar.status === "Submitted";
                  const isCurrent = idx === currentStageIdx && currentAqar.status !== "Submitted";

                  return (
                    <div key={st} className="flex flex-col items-center text-center relative flex-1">
                      {idx > 0 && (
                        <div
                          className={`absolute top-3.5 right-1/2 w-full h-0.5 -z-10 ${
                            idx <= currentStageIdx ? "bg-primary" : "bg-muted"
                          }`}
                        />
                      )}
                      <div
                        className={`size-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                          isCompleted
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : isCurrent
                            ? "border-2 border-primary bg-background text-primary animate-pulse"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="size-4" /> : idx + 1}
                      </div>
                      <span
                        className={`mt-2 text-[11px] font-medium max-w-[80px] leading-tight ${
                          isCurrent
                            ? "text-primary font-bold"
                            : isCompleted
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {st}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-muted/20 border border-border/50 p-3 text-xs text-muted-foreground flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <span className="font-semibold text-foreground">Prepared By:</span> {currentAqar.preparedBy}
              {currentAqar.approvedBy && (
                <span className="ml-3">
                  <span className="font-semibold text-foreground">Approval Authority:</span> {currentAqar.approvedBy}
                </span>
              )}
            </div>
            {currentAqar.documentUrl && (
              <Button size="xs" variant="outline" className="gap-1 self-start sm:self-auto">
                <Download className="size-3" /> Download Draft AQAR (PDF)
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Criteria Breakdown Grid */}
      <Card className="border-border/60 shadow-xs">
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Seven Criteria Breakdown
              </CardTitle>
              <CardDescription>
                Quantitative and qualitative metric completion for {currentAqar.academicYear}
              </CardDescription>
            </div>
            <span className="text-sm font-bold text-primary">{currentAqar.overallCompletion}% Completed</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {(Object.keys(currentAqar.criteriaProgress) as unknown as NaacCriterionId[]).map((cid) => {
              const pct = currentAqar.criteriaProgress[cid];
              return (
                <div
                  key={cid}
                  className="rounded-xl border border-border/70 bg-card p-4 transition hover:border-primary/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-primary">Criterion {cid}</span>
                    <span className="text-xs font-bold text-foreground">{pct}%</span>
                  </div>
                  <h4 className="mt-1 font-semibold text-xs text-foreground line-clamp-1">
                    {CRITERIA_NAMES[cid]}
                  </h4>
                  <Progress value={pct} className="mt-3 h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Submission History Table */}
      <Card className="border-border/60 shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-bold text-foreground">
            AQAR Submission History
          </CardTitle>
          <CardDescription>
            Archives of previous Annual Quality Assurance Reports submitted to NAAC portal
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          {/* Mobile History Cards */}
          <div className="md:hidden space-y-3">
            {aqarList.map((a) => (
              <Card key={a.id} className="border-border/70 p-3.5 shadow-xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-foreground">AQAR {a.academicYear}</h4>
                    <span className="text-xs text-primary font-semibold">{a.overallCompletion}% Completed</span>
                  </div>
                  <Badge
                    className={
                      a.status === "Submitted"
                        ? "bg-emerald-600 text-white text-[10px]"
                        : "bg-blue-600 text-white text-[10px]"
                    }
                  >
                    {a.status}
                  </Badge>
                </div>

                <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs border-t border-border/50 pt-2">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-medium block">Submitted Date</span>
                    <span className="text-[11px] text-foreground font-medium">{a.submittedDate || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-medium block">Prepared By</span>
                    <span className="text-[11px] text-foreground font-medium truncate block">{a.preparedBy}</span>
                  </div>
                  {a.remarks && (
                    <div className="col-span-2">
                      <span className="text-[10px] text-muted-foreground uppercase font-medium block">Remarks</span>
                      <p className="text-[11px] text-muted-foreground">{a.remarks}</p>
                    </div>
                  )}
                </div>

                {a.documentUrl && (
                  <div className="mt-3 flex items-center justify-end border-t border-border/50 pt-2">
                    <Button size="xs" variant="outline" className="gap-1">
                      <Download className="size-3" /> PDF
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Desktop History Table */}
          <div className="hidden md:block">
            <ResponsiveTableContainer>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="font-semibold min-w-[120px]">Academic Year</TableHead>
                    <TableHead className="font-semibold min-w-[110px]">Status</TableHead>
                    <TableHead className="font-semibold min-w-[110px]">Completion</TableHead>
                    <TableHead className="font-semibold min-w-[120px]">Submitted Date</TableHead>
                    <TableHead className="font-semibold min-w-[160px]">Prepared By</TableHead>
                    <TableHead className="font-semibold min-w-[180px]">Remarks</TableHead>
                    <TableHead className="font-semibold text-right min-w-[90px]">Dossier</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aqarList.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-bold text-foreground">
                        AQAR {a.academicYear}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            a.status === "Submitted"
                              ? "bg-emerald-600 text-white"
                              : "bg-blue-600 text-white"
                          }
                        >
                          {a.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold">{a.overallCompletion}%</span>
                          <Progress value={a.overallCompletion} className="h-1.5 w-16" />
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {a.submittedDate || "—"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {a.preparedBy}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                        {a.remarks}
                      </TableCell>
                      <TableCell className="text-right">
                        {a.documentUrl && (
                          <Button size="xs" variant="ghost" className="gap-1 text-primary">
                            <Download className="size-3" /> PDF
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ResponsiveTableContainer>
          </div>
        </CardContent>
      </Card>

      <Dialog open={advanceModalOpen} onOpenChange={setAdvanceModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Advance AQAR {currentAqar.academicYear} Workflow</DialogTitle>
            <DialogDescription>
              Transition AQAR stage and append coordinator approval audit sign-off.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAdvanceStatus} className="space-y-4 pt-2">
            <div>
              <Label htmlFor="nextStat">Target AQAR Stage</Label>
              <Select value={targetStatus} onValueChange={(v) => setTargetStatus(v as AqarStatus)}>
                <SelectTrigger id="nextStat">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AQAR_STAGES.map((st) => (
                    <SelectItem key={st} value={st}>
                      {st}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="advRem">Workflow Verification Remarks</Label>
              <Textarea
                id="advRem"
                rows={3}
                value={advanceRemarks}
                onChange={(e) => setAdvanceRemarks(e.target.value)}
                placeholder="Enter IQAC verification remarks..."
                required
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setAdvanceModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Confirm Stage Advance</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
