import { useState, useEffect } from "react";
import {
  Handshake,
  Building2,
  TrendingUp,
  FileText,
  Search,
  Plus,
  ExternalLink,
  UploadCloud,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveTableContainer } from "@/components/admin/ResponsiveTableContainer";
import {
  getMouLinkagesData,
  addFunctionalMouRecord,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type {
  MouLinkagesData,
  FunctionalMouRecord,
  NaacEvidenceDocument,
} from "@/types";

interface FunctionalMousConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function FunctionalMousConsole({ onEvidenceUpdated }: FunctionalMousConsoleProps) {
  const [data, setData] = useState<MouLinkagesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [evidenceList, setEvidenceList] = useState<NaacEvidenceDocument[]>([]);
  const [activeTab, setActiveTab] = useState("mous");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCat, setFilterCat] = useState<string>("all");

  // Add MoU Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [mouTitle, setMouTitle] = useState("");
  const [partner, setPartner] = useState("");
  const [category, setCategory] = useState<FunctionalMouRecord["category"]>("Corporate / Industry");
  const [signDate, setSignDate] = useState("2025-02-10");
  const [validity, setValidity] = useState("3 Years");
  const [coordinator, setCoordinator] = useState("Dr. Rashmita Mishra");
  const [dept, setDept] = useState("Computer Science");
  const [activitiesCount, setActivitiesCount] = useState(4);
  const [activitiesSummary, setActivitiesSummary] = useState("Student internships, technical workshops, and joint training.");

  // Upload Evidence Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDept, setEvidenceDept] = useState("Industry Linkage Cell");
  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadConsoleData();
  }, []);

  async function loadConsoleData() {
    setLoading(true);
    try {
      const [mouData, evidences] = await Promise.all([
        getMouLinkagesData(),
        getEvidenceForMetric("3.7.1"),
      ]);
      setData(mouData);
      setEvidenceList(evidences);
    } catch (err) {
      console.error("Failed to load MoU data", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredMous = (data?.mous || []).filter((m) => {
    const matchesSearch =
      m.partnerInstitutionOrIndustry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.mouTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.nodalFacultyCoordinator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCat === "all" || m.category === filterCat;
    return matchesSearch && matchesCat;
  });

  async function handleAddMou(e: React.FormEvent) {
    e.preventDefault();
    if (!mouTitle || !partner) return;

    try {
      await addFunctionalMouRecord(
        {
          mouTitle,
          partnerInstitutionOrIndustry: partner,
          category,
          dateOfSigning: signDate,
          validityPeriod: validity,
          validTill: "2028-02-09",
          nodalFacultyCoordinator: coordinator,
          department: dept,
          activeStatus: "Active",
          activitiesCompletedCount: Number(activitiesCount),
          recentActivitiesSummary: activitiesSummary,
          mouDocumentUrl: "https://documents.eduplatform.ac.in/mou/Agreement.pdf",
        },
        { name: "Dr. Snigdha Mohanty", role: "IQAC Coordinator" }
      );

      setShowAddModal(false);
      setMouTitle("");
      setPartner("");
      loadConsoleData();
    } catch (err) {
      console.error("Failed to add MoU", err);
    }
  }

  async function handleUploadEvidence(e: React.FormEvent) {
    e.preventDefault();
    if (!evidenceTitle) return;

    setUploading(true);
    try {
      await uploadEvidenceDocument(
        {
          criterionId: 3,
          indicatorCode: "3.7",
          metricCode: "3.7.1",
          title: evidenceTitle,
          academicYear: "2025-26",
          department: evidenceDept,
          documentType: "PDF",
          description: evidenceDesc || "MoU master register and collaborative activity execution reports.",
          remarks: "Signed legal deed and activity log attached.",
          fileName: evidenceFile?.name || `${evidenceTitle.replace(/\s+/g, "_")}.pdf`,
          fileSize: evidenceFile ? `${(evidenceFile.size / (1024 * 1024)).toFixed(1)} MB` : "5.4 MB",
          evidenceUrl: `/documents/naac/evidence/FunctionalMoUs_${Date.now()}.pdf`,
        },
        { name: "Dr. Snigdha Mohanty", role: "IQAC Coordinator" }
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
      <Card className="border-sky-200 bg-white/70 backdrop-blur">
        <CardContent className="p-12 text-center text-muted-foreground">
          <div className="animate-spin w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full mx-auto mb-4" />
          Loading Functional MoUs & Collaborations Console...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Card */}
      <Card className="border-2 border-sky-300 bg-gradient-to-br from-sky-50/80 via-white to-blue-50/70 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-sky-700 text-white hover:bg-sky-800">
                  NAAC Metric 3.7.1
                </Badge>
                <Badge variant="outline" className="text-sky-800 border-sky-300">
                  Functional MoUs & Linkages
                </Badge>
                <Badge className="bg-emerald-600 text-white">Weightage: 15 Marks</Badge>
              </div>
              <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Handshake className="w-6 h-6 text-sky-600" />
                Functional MoUs, Research Collaborations & Linkages
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Institutional partnerships across premier academic bodies (IIT Bhubaneswar, CSIR-IMMT, ILS), industry corporations (Infosys, NALCO, TCS), and community organizations.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                className="border-sky-300 text-sky-700 hover:bg-sky-50 text-xs sm:text-sm"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Record New MoU
              </Button>
              <Button
                className="bg-sky-700 hover:bg-sky-800 text-white text-xs sm:text-sm shadow-sm"
                onClick={() => setShowUploadModal(true)}
              >
                <UploadCloud className="w-4 h-4 mr-1.5" />
                Upload MoU Register
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Active Functional MoUs</span>
                <Handshake className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-3xl font-black text-sky-800 mt-1">
                {data.totalActiveMous}
              </div>
              <div className="text-xs text-emerald-600 font-medium mt-1">
                Benchmark: ≥ 10 MoUs (Achieved 160%)
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Academic & Lab MoUs</span>
                <Building2 className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-3xl font-black text-indigo-700 mt-1">
                {data.academicPartnerships}
              </div>
              <div className="text-xs text-gray-500 mt-1">IIT, CSIR-IMMT, ILS, Ravenshaw</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Industry MoUs</span>
                <Award className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-3xl font-black text-blue-700 mt-1">
                {data.industryPartnerships}
              </div>
              <div className="text-xs text-gray-500 mt-1">Infosys, NALCO, TCS, OSDMA</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Collaborative Activities</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-emerald-700 mt-1">
                {data.collaborativeActivitiesConducted}
              </div>
              <div className="text-xs text-emerald-600 font-medium mt-1">Internships, Visits, Joint Papers</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Layout */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-sm bg-gray-100 p-1">
          <TabsTrigger value="mous" className="text-xs sm:text-sm">
            MoU Directory ({data.mous.length})
          </TabsTrigger>
          <TabsTrigger value="evidence" className="text-xs sm:text-sm">
            Evidences ({evidenceList.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: MoUs Table */}
        <TabsContent value="mous" className="space-y-4 mt-4">
          <Card className="border border-sky-100 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-semibold text-gray-800">
                    Functional Institutional MoUs & Linkages Directory
                  </CardTitle>
                  <CardDescription>
                    All active formal partnership deeds, execution proofs, and faculty coordinators.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative w-48 sm:w-60">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-3 text-gray-400" />
                    <Input
                      placeholder="Search partner, title, coordinator..."
                      className="pl-8 text-xs h-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={filterCat} onValueChange={setFilterCat}>
                    <SelectTrigger className="w-44 text-xs h-9">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Academic / University">Academic / University</SelectItem>
                      <SelectItem value="Research Laboratory">Research Laboratory</SelectItem>
                      <SelectItem value="Corporate / Industry">Corporate / Industry</SelectItem>
                      <SelectItem value="Community / NGO">Community / NGO</SelectItem>
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
                      <TableHead className="font-semibold text-xs">Partner Organization & Purpose</TableHead>
                      <TableHead className="font-semibold text-xs">Category</TableHead>
                      <TableHead className="font-semibold text-xs">Signed & Validity</TableHead>
                      <TableHead className="font-semibold text-xs">Nodal Coordinator</TableHead>
                      <TableHead className="font-semibold text-xs text-center">Activities</TableHead>
                      <TableHead className="font-semibold text-xs text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMous.map((m) => (
                      <TableRow key={m.id} className="hover:bg-sky-50/30">
                        <TableCell>
                          <div className="font-bold text-xs text-gray-900">{m.partnerInstitutionOrIndustry}</div>
                          <div className="text-xs text-gray-600 mt-0.5 line-clamp-1">{m.mouTitle}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">{m.recentActivitiesSummary}</div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              m.category === "Corporate / Industry"
                                ? "border-blue-300 text-blue-800 bg-blue-50 text-[10px]"
                                : m.category === "Research Laboratory"
                                ? "border-purple-300 text-purple-800 bg-purple-50 text-[10px]"
                                : "text-[10px]"
                            }
                          >
                            {m.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-gray-600">
                          <div>{m.dateOfSigning}</div>
                          <div className="text-[10px] text-gray-400 font-mono">Valid: {m.validityPeriod} (Till {m.validTill})</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-medium text-gray-900">{m.nodalFacultyCoordinator}</div>
                          <div className="text-[10px] text-gray-500">{m.department}</div>
                        </TableCell>
                        <TableCell className="text-xs text-center font-bold text-sky-700">
                          {m.activitiesCompletedCount} Done
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">
                            {m.activeStatus}
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

        {/* Tab 2: Evidences */}
        <TabsContent value="evidence" className="space-y-4 mt-4">
          <Card className="border border-sky-100 shadow-xs">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-gray-800">
                  Evidentiary Documentation (Metric 3.7.1)
                </CardTitle>
                <CardDescription>
                  Signed MoU deeds, collaborative activity logs, and partner certificate proofs.
                </CardDescription>
              </div>
              <Button
                size="sm"
                className="bg-sky-700 hover:bg-sky-800 text-white text-xs"
                onClick={() => setShowUploadModal(true)}
              >
                <UploadCloud className="w-3.5 h-3.5 mr-1" />
                Upload MoU Deed
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {evidenceList.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl border border-gray-100 bg-white hover:border-sky-200 hover:shadow-xs transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-sky-50 text-sky-700 rounded-lg">
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
                        className="text-sky-700 font-medium hover:underline inline-flex items-center gap-1"
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

      {/* Add Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-sky-800">
              <Handshake className="w-5 h-5" />
              Record New Functional MoU
            </DialogTitle>
            <DialogDescription>
              Add formal institutional MoU deed and collaborative activity commitments.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddMou} className="space-y-3">
            <div>
              <Label className="text-xs">Partner Organization / Industry</Label>
              <Input
                className="text-xs h-9"
                required
                placeholder="e.g. Biocon Academy / CyberTech Solutions"
                value={partner}
                onChange={(e) => setPartner(e.target.value)}
              />
            </div>

            <div>
              <Label className="text-xs">Scope / Purpose of MoU</Label>
              <Input
                className="text-xs h-9"
                required
                placeholder="e.g. Bioprocess Training & Student Industrial Internships"
                value={mouTitle}
                onChange={(e) => setMouTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Category</Label>
                <Select
                  value={category}
                  onValueChange={(val: any) => setCategory(val)}
                >
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Academic / University">Academic / University</SelectItem>
                    <SelectItem value="Research Laboratory">Research Laboratory</SelectItem>
                    <SelectItem value="Corporate / Industry">Corporate / Industry</SelectItem>
                    <SelectItem value="Community / NGO">Community / NGO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Date of Signing</Label>
                <Input
                  type="date"
                  className="text-xs h-9"
                  value={signDate}
                  onChange={(e) => setSignDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Nodal Faculty Coordinator</Label>
                <Input
                  className="text-xs h-9"
                  required
                  value={coordinator}
                  onChange={(e) => setCoordinator(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">Department</Label>
                <Input
                  className="text-xs h-9"
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Validity Period</Label>
                <Input
                  className="text-xs h-9"
                  value={validity}
                  onChange={(e) => setValidity(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">Activities Executed</Label>
                <Input
                  type="number"
                  className="text-xs h-9"
                  value={activitiesCount}
                  onChange={(e) => setActivitiesCount(Number(e.target.value))}
                />
              </div>
            </div>

            <div>
              <Label className="text-xs">Activities Summary</Label>
              <Input
                className="text-xs h-9"
                value={activitiesSummary}
                onChange={(e) => setActivitiesSummary(e.target.value)}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                className="text-xs h-9"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-sky-700 hover:bg-sky-800 text-white text-xs h-9">
                Save MoU Record
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Upload Evidence Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-sky-800">
              <UploadCloud className="w-5 h-5" />
              Upload Functional MoU Deed / Activity Proof
            </DialogTitle>
            <DialogDescription>
              Attach signed MoU document, student internship certificates, or joint event reports.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadEvidence} className="space-y-3">
            <div>
              <Label className="text-xs">Document Title</Label>
              <Input
                className="text-xs h-9"
                required
                placeholder="e.g. Infosys Springboard MoU Deed 2024-27"
                value={evidenceTitle}
                onChange={(e) => setEvidenceTitle(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs">Department / Issuer</Label>
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
                placeholder="Brief summary of MoU terms and execution outcomes"
                value={evidenceDesc}
                onChange={(e) => setEvidenceDesc(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs">Select Document (PDF/XLSX)</Label>
              <Input
                type="file"
                className="text-xs h-9"
                accept=".pdf,.xlsx,.csv"
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
                className="bg-sky-700 hover:bg-sky-800 text-white text-xs h-9"
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
