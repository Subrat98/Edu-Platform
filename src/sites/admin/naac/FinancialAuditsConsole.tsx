import { useState, useEffect } from "react";
import {
  FileCheck2,
  DollarSign,
  TrendingUp,
  FileText,
  Search,
  Plus,
  ExternalLink,
  UploadCloud,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Calculator,
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
  getAuditedBalanceSheetData,
  addFinancialAuditRecord,
  addBudgetAllocationRecord,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type {
  AuditedBalanceSheetData,
  FinancialAuditRecord,
  NaacEvidenceDocument,
} from "@/types";

interface FinancialAuditsConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function FinancialAuditsConsole({ onEvidenceUpdated }: FinancialAuditsConsoleProps) {
  const [data, setData] = useState<AuditedBalanceSheetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [evidenceList, setEvidenceList] = useState<NaacEvidenceDocument[]>([]);
  const [activeTab, setActiveTab] = useState("audits");
  const [searchQuery, setSearchQuery] = useState("");

  // Add Financial Audit Modal
  const [showAddAuditModal, setShowAddAuditModal] = useState(false);
  const [auditType, setAuditType] = useState<FinancialAuditRecord["auditType"]>("External Statutory Audit");
  const [financialYear, setFinancialYear] = useState("2024-25");
  const [auditorFirmName, setAuditorFirmName] = useState("");
  const [caMembershipOrUdin, setCaMembershipOrUdin] = useState("UDIN: 25048912BGHT7721");
  const [completionDate, setCompletionDate] = useState(new Date().toISOString().split("T")[0]!);
  const [auditRemarks, setAuditRemarks] = useState("Accounts maintain fair presentation in conformity with applicable AS.");
  const [complianceStatus, setComplianceStatus] = useState<FinancialAuditRecord["complianceStatus"]>("Unqualified (Clean Opinion)");

  // Add Budget Allocation Modal
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [headCategory, setHeadCategory] = useState("");
  const [allocatedBudgetLakhs, setAllocatedBudgetLakhs] = useState(25);
  const [utilizedExpenditureLakhs, setUtilizedExpenditureLakhs] = useState(24.2);
  const [budgetYear, setBudgetYear] = useState("2024-25");
  const [voucherSeries, setVoucherSeries] = useState("VCH-2024-BGT-09");

  // Upload Evidence Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDept, setEvidenceDept] = useState("Finance & Accounts Office");
  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadConsoleData();
  }, []);

  async function loadConsoleData() {
    setLoading(true);
    try {
      const [auditData, evidences] = await Promise.all([
        getAuditedBalanceSheetData(),
        getEvidenceForMetric("6.4.1"),
      ]);
      setData(auditData);
      setEvidenceList(evidences);
    } catch (err) {
      console.error("Failed to load financial audit data", err);
    } finally {
      setLoading(false);
    }
  }

  const handleAddAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditorFirmName.trim()) return;

    try {
      await addFinancialAuditRecord(
        {
          auditType,
          financialYear,
          auditorFirmName,
          caMembershipOrUdin,
          completionDate,
          auditRemarks,
          auditReportUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
          complianceStatus,
        },
        { name: "CMA Rajesh Verma", role: "Chief Finance Officer" }
      );
      setShowAddAuditModal(false);
      setAuditorFirmName("");
      loadConsoleData();
    } catch (err) {
      console.error("Failed to add audit record", err);
    }
  };

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!headCategory.trim()) return;

    const utilPct = Number(((utilizedExpenditureLakhs / (allocatedBudgetLakhs || 1)) * 100).toFixed(2));
    try {
      await addBudgetAllocationRecord(
        {
          headCategory,
          allocatedBudgetLakhs,
          utilizedExpenditureLakhs,
          utilizationPercentage: utilPct,
          academicYear: budgetYear,
          accountingVoucherSeries: voucherSeries,
        },
        { name: "CMA Rajesh Verma", role: "Chief Finance Officer" }
      );
      setShowAddBudgetModal(false);
      setHeadCategory("");
      loadConsoleData();
    } catch (err) {
      console.error("Failed to add budget head", err);
    }
  };

  const handleUploadEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceTitle.trim() || !evidenceFile) return;

    setUploading(true);
    try {
      await uploadEvidenceDocument(
        {
          metricCode: "6.4.1",
          title: evidenceTitle,
          description: evidenceDesc || "Statutory audit balance sheet, income & expenditure statements, and CA certificates",
          criterion: 6,
          fileType: "pdf",
          department: evidenceDept,
          academicYear: "2024-25",
          url: URL.createObjectURL(evidenceFile),
        },
        evidenceFile,
        { name: "CMA Rajesh Verma", role: "Chief Finance Officer" }
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
          <p className="text-sm text-muted-foreground">Loading Financial Audits & Balance Sheets...</p>
        </div>
      </div>
    );
  }

  const filteredAudits = data.audits.filter(
    (a) =>
      a.auditorFirmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.financialYear.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.auditType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.caMembershipOrUdin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBudgets = data.budgetBreakdown.filter(
    (b) =>
      b.headCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.accountingVoucherSeries.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-transparent p-6 dark:from-blue-950/20 dark:via-indigo-950/20 md:flex-row md:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-blue-600 font-semibold text-blue-700 dark:text-blue-400">
              NAAC Metric 6.4.1
            </Badge>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
              {data.overallUtilizationPercentage}% Budget Utilization
            </Badge>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Institutional Budget Allocation & Statutory Audits</h2>
          <p className="text-sm text-muted-foreground">
            Internal & external statutory audits, CA certified balance sheets with verified UDIN, and transparent budget utilization breakdown.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowUploadModal(true)} className="gap-2">
            <UploadCloud className="h-4 w-4" />
            Upload Balance Sheet
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setShowAddBudgetModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Budget Head
          </Button>
          <Button size="sm" onClick={() => setShowAddAuditModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Register Audit
          </Button>
        </div>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sanctioned Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ₹{data.totalInstitutionalBudgetLakhs.toFixed(2)}L
            </div>
            <p className="text-xs text-muted-foreground">Academic Year {data.financialYear}</p>
            <Progress value={100} className="mt-2 h-1.5 bg-blue-100 dark:bg-blue-950" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Audited Expenditure</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              ₹{data.totalAuditedExpenditureLakhs.toFixed(2)}L
            </div>
            <p className="text-xs text-muted-foreground">{data.overallUtilizationPercentage}% Budget Realized</p>
            <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" /> CA Certified Statement
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Academic Expenditure</CardTitle>
            <Building2 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              ₹{data.academicExpenditureLakhs.toFixed(2)}L
            </div>
            <p className="text-xs text-muted-foreground">Labs, Library, Seminars, Seed Grants</p>
            <p className="mt-2 text-xs text-muted-foreground">Physical Infra: ₹{data.physicalInfrastructureExpenditureLakhs.toFixed(2)}L</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Statutory Compliance</CardTitle>
            <ShieldCheck className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">Clean Opinion</div>
            <p className="text-xs text-muted-foreground">Verified UDIN Generated</p>
            <p className="mt-2 text-xs text-emerald-600 font-medium">Zero Audit Objections</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <TabsList className="grid w-full grid-cols-3 sm:w-auto">
            <TabsTrigger value="audits" className="gap-2">
              <FileCheck2 className="h-4 w-4" />
              Statutory Audits ({data.audits.length})
            </TabsTrigger>
            <TabsTrigger value="budget" className="gap-2">
              <Calculator className="h-4 w-4" />
              Budget Breakdown ({data.budgetBreakdown.length})
            </TabsTrigger>
            <TabsTrigger value="evidence" className="gap-2">
              <FileText className="h-4 w-4" />
              Evidences ({evidenceList.length})
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search auditor, FY, budget head..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Tab 1: Financial Audits */}
        <TabsContent value="audits" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Institutional Financial Audits & CA Reports</CardTitle>
              <CardDescription>
                Statutory external audits with ICAI UDIN verification and internal quarterly audit committee evaluations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Audit Type</TableHead>
                      <TableHead>Financial Year</TableHead>
                      <TableHead>Auditor / Firm Name</TableHead>
                      <TableHead>CA UDIN / Reg.</TableHead>
                      <TableHead>Completion Date</TableHead>
                      <TableHead>Opinion / Status</TableHead>
                      <TableHead>Key Remarks</TableHead>
                      <TableHead className="text-right">Report</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAudits.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                          No audit records found matching your query.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAudits.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium text-xs">
                            <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400">
                              {item.auditType}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-semibold text-xs font-mono">{item.financialYear}</TableCell>
                          <TableCell className="font-medium text-sm">{item.auditorFirmName}</TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">{item.caMembershipOrUdin}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{item.completionDate}</TableCell>
                          <TableCell>
                            <Badge className="bg-emerald-100 text-emerald-800 text-[11px] dark:bg-emerald-950/60 dark:text-emerald-300">
                              {item.complianceStatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                            {item.auditRemarks}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => window.open(item.auditReportUrl, "_blank")}
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

        {/* Tab 2: Budget Breakdown */}
        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Head-wise Budget Allocation vs. Utilization</CardTitle>
              <CardDescription>
                Detailed breakdown across academic support, research funding, infrastructure maintenance, and green campus.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Budget Head Category</TableHead>
                      <TableHead>Voucher Series</TableHead>
                      <TableHead className="text-right">Allocated (₹ Lakhs)</TableHead>
                      <TableHead className="text-right">Utilized (₹ Lakhs)</TableHead>
                      <TableHead className="text-right">Utilization %</TableHead>
                      <TableHead className="text-right">Progress</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBudgets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                          No budget records found matching your query.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBudgets.map((b, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium text-sm">{b.headCategory}</TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">{b.accountingVoucherSeries}</TableCell>
                          <TableCell className="text-right font-medium text-xs">
                            ₹{b.allocatedBudgetLakhs.toFixed(2)}L
                          </TableCell>
                          <TableCell className="text-right font-semibold text-xs text-emerald-600">
                            ₹{b.utilizedExpenditureLakhs.toFixed(2)}L
                          </TableCell>
                          <TableCell className="text-right font-bold text-xs">
                            {b.utilizationPercentage}%
                          </TableCell>
                          <TableCell className="text-right w-36">
                            <Progress value={Math.min(b.utilizationPercentage, 100)} className="h-2" />
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

        {/* Tab 3: Evidences */}
        <TabsContent value="evidence" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">NAAC Metric 6.4.1 Statutory Documents</CardTitle>
                  <CardDescription>
                    CA signed balance sheets, income & expenditure statements, and internal audit reports.
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
                  <p className="text-xs text-muted-foreground">Upload audited statements and UDIN certificates.</p>
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
                        onClick={() => window.open(doc.evidenceUrl || "#", "_blank")}
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

      {/* Modal: Add Financial Audit Record */}
      <Dialog open={showAddAuditModal} onOpenChange={setShowAddAuditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Register Statutory / Internal Audit</DialogTitle>
            <DialogDescription>
              Record an external chartered accountant or internal committee audit.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddAudit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="auditType" className="text-xs">Audit Type</Label>
                <Select
                  value={auditType}
                  onValueChange={(val) => setAuditType(val as FinancialAuditRecord["auditType"])}
                >
                  <SelectTrigger id="auditType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="External Statutory Audit">External Statutory Audit</SelectItem>
                    <SelectItem value="Internal Audit Committee">Internal Audit Committee</SelectItem>
                    <SelectItem value="Government Audit (CAG / AG)">Government Audit (CAG / AG)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="fy" className="text-xs">Financial Year</Label>
                <Input
                  id="fy"
                  value={financialYear}
                  onChange={(e) => setFinancialYear(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="firmName" className="text-xs">Auditor / Firm Name</Label>
              <Input
                id="firmName"
                placeholder="e.g., K. S. Aiyar & Co., Chartered Accountants"
                value={auditorFirmName}
                onChange={(e) => setAuditorFirmName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="udin" className="text-xs">CA UDIN / Reg No.</Label>
                <Input
                  id="udin"
                  value={caMembershipOrUdin}
                  onChange={(e) => setCaMembershipOrUdin(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="completionDate" className="text-xs">Audit Completion Date</Label>
                <Input
                  id="completionDate"
                  type="date"
                  value={completionDate}
                  onChange={(e) => setCompletionDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="complianceStatus" className="text-xs">Audit Opinion</Label>
              <Select
                value={complianceStatus}
                onValueChange={(val) => setComplianceStatus(val as FinancialAuditRecord["complianceStatus"])}
              >
                <SelectTrigger id="complianceStatus">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Unqualified (Clean Opinion)">Unqualified (Clean Opinion)</SelectItem>
                  <SelectItem value="Complied & Closed">Complied & Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="remarks" className="text-xs">Auditor Remarks</Label>
              <Input
                id="remarks"
                value={auditRemarks}
                onChange={(e) => setAuditRemarks(e.target.value)}
                required
              />
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

      {/* Modal: Add Budget Head Allocation */}
      <Dialog open={showAddBudgetModal} onOpenChange={setShowAddBudgetModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Budget Head Allocation</DialogTitle>
            <DialogDescription>
              Track budgetary provisions and actual expenditures across institutional categories.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddBudget} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="headCat" className="text-xs">Budget Head Name</Label>
              <Input
                id="headCat"
                placeholder="e.g., Digital Library Subscriptions & E-Resources"
                value={headCategory}
                onChange={(e) => setHeadCategory(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="alloc" className="text-xs">Allocated (₹ Lakhs)</Label>
                <Input
                  id="alloc"
                  type="number"
                  step="0.01"
                  value={allocatedBudgetLakhs}
                  onChange={(e) => setAllocatedBudgetLakhs(Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="util" className="text-xs">Utilized (₹ Lakhs)</Label>
                <Input
                  id="util"
                  type="number"
                  step="0.01"
                  value={utilizedExpenditureLakhs}
                  onChange={(e) => setUtilizedExpenditureLakhs(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="bgtYear" className="text-xs">Academic Year</Label>
                <Input
                  id="bgtYear"
                  value={budgetYear}
                  onChange={(e) => setBudgetYear(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="voucher" className="text-xs">Voucher Series</Label>
                <Input
                  id="voucher"
                  value={voucherSeries}
                  onChange={(e) => setVoucherSeries(e.target.value)}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddBudgetModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Budget Head</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Upload Official Evidence */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Balance Sheet / Audit Statement</DialogTitle>
            <DialogDescription>
              Attach CA audited financial balance sheets, income-expenditure statements, and UDIN certificates.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadEvidence} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="evidenceTitle" className="text-xs">Document Title</Label>
              <Input
                id="evidenceTitle"
                placeholder="e.g., Audited Balance Sheet & UDIN Certificate FY 2024-25"
                value={evidenceTitle}
                onChange={(e) => setEvidenceTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="evidenceDept" className="text-xs">Office / Section</Label>
              <Input
                id="evidenceDept"
                value={evidenceDept}
                onChange={(e) => setEvidenceDept(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="evidenceDesc" className="text-xs">Description</Label>
              <Input
                id="evidenceDesc"
                placeholder="CA registration, UDIN reference, statutory remarks..."
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
                {uploading ? "Uploading..." : "Upload Statement"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
