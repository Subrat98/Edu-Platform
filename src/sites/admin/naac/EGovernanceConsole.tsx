import { useState, useEffect } from "react";
import {
  Server,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Search,
  Plus,
  ExternalLink,
  UploadCloud,
  Database,
  Users,
  CreditCard,
  GraduationCap,
  Award,
  Activity,
  Lock,
  Cpu,
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
  getEGovernanceData,
  addErpModuleAudit,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type {
  EGovernanceData,
  EGovernancePillarRecord,
  ErpModuleAuditRecord,
  NaacEvidenceDocument,
} from "@/types";

interface EGovernanceConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function EGovernanceConsole({ onEvidenceUpdated }: EGovernanceConsoleProps) {
  const [data, setData] = useState<EGovernanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [evidenceList, setEvidenceList] = useState<NaacEvidenceDocument[]>([]);
  const [activeTab, setActiveTab] = useState("pillars");
  const [searchQuery, setSearchQuery] = useState("");

  // Add ERP Module Audit Modal
  const [showAddAuditModal, setShowAddAuditModal] = useState(false);
  const [moduleCode, setModuleCode] = useState("ERP-SEC-2025");
  const [domain, setDomain] = useState("Administration & HRMS");
  const [systemName, setSystemName] = useState("");
  const [lastSecurityAuditDate, setLastSecurityAuditDate] = useState(new Date().toISOString().split("T")[0]);
  const [auditingAgency, setAuditingAgency] = useState("CERT-In Empanelled InfoSec Auditor");
  const [complianceRating, setComplianceRating] = useState("ISO 27001 / PCI-DSS Level 1 Compliant");
  const [dailyActiveTransactions, setDailyActiveTransactions] = useState(500);

  // Upload Evidence Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDept, setEvidenceDept] = useState("ERP & IT Infrastructure Directorate");
  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadConsoleData();
  }, []);

  async function loadConsoleData() {
    setLoading(true);
    try {
      const [eGovData, evidences] = await Promise.all([
        getEGovernanceData(),
        getEvidenceForMetric("6.2.2"),
      ]);
      setData(eGovData);
      setEvidenceList(evidences);
    } catch (err) {
      console.error("Failed to load e-governance data", err);
    } finally {
      setLoading(false);
    }
  }

  const handleAddAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!systemName.trim()) return;

    try {
      await addErpModuleAudit(
        {
          moduleCode,
          domain,
          systemName,
          lastSecurityAuditDate,
          auditingAgency,
          complianceRating,
          dailyActiveTransactions,
          evidenceScreenshotUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        },
        { name: "Dr. Arvind Saxena", role: "Chief Technology Officer / ERP Admin" }
      );
      setShowAddAuditModal(false);
      setSystemName("");
      loadConsoleData();
    } catch (err) {
      console.error("Failed to add audit record", err);
    }
  };

  const handleUploadEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceTitle.trim() || !evidenceFile) return;

    setUploading(true);
    try {
      await uploadEvidenceDocument(
        {
          criterionId: 6,
          indicatorCode: "6.2",
          metricCode: "6.2.2",
          title: evidenceTitle,
          description: evidenceDesc || "Institutional ERP e-governance audit proof and security compliance report",
          academicYear: "2024-25",
          department: evidenceDept,
          documentType: "PDF",
          fileName: evidenceFile.name,
          fileSize: `${(evidenceFile.size / (1024 * 1024)).toFixed(2)} MB`,
          evidenceUrl: URL.createObjectURL(evidenceFile),
          remarks: "Uploaded via E-Governance & ERP Console for Metric 6.2.2",
        },
        { name: "Dr. Arvind Saxena", role: "Chief Technology Officer" }
      );
      setShowUploadModal(false);
      setEvidenceTitle("");
      setEvidenceDesc("");
      setEvidenceFile(null);
      if (onEvidenceUpdated) onEvidenceUpdated();
      loadConsoleData();
    } catch (err) {
      console.error("Failed to upload evidence", err);
    } finally {
      setUploading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Activity className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading E-Governance & ERP compliance records...</p>
        </div>
      </div>
    );
  }

  const filteredPillars = data.pillars.filter(
    (p) =>
      (p.domainName || p.domain || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.softwareModuleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.cloudHostOrServer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAudits = data.auditLogs.filter(
    (a) =>
      a.systemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.auditingAgency.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case "Administration":
        return <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case "Finance & Accounts":
      case "Finance and Accounts":
        return <CreditCard className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />;
      case "Student Admission & Support":
      case "Student Admission and Support":
        return <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
      case "Examination":
        return <Award className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
      default:
        return <Database className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent p-6 dark:from-blue-950/20 dark:via-indigo-950/20 md:flex-row md:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-blue-500 font-semibold text-blue-600 dark:text-blue-400">
              NAAC Metric 6.2.2
            </Badge>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
              4 of 4 Domains Operational (100%)
            </Badge>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Institutional E-Governance & ERP Ecosystem</h2>
          <p className="text-sm text-muted-foreground">
            Complete digitization of Administration, Finance, Admission, and Examination systems with CERT-In security audits.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowUploadModal(true)} className="gap-2">
            <UploadCloud className="h-4 w-4" />
            Upload Audit Proof
          </Button>
          <Button size="sm" onClick={() => setShowAddAuditModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Security Audit
          </Button>
        </div>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Designated Domains</CardTitle>
            <Server className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {data.totalDesignatedDomainsOperational} / 4
            </div>
            <p className="text-xs text-muted-foreground">Admin, Finance, Admission, Exam</p>
            <Progress value={100} className="mt-2 h-1.5 bg-blue-100 dark:bg-blue-950" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registered Users</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {data.totalActiveUsersCount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Students, Faculty & Admin Staff</p>
            <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" /> Single Sign-On (SSO) Active
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Transactions</CardTitle>
            <Activity className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {data.totalDailyDigitalTransactions.toLocaleString()}+
            </div>
            <p className="text-xs text-muted-foreground">Fees, Attendance, Marks, Requests</p>
            <p className="mt-2 text-xs text-muted-foreground">Avg Uptime: 99.85%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Infra & Security</CardTitle>
            <ShieldCheck className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">PCI-DSS / ISO</div>
            <p className="text-xs text-muted-foreground">{data.erpProvider}</p>
            <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
              <Lock className="h-3.5 w-3.5" /> 256-bit TLS Encrypted
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <TabsList className="grid w-full grid-cols-3 sm:w-auto">
            <TabsTrigger value="pillars" className="gap-2">
              <Cpu className="h-4 w-4" />
              4 Operational Pillars ({data.pillars.length})
            </TabsTrigger>
            <TabsTrigger value="audits" className="gap-2">
              <ShieldCheck className="h-4 w-4" />
              Security Audits ({data.auditLogs.length})
            </TabsTrigger>
            <TabsTrigger value="evidence" className="gap-2">
              <FileText className="h-4 w-4" />
              Evidence Repository ({evidenceList.length})
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search module, domain, host..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Tab 1: 4 Operational Pillars */}
        <TabsContent value="pillars" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredPillars.map((pillar) => (
              <Card key={pillar.id} className="overflow-hidden border transition-all hover:shadow-md">
                <CardHeader className="bg-muted/30 pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        {getDomainIcon(pillar.domainName || pillar.domain || "")}
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-1 text-xs">
                          {pillar.domainName || pillar.domain}
                        </Badge>
                        <CardTitle className="text-lg">{pillar.softwareModuleName}</CardTitle>
                      </div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      {pillar.auditStatus}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Implementation: </span>
                      <span className="font-semibold">{pillar.implementationYear}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Annual Users: </span>
                      <span className="font-semibold">{pillar.annualActiveUsers.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Hosting Infra: </span>
                      <span className="font-semibold">{pillar.cloudHostOrServer}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">System Uptime: </span>
                      <span className="font-semibold text-emerald-600">{pillar.uptimePercentage}%</span>
                    </div>
                  </div>

                  <div>
                    <h5 className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Core Functional Modules
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {pillar.keyFeatures.map((feat, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs font-normal">
                          {feat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 2: Security Audits */}
        <TabsContent value="audits" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Third-Party Cyber Security & InfoSec Audits</CardTitle>
              <CardDescription>
                Statutory vulnerability assessments, penetration testing (VAPT), and certification reports.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Module Code</TableHead>
                      <TableHead>Domain & System</TableHead>
                      <TableHead>Auditing Agency</TableHead>
                      <TableHead>Audit Date</TableHead>
                      <TableHead>Compliance Rating</TableHead>
                      <TableHead className="text-right">Daily Trans.</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAudits.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                          No security audit logs found matching your query.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAudits.map((audit) => (
                        <TableRow key={audit.id}>
                          <TableCell className="font-mono text-xs font-medium text-blue-600">
                            {audit.moduleCode}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-sm">{audit.systemName}</div>
                            <div className="text-xs text-muted-foreground">{audit.domain}</div>
                          </TableCell>
                          <TableCell className="text-xs">{audit.auditingAgency}</TableCell>
                          <TableCell className="text-xs">{audit.lastSecurityAuditDate}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-emerald-300 text-emerald-700 dark:text-emerald-400">
                              {audit.complianceRating}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium text-xs">
                            {audit.dailyActiveTransactions.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => window.open(audit.evidenceScreenshotUrl, "_blank")}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
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

        {/* Tab 3: Evidence Repository */}
        <TabsContent value="evidence" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">NAAC Metric 6.2.2 Statutory Evidence Files</CardTitle>
                  <CardDescription>
                    Official ERP invoices, CERT-In audit reports, SLA agreements, and screenshots.
                  </CardDescription>
                </div>
                <Button size="sm" onClick={() => setShowUploadModal(true)} className="gap-2">
                  <UploadCloud className="h-4 w-4" />
                  Upload Document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {evidenceList.length === 0 ? (
                <div className="flex h-36 flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center">
                  <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">No official evidence uploaded yet</p>
                  <p className="text-xs text-muted-foreground">Upload ERP licenses and statutory audit reports.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {evidenceList.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-start justify-between rounded-lg border p-3 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded border bg-muted p-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm leading-none">{doc.title}</p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{doc.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-[10px]">
                              {doc.department}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">{doc.academicYear}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1 text-xs shrink-0"
                        onClick={() => window.open(doc.evidenceUrl || doc.url || "#", "_blank")}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal: Add ERP Security Audit */}
      <Dialog open={showAddAuditModal} onOpenChange={setShowAddAuditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add ERP Security Audit Record</DialogTitle>
            <DialogDescription>
              Register an audit conducted on an institutional e-governance domain.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddAudit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="moduleCode" className="text-xs">Module Code</Label>
                <Input
                  id="moduleCode"
                  value={moduleCode}
                  onChange={(e) => setModuleCode(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="domain" className="text-xs">Domain</Label>
                <Select value={domain} onValueChange={setDomain}>
                  <SelectTrigger id="domain">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administration & HRMS">Administration & HRMS</SelectItem>
                    <SelectItem value="Finance & Accounts">Finance & Accounts</SelectItem>
                    <SelectItem value="Student Admission & SIS">Student Admission & SIS</SelectItem>
                    <SelectItem value="Examination & CoE">Examination & CoE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="systemName" className="text-xs">System / Software Name</Label>
              <Input
                id="systemName"
                placeholder="e.g., CampusCloud HRMS & Biometric Engine"
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="auditingAgency" className="text-xs">Auditing Agency</Label>
                <Input
                  id="auditingAgency"
                  value={auditingAgency}
                  onChange={(e) => setAuditingAgency(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="auditDate" className="text-xs">Audit Date</Label>
                <Input
                  id="auditDate"
                  type="date"
                  value={lastSecurityAuditDate}
                  onChange={(e) => setLastSecurityAuditDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="complianceRating" className="text-xs">Compliance Rating</Label>
                <Input
                  id="complianceRating"
                  value={complianceRating}
                  onChange={(e) => setComplianceRating(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="dailyTrans" className="text-xs">Daily Transactions</Label>
                <Input
                  id="dailyTrans"
                  type="number"
                  value={dailyActiveTransactions}
                  onChange={(e) => setDailyActiveTransactions(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddAuditModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Audit Record</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Upload Official Evidence */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload E-Governance Evidence</DialogTitle>
            <DialogDescription>
              Attach statutory audit certificates, ERP vendor invoices, or institutional screenshots.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadEvidence} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="evidenceTitle" className="text-xs">Document Title</Label>
              <Input
                id="evidenceTitle"
                placeholder="e.g., Annual ERP Maintenance & CERT-In Audit Report"
                value={evidenceTitle}
                onChange={(e) => setEvidenceTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="evidenceDept" className="text-xs">Directorate / Office</Label>
              <Input
                id="evidenceDept"
                value={evidenceDept}
                onChange={(e) => setEvidenceDept(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="evidenceDesc" className="text-xs">Brief Description</Label>
              <Input
                id="evidenceDesc"
                placeholder="Audit scope, certification numbers, and URL endpoints..."
                value={evidenceDesc}
                onChange={(e) => setEvidenceDesc(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="evidenceFile" className="text-xs">File Attachment (PDF / Document)</Label>
              <Input
                id="evidenceFile"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setEvidenceFile(e.target.files?.[0] || null)}
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowUploadModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading ? "Uploading..." : "Upload Evidence"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
