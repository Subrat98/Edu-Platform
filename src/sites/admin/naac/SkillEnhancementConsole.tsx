import { useState, useEffect } from "react";
import {
  Sparkles,
  MessageSquare,
  HeartPulse,
  Laptop,
  FileText,
  Search,
  Plus,
  ExternalLink,
  UploadCloud,
  Activity,
  Users,
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
  getSkillEnhancementData,
  addSkillProgramme,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type {
  SkillEnhancementData,
  SkillProgrammeRecord,
  NaacEvidenceDocument,
} from "@/types";

interface SkillEnhancementConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function SkillEnhancementConsole({ onEvidenceUpdated }: SkillEnhancementConsoleProps) {
  const [data, setData] = useState<SkillEnhancementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [evidenceList, setEvidenceList] = useState<NaacEvidenceDocument[]>([]);
  const [activeTab, setActiveTab] = useState("programmes");
  const [searchProgramme, setSearchProgramme] = useState("");
  const [filterType, setFilterType] = useState<string>("All");

  // Add Programme Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [programmeTitle, setProgrammeTitle] = useState("");
  const [capabilityType, setCapabilityType] = useState<SkillProgrammeRecord["capabilityType"]>("Soft Skills");
  const [organizingDepartment] = useState("Training & Placement Cell");
  const [agencyOrTrainer, setAgencyOrTrainer] = useState("GTT Foundation & Barclays LifeSkills");
  const [startDate, setStartDate] = useState("2025-09-15");
  const [endDate, setEndDate] = useState("2025-09-25");
  const [durationHours, setDurationHours] = useState(30);
  const [enrolledStudentsCount, setEnrolledStudentsCount] = useState(150);
  const [certificatesIssuedCount, setCertificatesIssuedCount] = useState(145);
  const [outcomeSummary, setOutcomeSummary] = useState("Improved communication proficiency and teamwork.");

  // Upload Evidence Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDept, setEvidenceDept] = useState("Skill Development Cell");
  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadConsoleData();
  }, []);

  async function loadConsoleData() {
    setLoading(true);
    try {
      const [skillData, evidences] = await Promise.all([
        getSkillEnhancementData(),
        getEvidenceForMetric("5.1.2"),
      ]);
      setData(skillData);
      setEvidenceList(evidences);
    } catch (err) {
      console.error("Failed to load skill enhancement console data", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddProgramme(e: React.FormEvent) {
    e.preventDefault();
    if (!programmeTitle || !agencyOrTrainer) return;
    try {
      await addSkillProgramme(
        {
          programmeTitle,
          capabilityType,
          organizingDepartment,
          agencyOrTrainer,
          startDate,
          endDate,
          durationHours,
          enrolledStudentsCount,
          certificatesIssuedCount,
          outcomeSummary,
          reportUrl: "https://documents.eduplatform.ac.in/naac/5.1.2/sample_report.pdf",
        },
        { name: "Skill Development Convener", role: "Admin" }
      );
      setShowAddModal(false);
      setProgrammeTitle("");
      setOutcomeSummary("");
      await loadConsoleData();
    } catch (err) {
      console.error("Failed to add skill programme", err);
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
          metricCode: "5.1.2",
          title: evidenceTitle,
          academicYear: "2025-26",
          department: evidenceDept,
          documentType: "PDF",
          description: evidenceDesc || "Capability enhancement attendance sheets and completion certificates.",
          remarks: "Verified across all 4 mandatory NAAC capability pillars.",
        },
        dummyFile,
        { name: "Skill Coordinator", role: "Admin" }
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
      <Card className="border-amber-200 shadow-md">
        <CardContent className="p-8 text-center text-muted-foreground">
          <Activity className="w-8 h-8 mx-auto mb-3 animate-spin text-amber-600" />
          <p>Loading Capacity Building & Skills Development Console...</p>
        </CardContent>
      </Card>
    );
  }

  const filteredProgrammes = data.programmes.filter((p) => {
    const matchesSearch =
      p.programmeTitle.toLowerCase().includes(searchProgramme.toLowerCase()) ||
      p.agencyOrTrainer.toLowerCase().includes(searchProgramme.toLowerCase()) ||
      p.organizingDepartment.toLowerCase().includes(searchProgramme.toLowerCase());
    const matchesFilter = filterType === "All" || p.capabilityType === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <Card className="border-amber-200 shadow-lg bg-card">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-600 text-white hover:bg-amber-700">Metric 5.1.2</Badge>
              <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-50">
                All 4 Domains Covered
              </Badge>
              <Badge variant="outline" className="text-orange-700 border-orange-300 bg-orange-50">
                1,860 Students Benefited
              </Badge>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-600" />
              Capacity Building & Skills Development Console
            </CardTitle>
            <CardDescription className="text-slate-600">
              Institutional initiatives covering Soft Skills, Language & Communication (60-PC Language Lab), Life Skills (Yoga & Wellness), and ICT/Computing Skills.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowUploadModal(true)}
              className="text-amber-700 border-amber-300 hover:bg-amber-100"
            >
              <UploadCloud className="w-4 h-4 mr-1.5" />
              Upload Evidence
            </Button>
            <Button
              size="sm"
              onClick={() => setShowAddModal(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Skill Programme
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* 4 Pillars Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">1. Soft Skills</span>
                <Users className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-indigo-700">420 Students</span>
              </div>
              <p className="text-xs text-slate-600">Barclays LifeSkills & GD Bootcamps</p>
            </CardContent>
          </Card>

          <Card className="border border-blue-100 bg-gradient-to-br from-blue-50/50 to-white shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">2. Language & Comm.</span>
                <MessageSquare className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-blue-700">380 Students</span>
              </div>
              <p className="text-xs text-slate-600">60-Seat Digital Language Lab & IELTS</p>
            </CardContent>
          </Card>

          <Card className="border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">3. Life Skills (Yoga)</span>
                <HeartPulse className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-emerald-700">520 Students</span>
              </div>
              <p className="text-xs text-slate-600">4 Certified Yoga Trainers & Health Outreach</p>
            </CardContent>
          </Card>

          <Card className="border border-purple-100 bg-gradient-to-br from-purple-50/50 to-white shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">4. ICT / Computing</span>
                <Laptop className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-purple-700">540 Students</span>
              </div>
              <p className="text-xs text-slate-600">NASSCOM & Microsoft Power BI Cohorts</p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Controls & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <TabsList className="grid grid-cols-2 w-full sm:w-auto max-w-xs">
                <TabsTrigger value="programmes">Programmes ({data.programmes.length})</TabsTrigger>
                <TabsTrigger value="evidence">Evidences ({evidenceList.length})</TabsTrigger>
              </TabsList>

              {activeTab === "programmes" && (
                <div className="flex flex-wrap items-center gap-2">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-44 text-xs h-9">
                      <SelectValue placeholder="Filter by Domain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All 4 Domains</SelectItem>
                      <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                      <SelectItem value="Language & Communication">Language & Comm.</SelectItem>
                      <SelectItem value="Life Skills (Yoga/Wellness)">Life Skills (Yoga)</SelectItem>
                      <SelectItem value="ICT / Computing Skills">ICT / Computing</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="relative w-full sm:w-60">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Search programme, trainer..."
                      value={searchProgramme}
                      onChange={(e) => setSearchProgramme(e.target.value)}
                      className="pl-9 text-xs h-9"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Tab 1: Programmes Directory */}
            <TabsContent value="programmes">
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-semibold text-slate-700">Programme Title & Domain</TableHead>
                      <TableHead className="font-semibold text-slate-700">Organizing Dept & Partner</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-center">Duration</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-center">Students Enrolled / Certified</TableHead>
                      <TableHead className="font-semibold text-slate-700">Learning Outcome</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProgrammes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No skill development programmes match your filter criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProgrammes.map((p) => (
                        <TableRow key={p.id} className="hover:bg-slate-50/80">
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                p.capabilityType === "Soft Skills"
                                  ? "bg-indigo-50 text-indigo-700 border-indigo-200 mb-1"
                                  : p.capabilityType === "Language & Communication"
                                  ? "bg-blue-50 text-blue-700 border-blue-200 mb-1"
                                  : p.capabilityType === "Life Skills (Yoga/Wellness)"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 mb-1"
                                  : "bg-purple-50 text-purple-700 border-purple-200 mb-1"
                              }
                            >
                              {p.capabilityType}
                            </Badge>
                            <div className="font-semibold text-slate-900">{p.programmeTitle}</div>
                            <div className="text-[11px] text-slate-500">
                              {p.startDate} to {p.endDate}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs font-medium text-slate-800">{p.organizingDepartment}</div>
                            <div className="text-[11px] text-slate-500">{p.agencyOrTrainer}</div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary" className="font-mono text-xs">
                              {p.durationHours} Hours
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="text-xs font-bold text-slate-800">
                              {p.certificatesIssuedCount} / {p.enrolledStudentsCount}
                            </div>
                            <Progress
                              value={(p.certificatesIssuedCount / p.enrolledStudentsCount) * 100}
                              className="h-1.5 max-w-[80px] mx-auto mt-1"
                            />
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {((p.certificatesIssuedCount / p.enrolledStudentsCount) * 100).toFixed(0)}% completion
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs text-slate-600 max-w-xs truncate" title={p.outcomeSummary}>
                              {p.outcomeSummary}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs text-amber-700 hover:text-amber-900"
                              onClick={() => window.open(p.reportUrl, "_blank")}
                            >
                              <FileText className="w-3.5 h-3.5 mr-1" />
                              Report
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ResponsiveTableContainer>
            </TabsContent>

            {/* Tab 2: Statutory Evidences */}
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
                          No uploaded evidence documents found for Metric 5.1.2.
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
                              className="h-8 text-xs text-amber-700 border-amber-200"
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
        </div>
      </CardContent>

      {/* Add Programme Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Register Capability Enhancement Programme</DialogTitle>
            <DialogDescription>
              Record a workshop or training programme under the 4 statutory NAAC capability domains.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddProgramme} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-semibold">Capability Enhancement Domain</Label>
              <Select
                value={capabilityType}
                onValueChange={(val) => setCapabilityType(val as SkillProgrammeRecord["capabilityType"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Soft Skills">1. Soft Skills</SelectItem>
                  <SelectItem value="Language & Communication">2. Language & Communication</SelectItem>
                  <SelectItem value="Life Skills (Yoga/Wellness)">3. Life Skills (Yoga & Wellness)</SelectItem>
                  <SelectItem value="ICT / Computing Skills">4. ICT / Computing Skills</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold">Programme Title</Label>
              <Input
                placeholder="e.g. Advanced English Phonetics & IELTS Prep"
                value={programmeTitle}
                onChange={(e) => setProgrammeTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">External Resource Agency / Trainer</Label>
              <Input
                placeholder="e.g. British Council / Orell Solutions"
                value={agencyOrTrainer}
                onChange={(e) => setAgencyOrTrainer(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Start Date</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">End Date</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs font-semibold">Hours</Label>
                <Input
                  type="number"
                  min="5"
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Enrolled</Label>
                <Input
                  type="number"
                  min="1"
                  value={enrolledStudentsCount}
                  onChange={(e) => setEnrolledStudentsCount(Number(e.target.value))}
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Certified</Label>
                <Input
                  type="number"
                  min="0"
                  value={certificatesIssuedCount}
                  onChange={(e) => setCertificatesIssuedCount(Number(e.target.value))}
                  required
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold">Key Learning Outcome</Label>
              <Input
                placeholder="Summary of skill enhancements observed"
                value={outcomeSummary}
                onChange={(e) => setOutcomeSummary(e.target.value)}
                required
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-amber-600 text-white hover:bg-amber-700">
                Save Programme
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Upload Evidence Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Skill Development Evidence</DialogTitle>
            <DialogDescription>
              Upload brochures, participant attendance registers, or certificates for Metric 5.1.2.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadEvidence} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-semibold">Document Title</Label>
              <Input
                placeholder="e.g. Soft Skills & Language Lab Attendance Register"
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
                placeholder="Brief summary of event logs and certificates"
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
              <Button type="submit" disabled={uploading} className="bg-amber-600 text-white hover:bg-amber-700">
                {uploading ? "Uploading..." : "Submit Evidence"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
