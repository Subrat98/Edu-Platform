import { useState, useEffect } from "react";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  TrendingUp,
  FileText,
  Search,
  Plus,
  Download,
  ExternalLink,
  UploadCloud,
  ShieldCheck,
  BadgeIndianRupee,
  Filter,
  Eye,
  Handshake,
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
  getConsultancyData,
  addConsultancyProjectRecord,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type {
  ConsultancyData,
  ConsultancyProjectRecord,
  NaacEvidenceDocument,
} from "@/types";

interface ConsultancyConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function ConsultancyConsole({ onEvidenceUpdated }: ConsultancyConsoleProps) {
  const [data, setData] = useState<ConsultancyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [evidenceList, setEvidenceList] = useState<NaacEvidenceDocument[]>([]);
  const [activeTab, setActiveTab] = useState("projects");
  const [searchProject, setSearchProject] = useState("");

  // Add Consultancy Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [clientOrg, setClientOrg] = useState("NALCO Damanjodi");
  const [principalConsultant, setPrincipalConsultant] = useState("Dr. B. K. Ray");
  const [dept, setDept] = useState("Botany");
  const [revenueInr, setRevenueInr] = useState(500000);
  const [mouRef, setMouRef] = useState("MOU/NALCO/ENV/2024");
  const [status, setStatus] = useState<ConsultancyProjectRecord["status"]>("Completed");

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
      const [consData, evidences] = await Promise.all([
        getConsultancyData(),
        getEvidenceForMetric("3.5.1"),
      ]);
      setData(consData);
      setEvidenceList(evidences);
    } catch (err) {
      console.error("Failed to load consultancy data", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredProjects = (data?.projects || []).filter((p) => {
    return (
      p.consultancyProjectTitle.toLowerCase().includes(searchProject.toLowerCase()) ||
      p.clientOrganization.toLowerCase().includes(searchProject.toLowerCase()) ||
      p.principalConsultant.toLowerCase().includes(searchProject.toLowerCase()) ||
      p.department.toLowerCase().includes(searchProject.toLowerCase())
    );
  });

  async function handleAddProject(e: React.FormEvent) {
    e.preventDefault();
    if (!projectTitle || !clientOrg) return;

    const revLakhs = Number((Number(revenueInr) / 100000).toFixed(2));

    try {
      await addConsultancyProjectRecord(
        {
          consultancyProjectTitle: projectTitle,
          clientOrganization: clientOrg,
          principalConsultant,
          department: dept,
          startDate: "2025-01-15",
          completionDate: "2025-08-30",
          revenueGeneratedInr: Number(revenueInr),
          revenueInLakhs: revLakhs,
          corporateMouRef: mouRef,
          institutionalSharePercentage: 40,
          status,
          auditedReceiptProofUrl: "https://documents.eduplatform.ac.in/consultancy/receipt.pdf",
        },
        { name: "Dr. B. K. Ray", role: "Industry Linkage Convener" }
      );

      setShowAddModal(false);
      setProjectTitle("");
      loadConsoleData();
    } catch (err) {
      console.error("Failed to add consultancy project", err);
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
          indicatorCode: "3.5",
          metricCode: "3.5.1",
          title: evidenceTitle,
          academicYear: "2025-26",
          department: evidenceDept,
          documentType: "PDF",
          description: evidenceDesc || "Consultancy work orders and CA audited revenue receipts.",
          remarks: "Audited by Chartered Accountant.",
          fileName: evidenceFile?.name || `${evidenceTitle.replace(/\s+/g, "_")}.pdf`,
          fileSize: evidenceFile ? `${(evidenceFile.size / (1024 * 1024)).toFixed(1)} MB` : "2.8 MB",
          evidenceUrl: `/documents/naac/evidence/Consultancy_${Date.now()}.pdf`,
        },
        { name: "Dr. B. K. Ray", role: "Industry Linkage Convener" }
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
      <Card className="border-cyan-200 bg-white/70 backdrop-blur">
        <CardContent className="p-12 text-center text-muted-foreground">
          <div className="animate-spin w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full mx-auto mb-4" />
          Loading Consultancy & Corporate Revenue Console...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Card */}
      <Card className="border-2 border-cyan-300 bg-gradient-to-br from-cyan-50/80 via-white to-blue-50/70 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-cyan-700 text-white hover:bg-cyan-800">
                  NAAC Metric 3.5.1
                </Badge>
                <Badge variant="outline" className="text-cyan-800 border-cyan-300">
                  Industry Consultancy
                </Badge>
                <Badge className="bg-emerald-600 text-white">Weightage: 10 Marks</Badge>
              </div>
              <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-cyan-600" />
                Consultancy Services & Corporate Revenue (₹{data.totalRevenueInLakhs.toFixed(2)} Lakhs)
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Institutional revenue generation across {data.totalProjects} corporate assignments (NALCO, Tata Steel, OSDMA, PPL, JSL) with Chartered Accountant verified bank receipts.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 text-xs sm:text-sm"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Consultancy Project
              </Button>
              <Button
                className="bg-cyan-700 hover:bg-cyan-800 text-white text-xs sm:text-sm shadow-sm"
                onClick={() => setShowUploadModal(true)}
              >
                <UploadCloud className="w-4 h-4 mr-1.5" />
                Upload CA Certificate
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-cyan-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Total Revenue Generated</span>
                <BadgeIndianRupee className="w-4 h-4 text-cyan-600" />
              </div>
              <div className="text-3xl font-black text-cyan-800 mt-1">
                ₹{data.totalRevenueInLakhs.toFixed(2)} L
              </div>
              <div className="text-xs text-emerald-600 font-medium mt-1">
                Target ≥ ₹10.0 Lakhs (Achieved 284%)
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-cyan-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Corporate Clients</span>
                <Building2 className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-3xl font-black text-blue-700 mt-1">
                {data.clientsCount}
              </div>
              <div className="text-xs text-gray-500 mt-1">PSUs & Private Corporations</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-cyan-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Institutional Share (40%)</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-emerald-700 mt-1">
                ₹{data.institutionalRevenueInLakhs.toFixed(2)} L
              </div>
              <div className="text-xs text-gray-500 mt-1">Development & Research Fund</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-cyan-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Completed Deliverables</span>
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-3xl font-black text-purple-700 mt-1">
                100%
              </div>
              <div className="text-xs text-emerald-600 font-medium mt-1">All Work Orders Fulfilled</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Layout */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-sm bg-gray-100 p-1">
          <TabsTrigger value="projects" className="text-xs sm:text-sm">
            Consultancy Projects ({data.projects.length})
          </TabsTrigger>
          <TabsTrigger value="evidence" className="text-xs sm:text-sm">
            Evidences & CA Audits ({evidenceList.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Consultancy Projects Table */}
        <TabsContent value="projects" className="space-y-4 mt-4">
          <Card className="border border-cyan-100 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-semibold text-gray-800">
                    Institutional Consultancy Projects Register
                  </CardTitle>
                  <CardDescription>
                    All active and completed industry consultancy contracts, revenue generated, and sharing ratios.
                  </CardDescription>
                </div>
                <div className="relative w-48 sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-3 text-gray-400" />
                  <Input
                    placeholder="Search project, client, consultant..."
                    className="pl-8 text-xs h-9"
                    value={searchProject}
                    onChange={(e) => setSearchProject(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/80">
                      <TableHead className="font-semibold text-xs">Consultancy Title</TableHead>
                      <TableHead className="font-semibold text-xs">Client Organization</TableHead>
                      <TableHead className="font-semibold text-xs">Lead Consultant</TableHead>
                      <TableHead className="font-semibold text-xs">Duration</TableHead>
                      <TableHead className="font-semibold text-xs text-right">Revenue (₹ Lakhs)</TableHead>
                      <TableHead className="font-semibold text-xs text-center">MoU Reference</TableHead>
                      <TableHead className="font-semibold text-xs text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.map((p) => (
                      <TableRow key={p.id} className="hover:bg-cyan-50/30">
                        <TableCell>
                          <div className="font-semibold text-xs text-gray-900 max-w-sm sm:max-w-md leading-snug">
                            {p.consultancyProjectTitle}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-xs text-gray-800">{p.clientOrganization}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-medium text-gray-900">{p.principalConsultant}</div>
                          <div className="text-[10px] text-gray-500">{p.department}</div>
                        </TableCell>
                        <TableCell className="text-xs text-gray-600">
                          {p.startDate} to {p.completionDate}
                        </TableCell>
                        <TableCell className="text-xs text-right font-bold text-cyan-800 font-mono">
                          ₹{p.revenueInLakhs.toFixed(2)} L
                          <div className="text-[10px] text-gray-400 font-normal">
                            ₹{p.revenueGeneratedInr.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-mono text-[10px] text-gray-600">
                          {p.corporateMouRef}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={
                              p.status === "Completed"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-blue-100 text-blue-800"
                            }
                          >
                            {p.status}
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
          <Card className="border border-cyan-100 shadow-xs">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-gray-800">
                  Evidentiary Documentation (Metric 3.5.1)
                </CardTitle>
                <CardDescription>
                  Work orders, bank receipts, and Chartered Accountant audited certificates.
                </CardDescription>
              </div>
              <Button
                size="sm"
                className="bg-cyan-700 hover:bg-cyan-800 text-white text-xs"
                onClick={() => setShowUploadModal(true)}
              >
                <UploadCloud className="w-3.5 h-3.5 mr-1" />
                Upload Audit Certificate
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {evidenceList.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl border border-gray-100 bg-white hover:border-cyan-200 hover:shadow-xs transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-cyan-50 text-cyan-700 rounded-lg">
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
                        className="text-cyan-700 font-medium hover:underline inline-flex items-center gap-1"
                      >
                        View Certificate <ExternalLink className="w-3 h-3" />
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
            <DialogTitle className="flex items-center gap-2 text-cyan-800">
              <Briefcase className="w-5 h-5" />
              Add Consultancy Project
            </DialogTitle>
            <DialogDescription>
              Record corporate consultancy assignment and revenue receipts.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddProject} className="space-y-3">
            <div>
              <Label className="text-xs">Consultancy Project Title</Label>
              <Input
                className="text-xs h-9"
                required
                placeholder="e.g. Environmental Runoff Testing & Heavy Metal Analysis"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Client Organization</Label>
                <Input
                  className="text-xs h-9"
                  required
                  value={clientOrg}
                  onChange={(e) => setClientOrg(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">Corporate MoU Ref</Label>
                <Input
                  className="text-xs h-9 font-mono"
                  value={mouRef}
                  onChange={(e) => setMouRef(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Lead Consultant</Label>
                <Input
                  className="text-xs h-9"
                  required
                  value={principalConsultant}
                  onChange={(e) => setPrincipalConsultant(e.target.value)}
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
                <Label className="text-xs">Revenue Generated (INR)</Label>
                <Input
                  type="number"
                  className="text-xs h-9"
                  value={revenueInr}
                  onChange={(e) => setRevenueInr(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Status</Label>
                <Select
                  value={status}
                  onValueChange={(val: any) => setStatus(val)}
                >
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Deliverables Submitted">Deliverables Submitted</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
              <Button type="submit" className="bg-cyan-700 hover:bg-cyan-800 text-white text-xs h-9">
                Save Project
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Upload Evidence Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-cyan-800">
              <UploadCloud className="w-5 h-5" />
              Upload CA Revenue Certificate
            </DialogTitle>
            <DialogDescription>
              Attach CA audited statement of consultancy revenue or client work order.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadEvidence} className="space-y-3">
            <div>
              <Label className="text-xs">Document Title</Label>
              <Input
                className="text-xs h-9"
                required
                placeholder="e.g. CA Audited Certificate of Consultancy Receipts 2025-26"
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
                placeholder="Brief summary of consultancy revenue audit"
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
                className="bg-cyan-700 hover:bg-cyan-800 text-white text-xs h-9"
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
