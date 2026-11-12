import { useState, useEffect } from "react";
import {
  Building2,
  CheckCircle2,
  FileText,
  Search,
  Plus,
  ExternalLink,
  UploadCloud,
  ShieldCheck,
  BadgeIndianRupee,
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
  getResearchFundingData,
  addResearchGrantRecord,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type {
  ResearchFundingData,
  ResearchGrantRecord,
  NaacEvidenceDocument,
} from "@/types";

interface ResearchFundingConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function ResearchFundingConsole({ onEvidenceUpdated }: ResearchFundingConsoleProps) {
  const [data, setData] = useState<ResearchFundingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [evidenceList, setEvidenceList] = useState<NaacEvidenceDocument[]>([]);
  const [activeTab, setActiveTab] = useState("projects");
  const [searchProject, setSearchProject] = useState("");
  const [filterAgency, setFilterAgency] = useState<string>("all");

  // Add Grant Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [projCode, setProjCode] = useState("");
  const [projTitle, setProjTitle] = useState("");
  const [piName, setPiName] = useState("Dr. Rashmita Mishra");
  const [piDept, setPiDept] = useState("Computer Science");
  const [fundingAgency, setFundingAgency] = useState("DST-SERB");
  const [agencyType, setAgencyType] = useState<ResearchGrantRecord["agencyType"]>("Government (Central/State)");
  const [sanctionNumber, setSanctionNumber] = useState("");
  const [sanctionDate, setSanctionDate] = useState("2025-04-10");
  const [durationMonths] = useState(36);
  const [sanctionedLakhs, setSanctionedLakhs] = useState(25.0);
  const [receivedLakhs, setReceivedLakhs] = useState(15.0);

  // Upload Evidence Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDept, setEvidenceDept] = useState("R&D Cell");
  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadConsoleData();
  }, []);

  async function loadConsoleData() {
    setLoading(true);
    try {
      const [fundData, evidences] = await Promise.all([
        getResearchFundingData(),
        getEvidenceForMetric("3.1.1"),
      ]);
      setData(fundData);
      setEvidenceList(evidences);
    } catch (err) {
      console.error("Failed to load research funding data", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredProjects = (data?.projects || []).filter((p) => {
    const matchesSearch =
      p.projectTitle.toLowerCase().includes(searchProject.toLowerCase()) ||
      p.principalInvestigator.toLowerCase().includes(searchProject.toLowerCase()) ||
      p.fundingAgency.toLowerCase().includes(searchProject.toLowerCase()) ||
      p.projectCode.toLowerCase().includes(searchProject.toLowerCase());
    const matchesAgency = filterAgency === "all" || p.agencyType === filterAgency;
    return matchesSearch && matchesAgency;
  });

  async function handleAddGrant(e: React.FormEvent) {
    e.preventDefault();
    if (!projTitle || !fundingAgency) return;

    try {
      await addResearchGrantRecord(
        {
          projectCode: projCode || `GRANT-${Date.now()}`,
          projectTitle: projTitle,
          principalInvestigator: piName,
          piDepartment: piDept,
          fundingAgency,
          agencyType,
          sanctionOrderNumber: sanctionNumber || "SAN/2025/001",
          sanctionDate,
          durationMonths: Number(durationMonths),
          sanctionedAmountLakhs: Number(sanctionedLakhs),
          receivedAmountLakhs: Number(receivedLakhs),
          status: "Ongoing",
          utilizationCertificateAudited: true,
          documentUrl: "https://documents.eduplatform.ac.in/research/SanctionLetter.pdf",
        },
        { name: "Dr. Rashmita Mishra", role: "Dean Research" }
      );

      setShowAddModal(false);
      resetAddForm();
      loadConsoleData();
    } catch (err) {
      console.error("Failed to add research grant", err);
    }
  }

  function resetAddForm() {
    setProjCode("");
    setProjTitle("");
    setSanctionNumber("");
    setSanctionedLakhs(25.0);
    setReceivedLakhs(15.0);
  }

  async function handleUploadEvidence(e: React.FormEvent) {
    e.preventDefault();
    if (!evidenceTitle) return;

    setUploading(true);
    try {
      await uploadEvidenceDocument(
        {
          criterionId: 3,
          indicatorCode: "3.1",
          metricCode: "3.1.1",
          title: evidenceTitle,
          academicYear: "2025-26",
          department: evidenceDept,
          documentType: "PDF",
          description: evidenceDesc || "Sanction order and audited UC for research funding.",
          remarks: "Chartered Accountant audited statement attached.",
          fileName: evidenceFile?.name || `${evidenceTitle.replace(/\s+/g, "_")}.pdf`,
          fileSize: evidenceFile ? `${(evidenceFile.size / (1024 * 1024)).toFixed(1)} MB` : "3.5 MB",
          evidenceUrl: `/documents/naac/evidence/ResearchGrant_${Date.now()}.pdf`,
        },
        { name: "Dr. Rashmita Mishra", role: "Dean Research" }
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
      <Card className="border-purple-200 bg-white/70 backdrop-blur">
        <CardContent className="p-12 text-center text-muted-foreground">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4" />
          Loading Grants & Research Mobilization Console...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Card */}
      <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50/80 via-white to-fuchsia-50/70 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-purple-700 text-white hover:bg-purple-800">
                  NAAC Metric 3.1.1
                </Badge>
                <Badge variant="outline" className="text-purple-700 border-purple-300">
                  Resource Mobilization
                </Badge>
                <Badge className="bg-emerald-600 text-white">Weightage: 20 Marks</Badge>
              </div>
              <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <BadgeIndianRupee className="w-6 h-6 text-purple-600" />
                Grants & Mobilization for Research (₹{data.totalSanctionedAmountLakhs.toFixed(2)} Lakhs)
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Central & State government sponsored research grants (DST, CSIR, UGC, ICSSR) with Chartered Accountant audited Utilization Certificates (UC).
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50 text-xs sm:text-sm"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Record Grant Project
              </Button>
              <Button
                className="bg-purple-700 hover:bg-purple-800 text-white text-xs sm:text-sm shadow-sm"
                onClick={() => setShowUploadModal(true)}
              >
                <UploadCloud className="w-4 h-4 mr-1.5" />
                Attach Sanction / UC
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Total Grants Mobilized</span>
                <BadgeIndianRupee className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-purple-800 mt-1">
                ₹{data.totalSanctionedAmountLakhs.toFixed(2)} L
              </div>
              <div className="text-xs text-emerald-600 font-medium mt-1">
                Benchmark: ≥ ₹50.0 Lakhs (Exceeded by 185%)
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Active Research Projects</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">
                {data.projects.length}
              </div>
              <div className="text-xs text-gray-500 mt-1">DST, CSIR, UGC, ICSSR Sponsored</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>CA Audited UCs</span>
                <ShieldCheck className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-blue-700 mt-1">
                {data.auditedUcSubmissionRate}%
              </div>
              <div className="text-xs text-emerald-600 font-medium mt-1">GFR-12A Stamped by Auditor</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Funding Agencies</span>
                <Building2 className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-indigo-700 mt-1">
                {data.govtAgenciesCount + data.nonGovtAgenciesCount}
              </div>
              <div className="text-xs text-gray-500 mt-1">4 Central Govt & 1 Statutory</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Layout */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-sm bg-gray-100 p-1">
          <TabsTrigger value="projects" className="text-xs sm:text-sm">
            Research Grants ({data.projects.length})
          </TabsTrigger>
          <TabsTrigger value="evidence" className="text-xs sm:text-sm">
            Evidences & UCs ({evidenceList.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Sponsored Projects Table */}
        <TabsContent value="projects" className="space-y-4 mt-4">
          <Card className="border border-purple-100 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-semibold text-gray-800">
                    Sponsored Research Projects Register (FY 2025-26)
                  </CardTitle>
                  <CardDescription>
                    Official sanctioned research projects with sanction orders, investigators, and amounts.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative w-48 sm:w-60">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-3 text-gray-400" />
                    <Input
                      placeholder="Search title, agency, PI..."
                      className="pl-8 text-xs h-9"
                      value={searchProject}
                      onChange={(e) => setSearchProject(e.target.value)}
                    />
                  </div>
                  <Select value={filterAgency} onValueChange={setFilterAgency}>
                    <SelectTrigger className="w-44 text-xs h-9">
                      <SelectValue placeholder="Agency Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Funding Types</SelectItem>
                      <SelectItem value="Government (Central/State)">Government (Central/State)</SelectItem>
                      <SelectItem value="Statutory Body">Statutory Body</SelectItem>
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
                      <TableHead className="font-semibold text-xs">Project Code & Title</TableHead>
                      <TableHead className="font-semibold text-xs">Principal Investigator (PI)</TableHead>
                      <TableHead className="font-semibold text-xs">Funding Agency</TableHead>
                      <TableHead className="font-semibold text-xs">Sanction Ref & Date</TableHead>
                      <TableHead className="font-semibold text-xs text-right">Sanctioned (₹ Lakhs)</TableHead>
                      <TableHead className="font-semibold text-xs text-right">Received (₹ Lakhs)</TableHead>
                      <TableHead className="font-semibold text-xs text-center">CA Audited UC</TableHead>
                      <TableHead className="font-semibold text-xs text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.map((proj) => (
                      <TableRow key={proj.id} className="hover:bg-purple-50/30">
                        <TableCell>
                          <div className="font-semibold text-xs text-gray-900 max-w-xs sm:max-w-md leading-snug">
                            {proj.projectTitle}
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono mt-0.5">{proj.projectCode}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-xs text-gray-900">{proj.principalInvestigator}</div>
                          <div className="text-[10px] text-gray-500">{proj.piDepartment}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] font-medium text-purple-700 border-purple-200">
                            {proj.fundingAgency}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-gray-600">
                          <div className="font-mono text-[10px]">{proj.sanctionOrderNumber}</div>
                          <div className="text-[10px] text-gray-400">{proj.sanctionDate}</div>
                        </TableCell>
                        <TableCell className="text-xs text-right font-bold text-purple-800">
                          ₹{proj.sanctionedAmountLakhs.toFixed(2)} L
                        </TableCell>
                        <TableCell className="text-xs text-right text-gray-700">
                          ₹{proj.receivedAmountLakhs.toFixed(2)} L
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-emerald-100 text-emerald-800 text-[10px] font-medium flex items-center justify-center gap-1 w-fit mx-auto">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Verified
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-blue-100 text-blue-800 text-[10px]">
                            {proj.status}
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
          <Card className="border border-purple-100 shadow-xs">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-gray-800">
                  Evidentiary Documentation (Metric 3.1.1)
                </CardTitle>
                <CardDescription>
                  Sanction letters, GFR-12A utilization certificates, and CA audit statements.
                </CardDescription>
              </div>
              <Button
                size="sm"
                className="bg-purple-700 hover:bg-purple-800 text-white text-xs"
                onClick={() => setShowUploadModal(true)}
              >
                <UploadCloud className="w-3.5 h-3.5 mr-1" />
                Upload Sanction Order
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {evidenceList.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl border border-gray-100 bg-white hover:border-purple-200 hover:shadow-xs transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
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
                        className="text-purple-700 font-medium hover:underline inline-flex items-center gap-1"
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

      {/* Add Grant Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-purple-800">
              <BadgeIndianRupee className="w-5 h-5" />
              Record Sponsored Research Project
            </DialogTitle>
            <DialogDescription>
              Add newly sanctioned research grant project details and budget sanctions.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddGrant} className="space-y-3">
            <div>
              <Label className="text-xs">Project Title</Label>
              <Input
                className="text-xs h-9"
                required
                placeholder="e.g. AI-Assisted IoT Sensor Networks for Weather Forecasting"
                value={projTitle}
                onChange={(e) => setProjTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Principal Investigator (PI)</Label>
                <Input
                  className="text-xs h-9"
                  required
                  value={piName}
                  onChange={(e) => setPiName(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">Department</Label>
                <Input
                  className="text-xs h-9"
                  value={piDept}
                  onChange={(e) => setPiDept(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Funding Agency</Label>
                <Input
                  className="text-xs h-9"
                  required
                  placeholder="e.g. DST-SERB / CSIR / UGC"
                  value={fundingAgency}
                  onChange={(e) => setFundingAgency(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">Agency Type</Label>
                <Select
                  value={agencyType}
                  onValueChange={(val: any) => setAgencyType(val)}
                >
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Government (Central/State)">Government (Central/State)</SelectItem>
                    <SelectItem value="Statutory Body">Statutory Body</SelectItem>
                    <SelectItem value="Non-Government / Corporate">Corporate / Industry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Sanction Order Number</Label>
                <Input
                  className="text-xs h-9"
                  placeholder="e.g. CRG/2025/004812"
                  value={sanctionNumber}
                  onChange={(e) => setSanctionNumber(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">Sanction Date</Label>
                <Input
                  type="date"
                  className="text-xs h-9"
                  value={sanctionDate}
                  onChange={(e) => setSanctionDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Sanctioned Amount (₹ Lakhs)</Label>
                <Input
                  type="number"
                  step="0.1"
                  className="text-xs h-9"
                  value={sanctionedLakhs}
                  onChange={(e) => setSanctionedLakhs(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Received Amount (₹ Lakhs)</Label>
                <Input
                  type="number"
                  step="0.1"
                  className="text-xs h-9"
                  value={receivedLakhs}
                  onChange={(e) => setReceivedLakhs(Number(e.target.value))}
                />
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
              <Button type="submit" className="bg-purple-700 hover:bg-purple-800 text-white text-xs h-9">
                Save Research Project
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Upload Sanction Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-purple-800">
              <UploadCloud className="w-5 h-5" />
              Upload Research Sanction Order / UC
            </DialogTitle>
            <DialogDescription>
              Attach statutory government sanction letter or CA audited Utilization Certificate.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadEvidence} className="space-y-3">
            <div>
              <Label className="text-xs">Document Title</Label>
              <Input
                className="text-xs h-9"
                required
                placeholder="e.g. DST-SERB Sanction Letter CRG-2024"
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
                placeholder="Brief summary of grant details and budget heads"
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
                className="bg-purple-700 hover:bg-purple-800 text-white text-xs h-9"
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
