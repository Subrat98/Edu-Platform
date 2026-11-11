import { useState, useEffect } from "react";
import {
  Award,
  DollarSign,
  Briefcase,
  FileText,
  Search,
  Plus,
  ExternalLink,
  UploadCloud,
  CheckCircle2,
  Users,
  GraduationCap,
  Calendar,
  Layers,
  Activity,
  Check,
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
  getFacultyEmpowermentData,
  addSeedGrant,
  addFdpSponsorship,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type {
  FacultyEmpowermentData,
  SeedGrantRecord,
  FdpSponsorshipRecord,
  FacultyAppraisalRecord,
  NaacEvidenceDocument,
} from "@/types";

interface FacultyEmpowermentConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function FacultyEmpowermentConsole({ onEvidenceUpdated }: FacultyEmpowermentConsoleProps) {
  const [data, setData] = useState<FacultyEmpowermentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [evidenceList, setEvidenceList] = useState<NaacEvidenceDocument[]>([]);
  const [activeTab, setActiveTab] = useState("seedGrants");
  const [searchQuery, setSearchQuery] = useState("");

  // Add Seed Grant Modal
  const [showAddSeedModal, setShowAddSeedModal] = useState(false);
  const [grantCode, setGrantCode] = useState("SEED-2024-006");
  const [facultyName, setFacultyName] = useState("");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [projectTitle, setProjectTitle] = useState("");
  const [sanctionDate, setSanctionDate] = useState(new Date().toISOString().split("T")[0]);
  const [grantAmountInr, setGrantAmountInr] = useState(150000);
  const [deliverablesOutcome, setDeliverablesOutcome] = useState("2 Scopus indexed publications and 1 prototype");

  // Add FDP Sponsorship Modal
  const [showAddFdpModal, setShowAddFdpModal] = useState(false);
  const [fdpFacultyName, setFdpFacultyName] = useState("");
  const [fdpDepartment, setFdpDepartment] = useState("Computer Science & Engineering");
  const [programmeType, setProgrammeType] = useState<FdpSponsorshipRecord["programmeType"]>("Conference Travel Support");
  const [eventTitle, setEventTitle] = useState("");
  const [organizingBody, setOrganizingBody] = useState("IEEE / ACM");
  const [amountReimbursedInr, setAmountReimbursedInr] = useState(25000);
  const [eventDates, setEventDates] = useState("Nov 15-18, 2024");

  // Upload Evidence Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDept, setEvidenceDept] = useState("Dean R&D / Faculty Affairs");
  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadConsoleData();
  }, []);

  async function loadConsoleData() {
    setLoading(true);
    try {
      const [empData, evidences] = await Promise.all([
        getFacultyEmpowermentData(),
        getEvidenceForMetric("6.3.1"),
      ]);
      setData(empData);
      setEvidenceList(evidences);
    } catch (err) {
      console.error("Failed to load faculty empowerment data", err);
    } finally {
      setLoading(false);
    }
  }

  const handleAddSeedGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyName.trim() || !projectTitle.trim()) return;

    try {
      await addSeedGrant(
        {
          grantCode,
          facultyName,
          department,
          projectTitle,
          sanctionDate,
          grantAmountInr,
          completionStatus: "Ongoing",
          deliverablesOutcome,
          sanctionOrderUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
        },
        { name: "Dr. K. N. Shenoy", role: "Dean Research & Development" }
      );
      setShowAddSeedModal(false);
      setFacultyName("");
      setProjectTitle("");
      loadConsoleData();
    } catch (err) {
      console.error("Failed to add seed grant", err);
    }
  };

  const handleAddFdp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fdpFacultyName.trim() || !eventTitle.trim()) return;

    try {
      await addFdpSponsorship(
        {
          facultyName: fdpFacultyName,
          department: fdpDepartment,
          programmeType,
          eventTitle,
          organizingBody,
          amountReimbursedInr,
          eventDates,
          certificateVerified: true,
        },
        { name: "Prof. S. R. Kulkarni", role: "Faculty Welfare Coordinator" }
      );
      setShowAddFdpModal(false);
      setFdpFacultyName("");
      setEventTitle("");
      loadConsoleData();
    } catch (err) {
      console.error("Failed to add FDP sponsorship", err);
    }
  };

  const handleUploadEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceTitle.trim() || !evidenceFile) return;

    setUploading(true);
    try {
      await uploadEvidenceDocument(
        {
          metricCode: "6.3.1",
          title: evidenceTitle,
          description: evidenceDesc || "Faculty empowerment seed grants sanction letters and travel sponsorship vouchers",
          criterion: 6,
          fileType: "pdf",
          department: evidenceDept,
          academicYear: "2024-25",
          url: URL.createObjectURL(evidenceFile),
        },
        evidenceFile,
        { name: "Dr. K. N. Shenoy", role: "Dean R&D" }
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
          <p className="text-sm text-muted-foreground">Loading Faculty Empowerment & Seed Grants...</p>
        </div>
      </div>
    );
  }

  const filteredSeedGrants = data.seedGrants.filter(
    (g) =>
      g.facultyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.projectTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFdp = data.fdpSponsorships.filter(
    (f) =>
      f.facultyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.organizingBody.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAppraisals = data.appraisals.filter(
    (a) =>
      a.facultyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent p-6 dark:from-emerald-950/20 dark:via-teal-950/20 md:flex-row md:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-emerald-500 font-semibold text-emerald-600 dark:text-emerald-400">
              NAAC Metric 6.3.1
            </Badge>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
              ₹26.70L Institutional Faculty Support
            </Badge>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Staff Development & Institutional Seed Grants</h2>
          <p className="text-sm text-muted-foreground">
            Seed money grants for research initiation, conference travel sponsorship, FDP reimbursement, and PBAS performance appraisal tracking.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowUploadModal(true)} className="gap-2">
            <UploadCloud className="h-4 w-4" />
            Upload Sanction Proofs
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setShowAddFdpModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Travel Support
          </Button>
          <Button size="sm" onClick={() => setShowAddSeedModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Sanction Seed Grant
          </Button>
        </div>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seed Grants Disbursed</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              ₹{data.totalSeedGrantsLakhs.toFixed(2)} Lakhs
            </div>
            <p className="text-xs text-muted-foreground">{data.totalFacultyBenefitedSeedGrants} Research Proposals Funded</p>
            <Progress value={92} className="mt-2 h-1.5 bg-emerald-100 dark:bg-emerald-950" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Travel & FDP Support</CardTitle>
            <Award className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ₹{data.totalTravelConferenceSupportLakhs.toFixed(2)} Lakhs
            </div>
            <p className="text-xs text-muted-foreground">{data.totalFacultySponsoredFdp} Faculty Sponsored</p>
            <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" /> 100% Audited Vouchers
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PBAS Appraisals</CardTitle>
            <Briefcase className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {data.totalAppraisalsProcessed} Processed
            </div>
            <p className="text-xs text-muted-foreground">UGC API Score Criteria</p>
            <p className="mt-2 text-xs text-muted-foreground">100% Eligible Faculty Evaluated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Policy Compliance</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">NAAC A++</div>
            <p className="text-xs text-muted-foreground">Internal Research Promotion Policy</p>
            <p className="mt-2 text-xs text-emerald-600 font-medium">Governing Council Approved</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <TabsList className="grid w-full grid-cols-4 sm:w-auto">
            <TabsTrigger value="seedGrants" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Seed Grants ({data.seedGrants.length})
            </TabsTrigger>
            <TabsTrigger value="fdp" className="gap-2">
              <Award className="h-4 w-4" />
              Travel & FDP ({data.fdpSponsorships.length})
            </TabsTrigger>
            <TabsTrigger value="appraisals" className="gap-2">
              <Briefcase className="h-4 w-4" />
              PBAS Appraisals ({data.appraisals.length})
            </TabsTrigger>
            <TabsTrigger value="evidence" className="gap-2">
              <FileText className="h-4 w-4" />
              Evidences ({evidenceList.length})
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search faculty, department, title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Tab 1: Seed Grants */}
        <TabsContent value="seedGrants" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Institutional Seed Money Grant Register</CardTitle>
              <CardDescription>
                Sanctioned internal grants for early-career and innovative research projects.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Grant Code</TableHead>
                      <TableHead>Principal Investigator</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Project Title</TableHead>
                      <TableHead className="text-right">Sanction Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Deliverables & Outcome</TableHead>
                      <TableHead className="text-right">Sanction Order</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSeedGrants.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                          No seed grants found matching your search.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSeedGrants.map((grant) => (
                        <TableRow key={grant.id}>
                          <TableCell className="font-mono text-xs font-semibold text-emerald-600">
                            {grant.grantCode}
                          </TableCell>
                          <TableCell className="font-medium text-sm">{grant.facultyName}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{grant.department}</TableCell>
                          <TableCell className="max-w-xs text-xs">
                            <span className="font-medium text-foreground">{grant.projectTitle}</span>
                          </TableCell>
                          <TableCell className="text-right font-semibold text-xs text-emerald-700 dark:text-emerald-400">
                            ₹{(grant.grantAmountInr / 100000).toFixed(2)} Lakhs
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                grant.completionStatus === "Completed"
                                  ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                  : "border-blue-300 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                              }
                            >
                              {grant.completionStatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                            {grant.deliverablesOutcome}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => window.open(grant.sanctionOrderUrl, "_blank")}
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

        {/* Tab 2: Travel & FDP Sponsorships */}
        <TabsContent value="fdp" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Conference Travel & FDP Registration Support</CardTitle>
              <CardDescription>
                Financial assistance for presenting papers at peer-reviewed international conferences and attending faculty development programmes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Faculty Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Support Category</TableHead>
                      <TableHead>Event & Organizing Body</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead className="text-right">Reimbursed</TableHead>
                      <TableHead className="text-center">Certificate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFdp.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                          No sponsorship records found matching your search.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredFdp.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium text-sm">{item.facultyName}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{item.department}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {item.programmeType}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs">
                            <div className="font-medium">{item.eventTitle}</div>
                            <div className="text-muted-foreground text-[11px]">{item.organizingBody}</div>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{item.eventDates}</TableCell>
                          <TableCell className="text-right font-medium text-xs text-blue-600">
                            ₹{item.amountReimbursedInr.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-center">
                            {item.certificateVerified ? (
                              <Badge className="bg-emerald-100 text-emerald-800 text-[10px] dark:bg-emerald-950/60 dark:text-emerald-300">
                                Verified
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-[10px]">
                                Pending
                              </Badge>
                            )}
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

        {/* Tab 3: PBAS Appraisals */}
        <TabsContent value="appraisals" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Performance Based Appraisal System (PBAS) Roster</CardTitle>
              <CardDescription>
                Faculty annual Academic Performance Indicators (API) evaluations vetted by IQAC and HoDs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Faculty Name</TableHead>
                      <TableHead>Designation & Department</TableHead>
                      <TableHead>Academic Year</TableHead>
                      <TableHead className="text-right">PBAS API Score</TableHead>
                      <TableHead>HoD Evaluation</TableHead>
                      <TableHead className="text-center">Dossier Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppraisals.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                          No appraisal records found matching your query.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAppraisals.map((apr) => (
                        <TableRow key={apr.id}>
                          <TableCell className="font-medium text-sm">{apr.facultyName}</TableCell>
                          <TableCell className="text-xs">
                            <div>{apr.designation}</div>
                            <div className="text-muted-foreground">{apr.department}</div>
                          </TableCell>
                          <TableCell className="text-xs font-mono">{apr.academicYear}</TableCell>
                          <TableCell className="text-right font-bold text-sm text-purple-600">
                            {apr.pbasScoreApi} / 100
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                apr.hodRecommendation === "Outstanding"
                                  ? "border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400"
                                  : "border-blue-300 text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400"
                              }
                            >
                              {apr.hodRecommendation}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                              <Check className="h-3.5 w-3.5" /> Dossier Archived
                            </span>
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

        {/* Tab 4: Evidences */}
        <TabsContent value="evidence" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">NAAC Metric 6.3.1 Statutory Proofs & Vouchers</CardTitle>
                  <CardDescription>
                    Official seed grant policy, sanction letters, CA audited expenditure certificates, and PBAS circulars.
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
                  <p className="text-xs text-muted-foreground">Upload policy notifications and sanction certificates.</p>
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
                          <FileText className="h-5 w-5 text-emerald-600" />
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

      {/* Modal: Add Seed Grant */}
      <Dialog open={showAddSeedModal} onOpenChange={setShowAddSeedModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sanction Institutional Seed Grant</DialogTitle>
            <DialogDescription>
              Allocate internal seed funds to an approved faculty research initiative.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSeedGrant} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="grantCode" className="text-xs">Grant Code</Label>
                <Input
                  id="grantCode"
                  value={grantCode}
                  onChange={(e) => setGrantCode(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="sanctionDate" className="text-xs">Sanction Date</Label>
                <Input
                  id="sanctionDate"
                  type="date"
                  value={sanctionDate}
                  onChange={(e) => setSanctionDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="facultyName" className="text-xs">Principal Investigator (Faculty Name)</Label>
              <Input
                id="facultyName"
                placeholder="e.g., Dr. Meenakshi Sundaram"
                value={facultyName}
                onChange={(e) => setFacultyName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="dept" className="text-xs">Department</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger id="dept">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science & Engineering">Computer Science & Engineering</SelectItem>
                    <SelectItem value="Electronics & Communication">Electronics & Communication</SelectItem>
                    <SelectItem value="Electrical & Electronics">Electrical & Electronics</SelectItem>
                    <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                    <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                    <SelectItem value="Biotechnology">Biotechnology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="grantAmount" className="text-xs">Sanction Amount (₹ INR)</Label>
                <Input
                  id="grantAmount"
                  type="number"
                  value={grantAmountInr}
                  onChange={(e) => setGrantAmountInr(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="projectTitle" className="text-xs">Project Title</Label>
              <Input
                id="projectTitle"
                placeholder="e.g., Autonomous Edge Computing for Precision Agriculture"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="deliverables" className="text-xs">Expected Deliverables & Outcomes</Label>
              <Input
                id="deliverables"
                value={deliverablesOutcome}
                onChange={(e) => setDeliverablesOutcome(e.target.value)}
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddSeedModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Sanction Grant</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Add FDP / Conference Sponsorship */}
      <Dialog open={showAddFdpModal} onOpenChange={setShowAddFdpModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Register Travel Support / FDP Reimbursement</DialogTitle>
            <DialogDescription>
              Record institutional financial sponsorship for attending conferences and workshops.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddFdp} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="fdpFaculty" className="text-xs">Faculty Name</Label>
              <Input
                id="fdpFaculty"
                placeholder="e.g., Dr. Ananya Sen"
                value={fdpFacultyName}
                onChange={(e) => setFdpFacultyName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="fdpDept" className="text-xs">Department</Label>
                <Select value={fdpDepartment} onValueChange={setFdpDepartment}>
                  <SelectTrigger id="fdpDept">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science & Engineering">Computer Science & Engineering</SelectItem>
                    <SelectItem value="Electronics & Communication">Electronics & Communication</SelectItem>
                    <SelectItem value="Electrical & Electronics">Electrical & Electronics</SelectItem>
                    <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                    <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="progType" className="text-xs">Support Type</Label>
                <Select
                  value={programmeType}
                  onValueChange={(val) => setProgrammeType(val as FdpSponsorshipRecord["programmeType"])}
                >
                  <SelectTrigger id="progType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Conference Travel Support">Conference Travel Support</SelectItem>
                    <SelectItem value="National/International FDP">National/International FDP</SelectItem>
                    <SelectItem value="Professional Body Membership">Professional Body Membership</SelectItem>
                    <SelectItem value="Workshop / NPTEL">Workshop / NPTEL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="eventTitle" className="text-xs">Event Title / Conference Name</Label>
              <Input
                id="eventTitle"
                placeholder="e.g., IEEE International Conference on Smart Grid Sync"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="organizingBody" className="text-xs">Organizing Body</Label>
                <Input
                  id="organizingBody"
                  value={organizingBody}
                  onChange={(e) => setOrganizingBody(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="amount" className="text-xs">Reimbursed Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amountReimbursedInr}
                  onChange={(e) => setAmountReimbursedInr(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="dates" className="text-xs">Event Dates</Label>
              <Input
                id="dates"
                value={eventDates}
                onChange={(e) => setEventDates(e.target.value)}
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddFdpModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Sponsorship</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Upload Official Evidence */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Faculty Support Documents</DialogTitle>
            <DialogDescription>
              Attach statutory seed grant policy, sanction letters, or CA audited financial statements.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadEvidence} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="evidenceTitle" className="text-xs">Document Title</Label>
              <Input
                id="evidenceTitle"
                placeholder="e.g., Seed Grants Sanction Register & Audited UC"
                value={evidenceTitle}
                onChange={(e) => setEvidenceTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="evidenceDept" className="text-xs">Issuing Authority</Label>
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
                placeholder="Details of sanction orders, voucher refs, or appraisal circulars..."
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
