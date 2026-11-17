import { useState, useEffect } from "react";
import {
  Users,
  Star,
  Plus,
  Download,
  ExternalLink,
  CheckCircle2,
  FileText,
  UploadCloud,
  Award,
  Globe,
  Search,
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
import { ResponsiveTableContainer } from "@/components/admin/ResponsiveTableContainer";
import {
  getFeedbackBundle,
  submitFeedbackRecord,
  getEvidenceForMetric,
  uploadEvidenceDocument,
  type FeedbackBundle,
} from "@/features/naac/naacService";
import type { StakeholderType, NaacEvidenceDocument } from "@/types";

interface StakeholderFeedbackConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function StakeholderFeedbackConsole({ onEvidenceUpdated }: StakeholderFeedbackConsoleProps) {
  const [data, setData] = useState<FeedbackBundle | null>(null);
  const [, setLoading] = useState(true);
  const [activeStakeholder, setActiveStakeholder] = useState<StakeholderType>("Student");
  const [activeTab, setActiveTab] = useState("analysis");
  const [attachedEvidence, setAttachedEvidence] = useState<NaacEvidenceDocument[]>([]);

  // Search in feedback records
  const [recordSearch, setRecordSearch] = useState("");

  // Modals
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);

  // Form states - Record
  const [respName, setRespName] = useState("");
  const [respDept, setRespDept] = useState("Computer Science");
  const [currRating, setCurrRating] = useState("5");
  const [teachRating, setTeachRating] = useState("4");
  const [infraRating, setInfraRating] = useState("5");
  const [resRating, setResRating] = useState("4");
  const [respSug, setRespSug] = useState("");

  // Form states - Evidence
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [evidenceRemarks, setEvidenceRemarks] = useState("Verified by IQAC Coordinator.");

  const loadData = async () => {
    setLoading(true);
    try {
      const bundle = await getFeedbackBundle();
      setData(bundle);

      const ev = await getEvidenceForMetric("1.4.1");
      setAttachedEvidence(ev);
    } catch (err) {
      console.error("Failed to load feedback bundle", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitFeedbackRecord({
        stakeholder: activeStakeholder,
        academicYear: "2025-26",
        department: respDept,
        respondentName: respName || undefined,
        curriculumRating: Number(currRating),
        teachingRating: Number(teachRating),
        infrastructureRating: Number(infraRating),
        resourcesRating: Number(resRating),
        overallSatisfaction:
          (Number(currRating) + Number(teachRating) + Number(infraRating) + Number(resRating)) / 4,
        suggestions: respSug,
      });
      setRecordModalOpen(false);
      resetRecordForm();
      loadData();
    } catch (err) {
      console.error("Failed to submit feedback", err);
    }
  };

  const handleUploadEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceTitle) return;

    try {
      await uploadEvidenceDocument(
        {
          criterionId: 1,
          indicatorCode: "1.4",
          metricCode: "1.4.1",
          title: evidenceTitle,
          academicYear: "2025-26",
          department: "IQAC",
          documentType: "PDF",
          description: evidenceDesc || "Evidentiary documentation supporting Metric 1.4.1 (Stakeholder Feedback & ATRs).",
          fileName: `${evidenceTitle.replace(/\s+/g, "_")}.pdf`,
          fileSize: "2.8 MB",
          evidenceUrl: `/documents/naac/evidence/${evidenceTitle.replace(/\s+/g, "_")}.pdf`,
          remarks: evidenceRemarks,
        },
        { name: "Dr. Snigdha Mohanty", role: "IQAC Coordinator" }
      );

      setEvidenceModalOpen(false);
      setEvidenceTitle("");
      setEvidenceDesc("");
      loadData();
      if (onEvidenceUpdated) onEvidenceUpdated();
    } catch (err) {
      console.error("Failed to upload evidence", err);
    }
  };

  const resetRecordForm = () => {
    setRespName("");
    setRespDept("Computer Science");
    setCurrRating("5");
    setTeachRating("4");
    setInfraRating("5");
    setResRating("4");
    setRespSug("");
  };

  if (!data) {
    return <div className="p-4 text-xs text-muted-foreground">Loading stakeholder feedback data...</div>;
  }

  const currentSummary =
    data.summaries.find((s) => s.stakeholder === activeStakeholder) ?? data.summaries[0];
  if (!currentSummary) {
    return <div className="p-4 text-xs text-muted-foreground">No stakeholder feedback summaries available.</div>;
  }
  const filteredRecords = data.records.filter(
    (r) =>
      r.stakeholder === activeStakeholder &&
      (recordSearch === "" ||
        r.department.toLowerCase().includes(recordSearch.toLowerCase()) ||
        (r.respondentName && r.respondentName.toLowerCase().includes(recordSearch.toLowerCase())) ||
        (r.suggestions && r.suggestions.toLowerCase().includes(recordSearch.toLowerCase())))
  );

  const totalResponses = data.summaries.reduce((acc, s) => acc + s.totalResponses, 0); // 2582
  const weightedTotal = data.summaries.reduce(
    (acc, s) => acc + (s.averageRating ?? s.averageScore ?? 4.4) * s.totalResponses,
    0
  );
  const overallAvgRating = Number((weightedTotal / (totalResponses || 1)).toFixed(2));

  // Five-Year Action Taken Reports Matrix
  const fiveYearAtrs = [
    {
      academicYear: "2025-26",
      stakeholderGroup: "Students & Teachers",
      feedbackRaised: "Requirement for modern Cloud Computing, AI modules & higher research seed funding.",
      actionTaken: "Launched 42 Value-Added Courses (AWS, GenAI, Python); raised faculty seed grant to ₹25 Lakhs.",
      gbResolution: "GB/RES/2026/04",
      publishedUrl: "/documents/naac/evidence/Curriculum_Feedback_ATR_2025_26.pdf",
      status: "Published on Website",
    },
    {
      academicYear: "2024-25",
      stakeholderGroup: "Employers & Alumni",
      feedbackRaised: "Need for corporate communication agility, interview grooming & industry mentor access.",
      actionTaken: "Partnered with Cambridge English & TCS iON; formed 380-member Global Alumni Mentorship Network.",
      gbResolution: "GB/RES/2025/11",
      publishedUrl: "/documents/naac/evidence/ATR_Employer_Alumni_2024_25.pdf",
      status: "Published on Website",
    },
    {
      academicYear: "2023-24",
      stakeholderGroup: "Parents & Students",
      feedbackRaised: "Hostel canteen modernization, extended library reading hours, and Wi-Fi across all hostels.",
      actionTaken: "Expanded 24/7 library reading hall, renovated kitchen facilities, and installed 1 Gbps campus Wi-Fi.",
      gbResolution: "GB/RES/2024/08",
      publishedUrl: "/documents/naac/evidence/ATR_Parent_Student_Facilities_2023_24.pdf",
      status: "Published on Website",
    },
    {
      academicYear: "2022-23",
      stakeholderGroup: "Teachers & Students",
      feedbackRaised: "E-learning infrastructure upgrade and automated internal examination score displays.",
      actionTaken: "Installed 24 smart interactive panels across seminar halls; launched student portal marks dashboard.",
      gbResolution: "GB/RES/2023/15",
      publishedUrl: "/documents/naac/evidence/ATR_ICT_Classrooms_2022_23.pdf",
      status: "Published on Website",
    },
    {
      academicYear: "2021-22",
      stakeholderGroup: "All Stakeholders",
      feedbackRaised: "Pandemic recovery, hybrid learning support, and career placement resilience.",
      actionTaken: "Subscribed to Google Workspace Enterprise & NPTEL Local Chapter; conducted 100% online mock drives.",
      gbResolution: "GB/RES/2022/03",
      publishedUrl: "/documents/naac/evidence/ATR_Hybrid_Pandemic_Response_2021_22.pdf",
      status: "Published on Website",
    },
  ];

  return (
    <Card className="border-sky-500/30 bg-gradient-to-br from-sky-500/5 via-card to-background shadow-xs overflow-hidden">
      {/* Header Banner */}
      <CardHeader className="bg-sky-500/10 border-b border-sky-500/20 py-4 px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex size-7 items-center justify-center rounded-md bg-sky-600 text-white font-mono text-xs font-bold shrink-0">
                1.4.1
              </span>
              <Badge className="bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30 text-[11px] font-semibold">
                Criterion 1 • Key Indicator 1.4
              </Badge>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold">
                ✓ Option A (All 5 Stakeholder Groups)
              </Badge>
              <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-[11px]">
                {totalResponses.toLocaleString()} Total Responses
              </Badge>
            </div>
            <CardTitle className="text-base sm:text-lg font-bold text-foreground">
              Stakeholder Feedback & Action Taken Report (ATR) Console
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground leading-relaxed">
              Structured institutional feedback collection from Students, Teachers, Employers, Alumni, and Parents; statistical satisfaction analytics; and Action Taken Reports (ATRs) hosted on the public institutional website.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <Button
              size="sm"
              variant="default"
              onClick={() => setRecordModalOpen(true)}
              className="gap-1.5 text-xs bg-sky-600 hover:bg-sky-700 text-white"
            >
              <Plus className="size-3.5" />
              <span>Record {activeStakeholder} Feedback</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEvidenceModalOpen(true)}
              className="gap-1.5 text-xs border-sky-500/30 text-sky-700 dark:text-sky-300 hover:bg-sky-500/10"
            >
              <UploadCloud className="size-3.5" />
              <span>Attach Evidence</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              asChild
              className="gap-1.5 text-xs border-sky-500/30 text-sky-700 dark:text-sky-300 hover:bg-sky-500/10"
            >
              <a href="/college/iqac" target="_blank" rel="noreferrer">
                <Globe className="size-3.5" />
                <span>Public Web ATR</span>
              </a>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-6">
        {/* KPI Benchmark Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Total Responses */}
          <Card className="border-border/60 bg-card shadow-2xs">
            <CardContent className="p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Total Responses Tabulated</span>
                <span className="flex size-7 items-center justify-center rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400">
                  <Users className="size-3.5" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-foreground">{totalResponses.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">Across 5 Groups</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Students (1,420), Parents (620), Alumni (380), Teachers (114), Employers (48).
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Institutional Satisfaction */}
          <Card className="border-border/60 bg-card shadow-2xs">
            <CardContent className="p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Overall Satisfaction Score</span>
                <span className="flex size-7 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Star className="size-3.5" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-foreground">{overallAvgRating}</span>
                <span className="text-xs text-muted-foreground">/ 5.00 Scale</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                  <span>Approval Level</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">88.8% Very High</span>
                </div>
                <Progress value={88.8} className="h-1.5 bg-muted [&>div]:bg-emerald-600" />
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Option A Compliance */}
          <Card className="border-border/60 bg-card shadow-2xs">
            <CardContent className="p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">NAAC Benchmark Status</span>
                <span className="flex size-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-3.5" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">Option A</span>
                <span className="text-xs text-muted-foreground">Highest Grade (4.0)</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Feedback collected, analyzed, actions implemented, and ATRs published on website.
              </p>
            </CardContent>
          </Card>

          {/* Card 4: Action Taken Reports */}
          <Card className="border-border/60 bg-card shadow-2xs">
            <CardContent className="p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Action Taken Reports (5-Yr)</span>
                <span className="flex size-7 items-center justify-center rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <FileText className="size-3.5" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-foreground">5 Published</span>
                <span className="text-xs text-muted-foreground">100% Ratified</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Approved by Governing Body and accessible via public IQAC web page.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full h-auto p-1 bg-muted/60">
            <TabsTrigger value="analysis" className="text-xs py-2 gap-1.5 data-[state=active]:bg-background">
              <Users className="size-3.5" />
              <span>5-Stakeholder Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="atrs" className="text-xs py-2 gap-1.5 data-[state=active]:bg-background">
              <FileText className="size-3.5" />
              <span>Published ATRs (5-Yr)</span>
            </TabsTrigger>
            <TabsTrigger value="responses" className="text-xs py-2 gap-1.5 data-[state=active]:bg-background">
              <Search className="size-3.5" />
              <span>Response Samples & Logs</span>
            </TabsTrigger>
            <TabsTrigger value="framework" className="text-xs py-2 gap-1.5 data-[state=active]:bg-background">
              <Award className="size-3.5" />
              <span>Survey Questionnaire & Policy</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: 5-STAKEHOLDER ANALYTICS */}
          <TabsContent value="analysis" className="space-y-4">
            {/* Stakeholder Selector Sub-Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {data.summaries.map((s) => (
                <button
                  key={s.stakeholder}
                  onClick={() => setActiveStakeholder(s.stakeholder as StakeholderType)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all shrink-0 flex items-center gap-1.5 ${
                    activeStakeholder === s.stakeholder
                      ? "border-sky-500 bg-sky-500/10 text-sky-700 dark:text-sky-300 font-bold shadow-2xs"
                      : "border-border/60 bg-card text-muted-foreground hover:bg-muted/40"
                  }`}
                >
                  <span>{s.stakeholder}s ({s.totalResponses})</span>
                  <Badge variant="secondary" className="text-[10px] px-1 py-0 font-mono">
                    ★ {(s.averageRating ?? s.averageScore ?? 4.5).toFixed(1)}
                  </Badge>
                </button>
              ))}
            </div>

            {/* Executive Overview for Selected Stakeholder */}
            <Card className="border-border/60 bg-card shadow-2xs">
              <CardHeader className="py-3 px-4 border-b border-border/40 bg-muted/10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-sky-600 dark:text-sky-400">
                      {currentSummary.stakeholder} Feedback Evaluation • Academic Year 2025-26
                    </span>
                    <CardTitle className="text-base font-bold text-foreground mt-0.5">
                      Satisfaction Index: {(currentSummary.averageRating ?? currentSummary.averageScore ?? 4.5).toFixed(2)} / 5.00
                    </CardTitle>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs self-start sm:self-auto font-mono">
                    {currentSummary.totalResponses} Responses Audited
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {/* Metric Categories Ratings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {currentSummary.categoryScores.map((cat, idx) => (
                    <div key={idx} className="rounded-lg border border-border/60 bg-card p-3 space-y-1">
                      <span className="text-xs text-muted-foreground">{cat.category}</span>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-foreground">{cat.score} / 5.0</span>
                        <div className="flex text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`size-3.5 ${
                                i < Math.round(cat.score) ? "fill-amber-400 text-amber-400" : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <Progress value={(cat.score / 5) * 100} className="h-1 bg-muted mt-1" />
                    </div>
                  ))}
                </div>

                {/* Statutory Action Taken Report (ATR) Highlight */}
                <div className="rounded-lg bg-sky-500/10 border border-sky-500/20 p-3.5 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <CheckCircle2 className="size-4 text-emerald-600" />
                    <span>Statutory Action Taken Report (ATR) Implemented:</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {currentSummary.atrSummary}
                  </p>
                  <div className="pt-1">
                    <Button variant="ghost" size="xs" asChild className="text-sky-600 dark:text-sky-400 text-xs p-0 h-auto gap-1">
                      <a href="/documents/naac/evidence/Curriculum_Feedback_ATR_2025_26.pdf" target="_blank" rel="noreferrer">
                        <span>Download Full Published ATR Document</span>
                        <ExternalLink className="size-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: PUBLISHED ACTION TAKEN REPORTS (5-YEARS) */}
          <TabsContent value="atrs" className="space-y-4">
            <div className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-1">
              <h4 className="text-sm font-bold text-foreground">5-Year Published Action Taken Reports (ATRs)</h4>
              <p className="text-xs text-muted-foreground">
                Formal resolutions passed by the Academic Council and Governing Body in response to stakeholder feedback, publicly available on the college portal satisfying NAAC Option A.
              </p>
            </div>

            <ResponsiveTableContainer>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20">
                    <TableHead className="w-28 font-semibold">Academic Year</TableHead>
                    <TableHead className="w-48 font-semibold">Stakeholder Group</TableHead>
                    <TableHead className="font-semibold min-w-[220px]">Feedback Highlight Raised</TableHead>
                    <TableHead className="font-semibold min-w-[240px]">Action Implemented & Council Resolution</TableHead>
                    <TableHead className="w-36 font-semibold">Website Publication</TableHead>
                    <TableHead className="w-24 font-semibold text-right">Document</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fiveYearAtrs.map((atr) => (
                    <TableRow key={atr.academicYear} className="hover:bg-muted/15">
                      <TableCell className="align-top font-mono font-bold text-xs text-foreground">
                        {atr.academicYear}
                      </TableCell>
                      <TableCell className="align-top text-xs font-semibold text-foreground">
                        {atr.stakeholderGroup}
                      </TableCell>
                      <TableCell className="align-top text-xs text-muted-foreground">
                        {atr.feedbackRaised}
                      </TableCell>
                      <TableCell className="align-top text-xs">
                        <p className="text-foreground">{atr.actionTaken}</p>
                        <Badge variant="outline" className="text-[10px] font-mono mt-1">
                          {atr.gbResolution}
                        </Badge>
                      </TableCell>
                      <TableCell className="align-top">
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] flex items-center gap-1 w-fit">
                          <Globe className="size-3" />
                          <span>{atr.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="align-top text-right">
                        <Button asChild size="xs" variant="ghost" className="gap-1 text-xs text-primary">
                          <a href={atr.publishedUrl} target="_blank" rel="noreferrer">
                            <Download className="size-3" />
                            <span>PDF</span>
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ResponsiveTableContainer>
          </TabsContent>

          {/* TAB 3: INDIVIDUAL RESPONSE LOGS */}
          <TabsContent value="responses" className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${activeStakeholder} responses by department, name or suggestions...`}
                  value={recordSearch}
                  onChange={(e) => setRecordSearch(e.target.value)}
                  className="pl-9 h-9 text-xs sm:text-sm"
                />
              </div>

              <Button
                size="sm"
                onClick={() => setRecordModalOpen(true)}
                className="gap-1.5 text-xs bg-sky-600 hover:bg-sky-700 text-white shrink-0"
              >
                <Plus className="size-3.5" />
                <span>Add {activeStakeholder} Sample</span>
              </Button>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {filteredRecords.map((r) => (
                <Card key={r.id} className="border-border/70 p-3.5 shadow-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm text-foreground">
                        {r.respondentName || "Anonymous Respondent"}
                      </h4>
                      <p className="text-[11px] text-muted-foreground">{r.department}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      ★ {(r.overallSatisfaction ?? 4.5).toFixed(1)} / 5
                    </Badge>
                  </div>

                  <div className="mt-2.5 grid grid-cols-3 gap-2 text-center text-xs bg-muted/20 p-2 rounded-lg border border-border/40">
                    <div>
                      <span className="text-[9px] uppercase text-muted-foreground block">Curriculum</span>
                      <span className="font-bold text-foreground text-xs">{r.curriculumRating}/5</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-muted-foreground block">Teaching</span>
                      <span className="font-bold text-foreground text-xs">{r.teachingRating}/5</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-muted-foreground block">Infra</span>
                      <span className="font-bold text-foreground text-xs">{r.infrastructureRating}/5</span>
                    </div>
                  </div>

                  {r.suggestions && (
                    <p className="mt-2 text-xs text-muted-foreground italic bg-muted/20 p-2 rounded border border-border/30">
                      "{r.suggestions}"
                    </p>
                  )}

                  <div className="mt-2 text-right text-[10px] text-muted-foreground border-t border-border/40 pt-1.5">
                    Submitted on {r.date}
                  </div>
                </Card>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block">
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="font-semibold min-w-[140px]">Respondent</TableHead>
                      <TableHead className="font-semibold min-w-[130px]">Department</TableHead>
                      <TableHead className="w-24 text-center font-semibold">Curriculum</TableHead>
                      <TableHead className="w-24 text-center font-semibold">Teaching</TableHead>
                      <TableHead className="w-24 text-center font-semibold">Infrastructure</TableHead>
                      <TableHead className="font-semibold min-w-[260px]">Specific Feedback & Suggestions</TableHead>
                      <TableHead className="w-28 text-right font-semibold">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((r) => (
                      <TableRow key={r.id} className="hover:bg-muted/15">
                        <TableCell className="align-top font-bold text-xs text-foreground">
                          {r.respondentName || "Anonymous"}
                        </TableCell>
                        <TableCell className="align-top text-xs text-muted-foreground">
                          {r.department}
                        </TableCell>
                        <TableCell className="align-top text-center font-bold text-xs text-foreground">
                          {r.curriculumRating} / 5
                        </TableCell>
                        <TableCell className="align-top text-center font-bold text-xs text-foreground">
                          {r.teachingRating} / 5
                        </TableCell>
                        <TableCell className="align-top text-center font-bold text-xs text-foreground">
                          {r.infrastructureRating} / 5
                        </TableCell>
                        <TableCell className="align-top text-xs text-muted-foreground">
                          {r.suggestions ? `"${r.suggestions}"` : "No specific remarks"}
                        </TableCell>
                        <TableCell className="align-top text-right text-xs text-muted-foreground font-mono">
                          {r.date}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ResponsiveTableContainer>
            </div>
          </TabsContent>

          {/* TAB 4: SURVEY QUESTIONNAIRE & POLICY */}
          <TabsContent value="framework" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <Card className="border-border/60 bg-card shadow-2xs">
                <CardHeader className="py-3 px-4 border-b border-border/40">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Award className="size-4 text-sky-600" />
                      <span>Standardized 5-Point Likert Survey Metrics</span>
                    </CardTitle>
                    <Badge variant="outline" className="text-[10px]">
                      NAAC Guidelines
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-2 text-xs text-muted-foreground">
                  <ul className="space-y-2 list-disc pl-4">
                    <li>
                      <strong className="text-foreground">Curriculum Relevance:</strong> Depth of syllabus content, contemporary applicability, and alignment with industry standards.
                    </li>
                    <li>
                      <strong className="text-foreground">Teaching-Learning Process:</strong> Interactive pedagogies, experiential laboratories, LOCF learning outcome clarity.
                    </li>
                    <li>
                      <strong className="text-foreground">Infrastructure & ICT:</strong> Smart classrooms, laboratory equipment modernness, and campus high-speed connectivity.
                    </li>
                    <li>
                      <strong className="text-foreground">Library & Learning Resources:</strong> Access to e-journals, DELNET/INFLIBNET, and timely textbook procurement.
                    </li>
                    <li>
                      <strong className="text-foreground">Placements & Skilling:</strong> Training programs, campus placement drives, and value-added certification opportunities.
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-card shadow-2xs">
                <CardHeader className="py-3 px-4 border-b border-border/40">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Globe className="size-4 text-emerald-600" />
                      <span>Public Website Disclosure Protocol</span>
                    </CardTitle>
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px]">
                      Option A Verified
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-2 text-xs text-muted-foreground">
                  <p>
                    In strict accordance with NAAC Quality Mandate guidelines:
                  </p>
                  <ul className="space-y-1.5 list-disc pl-4">
                    <li>All annual feedback survey findings are audited by the College IQAC.</li>
                    <li>ATR recommendations are tabled before the Academic Council and Governing Body for formal sanction.</li>
                    <li>Final signed ATRs with institutional seals are permanently hosted under the public IQAC portal for stakeholder access.</li>
                  </ul>
                  <div className="pt-2">
                    <Button variant="outline" size="xs" asChild className="gap-1 text-xs">
                      <a href="/college/iqac" target="_blank" rel="noreferrer">
                        <ExternalLink className="size-3 text-sky-600" />
                        <span>View Public IQAC Feedback Section</span>
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Attached Evidences Section */}
        <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600" />
                <span>NAAC Peer Team Evidence Dossier (Metric 1.4.1)</span>
              </h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Feedback survey forms, analytical charts, Governing Body ATR resolution minutes, and public website links.
              </p>
            </div>
            <Button
              size="xs"
              variant="outline"
              onClick={() => setEvidenceModalOpen(true)}
              className="gap-1 text-xs shrink-0 self-start sm:self-auto"
            >
              <UploadCloud className="size-3" />
              <span>Attach New Evidence</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
            {attachedEvidence.map((ev) => (
              <div
                key={ev.id}
                className="rounded border border-border/60 bg-card p-3 text-xs space-y-1.5 shadow-2xs hover:border-sky-500/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="font-semibold text-foreground line-clamp-2 leading-tight">
                    {ev.title}
                  </span>
                  <Badge variant="outline" className="text-[9px] font-mono shrink-0">
                    {ev.documentType}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-[10px] line-clamp-2">
                  {ev.description}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[10px]">
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ {ev.status}
                  </span>
                  <a
                    href={ev.evidenceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline flex items-center gap-0.5 font-medium"
                  >
                    <span>View File</span>
                    <ExternalLink className="size-2.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      {/* MODAL 1: RECORD STAKEHOLDER RESPONSE */}
      <Dialog open={recordModalOpen} onOpenChange={setRecordModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Users className="size-4 text-sky-600" />
              <span>Record {activeStakeholder} Feedback Response</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Log feedback collected via structured questionnaire on curriculum and campus facilities.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveResponse} className="space-y-3.5 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Respondent Name (Optional)</Label>
              <Input
                placeholder="Leave blank for anonymous response"
                value={respName}
                onChange={(e) => setRespName(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Department / Affiliation *</Label>
              <Input
                value={respDept}
                onChange={(e) => setRespDept(e.target.value)}
                className="h-8 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Curriculum Relevance (1-5) *</Label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={currRating}
                  onChange={(e) => setCurrRating(e.target.value)}
                  className="h-8 text-xs"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Teaching Quality (1-5) *</Label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={teachRating}
                  onChange={(e) => setTeachRating(e.target.value)}
                  className="h-8 text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Infrastructure (1-5) *</Label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={infraRating}
                  onChange={(e) => setInfraRating(e.target.value)}
                  className="h-8 text-xs"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Resources & Library (1-5) *</Label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={resRating}
                  onChange={(e) => setResRating(e.target.value)}
                  className="h-8 text-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Specific Suggestions / Feedback *</Label>
              <Textarea
                placeholder="Share your thoughts on syllabus modernness, skill development, or facilities..."
                value={respSug}
                onChange={(e) => setRespSug(e.target.value)}
                className="text-xs min-h-[60px]"
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setRecordModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-sky-600 hover:bg-sky-700 text-white">
                Submit Response
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: ATTACH EVIDENCE */}
      <Dialog open={evidenceModalOpen} onOpenChange={setEvidenceModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <UploadCloud className="size-4 text-sky-600" />
              <span>Attach Evidentiary Document (1.4.1)</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Upload Action Taken Reports (ATRs), feedback analysis graphs, or Governing Body minutes.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadEvidence} className="space-y-3.5 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Document Title *</Label>
              <Input
                placeholder="e.g. Governing_Body_ATR_Approval_Resolution_2025_26"
                value={evidenceTitle}
                onChange={(e) => setEvidenceTitle(e.target.value)}
                className="h-8 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Description</Label>
              <Textarea
                placeholder="Describe feedback context, respondent counts, and approved action items..."
                value={evidenceDesc}
                onChange={(e) => setEvidenceDesc(e.target.value)}
                className="text-xs min-h-[60px]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Compliance Remarks</Label>
              <Input
                value={evidenceRemarks}
                onChange={(e) => setEvidenceRemarks(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setEvidenceModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-sky-600 hover:bg-sky-700 text-white">
                Upload & Link Evidence
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
