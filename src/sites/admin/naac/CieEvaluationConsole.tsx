import { useState, useEffect } from "react";
import {
  FileCheck2,
  Calendar,
  AlertCircle,
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
  Filter,
  Eye,
  Clock,
  UserCheck,
  Scale,
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
  getCieEvaluationData,
  addCieGrievanceRecord,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type {
  CieEvaluationData,
  CieGrievanceRecord,
  CieAssessmentSchedule,
  NaacEvidenceDocument,
} from "@/types";

interface CieEvaluationConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function CieEvaluationConsole({ onEvidenceUpdated }: CieEvaluationConsoleProps) {
  const [data, setData] = useState<CieEvaluationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [evidenceList, setEvidenceList] = useState<NaacEvidenceDocument[]>([]);
  const [activeTab, setActiveTab] = useState("transparency");
  const [searchGrievance, setSearchGrievance] = useState("");
  const [filterTier, setFilterTier] = useState<string>("all");

  // New Grievance Modal
  const [showAddGrievanceModal, setShowAddGrievanceModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentId, setNewStudentId] = useState("");
  const [newProgramme, setNewProgramme] = useState("B.Sc. Computer Science");
  const [newSemester, setNewSemester] = useState("Semester V");
  const [newCourseCode, setNewCourseCode] = useState("CS501");
  const [newCourseName, setNewCourseName] = useState("Design & Analysis of Algorithms");
  const [newEvaluatorName, setNewEvaluatorName] = useState("Dr. Rashmita Mishra");
  const [newGrievanceType, setNewGrievanceType] = useState<CieGrievanceRecord["grievanceType"]>("Totaling Error");
  const [newOriginalMarks, setNewOriginalMarks] = useState(24);
  const [newRevisedMarks, setNewRevisedMarks] = useState(27);
  const [newTier, setNewTier] = useState<CieGrievanceRecord["tier"]>("Tier 1: Course Faculty");
  const [newRemarks, setNewRemarks] = useState("Totaling discrepancy resolved and marks updated.");

  // Upload Evidence Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDept, setEvidenceDept] = useState("Examination Cell");
  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadConsoleData();
  }, []);

  async function loadConsoleData() {
    setLoading(true);
    try {
      const [cieData, evidences] = await Promise.all([
        getCieEvaluationData(),
        getEvidenceForMetric("2.5.1"),
      ]);
      setData(cieData);
      setEvidenceList(evidences);
    } catch (err) {
      console.error("Failed to load CIE evaluation data", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredGrievances = (data?.grievances || []).filter((g) => {
    const matchesSearch =
      g.studentName.toLowerCase().includes(searchGrievance.toLowerCase()) ||
      g.studentId.toLowerCase().includes(searchGrievance.toLowerCase()) ||
      g.courseCode.toLowerCase().includes(searchGrievance.toLowerCase()) ||
      g.grievanceCode.toLowerCase().includes(searchGrievance.toLowerCase());
    const matchesTier = filterTier === "all" || g.tier === filterTier;
    return matchesSearch && matchesTier;
  });

  async function handleAddGrievance(e: React.FormEvent) {
    e.preventDefault();
    if (!newStudentName || !newCourseCode) return;

    try {
      await addCieGrievanceRecord(
        {
          grievanceCode: `CIE-2025-${String((data?.grievances.length || 0) + 1).padStart(3, "0")}`,
          filingDate: new Date().toISOString().split("T")[0],
          studentId: newStudentId || "STU2025GEN",
          studentName: newStudentName,
          programme: newProgramme,
          semester: newSemester,
          courseCode: newCourseCode,
          courseName: newCourseName,
          evaluatorName: newEvaluatorName,
          grievanceType: newGrievanceType,
          originalMarks: Number(newOriginalMarks),
          revisedMarks: Number(newRevisedMarks),
          tier: newTier,
          resolutionDate: new Date().toISOString().split("T")[0],
          turnaroundDays: 2,
          resolutionRemarks: newRemarks,
          status: "Resolved",
        },
        { name: "Dr. Sanjit Kumar Pattnayak", role: "Controller of Examinations" }
      );

      setShowAddGrievanceModal(false);
      resetGrievanceForm();
      loadConsoleData();
    } catch (err) {
      console.error("Failed to add CIE grievance", err);
    }
  }

  function resetGrievanceForm() {
    setNewStudentName("");
    setNewStudentId("");
    setNewCourseCode("CS501");
    setNewCourseName("Design & Analysis of Algorithms");
    setNewRemarks("Totaling discrepancy resolved and marks updated.");
  }

  async function handleUploadEvidence(e: React.FormEvent) {
    e.preventDefault();
    if (!evidenceTitle) return;

    setUploading(true);
    try {
      await uploadEvidenceDocument(
        {
          criterionId: 2,
          indicatorCode: "2.5",
          metricCode: "2.5.1",
          title: evidenceTitle,
          academicYear: "2025-26",
          department: evidenceDept,
          documentType: "PDF",
          description: evidenceDesc || "Evidentiary proof for CIE transparency and grievance redressal.",
          remarks: "Verified by Examination Cell & IQAC.",
          fileName: evidenceFile?.name || `${evidenceTitle.replace(/\s+/g, "_")}.pdf`,
          fileSize: evidenceFile ? `${(evidenceFile.size / (1024 * 1024)).toFixed(1)} MB` : "2.4 MB",
          evidenceUrl: `/documents/naac/evidence/CIE_${Date.now()}.pdf`,
        },
        { name: "Dr. Sanjit Kumar Pattnayak", role: "Controller of Examinations" }
      );

      setShowUploadModal(false);
      setEvidenceTitle("");
      setEvidenceDesc("");
      setEvidenceFile(null);
      loadConsoleData();
      if (onEvidenceUpdated) onEvidenceUpdated();
    } catch (err) {
      console.error("Failed to upload evidence", err);
    } finally {
      setUploading(false);
    }
  }

  if (loading || !data) {
    return (
      <Card className="border-emerald-200 bg-white/70 backdrop-blur">
        <CardContent className="p-12 text-center text-muted-foreground">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4" />
          Loading CIE Transparency & Grievance Console...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Card */}
      <Card className="border-2 border-emerald-300 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/70 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-emerald-700 text-white hover:bg-emerald-800">
                  NAAC Metric 2.5.1
                </Badge>
                <Badge variant="outline" className="text-emerald-700 border-emerald-300">
                  Evaluation Process & Reforms
                </Badge>
                <Badge className="bg-blue-600 text-white">Weightage: 30 Marks</Badge>
              </div>
              <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Scale className="w-6 h-6 text-emerald-600" />
                Continuous Internal Evaluation (CIE) & Grievance Redressal
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Transparent CIE calendar, script verification, rubrics dissemination, and time-bound three-tier grievance redressal.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs sm:text-sm"
                onClick={() => setShowAddGrievanceModal(true)}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Record Grievance
              </Button>
              <Button
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm shadow-sm"
                onClick={() => setShowUploadModal(true)}
              >
                <UploadCloud className="w-4 h-4 mr-1.5" />
                Attach Evidence
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Resolution Rate</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                {data.resolutionRate}%
              </div>
              <div className="text-xs text-emerald-600 font-medium mt-1">
                {data.totalGrievancesResolved} / {data.totalGrievancesReceived} Resolved
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Avg Resolution Time</span>
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-blue-700 mt-1">
                {data.averageResolutionDays} Days
              </div>
              <div className="text-xs text-gray-500 mt-1">Benchmark: ≤ 7.0 Working Days</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Assessments Conducted</span>
                <Calendar className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-indigo-700 mt-1">
                {data.totalAssessmentsConducted}
              </div>
              <div className="text-xs text-gray-500 mt-1">Across 14 Degree Programmes</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Scripts Evaluated</span>
                <FileCheck2 className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-amber-700 mt-1">
                {data.totalEvaluatedScripts.toLocaleString()}
              </div>
              <div className="text-xs text-emerald-600 font-medium mt-1">100% Scripts Shown to Students</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Layout */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl bg-gray-100 p-1">
          <TabsTrigger value="transparency" className="text-xs sm:text-sm">
            Transparency SOPs
          </TabsTrigger>
          <TabsTrigger value="schedules" className="text-xs sm:text-sm">
            CIE Schedules ({data.schedules.length})
          </TabsTrigger>
          <TabsTrigger value="grievances" className="text-xs sm:text-sm">
            Grievances ({data.grievances.length})
          </TabsTrigger>
          <TabsTrigger value="evidence" className="text-xs sm:text-sm">
            Evidences ({evidenceList.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Transparency Measures & SOPs */}
        <TabsContent value="transparency" className="space-y-4 mt-4">
          <Card className="border border-emerald-100 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Institutional Transparency Mechanisms & Best Practices
              </CardTitle>
              <CardDescription>
                Statutory SOPs institutionalized to ensure complete fairness, transparency, and auditability in continuous internal assessments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.transparencyMeasures.map((measure, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-emerald-200 transition-all space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-gray-900">{measure.measure}</h4>
                      <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">
                        {measure.complianceStatus}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{measure.description}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium pt-1 border-t border-gray-100">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      Frequency: {measure.frequency}
                    </div>
                  </div>
                ))}
              </div>

              {/* Three-Tier Grievance Architecture Visualizer */}
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200">
                <h4 className="font-semibold text-sm text-emerald-950 mb-3 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-700" />
                  Three-Tier CIE Grievance Redressal Architecture
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-emerald-200 shadow-2xs">
                    <div className="text-xs font-bold text-emerald-700">Tier 1: Course Faculty</div>
                    <div className="text-[11px] text-gray-600 mt-1">Direct verification of totaling, unchecked answers, and script discussion within 3 working days.</div>
                    <Badge variant="outline" className="mt-2 text-[10px] text-emerald-700 border-emerald-300">Turnaround: 3 Days</Badge>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-teal-200 shadow-2xs">
                    <div className="text-xs font-bold text-teal-700">Tier 2: Head of Department</div>
                    <div className="text-[11px] text-gray-600 mt-1">Departmental Review Committee with external domain faculty for re-evaluation within 5 working days.</div>
                    <Badge variant="outline" className="mt-2 text-[10px] text-teal-700 border-teal-300">Turnaround: 5 Days</Badge>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-200 shadow-2xs">
                    <div className="text-xs font-bold text-blue-700">Tier 3: College Exam Cell</div>
                    <div className="text-[11px] text-gray-600 mt-1">Central Examination Committee chaired by Principal for systemic disputes and final adjudication within 7 days.</div>
                    <Badge variant="outline" className="mt-2 text-[10px] text-blue-700 border-blue-300">Turnaround: 7 Days</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Assessment Schedules */}
        <TabsContent value="schedules" className="space-y-4 mt-4">
          <Card className="border border-emerald-100 shadow-xs">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-gray-800">
                  Institutional Assessment Calendars (2025-26)
                </CardTitle>
                <CardDescription>
                  Notified schedules of Continuous Internal Evaluations across UG and PG semesters.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/80">
                      <TableHead className="font-semibold text-xs">Assessment Name</TableHead>
                      <TableHead className="font-semibold text-xs">Semester / Level</TableHead>
                      <TableHead className="font-semibold text-xs">Notification Date</TableHead>
                      <TableHead className="font-semibold text-xs">Exam Period</TableHead>
                      <TableHead className="font-semibold text-xs">Marks Display</TableHead>
                      <TableHead className="font-semibold text-xs">Grievance Deadline</TableHead>
                      <TableHead className="font-semibold text-xs">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.schedules.map((sch) => (
                      <TableRow key={sch.id} className="hover:bg-gray-50/50">
                        <TableCell className="font-medium text-xs text-gray-900">
                          {sch.assessmentName}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">
                            {sch.programType} - {sch.semester}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-gray-600">
                          {sch.syllabusNotificationDate}
                        </TableCell>
                        <TableCell className="text-xs text-gray-600">
                          {sch.examStartDate} to {sch.examEndDate}
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-emerald-700">
                          {sch.marksDisplayDate}
                        </TableCell>
                        <TableCell className="text-xs text-gray-600">
                          {sch.grievanceSubmissionDeadline}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              sch.status === "Marks Finalized"
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                : "bg-blue-100 text-blue-800"
                            }
                          >
                            {sch.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ResponsiveTableContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Grievance Redressal Register */}
        <TabsContent value="grievances" className="space-y-4 mt-4">
          <Card className="border border-emerald-100 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-semibold text-gray-800">
                    CIE Grievances & Resolution Master Register
                  </CardTitle>
                  <CardDescription>
                    All received internal evaluation discrepancies, investigation findings, mark revisions, and turnaround metrics.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative w-48 sm:w-60">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-3 text-gray-400" />
                    <Input
                      placeholder="Search student, code, course..."
                      className="pl-8 text-xs h-9"
                      value={searchGrievance}
                      onChange={(e) => setSearchGrievance(e.target.value)}
                    />
                  </div>
                  <Select value={filterTier} onValueChange={setFilterTier}>
                    <SelectTrigger className="w-36 text-xs h-9">
                      <SelectValue placeholder="Tier Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="Tier 1: Course Faculty">Tier 1 (Faculty)</SelectItem>
                      <SelectItem value="Tier 2: Head of Department">Tier 2 (HoD)</SelectItem>
                      <SelectItem value="Tier 3: College Exam Committee">Tier 3 (Exam Cell)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/80">
                      <TableHead className="font-semibold text-xs">Grievance Code</TableHead>
                      <TableHead className="font-semibold text-xs">Student Details</TableHead>
                      <TableHead className="font-semibold text-xs">Course & Faculty</TableHead>
                      <TableHead className="font-semibold text-xs">Nature of Grievance</TableHead>
                      <TableHead className="font-semibold text-xs">Marks (Before → After)</TableHead>
                      <TableHead className="font-semibold text-xs">Resolution Level</TableHead>
                      <TableHead className="font-semibold text-xs">Turnaround</TableHead>
                      <TableHead className="font-semibold text-xs">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGrievances.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500 text-xs">
                          No grievances found matching the current search criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredGrievances.map((grv) => (
                        <TableRow key={grv.id} className="hover:bg-gray-50/50">
                          <TableCell className="font-mono text-xs font-semibold text-emerald-800">
                            {grv.grievanceCode}
                            <div className="text-[10px] text-gray-400 font-sans">{grv.filingDate}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-xs text-gray-900">{grv.studentName}</div>
                            <div className="text-[10px] text-gray-500">{grv.studentId} • {grv.programme}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-xs text-gray-900">{grv.courseCode}</div>
                            <div className="text-[10px] text-gray-500 truncate max-w-[140px]">{grv.courseName}</div>
                            <div className="text-[10px] text-emerald-600 font-medium">By: {grv.evaluatorName}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[10px]">
                              {grv.grievanceType}
                            </Badge>
                            <div className="text-[10px] text-gray-500 mt-0.5 line-clamp-1 max-w-[180px]">
                              {grv.resolutionRemarks}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs">
                            <span className="text-gray-500 font-medium">{grv.originalMarks}</span>
                            <span className="text-gray-400 mx-1">→</span>
                            <span className="font-bold text-emerald-700">{grv.revisedMarks}</span>
                            <span className="text-[10px] text-emerald-600 ml-1">
                              (+{grv.revisedMarks - grv.originalMarks})
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-200 text-[10px]">
                              {grv.tier}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs font-medium text-blue-700">
                            {grv.turnaroundDays} Days
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-[10px] flex items-center gap-1 w-fit">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              {grv.status}
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

        {/* Tab 4: Evidences */}
        <TabsContent value="evidence" className="space-y-4 mt-4">
          <Card className="border border-emerald-100 shadow-xs">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-gray-800">
                  Evidentiary Documentation (Metric 2.5.1)
                </CardTitle>
                <CardDescription>
                  Verified CIE circulars, grievance registers, and SOPs uploaded for NAAC peer review.
                </CardDescription>
              </div>
              <Button
                size="sm"
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs"
                onClick={() => setShowUploadModal(true)}
              >
                <UploadCloud className="w-3.5 h-3.5 mr-1" />
                Upload Evidence
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {evidenceList.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl border border-gray-100 bg-white hover:border-emerald-200 hover:shadow-xs transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900 leading-snug">
                            {doc.title}
                          </h4>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            {doc.department} • {doc.academicYear} • {doc.fileSize}
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">
                        {doc.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{doc.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] text-gray-500">
                      <span>Uploaded by: {doc.uploadedBy}</span>
                      <a
                        href={doc.evidenceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-700 font-medium hover:underline inline-flex items-center gap-1"
                      >
                        View Document <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Grievance Modal */}
      <Dialog open={showAddGrievanceModal} onOpenChange={setShowAddGrievanceModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-800">
              <Scale className="w-5 h-5" />
              Log New CIE Grievance
            </DialogTitle>
            <DialogDescription>
              Record student assessment grievance, marks revision, and committee resolution.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddGrievance} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Student Name</Label>
                <Input
                  className="text-xs h-9"
                  required
                  placeholder="e.g. Swarnalata Behera"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">Student ID / Roll No</Label>
                <Input
                  className="text-xs h-9"
                  placeholder="e.g. STU2024CS089"
                  value={newStudentId}
                  onChange={(e) => setNewStudentId(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Programme</Label>
                <Select value={newProgramme} onValueChange={setNewProgramme}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B.Sc. Computer Science">B.Sc. Computer Science</SelectItem>
                    <SelectItem value="B.Sc. Physics">B.Sc. Physics</SelectItem>
                    <SelectItem value="B.Sc. Chemistry">B.Sc. Chemistry</SelectItem>
                    <SelectItem value="B.Com. Accounting">B.Com. Accounting</SelectItem>
                    <SelectItem value="B.A. Economics">B.A. Economics</SelectItem>
                    <SelectItem value="M.Sc. Computer Science">M.Sc. Computer Science</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Semester</Label>
                <Select value={newSemester} onValueChange={setNewSemester}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Semester I">Semester I</SelectItem>
                    <SelectItem value="Semester II">Semester II</SelectItem>
                    <SelectItem value="Semester III">Semester III</SelectItem>
                    <SelectItem value="Semester IV">Semester IV</SelectItem>
                    <SelectItem value="Semester V">Semester V</SelectItem>
                    <SelectItem value="Semester VI">Semester VI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Course Code</Label>
                <Input
                  className="text-xs h-9"
                  required
                  value={newCourseCode}
                  onChange={(e) => setNewCourseCode(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">Course Name</Label>
                <Input
                  className="text-xs h-9"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Grievance Nature</Label>
                <Select
                  value={newGrievanceType}
                  onValueChange={(val: any) => setNewGrievanceType(val)}
                >
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Totaling Error">Totaling Error</SelectItem>
                    <SelectItem value="Unchecked Question">Unchecked Question</SelectItem>
                    <SelectItem value="Evaluation Discrepancy">Evaluation Discrepancy</SelectItem>
                    <SelectItem value="Missing Marks">Missing Marks</SelectItem>
                    <SelectItem value="Attendance/Eligibility">Attendance Discrepancy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Resolution Level</Label>
                <Select value={newTier} onValueChange={(val: any) => setNewTier(val)}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tier 1: Course Faculty">Tier 1: Course Faculty</SelectItem>
                    <SelectItem value="Tier 2: Head of Department">Tier 2: HoD Committee</SelectItem>
                    <SelectItem value="Tier 3: College Exam Committee">Tier 3: Central Exam Cell</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Original Marks</Label>
                <Input
                  type="number"
                  className="text-xs h-9"
                  value={newOriginalMarks}
                  onChange={(e) => setNewOriginalMarks(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Revised Marks</Label>
                <Input
                  type="number"
                  className="text-xs h-9"
                  value={newRevisedMarks}
                  onChange={(e) => setNewRevisedMarks(Number(e.target.value))}
                />
              </div>
            </div>

            <div>
              <Label className="text-xs">Resolution Remarks</Label>
              <Input
                className="text-xs h-9"
                value={newRemarks}
                onChange={(e) => setNewRemarks(e.target.value)}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                className="text-xs h-9"
                onClick={() => setShowAddGrievanceModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs h-9">
                Save & Resolve Grievance
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Upload Evidence Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-800">
              <UploadCloud className="w-5 h-5" />
              Upload Metric 2.5.1 Evidence
            </DialogTitle>
            <DialogDescription>
              Attach academic circulars, evaluated script samples, or grievance resolution sheets.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadEvidence} className="space-y-3">
            <div>
              <Label className="text-xs">Document Title</Label>
              <Input
                className="text-xs h-9"
                required
                placeholder="e.g. CIE Grievance Redressal Committee Minutes 2025-26"
                value={evidenceTitle}
                onChange={(e) => setEvidenceTitle(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs">Department / Custodian</Label>
              <Input
                className="text-xs h-9"
                value={evidenceDept}
                onChange={(e) => setEvidenceDept(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs">Description</Label>
              <Input
                className="text-xs h-9"
                placeholder="Brief summary of statutory compliance"
                value={evidenceDesc}
                onChange={(e) => setEvidenceDesc(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs">Select Document (PDF/XLSX)</Label>
              <Input
                type="file"
                className="text-xs h-9"
                accept=".pdf,.xlsx,.csv,.docx"
                onChange={(e) => setEvidenceFile(e.target.files?.[0] || null)}
              />
            </div>
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                className="text-xs h-9"
                onClick={() => setShowUploadModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={uploading}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs h-9"
              >
                {uploading ? "Uploading..." : "Upload & Link Document"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
