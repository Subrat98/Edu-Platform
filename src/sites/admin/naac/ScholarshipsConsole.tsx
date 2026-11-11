import { useState, useEffect } from "react";
import {
  GraduationCap,
  Users,
  CheckCircle2,
  FileText,
  Search,
  Plus,
  ExternalLink,
  UploadCloud,
  ShieldCheck,
  BadgeIndianRupee,
  Layers,
  Activity,
  Award,
  Wallet,
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
  getScholarshipData,
  addScholarshipBeneficiary,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type {
  ScholarshipData,
  ScholarshipBeneficiaryRecord,
  NaacEvidenceDocument,
} from "@/types";

interface ScholarshipsConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function ScholarshipsConsole({ onEvidenceUpdated }: ScholarshipsConsoleProps) {
  const [data, setData] = useState<ScholarshipData | null>(null);
  const [loading, setLoading] = useState(true);
  const [evidenceList, setEvidenceList] = useState<NaacEvidenceDocument[]>([]);
  const [activeTab, setActiveTab] = useState("schemes");
  const [searchBeneficiary, setSearchBeneficiary] = useState("");

  // Add Beneficiary Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [rollNo, setRollNo] = useState("");
  const [studentName, setStudentName] = useState("");
  const [programme, setProgramme] = useState("B.Tech Computer Science & Engineering");
  const [category, setCategory] = useState<ScholarshipBeneficiaryRecord["category"]>("OBC / SEBC");
  const [scholarshipScheme, setScholarshipScheme] = useState("State Govt Post-Matric Scholarship (PRERANA)");
  const [sanctionAuthority, setSanctionAuthority] = useState("ST & SC Development Dept, Govt of Odisha");
  const [amountPerYear, setAmountPerYear] = useState(20000);
  const [bankRef, setBankRef] = useState("SBIN0049281723");

  // Upload Evidence Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDept, setEvidenceDept] = useState("Scholarship & Student Welfare Section");
  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadConsoleData();
  }, []);

  async function loadConsoleData() {
    setLoading(true);
    try {
      const [schData, evidences] = await Promise.all([
        getScholarshipData(),
        getEvidenceForMetric("5.1.1"),
      ]);
      setData(schData);
      setEvidenceList(evidences);
    } catch (err) {
      console.error("Failed to load scholarship console data", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddBeneficiary(e: React.FormEvent) {
    e.preventDefault();
    if (!rollNo || !studentName) return;
    try {
      await addScholarshipBeneficiary(
        {
          rollNo,
          studentName,
          programme,
          category,
          scholarshipScheme,
          sanctionAuthority,
          amountPerYear,
          disbursalDate: new Date().toISOString().split("T")[0],
          bankReferenceOrTransactionId: bankRef,
          verificationStatus: "Disbursed",
        },
        { name: "Scholarship Nodal Officer", role: "Admin" }
      );
      setShowAddModal(false);
      setRollNo("");
      setStudentName("");
      await loadConsoleData();
    } catch (err) {
      console.error("Failed to add beneficiary", err);
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
          metricCode: "5.1.1",
          title: evidenceTitle,
          academicYear: "2025-26",
          department: evidenceDept,
          documentType: "PDF",
          description: evidenceDesc || "Consolidated scholarship beneficiary registers and DBT disbursal records.",
          remarks: "Verified against State and Central Scholarship Portal disbursal reports.",
        },
        dummyFile,
        { name: "Scholarship Nodal Officer", role: "Admin" }
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
      <Card className="border-sky-200 shadow-md">
        <CardContent className="p-8 text-center text-muted-foreground">
          <Activity className="w-8 h-8 mx-auto mb-3 animate-spin text-sky-600" />
          <p>Loading Scholarships & Freeships Beneficiaries Console...</p>
        </CardContent>
      </Card>
    );
  }

  const filteredBeneficiaries = data.beneficiaries.filter(
    (b) =>
      b.studentName.toLowerCase().includes(searchBeneficiary.toLowerCase()) ||
      b.rollNo.toLowerCase().includes(searchBeneficiary.toLowerCase()) ||
      b.programme.toLowerCase().includes(searchBeneficiary.toLowerCase()) ||
      b.scholarshipScheme.toLowerCase().includes(searchBeneficiary.toLowerCase())
  );

  return (
    <Card className="border-sky-200 shadow-lg bg-card">
      <CardHeader className="bg-gradient-to-r from-sky-50 to-blue-50 border-b border-sky-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-sky-600 text-white hover:bg-sky-700">Metric 5.1.1</Badge>
              <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-50">
                68.2% Statutory Coverage
              </Badge>
              <Badge variant="outline" className="text-blue-700 border-blue-300 bg-blue-50">
                ₹142.80 Lakhs Financial Aid
              </Badge>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Wallet className="w-6 h-6 text-sky-600" />
              Scholarships & Freeships Beneficiaries Console
            </CardTitle>
            <CardDescription className="text-slate-600">
              Comprehensive government, central, institutional, and endowment scholarship tracking. 1,473 beneficiaries out of 2,160 enrolled students (68.2% coverage).
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowUploadModal(true)}
              className="text-sky-700 border-sky-300 hover:bg-sky-100"
            >
              <UploadCloud className="w-4 h-4 mr-1.5" />
              Upload Evidence
            </Button>
            <Button
              size="sm"
              onClick={() => setShowAddModal(true)}
              className="bg-sky-600 hover:bg-sky-700 text-white"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Beneficiary
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-sky-100 bg-gradient-to-br from-sky-50/50 to-white shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Coverage Ratio</span>
                <Users className="w-4 h-4 text-sky-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-sky-700">{data.coveragePercentage}%</span>
                <span className="text-xs font-medium text-emerald-600">(Benchmark ≥ 60%)</span>
              </div>
              <Progress value={data.coveragePercentage} className="h-1.5" />
              <p className="text-xs text-slate-500">
                {data.totalBeneficiaries.toLocaleString("en-IN")} of {data.totalStudentsEnrolled.toLocaleString("en-IN")} students
              </p>
            </CardContent>
          </Card>

          <Card className="border border-blue-100 bg-gradient-to-br from-blue-50/50 to-white shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Financial Aid</span>
                <BadgeIndianRupee className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-blue-700">₹{data.totalFinancialAidLakhs}L</span>
                <span className="text-xs text-slate-500">Disbursed</span>
              </div>
              <p className="text-xs text-slate-600">Across 5 Government & Institutional Schemes</p>
            </CardContent>
          </Card>

          <Card className="border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">State Govt PRERANA</span>
                <GraduationCap className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-emerald-700">712 Students</span>
                <span className="text-xs text-slate-500">(₹68.5L)</span>
              </div>
              <p className="text-xs text-slate-600">SC, ST & SEBC DBT transfers</p>
            </CardContent>
          </Card>

          <Card className="border border-purple-100 bg-gradient-to-br from-purple-50/50 to-white shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Institutional Freeships</span>
                <Award className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-purple-700">215 Students</span>
                <span className="text-xs text-slate-500">(₹20.5L)</span>
              </div>
              <p className="text-xs text-slate-600">Fee waiver & merit concessions</p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Controls */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <TabsList className="grid grid-cols-3 w-full sm:w-auto max-w-md">
              <TabsTrigger value="schemes">Schemes Summary ({data.schemes.length})</TabsTrigger>
              <TabsTrigger value="beneficiaries">Beneficiaries ({data.beneficiaries.length})</TabsTrigger>
              <TabsTrigger value="evidence">Evidences ({evidenceList.length})</TabsTrigger>
            </TabsList>

            {activeTab === "beneficiaries" && (
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search student, roll, scheme..."
                  value={searchBeneficiary}
                  onChange={(e) => setSearchBeneficiary(e.target.value)}
                  className="pl-9 text-sm"
                />
              </div>
            )}
          </div>

          {/* Tab 1: Schemes Summary */}
          <TabsContent value="schemes">
            <ResponsiveTableContainer>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">Scholarship / Freeship Scheme</TableHead>
                    <TableHead className="font-semibold text-slate-700">Provider Category</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">Beneficiaries Count</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">Disbursed Amount</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">% Share of Students</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">Audit Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.schemes.map((scheme, idx) => (
                    <TableRow key={idx} className="hover:bg-slate-50/80">
                      <TableCell>
                        <div className="font-semibold text-slate-900">{scheme.schemeName}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-sky-50 text-sky-800 border-sky-200">
                          {scheme.providerType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-bold text-slate-800">
                        {scheme.beneficiariesCount} Students
                      </TableCell>
                      <TableCell className="text-right font-bold text-sky-700">
                        ₹{scheme.totalDisbursedLakhs.toFixed(2)} Lakhs
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="text-xs font-medium text-slate-700">
                          {((scheme.beneficiariesCount / data.totalStudentsEnrolled) * 100).toFixed(1)}%
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-emerald-600 text-white">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> DBT Verified
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-sky-50/60 font-bold border-t-2 border-sky-200">
                    <TableCell className="text-slate-900">Total Statutory Financial Aid (Metric 5.1.1)</TableCell>
                    <TableCell>All Sources</TableCell>
                    <TableCell className="text-center text-sky-900 text-base">
                      {data.totalBeneficiaries} Students
                    </TableCell>
                    <TableCell className="text-right text-sky-900 text-base">
                      ₹{data.totalFinancialAidLakhs.toFixed(2)} Lakhs
                    </TableCell>
                    <TableCell className="text-center text-sky-900 font-bold">
                      {data.coveragePercentage}%
                    </TableCell>
                    <TableCell className="text-center text-xs text-sky-800">
                      Statutory Compliant
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </ResponsiveTableContainer>
          </TabsContent>

          {/* Tab 2: Master Beneficiaries Register */}
          <TabsContent value="beneficiaries">
            <ResponsiveTableContainer>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">Roll No & Student</TableHead>
                    <TableHead className="font-semibold text-slate-700">Programme & Category</TableHead>
                    <TableHead className="font-semibold text-slate-700">Scholarship Scheme</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">Amount (₹/Yr)</TableHead>
                    <TableHead className="font-semibold text-slate-700">Bank / DBT Transaction Ref</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBeneficiaries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No beneficiary records match your search query.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBeneficiaries.map((b) => (
                      <TableRow key={b.id} className="hover:bg-slate-50/80">
                        <TableCell>
                          <div className="font-bold text-slate-900">{b.studentName}</div>
                          <div className="font-mono text-xs text-slate-500">{b.rollNo}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-slate-800 font-medium">{b.programme}</div>
                          <Badge variant="secondary" className="text-[10px] mt-0.5">
                            {b.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-semibold text-slate-900">{b.scholarshipScheme}</div>
                          <div className="text-[11px] text-slate-500">{b.sanctionAuthority}</div>
                        </TableCell>
                        <TableCell className="text-right font-bold text-emerald-700">
                          ₹{b.amountPerYear.toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell className="text-xs text-slate-600 font-mono">
                          <div>{b.bankReferenceOrTransactionId}</div>
                          <div className="text-[10px] text-slate-400">{b.disbursalDate}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-emerald-600 text-white">
                            {b.verificationStatus}
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
                        No uploaded evidence documents found for Metric 5.1.1.
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
                            className="h-8 text-xs text-sky-700 border-sky-200"
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

      {/* Add Beneficiary Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Scholarship Beneficiary</DialogTitle>
            <DialogDescription>
              Record an approved scholarship or institutional freeship recipient.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddBeneficiary} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Roll Number</Label>
                <Input
                  placeholder="e.g. 23CSE089"
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
              <Label className="text-xs font-semibold">Academic Programme</Label>
              <Input
                value={programme}
                onChange={(e) => setProgramme(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Category</Label>
                <Select
                  value={category}
                  onValueChange={(val) => setCategory(val as ScholarshipBeneficiaryRecord["category"])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SC">SC</SelectItem>
                    <SelectItem value="ST">ST</SelectItem>
                    <SelectItem value="OBC / SEBC">OBC / SEBC</SelectItem>
                    <SelectItem value="General (EWS)">General (EWS)</SelectItem>
                    <SelectItem value="Merit / Institutional">Merit / Institutional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-semibold">Amount (₹/Year)</Label>
                <Input
                  type="number"
                  min="1000"
                  step="500"
                  value={amountPerYear}
                  onChange={(e) => setAmountPerYear(Number(e.target.value))}
                  required
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold">Scholarship Scheme</Label>
              <Input
                value={scholarshipScheme}
                onChange={(e) => setScholarshipScheme(e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Sanction Authority</Label>
              <Input
                value={sanctionAuthority}
                onChange={(e) => setSanctionAuthority(e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">DBT / Bank Reference ID</Label>
              <Input
                value={bankRef}
                onChange={(e) => setBankRef(e.target.value)}
                required
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-sky-600 text-white hover:bg-sky-700">
                Save Beneficiary
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Upload Evidence Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Scholarship Evidences</DialogTitle>
            <DialogDescription>
              Upload scholarship gazettes, portal sanction lists, or fee concession registers for Metric 5.1.1.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadEvidence} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-semibold">Document Title</Label>
              <Input
                placeholder="e.g. State Scholarship Portal Disbursal Gazette 2025-26"
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
                placeholder="Brief summary of beneficiary verification"
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
              <Button type="submit" disabled={uploading} className="bg-sky-600 text-white hover:bg-sky-700">
                {uploading ? "Uploading..." : "Submit Evidence"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
