import { useState, useEffect } from "react";
import {
  Compass,
  Trophy,
  GraduationCap,
  Target,
  CheckCircle2,
  FileText,
  Search,
  Plus,
  ExternalLink,
  UploadCloud,
  ShieldCheck,
  Award,
  Layers,
  Activity,
  Calendar,
  BookOpen,
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
  getCompetitiveExamGuidanceData,
  addCoachingSession,
  addExamQualifier,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type {
  CompetitiveExamGuidanceData,
  CoachingSessionRecord,
  ExamQualifierRecord,
  NaacEvidenceDocument,
} from "@/types";

interface CareerGuidanceConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function CareerGuidanceConsole({ onEvidenceUpdated }: CareerGuidanceConsoleProps) {
  const [data, setData] = useState<CompetitiveExamGuidanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [evidenceList, setEvidenceList] = useState<NaacEvidenceDocument[]>([]);
  const [activeTab, setActiveTab] = useState("sessions");
  const [searchQualifier, setSearchQualifier] = useState("");

  // Add Session Modal
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  const [examTrack, setExamTrack] = useState<CoachingSessionRecord["examTrack"]>("GATE Engineering");
  const [courseTitle, setCourseTitle] = useState("");
  const [coordinatingFaculty, setCoordinatingFaculty] = useState("Dr. Alok Kumar Nayak");
  const [externalAgency, setExternalAgency] = useState("ACE Engineering Academy");
  const [studentsEnrolled, setStudentsEnrolled] = useState(120);
  const [durationMonths, setDurationMonths] = useState(6);
  const [mockTestsConducted, setMockTestsConducted] = useState(20);
  const [qualifiedStudentsCount, setQualifiedStudentsCount] = useState(25);

  // Add Qualifier Modal
  const [showAddQualifierModal, setShowAddQualifierModal] = useState(false);
  const [rollNo, setRollNo] = useState("");
  const [studentName, setStudentName] = useState("");
  const [examName, setExamName] = useState("GATE 2026");
  const [allIndiaRankOrScore, setAllIndiaRankOrScore] = useState("AIR 256");
  const [percentile, setPercentile] = useState("99.10 Percentile");
  const [department, setDepartment] = useState("Computer Science & Engineering");

  // Upload Evidence Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDept, setEvidenceDept] = useState("Career Guidance & Higher Studies Bureau");
  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadConsoleData();
  }, []);

  async function loadConsoleData() {
    setLoading(true);
    try {
      const [cgData, evidences] = await Promise.all([
        getCompetitiveExamGuidanceData(),
        getEvidenceForMetric("5.1.3"),
      ]);
      setData(cgData);
      setEvidenceList(evidences);
    } catch (err) {
      console.error("Failed to load competitive exam guidance console data", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddSession(e: React.FormEvent) {
    e.preventDefault();
    if (!courseTitle) return;
    try {
      await addCoachingSession(
        {
          examTrack,
          courseTitle,
          coordinatingFaculty,
          externalAgency,
          studentsEnrolled,
          durationMonths,
          mockTestsConducted,
          qualifiedStudentsCount,
          attendanceRegisterUrl: "https://documents.eduplatform.ac.in/naac/5.1.3/sample_attendance.pdf",
        },
        { name: "Career Guidance Cell", role: "Admin" }
      );
      setShowAddSessionModal(false);
      setCourseTitle("");
      await loadConsoleData();
    } catch (err) {
      console.error("Failed to add coaching track", err);
    }
  }

  async function handleAddQualifier(e: React.FormEvent) {
    e.preventDefault();
    if (!studentName || !rollNo) return;
    try {
      await addExamQualifier(
        {
          rollNo,
          studentName,
          examName,
          allIndiaRankOrScore,
          percentile,
          qualifiedYear: "2026",
          department,
          proofDocumentUrl: "https://documents.eduplatform.ac.in/naac/5.1.3/sample_scorecard.pdf",
        },
        { name: "Exam Cell Coordinator", role: "Admin" }
      );
      setShowAddQualifierModal(false);
      setRollNo("");
      setStudentName("");
      await loadConsoleData();
    } catch (err) {
      console.error("Failed to add qualifier record", err);
    }
  }

  async function handleUploadEvidence(e: React.FormEvent) {
    e.preventDefault();
    if (!evidenceTitle) return;
    setUploading(true);
    try {
      const dummyFile = evidenceFile || new File(["dummy"], "evidence.pdf", { type: "application/pdf" });
      await uploadEvidenceDocument(
        {
          criterionId: 5,
          indicatorCode: "5.1",
          metricCode: "5.1.3",
          title: evidenceTitle,
          academicYear: "2025-26",
          department: evidenceDept,
          documentType: "PDF",
          description: evidenceDesc || "Competitive examination coaching attendance sheets and qualifier scorecards.",
          remarks: "Authenticated against official GATE/CAT/UPSC qualifying scorecards.",
        },
        dummyFile,
        { name: "Career Guidance Cell", role: "Admin" }
      );
      setShowUploadModal(false);
      setEvidenceTitle("");
      setEvidenceDesc("");
      setEvidenceFile(null);
      await loadConsoleData();
      if (onEvidenceUpdated) onEvidenceUpdated();
    } catch (err) {
      console.error("Failed to upload evidence", err);
    } finally {
      setUploading(false);
    }
  }

  if (loading || !data) {
    return (
      <Card className="border-rose-200 shadow-md">
        <CardContent className="p-8 text-center text-muted-foreground">
          <Activity className="w-8 h-8 mx-auto mb-3 animate-spin text-rose-600" />
          <p>Loading Competitive Exams Guidance & Counseling Console...</p>
        </CardContent>
      </Card>
    );
  }

  const filteredQualifiers = data.qualifiers.filter(
    (q) =>
      q.studentName.toLowerCase().includes(searchQualifier.toLowerCase()) ||
      q.rollNo.toLowerCase().includes(searchQualifier.toLowerCase()) ||
      q.examName.toLowerCase().includes(searchQualifier.toLowerCase()) ||
      q.department.toLowerCase().includes(searchQualifier.toLowerCase())
  );

  return (
    <Card className="border-rose-200 shadow-lg bg-card">
      <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-rose-600 text-white hover:bg-rose-700">Metric 5.1.3</Badge>
              <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-50">
                640 Students Mentored
              </Badge>
              <Badge variant="outline" className="text-rose-700 border-rose-300 bg-rose-50">
                86 Qualified in National Exams
              </Badge>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Compass className="w-6 h-6 text-rose-600" />
              Competitive Exams Guidance & Counseling Console
            </CardTitle>
            <CardDescription className="text-slate-600">
              Institutional guidance for GATE, CAT/XAT, GRE/TOEFL, and UPSC/State Civil Services. 640 students enrolled with 86 national qualifiers.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowUploadModal(true)}
              className="text-rose-700 border-rose-300 hover:bg-rose-100"
            >
              <UploadCloud className="w-4 h-4 mr-1.5" />
              Upload Evidence
            </Button>
            <Button
              size="sm"
              onClick={() => setShowAddQualifierModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Trophy className="w-4 h-4 mr-1.5" />
              Add Qualifier
            </Button>
            <Button
              size="sm"
              onClick={() => setShowAddSessionModal(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Coaching Track
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-rose-100 bg-gradient-to-br from-rose-50/50 to-white shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Students Trained</span>
                <Target className="w-4 h-4 text-rose-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-rose-700">{data.totalStudentsTrained}</span>
                <span className="text-xs text-slate-500">Aspirants</span>
              </div>
              <p className="text-xs text-slate-600">Across 6 specialized coaching cohorts</p>
            </CardContent>
          </Card>

          <Card className="border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Exam Qualifiers</span>
                <Trophy className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-emerald-700">{data.totalStudentsQualified}</span>
                <span className="text-xs font-medium text-emerald-600">(13.4% Success Rate)</span>
              </div>
              <p className="text-xs text-slate-600">GATE, CAT, GRE, OPSC cleared</p>
            </CardContent>
          </Card>

          <Card className="border border-amber-100 bg-gradient-to-br from-amber-50/50 to-white shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Top National Rank</span>
                <Award className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-amber-700">{data.topGateRank.split("(")[0]}</span>
              </div>
              <p className="text-xs text-slate-600 truncate">{data.topGateRank}</p>
            </CardContent>
          </Card>

          <Card className="border border-blue-100 bg-gradient-to-br from-blue-50/50 to-white shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Mock Tests Delivered</span>
                <BookOpen className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-blue-700">70 Tests</span>
                <span className="text-xs text-slate-500">Simulated</span>
              </div>
              <p className="text-xs text-slate-600">Full syllabus CBT format</p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Controls */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <TabsList className="grid grid-cols-3 w-full sm:w-auto max-w-md">
              <TabsTrigger value="sessions">Coaching Tracks ({data.sessions.length})</TabsTrigger>
              <TabsTrigger value="qualifiers">Qualifiers Hall of Fame ({data.qualifiers.length})</TabsTrigger>
              <TabsTrigger value="evidence">Evidences ({evidenceList.length})</TabsTrigger>
            </TabsList>

            {activeTab === "qualifiers" && (
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search qualifier, roll, exam..."
                  value={searchQualifier}
                  onChange={(e) => setSearchQualifier(e.target.value)}
                  className="pl-9 text-sm"
                />
              </div>
            )}
          </div>

          {/* Tab 1: Coaching Tracks */}
          <TabsContent value="sessions">
            <ResponsiveTableContainer>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">Exam Track & Course Title</TableHead>
                    <TableHead className="font-semibold text-slate-700">Coordinating Faculty & Agency</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">Duration</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">Enrolled Students</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">Mock Tests</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">Qualifiers</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">Register</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.sessions.map((s) => (
                    <TableRow key={s.id} className="hover:bg-slate-50/80">
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            s.examTrack.includes("GATE")
                              ? "bg-rose-50 text-rose-800 border-rose-200 mb-1"
                              : s.examTrack.includes("CAT")
                              ? "bg-amber-50 text-amber-800 border-amber-200 mb-1"
                              : s.examTrack.includes("GRE")
                              ? "bg-blue-50 text-blue-800 border-blue-200 mb-1"
                              : "bg-emerald-50 text-emerald-800 border-emerald-200 mb-1"
                          }
                        >
                          {s.examTrack}
                        </Badge>
                        <div className="font-semibold text-slate-900">{s.courseTitle}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs font-semibold text-slate-800">{s.coordinatingFaculty}</div>
                        <div className="text-[11px] text-slate-500">{s.externalAgency}</div>
                      </TableCell>
                      <TableCell className="text-center font-mono text-xs">
                        {s.durationMonths} Months
                      </TableCell>
                      <TableCell className="text-center font-bold text-slate-800">
                        {s.studentsEnrolled}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="font-mono text-xs">
                          {s.mockTestsConducted} Tests
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-emerald-600 text-white font-bold">
                          {s.qualifiedStudentsCount} Qualified
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs text-rose-700 hover:text-rose-900"
                          onClick={() => window.open(s.attendanceRegisterUrl, "_blank")}
                        >
                          <FileText className="w-3.5 h-3.5 mr-1" />
                          Attendance
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ResponsiveTableContainer>
          </TabsContent>

          {/* Tab 2: Hall of Fame Qualifiers */}
          <TabsContent value="qualifiers">
            <ResponsiveTableContainer>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">Student Name & Roll No</TableHead>
                    <TableHead className="font-semibold text-slate-700">Competitive Exam</TableHead>
                    <TableHead className="font-semibold text-slate-700">Score / All-India Rank (AIR)</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">Percentile / Stage</TableHead>
                    <TableHead className="font-semibold text-slate-700">Department</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">Scorecard Proof</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQualifiers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No qualifier records match your search query.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredQualifiers.map((q) => (
                      <TableRow key={q.id} className="hover:bg-slate-50/80">
                        <TableCell>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <Trophy className="w-3.5 h-3.5 text-amber-500" />
                            {q.studentName}
                          </div>
                          <div className="font-mono text-xs text-slate-500">{q.rollNo}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-semibold text-rose-800 bg-rose-50 border-rose-200">
                            {q.examName}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-emerald-700 text-sm">
                          {q.allIndiaRankOrScore}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary" className="text-xs">
                            {q.percentile}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-slate-600">{q.department}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs text-rose-700 border-rose-200"
                            onClick={() => window.open(q.proofDocumentUrl, "_blank")}
                          >
                            <ExternalLink className="w-3.5 h-3.5 mr-1" />
                            Scorecard
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ResponsiveTableContainer>
          </TabsContent>

          {/* Tab 3: Statutory Evidences */}
          <TabsContent value="evidence">
            <ResponsiveTableContainer>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">Document Title</TableHead>
                    <TableHead className="font-semibold text-slate-700">Department</TableHead>
                    <TableHead className="font-semibold text-slate-700">Uploaded By</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evidenceList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No uploaded evidence documents found for Metric 5.1.3.
                      </TableCell>
                    </TableRow>
                  ) : (
                    evidenceList.map((doc) => (
                      <TableRow key={doc.id} className="hover:bg-slate-50/80">
                        <TableCell>
                          <div className="font-medium text-slate-900">{doc.title}</div>
                          <div className="text-xs text-slate-500">{doc.description}</div>
                        </TableCell>
                        <TableCell className="text-xs text-slate-600">{doc.department}</TableCell>
                        <TableCell className="text-xs text-slate-600">
                          <div>{doc.uploadedBy}</div>
                          <div className="text-[10px] text-slate-400">{doc.uploadDate}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={
                              doc.status === "Approved"
                                ? "bg-emerald-600 text-white"
                                : "bg-blue-600 text-white"
                            }
                          >
                            {doc.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs text-rose-700 border-rose-200"
                            onClick={() => window.open(doc.evidenceUrl, "_blank")}
                          >
                            <ExternalLink className="w-3.5 h-3.5 mr-1" />
                            Open PDF
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ResponsiveTableContainer>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Add Coaching Track Modal */}
      <Dialog open={showAddSessionModal} onOpenChange={setShowAddSessionModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Competitive Exam Coaching Track</DialogTitle>
            <DialogDescription>
              Record a structured guidance session or mentoring course for competitive exam preparation.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSession} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-semibold">Examination Track</Label>
              <Select
                value={examTrack}
                onValueChange={(val) => setExamTrack(val as CoachingSessionRecord["examTrack"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GATE Engineering">GATE Engineering</SelectItem>
                  <SelectItem value="CAT / XAT Management">CAT / XAT Management</SelectItem>
                  <SelectItem value="GRE / TOEFL Overseas">GRE / TOEFL Overseas</SelectItem>
                  <SelectItem value="UPSC / State Civil Services">UPSC / State Civil Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold">Course Title</Label>
              <Input
                placeholder="e.g. GATE 2026 CS & IT Comprehensive Test Series"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Coordinating Faculty</Label>
              <Input
                value={coordinatingFaculty}
                onChange={(e) => setCoordinatingFaculty(e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">External Coaching Agency</Label>
              <Input
                value={externalAgency}
                onChange={(e) => setExternalAgency(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs font-semibold">Enrolled</Label>
                <Input
                  type="number"
                  value={studentsEnrolled}
                  onChange={(e) => setStudentsEnrolled(Number(e.target.value))}
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Months</Label>
                <Input
                  type="number"
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(Number(e.target.value))}
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Mock Tests</Label>
                <Input
                  type="number"
                  value={mockTestsConducted}
                  onChange={(e) => setMockTestsConducted(Number(e.target.value))}
                  required
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold">Qualified Count</Label>
              <Input
                type="number"
                value={qualifiedStudentsCount}
                onChange={(e) => setQualifiedStudentsCount(Number(e.target.value))}
                required
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowAddSessionModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-rose-600 text-white hover:bg-rose-700">
                Save Coaching Track
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Qualifier Modal */}
      <Dialog open={showAddQualifierModal} onOpenChange={setShowAddQualifierModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Exam Qualifier Record</DialogTitle>
            <DialogDescription>
              Record a student who qualified in a national/international competitive examination.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddQualifier} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Roll Number</Label>
                <Input
                  placeholder="e.g. 21CSE088"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Student Name</Label>
                <Input
                  placeholder="Full name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Exam Name</Label>
                <Input
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">AIR / Score</Label>
                <Input
                  placeholder="e.g. AIR 142"
                  value={allIndiaRankOrScore}
                  onChange={(e) => setAllIndiaRankOrScore(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Percentile / Stage</Label>
                <Input
                  value={percentile}
                  onChange={(e) => setPercentile(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Department</Label>
                <Input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowAddQualifierModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 text-white hover:bg-emerald-700">
                Save Qualifier
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Upload Evidence Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Career Guidance Evidence</DialogTitle>
            <DialogDescription>
              Upload authenticated scorecards, coaching registers, or mock test logs for Metric 5.1.3.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadEvidence} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-semibold">Document Title</Label>
              <Input
                placeholder="e.g. GATE 2026 Scorecard Dossier & Coaching Attendance"
                value={evidenceTitle}
                onChange={(e) => setEvidenceTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Department</Label>
              <Input
                value={evidenceDept}
                onChange={(e) => setEvidenceDept(e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Description / Remarks</Label>
              <Input
                placeholder="Brief summary of coaching logs and qualifier proofs"
                value={evidenceDesc}
                onChange={(e) => setEvidenceDesc(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">File Attachment (PDF / Image)</Label>
              <Input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setEvidenceFile(e.target.files ? e.target.files[0] : null)}
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowUploadModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploading} className="bg-rose-600 text-white hover:bg-rose-700">
                {uploading ? "Uploading..." : "Submit Evidence"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
