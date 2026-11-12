import { useState, useEffect } from "react";
import {
  Wrench,
  Building,
  CheckCircle2,
  Search,
  Plus,
  ExternalLink,
  UploadCloud,
  ShieldCheck,
  BadgeIndianRupee,
  Activity,
  Calculator,
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
  getMaintenanceExpenditureData,
  addAmcContract,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type {
  MaintenanceExpenditureData,
  AmcContractRecord,
  NaacEvidenceDocument,
} from "@/types";

interface MaintenanceExpenditureConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function MaintenanceExpenditureConsole({ onEvidenceUpdated }: MaintenanceExpenditureConsoleProps) {
  const [data, setData] = useState<MaintenanceExpenditureData | null>(null);
  const [loading, setLoading] = useState(true);
  const [evidenceList, setEvidenceList] = useState<NaacEvidenceDocument[]>([]);
  const [activeTab, setActiveTab] = useState("categories");
  const [searchContract, setSearchContract] = useState("");

  // Add AMC Modal
  const [showAddAmcModal, setShowAddAmcModal] = useState(false);
  const [facilityType, setFacilityType] = useState<AmcContractRecord["facilityType"]>("IT Equipment & Networking");
  const [vendorName, setVendorName] = useState("");
  const [contractNumber, setContractNumber] = useState("");
  const [scopeOfWork, setScopeOfWork] = useState("");
  const [annualContractValueLakhs, setAnnualContractValueLakhs] = useState(5.0);
  const [startDate, setStartDate] = useState("2025-04-01");
  const [endDate, setEndDate] = useState("2026-03-31");
  const [paymentTerms] = useState("Quarterly upon engineer certification");
  const [contactPerson, setContactPerson] = useState("");

  // Upload Evidence Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDept, setEvidenceDept] = useState("Estate & Maintenance Cell");
  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadConsoleData();
  }, []);

  async function loadConsoleData() {
    setLoading(true);
    try {
      const [maintData, evidences] = await Promise.all([
        getMaintenanceExpenditureData(),
        getEvidenceForMetric("4.4.1"),
      ]);
      setData(maintData);
      setEvidenceList(evidences);
    } catch (err) {
      console.error("Failed to load maintenance console data", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddAmc(e: React.FormEvent) {
    e.preventDefault();
    if (!vendorName || !contractNumber) return;
    try {
      await addAmcContract(
        {
          facilityType,
          vendorName,
          contractNumber,
          scopeOfWork,
          startDate,
          endDate,
          annualContractValueLakhs,
          paymentTerms,
          contactPerson,
          status: "Active",
        },
        { name: "Estate Officer", role: "Maintenance Admin" }
      );
      setShowAddAmcModal(false);
      setVendorName("");
      setContractNumber("");
      setScopeOfWork("");
      await loadConsoleData();
    } catch (err) {
      console.error("Failed to add AMC contract", err);
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
          criterionId: 4,
          indicatorCode: "4.4",
          metricCode: "4.4.1",
          title: evidenceTitle,
          academicYear: "2025-26",
          department: evidenceDept,
          documentType: "PDF",
          description: evidenceDesc || "Audited maintenance expenditure certificate and AMC documents.",
          remarks: "Verified against Chartered Accountant signed audit balance sheet.",
        },
        dummyFile,
        { name: "Finance Officer", role: "Admin" }
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
      <Card className="border-teal-200 shadow-md">
        <CardContent className="p-8 text-center text-muted-foreground">
          <Activity className="w-8 h-8 mx-auto mb-3 animate-spin text-teal-600" />
          <p>Loading Infrastructure Maintenance & Expenditure Console...</p>
        </CardContent>
      </Card>
    );
  }

  const filteredContracts = data.amcContracts.filter(
    (c) =>
      c.vendorName.toLowerCase().includes(searchContract.toLowerCase()) ||
      c.facilityType.toLowerCase().includes(searchContract.toLowerCase()) ||
      c.contractNumber.toLowerCase().includes(searchContract.toLowerCase())
  );

  return (
    <Card className="border-teal-200 shadow-lg bg-card">
      <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 border-b border-teal-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-teal-600 text-white hover:bg-teal-700">Metric 4.4.1</Badge>
              <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-50">
                CA Audited Statements Active
              </Badge>
              <Badge variant="outline" className="text-teal-800 border-teal-300 bg-teal-50">
                37.94% Non-Salary Maintenance Ratio
              </Badge>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Wrench className="w-6 h-6 text-teal-600" />
              Infrastructure Maintenance & Expenditure Console
            </CardTitle>
            <CardDescription className="text-slate-600">
              Statutory audited expenditure of ₹48.75 Lakhs on maintenance of physical & academic support facilities excluding salary, governed by 6 active AMCs.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowUploadModal(true)}
              className="text-teal-700 border-teal-300 hover:bg-teal-100"
            >
              <UploadCloud className="w-4 h-4 mr-1.5" />
              Upload Evidence
            </Button>
            <Button
              size="sm"
              onClick={() => setShowAddAmcModal(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add AMC Contract
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-teal-100 bg-gradient-to-br from-teal-50/50 to-white shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Maintenance Expenditure</span>
                <BadgeIndianRupee className="w-4 h-4 text-teal-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-teal-700">₹{data.totalAuditedExpenditureLakhs}L</span>
                <span className="text-xs text-slate-500">of ₹{data.totalMaintenanceBudgetLakhs}L Budget</span>
              </div>
              <Progress
                value={(data.totalAuditedExpenditureLakhs / data.totalMaintenanceBudgetLakhs) * 100}
                className="h-1.5"
              />
              <p className="text-xs text-slate-500">
                {((data.totalAuditedExpenditureLakhs / data.totalMaintenanceBudgetLakhs) * 100).toFixed(1)}% budget utilized
              </p>
            </CardContent>
          </Card>

          <Card className="border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Maintenance Ratio</span>
                <Calculator className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-emerald-700">{data.maintenancePercentage}%</span>
                <span className="text-xs font-medium text-emerald-600">(Benchmark ≥ 30%)</span>
              </div>
              <p className="text-xs text-slate-600">Of total ₹128.50L non-salary budget</p>
            </CardContent>
          </Card>

          <Card className="border border-blue-100 bg-gradient-to-br from-blue-50/50 to-white shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Active AMC Contracts</span>
                <Building className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-blue-700">{data.amcContracts.length} Contracts</span>
                <span className="text-xs text-emerald-600 font-semibold">100% Active</span>
              </div>
              <p className="text-xs text-slate-600">IT, HVAC, DG, RO, Civil & Fire Safety</p>
            </CardContent>
          </Card>

          <Card className="border border-purple-100 bg-gradient-to-br from-purple-50/50 to-white shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Statutory CA Certificate</span>
                <ShieldCheck className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-purple-700">UDIN Verified</span>
              </div>
              <p className="text-xs text-slate-600 truncate">GFR compliant audited statement</p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <TabsList className="grid grid-cols-3 w-full sm:w-auto max-w-md">
                <TabsTrigger value="categories">Expenditure Heads ({data.categories.length})</TabsTrigger>
                <TabsTrigger value="amc">AMC Contracts ({data.amcContracts.length})</TabsTrigger>
                <TabsTrigger value="evidence">Evidences ({evidenceList.length})</TabsTrigger>
              </TabsList>

              {activeTab === "amc" && (
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search vendor, facility, contract..."
                    value={searchContract}
                    onChange={(e) => setSearchContract(e.target.value)}
                    className="pl-9 text-sm"
                  />
                </div>
              )}
            </div>

            {/* Tab 1: Expenditure Categories */}
            <TabsContent value="categories">
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-semibold text-slate-700">Maintenance Category & Head</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-right">Allocated Budget</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-right">Audited Expenditure</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-center">Budget Utilization</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-center">Voucher Head</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-center">Compliance Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.categories.map((cat, idx) => (
                      <TableRow key={idx} className="hover:bg-slate-50/80">
                        <TableCell>
                          <div className="font-semibold text-slate-900">{cat.categoryName}</div>
                          <div className="text-xs text-slate-500">Physical and Academic Support Infrastructure</div>
                        </TableCell>
                        <TableCell className="text-right font-medium text-slate-800">
                          ₹{cat.allocatedBudgetLakhs.toFixed(2)} Lakhs
                        </TableCell>
                        <TableCell className="text-right font-bold text-teal-700">
                          ₹{cat.auditedExpenditureLakhs.toFixed(2)} Lakhs
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="text-xs font-semibold text-slate-800">{cat.percentageUtilized}%</div>
                          <Progress value={cat.percentageUtilized} className="h-1.5 max-w-[80px] mx-auto mt-1" />
                        </TableCell>
                        <TableCell className="text-center font-mono text-xs text-slate-600">
                          {cat.voucherHead}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-emerald-600 text-white">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> CA Audited
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-teal-50/50 font-bold border-t-2 border-teal-200">
                      <TableCell className="text-slate-900">
                        Total Maintenance Expenditure (Metric 4.4.1)
                      </TableCell>
                      <TableCell className="text-right text-slate-900">
                        ₹{data.totalMaintenanceBudgetLakhs.toFixed(2)} Lakhs
                      </TableCell>
                      <TableCell className="text-right text-teal-800 text-base">
                        ₹{data.totalAuditedExpenditureLakhs.toFixed(2)} Lakhs
                      </TableCell>
                      <TableCell className="text-center text-teal-800 font-bold">
                        {((data.totalAuditedExpenditureLakhs / data.totalMaintenanceBudgetLakhs) * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell colSpan={2} className="text-center text-xs text-teal-700">
                        37.94% of Non-Salary Institutional Budget (₹128.50L)
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </ResponsiveTableContainer>
            </TabsContent>

            {/* Tab 2: AMC Contracts */}
            <TabsContent value="amc">
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-semibold text-slate-700">Facility Type & Vendor</TableHead>
                      <TableHead className="font-semibold text-slate-700">Contract No. & Scope</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-right">Annual Value</TableHead>
                      <TableHead className="font-semibold text-slate-700">Contract Validity</TableHead>
                      <TableHead className="font-semibold text-slate-700">Vendor Contact</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContracts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No AMC contracts match your search query.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredContracts.map((amc) => (
                        <TableRow key={amc.id} className="hover:bg-slate-50/80">
                          <TableCell>
                            <Badge variant="outline" className="bg-teal-50 text-teal-800 border-teal-200 mb-1">
                              {amc.facilityType}
                            </Badge>
                            <div className="font-semibold text-slate-900">{amc.vendorName}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-mono text-xs text-slate-700 font-medium">{amc.contractNumber}</div>
                            <div className="text-xs text-slate-500 max-w-sm truncate" title={amc.scopeOfWork}>
                              {amc.scopeOfWork}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-bold text-slate-800">
                            ₹{amc.annualContractValueLakhs.toFixed(2)} Lakhs
                          </TableCell>
                          <TableCell className="text-xs text-slate-600">
                            <div>From: {amc.startDate}</div>
                            <div>To: {amc.endDate}</div>
                          </TableCell>
                          <TableCell className="text-xs text-slate-600">
                            {amc.contactPerson}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-emerald-600 text-white">
                              {amc.status}
                            </Badge>
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
                          No uploaded evidence documents found for Metric 4.4.1.
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
                              className="h-8 text-xs text-teal-700 border-teal-200"
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

      {/* Add AMC Modal */}
      <Dialog open={showAddAmcModal} onOpenChange={setShowAddAmcModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Register Annual Maintenance Contract (AMC)</DialogTitle>
            <DialogDescription>
              Record a maintenance agreement with a vendor for campus physical or academic assets.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddAmc} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-semibold">Facility Maintenance Type</Label>
              <Select
                value={facilityType}
                onValueChange={(val) => setFacilityType(val as AmcContractRecord["facilityType"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IT Equipment & Networking">IT Equipment & Networking</SelectItem>
                  <SelectItem value="Electrical & Diesel Generator">Electrical & Diesel Generator</SelectItem>
                  <SelectItem value="Air Conditioning & HVAC">Air Conditioning & HVAC</SelectItem>
                  <SelectItem value="Civil & Structural Maintenance">Civil & Structural Maintenance</SelectItem>
                  <SelectItem value="Water Treatment & RO">Water Treatment & RO</SelectItem>
                  <SelectItem value="Campus Fire Safety Systems">Campus Fire Safety Systems</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold">Vendor Company Name</Label>
              <Input
                placeholder="e.g. Kirloskar Power Systems Ltd"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Contract / Work Order Number</Label>
              <Input
                placeholder="e.g. AMC/ELEC/2025-26/058"
                value={contractNumber}
                onChange={(e) => setContractNumber(e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Annual Contract Value (₹ Lakhs)</Label>
              <Input
                type="number"
                step="0.01"
                min="0.1"
                value={annualContractValueLakhs}
                onChange={(e) => setAnnualContractValueLakhs(Number(e.target.value))}
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
            <div>
              <Label className="text-xs font-semibold">Scope of Work</Label>
              <Input
                placeholder="Brief summary of maintenance deliverables"
                value={scopeOfWork}
                onChange={(e) => setScopeOfWork(e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Contact Person & Phone</Label>
              <Input
                placeholder="Name & Contact number"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowAddAmcModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-teal-600 text-white hover:bg-teal-700">
                Save AMC Contract
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Upload Evidence Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Maintenance Expenditure Evidence</DialogTitle>
            <DialogDescription>
              Upload CA audited expenditure certificates, AMC agreements, or budget balance sheets.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadEvidence} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-semibold">Document Title</Label>
              <Input
                placeholder="e.g. CA Audited Maintenance Balance Sheet with UDIN"
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
                placeholder="Brief summary of financial audit compliance"
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
              <Button type="submit" disabled={uploading} className="bg-teal-600 text-white hover:bg-teal-700">
                {uploading ? "Uploading..." : "Submit Evidence"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
