import { useState, useEffect } from "react";
import {
  Users,
  GraduationCap,
  Award,
  Building,
  CheckCircle2,
  FileText,
  Search,
  Plus,
  ExternalLink,
  UploadCloud,
  ShieldCheck,
  BadgeIndianRupee,
  Activity,
  Calendar,
  Globe,
  Handshake,
  HeartHandshake,
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
  getAlumniAssociationData,
  addAlumniProfile,
  addAlumniChapterMeeting,
  addAlumniContribution,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type {
  AlumniAssociationData,
  AlumniProfileRecord,
  AlumniChapterMeetingRecord,
  AlumniContributionCategory,
  NaacEvidenceDocument,
} from "@/types";

interface AlumniAssociationConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function AlumniAssociationConsole({ onEvidenceUpdated }: AlumniAssociationConsoleProps) {
  const [data, setData] = useState<AlumniAssociationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [evidenceList, setEvidenceList] = useState<NaacEvidenceDocument[]>([]);
  const [activeTab, setActiveTab] = useState("directory");
  const [searchAlumni, setSearchAlumni] = useState("");
  const [filterChapter, setFilterChapter] = useState<string>("All");

  // Add Alumni Profile Modal
  const [showAddProfileModal, setShowAddProfileModal] = useState(false);
  const [name, setName] = useState("");
  const [batchYear, setBatchYear] = useState("2018");
  const [degree, setDegree] = useState("B.Tech Computer Science & Engineering");
  const [currentOrganization, setCurrentOrganization] = useState("");
  const [designation, setDesignation] = useState("");
  const [location, setLocation] = useState("Bengaluru, India");
  const [chapter, setChapter] = useState<AlumniProfileRecord["chapter"]>("Bengaluru Chapter");
  const [contributionType, setContributionType] = useState<AlumniProfileRecord["contributionType"]>("Mentorship & Guest Lectures");
  const [financialContributionInr, setFinancialContributionInr] = useState(50000);
  const [linkedinUrl, setLinkedinUrl] = useState("https://linkedin.com/in/");

  // Add Chapter Meeting Modal
  const [showAddMeetingModal, setShowAddMeetingModal] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState("2025-11-20");
  const [meetingChapter, setMeetingChapter] = useState("Bhubaneswar Central (Main Campus)");
  const [venueOrMode, setVenueOrMode] = useState<AlumniChapterMeetingRecord["venueOrMode"]>("Hybrid (Campus Auditorium & Zoom)");
  const [attendeesCount, setAttendeesCount] = useState(120);
  const [agendaHighlights, setAgendaHighlights] = useState("Annual review of student scholarship and mentorship programmes.");

  // Add Contribution Modal
  const [showAddContribModal, setShowAddContribModal] = useState(false);
  const [contribCategoryName, setContribCategoryName] = useState("");
  const [contribAmountLakhs, setContribAmountLakhs] = useState(2.5);
  const [beneficiaryFund, setBeneficiaryFund] = useState("Central Scholarship Welfare Section");
  const [contribDesc, setContribDesc] = useState("");

  // Upload Evidence Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDept, setEvidenceDept] = useState("Alumni Relations Bureau");
  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadConsoleData();
  }, []);

  async function loadConsoleData() {
    setLoading(true);
    try {
      const [alumniData, evidences] = await Promise.all([
        getAlumniAssociationData(),
        getEvidenceForMetric("5.4.1"),
      ]);
      setData(alumniData);
      setEvidenceList(evidences);
    } catch (err) {
      console.error("Failed to load alumni association console data", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !currentOrganization) return;
    try {
      await addAlumniProfile(
        {
          name,
          batchYear,
          degree,
          currentOrganization,
          designation,
          location,
          chapter,
          contributionType,
          financialContributionInr,
          linkedinUrl,
          isVerified: true,
        },
        { name: "Alumni Relations Officer", role: "Admin" }
      );
      setShowAddProfileModal(false);
      setName("");
      setCurrentOrganization("");
      setDesignation("");
      await loadConsoleData();
    } catch (err) {
      console.error("Failed to add alumni profile", err);
    }
  }

  async function handleAddMeeting(e: React.FormEvent) {
    e.preventDefault();
    if (!meetingTitle) return;
    try {
      await addAlumniChapterMeeting(
        {
          meetingTitle,
          meetingDate,
          chapter: meetingChapter,
          venueOrMode,
          attendeesCount,
          agendaHighlights,
          minutesOfMeetingUrl: "https://documents.eduplatform.ac.in/naac/5.4.1/sample_minutes.pdf",
        },
        { name: "EPAA Secretary", role: "Admin" }
      );
      setShowAddMeetingModal(false);
      setMeetingTitle("");
      await loadConsoleData();
    } catch (err) {
      console.error("Failed to add chapter meeting", err);
    }
  }

  async function handleAddContribution(e: React.FormEvent) {
    e.preventDefault();
    if (!contribCategoryName) return;
    try {
      await addAlumniContribution(
        {
          categoryName: contribCategoryName,
          totalAmountLakhs: contribAmountLakhs,
          beneficiaryDepartmentOrFund: beneficiaryFund,
          description: contribDesc || "Alumni contribution towards campus student support.",
          voucherRef: `ALUM-VOUCH-${Date.now().toString().slice(-4)}`,
        },
        { name: "Finance Officer & Alumni Treasurer", role: "Admin" }
      );
      setShowAddContribModal(false);
      setContribCategoryName("");
      setContribDesc("");
      await loadConsoleData();
    } catch (err) {
      console.error("Failed to add alumni contribution", err);
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
          indicatorCode: "5.4",
          metricCode: "5.4.1",
          title: evidenceTitle,
          academicYear: "2025-26",
          department: evidenceDept,
          documentType: "PDF",
          description: evidenceDesc || "Alumni Association registration certificates, audited balance sheets, and meeting minutes.",
          remarks: "Verified under Societies Registration Act XXI of 1860 records.",
        },
        dummyFile,
        { name: "Alumni Relations Officer", role: "Admin" }
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
      <Card className="border-blue-200 shadow-md">
        <CardContent className="p-8 text-center text-muted-foreground">
          <Activity className="w-8 h-8 mx-auto mb-3 animate-spin text-blue-600" />
          <p>Loading Alumni Association & Chapter Activities Console...</p>
        </CardContent>
      </Card>
    );
  }

  const filteredProfiles = data.alumniProfiles.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchAlumni.toLowerCase()) ||
      p.currentOrganization.toLowerCase().includes(searchAlumni.toLowerCase()) ||
      p.designation.toLowerCase().includes(searchAlumni.toLowerCase()) ||
      p.batchYear.includes(searchAlumni) ||
      p.degree.toLowerCase().includes(searchAlumni.toLowerCase());
    const matchesChapter = filterChapter === "All" || p.chapter === filterChapter;
    return matchesSearch && matchesChapter;
  });

  return (
    <Card className="border-blue-200 shadow-lg bg-card">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-600 text-white hover:bg-blue-700">Metric 5.4.1</Badge>
              <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-50">
                Societies Act XXI Registered
              </Badge>
              <Badge variant="outline" className="text-indigo-700 border-indigo-300 bg-indigo-50">
                ₹24.50 Lakhs Mobilized
              </Badge>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <HeartHandshake className="w-6 h-6 text-blue-600" />
              Alumni Association & Chapter Activities Console (5.4.1)
            </CardTitle>
            <CardDescription className="text-slate-600">
              {data.associationName} ({data.registrationNumber}). Active global network of 4,850 registered alumni, 5 active chapters, and ₹24.50 Lakhs in annual financial/in-kind contributions.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowUploadModal(true)}
              className="text-blue-700 border-blue-300 hover:bg-blue-100"
            >
              <UploadCloud className="w-4 h-4 mr-1.5" />
              Upload Evidence
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddContribModal(true)}
              className="text-emerald-700 border-emerald-300 hover:bg-emerald-50"
            >
              <BadgeIndianRupee className="w-4 h-4 mr-1.5" />
              Add Contribution
            </Button>
            <Button
              size="sm"
              onClick={() => setShowAddProfileModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Register Alumnus
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-blue-100 bg-gradient-to-br from-blue-50/50 to-white shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Registered Alumni</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-blue-700">
                  {data.totalRegisteredAlumni.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-slate-500">Graduates</span>
              </div>
              <p className="text-xs text-slate-600">5 Regional & Overseas Chapters</p>
            </CardContent>
          </Card>

          <Card className="border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Financial Contributions</span>
                <BadgeIndianRupee className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-emerald-700">₹{data.totalFinancialContributionLakhs}L</span>
                <span className="text-xs font-medium text-emerald-600">Audited</span>
              </div>
              <p className="text-xs text-slate-600">Scholarships, Labs & Book Endowments</p>
            </CardContent>
          </Card>

          <Card className="border border-purple-100 bg-gradient-to-br from-purple-50/50 to-white shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Mentorship Sessions</span>
                <Handshake className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-purple-700">{data.mentorshipSessionsConducted} Sessions</span>
              </div>
              <p className="text-xs text-slate-600">Mock interviews, tech talks & webinars</p>
            </CardContent>
          </Card>

          <Card className="border border-amber-100 bg-gradient-to-br from-amber-50/50 to-white shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Statutory Registration</span>
                <ShieldCheck className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-amber-700">Act XXI of 1860</span>
              </div>
              <p className="text-xs text-slate-600 truncate">Regn: 4412/2014-15</p>
            </CardContent>
          </Card>
        </div>

        {/* Association Leadership Banner */}
        <Card className="bg-slate-900 text-white border-none shadow-md overflow-hidden">
          <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600/30 rounded-lg border border-blue-500/40">
                <Building className="w-6 h-6 text-blue-400" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-semibold text-sm tracking-wide text-slate-200">
                  {data.associationName} Executive Council
                </h4>
                <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
                  President: <span className="text-slate-200 font-medium">{data.presidentName}</span> | General Secretary:{" "}
                  <span className="text-slate-200 font-medium">{data.secretaryName}</span> | Registered Office: Central Administrative Block, Main Campus.
                </p>
              </div>
            </div>
            <Badge variant="outline" className="border-blue-400 text-blue-300 bg-blue-950/50 whitespace-nowrap">
              Regd. Date: {data.registrationDate}
            </Badge>
          </CardContent>
        </Card>

        {/* Tab Controls */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <TabsList className="grid grid-cols-4 w-full sm:w-auto max-w-lg">
              <TabsTrigger value="directory">Directory ({data.alumniProfiles.length})</TabsTrigger>
              <TabsTrigger value="meetings">Chapter Meets ({data.meetings.length})</TabsTrigger>
              <TabsTrigger value="contributions">Contributions ({data.financialContributions.length})</TabsTrigger>
              <TabsTrigger value="evidence">Evidences ({evidenceList.length})</TabsTrigger>
            </TabsList>

            {activeTab === "directory" && (
              <div className="flex flex-wrap items-center gap-2">
                <Select value={filterChapter} onValueChange={setFilterChapter}>
                  <SelectTrigger className="w-44 text-xs h-9">
                    <SelectValue placeholder="Filter by Chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Chapters</SelectItem>
                    <SelectItem value="Bhubaneswar Central">Bhubaneswar Central</SelectItem>
                    <SelectItem value="Bengaluru Chapter">Bengaluru Chapter</SelectItem>
                    <SelectItem value="Hyderabad Chapter">Hyderabad Chapter</SelectItem>
                    <SelectItem value="Delhi-NCR Chapter">Delhi-NCR Chapter</SelectItem>
                    <SelectItem value="North America Chapter">North America Chapter</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative w-full sm:w-60">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search name, company, batch..."
                    value={searchAlumni}
                    onChange={(e) => setSearchAlumni(e.target.value)}
                    className="pl-9 text-xs h-9"
                  />
                </div>
              </div>
            )}

            {activeTab === "meetings" && (
              <Button
                size="sm"
                onClick={() => setShowAddMeetingModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-9"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Chapter Meeting
              </Button>
            )}
          </div>

          {/* Tab 1: Alumni Profiles Directory */}
          <TabsContent value="directory">
            <ResponsiveTableContainer>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">Alumnus Name & Batch</TableHead>
                    <TableHead className="font-semibold text-slate-700">Current Organization & Role</TableHead>
                    <TableHead className="font-semibold text-slate-700">Location & Chapter</TableHead>
                    <TableHead className="font-semibold text-slate-700">Contribution Focus</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">Financial Support</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">Profile Link</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfiles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No alumni records match your filter criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProfiles.map((p) => (
                      <TableRow key={p.id} className="hover:bg-slate-50/80">
                        <TableCell>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                            {p.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            Batch of {p.batchYear} | {p.degree}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-slate-900">{p.currentOrganization}</div>
                          <div className="text-xs text-slate-500">{p.designation}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-slate-700 font-medium">{p.location}</div>
                          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 text-[10px] mt-0.5">
                            {p.chapter}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="text-xs bg-slate-100 text-slate-800 border border-slate-200"
                          >
                            {p.contributionType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-bold text-emerald-700 text-sm">
                          ₹{p.financialContributionInr.toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs text-blue-600 hover:text-blue-800"
                            onClick={() => window.open(p.linkedinUrl, "_blank")}
                          >
                            <ExternalLink className="w-3.5 h-3.5 mr-1" />
                            LinkedIn
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ResponsiveTableContainer>
          </TabsContent>

          {/* Tab 2: Chapter Meetings & Minutes */}
          <TabsContent value="meetings">
            <ResponsiveTableContainer>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">Meeting Title & Date</TableHead>
                    <TableHead className="font-semibold text-slate-700">Chapter & Venue</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">Attendees</TableHead>
                    <TableHead className="font-semibold text-slate-700">Agenda & Major Resolutions</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">Minutes of Meeting</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.meetings.map((m) => (
                    <TableRow key={m.id} className="hover:bg-slate-50/80">
                      <TableCell>
                        <div className="font-semibold text-slate-900">{m.meetingTitle}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {m.meetingDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 mb-1">
                          {m.chapter}
                        </Badge>
                        <div className="text-xs text-slate-500">{m.venueOrMode}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-blue-600 text-white font-bold">
                          {m.attendeesCount} Alumni
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-slate-600 max-w-md line-clamp-2" title={m.agendaHighlights}>
                          {m.agendaHighlights}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs text-blue-700 border-blue-200"
                          onClick={() => window.open(m.minutesOfMeetingUrl, "_blank")}
                        >
                          <FileText className="w-3.5 h-3.5 mr-1" />
                          View Minutes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ResponsiveTableContainer>
          </TabsContent>

          {/* Tab 3: Endowments & Lab Sponsorships */}
          <TabsContent value="contributions">
            <ResponsiveTableContainer>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">Endowment / Support Category</TableHead>
                    <TableHead className="font-semibold text-slate-700">Beneficiary Fund / Department</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">Audited Amount</TableHead>
                    <TableHead className="font-semibold text-slate-700">Description & Impact</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">Voucher Head</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">Audit Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.financialContributions.map((c, idx) => (
                    <TableRow key={idx} className="hover:bg-slate-50/80">
                      <TableCell>
                        <div className="font-semibold text-slate-900">{c.categoryName}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200">
                          {c.beneficiaryDepartmentOrFund}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold text-emerald-700 text-sm">
                        ₹{c.totalAmountLakhs.toFixed(2)} Lakhs
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-slate-600 max-w-sm truncate" title={c.description}>
                          {c.description}
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-mono text-xs text-slate-600">
                        {c.voucherRef}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-emerald-600 text-white">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> CA Verified
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-blue-50/60 font-bold border-t-2 border-blue-200">
                    <TableCell className="text-slate-900">Total Alumni Contribution (Metric 5.4.1)</TableCell>
                    <TableCell>Institutional Development</TableCell>
                    <TableCell className="text-right text-blue-900 text-base">
                      ₹{data.totalFinancialContributionLakhs.toFixed(2)} Lakhs
                    </TableCell>
                    <TableCell colSpan={3} className="text-center text-xs text-blue-800">
                      CA Audited Balance Sheet & Society Bank Reconciliation Statement
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </ResponsiveTableContainer>
          </TabsContent>

          {/* Tab 4: Statutory Evidences */}
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
                        No uploaded evidence documents found for Metric 5.4.1.
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
                            className="h-8 text-xs text-blue-700 border-blue-200"
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

      {/* Add Profile Modal */}
      <Dialog open={showAddProfileModal} onOpenChange={setShowAddProfileModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Register Distinguished Alumnus</DialogTitle>
            <DialogDescription>
              Record an alumnus into the official Alumni Association registry and chapters database.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddProfile} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-semibold">Alumnus Full Name</Label>
              <Input
                placeholder="e.g. Er. Debashis Tripathy"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Graduation Batch Year</Label>
                <Input
                  value={batchYear}
                  onChange={(e) => setBatchYear(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Degree & Branch</Label>
                <Input
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Organization</Label>
                <Input
                  placeholder="e.g. Google / Tesla / Tata Steel"
                  value={currentOrganization}
                  onChange={(e) => setCurrentOrganization(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Designation</Label>
                <Input
                  placeholder="e.g. Staff Engineer"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Location / City</Label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Alumni Chapter</Label>
                <Select
                  value={chapter}
                  onValueChange={(val) => setChapter(val as AlumniProfileRecord["chapter"])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bhubaneswar Central">Bhubaneswar Central</SelectItem>
                    <SelectItem value="Bengaluru Chapter">Bengaluru Chapter</SelectItem>
                    <SelectItem value="Hyderabad Chapter">Hyderabad Chapter</SelectItem>
                    <SelectItem value="Delhi-NCR Chapter">Delhi-NCR Chapter</SelectItem>
                    <SelectItem value="North America Chapter">North America Chapter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Contribution Focus</Label>
                <Select
                  value={contributionType}
                  onValueChange={(val) => setContributionType(val as AlumniProfileRecord["contributionType"])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Financial (Endowment)">Financial (Endowment)</SelectItem>
                    <SelectItem value="Mentorship & Guest Lectures">Mentorship & Guest Lectures</SelectItem>
                    <SelectItem value="Placement & Internship Referrals">Placement Referrals</SelectItem>
                    <SelectItem value="Book & Lab Equipment Donation">Lab / Books Donation</SelectItem>
                    <SelectItem value="Executive Office Bearer">Executive Bearer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-semibold">Contribution (₹)</Label>
                <Input
                  type="number"
                  min="0"
                  step="5000"
                  value={financialContributionInr}
                  onChange={(e) => setFinancialContributionInr(Number(e.target.value))}
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold">LinkedIn Profile URL</Label>
              <Input
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowAddProfileModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                Save Alumnus Profile
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Chapter Meeting Modal */}
      <Dialog open={showAddMeetingModal} onOpenChange={setShowAddMeetingModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record Chapter Meeting / Annual Reunion</DialogTitle>
            <DialogDescription>
              Record an executive meeting, chapter networking drive, or annual alumni convention.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddMeeting} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-semibold">Meeting Title</Label>
              <Input
                placeholder="e.g. Pune Alumni Chapter Winter Conclave 2026"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Date</Label>
                <Input
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Attendees Count</Label>
                <Input
                  type="number"
                  value={attendeesCount}
                  onChange={(e) => setAttendeesCount(Number(e.target.value))}
                  required
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold">Chapter</Label>
              <Input
                value={meetingChapter}
                onChange={(e) => setMeetingChapter(e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Mode / Venue</Label>
              <Select
                value={venueOrMode}
                onValueChange={(val) => setVenueOrMode(val as AlumniChapterMeetingRecord["venueOrMode"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hybrid (Campus Auditorium & Zoom)">Hybrid (Campus Auditorium & Zoom)</SelectItem>
                  <SelectItem value="In-Person (Hotel Mayfair)">In-Person (Hotel Mayfair)</SelectItem>
                  <SelectItem value="In-Person (Bengaluru Club)">In-Person (Bengaluru Club)</SelectItem>
                  <SelectItem value="Virtual Google Meet">Virtual Google Meet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold">Key Agenda & Resolutions</Label>
              <Input
                value={agendaHighlights}
                onChange={(e) => setAgendaHighlights(e.target.value)}
                required
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowAddMeetingModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700">
                Save Meeting
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Contribution Modal */}
      <Dialog open={showAddContribModal} onOpenChange={setShowAddContribModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record Alumni Financial / In-Kind Contribution</DialogTitle>
            <DialogDescription>
              Record audited financial endowments, laboratory hardware, or book donations for Metric 5.4.1.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddContribution} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-semibold">Endowment / Support Category</Label>
              <Input
                placeholder="e.g. Electric Vehicle Prototype Lab Equipment Fund"
                value={contribCategoryName}
                onChange={(e) => setContribCategoryName(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Amount (₹ Lakhs)</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={contribAmountLakhs}
                  onChange={(e) => setContribAmountLakhs(Number(e.target.value))}
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Beneficiary Department</Label>
                <Input
                  value={beneficiaryFund}
                  onChange={(e) => setBeneficiaryFund(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold">Description & Impact</Label>
              <Input
                placeholder="Details of sponsored assets or scholarship awards"
                value={contribDesc}
                onChange={(e) => setContribDesc(e.target.value)}
                required
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowAddContribModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 text-white hover:bg-emerald-700">
                Record Contribution
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Upload Evidence Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Alumni Association Evidence</DialogTitle>
            <DialogDescription>
              Upload Certificate of Registration under Societies Act, audited accounts, or reunion minutes.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadEvidence} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-semibold">Document Title</Label>
              <Input
                placeholder="e.g. EPAA Registration Certificate under Societies Act XXI"
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
                placeholder="Brief summary of statutory compliance"
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
              <Button type="submit" disabled={uploading} className="bg-blue-600 text-white hover:bg-blue-700">
                {uploading ? "Uploading..." : "Submit Evidence"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
