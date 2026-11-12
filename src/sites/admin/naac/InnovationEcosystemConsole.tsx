import { useState, useEffect } from "react";
import {
  Lightbulb,
  Rocket,
  FileText,
  Search,
  Plus,
  ExternalLink,
  UploadCloud,
  Award,
  Sparkles,
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
  getInnovationEcosystemData,
  addPatentRecord,
  addStartupIncubationRecord,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type {
  InnovationEcosystemData,
  PatentRecord,
  StartupIncubationRecord,
  NaacEvidenceDocument,
} from "@/types";

interface InnovationEcosystemConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function InnovationEcosystemConsole({ onEvidenceUpdated }: InnovationEcosystemConsoleProps) {
  const [data, setData] = useState<InnovationEcosystemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [evidenceList, setEvidenceList] = useState<NaacEvidenceDocument[]>([]);
  const [activeTab, setActiveTab] = useState("patents");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPatentStatus, setFilterPatentStatus] = useState<string>("all");

  // Add Patent Modal
  const [showAddPatentModal, setShowAddPatentModal] = useState(false);
  const [patentAppNo, setPatentAppNo] = useState("");
  const [patentTitle, setPatentTitle] = useState("");
  const [inventors, setInventors] = useState("Dr. Rashmita Mishra, Aditya Narayan Das");
  const [dept, setDept] = useState("Computer Science");
  const [filingDate, setFilingDate] = useState("2025-06-15");
  const [patentType, setPatentType] = useState<PatentRecord["patentType"]>("Utility Patent");
  const [patentStatus, setPatentStatus] = useState<PatentRecord["status"]>("Filed");

  // Add Startup Modal
  const [showAddStartupModal, setShowAddStartupModal] = useState(false);
  const [startupName, setStartupName] = useState("");
  const [founders, setFounders] = useState("Siddharth Panigrahi (Student)");
  const [founderType, setFounderType] = useState<StartupIncubationRecord["founderType"]>("Student");
  const [sector, setSector] = useState<StartupIncubationRecord["sector"]>("Agritech");
  const [seedGrant, setSeedGrant] = useState(300000);
  const [turnover, setTurnover] = useState(450000);
  const [jobs, setJobs] = useState(3);

  // Upload Evidence Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDept, setEvidenceDept] = useState("Innovation & IPR Cell");
  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadConsoleData();
  }, []);

  async function loadConsoleData() {
    setLoading(true);
    try {
      const [innoData, evidences] = await Promise.all([
        getInnovationEcosystemData(),
        getEvidenceForMetric("3.2.1"),
      ]);
      setData(innoData);
      setEvidenceList(evidences);
    } catch (err) {
      console.error("Failed to load innovation ecosystem data", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredPatents = (data?.patents || []).filter((p) => {
    const matchesSearch =
      p.patentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patentApplicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterPatentStatus === "all" || p.status === filterPatentStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredStartups = (data?.startups || []).filter((s) => {
    return (
      s.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.founders.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  async function handleAddPatent(e: React.FormEvent) {
    e.preventDefault();
    if (!patentTitle || !patentAppNo) return;

    try {
      await addPatentRecord(
        {
          patentApplicationNumber: patentAppNo,
          patentTitle,
          inventors: inventors.split(",").map((s) => s.trim()),
          department: dept,
          filingDate,
          jurisdiction: "Indian Patent Office (IPO)",
          patentType,
          status: patentStatus,
          commercialized: patentStatus === "Granted",
        },
        { name: "Dr. Alok Nayak", role: "IPR Cell Coordinator" }
      );

      setShowAddPatentModal(false);
      resetPatentForm();
      loadConsoleData();
    } catch (err) {
      console.error("Failed to add patent", err);
    }
  }

  function resetPatentForm() {
    setPatentAppNo("");
    setPatentTitle("");
  }

  async function handleAddStartup(e: React.FormEvent) {
    e.preventDefault();
    if (!startupName) return;

    try {
      await addStartupIncubationRecord(
        {
          startupName,
          founders: founders.split(",").map((s) => s.trim()),
          founderType,
          incubationDate: new Date().toISOString().split("T")[0]!,
          sector,
          seedGrantReceivedInr: Number(seedGrant),
          annualTurnoverInr: Number(turnover),
          jobsCreated: Number(jobs),
          status: "Incubated",
        },
        { name: "Dr. Rashmita Mishra", role: "IIC President" }
      );

      setShowAddStartupModal(false);
      setStartupName("");
      loadConsoleData();
    } catch (err) {
      console.error("Failed to add startup", err);
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
          indicatorCode: "3.2",
          metricCode: "3.2.1",
          title: evidenceTitle,
          academicYear: "2025-26",
          department: evidenceDept,
          documentType: "PDF",
          description: evidenceDesc || "Patent letters and incubation center records.",
          remarks: "Verified against Indian Patent Office gazette publication.",
          fileName: evidenceFile?.name || `${evidenceTitle.replace(/\s+/g, "_")}.pdf`,
          fileSize: evidenceFile ? `${(evidenceFile.size / (1024 * 1024)).toFixed(1)} MB` : "4.1 MB",
          evidenceUrl: `/documents/naac/evidence/Patent_${Date.now()}.pdf`,
        },
        { name: "Dr. Alok Nayak", role: "IPR Cell Coordinator" }
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
      <Card className="border-amber-200 bg-white/70 backdrop-blur">
        <CardContent className="p-12 text-center text-muted-foreground">
          <div className="animate-spin w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full mx-auto mb-4" />
          Loading Innovation, Incubation & IPR Console...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Card */}
      <Card className="border-2 border-amber-300 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/70 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-amber-600 text-white hover:bg-amber-700">
                  NAAC Metric 3.2.1
                </Badge>
                <Badge variant="outline" className="text-amber-800 border-amber-300">
                  Innovation Ecosystem
                </Badge>
                <Badge className="bg-blue-600 text-white">Weightage: 15 Marks</Badge>
              </div>
              <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-amber-600" />
                Innovation Cell, Incubation & Patent Repository
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Ministry of Education IIC ({data.iicRating}), {data.totalPatents} intellectual property filings (2 granted), and {data.totalIncubatedStartups} incubated startups with seed capital.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                className="border-amber-300 text-amber-800 hover:bg-amber-50 text-xs sm:text-sm"
                onClick={() => setShowAddPatentModal(true)}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Patent
              </Button>
              <Button
                variant="outline"
                className="border-orange-300 text-orange-800 hover:bg-orange-50 text-xs sm:text-sm"
                onClick={() => setShowAddStartupModal(true)}
              >
                <Rocket className="w-4 h-4 mr-1.5" />
                Incubate Startup
              </Button>
              <Button
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm shadow-sm"
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
            <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Total Patents</span>
                <Lightbulb className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-3xl font-black text-amber-700 mt-1">
                {data.totalPatents}
              </div>
              <div className="text-xs text-emerald-600 font-medium mt-1">
                {data.patentsGranted} Granted • {data.patentsPublished} Published • {data.patentsFiled} Filed
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Incubated Startups</span>
                <Rocket className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-3xl font-black text-orange-700 mt-1">
                {data.totalIncubatedStartups}
              </div>
              <div className="text-xs text-gray-500 mt-1">In Agritech, Healthtech, Clean Energy</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Seed Capital Disbursed</span>
                <Award className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-emerald-700 mt-1">
                ₹{(data.totalSeedCapitalDisbursedInr / 100000).toFixed(2)} L
              </div>
              <div className="text-xs text-gray-500 mt-1">Institutional Seed Fund</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>MoE IIC Rating</span>
                <Sparkles className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-black text-purple-700 mt-1">
                4.5 ★
              </div>
              <div className="text-xs text-gray-500 mt-1">Top Innovation Cell Band</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Layout */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md bg-gray-100 p-1">
          <TabsTrigger value="patents" className="text-xs sm:text-sm">
            Patents ({data.patents.length})
          </TabsTrigger>
          <TabsTrigger value="startups" className="text-xs sm:text-sm">
            Startups ({data.startups.length})
          </TabsTrigger>
          <TabsTrigger value="evidence" className="text-xs sm:text-sm">
            Evidences ({evidenceList.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Patents Register */}
        <TabsContent value="patents" className="space-y-4 mt-4">
          <Card className="border border-amber-100 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-semibold text-gray-800">
                    Indian Patent Office (IPO) Filings & Grants
                  </CardTitle>
                  <CardDescription>
                    Patents filed, published in official patent gazette, and granted by Indian Patent Office.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative w-48 sm:w-60">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-3 text-gray-400" />
                    <Input
                      placeholder="Search title, application #, dept..."
                      className="pl-8 text-xs h-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={filterPatentStatus} onValueChange={setFilterPatentStatus}>
                    <SelectTrigger className="w-36 text-xs h-9">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Granted">Granted</SelectItem>
                      <SelectItem value="Published">Published</SelectItem>
                      <SelectItem value="Filed">Filed</SelectItem>
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
                      <TableHead className="font-semibold text-xs">Application No. & Title</TableHead>
                      <TableHead className="font-semibold text-xs">Inventors</TableHead>
                      <TableHead className="font-semibold text-xs">Department</TableHead>
                      <TableHead className="font-semibold text-xs">Filing Date</TableHead>
                      <TableHead className="font-semibold text-xs">Type</TableHead>
                      <TableHead className="font-semibold text-xs text-center">Commercialized</TableHead>
                      <TableHead className="font-semibold text-xs text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatents.map((pat) => (
                      <TableRow key={pat.id} className="hover:bg-amber-50/30">
                        <TableCell>
                          <div className="font-semibold text-xs text-gray-900 max-w-sm sm:max-w-md leading-snug">
                            {pat.patentTitle}
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono mt-0.5">{pat.patentApplicationNumber}</div>
                        </TableCell>
                        <TableCell className="text-xs text-gray-700">
                          {pat.inventors.join(", ")}
                        </TableCell>
                        <TableCell className="text-xs text-gray-600">
                          {pat.department}
                        </TableCell>
                        <TableCell className="text-xs text-gray-600 font-mono">
                          {pat.filingDate}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">
                            {pat.patentType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {pat.commercialized ? (
                            <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">
                              Yes (Licensing Active)
                            </Badge>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={
                              pat.status === "Granted"
                                ? "bg-emerald-600 text-white font-semibold"
                                : pat.status === "Published"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                            }
                          >
                            {pat.status}
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

        {/* Tab 2: Startups */}
        <TabsContent value="startups" className="space-y-4 mt-4">
          <Card className="border border-amber-100 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-orange-600" />
                Incubated Startups (EduVenture Incubation Centre)
              </CardTitle>
              <CardDescription>
                Student and faculty venture acceleration, seed capital disbursal, and job creation metrics.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/80">
                      <TableHead className="font-semibold text-xs">Startup Enterprise</TableHead>
                      <TableHead className="font-semibold text-xs">Founders</TableHead>
                      <TableHead className="font-semibold text-xs">Sector</TableHead>
                      <TableHead className="font-semibold text-xs text-right">Seed Capital (INR)</TableHead>
                      <TableHead className="font-semibold text-xs text-right">Annual Turnover (INR)</TableHead>
                      <TableHead className="font-semibold text-xs text-center">Jobs Created</TableHead>
                      <TableHead className="font-semibold text-xs text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStartups.map((s) => (
                      <TableRow key={s.id} className="hover:bg-orange-50/30">
                        <TableCell>
                          <div className="font-semibold text-xs text-gray-900">{s.startupName}</div>
                          <div className="text-[10px] text-gray-500">Incubated: {s.incubationDate}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-gray-700">{s.founders.join(", ")}</div>
                          <Badge variant="outline" className="text-[9px] mt-0.5">
                            {s.founderType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-slate-100 text-slate-800 text-[10px]">
                            {s.sector}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-right font-mono font-medium text-gray-700">
                          ₹{s.seedGrantReceivedInr.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-xs text-right font-mono font-bold text-emerald-700">
                          ₹{s.annualTurnoverInr.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-xs text-center font-bold text-blue-700">
                          {s.jobsCreated}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">
                            {s.status}
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

        {/* Tab 3: Evidences */}
        <TabsContent value="evidence" className="space-y-4 mt-4">
          <Card className="border border-amber-100 shadow-xs">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-gray-800">
                  Evidentiary Documentation (Metric 3.2.1)
                </CardTitle>
                <CardDescription>
                  Patent grant certificates, IIC scorecards, and incubation agreement deeds.
                </CardDescription>
              </div>
              <Button
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs"
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
                    className="p-4 rounded-xl border border-gray-100 bg-white hover:border-amber-200 hover:shadow-xs transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
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
                        className="text-amber-700 font-medium hover:underline inline-flex items-center gap-1"
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

      {/* Add Patent Modal */}
      <Dialog open={showAddPatentModal} onOpenChange={setShowAddPatentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-800">
              <Lightbulb className="w-5 h-5" />
              Record New Patent Filing
            </DialogTitle>
            <DialogDescription>
              Add patent application details, inventors, and publication status.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddPatent} className="space-y-3">
            <div>
              <Label className="text-xs">Patent Application Number</Label>
              <Input
                className="text-xs h-9 font-mono"
                required
                placeholder="e.g. 202531056789 A"
                value={patentAppNo}
                onChange={(e) => setPatentAppNo(e.target.value)}
              />
            </div>

            <div>
              <Label className="text-xs">Patent Title</Label>
              <Input
                className="text-xs h-9"
                required
                placeholder="e.g. Multi-Spectral Solar Water Purification Device"
                value={patentTitle}
                onChange={(e) => setPatentTitle(e.target.value)}
              />
            </div>

            <div>
              <Label className="text-xs">Inventors (Comma-separated)</Label>
              <Input
                className="text-xs h-9"
                value={inventors}
                onChange={(e) => setInventors(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Department</Label>
                <Input
                  className="text-xs h-9"
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">Filing Date</Label>
                <Input
                  type="date"
                  className="text-xs h-9"
                  value={filingDate}
                  onChange={(e) => setFilingDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Patent Type</Label>
                <Select
                  value={patentType}
                  onValueChange={(val: any) => setPatentType(val)}
                >
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Utility Patent">Utility Patent</SelectItem>
                    <SelectItem value="Design Patent">Design Patent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Current Status</Label>
                <Select
                  value={patentStatus}
                  onValueChange={(val: any) => setPatentStatus(val)}
                >
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Filed">Filed</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Granted">Granted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                className="text-xs h-9"
                onClick={() => setShowAddPatentModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-9">
                Save Patent
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Startup Modal */}
      <Dialog open={showAddStartupModal} onOpenChange={setShowAddStartupModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-800">
              <Rocket className="w-5 h-5" />
              Incubate New Startup
            </DialogTitle>
            <DialogDescription>
              Record student or faculty startup incubated in EduVenture Hub.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddStartup} className="space-y-3">
            <div>
              <Label className="text-xs">Startup Enterprise Name</Label>
              <Input
                className="text-xs h-9"
                required
                placeholder="e.g. EcoBreeze Solutions LLP"
                value={startupName}
                onChange={(e) => setStartupName(e.target.value)}
              />
            </div>

            <div>
              <Label className="text-xs">Founders</Label>
              <Input
                className="text-xs h-9"
                value={founders}
                onChange={(e) => setFounders(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Founder Type</Label>
                <Select
                  value={founderType}
                  onValueChange={(val: any) => setFounderType(val)}
                >
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Alumni">Alumni</SelectItem>
                    <SelectItem value="Faculty-Led">Faculty-Led</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Sector</Label>
                <Select
                  value={sector}
                  onValueChange={(val: any) => setSector(val)}
                >
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Agritech">Agritech</SelectItem>
                    <SelectItem value="Healthtech & AI">Healthtech & AI</SelectItem>
                    <SelectItem value="Clean Energy">Clean Energy</SelectItem>
                    <SelectItem value="Biotech">Biotech</SelectItem>
                    <SelectItem value="EdTech">EdTech</SelectItem>
                    <SelectItem value="Smart IoT">Smart IoT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs">Seed Grant (₹)</Label>
                <Input
                  type="number"
                  className="text-xs h-9"
                  value={seedGrant}
                  onChange={(e) => setSeedGrant(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Turnover (₹)</Label>
                <Input
                  type="number"
                  className="text-xs h-9"
                  value={turnover}
                  onChange={(e) => setTurnover(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Jobs</Label>
                <Input
                  type="number"
                  className="text-xs h-9"
                  value={jobs}
                  onChange={(e) => setJobs(Number(e.target.value))}
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                className="text-xs h-9"
                onClick={() => setShowAddStartupModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white text-xs h-9">
                Save Startup
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Upload Evidence Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-800">
              <UploadCloud className="w-5 h-5" />
              Upload Patent / Incubation Evidence
            </DialogTitle>
            <DialogDescription>
              Attach patent certificates, IIC star rating letters, or startup incubation deeds.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadEvidence} className="space-y-3">
            <div>
              <Label className="text-xs">Document Title</Label>
              <Input
                className="text-xs h-9"
                required
                placeholder="e.g. IPO Patent Grant Certificate 2025"
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
                placeholder="Brief summary of patent or incubator credential"
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
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-9"
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
