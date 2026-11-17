import { useState, useEffect } from "react";
import {
  Calendar,
  FileCheck,
  Plus,
  Download,
  Users,
  CheckCircle2,
  Clock,
  Layers,
  UploadCloud,
  FileText,
  Building2,
  AlertCircle,
  ExternalLink,
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
  getCurriculumPlanningData,
  addAcademicCouncilMeeting,
  addSemesterCalendar,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type {
  AcademicCouncilMeeting,
  SemesterAcademicCalendar,
  ProgrammeSyllabusStructure,
  LessonPlanAdherence,
  NaacEvidenceDocument,
} from "@/types";

interface CurriculumPlanningConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function CurriculumPlanningConsole({ onEvidenceUpdated }: CurriculumPlanningConsoleProps) {
  const [activeTab, setActiveTab] = useState("council");
  const [, setLoading] = useState(true);

  // Data states
  const [councilMeetings, setCouncilMeetings] = useState<AcademicCouncilMeeting[]>([]);
  const [academicCalendars, setAcademicCalendars] = useState<SemesterAcademicCalendar[]>([]);
  const [syllabusStructures, setSyllabusStructures] = useState<ProgrammeSyllabusStructure[]>([]);
  const [lessonPlanAdherence, setLessonPlanAdherence] = useState<LessonPlanAdherence[]>([]);
  const [attachedEvidence, setAttachedEvidence] = useState<NaacEvidenceDocument[]>([]);

  // Modals
  const [councilModalOpen, setCouncilModalOpen] = useState(false);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);

  // Council form
  const [newMeetingNo, setNewMeetingNo] = useState("");
  const [newMeetingDate, setNewMeetingDate] = useState("");
  const [newChairperson, setNewChairperson] = useState("Dr. Himansu Sekhar Das (Principal)");
  const [newMembersPresent, setNewMembersPresent] = useState(28);
  const [newAgenda, setNewAgenda] = useState("");
  const [newResolution, setNewResolution] = useState("");
  const [newProgramsApproved, setNewProgramsApproved] = useState("");

  // Calendar form
  const [calYear, setCalYear] = useState("2026-27");
  const [calSem, setCalSem] = useState<SemesterAcademicCalendar["semester"]>("Odd Semester");
  const [calStart, setCalStart] = useState("");
  const [calEnd, setCalEnd] = useState("");
  const [calDays, setCalDays] = useState(94);
  const [calCie, setCalCie] = useState("");
  const [calEndExam, setCalEndExam] = useState("");

  // Evidence upload form
  const [eviTitle, setEviTitle] = useState("");
  const [eviDept, setEviDept] = useState("Academics & IQAC");
  const [eviYear, setEviYear] = useState("2025-26");
  const [eviDesc, setEviDesc] = useState("");
  const [eviRemarks, setEviRemarks] = useState("");

  const loadAllData = async () => {
    setLoading(true);
    try {
      const data = await getCurriculumPlanningData();
      setCouncilMeetings(data.councilMeetings);
      setAcademicCalendars(data.academicCalendars);
      setSyllabusStructures(data.syllabusStructures);
      setLessonPlanAdherence(data.lessonPlanAdherence);

      const evi = await getEvidenceForMetric("1.1.1");
      setAttachedEvidence(evi);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeetingNo || !newMeetingDate) return;

    await addAcademicCouncilMeeting(
      {
        meetingNumber: newMeetingNo,
        meetingDate: newMeetingDate,
        chairperson: newChairperson,
        totalMembersPresent: Number(newMembersPresent),
        agenda: newAgenda,
        keyResolutions: newResolution.split("\n").filter(Boolean),
        programmesApproved: newProgramsApproved.split(",").map((s) => s.trim()).filter(Boolean),
        syllabusRevisionSummary: "Approved revised syllabus structure and course outcomes.",
        minutesDocumentUrl: "/documents/naac/evidence/Academic_Council_Minutes_Latest.pdf",
        evidenceId: "evi-101",
        status: "Approved",
      },
      { name: "Dr. Snigdha Mohanty", role: "IQAC Coordinator" }
    );

    setCouncilModalOpen(false);
    setNewMeetingNo("");
    setNewMeetingDate("");
    setNewAgenda("");
    setNewResolution("");
    setNewProgramsApproved("");
    loadAllData();
  };

  const handleCreateCalendar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!calYear || !calStart || !calEnd) return;

    await addSemesterCalendar(
      {
        academicYear: calYear,
        semester: calSem,
        programmesCovered: ["UG All Programmes", "PG All Programmes"],
        startDate: calStart,
        endDate: calEnd,
        instructionalDays: Number(calDays),
        continuousInternalEvaluationDates: calCie || "Continuous Internal Assessments Scheduled",
        endSemesterExamDates: calEndExam || "End Semester Examinations Window",
        coCurricularWindows: "Annual Sports and Cultural Weeks",
        status: "Statutory Approved",
        evidenceId: "evi-102",
        calendarPdfUrl: "/documents/naac/evidence/Academic_Calendar_Approved.pdf",
      },
      { name: "Dr. Snigdha Mohanty", role: "IQAC Coordinator" }
    );

    setCalendarModalOpen(false);
    loadAllData();
  };

  const handleAttachEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eviTitle) return;

    await uploadEvidenceDocument(
      {
        criterionId: 1,
        indicatorCode: "1.1",
        metricCode: "1.1.1",
        title: eviTitle,
        academicYear: eviYear,
        department: eviDept,
        documentType: "PDF",
        description: eviDesc,
        remarks: eviRemarks,
        fileName: `${eviTitle.replace(/\s+/g, "_")}.pdf`,
        fileSize: "2.8 MB",
        evidenceUrl: `/documents/naac/evidence/${eviTitle.replace(/\s+/g, "_")}.pdf`,
        uploadedBy: "Dr. Snigdha Mohanty",
      },
      { name: "Dr. Snigdha Mohanty", role: "IQAC Coordinator" }
    );

    setEvidenceModalOpen(false);
    setEviTitle("");
    setEviDesc("");
    setEviRemarks("");
    loadAllData();
    if (onEvidenceUpdated) onEvidenceUpdated();
  };

  const totalTeachingDaysAverage = Math.round(
    academicCalendars.reduce((acc, c) => acc + c.instructionalDays, 0) / (academicCalendars.length || 1)
  );

  const averageLessonPlanAdherence = (
    lessonPlanAdherence.reduce((acc, l) => acc + l.adherencePercentage, 0) / (lessonPlanAdherence.length || 1)
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Overview Metric Banner */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground font-mono text-xs">Metric 1.1.1</Badge>
                <Badge variant="outline" className="border-purple-500/30 text-purple-600 dark:text-purple-400 text-xs">
                  Qualitative Metric (Weightage: 10)
                </Badge>
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs">
                  NAAC Aligned ✅
                </Badge>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground mt-2">
                Curriculum Planning & Implementation Console
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl">
                Statutory tracking of Academic Council resolutions, semester academic calendars (≥90 instructional days),
                LOCF-NEP syllabus structures, departmental course files, and direct evidentiary linkage.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Button size="sm" onClick={() => setEvidenceModalOpen(true)} className="gap-1.5 shadow-xs">
                <UploadCloud className="size-4" />
                <span>Attach Evidence</span>
              </Button>
            </div>
          </div>

          {/* KPI Micro-Cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-2">
            <div className="rounded-lg border border-border/60 bg-card p-3 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Council Minutes</span>
                <Users className="size-3.5 text-primary" />
              </div>
              <p className="text-xl font-bold text-foreground mt-1">{councilMeetings.length}</p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">Statutory Approved</p>
            </div>

            <div className="rounded-lg border border-border/60 bg-card p-3 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Avg Instructional Days</span>
                <Calendar className="size-3.5 text-emerald-600" />
              </div>
              <p className="text-xl font-bold text-foreground mt-1">{totalTeachingDaysAverage} Days</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">NAAC Benchmark: ≥90 Days</p>
            </div>

            <div className="rounded-lg border border-border/60 bg-card p-3 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Lesson Plan Audit</span>
                <FileCheck className="size-3.5 text-purple-600" />
              </div>
              <p className="text-xl font-bold text-foreground mt-1">{averageLessonPlanAdherence}%</p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">14 Depts Audited</p>
            </div>

            <div className="rounded-lg border border-border/60 bg-card p-3 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Attached Evidence</span>
                <Layers className="size-3.5 text-amber-600" />
              </div>
              <p className="text-xl font-bold text-foreground mt-1">{attachedEvidence.length} Files</p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">Verified & Approved</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs Container */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="overflow-x-auto pb-1 scrollbar-none">
          <TabsList className="bg-muted/60 p-1 h-auto flex-nowrap sm:flex-wrap justify-start gap-1 min-w-max">
            <TabsTrigger value="council" className="gap-1.5 text-xs sm:text-sm py-2 px-3">
              <Users className="size-3.5" />
              <span>Academic Council Minutes ({councilMeetings.length})</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-1.5 text-xs sm:text-sm py-2 px-3">
              <Calendar className="size-3.5" />
              <span>Semester Calendars ({academicCalendars.length})</span>
            </TabsTrigger>
            <TabsTrigger value="syllabus" className="gap-1.5 text-xs sm:text-sm py-2 px-3">
              <Layers className="size-3.5" />
              <span>Syllabus & CO-PO Structures ({syllabusStructures.length})</span>
            </TabsTrigger>
            <TabsTrigger value="lessonplans" className="gap-1.5 text-xs sm:text-sm py-2 px-3">
              <FileCheck className="size-3.5" />
              <span>Lesson Plan Audit ({lessonPlanAdherence.length})</span>
            </TabsTrigger>
            <TabsTrigger value="evidence" className="gap-1.5 text-xs sm:text-sm py-2 px-3">
              <FileText className="size-3.5" />
              <span>Evidentiary Dossier ({attachedEvidence.length})</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ================= TAB 1: ACADEMIC COUNCIL MINUTES ================= */}
        <TabsContent value="council" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Statutory Academic Council Meetings</h3>
              <p className="text-xs text-muted-foreground">
                Formal council resolutions approving curriculum delivery, syllabus revisions, and academic policies.
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setCouncilModalOpen(true)} className="gap-1.5 text-xs">
              <Plus className="size-3.5" />
              <span>Add Council Meeting</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {councilMeetings.map((meeting) => (
              <Card key={meeting.id} className="border-border/70 shadow-2xs hover:shadow-xs transition-shadow">
                <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-sm text-primary">{meeting.meetingNumber}</span>
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]">
                          {meeting.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs mt-1 flex items-center gap-1.5">
                        <Calendar className="size-3 text-muted-foreground" />
                        <span>Date: {meeting.meetingDate}</span>
                        <span>•</span>
                        <Users className="size-3 text-muted-foreground" />
                        <span>{meeting.totalMembersPresent} Members Present</span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                      Chairperson
                    </span>
                    <p className="text-xs font-medium text-foreground">{meeting.chairperson}</p>
                  </div>

                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                      Meeting Agenda
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{meeting.agenda}</p>
                  </div>

                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                      Key Statutory Resolutions
                    </span>
                    <ul className="mt-1 space-y-1">
                      {meeting.keyResolutions.slice(0, 3).map((res, i) => (
                        <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                          <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{res}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                      Programmes Approved / Revised
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {meeting.programmesApproved.map((prog, i) => (
                        <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0.5">
                          {prog}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">
                      Evidence ID: <strong className="text-foreground">{meeting.evidenceId}</strong>
                    </span>
                    <Button variant="ghost" size="sm" asChild className="h-7 text-xs gap-1 text-primary">
                      <a href={meeting.minutesDocumentUrl} target="_blank" rel="noreferrer">
                        <Download className="size-3" />
                        <span>Download Minutes</span>
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ================= TAB 2: SEMESTER ACADEMIC CALENDARS ================= */}
        <TabsContent value="calendar" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Semester Academic Calendars</h3>
              <p className="text-xs text-muted-foreground">
                NAAC mandates a minimum of 90 instructional working days per semester before end-semester examinations.
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setCalendarModalOpen(true)} className="gap-1.5 text-xs">
              <Plus className="size-3.5" />
              <span>Add Calendar</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {academicCalendars.map((cal) => (
              <Card key={cal.id} className="border-border/70 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-bold text-foreground">
                          {cal.academicYear} — {cal.semester}
                        </CardTitle>
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]">
                          {cal.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs mt-1">
                        Coverage: {cal.programmesCovered.join(", ")}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {/* Instructional Days Meter */}
                  <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Clock className="size-3.5 text-primary" />
                        Instructional Working Days
                      </span>
                      <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                        {cal.instructionalDays} Days
                      </span>
                    </div>
                    <Progress
                      value={Math.min(100, (cal.instructionalDays / 90) * 100)}
                      className="h-2 bg-muted"
                    />
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground mt-1">
                      <span>Mandatory NAAC Benchmark: 90 Days</span>
                      <span className="text-emerald-600 font-medium">✓ Exceeds Requirement (+{cal.instructionalDays - 90}d)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[11px] uppercase font-semibold text-muted-foreground">Commencement</span>
                      <p className="font-medium text-foreground mt-0.5">{cal.startDate}</p>
                    </div>
                    <div>
                      <span className="text-[11px] uppercase font-semibold text-muted-foreground">Conclusion</span>
                      <p className="font-medium text-foreground mt-0.5">{cal.endDate}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] uppercase font-semibold text-muted-foreground">
                      Continuous Internal Evaluation (CIE)
                    </span>
                    <p className="text-xs text-foreground mt-0.5 font-medium">{cal.continuousInternalEvaluationDates}</p>
                  </div>

                  <div>
                    <span className="text-[11px] uppercase font-semibold text-muted-foreground">
                      End-Semester Examination Window
                    </span>
                    <p className="text-xs text-foreground mt-0.5 font-medium">{cal.endSemesterExamDates}</p>
                  </div>

                  <div>
                    <span className="text-[11px] uppercase font-semibold text-muted-foreground">
                      Co-Curricular & Sports Windows
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">{cal.coCurricularWindows}</p>
                  </div>

                  <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">
                      Evidence ID: <strong className="text-foreground">{cal.evidenceId}</strong>
                    </span>
                    <Button variant="ghost" size="sm" asChild className="h-7 text-xs gap-1 text-primary">
                      <a href={cal.calendarPdfUrl} target="_blank" rel="noreferrer">
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

        {/* ================= TAB 3: SYLLABUS STRUCTURES & LOCF ================= */}
        <TabsContent value="syllabus" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Programme Syllabus Structures & Credit Distribution</h3>
              <p className="text-xs text-muted-foreground">
                Learning Outcomes-based Curriculum Framework (LOCF), Choice Based Credit System (CBCS), and Course Outcome (CO) mapping.
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              Total Programmes: {syllabusStructures.length}
            </Badge>
          </div>

          <ResponsiveTableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Programme</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Framework</TableHead>
                  <TableHead className="text-center">Total Credits</TableHead>
                  <TableHead className="text-center">Core / Elective</TableHead>
                  <TableHead className="text-center">Internship / Skill</TableHead>
                  <TableHead>CO-PO Mapping</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {syllabusStructures.map((syl) => (
                  <TableRow key={syl.id}>
                    <TableCell>
                      <div>
                        <strong className="text-xs sm:text-sm text-foreground">{syl.programmeName}</strong>
                        <p className="text-[11px] text-muted-foreground font-mono">{syl.programmeCode}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{syl.department}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px]">
                        {syl.framework}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-bold text-xs">{syl.totalCredits}</TableCell>
                    <TableCell className="text-center text-xs">
                      {syl.coreCredits} / {syl.disciplineElectiveCredits + syl.genericElectiveCredits}
                    </TableCell>
                    <TableCell className="text-center text-xs">
                      {syl.internshipCredits} / {syl.skillEnhancementCredits}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px]">
                        {syl.coPoMappingStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild className="h-7 text-xs gap-1 text-primary">
                        <a href={syl.syllabusDocumentUrl} target="_blank" rel="noreferrer">
                          <ExternalLink className="size-3" />
                          <span>View LOCF</span>
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ResponsiveTableContainer>
        </TabsContent>

        {/* ================= TAB 4: LESSON PLAN AUDIT ================= */}
        <TabsContent value="lessonplans" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Department Lesson Plan & Course File Audit</h3>
              <p className="text-xs text-muted-foreground">
                Audited adherence registers ensuring faculty prepare and upload lesson plans before semester commencement.
              </p>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs">
              Overall Audit: {averageLessonPlanAdherence}%
            </Badge>
          </div>

          <ResponsiveTableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Academic Year / Sem</TableHead>
                  <TableHead className="text-center">Courses Offered</TableHead>
                  <TableHead className="text-center">Plans Submitted</TableHead>
                  <TableHead className="text-center">Adherence %</TableHead>
                  <TableHead>HOD Sign-Off</TableHead>
                  <TableHead>IQAC Auditor</TableHead>
                  <TableHead>Audit Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lessonPlanAdherence.map((lpa) => (
                  <TableRow key={lpa.id}>
                    <TableCell className="font-semibold text-xs text-foreground">{lpa.departmentName}</TableCell>
                    <TableCell className="text-xs">
                      {lpa.academicYear} ({lpa.semester})
                    </TableCell>
                    <TableCell className="text-center text-xs">{lpa.totalCoursesOffered}</TableCell>
                    <TableCell className="text-center text-xs font-semibold">{lpa.lessonPlansSubmitted}</TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`text-xs font-bold ${
                          lpa.adherencePercentage === 100
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {lpa.adherencePercentage}%
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{lpa.hodSignOffDate}</TableCell>
                    <TableCell className="text-xs">{lpa.iqacAuditor}</TableCell>
                    <TableCell>
                      <Badge
                        className={`text-[10px] ${
                          lpa.status === "Audited & Verified"
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-600 border border-amber-500/30"
                        }`}
                      >
                        {lpa.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ResponsiveTableContainer>
        </TabsContent>

        {/* ================= TAB 5: EVIDENTIARY DOSSIER ================= */}
        <TabsContent value="evidence" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Attached Metric 1.1.1 Evidence Documents</h3>
              <p className="text-xs text-muted-foreground">
                All supporting artifacts mapped to Metric 1.1.1 in the NAAC Evidence Repository with verification status.
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

      {/* MODAL: Record Council Meeting */}
      <Dialog open={councilModalOpen} onOpenChange={setCouncilModalOpen}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Record Academic Council Meeting</DialogTitle>
            <DialogDescription>
              Log statutory council meeting minutes and resolutions for NAAC Metric 1.1.1.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateMeeting} className="space-y-3.5 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="meetingNo" className="text-xs font-semibold">Meeting Number *</Label>
                <Input
                  id="meetingNo"
                  placeholder="e.g. ACM/XXXV/2026"
                  required
                  value={newMeetingNo}
                  onChange={(e) => setNewMeetingNo(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="meetingDate" className="text-xs font-semibold">Meeting Date *</Label>
                <Input
                  id="meetingDate"
                  type="date"
                  required
                  value={newMeetingDate}
                  onChange={(e) => setNewMeetingDate(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="chairperson" className="text-xs font-semibold">Chairperson</Label>
                <Input
                  id="chairperson"
                  value={newChairperson}
                  onChange={(e) => setNewChairperson(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="membersPresent" className="text-xs font-semibold">Members Present</Label>
                <Input
                  id="membersPresent"
                  type="number"
                  value={newMembersPresent}
                  onChange={(e) => setNewMembersPresent(Number(e.target.value))}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="agenda" className="text-xs font-semibold">Meeting Agenda</Label>
              <Textarea
                id="agenda"
                placeholder="Key items discussed regarding syllabus, calendar and evaluation..."
                rows={2}
                value={newAgenda}
                onChange={(e) => setNewAgenda(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="resolutions" className="text-xs font-semibold">Key Resolutions (One per line)</Label>
              <Textarea
                id="resolutions"
                placeholder="Resolution 1.1: Approved revised syllabi...&#10;Resolution 1.2: Sanctioned calendar..."
                rows={3}
                value={newResolution}
                onChange={(e) => setNewResolution(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="programsApproved" className="text-xs font-semibold">Programmes Approved (Comma separated)</Label>
              <Input
                id="programsApproved"
                placeholder="B.Sc. Computer Science, BCA, B.Com"
                value={newProgramsApproved}
                onChange={(e) => setNewProgramsApproved(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setCouncilModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Save Council Record
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL: Add Semester Calendar */}
      <Dialog open={calendarModalOpen} onOpenChange={setCalendarModalOpen}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Semester Academic Calendar</DialogTitle>
            <DialogDescription>
              Record planned teaching schedules and verify the NAAC ≥90 instructional days rule.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateCalendar} className="space-y-3.5 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Academic Year</Label>
                <Input
                  value={calYear}
                  onChange={(e) => setCalYear(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Semester</Label>
                <Select value={calSem} onValueChange={(v) => setCalSem(v as SemesterAcademicCalendar["semester"])}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Odd Semester">Odd Semester</SelectItem>
                    <SelectItem value="Even Semester">Even Semester</SelectItem>
                    <SelectItem value="Annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Start Date *</Label>
                <Input
                  type="date"
                  required
                  value={calStart}
                  onChange={(e) => setCalStart(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">End Date *</Label>
                <Input
                  type="date"
                  required
                  value={calEnd}
                  onChange={(e) => setCalEnd(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Instructional Days</Label>
                <Input
                  type="number"
                  min={1}
                  value={calDays}
                  onChange={(e) => setCalDays(Number(e.target.value))}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            {calDays < 90 && (
              <div className="rounded-md bg-amber-500/10 border border-amber-500/30 p-2.5 text-xs text-amber-700 dark:text-amber-400 flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>Notice: NAAC mandates a minimum of 90 instructional working days per semester.</span>
              </div>
            )}

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Continuous Internal Evaluation (CIE) Window</Label>
              <Input
                placeholder="e.g. Mid-Term 1: Aug 25-29 | Mid-Term 2: Oct 27-31"
                value={calCie}
                onChange={(e) => setCalCie(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">End Semester Examinations Window</Label>
              <Input
                placeholder="e.g. Dec 08 - Dec 23, 2026"
                value={calEndExam}
                onChange={(e) => setCalEndExam(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setCalendarModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Save Academic Calendar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL: Attach Evidence Document */}
      <Dialog open={evidenceModalOpen} onOpenChange={setEvidenceModalOpen}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Attach Evidence to Metric 1.1.1</DialogTitle>
            <DialogDescription>
              Upload or link an institutional artifact directly to Curriculum Planning & Implementation.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAttachEvidence} className="space-y-3.5 py-2">
            <div className="space-y-1">
              <Label htmlFor="eviTitle" className="text-xs font-semibold">Document Title *</Label>
              <Input
                id="eviTitle"
                placeholder="e.g. Academic Council Approved Syllabi & Calendars 2025-26"
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
              <Label htmlFor="eviDesc" className="text-xs font-semibold">Description & Context</Label>
              <Textarea
                id="eviDesc"
                placeholder="Detail what this document proves for NAAC Peer Team verification..."
                rows={2}
                value={eviDesc}
                onChange={(e) => setEviDesc(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="eviRemarks" className="text-xs font-semibold">Remarks & Council References</Label>
              <Input
                id="eviRemarks"
                placeholder="e.g. Endorsed in ACM Resolution 1.1 on 12-Jul-2026"
                value={eviRemarks}
                onChange={(e) => setEviRemarks(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <div className="border border-dashed border-border rounded-lg p-4 text-center bg-muted/20">
              <UploadCloud className="size-6 text-muted-foreground mx-auto" />
              <p className="text-xs font-semibold text-foreground mt-1">Upload File (PDF / DOCX)</p>
              <p className="text-[11px] text-muted-foreground">Automatic checksum verification and version control</p>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setEvidenceModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="gap-1.5">
                <UploadCloud className="size-4" />
                <span>Upload & Link to 1.1.1</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
