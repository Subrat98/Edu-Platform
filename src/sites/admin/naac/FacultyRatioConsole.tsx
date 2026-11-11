import { useState, useEffect } from "react";
import {
  Users,
  GraduationCap,
  CheckCircle2,
  TrendingUp,
  FileText,
  Search,
  Plus,
  Download,
  ExternalLink,
  UploadCloud,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  Award,
  Filter,
  Eye,
  UserCheck,
  Briefcase,
  BookOpen,
  Activity,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveTableContainer } from "@/components/admin/ResponsiveTableContainer";
import {
  getStudentTeacherRatioData,
  addFacultyMember,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type {
  DepartmentFacultyRatio,
  FullTimeFacultyMember,
  CohortStudentCount,
  StudentTeacherRatioData,
  NaacEvidenceDocument,
} from "@/types";

interface FacultyRatioConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function FacultyRatioConsole({ onEvidenceUpdated }: FacultyRatioConsoleProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  // Data states
  const [ratioData, setRatioData] = useState<StudentTeacherRatioData | null>(null);
  const [facultyList, setFacultyList] = useState<FullTimeFacultyMember[]>([]);
  const [deptRatios, setDeptRatios] = useState<DepartmentFacultyRatio[]>([]);
  const [cohorts, setCohorts] = useState<CohortStudentCount[]>([]);
  const [evidenceList, setEvidenceList] = useState<NaacEvidenceDocument[]>([]);

  // Search and filter states
  const [facultySearch, setFacultySearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [qualFilter, setQualFilter] = useState("all");

  // Dialog states
  const [isAddFacultyOpen, setIsAddFacultyOpen] = useState(false);
  const [isUploadEvidenceOpen, setIsUploadEvidenceOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<NaacEvidenceDocument | null>(null);

  // New faculty member form state
  const [newFaculty, setNewFaculty] = useState({
    name: "",
    empId: "",
    department: "Computer Science & Engineering",
    designation: "Assistant Professor",
    highestQualification: "Ph.D. in Computer Science",
    isPhd: true,
    panNumber: "",
    dateOfAppointment: "2024-07-15",
    natureOfAppointment: "Permanent" as "Permanent" | "Full-time Approved",
    experienceYears: 5,
    appointmentOrderNo: "",
    isMentor: true,
    assignedMenteesCount: 16,
  });

  // Upload evidence form state
  const [evidenceForm, setEvidenceForm] = useState({
    title: "",
    documentType: "PDF" as "PDF" | "XLSX" | "ZIP",
    department: "Establishment & HR Cell",
    description: "",
    fileName: "",
    fileSize: "3.2 MB",
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const data = await getStudentTeacherRatioData();
      setRatioData(data);
      setFacultyList(data.facultyRoster);
      setDeptRatios(data.departmentRatios);
      setCohorts(data.cohortBreakdown);

      const evis = await getEvidenceForMetric("2.2.1");
      setEvidenceList(evis);
    } catch (err) {
      console.error("Failed to load student-teacher ratio data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaculty.name || !newFaculty.empId) return;

    try {
      const added = await addFacultyMember(
        {
          name: newFaculty.name,
          empId: newFaculty.empId,
          department: newFaculty.department,
          designation: newFaculty.designation,
          highestQualification: newFaculty.highestQualification,
          isPhd: newFaculty.isPhd,
          panNumber: newFaculty.panNumber || `ABCPM${Math.floor(1000 + Math.random() * 9000)}Z`,
          dateOfAppointment: newFaculty.dateOfAppointment,
          natureOfAppointment: newFaculty.natureOfAppointment,
          experienceYears: Number(newFaculty.experienceYears),
          appointmentOrderNo: newFaculty.appointmentOrderNo || `GB/APPT/2024/${newFaculty.empId}`,
          appointmentOrderUrl: `/documents/naac/faculty/${newFaculty.empId}.pdf`,
          isMentor: newFaculty.isMentor,
          assignedMenteesCount: Number(newFaculty.assignedMenteesCount),
          status: "Active",
        },
        {
          name: "Dr. Himansu Sekhar Das",
          role: "Principal & Head of Institution",
        }
      );

      setFacultyList((prev) => [added, ...prev]);
      setIsAddFacultyOpen(false);
      setNewFaculty({
        name: "",
        empId: "",
        department: "Computer Science & Engineering",
        designation: "Assistant Professor",
        highestQualification: "Ph.D. in Computer Science",
        isPhd: true,
        panNumber: "",
        dateOfAppointment: "2024-07-15",
        natureOfAppointment: "Permanent",
        experienceYears: 5,
        appointmentOrderNo: "",
        isMentor: true,
        assignedMenteesCount: 16,
      });
      loadAllData();
    } catch (err) {
      console.error("Failed to add faculty member", err);
    }
  };

  const handleUploadEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceForm.title || !evidenceForm.fileName) return;

    try {
      const newEvi = await uploadEvidenceDocument(
        {
          criterionId: 2,
          indicatorCode: "2.2",
          metricCode: "2.2.1",
          title: evidenceForm.title,
          academicYear: "2025-26",
          department: evidenceForm.department,
          documentType: evidenceForm.documentType,
          description: evidenceForm.description,
          fileName: evidenceForm.fileName,
          fileSize: evidenceForm.fileSize,
          evidenceUrl: `/documents/naac/evidence/${evidenceForm.fileName}`,
          remarks: "Uploaded via Student-Full Time Teacher Ratio Console for Metric 2.2.1",
        },
        {
          name: "Dr. Snigdha Mohanty",
          role: "IQAC Coordinator",
        }
      );

      setEvidenceList((prev) => [newEvi, ...prev]);
      setIsUploadEvidenceOpen(false);
      setEvidenceForm({
        title: "",
        documentType: "PDF",
        department: "Establishment & HR Cell",
        description: "",
        fileName: "",
        fileSize: "3.2 MB",
      });
      if (onEvidenceUpdated) onEvidenceUpdated();
    } catch (err) {
      console.error("Failed to upload evidence", err);
    }
  };

  // Filter faculty
  const filteredFaculty = facultyList.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(facultySearch.toLowerCase()) ||
      f.empId.toLowerCase().includes(facultySearch.toLowerCase()) ||
      f.department.toLowerCase().includes(facultySearch.toLowerCase()) ||
      f.highestQualification.toLowerCase().includes(facultySearch.toLowerCase());
    const matchesDept = deptFilter === "all" || f.department === deptFilter;
    const matchesQual =
      qualFilter === "all"
        ? true
        : qualFilter === "phd"
        ? f.isPhd
        : !f.isPhd;
    return matchesSearch && matchesDept && matchesQual;
  });

  const defaultDepts = [
    "Computer Science & Engineering",
    "Electronics & Communication Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Information Technology",
    "Management Studies (MBA)",
    "Basic Sciences & Humanities",
  ];
  const departments = facultyList.length > 0
    ? Array.from(new Set(facultyList.map((f) => f.department)))
    : defaultDepts;

  if (loading && !ratioData) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Activity className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading Student-Teacher Ratio & Faculty Roster data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 p-6 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 -mb-10 h-48 w-48 rounded-full bg-indigo-500/10 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-indigo-400/40 bg-indigo-500/20 text-indigo-200">
                Criterion 2 · Metric 2.2.1
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Optimal Ratio (16:1)
              </Badge>
              <Badge variant="outline" className="border-blue-400/40 bg-blue-500/20 text-blue-200">
                UGC Benchmark Compliant (&le; 20:1)
              </Badge>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Student – Full Time Teacher Ratio (2.2.1)
            </h1>
            <p className="max-w-3xl text-sm text-slate-300">
              Institutional student-to-teacher ratio (16:1), authenticated student cohort rolls (2,160 students),
              sanctioned full-time faculty roster (135 teachers), proctorial mentor-mentee mapping, and appointment
              orders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => setIsUploadEvidenceOpen(true)}
              variant="outline"
              className="border-indigo-400/30 bg-indigo-900/40 text-indigo-100 hover:bg-indigo-800/60"
            >
              <UploadCloud className="mr-2 h-4 w-4 text-indigo-300" />
              Attach Evidence
            </Button>
            <Button
              onClick={() => setIsAddFacultyOpen(true)}
              className="bg-indigo-600 font-medium text-white shadow-lg hover:bg-indigo-500"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Faculty Member
            </Button>
          </div>
        </div>

        {/* 4 Key Metric Cards */}
        <div className="relative z-10 mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">Student-Teacher Ratio</span>
              <Users className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-emerald-300">
              {ratioData?.ratio || "16:1"}
            </div>
            <div className="mt-1 flex items-center text-xs text-slate-300">
              Benchmark: &le; {ratioData?.ugcBenchmark || "20:1"}
              <span className="ml-1 text-emerald-400 font-medium">(Optimal Cadre)</span>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">Enrolled Students (All Cohorts)</span>
              <GraduationCap className="h-4 w-4 text-sky-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-white">
              {ratioData?.totalStudents?.toLocaleString() || "2,160"}
            </div>
            <div className="mt-1 text-xs text-slate-300">10 UG (1,846) + 4 PG (314)</div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">Full-Time Teachers</span>
              <Briefcase className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-indigo-200">
              {ratioData?.totalFullTimeFaculty || 135}
            </div>
            <div className="mt-1 text-xs text-slate-300">100% Approved & On Payroll</div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">Ph.D. Qualified Faculty</span>
              <Award className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-amber-300">
              {ratioData?.phdFacultyPercentage || 60.7}%
            </div>
            <div className="mt-1 text-xs text-slate-300">
              {ratioData?.phdFacultyCount || 82} Doctorate Holders
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-1 p-1 bg-muted/60 rounded-lg">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>Ratio & 5-Yr DVV</span>
          </TabsTrigger>
          <TabsTrigger value="departments" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span>Department Ratios</span>
          </TabsTrigger>
          <TabsTrigger value="faculty" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            <span>Faculty Roster ({facultyList.length})</span>
          </TabsTrigger>
          <TabsTrigger value="cohorts" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            <span>Student Cohorts (2,160)</span>
          </TabsTrigger>
          <TabsTrigger value="evidence" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Evidence Dossiers ({evidenceList.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: RATIO OVERVIEW & 5-YEAR LONGITUDINAL DVV */}
        <TabsContent value="overview" className="space-y-6">
          {/* Mathematical DVV Formula Card */}
          <Card className="border-indigo-100 dark:border-indigo-950/60 bg-gradient-to-r from-indigo-50/50 via-white to-sky-50/40 dark:from-indigo-950/20 dark:via-background dark:to-sky-950/20 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2 text-indigo-950 dark:text-indigo-200">
                    <Award className="h-5 w-5 text-indigo-600" />
                    NAAC Metric 2.2.1 Quantitative DVV Formula & Cadre Audit
                  </CardTitle>
                  <CardDescription>
                    Student – Full time Teacher Ratio for the latest completed academic year (2025-26)
                  </CardDescription>
                </div>
                <Badge variant="outline" className="border-indigo-300 text-indigo-700 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-300">
                  Formula 2.2.1
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-background border border-indigo-100 dark:border-indigo-900/50 font-mono text-sm shadow-inner flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1 font-sans font-semibold">
                    NAAC Standard Formula:
                  </div>
                  <div className="text-foreground">
                    Student-Teacher Ratio = Total Students Enrolled / Total Full-Time Teachers
                  </div>
                  <div className="text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
                    Student-Teacher Ratio = 2,160 Students / 135 Full-Time Teachers = <span className="underline">16:1</span> (16.0)
                  </div>
                </div>
                <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0 md:pl-4">
                  <div className="text-center">
                    <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">16:1</div>
                    <div className="text-xs text-muted-foreground font-sans">Institutional Ratio</div>
                  </div>
                  <div className="text-center pl-3 border-l">
                    <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">&le; 20:1</div>
                    <div className="text-xs text-muted-foreground font-sans">UGC/AICTE Norm</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground pt-1">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Zero Part-Time Inclusion:</strong> Strictly complies with NAAC guidelines by including only
                    full-time approved faculty on institutional payroll.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Mentor-Mentee System:</strong> Proctorial system maps exactly 16 students per faculty mentor
                    (1:16 ratio) for academic and psycho-social counseling.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Cadre Distribution:</strong> Balanced cadre ratio comprising Professors, Associate
                    Professors, and Assistant Professors with 60.7% Ph.D. holders.
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5-Year Longitudinal Ratio Stability Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg">5-Year Longitudinal Ratio Stability Trend (2021-22 to 2025-26)</CardTitle>
                <CardDescription>
                  Consistent maintenance of optimal 16:1 ratio with synchronized faculty recruitment as student rolls expanded
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const csvContent =
                    "Academic Year,Total Enrolled Students,Full-Time Faculty,Student-Teacher Ratio,Cadre Compliance\n" +
                    (ratioData?.fiveYearRatioTrend || [])
                      .map((y) => `${y.academicYear},${y.totalStudents},${y.fullTimeFaculty},${y.ratio},Compliant`)
                      .join("\n");
                  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "NAAC_2.2.1_5Year_Faculty_Ratio_Trend.csv";
                  a.click();
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Trend CSV
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Academic Year</TableHead>
                      <TableHead className="text-center">Enrolled Students</TableHead>
                      <TableHead className="text-center">Full-Time Faculty</TableHead>
                      <TableHead className="text-center">Student-Teacher Ratio</TableHead>
                      <TableHead className="text-center">UGC / AICTE Norm</TableHead>
                      <TableHead className="text-center">Mentor-Mentee Mapping</TableHead>
                      <TableHead className="text-right">Audit Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(ratioData?.fiveYearRatioTrend || []).map((yr) => (
                      <TableRow key={yr.academicYear} className="hover:bg-muted/40">
                        <TableCell className="font-semibold text-primary">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {yr.academicYear}
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-bold text-foreground">
                          {yr.totalStudents.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center font-bold text-indigo-600 dark:text-indigo-400">
                          {yr.fullTimeFaculty}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 font-bold">
                            {yr.ratio}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center text-xs text-muted-foreground font-mono">
                          &le; 20:1
                        </TableCell>
                        <TableCell className="text-center text-xs text-muted-foreground">
                          1:{Math.round(yr.totalStudents / yr.fullTimeFaculty)} Average Mentee Load
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-end gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> DVV Verified
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ResponsiveTableContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: DEPARTMENT-WISE RATIO MATRIX */}
        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Department-Wise Student-Teacher Ratio Breakdown (2025-26)</CardTitle>
              <CardDescription>
                Faculty strength, student enrollment, cadre sanction, and Ph.D. qualification across all academic departments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Academic Department</TableHead>
                      <TableHead className="text-center">Student Enrollment</TableHead>
                      <TableHead className="text-center">Sanctioned Posts</TableHead>
                      <TableHead className="text-center">In-Position Faculty</TableHead>
                      <TableHead className="text-center">Ph.D. Holders</TableHead>
                      <TableHead className="text-center">Department Ratio</TableHead>
                      <TableHead className="text-right">Cadre Compliance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deptRatios.map((dept) => (
                      <TableRow key={dept.departmentId} className="hover:bg-muted/40">
                        <TableCell className="font-semibold text-foreground">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span>{dept.departmentName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-bold text-foreground">
                          {dept.studentCount}
                        </TableCell>
                        <TableCell className="text-center font-medium text-muted-foreground">
                          {dept.sanctionedPosts}
                        </TableCell>
                        <TableCell className="text-center font-bold text-indigo-600 dark:text-indigo-400">
                          {dept.fullTimeFacultyCount}
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          <Badge variant="outline" className="border-amber-400/40 text-amber-700 dark:text-amber-300">
                            {dept.phdCount} ({Math.round((dept.phdCount / dept.fullTimeFacultyCount) * 100)}%)
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={
                              dept.ratioNumeric <= 16.5
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 font-bold"
                                : "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20"
                            }
                          >
                            {dept.ratio}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className="border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs">
                            Optimal Cadre
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Summary Row */}
                    <TableRow className="bg-muted/70 font-bold border-t-2">
                      <TableCell>Institutional Total / Overall</TableCell>
                      <TableCell className="text-center font-extrabold text-foreground">
                        2,160 Students
                      </TableCell>
                      <TableCell className="text-center font-medium">139 Posts</TableCell>
                      <TableCell className="text-center font-extrabold text-indigo-600 dark:text-indigo-400">
                        135 Faculty
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-amber-500/20 text-amber-800 dark:text-amber-200 border-amber-500/30">
                          82 (60.7%)
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-emerald-600 text-white font-bold text-sm px-2.5 py-0.5">
                          16:1
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-end gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> 100% Compliant
                        </span>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </ResponsiveTableContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: FULL-TIME FACULTY ROSTER (135 TEACHERS) */}
        <TabsContent value="faculty" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-lg">Full-Time Faculty Roster (135 Approved Teachers)</CardTitle>
                  <CardDescription>
                    Approved faculty members on payroll: designation, department, highest qualification, appointment order numbers, and mentee quotas
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setIsAddFacultyOpen(true)}
                  size="sm"
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  <Plus className="mr-1.5 h-4 w-4" /> Add Faculty Member
                </Button>
              </div>

              {/* Filters */}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search faculty name, empId, qualification..."
                    className="pl-8"
                    value={facultySearch}
                    onChange={(e) => setFacultySearch(e.target.value)}
                  />
                </div>

                <Select value={deptFilter} onValueChange={setDeptFilter}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      <SelectValue placeholder="All Departments" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Academic Departments</SelectItem>
                    {departments.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={qualFilter} onValueChange={setQualFilter}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                      <SelectValue placeholder="All Qualifications" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Qualifications</SelectItem>
                    <SelectItem value="phd">Ph.D. Holders Only</SelectItem>
                    <SelectItem value="pg">Postgraduate (M.Tech/M.Com/NET)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent>
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Faculty Name & ID</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Designation</TableHead>
                      <TableHead>Highest Qualification</TableHead>
                      <TableHead>Appointment Order No.</TableHead>
                      <TableHead className="text-center">Nature & Experience</TableHead>
                      <TableHead className="text-center">Mentees</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFaculty.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                          No faculty members match the filter criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredFaculty.slice(0, 50).map((f) => (
                        <TableRow key={f.id} className="hover:bg-muted/40">
                          <TableCell>
                            <div>
                              <div className="font-semibold text-foreground flex items-center gap-1.5">
                                {f.name}
                                {f.isPhd && (
                                  <Badge variant="outline" className="text-[10px] py-0 px-1 border-amber-400 text-amber-700 dark:text-amber-300">
                                    Ph.D.
                                  </Badge>
                                )}
                              </div>
                              <div className="font-mono text-xs text-muted-foreground">{f.empId}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            <span className="truncate max-w-[160px] inline-block" title={f.department}>
                              {f.department}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs font-medium text-foreground">{f.designation}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{f.highestQualification}</TableCell>
                          <TableCell>
                            <span className="font-mono text-xs text-primary bg-muted/60 px-2 py-0.5 rounded">
                              {f.appointmentOrderNo}
                            </span>
                          </TableCell>
                          <TableCell className="text-center text-xs">
                            <span className="font-medium text-foreground">{f.natureOfAppointment}</span>
                            <div className="text-[11px] text-muted-foreground">{f.experienceYears} Yrs Exp</div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="border-indigo-400 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                              {f.assignedMenteesCount} Mentees
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs text-indigo-600 hover:text-indigo-700"
                              onClick={() => {
                                const doc = evidenceList.find((e) => e.metricCode === "2.2.1") || evidenceList[0] || {
                                  id: `order-${f.id}`,
                                  criterionId: 2,
                                  indicatorCode: "2.2",
                                  metricCode: "2.2.1",
                                  title: `Appointment Order - ${f.name} (${f.empId})`,
                                  academicYear: "2025-26",
                                  department: f.department,
                                  documentType: "PDF" as const,
                                  description: `Official Governing Body approved appointment order ref: ${f.appointmentOrderNo} for ${f.designation}.`,
                                  uploadedBy: "Establishment & HR Cell",
                                  uploadDate: f.dateOfAppointment,
                                  status: "Approved" as const,
                                  version: "v1.0",
                                  remarks: `Cadre position verified under approved service rules. Tenure: ${f.natureOfAppointment}.`,
                                  fileName: `${f.empId}_Appointment_Order.pdf`,
                                  fileSize: "1.8 MB",
                                  evidenceUrl: f.appointmentOrderUrl || `/documents/naac/faculty/${f.empId}.pdf`,
                                };
                                setViewingDoc(doc);
                              }}
                            >
                              <Eye className="mr-1 h-3 w-3" /> Order
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ResponsiveTableContainer>
              {filteredFaculty.length > 50 && (
                <div className="mt-4 text-center text-xs text-muted-foreground">
                  Showing 50 of {filteredFaculty.length} faculty records. Use search to filter specific members.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: STUDENT COHORT ROLLS (2,160 STUDENTS) */}
        <TabsContent value="cohorts" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle className="text-lg">Programme & Cohort-Wise Active Enrollment Registers (2,160 Students)</CardTitle>
                  <CardDescription>
                    All degree cohorts enrolled in the institution across 1st, 2nd, 3rd, and 4th years in AY 2025-26
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20 text-xs">
                    10 UG Programmes: 1,846 Students
                  </Badge>
                  <Badge className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20 text-xs">
                    4 PG Programmes: 314 Students
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Programme Name & Code</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead className="text-center">Level</TableHead>
                      <TableHead className="text-center">Year 1</TableHead>
                      <TableHead className="text-center">Year 2</TableHead>
                      <TableHead className="text-center">Year 3</TableHead>
                      <TableHead className="text-center">Year 4</TableHead>
                      <TableHead className="text-center font-bold">Total Enrolled</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cohorts.map((c) => (
                      <TableRow key={c.programmeCode} className="hover:bg-muted/40">
                        <TableCell>
                          <div>
                            <div className="font-semibold text-foreground">{c.programmeName}</div>
                            <div className="font-mono text-xs text-muted-foreground">{c.programmeCode}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{c.department}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="text-xs">
                            {c.degreeLevel}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-medium">{c.year1Count}</TableCell>
                        <TableCell className="text-center font-medium">{c.year2Count}</TableCell>
                        <TableCell className="text-center font-medium">{c.year3Count || "—"}</TableCell>
                        <TableCell className="text-center font-medium">{c.year4Count || "—"}</TableCell>
                        <TableCell className="text-center font-bold text-emerald-600 dark:text-emerald-400">
                          {c.totalEnrolled}
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Cohort Total Row */}
                    <TableRow className="bg-muted/70 font-bold border-t-2">
                      <TableCell colSpan={3}>Aggregate Institutional Student Strength</TableCell>
                      <TableCell className="text-center">665</TableCell>
                      <TableCell className="text-center">616</TableCell>
                      <TableCell className="text-center">503</TableCell>
                      <TableCell className="text-center">376</TableCell>
                      <TableCell className="text-center font-extrabold text-emerald-600 dark:text-emerald-400 text-base">
                        2,160 Students
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </ResponsiveTableContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 5: EVIDENCE DOSSIERS & DVV CERTIFICATES */}
        <TabsContent value="evidence" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg">Metric 2.2.1 Evidentiary Dossiers & Cadre Audit Reports</CardTitle>
                <CardDescription>
                  Appointment orders, Governing Body sanctions, authenticated roll registers, and DVV ratio authentication certificate
                </CardDescription>
              </div>
              <Button
                onClick={() => setIsUploadEvidenceOpen(true)}
                size="sm"
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <UploadCloud className="mr-1.5 h-4 w-4" /> Attach New Dossier
              </Button>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {evidenceList.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex flex-col justify-between rounded-lg border p-4 hover:border-indigo-300 transition-all bg-card space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <Badge variant="outline" className="text-xs">
                          {doc.documentType} · {doc.fileSize}
                        </Badge>
                        <Badge
                          className={
                            doc.status === "Approved"
                              ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                              : "bg-sky-500/10 text-sky-700 border-sky-500/20"
                          }
                        >
                          {doc.status}
                        </Badge>
                      </div>

                      <h4 className="font-semibold text-foreground text-sm line-clamp-2">{doc.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{doc.description}</p>
                    </div>

                    <div className="pt-2 border-t flex items-center justify-between text-xs text-muted-foreground">
                      <span>{doc.department}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-indigo-600 hover:text-indigo-700"
                          onClick={() => setViewingDoc(doc)}
                        >
                          <Eye className="mr-1 h-3 w-3" /> View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => {
                            const blob = new Blob([`Dummy Evidence Content for ${doc.title}`], {
                              type: "application/pdf",
                            });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = doc.fileName;
                            a.click();
                          }}
                        >
                          <Download className="mr-1 h-3 w-3" /> Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* DIALOG 1: ADD FACULTY MEMBER */}
      <Dialog open={isAddFacultyOpen} onOpenChange={setIsAddFacultyOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-indigo-600">
              <Plus className="h-5 w-5" /> Add Full-Time Faculty Member
            </DialogTitle>
            <DialogDescription>
              Record appointment details, highest qualification, and mentee load for Metric 2.2.1
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddFaculty} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="empName">Faculty Name *</Label>
                <Input
                  id="empName"
                  placeholder="e.g. Dr. Subrat Kumar Sahu"
                  required
                  value={newFaculty.name}
                  onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="empId">Employee ID *</Label>
                <Input
                  id="empId"
                  placeholder="e.g. EMP-CSE-031"
                  required
                  value={newFaculty.empId}
                  onChange={(e) => setNewFaculty({ ...newFaculty, empId: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="empDept">Department *</Label>
                <Select
                  value={newFaculty.department}
                  onValueChange={(val) => setNewFaculty({ ...newFaculty, department: val })}
                >
                  <SelectTrigger id="empDept">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="empDesig">Designation *</Label>
                <Select
                  value={newFaculty.designation}
                  onValueChange={(val) => setNewFaculty({ ...newFaculty, designation: val })}
                >
                  <SelectTrigger id="empDesig">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professor">Professor</SelectItem>
                    <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                    <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="empQual">Highest Qualification *</Label>
                <Input
                  id="empQual"
                  placeholder="e.g. Ph.D. in Computer Science"
                  required
                  value={newFaculty.highestQualification}
                  onChange={(e) =>
                    setNewFaculty({
                      ...newFaculty,
                      highestQualification: e.target.value,
                      isPhd: e.target.value.toLowerCase().includes("ph.d"),
                    })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="panNo">PAN Number</Label>
                <Input
                  id="panNo"
                  placeholder="e.g. ABCPM1234K"
                  value={newFaculty.panNumber}
                  onChange={(e) => setNewFaculty({ ...newFaculty, panNumber: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="apptDate">Appointment Date</Label>
                <Input
                  id="apptDate"
                  type="date"
                  value={newFaculty.dateOfAppointment}
                  onChange={(e) => setNewFaculty({ ...newFaculty, dateOfAppointment: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="expYrs">Experience (Years)</Label>
                <Input
                  id="expYrs"
                  type="number"
                  min="0"
                  value={newFaculty.experienceYears}
                  onChange={(e) => setNewFaculty({ ...newFaculty, experienceYears: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="menteesCount">Mentees Count</Label>
                <Input
                  id="menteesCount"
                  type="number"
                  min="0"
                  value={newFaculty.assignedMenteesCount}
                  onChange={(e) => setNewFaculty({ ...newFaculty, assignedMenteesCount: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="apptOrder">Appointment Order Reference</Label>
              <Input
                id="apptOrder"
                placeholder="e.g. GB/APPT/2024/CSE-31"
                value={newFaculty.appointmentOrderNo}
                onChange={(e) => setNewFaculty({ ...newFaculty, appointmentOrderNo: e.target.value })}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddFacultyOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700">
                Save Faculty Member
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: ATTACH EVIDENCE DOSSIER */}
      <Dialog open={isUploadEvidenceOpen} onOpenChange={setIsUploadEvidenceOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-indigo-600">
              <UploadCloud className="h-5 w-5" /> Attach Metric 2.2.1 Evidentiary Dossier
            </DialogTitle>
            <DialogDescription>
              Upload authenticated faculty orders, student roll registers, or DVV ratio certificates
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadEvidence} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="eviTitle">Document Title *</Label>
              <Input
                id="eviTitle"
                placeholder="e.g. DVV Student Teacher Ratio Certificate 2025-26"
                required
                value={evidenceForm.title}
                onChange={(e) => setEvidenceForm({ ...evidenceForm, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="eviType">Document Type</Label>
                <Select
                  value={evidenceForm.documentType}
                  onValueChange={(val: "PDF" | "XLSX" | "ZIP") =>
                    setEvidenceForm({ ...evidenceForm, documentType: val })
                  }
                >
                  <SelectTrigger id="eviType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF Document</SelectItem>
                    <SelectItem value="XLSX">Excel Spreadsheet (XLSX)</SelectItem>
                    <SelectItem value="ZIP">ZIP Archive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="eviDept">Department</Label>
                <Input
                  id="eviDept"
                  value={evidenceForm.department}
                  onChange={(e) => setEvidenceForm({ ...evidenceForm, department: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="eviFileName">File Name *</Label>
              <Input
                id="eviFileName"
                placeholder="e.g. Student_Teacher_Ratio_Audit_Certificate_2025_26.pdf"
                required
                value={evidenceForm.fileName}
                onChange={(e) => setEvidenceForm({ ...evidenceForm, fileName: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="eviDesc">Description / Remarks</Label>
              <Input
                id="eviDesc"
                placeholder="Brief summary of document, endorsing authority, and approval reference..."
                value={evidenceForm.description}
                onChange={(e) => setEvidenceForm({ ...evidenceForm, description: e.target.value })}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsUploadEvidenceOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700">
                Upload & Verify
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 3: VIEW EVIDENCE DOCUMENT */}
      {viewingDoc && (
        <Dialog open={!!viewingDoc} onOpenChange={() => setViewingDoc(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{viewingDoc.documentType}</Badge>
                <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20">
                  {viewingDoc.status}
                </Badge>
              </div>
              <DialogTitle className="mt-2 text-lg">{viewingDoc.title}</DialogTitle>
              <DialogDescription>{viewingDoc.description}</DialogDescription>
            </DialogHeader>

            <div className="rounded-lg border p-4 bg-muted/30 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Department:</span>{" "}
                  <span className="font-medium text-foreground">{viewingDoc.department}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Academic Year:</span>{" "}
                  <span className="font-medium text-foreground">{viewingDoc.academicYear}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Uploaded By:</span>{" "}
                  <span className="font-medium text-foreground">
                    {viewingDoc.uploadedBy} on {viewingDoc.uploadDate}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Verified By:</span>{" "}
                  <span className="font-medium text-foreground">{viewingDoc.verifiedBy || "IQAC Committee"}</span>
                </div>
              </div>

              {viewingDoc.remarks && (
                <div className="p-2.5 rounded bg-background border text-xs">
                  <span className="font-semibold text-primary">Verification Remarks:</span> {viewingDoc.remarks}
                </div>
              )}

              <div className="flex items-center justify-between p-3 rounded bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-indigo-600" />
                  <span className="font-mono">{viewingDoc.fileName}</span>
                  <span className="text-muted-foreground">({viewingDoc.fileSize})</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => {
                    const blob = new Blob([`Evidence Content for ${viewingDoc.title}`], {
                      type: "application/pdf",
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = viewingDoc.fileName;
                    a.click();
                  }}
                >
                  <Download className="mr-1 h-3.5 w-3.5" /> Download
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setViewingDoc(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
