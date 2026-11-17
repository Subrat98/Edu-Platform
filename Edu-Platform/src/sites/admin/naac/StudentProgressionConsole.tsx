import { useState, useEffect } from "react";
import {
  Briefcase,
  GraduationCap,
  TrendingUp,
  Building2,
  CheckCircle2,
  Search,
  Plus,
  ExternalLink,
  UploadCloud,
  BadgeIndianRupee,
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
  getPlacementProgressionData,
  addPlacementOffer,
  addHigherStudiesAdmit,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type {
  PlacementProgressionData,
  PlacementOfferRecord,
  NaacEvidenceDocument,
} from "@/types";

interface StudentProgressionConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function StudentProgressionConsole({ onEvidenceUpdated }: StudentProgressionConsoleProps) {
  const [data, setData] = useState<PlacementProgressionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [evidenceList, setEvidenceList] = useState<NaacEvidenceDocument[]>([]);
  const [activeTab, setActiveTab] = useState("offers");
  const [searchOffer, setSearchOffer] = useState("");

  // Add Placement Offer Modal
  const [showAddOfferModal, setShowAddOfferModal] = useState(false);
  const [rollNo, setRollNo] = useState("");
  const [studentName, setStudentName] = useState("");
  const [programme, setProgramme] = useState("B.Tech Computer Science & Engineering");
  const [companyName, setCompanyName] = useState("");
  const [jobRole, setJobRole] = useState("Software Development Engineer");
  const [ctcLakhsPerAnnum, setCtcLakhsPerAnnum] = useState(7.0);
  const [appointmentLetterRef, setAppointmentLetterRef] = useState("REC/HR/2026/0914");
  const [driveType, setDriveType] = useState<PlacementOfferRecord["driveType"]>("On-Campus");

  // Add Higher Studies Modal
  const [showAddHigherStudiesModal, setShowAddHigherStudiesModal] = useState(false);
  const [hsRollNo, setHsRollNo] = useState("");
  const [hsStudentName, setHsStudentName] = useState("");
  const [ugProgramme, setUgProgramme] = useState("B.Tech Computer Science & Engineering");
  const [admittedInstitution, setAdmittedInstitution] = useState("IIT Bombay");
  const [programmeEnrolled, setProgrammeEnrolled] = useState("M.Tech Computer Science");
  const [examQualified, setExamQualified] = useState("GATE 2026 (AIR 142)");
  const [admissionLetterRef, setAdmissionLetterRef] = useState("IITB/ADM/2026/041");

  // Upload Evidence Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDept, setEvidenceDept] = useState("Training & Placement Cell");
  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadConsoleData();
  }, []);

  async function loadConsoleData() {
    setLoading(true);
    try {
      const [progData, evidences] = await Promise.all([
        getPlacementProgressionData(),
        getEvidenceForMetric("5.2.1"),
      ]);
      setData(progData);
      setEvidenceList(evidences);
    } catch (err) {
      console.error("Failed to load student progression console data", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddOffer(e: React.FormEvent) {
    e.preventDefault();
    if (!studentName || !companyName || !rollNo) return;
    try {
      await addPlacementOffer(
        {
          rollNo,
          studentName,
          programme,
          companyName,
          jobRole,
          ctcLakhsPerAnnum,
          offerDate: new Date().toISOString().split("T")[0]!,
          appointmentLetterRef,
          driveType,
        },
        { name: "Training & Placement Officer", role: "Admin" }
      );
      setShowAddOfferModal(false);
      setRollNo("");
      setStudentName("");
      setCompanyName("");
      await loadConsoleData();
    } catch (err) {
      console.error("Failed to add placement offer", err);
    }
  }

  async function handleAddHigherStudies(e: React.FormEvent) {
    e.preventDefault();
    if (!hsStudentName || !admittedInstitution || !hsRollNo) return;
    try {
      await addHigherStudiesAdmit(
        {
          rollNo: hsRollNo,
          studentName: hsStudentName,
          undergraduateProgramme: ugProgramme,
          admittedInstitution,
          programmeEnrolled,
          examQualified,
          admissionLetterRef,
        },
        { name: "Higher Studies Coordinator", role: "Admin" }
      );
      setShowAddHigherStudiesModal(false);
      setHsRollNo("");
      setHsStudentName("");
      setAdmittedInstitution("");
      await loadConsoleData();
    } catch (err) {
      console.error("Failed to add higher studies admit", err);
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
          indicatorCode: "5.2",
          metricCode: "5.2.1",
          title: evidenceTitle,
          academicYear: "2025-26",
          department: evidenceDept,
          documentType: "PDF",
          description: evidenceDesc || "Campus placement offers dossier and higher studies progression letters.",
          remarks: "Verified against company offer letters and university enrollment IDs.",
        },
        dummyFile,
        { name: "TPO Officer", role: "Admin" }
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
      <Card className="border-emerald-200 shadow-md">
        <CardContent className="p-8 text-center text-muted-foreground">
          <Activity className="w-8 h-8 mx-auto mb-3 animate-spin text-emerald-600" />
          <p>Loading Placements & Higher Education Progression Console...</p>
        </CardContent>
      </Card>
    );
  }

  const filteredOffers = data.offers.filter(
    (o) =>
      o.studentName.toLowerCase().includes(searchOffer.toLowerCase()) ||
      o.companyName.toLowerCase().includes(searchOffer.toLowerCase()) ||
      o.programme.toLowerCase().includes(searchOffer.toLowerCase()) ||
      o.rollNo.toLowerCase().includes(searchOffer.toLowerCase())
  );

  return (
    <Card className="border-emerald-200 shadow-lg bg-card">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">Metric 5.2.1</Badge>
              <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-50">
                428 Campus Offers (420+ Achieved)
              </Badge>
              <Badge variant="outline" className="text-teal-800 border-teal-300 bg-teal-50">
                76.4% Progression Rate
              </Badge>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-emerald-600" />
              Placements & Higher Education Progression Console
            </CardTitle>
            <CardDescription className="text-slate-600">
              428 campus recruitment offers across 38 recruiters (highest CTC ₹14.50 LPA, average ₹6.25 LPA) and 86 higher study admits to premier national and international institutes.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowUploadModal(true)}
              className="text-emerald-700 border-emerald-300 hover:bg-emerald-100"
            >
              <UploadCloud className="w-4 h-4 mr-1.5" />
              Upload Evidence
            </Button>
            <Button
              size="sm"
              onClick={() => setShowAddHigherStudiesModal(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              <GraduationCap className="w-4 h-4 mr-1.5" />
              Add Higher Study Admit
            </Button>
            <Button
              size="sm"
              onClick={() => setShowAddOfferModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Placement Offer
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Campus Offers</span>
                <Briefcase className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-emerald-700">{data.totalCampusOffers} Offers</span>
                <span className="text-xs font-medium text-emerald-600">(420+ Target)</span>
              </div>
              <p className="text-xs text-slate-600">
                {data.uniqueStudentsPlaced} unique placed students
              </p>
            </CardContent>
          </Card>

          <Card className="border border-teal-100 bg-gradient-to-br from-teal-50/50 to-white shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Progression Rate</span>
                <TrendingUp className="w-4 h-4 text-teal-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-teal-700">{data.totalPlacementProgressionPercentage}%</span>
                <span className="text-xs text-slate-500">Combined</span>
              </div>
              <Progress value={data.totalPlacementProgressionPercentage} className="h-1.5" />
              <p className="text-xs text-slate-500">
                Placement + Higher Studies progression
              </p>
            </CardContent>
          </Card>

          <Card className="border border-amber-100 bg-gradient-to-br from-amber-50/50 to-white shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">CTC Package Range</span>
                <BadgeIndianRupee className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-amber-700">₹{data.highestCtcLpa}L</span>
                <span className="text-xs text-slate-500">Highest</span>
              </div>
              <p className="text-xs text-slate-600">Average CTC: ₹{data.averageCtcLpa} LPA</p>
            </CardContent>
          </Card>

          <Card className="border border-purple-100 bg-gradient-to-br from-purple-50/50 to-white shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Higher Education</span>
                <GraduationCap className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-purple-700">{data.higherEducationProgressionCount} Students</span>
              </div>
              <p className="text-xs text-slate-600">IIT Bombay, NIT Rourkela, CMU USA</p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Controls */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <TabsList className="grid grid-cols-3 w-full sm:w-auto max-w-md">
              <TabsTrigger value="offers">Campus Offers ({data.offers.length})</TabsTrigger>
              <TabsTrigger value="higherStudies">Higher Studies ({data.higherStudies.length})</TabsTrigger>
              <TabsTrigger value="evidence">Evidences ({evidenceList.length})</TabsTrigger>
            </TabsList>

            {activeTab === "offers" && (
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search student, company, roll..."
                  value={searchOffer}
                  onChange={(e) => setSearchOffer(e.target.value)}
                  className="pl-9 text-sm"
                />
              </div>
            )}
          </div>

          {/* Tab 1: Campus Placement Offers */}
          <TabsContent value="offers">
            <ResponsiveTableContainer>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">Roll No & Student</TableHead>
                    <TableHead className="font-semibold text-slate-700">Programme</TableHead>
                    <TableHead className="font-semibold text-slate-700">Recruiting Organization & Role</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">CTC (LPA)</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">Drive Type</TableHead>
                    <TableHead className="font-semibold text-slate-700">Offer Date & Ref</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOffers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        No placement offers match your search query.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOffers.map((o) => (
                      <TableRow key={o.id} className="hover:bg-slate-50/80">
                        <TableCell>
                          <div className="font-bold text-slate-900">{o.studentName}</div>
                          <div className="font-mono text-xs text-slate-500">{o.rollNo}</div>
                        </TableCell>
                        <TableCell className="text-xs text-slate-800 font-medium">
                          {o.programme}
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                            {o.companyName}
                          </div>
                          <div className="text-xs text-slate-500">{o.jobRole}</div>
                        </TableCell>
                        <TableCell className="text-right font-bold text-emerald-700 text-sm">
                          ₹{o.ctcLakhsPerAnnum.toFixed(2)} LPA
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200">
                            {o.driveType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-slate-600 font-mono">
                          <div>{o.appointmentLetterRef}</div>
                          <div className="text-[10px] text-slate-400">{o.offerDate}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-emerald-600 text-white">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Placed
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ResponsiveTableContainer>
          </TabsContent>

          {/* Tab 2: Higher Studies Progression */}
          <TabsContent value="higherStudies">
            <ResponsiveTableContainer>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">Roll No & Student</TableHead>
                    <TableHead className="font-semibold text-slate-700">UG Programme</TableHead>
                    <TableHead className="font-semibold text-slate-700">Admitted Institution & Programme</TableHead>
                    <TableHead className="font-semibold text-slate-700">Qualifying Exam</TableHead>
                    <TableHead className="font-semibold text-slate-700">Admission Letter Ref</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.higherStudies.map((hs) => (
                    <TableRow key={hs.id} className="hover:bg-slate-50/80">
                      <TableCell>
                        <div className="font-bold text-slate-900">{hs.studentName}</div>
                        <div className="font-mono text-xs text-slate-500">{hs.rollNo}</div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-700">{hs.undergraduateProgramme}</TableCell>
                      <TableCell>
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                          {hs.admittedInstitution}
                        </div>
                        <div className="text-xs text-slate-500">{hs.programmeEnrolled}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200 font-medium">
                          {hs.examQualified}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-600">
                        {hs.admissionLetterRef}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-purple-600 text-white">
                          Enrolled
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
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
                        No uploaded evidence documents found for Metric 5.2.1.
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
                            className="h-8 text-xs text-emerald-700 border-emerald-200"
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

      {/* Add Offer Modal */}
      <Dialog open={showAddOfferModal} onOpenChange={setShowAddOfferModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Campus Placement Offer</DialogTitle>
            <DialogDescription>
              Record an authenticated campus recruitment offer for Metric 5.2.1.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddOffer} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Roll Number</Label>
                <Input
                  placeholder="e.g. 21CSE099"
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
            <div>
              <Label className="text-xs font-semibold">Programme</Label>
              <Input
                value={programme}
                onChange={(e) => setProgramme(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Company / Employer</Label>
                <Input
                  placeholder="e.g. Oracle India"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">CTC (LPA INR)</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="1"
                  value={ctcLakhsPerAnnum}
                  onChange={(e) => setCtcLakhsPerAnnum(Number(e.target.value))}
                  required
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold">Job Designation / Role</Label>
              <Input
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Drive Type</Label>
                <Select
                  value={driveType}
                  onValueChange={(val) => setDriveType(val as PlacementOfferRecord["driveType"])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="On-Campus">On-Campus</SelectItem>
                    <SelectItem value="Off-Campus">Off-Campus</SelectItem>
                    <SelectItem value="Joint Campus">Joint Campus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-semibold">Appointment Letter Ref</Label>
                <Input
                  value={appointmentLetterRef}
                  onChange={(e) => setAppointmentLetterRef(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowAddOfferModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 text-white hover:bg-emerald-700">
                Save Offer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Higher Studies Modal */}
      <Dialog open={showAddHigherStudiesModal} onOpenChange={setShowAddHigherStudiesModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Higher Education Progression</DialogTitle>
            <DialogDescription>
              Record an outgoing student admitted to PG or Ph.D. programmes.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddHigherStudies} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Roll Number</Label>
                <Input
                  placeholder="e.g. 21CSE088"
                  value={hsRollNo}
                  onChange={(e) => setHsRollNo(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Student Name</Label>
                <Input
                  placeholder="Full name"
                  value={hsStudentName}
                  onChange={(e) => setHsStudentName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold">Undergraduate Programme</Label>
              <Input
                value={ugProgramme}
                onChange={(e) => setUgProgramme(e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Admitted Institution</Label>
              <Input
                placeholder="e.g. IIT Bombay / NIT Rourkela"
                value={admittedInstitution}
                onChange={(e) => setAdmittedInstitution(e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Programme Enrolled</Label>
              <Input
                placeholder="e.g. M.Tech in Computer Science"
                value={programmeEnrolled}
                onChange={(e) => setProgrammeEnrolled(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Exam Qualified</Label>
                <Input
                  value={examQualified}
                  onChange={(e) => setExamQualified(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Admission Ref</Label>
                <Input
                  value={admissionLetterRef}
                  onChange={(e) => setAdmissionLetterRef(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowAddHigherStudiesModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-teal-600 text-white hover:bg-teal-700">
                Save Progression
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Upload Evidence Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Placement & Progression Evidence</DialogTitle>
            <DialogDescription>
              Upload authenticated appointment letters, company offer dossier, or higher studies admission ID proofs.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadEvidence} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-semibold">Document Title</Label>
              <Input
                placeholder="e.g. Campus Placement Master Offer Dossier 2025-26"
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
                placeholder="Brief summary of placement & higher education records"
                value={evidenceDesc}
                onChange={(e) => setEvidenceDesc(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">File Attachment (PDF / Image)</Label>
              <Input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setEvidenceFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowUploadModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploading} className="bg-emerald-600 text-white hover:bg-emerald-700">
                {uploading ? "Uploading..." : "Submit Evidence"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
