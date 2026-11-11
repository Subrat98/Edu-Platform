import { useState, useEffect } from "react";
import {
  BookOpen,
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
  Award,
  Sparkles,
  Network,
  Share2,
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
  getCbcsData,
  addCbcsProgrammeRecord,
  addUniversityNotification,
  addElectiveCourseOption,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type {
  CbcsProgrammeRecord,
  UniversityNotification,
  ElectiveCourseOption,
  NaacEvidenceDocument,
} from "@/types";

interface CbcsManagementConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function CbcsManagementConsole({ onEvidenceUpdated }: CbcsManagementConsoleProps) {
  const [activeTab, setActiveTab] = useState("programmes");
  const [, setLoading] = useState(true);

  // Data states
  const [programmeRecords, setProgrammeRecords] = useState<CbcsProgrammeRecord[]>([]);
  const [notifications, setNotifications] = useState<UniversityNotification[]>([]);
  const [electiveCourses, setElectiveCourses] = useState<ElectiveCourseOption[]>([]);
  const [adoptionPct, setAdoptionPct] = useState(100.0);
  const [benchmarkPct, setBenchmarkPct] = useState(100.0);
  const [totalStudentsEnrolled, setTotalStudentsEnrolled] = useState(1196);
  const [attachedEvidence, setAttachedEvidence] = useState<NaacEvidenceDocument[]>([]);

  // Modals
  const [programmeModalOpen, setProgrammeModalOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [electiveModalOpen, setElectiveModalOpen] = useState(false);
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);

  // Form states - Programme
  const [progName, setProgName] = useState("");
  const [progCode, setProgCode] = useState("");
  const [progDept, setProgDept] = useState("Computer Science");
  const [progLevel, setProgLevel] = useState<CbcsProgrammeRecord["level"]>("UG");
  const [progYear, setProgYear] = useState("2025-26");
  const [progCbcsType, setProgCbcsType] = useState<CbcsProgrammeRecord["cbcsType"]>("Choice Based Credit System (CBCS)");
  const [progTotalCredits, setProgTotalCredits] = useState(140);
  const [progCoreCredits, setProgCoreCredits] = useState(80);
  const [progDseCredits, setProgDseCredits] = useState(24);
  const [progGeCredits, setProgGeCredits] = useState(16);
  const [progSecCredits, setProgSecCredits] = useState(12);
  const [progAeccCredits, setProgAeccCredits] = useState(8);
  const [progNotifNum, setProgNotifNum] = useState("UU/ACAD/CBCS-NEP/2023/1842");

  // Form states - Notification
  const [notifNumber, setNotifNumber] = useState("");
  const [notifAuthority, setNotifAuthority] = useState("Utkal University Academic Council");
  const [notifSubject, setNotifSubject] = useState("");
  const [notifDate, setNotifDate] = useState("");
  const [notifYear, setNotifYear] = useState("2025-26");
  const [notifProgs, setNotifProgs] = useState("All UG & PG Programmes");

  // Form states - Elective Course
  const [elecCode, setElecCode] = useState("");
  const [elecTitle, setElecTitle] = useState("");
  const [elecDept, setElecDept] = useState("Computer Science");
  const [elecType, setElecType] = useState<ElectiveCourseOption["electiveType"]>("Generic Elective (GE / Open Elective)");
  const [elecCredits, setElecCredits] = useState(4);
  const [elecSemester, setElecSemester] = useState("Semester III");
  const [elecTarget, setElecTarget] = useState("B.Sc., B.Com., BBA, B.A.");
  const [elecSwayam, setElecSwayam] = useState(true);

  // Evidence Form state
  const [eviTitle, setEviTitle] = useState("");
  const [eviDept, setEviDept] = useState("Academics & IQAC");
  const [eviYear, setEviYear] = useState("2025-26");
  const [eviDesc, setEviDesc] = useState("");
  const [eviRemarks, setEviRemarks] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getCbcsData();
      setProgrammeRecords(data.programmeRecords);
      setNotifications(data.notifications);
      setElectiveCourses(data.electiveCourses);
      setAdoptionPct(data.adoptionPercentage);
      setBenchmarkPct(data.benchmarkPercentage);
      setTotalStudentsEnrolled(data.totalStudentsEnrolledInElectives);

      const evi = await getEvidenceForMetric("1.2.1");
      setAttachedEvidence(evi);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProgramme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!progName || !progCode) return;

    const electiveTotal = Number(progDseCredits) + Number(progGeCredits) + Number(progSecCredits);
    const pct = Number(((electiveTotal / (Number(progTotalCredits) || 1)) * 100).toFixed(2));

    await addCbcsProgrammeRecord(
      {
        programmeId: "prog-" + Date.now(),
        programmeCode: progCode,
        programmeName: progName,
        department: progDept,
        level: progLevel,
        implementationYear: progYear,
        cbcsType: progCbcsType,
        totalCredits: Number(progTotalCredits),
        coreCredits: Number(progCoreCredits),
        dseCredits: Number(progDseCredits),
        geCredits: Number(progGeCredits),
        secCredits: Number(progSecCredits),
        aeccCredits: Number(progAeccCredits),
        electivePercentage: pct,
        universityNotificationNumber: progNotifNum,
        councilResolutionNumber: "ACM/XXXIV/2026",
        status: "Active & Verified",
        syllabusUrl: "/documents/naac/evidence/CBCS_Syllabus.pdf",
        evidenceId: "evi-121-prog-01",
      },
      { name: "Dr. Snigdha Mohanty", role: "IQAC Coordinator" }
    );

    setProgrammeModalOpen(false);
    setProgName("");
    setProgCode("");
    loadData();
  };

  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifNumber || !notifSubject) return;

    await addUniversityNotification(
      {
        notificationNumber: notifNumber,
        issuingAuthority: notifAuthority,
        subject: notifSubject,
        issueDate: notifDate || new Date().toISOString().slice(0, 10),
        effectiveAcademicYear: notifYear,
        programmesCovered: notifProgs.split(",").map((p) => p.trim()).filter(Boolean),
        gazetteOrderUrl: "/documents/naac/evidence/University_CBCS_Notification.pdf",
        evidenceId: "evi-121-notif-01",
        verifiedBy: "Dr. Himansu Sekhar Das (Principal)",
      },
      { name: "Dr. Snigdha Mohanty", role: "IQAC Coordinator" }
    );

    setNotificationModalOpen(false);
    setNotifNumber("");
    setNotifSubject("");
    loadData();
  };

  const handleCreateElective = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!elecCode || !elecTitle) return;

    await addElectiveCourseOption(
      {
        courseCode: elecCode,
        courseTitle: elecTitle,
        offeringDepartment: elecDept,
        targetProgrammes: elecTarget.split(",").map((t) => t.trim()).filter(Boolean),
        electiveType: elecType,
        credits: Number(elecCredits),
        semester: elecSemester,
        prerequisites: "Departmental Prerequisites apply",
        enrolledStudentsCount: 45,
        swayamTransferEligible: elecSwayam,
        syllabusDocumentUrl: "/documents/naac/evidence/Elective_Syllabus.pdf",
      },
      { name: "Dr. Snigdha Mohanty", role: "IQAC Coordinator" }
    );

    setElectiveModalOpen(false);
    setElecCode("");
    setElecTitle("");
    loadData();
  };

  const handleAttachEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eviTitle) return;

    await uploadEvidenceDocument(
      {
        criterionId: 1,
        indicatorCode: "1.2",
        metricCode: "1.2.1",
        title: eviTitle,
        academicYear: eviYear,
        department: eviDept,
        documentType: "PDF",
        description: eviDesc,
        remarks: eviRemarks,
        fileName: `${eviTitle.replace(/\s+/g, "_")}.pdf`,
        fileSize: "3.5 MB",
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
      {/* Metric 1.2.1 Overview Banner */}
      <Card className="border-indigo-500/20 bg-gradient-to-r from-indigo-500/5 via-primary/10 to-transparent">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-primary text-primary-foreground font-mono text-xs">Metric 1.2.1</Badge>
                <Badge variant="outline" className="border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-xs">
                  Quantitative Metric (Weightage: 15)
                </Badge>
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs">
                  100% CBCS Adoption Achieved ✅
                </Badge>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground mt-2">
                Choice Based Credit System (CBCS) & Academic Flexibility Console
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl">
                Statutory audit of Choice Based Credit System (CBCS) implementation, elective course distributions (DSE, GE, SEC),
                affiliating university notifications, and student cross-department enrollment registers.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Button size="sm" onClick={() => setEvidenceModalOpen(true)} className="gap-1.5 shadow-xs">
                <UploadCloud className="size-4" />
                <span>Attach Evidence</span>
              </Button>
            </div>
          </div>

          {/* Quantitative Progress Gauge */}
          <div className="rounded-lg border border-border/70 bg-card p-4 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
                  CBCS & Elective Course Implementation Rate
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-extrabold text-foreground">{adoptionPct.toFixed(1)}%</span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    (All {programmeRecords.length} out of {programmeRecords.length} UG/PG/Diploma Programmes offer CBCS/Electives)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[11px] text-muted-foreground block">Mandatory NAAC Benchmark</span>
                  <strong className="text-sm text-foreground">100%</strong>
                </div>
                <Badge className="bg-emerald-600 text-white text-xs px-2.5 py-1">
                  ✓ Full Benchmark Attained
                </Badge>
              </div>
            </div>

            <div className="pt-1">
              <Progress value={adoptionPct} className="h-3 bg-muted" />
            </div>
            <div className="flex justify-between text-[11px] text-muted-foreground pt-0.5">
              <span>0% Implementation</span>
              <span className="text-emerald-600 font-medium">✓ 100% Full Adoption Verified by Academic Council</span>
              <span>100% Target</span>
            </div>
          </div>

          {/* Quick Stat Micro-Cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-1">
            <div className="rounded-lg border border-border/60 bg-card p-3 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Total Programmes</span>
                <Layers className="size-3.5 text-primary" />
              </div>
              <p className="text-xl font-bold text-foreground mt-1">{programmeRecords.length} Progs</p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">100% CBCS Compliant</p>
            </div>

            <div className="rounded-lg border border-border/60 bg-card p-3 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Interdisciplinary GEs</span>
                <Network className="size-3.5 text-indigo-600" />
              </div>
              <p className="text-xl font-bold text-foreground mt-1">{electiveCourses.length} Courses</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Across All Departments</p>
            </div>

            <div className="rounded-lg border border-border/60 bg-card p-3 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Elective Enrolments</span>
                <Users className="size-3.5 text-purple-600" />
              </div>
              <p className="text-xl font-bold text-foreground mt-1">{totalStudentsEnrolled} Students</p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">Cross-Dept Registered</p>
            </div>

            <div className="rounded-lg border border-border/60 bg-card p-3 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>University Orders</span>
                <FileText className="size-3.5 text-amber-600" />
              </div>
              <p className="text-xl font-bold text-foreground mt-1">{notifications.length} Gazettes</p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">UGC & State Validated</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs Container */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="overflow-x-auto pb-1 scrollbar-none">
          <TabsList className="bg-muted/60 p-1 h-auto flex-nowrap sm:flex-wrap justify-start gap-1 min-w-max">
            <TabsTrigger value="programmes" className="gap-1.5 text-xs sm:text-sm py-2 px-3">
              <Layers className="size-3.5" />
              <span>Programme Credit Audit ({programmeRecords.length})</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-1.5 text-xs sm:text-sm py-2 px-3">
              <Award className="size-3.5" />
              <span>University Notifications ({notifications.length})</span>
            </TabsTrigger>
            <TabsTrigger value="electives" className="gap-1.5 text-xs sm:text-sm py-2 px-3">
              <Network className="size-3.5" />
              <span>Electives & GE Catalog ({electiveCourses.length})</span>
            </TabsTrigger>
            <TabsTrigger value="evidence" className="gap-1.5 text-xs sm:text-sm py-2 px-3">
              <FileText className="size-3.5" />
              <span>Evidentiary Dossier ({attachedEvidence.length})</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ================= TAB 1: PROGRAMME CREDIT AUDIT REGISTER ================= */}
        <TabsContent value="programmes" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Programme-Wise CBCS Credit Breakdown</h3>
              <p className="text-xs text-muted-foreground">
                Complete credit distribution detailing Core, Discipline Elective (DSE), Generic Elective (GE), and Skill Enhancement (SEC).
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setProgrammeModalOpen(true)} className="gap-1.5 text-xs">
              <Plus className="size-3.5" />
              <span>Add CBCS Programme</span>
            </Button>
          </div>

          <ResponsiveTableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Programme</TableHead>
                  <TableHead>Level / Impl. Year</TableHead>
                  <TableHead>Credit System</TableHead>
                  <TableHead className="text-center">Total Credits</TableHead>
                  <TableHead className="text-center">Core Credits</TableHead>
                  <TableHead className="text-center">DSE + GE + SEC</TableHead>
                  <TableHead className="text-center">Elective %</TableHead>
                  <TableHead>University Reference</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programmeRecords.map((prog) => (
                  <TableRow key={prog.id}>
                    <TableCell>
                      <div>
                        <strong className="text-xs sm:text-sm text-foreground">{prog.programmeName}</strong>
                        <p className="text-[11px] text-muted-foreground font-mono">{prog.programmeCode} · {prog.department}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      <Badge variant="secondary" className="text-[10px] mr-1.5">{prog.level}</Badge>
                      <span className="text-muted-foreground">{prog.implementationYear}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-[10px] ${
                          prog.cbcsType === "Choice Based Credit System (CBCS)"
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                            : "bg-blue-500/10 text-blue-600 border border-blue-500/30"
                        }`}
                      >
                        {prog.cbcsType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-bold text-xs">{prog.totalCredits}</TableCell>
                    <TableCell className="text-center text-xs">{prog.coreCredits}</TableCell>
                    <TableCell className="text-center text-xs font-semibold text-primary">
                      {prog.dseCredits} + {prog.geCredits} + {prog.secCredits}
                    </TableCell>
                    <TableCell className="text-center font-mono font-bold text-xs text-foreground">
                      {prog.electivePercentage}%
                    </TableCell>
                    <TableCell className="text-xs">
                      <p className="font-mono text-[10.5px] text-foreground truncate max-w-[150px]" title={prog.universityNotificationNumber}>
                        {prog.universityNotificationNumber}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{prog.councilResolutionNumber}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild className="h-7 text-xs gap-1 text-primary">
                        <a href={prog.syllabusUrl} target="_blank" rel="noreferrer">
                          <ExternalLink className="size-3" />
                          <span>Curriculum</span>
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ResponsiveTableContainer>
        </TabsContent>

        {/* ================= TAB 2: UNIVERSITY NOTIFICATIONS ================= */}
        <TabsContent value="notifications" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Statutory University & Regulatory Notifications</h3>
              <p className="text-xs text-muted-foreground">
                Affiliating university gazettes, UGC directives, and state higher education department model CBCS orders.
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setNotificationModalOpen(true)} className="gap-1.5 text-xs">
              <Plus className="size-3.5" />
              <span>Record Notification</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notifications.map((notif) => (
              <Card key={notif.id} className="border-border/70 shadow-2xs hover:shadow-xs transition-shadow">
                <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono font-bold text-xs text-primary">{notif.notificationNumber}</span>
                      <CardTitle className="text-sm font-semibold text-foreground mt-1">
                        {notif.issuingAuthority}
                      </CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        Issue Date: {notif.issueDate} · Effective Year: {notif.effectiveAcademicYear}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      Evidence: {notif.evidenceId}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                      Gazette Subject & Order
                    </span>
                    <p className="text-xs text-foreground mt-0.5 leading-relaxed">{notif.subject}</p>
                  </div>

                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                      Programmes Covered
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {notif.programmesCovered.map((prog, i) => (
                        <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0.5">
                          {prog}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Verified by: <strong className="text-foreground">{notif.verifiedBy}</strong>
                    </span>
                    <Button variant="ghost" size="sm" asChild className="h-7 text-xs gap-1 text-primary">
                      <a href={notif.gazetteOrderUrl} target="_blank" rel="noreferrer">
                        <Download className="size-3" />
                        <span>Download Gazette</span>
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ================= TAB 3: ELECTIVES & GE CATALOG ================= */}
        <TabsContent value="electives" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Interdisciplinary Elective Course Offerings</h3>
              <p className="text-xs text-muted-foreground">
                Generic Electives (GE), Discipline Specific Electives (DSE), and Skill Courses open to cross-departmental enrollments.
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setElectiveModalOpen(true)} className="gap-1.5 text-xs">
              <Plus className="size-3.5" />
              <span>Add Elective Course</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {electiveCourses.map((course) => (
              <Card key={course.id} className="border-border/70 p-4 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="font-mono text-xs">{course.courseCode}</Badge>
                        <Badge
                          variant="secondary"
                          className={`text-[10px] ${
                            course.electiveType.includes("Generic")
                              ? "bg-indigo-500/10 text-indigo-600 border border-indigo-500/30"
                              : course.electiveType.includes("Discipline")
                              ? "bg-blue-500/10 text-blue-600 border border-blue-500/30"
                              : "bg-purple-500/10 text-purple-600 border border-purple-500/30"
                          }`}
                        >
                          {course.electiveType}
                        </Badge>
                        {course.swayamTransferEligible && (
                          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px]">
                            SWAYAM / MOOCs Credit Transfer
                          </Badge>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-foreground mt-1">{course.courseTitle}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Offered by: {course.offeringDepartment} · {course.semester} · {course.credits} Credits
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                      Target Eligible Programmes:
                    </span>
                    <p className="text-xs text-foreground mt-0.5">{course.targetProgrammes.join(" • ")}</p>
                  </div>

                  <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Current Enrolment: <strong className="text-foreground font-mono">{course.enrolledStudentsCount} Students</strong>
                    </span>
                    <Button variant="ghost" size="sm" asChild className="h-7 text-xs gap-1 text-primary">
                      <a href={course.syllabusDocumentUrl} target="_blank" rel="noreferrer">
                        <ExternalLink className="size-3" />
                        <span>Syllabus</span>
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ================= TAB 4: EVIDENTIARY DOSSIER ================= */}
        <TabsContent value="evidence" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Attached Metric 1.2.1 Evidence Documents</h3>
              <p className="text-xs text-muted-foreground">
                All supporting artifacts mapped to Metric 1.2.1 in the NAAC Evidence Repository with verification status.
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

      {/* MODAL: Add CBCS Programme Record */}
      <Dialog open={programmeModalOpen} onOpenChange={setProgrammeModalOpen}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add CBCS Programme Record</DialogTitle>
            <DialogDescription>
              Register credit breakdown and elective percentages for an institutional degree programme.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateProgramme} className="space-y-3.5 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Programme Name *</Label>
                <Input
                  placeholder="e.g. B.Sc. (Honours) Zoology"
                  required
                  value={progName}
                  onChange={(e) => setProgName(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Programme Code *</Label>
                <Input
                  placeholder="e.g. BSC-ZOO"
                  required
                  value={progCode}
                  onChange={(e) => setProgCode(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Department</Label>
                <Input
                  value={progDept}
                  onChange={(e) => setProgDept(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Level</Label>
                <Select value={progLevel} onValueChange={(v) => setProgLevel(v as CbcsProgrammeRecord["level"])}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UG">UG</SelectItem>
                    <SelectItem value="PG">PG</SelectItem>
                    <SelectItem value="Diploma">Diploma</SelectItem>
                    <SelectItem value="Certificate">Certificate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Implementation Year</Label>
                <Input
                  value={progYear}
                  onChange={(e) => setProgYear(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Total Credits</Label>
                <Input
                  type="number"
                  value={progTotalCredits}
                  onChange={(e) => setProgTotalCredits(Number(e.target.value))}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Core Credits</Label>
                <Input
                  type="number"
                  value={progCoreCredits}
                  onChange={(e) => setProgCoreCredits(Number(e.target.value))}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">DSE Credits</Label>
                <Input
                  type="number"
                  value={progDseCredits}
                  onChange={(e) => setProgDseCredits(Number(e.target.value))}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">GE Credits</Label>
                <Input
                  type="number"
                  value={progGeCredits}
                  onChange={(e) => setProgGeCredits(Number(e.target.value))}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">SEC Credits</Label>
                <Input
                  type="number"
                  value={progSecCredits}
                  onChange={(e) => setProgSecCredits(Number(e.target.value))}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">AECC Credits</Label>
                <Input
                  type="number"
                  value={progAeccCredits}
                  onChange={(e) => setProgAeccCredits(Number(e.target.value))}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">University Notification Citation</Label>
              <Input
                placeholder="e.g. UU/ACAD/CBCS-NEP/2023/1842"
                value={progNotifNum}
                onChange={(e) => setProgNotifNum(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setProgrammeModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Save CBCS Record
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL: Record University Notification */}
      <Dialog open={notificationModalOpen} onOpenChange={setNotificationModalOpen}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Record University / Higher Ed Notification</DialogTitle>
            <DialogDescription>
              Log statutory circulars and gazettes mandating Choice Based Credit System adoption.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateNotification} className="space-y-3.5 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Notification Number *</Label>
                <Input
                  placeholder="e.g. UU/ACAD/CBCS/2026/410"
                  required
                  value={notifNumber}
                  onChange={(e) => setNotifNumber(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Issuing Authority *</Label>
                <Input
                  value={notifAuthority}
                  onChange={(e) => setNotifAuthority(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Subject / Title *</Label>
              <Textarea
                placeholder="Adoption of Choice Based Credit System and Academic Bank of Credits..."
                rows={2}
                required
                value={notifSubject}
                onChange={(e) => setNotifSubject(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Issue Date</Label>
                <Input
                  type="date"
                  value={notifDate}
                  onChange={(e) => setNotifDate(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Effective Academic Year</Label>
                <Input
                  value={notifYear}
                  onChange={(e) => setNotifYear(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Programmes Covered</Label>
              <Input
                value={notifProgs}
                onChange={(e) => setNotifProgs(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setNotificationModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Save Notification
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL: Add Elective Course */}
      <Dialog open={electiveModalOpen} onOpenChange={setElectiveModalOpen}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Interdisciplinary Elective Course</DialogTitle>
            <DialogDescription>
              Register a Generic Elective (GE) or Skill course open to students across other departments.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateElective} className="space-y-3.5 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Course Code *</Label>
                <Input
                  placeholder="e.g. CS-GE302"
                  required
                  value={elecCode}
                  onChange={(e) => setElecCode(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Course Title *</Label>
                <Input
                  placeholder="e.g. Artificial Intelligence for Everyone"
                  required
                  value={elecTitle}
                  onChange={(e) => setElecTitle(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Offering Department</Label>
                <Input
                  value={elecDept}
                  onChange={(e) => setElecDept(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Elective Type</Label>
                <Select value={elecType} onValueChange={(v) => setElecType(v as ElectiveCourseOption["electiveType"])}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Generic Elective (GE / Open Elective)">Generic Elective (GE)</SelectItem>
                    <SelectItem value="Discipline Specific Elective (DSE)">Discipline Elective (DSE)</SelectItem>
                    <SelectItem value="Skill Enhancement Course (SEC)">Skill Enhancement (SEC)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Credits</Label>
                <Input
                  type="number"
                  value={elecCredits}
                  onChange={(e) => setElecCredits(Number(e.target.value))}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Eligible Target Programmes</Label>
              <Input
                value={elecTarget}
                onChange={(e) => setElecTarget(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setElectiveModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Save Elective Course
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL: Attach Evidence Document */}
      <Dialog open={evidenceModalOpen} onOpenChange={setEvidenceModalOpen}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Attach Evidence to Metric 1.2.1</DialogTitle>
            <DialogDescription>
              Upload or link an institutional artifact directly to Choice Based Credit System records.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAttachEvidence} className="space-y-3.5 py-2">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Document Title *</Label>
              <Input
                placeholder="e.g. University CBCS Gazette Circular & Handbook"
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
              <Label className="text-xs font-semibold">Description & Context</Label>
              <Textarea
                placeholder="Detail what this document proves for NAAC DVV peer team review..."
                rows={2}
                value={eviDesc}
                onChange={(e) => setEviDesc(e.target.value)}
                className="text-xs"
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
                <span>Upload & Link to 1.2.1</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
