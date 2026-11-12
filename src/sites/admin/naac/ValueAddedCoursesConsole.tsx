import { useState, useEffect } from "react";
import {
  BookOpen,
  Award,
  CheckCircle2,
  Users,
  Search,
  Plus,
  Download,
  ExternalLink,
  UploadCloud,
  FileText,
  Sparkles,
  TrendingUp,
  Clock,
  Building2,
  GraduationCap,
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
  getValueAddedCoursesData,
  addValueAddedCourse,
  addStudentCertificateRecord,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type {
  ValueAddedCourse,
  ValueAddedEnrolmentSummary,
  StudentCertificateRecord,
  NaacEvidenceDocument,
} from "@/types";

interface ValueAddedCoursesConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function ValueAddedCoursesConsole({ onEvidenceUpdated }: ValueAddedCoursesConsoleProps) {
  const [activeTab, setActiveTab] = useState("courses");
  const [, setLoading] = useState(true);

  // Data states
  const [courses, setCourses] = useState<ValueAddedCourse[]>([]);
  const [enrolmentSummaries, setEnrolmentSummaries] = useState<ValueAddedEnrolmentSummary[]>([]);
  const [studentCertificates, setStudentCertificates] = useState<StudentCertificateRecord[]>([]);
  const [totalCourses, setTotalCourses] = useState(42);
  const [totalStudents, setTotalStudents] = useState(1840);
  const [completionRate, setCompletionRate] = useState(95.2);
  const [attachedEvidence, setAttachedEvidence] = useState<NaacEvidenceDocument[]>([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

  // Modals
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);

  // Form states - Course
  const [cCode, setCCode] = useState("");
  const [cName, setCName] = useState("");
  const [cCategory, setCCategory] = useState<ValueAddedCourse["category"]>("Value-Added Course");
  const [cDept, setCDept] = useState("Department of Computer Science & Applications");
  const [cPartner, setCPartner] = useState("AWS Academy");
  const [cHours, setCHours] = useState(36);
  const [cMode, setCMode] = useState<ValueAddedCourse["mode"]>("Hybrid");
  const [cYear, setCYear] = useState("2025-26");
  const [cAudience] = useState("B.Sc. & BCA Final Year Students");
  const [cEnrolled, setCEnrolled] = useState(50);
  const [cCoordinator, setCCoordinator] = useState("Prof. Satyabrata Dash");

  // Form states - Certificate
  const [sName, setSName] = useState("");
  const [sRoll, setSRoll] = useState("");
  const [sProg, setSProg] = useState("B.Sc. Computer Science (Honours)");
  const [sCourse, setSCourse] = useState("VAC-CS501");
  const [sAttendance, setSAttendance] = useState(92.5);
  const [sGrade, setSGrade] = useState("A+ (92%)");

  // Form states - Evidence
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [evidenceRemarks, setEvidenceRemarks] = useState("Verified by IQAC Coordinator.");

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getValueAddedCoursesData();
      setCourses(data.courses);
      setEnrolmentSummaries(data.enrolmentSummaries);
      setStudentCertificates(data.studentCertificates);
      setTotalCourses(data.totalCourses);
      setTotalStudents(data.totalStudents);
      setCompletionRate(data.overallCompletionRate);

      const ev = await getEvidenceForMetric("1.2.2");
      setAttachedEvidence(ev);
    } catch (err) {
      console.error("Failed to load value-added course data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cCode || !cName) return;

    try {
      await addValueAddedCourse(
        {
          courseCode: cCode,
          courseName: cName,
          category: cCategory,
          offeringDepartment: cDept,
          partnerAgency: cPartner || undefined,
          durationHours: Number(cHours),
          mode: cMode,
          academicYear: cYear,
          targetAudience: cAudience,
          enrolledStudentsCount: Number(cEnrolled),
          completedStudentsCount: Math.round(Number(cEnrolled) * 0.95),
          passPercentage: 95.0,
          courseCoordinator: cCoordinator,
          curriculumUrl: `/documents/naac/vac/${cCode}_Syllabus.pdf`,
          attendanceSheetUrl: `/documents/naac/vac/${cCode}_Attendance.pdf`,
          sampleCertificateUrl: `/documents/naac/vac/${cCode}_Sample_Certificate.pdf`,
          evidenceId: "evi-122-catalog-01",
          status: "Completed & Audited",
        },
        { name: "Dr. Snigdha Mohanty", role: "IQAC Coordinator" }
      );
      setCourseModalOpen(false);
      resetCourseForm();
      loadData();
    } catch (err) {
      console.error("Failed to add course", err);
    }
  };

  const handleCreateCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sName || !sRoll) return;

    const matchedCourse = courses.find((c) => c.courseCode === sCourse);

    try {
      await addStudentCertificateRecord(
        {
          studentId: `STU-2026-${sRoll}`,
          studentName: sName,
          rollNumber: sRoll,
          programmeName: sProg,
          courseCode: sCourse,
          courseName: matchedCourse ? matchedCourse.courseName : sCourse,
          attendancePercentage: Number(sAttendance),
          gradeOrScore: sGrade,
          certificateIssueDate: new Date().toISOString().split("T")[0]!,
          certificateVerificationId: `CERT/VAC/2026/${sRoll}`,
          status: "Verified & Issued",
        },
        { name: "Dr. Snigdha Mohanty", role: "IQAC Coordinator" }
      );
      setCertificateModalOpen(false);
      resetCertForm();
      loadData();
    } catch (err) {
      console.error("Failed to add student certificate", err);
    }
  };

  const handleUploadEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceTitle) return;

    try {
      await uploadEvidenceDocument(
        {
          criterionId: 1,
          indicatorCode: "1.2",
          metricCode: "1.2.2",
          title: evidenceTitle,
          academicYear: "2025-26",
          department: "IQAC",
          documentType: "PDF",
          description: evidenceDesc || "Evidentiary dossier supporting Metric 1.2.2 (Value-Added Courses).",
          fileName: `${evidenceTitle.replace(/\s+/g, "_")}.pdf`,
          fileSize: "2.4 MB",
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

  const resetCourseForm = () => {
    setCCode("");
    setCName("");
    setCHours(36);
    setCEnrolled(50);
  };

  const resetCertForm = () => {
    setSName("");
    setSRoll("");
    setSAttendance(92.5);
    setSGrade("A+ (92%)");
  };

  // Filtered courses
  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      searchQuery === "" ||
      c.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.offeringDepartment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.partnerAgency && c.partnerAgency.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" || c.category === selectedCategory;

    const matchesYear =
      selectedYear === "all" || c.academicYear === selectedYear;

    return matchesSearch && matchesCategory && matchesYear;
  });

  return (
    <Card className="border-teal-500/30 bg-gradient-to-br from-teal-500/5 via-card to-background shadow-xs overflow-hidden">
      {/* Header Banner */}
      <CardHeader className="bg-teal-500/10 border-b border-teal-500/20 py-4 px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex size-7 items-center justify-center rounded-md bg-teal-600 text-white font-mono text-xs font-bold shrink-0">
                1.2.2
              </span>
              <Badge className="bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30 text-[11px] font-semibold">
                Criterion 1 • Key Indicator 1.2
              </Badge>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold">
                ✓ 42 Courses (1,840 Students)
              </Badge>
              <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-[11px]">
                NAAC Norm: Minimum 30 Contact Hours
              </Badge>
            </div>
            <CardTitle className="text-base sm:text-lg font-bold text-foreground">
              Certificate & Value-Added Courses Management Console
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground leading-relaxed">
              Consolidated 5-year directory of 42 value-added and skill-oriented certificate courses with brochures, syllabi, contact hour certifications (≥30 hrs), student attendance sheets, and 1,840 verified course completion records.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <Button
              size="sm"
              variant="default"
              onClick={() => setCourseModalOpen(true)}
              className="gap-1.5 text-xs bg-teal-600 hover:bg-teal-700 text-white"
            >
              <Plus className="size-3.5" />
              <span>Add Course</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCertificateModalOpen(true)}
              className="gap-1.5 text-xs border-teal-500/30 text-teal-700 dark:text-teal-300 hover:bg-teal-500/10"
            >
              <GraduationCap className="size-3.5" />
              <span>Issue Certificate</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEvidenceModalOpen(true)}
              className="gap-1.5 text-xs border-teal-500/30 text-teal-700 dark:text-teal-300 hover:bg-teal-500/10"
            >
              <UploadCloud className="size-3.5" />
              <span>Attach Evidence</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-6">
        {/* Metric Benchmarks & Progress Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Total Courses */}
          <Card className="border-border/60 bg-card shadow-2xs">
            <CardContent className="p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Total Courses Offered</span>
                <span className="flex size-7 items-center justify-center rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  <BookOpen className="size-3.5" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-foreground">{totalCourses}</span>
                <span className="text-xs text-muted-foreground">/ 35 Benchmark</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                  <span>Target Achievement</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">120.0% (Exceeds)</span>
                </div>
                <Progress value={100} className="h-1.5 bg-muted [&>div]:bg-emerald-600" />
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Total Students Enrolled */}
          <Card className="border-border/60 bg-card shadow-2xs">
            <CardContent className="p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Students Enrolled</span>
                <span className="flex size-7 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Users className="size-3.5" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-foreground">{totalStudents.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">/ 1,500 Norm</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                  <span>Enrolment Target</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">122.7% Verified</span>
                </div>
                <Progress value={100} className="h-1.5 bg-muted [&>div]:bg-blue-600" />
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Contact Hours Compliance */}
          <Card className="border-border/60 bg-card shadow-2xs">
            <CardContent className="p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Contact Hours (≥30 Hrs)</span>
                <span className="flex size-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Clock className="size-3.5" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">100%</span>
                <span className="text-xs text-muted-foreground">Compliance</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-normal">
                All 42 courses certified with 30 to 60 teaching contact hours.
              </p>
            </CardContent>
          </Card>

          {/* Card 4: Completion Rate */}
          <Card className="border-border/60 bg-card shadow-2xs">
            <CardContent className="p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Completion & Certification</span>
                <span className="flex size-7 items-center justify-center rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Award className="size-3.5" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-foreground">{completionRate}%</span>
                <span className="text-xs text-muted-foreground">1,747 Certified</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Continuous internal assessment + ≥75% attendance criteria.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Console Sub-Sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full h-auto p-1 bg-muted/60">
            <TabsTrigger value="courses" className="text-xs py-2 gap-1.5 data-[state=active]:bg-background">
              <BookOpen className="size-3.5" />
              <span>42 Course Catalog ({courses.length})</span>
            </TabsTrigger>
            <TabsTrigger value="certificates" className="text-xs py-2 gap-1.5 data-[state=active]:bg-background">
              <Award className="size-3.5" />
              <span>Student Certifications</span>
            </TabsTrigger>
            <TabsTrigger value="swayam" className="text-xs py-2 gap-1.5 data-[state=active]:bg-background">
              <Sparkles className="size-3.5" />
              <span>SWAYAM / NPTEL Chapter</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs py-2 gap-1.5 data-[state=active]:bg-background">
              <TrendingUp className="size-3.5" />
              <span>5-Year Growth & Audits</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: 42 COURSE CATALOG */}
          <TabsContent value="courses" className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search course title, code (e.g. VAC-CS501), partner or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-xs sm:text-sm"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-9 text-xs w-[180px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Value-Added Course">Value-Added Course</SelectItem>
                    <SelectItem value="Certificate Course">Certificate Course</SelectItem>
                    <SelectItem value="MOOCs / SWAYAM / NPTEL">MOOCs / SWAYAM / NPTEL</SelectItem>
                    <SelectItem value="Industry Skill Certification">Industry Skill Certification</SelectItem>
                    <SelectItem value="Life Skills & Soft Skills">Life Skills & Soft Skills</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="h-9 text-xs w-[130px]">
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years (5-Yr)</SelectItem>
                    <SelectItem value="2025-26">2025-26 (11)</SelectItem>
                    <SelectItem value="2024-25">2024-25 (10)</SelectItem>
                    <SelectItem value="2023-24">2023-24 (8)</SelectItem>
                    <SelectItem value="2022-23">2022-23 (7)</SelectItem>
                    <SelectItem value="2021-22">2021-22 (6)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Courses Table (Desktop) */}
            <div className="hidden md:block">
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/20">
                      <TableHead className="w-28 font-semibold">Code & Year</TableHead>
                      <TableHead className="font-semibold min-w-[220px]">Course Title & Category</TableHead>
                      <TableHead className="w-48 font-semibold">Department & Partner</TableHead>
                      <TableHead className="w-28 font-semibold text-center">Duration</TableHead>
                      <TableHead className="w-32 font-semibold text-center">Enrolled / Passed</TableHead>
                      <TableHead className="w-36 font-semibold">Coordinator</TableHead>
                      <TableHead className="w-28 font-semibold text-right">Documents</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCourses.map((c) => (
                      <TableRow key={c.id} className="hover:bg-muted/15">
                        <TableCell className="align-top font-mono text-xs font-bold text-foreground">
                          {c.courseCode}
                          <Badge variant="outline" className="text-[10px] block mt-1 w-fit font-sans">
                            {c.academicYear}
                          </Badge>
                        </TableCell>
                        <TableCell className="align-top">
                          <p className="font-bold text-xs sm:text-sm text-foreground">{c.courseName}</p>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <Badge
                              variant="secondary"
                              className={`text-[9px] px-1.5 py-0 ${
                                c.category === "MOOCs / SWAYAM / NPTEL"
                                  ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                                  : c.category === "Industry Skill Certification"
                                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                                  : "bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20"
                              }`}
                            >
                              {c.category}
                            </Badge>
                            <Badge variant="outline" className="text-[9px] px-1 py-0 text-muted-foreground">
                              {c.mode}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                            Audience: {c.targetAudience}
                          </p>
                        </TableCell>
                        <TableCell className="align-top text-xs">
                          <p className="text-foreground font-medium">{c.offeringDepartment.replace("Department of ", "")}</p>
                          {c.partnerAgency && (
                            <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium mt-0.5 flex items-center gap-1">
                              <Building2 className="size-3 shrink-0" />
                              <span className="truncate">{c.partnerAgency}</span>
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="align-top text-center">
                          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-mono">
                            {c.durationHours} Hours
                          </Badge>
                          <span className="text-[10px] text-muted-foreground block mt-0.5">
                            ≥30h Compliant
                          </span>
                        </TableCell>
                        <TableCell className="align-top text-center text-xs">
                          <span className="font-bold text-foreground">
                            {c.enrolledStudentsCount}
                          </span>
                          <span className="text-muted-foreground"> / {c.completedStudentsCount}</span>
                          <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                            {c.passPercentage}% Pass
                          </span>
                        </TableCell>
                        <TableCell className="align-top text-xs text-muted-foreground">
                          {c.courseCoordinator}
                        </TableCell>
                        <TableCell className="align-top text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button asChild size="xs" variant="outline" className="text-[11px] gap-1 h-7 px-2">
                              <a href={c.curriculumUrl} target="_blank" rel="noreferrer" title="Download Syllabus">
                                <FileText className="size-3 text-primary" />
                                <span>Syllabus</span>
                              </a>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ResponsiveTableContainer>
            </div>

            {/* Courses Mobile Card View */}
            <div className="md:hidden divide-y divide-border/60 border rounded-lg overflow-hidden bg-card">
              {filteredCourses.map((c) => (
                <div key={c.id} className="p-3.5 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-xs font-bold text-foreground">{c.courseCode}</span>
                        <Badge variant="outline" className="text-[9px] px-1 py-0">
                          {c.academicYear}
                        </Badge>
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[9px] px-1 py-0">
                          {c.durationHours}h
                        </Badge>
                      </div>
                      <h4 className="font-bold text-xs text-foreground mt-1">{c.courseName}</h4>
                    </div>
                    <Badge variant="secondary" className="text-[9px] shrink-0">
                      {c.enrolledStudentsCount} Enrolled
                    </Badge>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="line-clamp-1">Dept: {c.offeringDepartment.replace("Department of ", "")}</p>
                    {c.partnerAgency && (
                      <p className="text-teal-600 dark:text-teal-400 font-medium">Partner: {c.partnerAgency}</p>
                    )}
                    <p className="text-[11px]">Coord: {c.courseCoordinator}</p>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40">
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {c.passPercentage}% Completed ({c.completedStudentsCount} students)
                    </span>
                    <Button asChild size="xs" variant="outline" className="text-[11px] gap-1 h-6 px-2">
                      <a href={c.curriculumUrl} target="_blank" rel="noreferrer">
                        <FileText className="size-3" />
                        <span>Syllabus</span>
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* TAB 2: STUDENT CERTIFICATIONS */}
          <TabsContent value="certificates" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 rounded-lg border border-border/60 bg-muted/20">
              <div>
                <h4 className="text-sm font-bold text-foreground">Verified Student Certification Register</h4>
                <p className="text-xs text-muted-foreground">
                  Individual completion records with university roll numbers, course codes, verified attendance (≥75%), and security QR IDs.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCertificateModalOpen(true)}
                className="gap-1.5 text-xs shrink-0"
              >
                <Plus className="size-3.5" />
                <span>Record New Certificate</span>
              </Button>
            </div>

            <ResponsiveTableContainer>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20">
                    <TableHead className="w-28 font-semibold">Roll Number</TableHead>
                    <TableHead className="font-semibold min-w-[180px]">Student Name & Programme</TableHead>
                    <TableHead className="font-semibold min-w-[200px]">Course Completed</TableHead>
                    <TableHead className="w-28 font-semibold text-center">Attendance</TableHead>
                    <TableHead className="w-32 font-semibold text-center">Grade / Score</TableHead>
                    <TableHead className="w-36 font-semibold">Verification ID</TableHead>
                    <TableHead className="w-24 font-semibold text-right">Certificate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentCertificates.map((s) => (
                    <TableRow key={s.id} className="hover:bg-muted/15">
                      <TableCell className="align-top font-mono text-xs font-bold text-foreground">
                        {s.rollNumber}
                      </TableCell>
                      <TableCell className="align-top">
                        <p className="font-bold text-xs sm:text-sm text-foreground">{s.studentName}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{s.programmeName}</p>
                      </TableCell>
                      <TableCell className="align-top">
                        <p className="font-semibold text-xs text-foreground">{s.courseName}</p>
                        <Badge variant="outline" className="text-[10px] font-mono mt-0.5">
                          {s.courseCode}
                        </Badge>
                      </TableCell>
                      <TableCell className="align-top text-center">
                        <Badge
                          className={`text-xs font-mono ${
                            s.attendancePercentage >= 90
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                              : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                          }`}
                        >
                          {s.attendancePercentage}%
                        </Badge>
                      </TableCell>
                      <TableCell className="align-top text-center font-bold text-xs text-foreground">
                        {s.gradeOrScore}
                      </TableCell>
                      <TableCell className="align-top font-mono text-[11px] text-muted-foreground">
                        {s.certificateVerificationId}
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[9px] block w-fit mt-1">
                          Verified
                        </Badge>
                      </TableCell>
                      <TableCell className="align-top text-right">
                        <Button asChild size="xs" variant="ghost" className="gap-1 text-xs text-primary">
                          <a href="/documents/naac/evidence/Sample_Certificates_Value_Added_Courses_2025_26.pdf" target="_blank" rel="noreferrer">
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

          {/* TAB 3: SWAYAM / NPTEL CHAPTER */}
          <TabsContent value="swayam" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <Card className="border-purple-500/30 bg-purple-500/5 shadow-2xs">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                      NPTEL Active Local Chapter
                    </span>
                    <Sparkles className="size-4 text-purple-600" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xl font-bold font-mono text-foreground">LC ID: 4128</span>
                    <p className="text-xs text-muted-foreground">
                      Institutional partnership established with IIT Madras & SWAYAM National Portal.
                    </p>
                  </div>
                  <div className="pt-1">
                    <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 text-[10px]">
                      SPOC: Dr. Rashmita Mishra
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-card shadow-2xs">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">Total MOOC Enrolments</span>
                    <Users className="size-4 text-blue-600" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xl font-bold font-mono text-foreground">364 Students</span>
                    <p className="text-xs text-muted-foreground">
                      Across 8 SWAYAM/NPTEL certified courses over 5 assessment years.
                    </p>
                  </div>
                  <div className="pt-1">
                    <Badge variant="outline" className="text-[10px]">
                      94.8% Certification Success
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-card shadow-2xs">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">Credit Mobility & Transfer</span>
                    <Award className="size-4 text-emerald-600" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xl font-bold font-mono text-foreground">Up to 20% Credits</span>
                    <p className="text-xs text-muted-foreground">
                      Ratified by Academic Council for semester credit transfer under NEP-2020.
                    </p>
                  </div>
                  <div className="pt-1">
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px]">
                      UGC Regulations Compliant
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Partner Agency Directory */}
            <div className="rounded-lg border border-border/60 bg-card p-4 space-y-3">
              <h4 className="text-sm font-bold text-foreground">Institutional MOOC & Skill Partners</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="rounded border border-border/50 p-3 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                    <Building2 className="size-3.5 text-primary" />
                    <span>SWAYAM & NPTEL (IIT Madras)</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Official Active Local Chapter for online 4-to-12-week national certification programmes.
                  </p>
                </div>

                <div className="rounded border border-border/50 p-3 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                    <Building2 className="size-3.5 text-blue-600" />
                    <span>AWS Academy & Cloud Foundation</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Accredited curriculum in cloud computing, serverless architectures, and AWS certification.
                  </p>
                </div>

                <div className="rounded border border-border/50 p-3 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                    <Building2 className="size-3.5 text-emerald-600" />
                    <span>TCS iON Skill Development</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Industry-aligned courses in cyber security, financial analytics, and workplace readiness.
                  </p>
                </div>

                <div className="rounded border border-border/50 p-3 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                    <Building2 className="size-3.5 text-purple-600" />
                    <span>Cambridge English Assessment</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Executive corporate communication, professional English, and public speaking modules.
                  </p>
                </div>

                <div className="rounded border border-border/50 p-3 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                    <Building2 className="size-3.5 text-amber-600" />
                    <span>Infosys Springboard</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Self-paced digital skills in Python, Java, Data Science, and AI literacy.
                  </p>
                </div>

                <div className="rounded border border-border/50 p-3 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                    <Building2 className="size-3.5 text-teal-600" />
                    <span>Odisha State Skill Development</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Vocational skilling in solar installation, herbal pharmacology, and organic composting.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 4: 5-YEAR GROWTH & AUDITS */}
          <TabsContent value="history" className="space-y-4">
            <div className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-1">
              <h4 className="text-sm font-bold text-foreground">5-Year Continuous Enhancement Summary (2021 – 2026)</h4>
              <p className="text-xs text-muted-foreground">
                Progressive increase in value-added offerings from 6 courses (220 students) to 11 courses (540 students in 2025-26), exceeding NAAC's benchmark threshold of 35 courses and 1,500 students.
              </p>
            </div>

            <ResponsiveTableContainer>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20">
                    <TableHead className="font-semibold">Academic Assessment Year</TableHead>
                    <TableHead className="text-center font-semibold">Value-Added Courses Offered</TableHead>
                    <TableHead className="text-center font-semibold">Students Enrolled</TableHead>
                    <TableHead className="text-center font-semibold">Certificates Awarded</TableHead>
                    <TableHead className="text-center font-semibold">Completion %</TableHead>
                    <TableHead className="text-right font-semibold">Audit Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrolmentSummaries.map((s) => (
                    <TableRow key={s.academicYear} className="hover:bg-muted/15">
                      <TableCell className="font-bold text-xs sm:text-sm text-foreground">
                        {s.academicYear}
                      </TableCell>
                      <TableCell className="text-center font-mono font-bold text-xs">
                        {s.totalCoursesOffered} Courses
                      </TableCell>
                      <TableCell className="text-center font-mono font-bold text-xs text-foreground">
                        {s.totalStudentsEnrolled} Students
                      </TableCell>
                      <TableCell className="text-center font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                        {s.totalCertificatesAwarded}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="secondary"
                          className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-mono"
                        >
                          {s.completionRate}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-primary/10 text-primary border border-primary/20 text-xs">
                          ✓ DVV Audited
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Total Row */}
                  <TableRow className="bg-muted/40 font-bold border-t-2 border-border/80">
                    <TableCell className="text-xs sm:text-sm text-foreground">
                      5-Year Consolidated Total
                    </TableCell>
                    <TableCell className="text-center font-mono text-sm text-teal-600 dark:text-teal-400">
                      42 Courses
                    </TableCell>
                    <TableCell className="text-center font-mono text-sm text-blue-600 dark:text-blue-400">
                      1,840 Students
                    </TableCell>
                    <TableCell className="text-center font-mono text-sm text-emerald-600 dark:text-emerald-400">
                      1,747 Certified
                    </TableCell>
                    <TableCell className="text-center font-mono text-xs">
                      94.9% (Avg)
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs">
                        Exceeds Benchmark
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </ResponsiveTableContainer>
          </TabsContent>
        </Tabs>

        {/* Attached Evidences Section */}
        <div className="rounded-lg border border-teal-500/20 bg-teal-500/5 p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600" />
                <span>NAAC Peer Team Evidence Dossier (Metric 1.2.2)</span>
              </h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Statutory brochures, contact hour certifications (≥30 contact hours), enrolment registers with roll numbers, and sample certificates.
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
                className="rounded border border-border/60 bg-card p-3 text-xs space-y-1.5 shadow-2xs hover:border-teal-500/40 transition-colors"
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

      {/* MODAL 1: ADD VALUE-ADDED COURSE */}
      <Dialog open={courseModalOpen} onOpenChange={setCourseModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <BookOpen className="size-4 text-teal-600" />
              <span>Add Value-Added or Certificate Course</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Record a new course with contact hour specifications (minimum 30 contact hours for NAAC compliance).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateCourse} className="space-y-3.5 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Course Code *</Label>
                <Input
                  placeholder="e.g. VAC-CS512"
                  value={cCode}
                  onChange={(e) => setCCode(e.target.value)}
                  className="h-8 text-xs font-mono uppercase"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Academic Year *</Label>
                <Select value={cYear} onValueChange={setCYear}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025-26">2025-26</SelectItem>
                    <SelectItem value="2024-25">2024-25</SelectItem>
                    <SelectItem value="2023-24">2023-24</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Course Name / Title *</Label>
              <Input
                placeholder="e.g. Applied Machine Learning with Scikit-Learn"
                value={cName}
                onChange={(e) => setCName(e.target.value)}
                className="h-8 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Category</Label>
                <Select value={cCategory} onValueChange={(v) => setCCategory(v as any)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Value-Added Course">Value-Added Course</SelectItem>
                    <SelectItem value="Certificate Course">Certificate Course</SelectItem>
                    <SelectItem value="MOOCs / SWAYAM / NPTEL">MOOCs / SWAYAM / NPTEL</SelectItem>
                    <SelectItem value="Industry Skill Certification">Industry Skill Certification</SelectItem>
                    <SelectItem value="Life Skills & Soft Skills">Life Skills & Soft Skills</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Mode of Delivery</Label>
                <Select value={cMode} onValueChange={(v) => setCMode(v as any)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Offline / Classroom">Offline / Classroom</SelectItem>
                    <SelectItem value="Online / MOOC">Online / MOOC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Duration (Contact Hours) *</Label>
                <Input
                  type="number"
                  min={30}
                  value={cHours}
                  onChange={(e) => setCHours(Number(e.target.value))}
                  className="h-8 text-xs"
                  required
                />
                <span className="text-[10px] text-muted-foreground block">
                  Must be ≥30 hrs for NAAC
                </span>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Students Enrolled *</Label>
                <Input
                  type="number"
                  min={1}
                  value={cEnrolled}
                  onChange={(e) => setCEnrolled(Number(e.target.value))}
                  className="h-8 text-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Offering Department</Label>
              <Input
                value={cDept}
                onChange={(e) => setCDept(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Partner Agency (Optional)</Label>
                <Input
                  placeholder="e.g. AWS Academy / TCS iON"
                  value={cPartner}
                  onChange={(e) => setCPartner(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Course Coordinator</Label>
                <Input
                  value={cCoordinator}
                  onChange={(e) => setCCoordinator(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setCourseModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
                Save Course Record
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: ISSUE / VERIFY CERTIFICATE */}
      <Dialog open={certificateModalOpen} onOpenChange={setCertificateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <GraduationCap className="size-4 text-teal-600" />
              <span>Record Student Certificate</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Log a student who has successfully completed the value-added course (attendance ≥75%).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateCertificate} className="space-y-3.5 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Student Full Name *</Label>
              <Input
                placeholder="e.g. Priyanka Priyadarshini Sahu"
                value={sName}
                onChange={(e) => setSName(e.target.value)}
                className="h-8 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">University Roll No. *</Label>
                <Input
                  placeholder="e.g. 23BCS041"
                  value={sRoll}
                  onChange={(e) => setSRoll(e.target.value)}
                  className="h-8 text-xs font-mono"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Course Completed</Label>
                <Select value={sCourse} onValueChange={setSCourse}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.slice(0, 10).map((c) => (
                      <SelectItem key={c.id} value={c.courseCode}>
                        {c.courseCode} - {c.courseName.slice(0, 25)}...
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Degree Programme</Label>
              <Input
                value={sProg}
                onChange={(e) => setSProg(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Attendance % (≥75%)</Label>
                <Input
                  type="number"
                  min={75}
                  max={100}
                  step="0.1"
                  value={sAttendance}
                  onChange={(e) => setSAttendance(Number(e.target.value))}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Grade / Score</Label>
                <Input
                  placeholder="e.g. A+ (92%)"
                  value={sGrade}
                  onChange={(e) => setSGrade(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setCertificateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
                Record Certificate
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: ATTACH EVIDENCE */}
      <Dialog open={evidenceModalOpen} onOpenChange={setEvidenceModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <UploadCloud className="size-4 text-teal-600" />
              <span>Attach Evidentiary Document (1.2.2)</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Upload course brochures, student attendance sheets, or certificates awarded to link directly into Criterion 1.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadEvidence} className="space-y-3.5 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Document Title *</Label>
              <Input
                placeholder="e.g. VAC_Python_Attendance_Log_2025_26"
                value={evidenceTitle}
                onChange={(e) => setEvidenceTitle(e.target.value)}
                className="h-8 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Description</Label>
              <Textarea
                placeholder="Describe contents, offering department, and contact hour verification..."
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
              <Button type="submit" size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
                Upload & Link Evidence
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
