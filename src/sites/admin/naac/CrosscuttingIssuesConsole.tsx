import { useState, useEffect } from "react";
import {
  BookOpen,
  Award,
  CheckCircle2,
  Users,
  Search,
  Plus,
  Download,
  ExternalLink,
  UploadCloud,
  FileText,
  Sparkles,
  Heart,
  Leaf,
  Scale,
  ShieldCheck,
  Building2,
  GraduationCap,
  Layers,
  Filter,
  Eye,
  Calendar,
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveTableContainer } from "@/components/admin/ResponsiveTableContainer";
import {
  getCrosscuttingIssuesData,
  addCrosscuttingCourseMapping,
  addCrosscuttingActivity,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type {
  CrosscuttingCourseMapping,
  CrosscuttingCoCurricularActivity,
  CrosscuttingTheme,
  NaacEvidenceDocument,
} from "@/types";

interface CrosscuttingIssuesConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function CrosscuttingIssuesConsole({ onEvidenceUpdated }: CrosscuttingIssuesConsoleProps) {
  const [activeTab, setActiveTab] = useState("mappings");
  const [, setLoading] = useState(true);

  // Data states
  const [courseMappings, setCourseMappings] = useState<CrosscuttingCourseMapping[]>([]);
  const [activities, setActivities] = useState<CrosscuttingCoCurricularActivity[]>([]);
  const [themeCounts, setThemeCounts] = useState({ gender: 6, environment: 8, humanValues: 7, professionalEthics: 7 });
  const [totalActivities, setTotalActivities] = useState(6);
  const [totalParticipants, setTotalParticipants] = useState(2460);
  const [attachedEvidence, setAttachedEvidence] = useState<NaacEvidenceDocument[]>([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTheme, setSelectedTheme] = useState<string>("all");
  const [selectedDept, setSelectedDept] = useState<string>("all");

  // Modals
  const [mappingModalOpen, setMappingModalOpen] = useState(false);
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<CrosscuttingCourseMapping | null>(null);

  // Form states - Mapping
  const [mCode, setMCode] = useState("");
  const [mTitle, setMTitle] = useState("");
  const [mProg, setMProg] = useState("B.Sc. Computer Science (Honours)");
  const [mDept, setMDept] = useState("Department of Computer Science & Applications");
  const [mType, setMType] = useState<CrosscuttingCourseMapping["courseType"]>("Core Course");
  const [mTheme, setMTheme] = useState<CrosscuttingTheme>("Professional Ethics & Integrity");
  const [mUnit, setMUnit] = useState("Unit III: Professional Conduct & Data Protection");
  const [mUnitTitle, setMUnitTitle] = useState("Legal & Ethical Responsibilities in Computing");
  const [mExcerpt, setMExcerpt] = useState("");
  const [mKeywords, setMKeywords] = useState("Ethics, Data Privacy, IPR");
  const [mHours, setMHours] = useState(14);
  const [mOutcomes, setMOutcomes] = useState("Students demonstrate professional ethical standards.");

  // Form states - Activity
  const [actTitle, setActTitle] = useState("");
  const [actTheme, setActTheme] = useState<CrosscuttingTheme>("Gender Sensitization & Equity");
  const [actCell, setActCell] = useState("Internal Complaints Committee (ICC)");
  const [actDate, setActDate] = useState("");
  const [actParticipants, setActParticipants] = useState(250);
  const [actOutcome, setActOutcome] = useState("");

  // Form states - Evidence
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [evidenceRemarks, setEvidenceRemarks] = useState("Verified by IQAC Coordinator.");

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getCrosscuttingIssuesData();
      setCourseMappings(data.courseMappings);
      setActivities(data.activities);
      setThemeCounts(data.coursesByTheme);
      setTotalActivities(data.totalActivities);
      setTotalParticipants(data.totalParticipants);

      const ev = await getEvidenceForMetric("1.3.1");
      setAttachedEvidence(ev);
    } catch (err) {
      console.error("Failed to load crosscutting issues data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateMapping = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mCode || !mTitle || !mExcerpt) return;

    try {
      await addCrosscuttingCourseMapping(
        {
          courseCode: mCode,
          courseTitle: mTitle,
          programmeName: mProg,
          department: mDept,
          courseType: mType,
          theme: mTheme,
          highlightedUnit: mUnit,
          unitTitle: mUnitTitle,
          syllabusExcerpt: mExcerpt,
          highlightedKeywords: mKeywords.split(",").map((k) => k.trim()),
          contactHoursDevoted: Number(mHours),
          learningOutcomes: mOutcomes,
          syllabusPdfUrl: `/documents/naac/crosscutting/${mCode}_Syllabus.pdf`,
          evidenceId: "evi-131-mapping-01",
        },
        { name: "Dr. Snigdha Mohanty", role: "IQAC Coordinator" }
      );
      setMappingModalOpen(false);
      resetMappingForm();
      loadData();
    } catch (err) {
      console.error("Failed to add course mapping", err);
    }
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actTitle || !actDate) return;

    try {
      await addCrosscuttingActivity(
        {
          title: actTitle,
          theme: actTheme,
          organizingCell: actCell,
          eventDate: actDate,
          academicYear: "2025-26",
          participantsCount: Number(actParticipants),
          outcomeSummary: actOutcome,
          reportUrl: `/documents/naac/evidence/${actTitle.replace(/\s+/g, "_")}.pdf`,
          evidenceId: "evi-131-reports-01",
        },
        { name: "Dr. Snigdha Mohanty", role: "IQAC Coordinator" }
      );
      setActivityModalOpen(false);
      resetActivityForm();
      loadData();
    } catch (err) {
      console.error("Failed to add co-curricular activity", err);
    }
  };

  const handleUploadEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceTitle) return;

    try {
      await uploadEvidenceDocument(
        {
          criterionId: 1,
          indicatorCode: "1.3",
          metricCode: "1.3.1",
          title: evidenceTitle,
          academicYear: "2025-26",
          department: "IQAC",
          documentType: "PDF",
          description: evidenceDesc || "Evidentiary documentation supporting Metric 1.3.1 (Crosscutting Issues Integration).",
          fileName: `${evidenceTitle.replace(/\s+/g, "_")}.pdf`,
          fileSize: "3.5 MB",
          evidenceUrl: `/documents/naac/evidence/${evidenceTitle.replace(/\s+/g, "_")}.pdf`,
          remarks: evidenceRemarks,
        },
        { name: "Dr. Snigdha Mohanty", role: "IQAC Coordinator" }
      );

      setEvidenceModalOpen(false);
      setEvidenceTitle("");
      setEvidenceDesc("");
      loadData();
      if (onEvidenceUpdated) onEvidenceUpdated();
    } catch (err) {
      console.error("Failed to upload evidence", err);
    }
  };

  const resetMappingForm = () => {
    setMCode("");
    setMTitle("");
    setMExcerpt("");
    setMKeywords("Ethics, Data Privacy, IPR");
  };

  const resetActivityForm = () => {
    setActTitle("");
    setActOutcome("");
    setActParticipants(250);
  };

  const openPreview = (item: CrosscuttingCourseMapping) => {
    setPreviewItem(item);
    setPreviewModalOpen(true);
  };

  // Filtered course mappings
  const filteredMappings = courseMappings.filter((c) => {
    const matchesSearch =
      searchQuery === "" ||
      c.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.highlightedUnit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.highlightedKeywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTheme =
      selectedTheme === "all" || c.theme === selectedTheme;

    const matchesDept =
      selectedDept === "all" || c.department.includes(selectedDept);

    return matchesSearch && matchesTheme && matchesDept;
  });

  const getThemeBadge = (theme: CrosscuttingTheme) => {
    switch (theme) {
      case "Gender Sensitization & Equity":
        return (
          <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-[10px] font-semibold gap-1">
            <Heart className="size-3" />
            <span>Gender Equity</span>
          </Badge>
        );
      case "Environment & Sustainability":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold gap-1">
            <Leaf className="size-3" />
            <span>Environment & Sustainability</span>
          </Badge>
        );
      case "Human Values & Constitutional Rights":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-semibold gap-1">
            <Users className="size-3" />
            <span>Human Values</span>
          </Badge>
        );
      case "Professional Ethics & Integrity":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-[10px] font-semibold gap-1">
            <Scale className="size-3" />
            <span>Professional Ethics</span>
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 via-card to-background shadow-xs overflow-hidden">
      {/* Header Banner */}
      <CardHeader className="bg-emerald-500/10 border-b border-emerald-500/20 py-4 px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex size-7 items-center justify-center rounded-md bg-emerald-600 text-white font-mono text-xs font-bold shrink-0">
                1.3.1
              </span>
              <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold">
                Criterion 1 • Key Indicator 1.3
              </Badge>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold">
                ✓ 28 Courses Mapped
              </Badge>
              <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-[11px]">
                100% UG Programmes Covered
              </Badge>
            </div>
            <CardTitle className="text-base sm:text-lg font-bold text-foreground">
              Crosscutting Issues Integration Console (Gender, Environment, Values & Ethics)
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground leading-relaxed">
              Curricular mapping of 28 core, AECC, SEC, and elective courses integrating the four statutory NAAC themes with highlighted syllabus units, supported by 6 co-curricular student outreach activities (2,460 participants).
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <Button
              size="sm"
              variant="default"
              onClick={() => setMappingModalOpen(true)}
              className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Plus className="size-3.5" />
              <span>Map New Course</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setActivityModalOpen(true)}
              className="gap-1.5 text-xs border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10"
            >
              <Calendar className="size-3.5" />
              <span>Record Activity</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEvidenceModalOpen(true)}
              className="gap-1.5 text-xs border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10"
            >
              <UploadCloud className="size-3.5" />
              <span>Attach Evidence</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-6">
        {/* Thematic Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Pillar 1: Gender Sensitization */}
          <Card className="border-rose-500/20 bg-rose-500/5 shadow-2xs hover:border-rose-500/40 transition-colors">
            <CardContent className="p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
                  Gender Sensitization & Equity
                </span>
                <span className="flex size-7 items-center justify-center rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <Heart className="size-3.5" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-foreground">{themeCounts.gender}</span>
                <span className="text-xs text-muted-foreground">Mapped Courses</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-normal">
                POSH Act 2013, Women in Literature, Grassroots Panchayati Raj & Inclusive Workplaces.
              </p>
            </CardContent>
          </Card>

          {/* Pillar 2: Environment & Sustainability */}
          <Card className="border-emerald-500/20 bg-emerald-500/5 shadow-2xs hover:border-emerald-500/40 transition-colors">
            <CardContent className="p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  Environment & Sustainability
                </span>
                <span className="flex size-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Leaf className="size-3.5" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-foreground">{themeCounts.environment}</span>
                <span className="text-xs text-muted-foreground">Mapped Courses</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Compulsory AECC Environmental Studies, Green Chemistry, Renewable Energy & Mangrove Ecology.
              </p>
            </CardContent>
          </Card>

          {/* Pillar 3: Human Values & Constitutional Rights */}
          <Card className="border-amber-500/20 bg-amber-500/5 shadow-2xs hover:border-amber-500/40 transition-colors">
            <CardContent className="p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                  Human Values & Rights
                </span>
                <span className="flex size-7 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Users className="size-3.5" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-foreground">{themeCounts.humanValues}</span>
                <span className="text-xs text-muted-foreground">Mapped Courses</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Universal Human Values (UHV), Indian Constitution, Gandhian Peace & Digital Civics.
              </p>
            </CardContent>
          </Card>

          {/* Pillar 4: Professional Ethics & Integrity */}
          <Card className="border-blue-500/20 bg-blue-500/5 shadow-2xs hover:border-blue-500/40 transition-colors">
            <CardContent className="p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-300">
                  Professional Ethics & Integrity
                </span>
                <span className="flex size-7 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Scale className="size-3.5" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-foreground">{themeCounts.professionalEthics}</span>
                <span className="text-xs text-muted-foreground">Mapped Courses</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-normal">
                DPDP Act 2023, ACM Software Ethics, Turnitin Anti-Plagiarism & Corporate Governance.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Console Views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full h-auto p-1 bg-muted/60">
            <TabsTrigger value="mappings" className="text-xs py-2 gap-1.5 data-[state=active]:bg-background">
              <BookOpen className="size-3.5" />
              <span>Course Mappings ({courseMappings.length})</span>
            </TabsTrigger>
            <TabsTrigger value="excerpts" className="text-xs py-2 gap-1.5 data-[state=active]:bg-background">
              <Eye className="size-3.5" />
              <span>Highlighted Unit Excerpts</span>
            </TabsTrigger>
            <TabsTrigger value="activities" className="text-xs py-2 gap-1.5 data-[state=active]:bg-background">
              <Calendar className="size-3.5" />
              <span>Co-Curricular Events ({activities.length})</span>
            </TabsTrigger>
            <TabsTrigger value="policies" className="text-xs py-2 gap-1.5 data-[state=active]:bg-background">
              <ShieldCheck className="size-3.5" />
              <span>Institutional Policy Charters</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: COURSE MAPPINGS */}
          <TabsContent value="mappings" className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search course title, code (e.g. AECC-ENV101), unit title or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-xs sm:text-sm"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                  <SelectTrigger className="h-9 text-xs w-[200px]">
                    <SelectValue placeholder="All Themes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Themes ({courseMappings.length})</SelectItem>
                    <SelectItem value="Gender Sensitization & Equity">Gender Sensitization (6)</SelectItem>
                    <SelectItem value="Environment & Sustainability">Environment & Sustainability (8)</SelectItem>
                    <SelectItem value="Human Values & Constitutional Rights">Human Values & Rights (7)</SelectItem>
                    <SelectItem value="Professional Ethics & Integrity">Professional Ethics (7)</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedDept} onValueChange={setSelectedDept}>
                  <SelectTrigger className="h-9 text-xs w-[140px]">
                    <SelectValue placeholder="All Depts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Commerce">Commerce</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Political Science">Political Science</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Botany">Botany</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Humanities">Humanities</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Course Mappings Table (Desktop) */}
            <div className="hidden md:block">
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/20">
                      <TableHead className="w-28 font-semibold">Course Code</TableHead>
                      <TableHead className="font-semibold min-w-[220px]">Course Title & Type</TableHead>
                      <TableHead className="w-48 font-semibold">Crosscutting Theme</TableHead>
                      <TableHead className="font-semibold min-w-[240px]">Highlighted Unit & Focus</TableHead>
                      <TableHead className="w-24 font-semibold text-center">Contact Hrs</TableHead>
                      <TableHead className="w-32 font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMappings.map((c) => (
                      <TableRow key={c.id} className="hover:bg-muted/15">
                        <TableCell className="align-top font-mono text-xs font-bold text-foreground">
                          {c.courseCode}
                          <Badge variant="outline" className="text-[10px] block mt-1 w-fit font-sans">
                            {c.courseType}
                          </Badge>
                        </TableCell>
                        <TableCell className="align-top">
                          <p className="font-bold text-xs sm:text-sm text-foreground">{c.courseTitle}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {c.programmeName}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {c.department.replace("Department of ", "")}
                          </p>
                        </TableCell>
                        <TableCell className="align-top">
                          {getThemeBadge(c.theme)}
                        </TableCell>
                        <TableCell className="align-top">
                          <p className="font-semibold text-xs text-foreground line-clamp-1">
                            {c.highlightedUnit}
                          </p>
                          <div className="flex items-center gap-1 mt-1 flex-wrap">
                            {c.highlightedKeywords.slice(0, 3).map((kw, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="text-[9px] px-1.5 py-0 bg-muted/60 text-foreground"
                              >
                                {kw}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="align-top text-center">
                          <Badge className="bg-muted text-foreground border border-border/60 text-xs font-mono">
                            {c.contactHoursDevoted} Hrs
                          </Badge>
                        </TableCell>
                        <TableCell className="align-top text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() => openPreview(c)}
                              className="text-[11px] gap-1 h-7 px-2"
                            >
                              <Eye className="size-3 text-emerald-600" />
                              <span>Syllabus</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ResponsiveTableContainer>
            </div>

            {/* Course Mappings Mobile Card View */}
            <div className="md:hidden divide-y divide-border/60 border rounded-lg overflow-hidden bg-card">
              {filteredMappings.map((c) => (
                <div key={c.id} className="p-3.5 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-xs font-bold text-foreground">{c.courseCode}</span>
                        <Badge variant="outline" className="text-[9px] px-1 py-0">
                          {c.courseType}
                        </Badge>
                      </div>
                      <h4 className="font-bold text-xs text-foreground mt-1">{c.courseTitle}</h4>
                    </div>
                    {getThemeBadge(c.theme)}
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="font-medium text-foreground">{c.highlightedUnit}</p>
                    <p className="line-clamp-2 text-[11px] bg-muted/30 p-2 rounded border border-border/40">
                      "{c.syllabusExcerpt}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40">
                    <span className="text-[11px] text-muted-foreground">
                      {c.contactHoursDevoted} Contact Hours
                    </span>
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => openPreview(c)}
                      className="text-[11px] gap-1 h-6 px-2"
                    >
                      <Eye className="size-3 text-emerald-600" />
                      <span>View Excerpt</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* TAB 2: HIGHLIGHTED UNIT EXCERPTS GALLERY */}
          <TabsContent value="excerpts" className="space-y-4">
            <div className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-1">
              <h4 className="text-sm font-bold text-foreground">Syllabus Excerpt & Color-Coded Highlighter View</h4>
              <p className="text-xs text-muted-foreground">
                Authentic unit-level curriculum text extracts demonstrating where crosscutting topics are embedded, as mandated by NAAC Peer Team verification guidelines.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredMappings.slice(0, 8).map((c) => (
                <Card key={c.id} className="border-border/60 bg-card shadow-2xs hover:border-emerald-500/30 transition-colors">
                  <CardHeader className="py-3 px-4 border-b border-border/40 bg-muted/10">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-foreground">{c.courseCode}</span>
                        <span className="text-xs font-bold text-foreground truncate max-w-[200px]">
                          {c.courseTitle}
                        </span>
                      </div>
                      {getThemeBadge(c.theme)}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2.5">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                        {c.highlightedUnit}
                      </span>
                      <h5 className="text-xs font-bold text-foreground mt-0.5">
                        {c.unitTitle}
                      </h5>
                    </div>

                    <div className="rounded-md bg-muted/30 border border-border/50 p-3 text-xs leading-relaxed text-foreground">
                      {c.syllabusExcerpt}
                    </div>

                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                        Highlighted Core Competencies:
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {c.highlightedKeywords.map((kw, idx) => (
                          <Badge
                            key={idx}
                            className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-[10px]"
                          >
                            ✓ {kw}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px]">
                      <span className="text-muted-foreground">
                        {c.contactHoursDevoted} Hours Devoted
                      </span>
                      <a
                        href={c.syllabusPdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline flex items-center gap-1 font-medium"
                      >
                        <FileText className="size-3" />
                        <span>Full Syllabus PDF</span>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* TAB 3: CO-CURRICULAR ACTIVITIES */}
          <TabsContent value="activities" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 rounded-lg border border-border/60 bg-muted/20">
              <div>
                <h4 className="text-sm font-bold text-foreground">Experiential Learning & Co-Curricular Initiatives</h4>
                <p className="text-xs text-muted-foreground">
                  Statutory cell initiatives (ICC, Eco Club, NSS, Red Cross) reinforcing crosscutting values through workshops, blood drives, and community outreach.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setActivityModalOpen(true)}
                className="gap-1.5 text-xs shrink-0"
              >
                <Plus className="size-3.5" />
                <span>Record New Activity</span>
              </Button>
            </div>

            <ResponsiveTableContainer>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20">
                    <TableHead className="w-28 font-semibold">Date</TableHead>
                    <TableHead className="font-semibold min-w-[220px]">Event Title & Organizing Cell</TableHead>
                    <TableHead className="w-48 font-semibold">Thematic Domain</TableHead>
                    <TableHead className="font-semibold min-w-[240px]">Key Outcomes & Impact</TableHead>
                    <TableHead className="w-28 font-semibold text-center">Participants</TableHead>
                    <TableHead className="w-24 font-semibold text-right">Report</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map((a) => (
                    <TableRow key={a.id} className="hover:bg-muted/15">
                      <TableCell className="align-top font-mono text-xs text-foreground">
                        {a.eventDate}
                        <Badge variant="outline" className="text-[10px] block mt-1 w-fit font-sans">
                          {a.academicYear}
                        </Badge>
                      </TableCell>
                      <TableCell className="align-top">
                        <p className="font-bold text-xs sm:text-sm text-foreground">{a.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 font-medium flex items-center gap-1">
                          <Building2 className="size-3 text-primary" />
                          <span>{a.organizingCell}</span>
                        </p>
                      </TableCell>
                      <TableCell className="align-top">
                        {getThemeBadge(a.theme)}
                      </TableCell>
                      <TableCell className="align-top text-xs text-muted-foreground">
                        {a.outcomeSummary}
                      </TableCell>
                      <TableCell className="align-top text-center font-bold text-xs text-foreground">
                        {a.participantsCount}
                      </TableCell>
                      <TableCell className="align-top text-right">
                        <Button asChild size="xs" variant="ghost" className="gap-1 text-xs text-primary">
                          <a href={a.reportUrl} target="_blank" rel="noreferrer">
                            <Download className="size-3" />
                            <span>PDF</span>
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ResponsiveTableContainer>
          </TabsContent>

          {/* TAB 4: INSTITUTIONAL POLICIES */}
          <TabsContent value="policies" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <Card className="border-rose-500/20 bg-card shadow-2xs">
                <CardHeader className="py-3 px-4 border-b border-border/40">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Heart className="size-4 text-rose-600" />
                      <span>Gender Equity & POSH Policy Charter</span>
                    </CardTitle>
                    <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-[10px]">
                      Governing Body Approved
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-2 text-xs text-muted-foreground">
                  <p>
                    Institutional statutory policy establishing the Internal Complaints Committee (ICC), mandatory gender sensitization workshops for all first-year students, and equal opportunity employment guarantees.
                  </p>
                  <div className="pt-2">
                    <Button variant="outline" size="xs" asChild className="gap-1 text-xs">
                      <a href="/documents/naac/evidence/Code_of_Conduct_and_Institutional_Policies_Handbook.pdf" target="_blank" rel="noreferrer">
                        <FileText className="size-3 text-rose-600" />
                        <span>Download Policy Document</span>
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-500/20 bg-card shadow-2xs">
                <CardHeader className="py-3 px-4 border-b border-border/40">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Leaf className="size-4 text-emerald-600" />
                      <span>Zero-Waste Green Campus & Climate Charter</span>
                    </CardTitle>
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px]">
                      Green Audit Certified
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-2 text-xs text-muted-foreground">
                  <p>
                    Campus environmental charter committing to 100% single-use plastic ban, 50 kW rooftop solar generation, rainwater harvesting pits, and annual carbon footprint audits by external bodies.
                  </p>
                  <div className="pt-2">
                    <Button variant="outline" size="xs" asChild className="gap-1 text-xs">
                      <a href="/documents/naac/evidence/Green_Audit_Miyawaki_Drive_Report_2025.pdf" target="_blank" rel="noreferrer">
                        <FileText className="size-3 text-emerald-600" />
                        <span>Download Green Charter</span>
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-amber-500/20 bg-card shadow-2xs">
                <CardHeader className="py-3 px-4 border-b border-border/40">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Users className="size-4 text-amber-600" />
                      <span>Student Code of Conduct & Human Values Manual</span>
                    </CardTitle>
                    <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px]">
                      UGC Guidelines Compliant
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-2 text-xs text-muted-foreground">
                  <p>
                    Universal Human Values manual outlining anti-ragging strictures, mutual respect, inclusive campus culture, and social outreach obligations through NSS and Youth Red Cross.
                  </p>
                  <div className="pt-2">
                    <Button variant="outline" size="xs" asChild className="gap-1 text-xs">
                      <a href="/documents/naac/evidence/Code_of_Conduct_and_Institutional_Policies_Handbook.pdf" target="_blank" rel="noreferrer">
                        <FileText className="size-3 text-amber-600" />
                        <span>Download Values Manual</span>
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-500/20 bg-card shadow-2xs">
                <CardHeader className="py-3 px-4 border-b border-border/40">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Scale className="size-4 text-blue-600" />
                      <span>Research Ethics & Anti-Plagiarism Regulations</span>
                    </CardTitle>
                    <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-[10px]">
                      UGC 2018 Gazetted
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-2 text-xs text-muted-foreground">
                  <p>
                    Strict institutional protocol governing dissertation originality, Turnitin/Urkund verification requirements (maximum 10% similarity allowance), and faculty research integrity board mandates.
                  </p>
                  <div className="pt-2">
                    <Button variant="outline" size="xs" asChild className="gap-1 text-xs">
                      <a href="/documents/naac/evidence/Research_Ethics_Workshop_Report_2025.pdf" target="_blank" rel="noreferrer">
                        <FileText className="size-3 text-blue-600" />
                        <span>Download Ethics Regulations</span>
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Attached Evidences Section */}
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600" />
                <span>NAAC Peer Team Evidence Dossier (Metric 1.3.1)</span>
              </h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Consolidated matrix of 28 mapped courses with highlighted units, statutory policy charters, and geo-tagged activity reports.
              </p>
            </div>
            <Button
              size="xs"
              variant="outline"
              onClick={() => setEvidenceModalOpen(true)}
              className="gap-1 text-xs shrink-0 self-start sm:self-auto"
            >
              <UploadCloud className="size-3" />
              <span>Attach New Evidence</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
            {attachedEvidence.map((ev) => (
              <div
                key={ev.id}
                className="rounded border border-border/60 bg-card p-3 text-xs space-y-1.5 shadow-2xs hover:border-emerald-500/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="font-semibold text-foreground line-clamp-2 leading-tight">
                    {ev.title}
                  </span>
                  <Badge variant="outline" className="text-[9px] font-mono shrink-0">
                    {ev.documentType}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-[10px] line-clamp-2">
                  {ev.description}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[10px]">
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ {ev.status}
                  </span>
                  <a
                    href={ev.evidenceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline flex items-center gap-0.5 font-medium"
                  >
                    <span>View File</span>
                    <ExternalLink className="size-2.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      {/* MODAL 1: MAP NEW COURSE */}
      <Dialog open={mappingModalOpen} onOpenChange={setMappingModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <BookOpen className="size-4 text-emerald-600" />
              <span>Map Course to Crosscutting Issues (1.3.1)</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Link a core or elective course to Gender, Environment, Human Values or Professional Ethics with highlighted unit text.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateMapping} className="space-y-3.5 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Course Code *</Label>
                <Input
                  placeholder="e.g. SOC-CC202"
                  value={mCode}
                  onChange={(e) => setMCode(e.target.value)}
                  className="h-8 text-xs font-mono uppercase"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Course Type</Label>
                <Select value={mType} onValueChange={(v) => setMType(v as any)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Core Course">Core Course</SelectItem>
                    <SelectItem value="Ability Enhancement (AECC)">Ability Enhancement (AECC)</SelectItem>
                    <SelectItem value="Skill Enhancement (SEC)">Skill Enhancement (SEC)</SelectItem>
                    <SelectItem value="Generic Elective (GE)">Generic Elective (GE)</SelectItem>
                    <SelectItem value="Discipline Specific (DSE)">Discipline Specific (DSE)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Course Title *</Label>
              <Input
                placeholder="e.g. Social Stratification, Gender & Human Rights"
                value={mTitle}
                onChange={(e) => setMTitle(e.target.value)}
                className="h-8 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Thematic Pillar *</Label>
                <Select value={mTheme} onValueChange={(v) => setMTheme(v as any)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gender Sensitization & Equity">Gender Sensitization & Equity</SelectItem>
                    <SelectItem value="Environment & Sustainability">Environment & Sustainability</SelectItem>
                    <SelectItem value="Human Values & Constitutional Rights">Human Values & Constitutional Rights</SelectItem>
                    <SelectItem value="Professional Ethics & Integrity">Professional Ethics & Integrity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Contact Hours Devoted</Label>
                <Input
                  type="number"
                  min={4}
                  value={mHours}
                  onChange={(e) => setMHours(Number(e.target.value))}
                  className="h-8 text-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Highlighted Unit / Module *</Label>
              <Input
                placeholder="e.g. Unit III: Gender Equality, POSH Act & Workplace Rights"
                value={mUnit}
                onChange={(e) => setMUnit(e.target.value)}
                className="h-8 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Syllabus Excerpt (Exact Curriculum Text) *</Label>
              <Textarea
                placeholder="Paste the exact syllabus excerpt containing crosscutting topics..."
                value={mExcerpt}
                onChange={(e) => setMExcerpt(e.target.value)}
                className="text-xs min-h-[70px]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Highlighted Keywords (Comma-separated)</Label>
              <Input
                placeholder="e.g. POSH Act, Gender Equality, Vishaka Guidelines"
                value={mKeywords}
                onChange={(e) => setMKeywords(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setMappingModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Save Course Mapping
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: RECORD CO-CURRICULAR ACTIVITY */}
      <Dialog open={activityModalOpen} onOpenChange={setActivityModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Calendar className="size-4 text-emerald-600" />
              <span>Record Co-Curricular Activity (1.3.1)</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Log workshops, awareness campaigns, and student community outreach reinforcing crosscutting values.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateActivity} className="space-y-3.5 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Event Title *</Label>
              <Input
                placeholder="e.g. Plastic Free Campus Campaign & E-Waste Drive"
                value={actTitle}
                onChange={(e) => setActTitle(e.target.value)}
                className="h-8 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Theme</Label>
                <Select value={actTheme} onValueChange={(v) => setActTheme(v as any)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gender Sensitization & Equity">Gender Equity</SelectItem>
                    <SelectItem value="Environment & Sustainability">Environment & Sustainability</SelectItem>
                    <SelectItem value="Human Values & Constitutional Rights">Human Values</SelectItem>
                    <SelectItem value="Professional Ethics & Integrity">Professional Ethics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Event Date *</Label>
                <Input
                  type="date"
                  value={actDate}
                  onChange={(e) => setActDate(e.target.value)}
                  className="h-8 text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Organizing Body / Cell</Label>
                <Input
                  value={actCell}
                  onChange={(e) => setActCell(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Student Participants</Label>
                <Input
                  type="number"
                  min={1}
                  value={actParticipants}
                  onChange={(e) => setActParticipants(Number(e.target.value))}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Outcome & Impact Summary</Label>
              <Textarea
                placeholder="Describe key speakers, resolutions, student feedback..."
                value={actOutcome}
                onChange={(e) => setActOutcome(e.target.value)}
                className="text-xs min-h-[60px]"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setActivityModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Record Event
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: ATTACH EVIDENCE */}
      <Dialog open={evidenceModalOpen} onOpenChange={setEvidenceModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <UploadCloud className="size-4 text-emerald-600" />
              <span>Attach Evidentiary Document (1.3.1)</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Upload syllabus excerpts, activity reports with geo-tagged photos, or policy handbooks.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadEvidence} className="space-y-3.5 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Document Title *</Label>
              <Input
                placeholder="e.g. Highlighted_Syllabus_POSH_Gender_Studies_2025_26"
                value={evidenceTitle}
                onChange={(e) => setEvidenceTitle(e.target.value)}
                className="h-8 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Description</Label>
              <Textarea
                placeholder="Describe contents, offering department, and highlighted crosscutting content..."
                value={evidenceDesc}
                onChange={(e) => setEvidenceDesc(e.target.value)}
                className="text-xs min-h-[60px]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Compliance Remarks</Label>
              <Input
                value={evidenceRemarks}
                onChange={(e) => setEvidenceRemarks(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setEvidenceModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Upload & Link Evidence
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* PREVIEW MODAL: HIGHLIGHTED SYLLABUS VIEWER */}
      <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
        <DialogContent className="max-w-lg">
          {previewItem && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-foreground">{previewItem.courseCode}</span>
                  {getThemeBadge(previewItem.theme)}
                </div>
                <DialogTitle className="text-base font-bold text-foreground mt-1">
                  {previewItem.courseTitle}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {previewItem.programmeName} • {previewItem.department}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-2 text-xs">
                <div className="rounded-md bg-muted/20 border border-border/60 p-3 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    {previewItem.highlightedUnit}
                  </span>
                  <h5 className="font-bold text-xs text-foreground">
                    {previewItem.unitTitle}
                  </h5>
                </div>

                <div className="rounded-md bg-muted/30 border border-border/50 p-3.5 space-y-2 text-foreground leading-relaxed">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">
                    Highlighted Unit Syllabus Content:
                  </span>
                  <p className="text-xs">
                    {previewItem.syllabusExcerpt}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Highlighted Keywords:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {previewItem.highlightedKeywords.map((kw, i) => (
                      <Badge
                        key={i}
                        className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs"
                      >
                        ✓ {kw}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="rounded bg-primary/5 border border-primary/20 p-2.5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-primary block">
                    Expected Learning Outcome (Affective & Cognitive):
                  </span>
                  <p className="text-muted-foreground text-[11px]">
                    {previewItem.learningOutcomes}
                  </p>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" size="sm" onClick={() => setPreviewModalOpen(false)}>
                  Close
                </Button>
                <Button size="sm" asChild className="gap-1 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <a href={previewItem.syllabusPdfUrl} target="_blank" rel="noreferrer">
                    <Download className="size-3" />
                    <span>Download Full Syllabus PDF</span>
                  </a>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
