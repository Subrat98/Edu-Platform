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
  AlertCircle,
  FileSpreadsheet,
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
  getStudentEnrolmentData,
  addProgrammeEnrolmentRecord,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type {
  EnrolmentYearRecord,
  ProgrammeEnrolmentRecord,
  StudentProfileEnrolmentData,
  NaacEvidenceDocument,
} from "@/types";

interface StudentEnrolmentConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function StudentEnrolmentConsole({ onEvidenceUpdated }: StudentEnrolmentConsoleProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [, setLoading] = useState(true);

  // Data states
  const [enrolmentData, setEnrolmentData] = useState<StudentProfileEnrolmentData | null>(null);
  const [programmeRecords, setProgrammeRecords] = useState<ProgrammeEnrolmentRecord[]>([]);
  const [evidenceList, setEvidenceList] = useState<NaacEvidenceDocument[]>([]);

  // Search and filter states
  const [progSearch, setProgSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");

  // Dialog states
  const [isAddProgModalOpen, setIsAddProgModalOpen] = useState(false);
  const [isUploadEvidenceOpen, setIsUploadEvidenceOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<NaacEvidenceDocument | null>(null);

  // New programme intake form state
  const [newProg, setNewProg] = useState({
    programmeCode: "",
    programmeName: "",
    level: "UG" as "UG" | "PG" | "Diploma",
    department: "Computer Science & Engineering",
    sanctionedSeats: 60,
    admittedStudents: 58,
    scAdmitted: 9,
    stAdmitted: 13,
    obcAdmitted: 7,
    generalAdmitted: 29,
    pwdAdmitted: 2,
    samsCutoffMarks: "OJEE Rank < 3500",
  });

  // Upload evidence form state
  const [evidenceForm, setEvidenceForm] = useState({
    title: "",
    documentType: "PDF" as "PDF" | "XLSX" | "ZIP",
    department: "Central Admission Cell & SAMS Desk",
    description: "",
    fileName: "",
    fileSize: "2.4 MB",
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const data = await getStudentEnrolmentData();
      setEnrolmentData(data);
      setProgrammeRecords(data.programmeRecords);

      const evis = await getEvidenceForMetric("2.1.1");
      setEvidenceList(evis);
    } catch (err) {
      console.error("Failed to load student enrolment data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProgramme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProg.programmeCode || !newProg.programmeName) return;

    const fillRate = Number(
      ((newProg.admittedStudents / (newProg.sanctionedSeats || 1)) * 100).toFixed(1)
    );

    const record: Omit<ProgrammeEnrolmentRecord, "id"> = {
      academicYear: "2025-26",
      programmeCode: newProg.programmeCode,
      programmeName: newProg.programmeName,
      level: newProg.level,
      department: newProg.department,
      sanctionedSeats: Number(newProg.sanctionedSeats),
      admittedStudents: Number(newProg.admittedStudents),
      fillRatePercentage: fillRate,
      categoryBreakdown: {
        sc: Number(newProg.scAdmitted),
        st: Number(newProg.stAdmitted),
        obc: Number(newProg.obcAdmitted),
        general: Number(newProg.generalAdmitted),
        pwd: Number(newProg.pwdAdmitted),
        ews: 0,
      },
      samsCutoffMarks: newProg.samsCutoffMarks,
      status: "Admissions Closed & Verified",
    };

    try {
      const added = await addProgrammeEnrolmentRecord(record, {
        name: "Dr. Rashmita Mishra",
        role: "Admissions Convener",
      });
      setProgrammeRecords((prev) => [added, ...prev]);
      setIsAddProgModalOpen(false);
      setNewProg({
        programmeCode: "",
        programmeName: "",
        level: "UG",
        department: "Computer Science & Engineering",
        sanctionedSeats: 60,
        admittedStudents: 58,
        scAdmitted: 9,
        stAdmitted: 13,
        obcAdmitted: 7,
        generalAdmitted: 29,
        pwdAdmitted: 2,
        samsCutoffMarks: "OJEE Rank < 3500",
      });
    } catch (err) {
      console.error("Failed to add programme record", err);
    }
  };

  const handleUploadEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceForm.title || !evidenceForm.fileName) return;

    try {
      const newEvi = await uploadEvidenceDocument(
        {
          criterionId: 2,
          indicatorCode: "2.1",
          metricCode: "2.1.1",
          title: evidenceForm.title,
          academicYear: "2025-26",
          department: evidenceForm.department,
          documentType: evidenceForm.documentType,
          description: evidenceForm.description,
          fileName: evidenceForm.fileName,
          fileSize: evidenceForm.fileSize,
          evidenceUrl: `/documents/naac/evidence/${evidenceForm.fileName}`,
          remarks: "Uploaded via Student Enrolment Compliance Console for Metric 2.1.1",
        },
        {
          name: "Dr. Rashmita Mishra",
          role: "Admissions Convener",
        }
      );

      setEvidenceList((prev) => [newEvi, ...prev]);
      setIsUploadEvidenceOpen(false);
      setEvidenceForm({
        title: "",
        documentType: "PDF",
        department: "Central Admission Cell & SAMS Desk",
        description: "",
        fileName: "",
        fileSize: "2.4 MB",
      });
      if (onEvidenceUpdated) onEvidenceUpdated();
    } catch (err) {
      console.error("Failed to upload evidence", err);
    }
  };

  // Filter programmes
  const filteredProgrammes = programmeRecords.filter((p) => {
    const matchesSearch =
      p.programmeName.toLowerCase().includes(progSearch.toLowerCase()) ||
      p.programmeCode.toLowerCase().includes(progSearch.toLowerCase()) ||
      p.department.toLowerCase().includes(progSearch.toLowerCase());
    const matchesLevel = levelFilter === "all" || p.level === levelFilter;
    const matchesDept = deptFilter === "all" || p.department === deptFilter;
    return matchesSearch && matchesLevel && matchesDept;
  });

  const departments = Array.from(new Set(programmeRecords.map((p) => p.department)));

  // Calculate reservation totals for Tab 3
  const reservationSummary = enrolmentData?.yearlyRecords.reduce(
    (acc, yr) => {
      acc.earmarkedSC += yr.reservedSeatsEarmarked.sc;
      acc.earmarkedST += yr.reservedSeatsEarmarked.st;
      acc.earmarkedOBC += yr.reservedSeatsEarmarked.obc;
      acc.earmarkedGeneral += yr.reservedSeatsEarmarked.general;
      acc.earmarkedPWD += yr.reservedSeatsEarmarked.pwd;

      acc.admittedSC += yr.admittedByCategory.sc;
      acc.admittedST += yr.admittedByCategory.st;
      acc.admittedOBC += yr.admittedByCategory.obc;
      acc.admittedGeneral += yr.admittedByCategory.general;
      acc.admittedPWD += yr.admittedByCategory.pwd;
      return acc;
    },
    {
      earmarkedSC: 0,
      earmarkedST: 0,
      earmarkedOBC: 0,
      earmarkedGeneral: 0,
      earmarkedPWD: 0,
      admittedSC: 0,
      admittedST: 0,
      admittedOBC: 0,
      admittedGeneral: 0,
      admittedPWD: 0,
    }
  ) || {
    earmarkedSC: 508,
    earmarkedST: 704,
    earmarkedOBC: 353,
    earmarkedGeneral: 1567,
    earmarkedPWD: 156,
    admittedSC: 488,
    admittedST: 674,
    admittedOBC: 344,
    admittedGeneral: 1466,
    admittedPWD: 98,
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-indigo-950 via-slate-900 to-sky-950 p-6 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 -mb-10 h-48 w-48 rounded-full bg-sky-500/10 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-indigo-400/40 bg-indigo-500/20 text-indigo-200">
                Criterion 2 · Metric 2.1.1
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> High Benchmark Compliant (94.6%)
              </Badge>
              <Badge variant="outline" className="border-sky-400/40 bg-sky-500/20 text-sky-200">
                SAMS Odisha Integrated
              </Badge>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Student Enrolment & Reservation Compliance (2.1.1)
            </h1>
            <p className="max-w-3xl text-sm text-slate-300">
              Sanctioned intake vs. admitted seats across 5 assessment years (2021-22 to 2025-26), mathematical DVV
              verification, state quota reservation registers (SC/ST/OBC/SEBC/PwD), and SAMS Odisha centralized
              e-Admission notifications.
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
              onClick={() => setIsAddProgModalOpen(true)}
              className="bg-indigo-600 font-medium text-white shadow-lg hover:bg-indigo-500"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Programme Intake
            </Button>
          </div>
        </div>

        {/* 4 Key Metric Cards */}
        <div className="relative z-10 mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">5-Yr Enrolment %</span>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-emerald-300">
              {enrolmentData?.fiveYearEnrolmentPercentage || 94.6}%
            </div>
            <div className="mt-1 flex items-center text-xs text-slate-300">
              Benchmark: &ge; {enrolmentData?.benchmarkPercentage || 90.0}%
              <span className="ml-1 text-emerald-400 font-medium">(+4.6% Above)</span>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">5-Yr Admitted / Seats</span>
              <Users className="h-4 w-4 text-sky-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-white">
              {enrolmentData?.totalAdmittedFiveYears || 3122} / {enrolmentData?.totalSanctionedFiveYears || 3300}
            </div>
            <div className="mt-1 text-xs text-slate-300">3,122 Enrolled / 3,300 Sanctioned</div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">State Quota Compliance</span>
              <ShieldCheck className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-amber-300">100%</div>
            <div className="mt-1 text-xs text-slate-300">SC 16.25% · ST 22.5% · OBC 11.25%</div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">Active Degree Progs</span>
              <GraduationCap className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-indigo-200">{programmeRecords.length}</div>
            <div className="mt-1 text-xs text-slate-300">10 UG + 4 PG All SAMS Registered</div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-1 p-1 bg-muted/60 rounded-lg">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>5-Yr Enrolment DVV</span>
          </TabsTrigger>
          <TabsTrigger value="programmes" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            <span>Programme Intake (2025-26)</span>
          </TabsTrigger>
          <TabsTrigger value="reservation" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span>Reservation Registers</span>
          </TabsTrigger>
          <TabsTrigger value="evidence" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Evidence Dossiers ({evidenceList.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: 5-YEAR ENROLMENT DVV CALCULATION */}
        <TabsContent value="overview" className="space-y-6">
          {/* Mathematical DVV Formula Card */}
          <Card className="border-indigo-100 dark:border-indigo-950/60 bg-gradient-to-r from-indigo-50/50 via-white to-sky-50/40 dark:from-indigo-950/20 dark:via-background dark:to-sky-950/20 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2 text-indigo-950 dark:text-indigo-200">
                    <Award className="h-5 w-5 text-indigo-600" />
                    NAAC Metric 2.1.1 Quantitative DVV Formula & Verification
                  </CardTitle>
                  <CardDescription>
                    Percentage of seats filled against sanctioned seats over the last five years
                  </CardDescription>
                </div>
                <Badge variant="outline" className="border-indigo-300 text-indigo-700 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-300">
                  Formula 2.1.1
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
                    Enrolment % = ( Total Students Admitted in 5 Years / Total Sanctioned Seats in 5 Years ) &times; 100
                  </div>
                  <div className="text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
                    Enrolment % = ( 3,122 / 3,300 ) &times; 100 = 94.606% &asymp; <span className="underline">94.6%</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0 md:pl-4">
                  <div className="text-center">
                    <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">94.6%</div>
                    <div className="text-xs text-muted-foreground font-sans">Institutional Score</div>
                  </div>
                  <div className="text-center pl-3 border-l">
                    <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">&ge; 90%</div>
                    <div className="text-xs text-muted-foreground font-sans">Highest NAAC Slab</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground pt-1">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>SAMS Centralized Admissions:</strong> 100% of seats are allotted through the Govt. of Odisha
                    Student Academic Management System merit counselling.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Zero Capitation & Management Quota:</strong> Strictly transparent merit-based admissions with
                    zero unauthorized lateral or management deviations.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Audit Endorsement:</strong> Chartered Accountant signed certificate and DHE Odisha gazette
                    sanction letters verified and attached in Metric Evidence.
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5-Year Year-by-Year Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg">5-Year Enrolment Trend Matrix (2021-22 to 2025-26)</CardTitle>
                <CardDescription>
                  Year-wise intake capacity, verified enrolments, occupancy rate, and SAMS gazette reference numbers
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const csvContent =
                    "Academic Year,Sanctioned Seats,Admitted Students,Enrolment Percentage,SAMS Notification Number\n" +
                    (enrolmentData?.yearlyRecords || [])
                      .map((y) => `${y.academicYear},${y.sanctionedSeats},${y.admittedStudents},${y.enrolmentPercentage}%,${y.samsNotificationNumber}`)
                      .join("\n");
                  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "NAAC_2.1.1_5Year_Enrolment_Trend.csv";
                  a.click();
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                Export DVV Table
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Academic Year</TableHead>
                      <TableHead className="text-center">Sanctioned Seats</TableHead>
                      <TableHead className="text-center">Admitted Students</TableHead>
                      <TableHead className="text-center">Enrolment Fill Rate</TableHead>
                      <TableHead>Category Breakdown (SC / ST / OBC / Gen / PwD)</TableHead>
                      <TableHead>SAMS Odisha Gazette Notification</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(enrolmentData?.yearlyRecords || []).map((yr: EnrolmentYearRecord) => (
                      <TableRow key={yr.academicYear} className="hover:bg-muted/40">
                        <TableCell className="font-semibold text-primary">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {yr.academicYear}
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-medium">{yr.sanctionedSeats}</TableCell>
                        <TableCell className="text-center font-bold text-emerald-600 dark:text-emerald-400">
                          {yr.admittedStudents}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center gap-1">
                            <Badge
                              variant="outline"
                              className={
                                yr.enrolmentPercentage >= 94.0
                                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold"
                                  : "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300"
                              }
                            >
                              {yr.enrolmentPercentage}%
                            </Badge>
                            <Progress value={yr.enrolmentPercentage} className="h-1.5 w-16" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs space-y-0.5">
                            <div className="text-muted-foreground">
                              SC: <span className="font-medium text-foreground">{yr.admittedByCategory.sc}</span> · ST:{" "}
                              <span className="font-medium text-foreground">{yr.admittedByCategory.st}</span> · OBC:{" "}
                              <span className="font-medium text-foreground">{yr.admittedByCategory.obc}</span>
                            </div>
                            <div className="text-muted-foreground">
                              Gen: <span className="font-medium text-foreground">{yr.admittedByCategory.general}</span> ·
                              PwD: <span className="font-medium text-foreground">{yr.admittedByCategory.pwd}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-mono text-xs text-muted-foreground flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                            <span className="truncate max-w-[200px]" title={yr.samsNotificationNumber}>
                              {yr.samsNotificationNumber}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs text-indigo-600 hover:text-indigo-700"
                            onClick={() => {
                              const doc = evidenceList.find((e) => e.academicYear === yr.academicYear) || evidenceList[0];
                              if (doc) setViewingDoc(doc);
                            }}
                          >
                            <Eye className="mr-1 h-3.5 w-3.5" />
                            Approval
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Summary Row */}
                    <TableRow className="bg-muted/70 font-bold border-t-2">
                      <TableCell>5-Year Aggregate Total</TableCell>
                      <TableCell className="text-center font-extrabold text-foreground">
                        {enrolmentData?.totalSanctionedFiveYears || 3300}
                      </TableCell>
                      <TableCell className="text-center font-extrabold text-emerald-600 dark:text-emerald-400">
                        {enrolmentData?.totalAdmittedFiveYears || 3122}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-emerald-600 text-white font-bold text-sm px-2.5 py-0.5">
                          {enrolmentData?.fiveYearEnrolmentPercentage || 94.6}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">
                          3,122 Total Admissions Verified across 5 Assessment Cycles
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> 100% SAMS Reconciled
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="border-indigo-400 text-indigo-700">
                          DVV Ready
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </ResponsiveTableContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: PROGRAMME INTAKE & CUTOFF REGISTER (2025-26) */}
        <TabsContent value="programmes" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-lg">Programme-Wise Intake & Admission Cutoff Register (2025-26)</CardTitle>
                  <CardDescription>
                    All 14 degree programmes: sanctioned capacity, admitted count, SAMS opening/closing cutoff ranks, and
                    social category distribution
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setIsAddProgModalOpen(true)}
                    size="sm"
                    className="bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    <Plus className="mr-1.5 h-4 w-4" /> Add Programme
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search programme, code, department..."
                    className="pl-8"
                    value={progSearch}
                    onChange={(e) => setProgSearch(e.target.value)}
                  />
                </div>

                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                      <SelectValue placeholder="All Levels" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Academic Levels</SelectItem>
                    <SelectItem value="UG">Undergraduate (UG)</SelectItem>
                    <SelectItem value="PG">Postgraduate (PG)</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={deptFilter} onValueChange={setDeptFilter}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      <SelectValue placeholder="All Departments" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments ({departments.length})</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent>
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Programme Details</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead className="text-center">Sanctioned</TableHead>
                      <TableHead className="text-center">Admitted</TableHead>
                      <TableHead className="text-center">Fill Rate</TableHead>
                      <TableHead>Category Admitted (SC / ST / OBC / Gen / PwD)</TableHead>
                      <TableHead>SAMS / Entrance Cutoff</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProgrammes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                          No programmes match the filter criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProgrammes.map((p) => (
                        <TableRow key={p.id} className="hover:bg-muted/40">
                          <TableCell>
                            <div>
                              <div className="font-semibold text-foreground flex items-center gap-1.5">
                                {p.programmeName}
                                <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                                  {p.level}
                                </Badge>
                              </div>
                              <div className="font-mono text-xs text-muted-foreground">{p.programmeCode}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Building2 className="h-3 w-3 shrink-0" />
                              <span className="truncate max-w-[150px]" title={p.department}>
                                {p.department}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-medium">{p.sanctionedSeats}</TableCell>
                          <TableCell className="text-center font-bold text-emerald-600 dark:text-emerald-400">
                            {p.admittedStudents}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="outline"
                              className={
                                p.fillRatePercentage >= 95
                                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold"
                                  : "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300"
                              }
                            >
                              {p.fillRatePercentage}%
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs text-muted-foreground">
                              SC: <span className="font-medium text-foreground">{p.categoryBreakdown.sc}</span> · ST:{" "}
                              <span className="font-medium text-foreground">{p.categoryBreakdown.st}</span> · OBC:{" "}
                              <span className="font-medium text-foreground">{p.categoryBreakdown.obc}</span> · Gen:{" "}
                              <span className="font-medium text-foreground">{p.categoryBreakdown.general}</span> · PwD:{" "}
                              <span className="font-medium text-foreground">{p.categoryBreakdown.pwd}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-xs bg-muted/60 px-2 py-0.5 rounded text-foreground">
                              {p.samsCutoffMarks}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 text-[11px]">
                              Verified
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ResponsiveTableContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: STATUTORY CATEGORY RESERVATION REGISTERS */}
        <TabsContent value="reservation" className="space-y-6">
          {/* Statutory Policy Notice Card */}
          <Card className="border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                <ShieldCheck className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-base">
                  Odisha State Higher Education Statutory Reservation Policy
                </CardTitle>
              </div>
              <CardDescription className="text-amber-900/80 dark:text-amber-300/80">
                In compliance with the Odisha Higher Educational Institutions (Reservation in Admission) Act and Higher
                Education Department Guidelines for SAMS Centralized e-Admissions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="rounded-lg bg-background p-3 border border-amber-200 dark:border-amber-900/50 text-center">
                  <div className="text-xs text-muted-foreground font-semibold">Scheduled Castes (SC)</div>
                  <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">16.25%</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Statutory Quota</div>
                </div>
                <div className="rounded-lg bg-background p-3 border border-amber-200 dark:border-amber-900/50 text-center">
                  <div className="text-xs text-muted-foreground font-semibold">Scheduled Tribes (ST)</div>
                  <div className="text-xl font-bold text-sky-600 dark:text-sky-400 mt-1">22.50%</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Statutory Quota</div>
                </div>
                <div className="rounded-lg bg-background p-3 border border-amber-200 dark:border-amber-900/50 text-center">
                  <div className="text-xs text-muted-foreground font-semibold">OBC / SEBC</div>
                  <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">11.25%</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Statutory Quota</div>
                </div>
                <div className="rounded-lg bg-background p-3 border border-amber-200 dark:border-amber-900/50 text-center">
                  <div className="text-xs text-muted-foreground font-semibold">General / Open Merit</div>
                  <div className="text-xl font-bold text-slate-700 dark:text-slate-300 mt-1">50.00%</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Unreserved Merit</div>
                </div>
                <div className="rounded-lg bg-background p-3 border border-amber-200 dark:border-amber-900/50 text-center col-span-2 sm:col-span-1">
                  <div className="text-xs text-muted-foreground font-semibold">Persons with Disabilities (PwD)</div>
                  <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">5.00%</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Horizontal Reservation</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5-Year Cumulative Category Adherence Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg">5-Year Category-Wise Earmarked vs. Admitted Matrix</CardTitle>
                <CardDescription>
                  Cumulative comparison showing 100% adherence to reserved quota allocations over 2021-22 to 2025-26
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-emerald-400 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40">
                <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> 100% Roster Compliant
              </Badge>
            </CardHeader>
            <CardContent>
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Social Category</TableHead>
                      <TableHead className="text-center">Statutory Share (%)</TableHead>
                      <TableHead className="text-center">Total Seats Earmarked (5 Yrs)</TableHead>
                      <TableHead className="text-center">Total Students Admitted (5 Yrs)</TableHead>
                      <TableHead className="text-center">Quota Fill Ratio</TableHead>
                      <TableHead className="text-right">Verification Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-muted/40">
                      <TableCell className="font-semibold text-foreground">Scheduled Castes (SC)</TableCell>
                      <TableCell className="text-center font-mono">16.25%</TableCell>
                      <TableCell className="text-center font-medium">{reservationSummary.earmarkedSC}</TableCell>
                      <TableCell className="text-center font-bold text-indigo-600 dark:text-indigo-400">
                        {reservationSummary.admittedSC}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="border-indigo-400 text-indigo-700 dark:text-indigo-300">
                          {((reservationSummary.admittedSC / reservationSummary.earmarkedSC) * 100).toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-end gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                        </span>
                      </TableCell>
                    </TableRow>

                    <TableRow className="hover:bg-muted/40">
                      <TableCell className="font-semibold text-foreground">Scheduled Tribes (ST)</TableCell>
                      <TableCell className="text-center font-mono">22.50%</TableCell>
                      <TableCell className="text-center font-medium">{reservationSummary.earmarkedST}</TableCell>
                      <TableCell className="text-center font-bold text-sky-600 dark:text-sky-400">
                        {reservationSummary.admittedST}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="border-sky-400 text-sky-700 dark:text-sky-300">
                          {((reservationSummary.admittedST / reservationSummary.earmarkedST) * 100).toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-end gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                        </span>
                      </TableCell>
                    </TableRow>

                    <TableRow className="hover:bg-muted/40">
                      <TableCell className="font-semibold text-foreground">OBC / SEBC</TableCell>
                      <TableCell className="text-center font-mono">11.25%</TableCell>
                      <TableCell className="text-center font-medium">{reservationSummary.earmarkedOBC}</TableCell>
                      <TableCell className="text-center font-bold text-amber-600 dark:text-amber-400">
                        {reservationSummary.admittedOBC}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="border-amber-400 text-amber-700 dark:text-amber-300">
                          {((reservationSummary.admittedOBC / reservationSummary.earmarkedOBC) * 100).toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-end gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                        </span>
                      </TableCell>
                    </TableRow>

                    <TableRow className="hover:bg-muted/40">
                      <TableCell className="font-semibold text-foreground">General / Open Category</TableCell>
                      <TableCell className="text-center font-mono">50.00%</TableCell>
                      <TableCell className="text-center font-medium">{reservationSummary.earmarkedGeneral}</TableCell>
                      <TableCell className="text-center font-bold text-slate-700 dark:text-slate-300">
                        {reservationSummary.admittedGeneral}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="border-slate-400 text-slate-700 dark:text-slate-300">
                          {((reservationSummary.admittedGeneral / reservationSummary.earmarkedGeneral) * 100).toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-end gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                        </span>
                      </TableCell>
                    </TableRow>

                    <TableRow className="hover:bg-muted/40 bg-muted/20">
                      <TableCell className="font-semibold text-foreground">
                        PwD (Horizontal 5% Quota across Categories)
                      </TableCell>
                      <TableCell className="text-center font-mono">5.00%</TableCell>
                      <TableCell className="text-center font-medium">{reservationSummary.earmarkedPWD}</TableCell>
                      <TableCell className="text-center font-bold text-emerald-600 dark:text-emerald-400">
                        {reservationSummary.admittedPWD}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="border-emerald-400 text-emerald-700 dark:text-emerald-300">
                          {((reservationSummary.admittedPWD / reservationSummary.earmarkedPWD) * 100).toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-end gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                        </span>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </ResponsiveTableContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: EVIDENCE DOSSIERS & SAMS VERIFICATION */}
        <TabsContent value="evidence" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg">Metric 2.1.1 Evidentiary Dossiers & SAMS Notifications</CardTitle>
                <CardDescription>
                  Statutory gazette notifications, approved seat matrices, 5-year DVV calculation certificates, and SAMS
                  admitted student registers
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

      {/* DIALOG 1: ADD PROGRAMME INTAKE RECORD */}
      <Dialog open={isAddProgModalOpen} onOpenChange={setIsAddProgModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-indigo-600">
              <Plus className="h-5 w-5" /> Add Degree Programme Intake Record (2025-26)
            </DialogTitle>
            <DialogDescription>
              Record sanctioned seats, admitted students, and category quota adherence for Metric 2.1.1
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddProgramme} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="progCode">Programme Code *</Label>
                <Input
                  id="progCode"
                  placeholder="e.g. BT-CSE-AIML"
                  required
                  value={newProg.programmeCode}
                  onChange={(e) => setNewProg({ ...newProg, programmeCode: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="progLevel">Level *</Label>
                <Select
                  value={newProg.level}
                  onValueChange={(val: "UG" | "PG" | "Diploma") => setNewProg({ ...newProg, level: val })}
                >
                  <SelectTrigger id="progLevel">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UG">Undergraduate (UG)</SelectItem>
                    <SelectItem value="PG">Postgraduate (PG)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="progName">Programme Name *</Label>
              <Input
                id="progName"
                placeholder="e.g. B.Tech Computer Science & Artificial Intelligence"
                required
                value={newProg.programmeName}
                onChange={(e) => setNewProg({ ...newProg, programmeName: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="progDept">Department *</Label>
              <Input
                id="progDept"
                placeholder="e.g. Computer Science & Engineering"
                required
                value={newProg.department}
                onChange={(e) => setNewProg({ ...newProg, department: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="sanctionedSeats">Sanctioned Seats *</Label>
                <Input
                  id="sanctionedSeats"
                  type="number"
                  min="1"
                  required
                  value={newProg.sanctionedSeats}
                  onChange={(e) => setNewProg({ ...newProg, sanctionedSeats: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="admittedStudents">Admitted Students *</Label>
                <Input
                  id="admittedStudents"
                  type="number"
                  min="0"
                  required
                  value={newProg.admittedStudents}
                  onChange={(e) => setNewProg({ ...newProg, admittedStudents: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="rounded-lg border p-3 bg-muted/30 space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Category Admitted Breakdown
              </Label>
              <div className="grid grid-cols-5 gap-2">
                <div>
                  <span className="text-[10px] text-muted-foreground">SC</span>
                  <Input
                    type="number"
                    className="h-8 text-xs"
                    value={newProg.scAdmitted}
                    onChange={(e) => setNewProg({ ...newProg, scAdmitted: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground">ST</span>
                  <Input
                    type="number"
                    className="h-8 text-xs"
                    value={newProg.stAdmitted}
                    onChange={(e) => setNewProg({ ...newProg, stAdmitted: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground">OBC</span>
                  <Input
                    type="number"
                    className="h-8 text-xs"
                    value={newProg.obcAdmitted}
                    onChange={(e) => setNewProg({ ...newProg, obcAdmitted: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground">Gen</span>
                  <Input
                    type="number"
                    className="h-8 text-xs"
                    value={newProg.generalAdmitted}
                    onChange={(e) => setNewProg({ ...newProg, generalAdmitted: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground">PwD</span>
                  <Input
                    type="number"
                    className="h-8 text-xs"
                    value={newProg.pwdAdmitted}
                    onChange={(e) => setNewProg({ ...newProg, pwdAdmitted: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="samsCutoff">SAMS Cutoff / Entrance Rank</Label>
              <Input
                id="samsCutoff"
                placeholder="e.g. OJEE Rank < 3200 or JEE Main 88.5%ile"
                value={newProg.samsCutoffMarks}
                onChange={(e) => setNewProg({ ...newProg, samsCutoffMarks: e.target.value })}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddProgModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700">
                Save Programme Intake
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
              <UploadCloud className="h-5 w-5" /> Attach Metric 2.1.1 Evidentiary Dossier
            </DialogTitle>
            <DialogDescription>
              Upload authenticated intake orders, SAMS notifications, or 5-year DVV audit certificates
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadEvidence} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="eviTitle">Document Title *</Label>
              <Input
                id="eviTitle"
                placeholder="e.g. SAMS Odisha Seat Allocation Notification 2025-26"
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
                placeholder="e.g. SAMS_Odisha_Intake_Order_2025_26.pdf"
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
