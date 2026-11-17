import { useState, useEffect } from "react";
import {
  RefreshCw,
  FileText,
  Plus,
  Download,
  Users,
  CheckCircle2,
  TrendingUp,
  Layers,
  UploadCloud,
  Building2,
  ExternalLink,
  Percent,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveTableContainer } from "@/components/admin/ResponsiveTableContainer";
import {
  getCurriculumRevisionData,
  addBosMeeting,
  addComparativeSyllabusItem,
  addProgrammeRevision,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type {
  FiveYearRevisionSummary,
  BoardOfStudiesMeeting,
  ProgrammeRevisionRecord,
  ComparativeSyllabusItem,
  NaacEvidenceDocument,
} from "@/types";

interface CurriculumRevisionConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function CurriculumRevisionConsole({ onEvidenceUpdated }: CurriculumRevisionConsoleProps) {
  const [activeTab, setActiveTab] = useState("benchmark");
  const [, setLoading] = useState(true);

  // Data states
  const [fiveYearSummaries, setFiveYearSummaries] = useState<FiveYearRevisionSummary[]>([]);
  const [overallRevisionPct, setOverallRevisionPct] = useState(78.57);
  const [benchmarkPct, setBenchmarkPct] = useState(70.0);
  const [benchmarkStatus, setBenchmarkStatus] = useState("Exceeds NAAC Benchmark");
  const [bosMeetings, setBosMeetings] = useState<BoardOfStudiesMeeting[]>([]);
  const [programmeRevisions, setProgrammeRevisions] = useState<ProgrammeRevisionRecord[]>([]);
  const [comparativeItems, setComparativeItems] = useState<ComparativeSyllabusItem[]>([]);
  const [attachedEvidence, setAttachedEvidence] = useState<NaacEvidenceDocument[]>([]);

  // Modals
  const [bosModalOpen, setBosModalOpen] = useState(false);
  const [comparativeModalOpen, setComparativeModalOpen] = useState(false);
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);

  // BoS Form state
  const [bosNumber, setBosNumber] = useState("");
  const [bosDept, setBosDept] = useState("Department of Computer Science & Applications");
  const [bosDate, setBosDate] = useState("");
  const [bosYear] = useState("2025-26");
  const [bosExperts, setBosExperts] = useState("");
  const [bosIndustry, setBosIndustry] = useState("");
  const [bosAlumni, setBosAlumni] = useState("");
  const [bosProgrammes, setBosProgrammes] = useState("");
  const [bosRecommendations, setBosRecommendations] = useState("");
  const [bosPctChange, setBosPctChange] = useState(25);

  // Comparative form state
  const [compProgCode, setCompProgCode] = useState("BSC-CS");
  const [compProgName] = useState("B.Sc. (Honours) Computer Science");
  const [compDept] = useState("Computer Science");
  const [compCourseCode, setCompCourseCode] = useState("");
  const [compCourseTitle, setCompCourseTitle] = useState("");
  const [compOldCode, setCompOldCode] = useState("");
  const [compOldTitle, setCompOldTitle] = useState("");
  const [compRevType, setCompRevType] = useState<ComparativeSyllabusItem["revisionType"]>("Content Modified");
  const [compPct, setCompPct] = useState(40);
  const [compAdditions, setCompAdditions] = useState("");
  const [compDeletions, setCompDeletions] = useState("");
  const [compYear] = useState("2025-26");
  const [compBosDate] = useState("2025-06-18");

  // Programme revision form state
  const [revProgName, setRevProgName] = useState("");
  const [revProgCode, setRevProgCode] = useState("");
  const [revDept] = useState("Computer Science");
  const [revTotalCourses, setRevTotalCourses] = useState(48);
  const [revRevisedCount, setRevRevisedCount] = useState(14);
  const [revNewCount, setRevNewCount] = useState(4);
  const [revBosRes, setRevBosRes] = useState("");
  const [revCouncilNotif, setRevCouncilNotif] = useState("");
  const [revYear] = useState("2025-26");

  // Evidence upload form state
  const [eviTitle, setEviTitle] = useState("");
  const [eviDept, setEviDept] = useState("IQAC & Academic Council");
  const [eviYear, setEviYear] = useState("2025-26");
  const [eviDesc, setEviDesc] = useState("");
  const [eviRemarks, setEviRemarks] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getCurriculumRevisionData();
      setFiveYearSummaries(data.fiveYearSummaries);
      setOverallRevisionPct(data.overallRevisionPercentage);
      setBenchmarkPct(data.benchmarkPercentage);
      setBenchmarkStatus(data.benchmarkStatus);
      setBosMeetings(data.bosMeetings);
      setProgrammeRevisions(data.programmeRevisions);
      setComparativeItems(data.comparativeSyllabusItems);

      const evi = await getEvidenceForMetric("1.1.2");
      setAttachedEvidence(evi);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateBos = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bosNumber || !bosDate) return;

    await addBosMeeting(
      {
        meetingNumber: bosNumber,
        departmentId: "dept-" + Date.now(),
        departmentName: bosDept,
        meetingDate: bosDate,
        academicYear: bosYear,
        externalExperts: bosExperts.split("\n").filter(Boolean),
        industryRepresentative: bosIndustry || "Industry Advisory Panel Representative",
        alumniRepresentative: bosAlumni || "Distinguished Alumni Representative",
        programmesReviewed: bosProgrammes.split(",").map((p) => p.trim()).filter(Boolean),
        keyRecommendations: bosRecommendations.split("\n").filter(Boolean),
        percentageChangeApproved: Number(bosPctChange),
        minutesDocumentUrl: "/documents/naac/evidence/BoS_Minutes_New.pdf",
        evidenceId: "evi-112-bos-01",
        status: "Ratified by Academic Council",
      },
      { name: "Dr. Snigdha Mohanty", role: "IQAC Coordinator" }
    );

    setBosModalOpen(false);
    setBosNumber("");
    setBosDate("");
    setBosExperts("");
    setBosRecommendations("");
    loadData();
  };

  const handleCreateComparative = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compCourseCode || !compCourseTitle) return;

    await addComparativeSyllabusItem(
      {
        programmeCode: compProgCode,
        programmeName: compProgName,
        department: compDept,
        courseCode: compCourseCode,
        courseTitle: compCourseTitle,
        oldCourseCode: compOldCode || undefined,
        oldCourseTitle: compOldTitle || undefined,
        revisionType: compRevType,
        percentageContentChange: Number(compPct),
        keyAdditions: compAdditions.split("\n").filter(Boolean),
        keyDeletions: compDeletions ? compDeletions.split("\n").filter(Boolean) : undefined,
        academicYear: compYear,
        bosMeetingDate: compBosDate,
        evidenceId: "evi-112-comp-01",
      },
      { name: "Dr. Snigdha Mohanty", role: "IQAC Coordinator" }
    );

    setComparativeModalOpen(false);
    setCompCourseCode("");
    setCompCourseTitle("");
    setCompOldCode("");
    setCompOldTitle("");
    setCompAdditions("");
    setCompDeletions("");
    loadData();
  };

  const handleCreateProgrammeRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revProgName || !revProgCode) return;

    const pct = Number(((revRevisedCount / (revTotalCourses || 1)) * 100).toFixed(2));

    await addProgrammeRevision(
      {
        programmeId: "prog-" + Date.now(),
        programmeCode: revProgCode,
        programmeName: revProgName,
        department: revDept,
        academicYear: revYear,
        revisionCycle: "Cycle 3 (2021-2026)",
        totalCoursesInProgramme: Number(revTotalCourses),
        coursesRevisedCount: Number(revRevisedCount),
        newCoursesIntroducedCount: Number(revNewCount),
        percentageRevision: pct,
        bosResolutionNumber: revBosRes || "BoS Resolution Approved",
        academicCouncilNotification: revCouncilNotif || "ACM Council Approved",
        implementationDate: "2025-07-01",
        syllabusDocumentUrl: "/documents/naac/evidence/Revised_Syllabus.pdf",
        evidenceId: "evi-112-comp-01",
      },
      { name: "Dr. Snigdha Mohanty", role: "IQAC Coordinator" }
    );

    setRevisionModalOpen(false);
    setRevProgName("");
    setRevProgCode("");
    setRevBosRes("");
    setRevCouncilNotif("");
    loadData();
  };

  const handleAttachEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eviTitle) return;

    await uploadEvidenceDocument(
      {
        criterionId: 1,
        indicatorCode: "1.1",
        metricCode: "1.1.2",
        title: eviTitle,
        academicYear: eviYear,
        department: eviDept,
        documentType: "PDF",
        description: eviDesc,
        remarks: eviRemarks,
        fileName: `${eviTitle.replace(/\s+/g, "_")}.pdf`,
        fileSize: "3.1 MB",
        evidenceUrl: `/documents/naac/evidence/${eviTitle.replace(/\s+/g, "_")}.pdf`,
        uploadedBy: "Dr. Snigdha Mohanty",
      },
      { name: "Dr. Snigdha Mohanty", role: "IQAC Coordinator" }
    );

    setEvidenceModalOpen(false);
    setEviTitle("");
    setEviDesc("");
    setEviRemarks("");
    loadData();
    if (onEvidenceUpdated) onEvidenceUpdated();
  };

  return (
    <div className="space-y-6">
      {/* Metric 1.1.2 Overview Banner */}
      <Card className="border-blue-500/20 bg-gradient-to-r from-blue-500/5 via-primary/10 to-transparent">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-primary text-primary-foreground font-mono text-xs">Metric 1.1.2</Badge>
                <Badge variant="outline" className="border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs">
                  Quantitative Metric (Weightage: 10)
                </Badge>
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs">
                  {benchmarkStatus} (78.4% ≥ 70%)
                </Badge>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground mt-2">
                Programme Revision & 5-Year Curriculum Transformation Console
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl">
                Comprehensive tracking of Board of Studies (BoS) resolutions, comparative syllabus analyses (old vs. new courses),
                and quantitative verification of the 5-year NAAC syllabus revision benchmark ($\ge 70\%$).
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Button size="sm" onClick={() => setEvidenceModalOpen(true)} className="gap-1.5 shadow-xs">
                <UploadCloud className="size-4" />
                <span>Attach Evidence</span>
              </Button>
            </div>
          </div>

          {/* Quantitative Benchmark Progress Strip */}
          <div className="rounded-lg border border-border/70 bg-card p-4 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
                  5-Year Programme Revision Rate (2021 – 2026)
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-extrabold text-foreground">{overallRevisionPct.toFixed(1)}%</span>
                  <span className="text-xs text-muted-foreground">
                    (11 out of 14 unique programmes revised over last 5 years)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[11px] text-muted-foreground block">Mandatory NAAC Benchmark</span>
                  <strong className="text-sm text-foreground">≥ {benchmarkPct.toFixed(1)}%</strong>
                </div>
                <Badge className="bg-emerald-600 text-white text-xs px-2.5 py-1">
                  +{(overallRevisionPct - benchmarkPct).toFixed(1)}% Above Target
                </Badge>
              </div>
            </div>

            <div className="relative pt-1">
              <Progress value={Math.min(100, overallRevisionPct)} className="h-3 bg-muted" />
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-destructive z-10"
                style={{ left: `${benchmarkPct}%` }}
                title="NAAC 70% Benchmark Line"
              />
            </div>
            <div className="flex justify-between text-[11px] text-muted-foreground pt-0.5">
              <span>0%</span>
              <span className="text-destructive font-semibold">Target Benchmark Line: 70%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Quick Stat Cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-1">
            <div className="rounded-lg border border-border/60 bg-card p-3 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Unique Progs Revised</span>
                <RefreshCw className="size-3.5 text-primary" />
              </div>
              <p className="text-xl font-bold text-foreground mt-1">11 / 14</p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">78.6% Total Offered</p>
            </div>

            <div className="rounded-lg border border-border/60 bg-card p-3 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Courses Updated (25-26)</span>
                <TrendingUp className="size-3.5 text-emerald-600" />
              </div>
              <p className="text-xl font-bold text-foreground mt-1">135 Courses</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">32.1% Annual Turnover</p>
            </div>

            <div className="rounded-lg border border-border/60 bg-card p-3 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>BoS Minutes Logged</span>
                <Users className="size-3.5 text-purple-600" />
              </div>
              <p className="text-xl font-bold text-foreground mt-1">{bosMeetings.length} Meetings</p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">Academic Council Ratified</p>
            </div>

            <div className="rounded-lg border border-border/60 bg-card p-3 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Attached Evidence</span>
                <Layers className="size-3.5 text-amber-600" />
              </div>
              <p className="text-xl font-bold text-foreground mt-1">{attachedEvidence.length} Files</p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">Verified & Certified</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs Container */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="overflow-x-auto pb-1 scrollbar-none">
          <TabsList className="bg-muted/60 p-1 h-auto flex-nowrap sm:flex-wrap justify-start gap-1 min-w-max">
            <TabsTrigger value="benchmark" className="gap-1.5 text-xs sm:text-sm py-2 px-3">
              <Percent className="size-3.5" />
              <span>5-Year Benchmark Trend ({fiveYearSummaries.length} Yrs)</span>
            </TabsTrigger>
            <TabsTrigger value="bos" className="gap-1.5 text-xs sm:text-sm py-2 px-3">
              <Users className="size-3.5" />
              <span>Board of Studies (BoS) Minutes ({bosMeetings.length})</span>
            </TabsTrigger>
            <TabsTrigger value="programmes" className="gap-1.5 text-xs sm:text-sm py-2 px-3">
              <Layers className="size-3.5" />
              <span>Programme Revisions Register ({programmeRevisions.length})</span>
            </TabsTrigger>
            <TabsTrigger value="comparative" className="gap-1.5 text-xs sm:text-sm py-2 px-3">
              <RefreshCw className="size-3.5" />
              <span>Comparative Syllabus (Old vs New) ({comparativeItems.length})</span>
            </TabsTrigger>
            <TabsTrigger value="evidence" className="gap-1.5 text-xs sm:text-sm py-2 px-3">
              <FileText className="size-3.5" />
              <span>Evidentiary Dossier ({attachedEvidence.length})</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ================= TAB 1: 5-YEAR BENCHMARK TREND ================= */}
        <TabsContent value="benchmark" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">5-Year Syllabus Revision Summary (DVV Ready)</h3>
              <p className="text-xs text-muted-foreground">
                Year-wise quantification of programmes revised and courses modified in compliance with NAAC manual formula.
              </p>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs">
              Formula: (Revised Programmes / Total Programmes) × 100
            </Badge>
          </div>

          <ResponsiveTableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Academic Year</TableHead>
                  <TableHead className="text-center">Programmes Offered</TableHead>
                  <TableHead className="text-center">Programmes Revised</TableHead>
                  <TableHead className="text-center">Total Courses</TableHead>
                  <TableHead className="text-center">Courses Updated / Added</TableHead>
                  <TableHead className="text-center">Yearly Revision %</TableHead>
                  <TableHead>Progress Visual</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fiveYearSummaries.map((s) => (
                  <TableRow key={s.academicYear}>
                    <TableCell className="font-bold text-xs text-foreground">{s.academicYear}</TableCell>
                    <TableCell className="text-center text-xs">{s.totalProgrammesOffered}</TableCell>
                    <TableCell className="text-center text-xs font-semibold text-primary">
                      {s.programmesRevised}
                    </TableCell>
                    <TableCell className="text-center text-xs">{s.totalCoursesOffered}</TableCell>
                    <TableCell className="text-center text-xs font-semibold">{s.coursesRevisedOrAdded}</TableCell>
                    <TableCell className="text-center font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                      {s.revisionPercentage.toFixed(1)}%
                    </TableCell>
                    <TableCell className="w-36">
                      <div className="flex items-center gap-2">
                        <Progress value={s.revisionPercentage} className="h-2 flex-1" />
                        <span className="text-[10px] text-muted-foreground">{Math.round(s.revisionPercentage)}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ResponsiveTableContainer>

          <Card className="border-border/60 bg-muted/20">
            <CardContent className="p-4 space-y-2">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-primary" />
                NAAC Data Verification & Validation (DVV) Calculation Note:
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Across the 5-year assessment cycle (2021-2026), <strong>11 distinct degree programmes</strong> out of the <strong>14 total programmes</strong> offered underwent comprehensive syllabus overhaul vetted by Board of Studies and ratified by Academic Council.
                This translates to an aggregate institutional programme revision rate of <strong>78.57% (78.4%)</strong>, comfortably surpassing NAAC’s benchmark threshold of <strong>≥ 70%</strong> for the maximum score grade.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================= TAB 2: BOARD OF STUDIES MINUTES ================= */}
        <TabsContent value="bos" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Board of Studies (BoS) Minutes & Resolutions</h3>
              <p className="text-xs text-muted-foreground">
                Statutory department-level BoS meetings featuring university experts, industry stalwarts, and alumni representatives.
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setBosModalOpen(true)} className="gap-1.5 text-xs">
              <Plus className="size-3.5" />
              <span>Record BoS Meeting</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bosMeetings.map((bos) => (
              <Card key={bos.id} className="border-border/70 shadow-2xs hover:shadow-xs transition-shadow">
                <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-primary">{bos.meetingNumber}</span>
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]">
                          {bos.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-sm font-semibold text-foreground mt-1">
                        {bos.departmentName}
                      </CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        Date: {bos.meetingDate} · Academic Year: {bos.academicYear}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">
                      ~{bos.percentageChangeApproved}% Content Modified
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                      External Subject Experts
                    </span>
                    <ul className="mt-1 space-y-0.5">
                      {bos.externalExperts.map((exp, i) => (
                        <li key={i} className="text-xs text-foreground flex items-center gap-1.5">
                          <CheckCircle2 className="size-3 text-primary shrink-0" />
                          <span>{exp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                        Industry Representative
                      </span>
                      <p className="text-xs text-foreground mt-0.5">{bos.industryRepresentative}</p>
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                        Alumni Representative
                      </span>
                      <p className="text-xs text-foreground mt-0.5">{bos.alumniRepresentative}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                      Key Modernization Resolutions
                    </span>
                    <ul className="mt-1 space-y-1">
                      {bos.keyRecommendations.slice(0, 3).map((rec, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <span className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">
                      Evidence: <strong className="text-foreground">{bos.evidenceId}</strong>
                    </span>
                    <Button variant="ghost" size="sm" asChild className="h-7 text-xs gap-1 text-primary">
                      <a href={bos.minutesDocumentUrl} target="_blank" rel="noreferrer">
                        <Download className="size-3" />
                        <span>Download BoS Minutes</span>
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ================= TAB 3: PROGRAMME REVISION REGISTER ================= */}
        <TabsContent value="programmes" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Programme-Level Revision Register</h3>
              <p className="text-xs text-muted-foreground">
                Documented course-level turnover percentages and statutory notification numbers for every degree programme.
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setRevisionModalOpen(true)} className="gap-1.5 text-xs">
              <Plus className="size-3.5" />
              <span>Add Programme Record</span>
            </Button>
          </div>

          <ResponsiveTableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Programme</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Academic Year</TableHead>
                  <TableHead className="text-center">Total Courses</TableHead>
                  <TableHead className="text-center">Revised Courses</TableHead>
                  <TableHead className="text-center">New Courses</TableHead>
                  <TableHead className="text-center">Turnover %</TableHead>
                  <TableHead>BoS & Council Reference</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programmeRevisions.map((rev) => (
                  <TableRow key={rev.id}>
                    <TableCell>
                      <div>
                        <strong className="text-xs sm:text-sm text-foreground">{rev.programmeName}</strong>
                        <p className="text-[11px] text-muted-foreground font-mono">{rev.programmeCode}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{rev.department}</TableCell>
                    <TableCell className="text-xs font-semibold">{rev.academicYear}</TableCell>
                    <TableCell className="text-center text-xs">{rev.totalCoursesInProgramme}</TableCell>
                    <TableCell className="text-center text-xs font-semibold text-primary">
                      {rev.coursesRevisedCount}
                    </TableCell>
                    <TableCell className="text-center text-xs font-semibold text-emerald-600">
                      +{rev.newCoursesIntroducedCount}
                    </TableCell>
                    <TableCell className="text-center font-mono font-bold text-xs text-foreground">
                      {rev.percentageRevision}%
                    </TableCell>
                    <TableCell className="text-xs">
                      <p className="font-mono text-[11px] text-foreground">{rev.bosResolutionNumber}</p>
                      <p className="text-[10px] text-muted-foreground">{rev.academicCouncilNotification}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild className="h-7 text-xs gap-1 text-primary">
                        <a href={rev.syllabusDocumentUrl} target="_blank" rel="noreferrer">
                          <ExternalLink className="size-3" />
                          <span>Syllabus</span>
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ResponsiveTableContainer>
        </TabsContent>

        {/* ================= TAB 4: COMPARATIVE SYLLABUS ANALYSIS ================= */}
        <TabsContent value="comparative" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Comparative Course Syllabus Analysis (Old vs. New)</h3>
              <p className="text-xs text-muted-foreground">
                Granular course-by-course audit displaying new contemporary topics added, obsolete chapters excised, and % content variance.
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setComparativeModalOpen(true)} className="gap-1.5 text-xs">
              <Plus className="size-3.5" />
              <span>Add Course Comparison</span>
            </Button>
          </div>

          <div className="space-y-3">
            {comparativeItems.map((item) => (
              <Card key={item.id} className="border-border/70 p-4 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="font-mono text-xs">
                        {item.programmeCode}
                      </Badge>
                      <span className="font-bold text-sm text-foreground">{item.courseTitle}</span>
                      <span className="font-mono text-xs text-muted-foreground">({item.courseCode})</span>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] ${
                          item.revisionType === "New Course Added"
                            ? "bg-purple-500/10 text-purple-600 border border-purple-500/30"
                            : item.revisionType === "Replaced Old Course"
                            ? "bg-amber-500/10 text-amber-600 border border-amber-500/30"
                            : "bg-blue-500/10 text-blue-600 border border-blue-500/30"
                        }`}
                      >
                        {item.revisionType}
                      </Badge>
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px]">
                        ~{item.percentageContentChange}% Content Change
                      </Badge>
                    </div>

                    {item.oldCourseTitle && (
                      <p className="text-xs text-muted-foreground">
                        Replaces / Modifies: <strong className="text-foreground">{item.oldCourseTitle}</strong>{" "}
                        <span className="font-mono">({item.oldCourseCode})</span>
                      </p>
                    )}

                    <div>
                      <span className="text-[11px] font-semibold text-foreground uppercase tracking-wider block mb-1">
                        Key Modernization Topics Added:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {item.keyAdditions.map((add, i) => (
                          <div key={i} className="text-xs text-foreground flex items-start gap-1.5 bg-muted/30 rounded p-1.5">
                            <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{add}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {item.keyDeletions && item.keyDeletions.length > 0 && (
                      <div>
                        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-0.5">
                          Deprecated Topics Removed:
                        </span>
                        <p className="text-xs text-muted-foreground line-through">
                          {item.keyDeletions.join(" • ")}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="text-right shrink-0 pt-1 text-xs text-muted-foreground space-y-1">
                    <p>BoS Date: {item.bosMeetingDate}</p>
                    <p>Year: {item.academicYear}</p>
                    <Badge variant="outline" className="text-[10px]">
                      Evidence: {item.evidenceId}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ================= TAB 5: EVIDENTIARY DOSSIER ================= */}
        <TabsContent value="evidence" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Attached Metric 1.1.2 Evidence Documents</h3>
              <p className="text-xs text-muted-foreground">
                All supporting artifacts mapped to Metric 1.1.2 in the NAAC Evidence Repository with verification status.
              </p>
            </div>
            <Button size="sm" onClick={() => setEvidenceModalOpen(true)} className="gap-1.5 text-xs">
              <UploadCloud className="size-3.5" />
              <span>Attach New Document</span>
            </Button>
          </div>

          <div className="space-y-3">
            {attachedEvidence.map((doc) => (
              <Card key={doc.id} className="border-border/70 p-4 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <FileText className="size-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs sm:text-sm text-foreground">{doc.title}</span>
                        <Badge
                          variant="secondary"
                          className={`text-[10px] ${
                            doc.status === "Approved"
                              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                              : "bg-blue-500/10 text-blue-600 border border-blue-500/30"
                          }`}
                        >
                          {doc.status}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {doc.version || "v1.0"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{doc.description}</p>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Building2 className="size-3" />
                          {doc.department}
                        </span>
                        <span>•</span>
                        <span>Year: {doc.academicYear}</span>
                        <span>•</span>
                        <span>Size: {doc.fileSize}</span>
                        <span>•</span>
                        <span className="font-mono text-primary font-semibold">{doc.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Button variant="outline" size="sm" asChild className="h-8 text-xs gap-1.5">
                      <a href={doc.evidenceUrl} target="_blank" rel="noreferrer">
                        <Download className="size-3.5" />
                        <span>Download</span>
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* MODAL: Record BoS Meeting */}
      <Dialog open={bosModalOpen} onOpenChange={setBosModalOpen}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Record Board of Studies (BoS) Meeting</DialogTitle>
            <DialogDescription>
              Log statutory BoS resolutions for syllabus revision, expert recommendations, and approved change rates.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateBos} className="space-y-3.5 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">BoS Meeting Number *</Label>
                <Input
                  placeholder="e.g. BoS/CS/2026/01"
                  required
                  value={bosNumber}
                  onChange={(e) => setBosNumber(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Meeting Date *</Label>
                <Input
                  type="date"
                  required
                  value={bosDate}
                  onChange={(e) => setBosDate(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Department</Label>
                <Input
                  value={bosDept}
                  onChange={(e) => setBosDept(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Estimated % Content Modified</Label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={bosPctChange}
                  onChange={(e) => setBosPctChange(Number(e.target.value))}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">External Subject Experts (One per line)</Label>
              <Textarea
                placeholder="Prof. P. K. Pattnaik (IIT Bhubaneswar)..."
                rows={2}
                value={bosExperts}
                onChange={(e) => setBosExperts(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Industry Representative</Label>
                <Input
                  placeholder="e.g. Er. Rakesh Jena (Infosys)"
                  value={bosIndustry}
                  onChange={(e) => setBosIndustry(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Alumni Representative</Label>
                <Input
                  placeholder="e.g. Ms. Priyanka (TCS)"
                  value={bosAlumni}
                  onChange={(e) => setBosAlumni(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Programmes Reviewed (Comma separated)</Label>
              <Input
                placeholder="B.Sc. Computer Science, BCA, M.Sc. CS"
                value={bosProgrammes}
                onChange={(e) => setBosProgrammes(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Key Modernization Recommendations</Label>
              <Textarea
                placeholder="Introduced AI/ML electives, Cloud DevOps lab, and Cyber Security modules..."
                rows={2}
                value={bosRecommendations}
                onChange={(e) => setBosRecommendations(e.target.value)}
                className="text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setBosModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Save BoS Record
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL: Add Programme Revision */}
      <Dialog open={revisionModalOpen} onOpenChange={setRevisionModalOpen}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Programme Revision Record</DialogTitle>
            <DialogDescription>
              Register course-level turnover statistics for an institutional degree programme.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateProgrammeRevision} className="space-y-3.5 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Programme Name *</Label>
                <Input
                  placeholder="e.g. B.Sc. (Honours) Chemistry"
                  required
                  value={revProgName}
                  onChange={(e) => setRevProgName(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Programme Code *</Label>
                <Input
                  placeholder="e.g. BSC-CHEM"
                  required
                  value={revProgCode}
                  onChange={(e) => setRevProgCode(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Total Courses</Label>
                <Input
                  type="number"
                  value={revTotalCourses}
                  onChange={(e) => setRevTotalCourses(Number(e.target.value))}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Revised Courses</Label>
                <Input
                  type="number"
                  value={revRevisedCount}
                  onChange={(e) => setRevRevisedCount(Number(e.target.value))}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">New Added</Label>
                <Input
                  type="number"
                  value={revNewCount}
                  onChange={(e) => setRevNewCount(Number(e.target.value))}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">BoS Resolution Number</Label>
                <Input
                  placeholder="e.g. BoS/CHEM/2025/01"
                  value={revBosRes}
                  onChange={(e) => setRevBosRes(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Academic Council Notification</Label>
                <Input
                  placeholder="e.g. ACM/XXXIV/2026 - Res 1.2"
                  value={revCouncilNotif}
                  onChange={(e) => setRevCouncilNotif(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setRevisionModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Save Programme Record
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL: Add Comparative Syllabus Item */}
      <Dialog open={comparativeModalOpen} onOpenChange={setComparativeModalOpen}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Comparative Course Analysis</DialogTitle>
            <DialogDescription>
              Document granular content changes between old and newly introduced course modules.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateComparative} className="space-y-3.5 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Programme Code</Label>
                <Input
                  value={compProgCode}
                  onChange={(e) => setCompProgCode(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Revision Type</Label>
                <Select
                  value={compRevType}
                  onValueChange={(v) => setCompRevType(v as ComparativeSyllabusItem["revisionType"])}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Content Modified">Content Modified</SelectItem>
                    <SelectItem value="New Course Added">New Course Added</SelectItem>
                    <SelectItem value="Replaced Old Course">Replaced Old Course</SelectItem>
                    <SelectItem value="Elective Converted to Core">Elective Converted to Core</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">New Course Code *</Label>
                <Input
                  placeholder="e.g. CS-C602"
                  required
                  value={compCourseCode}
                  onChange={(e) => setCompCourseCode(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">New Course Title *</Label>
                <Input
                  placeholder="e.g. Generative AI & Deep Learning"
                  required
                  value={compCourseTitle}
                  onChange={(e) => setCompCourseTitle(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Old Course Code (if replaced)</Label>
                <Input
                  placeholder="e.g. CS-C602-OLD"
                  value={compOldCode}
                  onChange={(e) => setCompOldCode(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Content Change %</Label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={compPct}
                  onChange={(e) => setCompPct(Number(e.target.value))}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Key Topics Added (One per line)</Label>
              <Textarea
                placeholder="Prompt engineering, RAG architecture, Vector search..."
                rows={2}
                value={compAdditions}
                onChange={(e) => setCompAdditions(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Obsolete Topics Removed (One per line)</Label>
              <Textarea
                placeholder="Legacy Perl CGI, manual XML SOAP handlers..."
                rows={1}
                value={compDeletions}
                onChange={(e) => setCompDeletions(e.target.value)}
                className="text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setComparativeModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Save Comparison
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL: Attach Evidence Document */}
      <Dialog open={evidenceModalOpen} onOpenChange={setEvidenceModalOpen}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Attach Evidence to Metric 1.1.2</DialogTitle>
            <DialogDescription>
              Upload or link an institutional artifact directly to Programme Revision Records.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAttachEvidence} className="space-y-3.5 py-2">
            <div className="space-y-1">
              <Label htmlFor="evi112Title" className="text-xs font-semibold">Document Title *</Label>
              <Input
                id="evi112Title"
                placeholder="e.g. Consolidated BoS Minutes & 5-Year Revision Matrix"
                required
                value={eviTitle}
                onChange={(e) => setEviTitle(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Academic Year</Label>
                <Input
                  value={eviYear}
                  onChange={(e) => setEviYear(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Department / Cell</Label>
                <Input
                  value={eviDept}
                  onChange={(e) => setEviDept(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="evi112Desc" className="text-xs font-semibold">Description & Context</Label>
              <Textarea
                id="evi112Desc"
                placeholder="Detail what this document proves for NAAC DVV peer team review..."
                rows={2}
                value={eviDesc}
                onChange={(e) => setEviDesc(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="evi112Remarks" className="text-xs font-semibold">Remarks & Resolution References</Label>
              <Input
                id="evi112Remarks"
                placeholder="e.g. Endorsed in ACM Resolution 1.1 with 78.4% benchmark certification"
                value={eviRemarks}
                onChange={(e) => setEviRemarks(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <div className="border border-dashed border-border rounded-lg p-4 text-center bg-muted/20">
              <UploadCloud className="size-6 text-muted-foreground mx-auto" />
              <p className="text-xs font-semibold text-foreground mt-1">Upload File (PDF / DOCX)</p>
              <p className="text-[11px] text-muted-foreground">Certified institutional document with digital signatures</p>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setEvidenceModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="gap-1.5">
                <UploadCloud className="size-4" />
                <span>Upload & Link to 1.1.2</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
