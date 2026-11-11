import { useState, useEffect } from "react";
import {
  Compass,
  MapPin,
  Calendar,
  Building2,
  Users,
  CheckCircle2,
  ExternalLink,
  Plus,
  Download,
  UploadCloud,
  FileText,
  Search,
  Filter,
  Eye,
  Award,
  Layers,
  Code2,
  Lightbulb,
  Sparkles,
  Link as LinkIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveTableContainer } from "@/components/admin/ResponsiveTableContainer";
import {
  getStudentCentricPedagogyData,
  addIndustrialVisitRecord,
  addCapstoneProjectRecord,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type {
  IndustrialVisitRecord,
  CapstoneProjectRecord,
  ParticipativeLearningActivity,
  StudentCentricPedagogyData,
  NaacEvidenceDocument,
} from "@/types";

interface StudentCentricPedagogyConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function StudentCentricPedagogyConsole({ onEvidenceUpdated }: StudentCentricPedagogyConsoleProps) {
  const [activeTab, setActiveTab] = useState("visits");
  const [, setLoading] = useState(true);

  // Data states
  const [pedagogyData, setPedagogyData] = useState<StudentCentricPedagogyData | null>(null);
  const [visits, setVisits] = useState<IndustrialVisitRecord[]>([]);
  const [capstones, setCapstones] = useState<CapstoneProjectRecord[]>([]);
  const [participativeActs, setParticipativeActs] = useState<ParticipativeLearningActivity[]>([]);
  const [evidenceList, setEvidenceList] = useState<NaacEvidenceDocument[]>([]);

  // Search & Filter
  const [visitSearch, setVisitSearch] = useState("");
  const [visitDeptFilter, setVisitDeptFilter] = useState("all");

  // Dialogs
  const [isAddVisitOpen, setIsAddVisitOpen] = useState(false);
  const [isAddCapstoneOpen, setIsAddCapstoneOpen] = useState(false);
  const [isUploadEvidenceOpen, setIsUploadEvidenceOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<NaacEvidenceDocument | null>(null);
  const [selectedVisitForPhoto, setSelectedVisitForPhoto] = useState<IndustrialVisitRecord | null>(null);

  // Add visit form
  const [newVisit, setNewVisit] = useState({
    industryName: "",
    location: "",
    department: "Computer Science & Engineering",
    programme: "B.Tech CSE",
    visitDate: "2025-10-15",
    studentsCount: 60,
    facultyCoordinators: "Dr. Snigdha Mohanty",
    geoTagCoordinates: "20.2961° N, 85.8245° E",
    mouLinked: true,
    learningOutcomes: "",
  });

  // Add capstone form
  const [newCapstone, setNewCapstone] = useState({
    projectTitle: "",
    department: "Computer Science & Engineering",
    studentTeam: "Ankit Behera, Priyanka Sahoo",
    facultyGuide: "Dr. Snigdha Mohanty",
    industryPartner: "Tech Mahindra Innovation Lab",
    domain: "Artificial Intelligence",
    problemStatement: "",
  });

  // Upload evidence form
  const [evidenceForm, setEvidenceForm] = useState({
    title: "",
    documentType: "PDF" as "PDF" | "XLSX" | "ZIP",
    department: "IQAC & Student Affairs",
    description: "",
    fileName: "",
    fileSize: "4.5 MB",
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const data = await getStudentCentricPedagogyData();
      setPedagogyData(data);
      setVisits(data.industrialVisits);
      setCapstones(data.capstoneProjects);
      setParticipativeActs(data.participativeActivities);

      const evis = await getEvidenceForMetric("2.3.1");
      setEvidenceList(evis);
    } catch (err) {
      console.error("Failed to load student-centric pedagogy data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVisit.industryName || !newVisit.location) return;

    try {
      const added = await addIndustrialVisitRecord(
        {
          industryName: newVisit.industryName,
          location: newVisit.location,
          department: newVisit.department,
          programme: newVisit.programme,
          visitDate: newVisit.visitDate,
          studentsCount: Number(newVisit.studentsCount),
          facultyCoordinators: newVisit.facultyCoordinators.split(",").map((s) => s.trim()),
          geoTaggedPhotoUrl: "/images/naac/pedagogy/geotagged_visit.jpg",
          geoTagCoordinates: newVisit.geoTagCoordinates,
          mouLinked: newVisit.mouLinked,
          learningOutcomes: newVisit.learningOutcomes || "Industrial hands-on experience and system observation.",
          reportUrl: `/documents/naac/pedagogy/${newVisit.industryName.replace(/\s+/g, "_")}_Report.pdf`,
        },
        {
          name: "Dr. Rashmita Mishra",
          role: "Academic Dean",
        }
      );

      setVisits((prev) => [added, ...prev]);
      setIsAddVisitOpen(false);
      setNewVisit({
        industryName: "",
        location: "",
        department: "Computer Science & Engineering",
        programme: "B.Tech CSE",
        visitDate: "2025-10-15",
        studentsCount: 60,
        facultyCoordinators: "Dr. Snigdha Mohanty",
        geoTagCoordinates: "20.2961° N, 85.8245° E",
        mouLinked: true,
        learningOutcomes: "",
      });
    } catch (err) {
      console.error("Failed to add industrial visit", err);
    }
  };

  const handleAddCapstone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCapstone.projectTitle) return;

    try {
      const added = await addCapstoneProjectRecord(
        {
          projectTitle: newCapstone.projectTitle,
          department: newCapstone.department,
          academicYear: "2025-26",
          studentTeam: newCapstone.studentTeam.split(",").map((s) => s.trim()),
          facultyGuide: newCapstone.facultyGuide,
          industryPartner: newCapstone.industryPartner,
          domain: newCapstone.domain,
          problemStatement: newCapstone.problemStatement || "Industry sponsored real-world automation problem.",
          prototypeUrl: "https://capstone-demo.eduplatform.internal",
          githubOrRepoUrl: "https://github.com/eduplatform-capstone/project",
        },
        {
          name: "Dr. Snigdha Mohanty",
          role: "IQAC Coordinator",
        }
      );

      setCapstones((prev) => [added, ...prev]);
      setIsAddCapstoneOpen(false);
      setNewCapstone({
        projectTitle: "",
        department: "Computer Science & Engineering",
        studentTeam: "Ankit Behera, Priyanka Sahoo",
        facultyGuide: "Dr. Snigdha Mohanty",
        industryPartner: "Tech Mahindra Innovation Lab",
        domain: "Artificial Intelligence",
        problemStatement: "",
      });
    } catch (err) {
      console.error("Failed to add capstone project", err);
    }
  };

  const handleUploadEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceForm.title || !evidenceForm.fileName) return;

    try {
      const newEvi = await uploadEvidenceDocument(
        {
          criterionId: 2,
          indicatorCode: "2.3",
          metricCode: "2.3.1",
          title: evidenceForm.title,
          academicYear: "2025-26",
          department: evidenceForm.department,
          documentType: evidenceForm.documentType,
          description: evidenceForm.description,
          fileName: evidenceForm.fileName,
          fileSize: evidenceForm.fileSize,
          evidenceUrl: `/documents/naac/evidence/${evidenceForm.fileName}`,
          remarks: "Uploaded via Student-Centric Pedagogy Console for Metric 2.3.1",
        },
        {
          name: "Dr. Rashmita Mishra",
          role: "Academic Dean",
        }
      );

      setEvidenceList((prev) => [newEvi, ...prev]);
      setIsUploadEvidenceOpen(false);
      setEvidenceForm({
        title: "",
        documentType: "PDF",
        department: "IQAC & Student Affairs",
        description: "",
        fileName: "",
        fileSize: "4.5 MB",
      });
      if (onEvidenceUpdated) onEvidenceUpdated();
    } catch (err) {
      console.error("Failed to upload evidence", err);
    }
  };

  const filteredVisits = visits.filter((v) => {
    const matchesSearch =
      v.industryName.toLowerCase().includes(visitSearch.toLowerCase()) ||
      v.location.toLowerCase().includes(visitSearch.toLowerCase()) ||
      v.department.toLowerCase().includes(visitSearch.toLowerCase());
    const matchesDept = visitDeptFilter === "all" || v.department.includes(visitDeptFilter);
    return matchesSearch && matchesDept;
  });

  const departments = Array.from(new Set(visits.map((v) => v.department)));

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-teal-950 via-slate-900 to-indigo-950 p-6 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 -mb-10 h-48 w-48 rounded-full bg-indigo-500/10 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-teal-400/40 bg-teal-500/20 text-teal-200">
                Criterion 2 · Metric 2.3.1
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> 100% Active Learning Integration
              </Badge>
              <Badge variant="outline" className="border-sky-400/40 bg-sky-500/20 text-sky-200">
                Geo-Tagged Photo Compendium
              </Badge>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Student-Centric Learning Methodologies (2.3.1)
            </h1>
            <p className="max-w-3xl text-sm text-slate-300">
              Experiential learning via 18 industrial field visits with geo-tagged verification, industry capstone
              problem-solving projects, participative peer tutoring, design thinking workshops, and active pedagogy.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => setIsUploadEvidenceOpen(true)}
              variant="outline"
              className="border-teal-400/30 bg-teal-900/40 text-teal-100 hover:bg-teal-800/60"
            >
              <UploadCloud className="mr-2 h-4 w-4 text-teal-300" />
              Attach Evidence
            </Button>
            <Button
              onClick={() => setIsAddVisitOpen(true)}
              className="bg-teal-600 font-medium text-white shadow-lg hover:bg-teal-500"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Industrial Visit
            </Button>
          </div>
        </div>

        {/* 4 Key Metric Cards */}
        <div className="relative z-10 mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">Industrial Field Visits</span>
              <Building2 className="h-4 w-4 text-teal-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-teal-300">{visits.length}</div>
            <div className="mt-1 text-xs text-slate-300">100% Geo-Tagged & Verified</div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">Students Benefitted</span>
              <Users className="h-4 w-4 text-sky-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-white">
              {pedagogyData?.studentsBenefittedCount?.toLocaleString() || "1,928"}
            </div>
            <div className="mt-1 text-xs text-slate-300">Experiential & Participative</div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">Industry Capstone Projects</span>
              <Code2 className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-indigo-200">{capstones.length}</div>
            <div className="mt-1 text-xs text-slate-300">Live Industry Problem-Solving</div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">Participative Activities</span>
              <Lightbulb className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-amber-300">{participativeActs.length}</div>
            <div className="mt-1 text-xs text-slate-300">Hackathons, MUN & Tutoring</div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-1 p-1 bg-muted/60 rounded-lg">
          <TabsTrigger value="visits" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span>Industrial Visits ({visits.length})</span>
          </TabsTrigger>
          <TabsTrigger value="capstones" className="flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            <span>Capstone Projects ({capstones.length})</span>
          </TabsTrigger>
          <TabsTrigger value="participative" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            <span>Participative Learning</span>
          </TabsTrigger>
          <TabsTrigger value="evidence" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Evidence & Photos ({evidenceList.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: INDUSTRIAL VISITS & FIELD LOGS */}
        <TabsContent value="visits" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-lg">Industrial Field Visits & Experiential Learning Logs</CardTitle>
                  <CardDescription>
                    All 18 documented field visits: company names, geo-tag coordinates, dates, student counts, faculty
                    mentors, and learning outcomes
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setIsAddVisitOpen(true)}
                    size="sm"
                    className="bg-teal-600 text-white hover:bg-teal-700"
                  >
                    <Plus className="mr-1.5 h-4 w-4" /> Add Visit
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search industry name, city, location..."
                    className="pl-8"
                    value={visitSearch}
                    onChange={(e) => setVisitSearch(e.target.value)}
                  />
                </div>

                <Select value={visitDeptFilter} onValueChange={setVisitDeptFilter}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                      <SelectValue placeholder="All Departments" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent>
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Industry & Location</TableHead>
                      <TableHead>Department & Programme</TableHead>
                      <TableHead>Date of Visit</TableHead>
                      <TableHead className="text-center">Students</TableHead>
                      <TableHead>Geo-Tag Coordinates</TableHead>
                      <TableHead>Faculty Coordinators</TableHead>
                      <TableHead className="text-center">MoU Linked</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVisits.map((v) => (
                      <TableRow key={v.id} className="hover:bg-muted/40">
                        <TableCell>
                          <div>
                            <div className="font-semibold text-foreground flex items-center gap-1.5">
                              {v.industryName}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3 text-teal-600 shrink-0" />
                              <span className="truncate max-w-[200px]" title={v.location}>
                                {v.location}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">
                          <div className="font-medium text-foreground">{v.programme}</div>
                          <div className="text-muted-foreground">{v.department}</div>
                        </TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground">
                          {v.visitDate}
                        </TableCell>
                        <TableCell className="text-center font-bold text-teal-600 dark:text-teal-400">
                          {v.studentsCount}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-[11px] border-teal-300 text-teal-700 dark:text-teal-300">
                            {v.geoTagCoordinates}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {v.facultyCoordinators.join(", ")}
                        </TableCell>
                        <TableCell className="text-center">
                          {v.mouLinked ? (
                            <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 text-[10px]">
                              MoU Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] text-muted-foreground">
                              Ad-hoc Permission
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-teal-600 hover:text-teal-700"
                            onClick={() => setSelectedVisitForPhoto(v)}
                          >
                            <Eye className="mr-1 h-3 w-3" /> Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ResponsiveTableContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: CAPSTONE & DESIGN PROJECTS */}
        <TabsContent value="capstones" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle className="text-lg">Industry Capstone & Problem-Solving Projects</CardTitle>
                  <CardDescription>
                    Multidisciplinary final-year engineering and management capstones addressing live industry and state challenges
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setIsAddCapstoneOpen(true)}
                  size="sm"
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  <Plus className="mr-1.5 h-4 w-4" /> Add Capstone Project
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {capstones.map((cap) => (
                  <div
                    key={cap.id}
                    className="flex flex-col justify-between rounded-lg border p-4 bg-card hover:border-indigo-300 transition-all space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <Badge variant="outline" className="text-xs border-indigo-300 text-indigo-700 dark:text-indigo-300">
                          {cap.department}
                        </Badge>
                        <Badge className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20 text-xs">
                          {cap.domain}
                        </Badge>
                      </div>

                      <h4 className="font-bold text-foreground text-sm">{cap.projectTitle}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{cap.problemStatement}</p>

                      <div className="rounded bg-muted/40 p-2.5 space-y-1 text-xs">
                        <div>
                          <span className="text-muted-foreground font-semibold">Student Team:</span>{" "}
                          <span className="text-foreground">{cap.studentTeam.join(", ")}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground font-semibold">Faculty Guide:</span>{" "}
                          <span className="text-foreground">{cap.facultyGuide}</span>
                        </div>
                        {cap.industryPartner && (
                          <div>
                            <span className="text-muted-foreground font-semibold">Industry Partner:</span>{" "}
                            <span className="text-foreground">{cap.industryPartner}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t flex items-center justify-between text-xs">
                      {cap.githubOrRepoUrl ? (
                        <a
                          href={cap.githubOrRepoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 hover:underline flex items-center gap-1 font-mono text-[11px]"
                        >
                          <Code2 className="h-3 w-3" /> Source Code
                        </a>
                      ) : (
                        <span className="text-muted-foreground">Lab Internal</span>
                      )}

                      {cap.prototypeUrl && (
                        <a
                          href={cap.prototypeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-teal-600 hover:underline flex items-center gap-1 text-[11px]"
                        >
                          <ExternalLink className="h-3 w-3" /> Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: PARTICIPATIVE LEARNING */}
        <TabsContent value="participative" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Participative & Collaborative Learning Methodologies</CardTitle>
              <CardDescription>
                Peer tutoring circles, Smart Odisha Hackathons, Model United Nations, design thinking summits, and simulation labs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {participativeActs.map((act) => (
                  <div key={act.id} className="rounded-lg border p-4 bg-card space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 text-xs">
                        {act.methodType}
                      </Badge>
                      <span className="text-xs font-mono text-muted-foreground">{act.date}</span>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground text-sm">{act.activityTitle}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{act.description}</p>
                    </div>

                    <div className="p-2.5 rounded bg-muted/30 border text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground font-semibold">Department:</span>
                        <span className="text-foreground">{act.department}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground font-semibold">Active Participants:</span>
                        <span className="font-bold text-primary">{act.participantsCount} Students</span>
                      </div>
                      <div className="pt-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        Outcome: {act.outcomes}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: EVIDENCE & PHOTO COMPENDIUM */}
        <TabsContent value="evidence" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg">Metric 2.3.1 Evidentiary Dossiers & Geo-Tagged Records</CardTitle>
                <CardDescription>
                  Geo-tagged photo compendiums, capstone project dossiers, Academic Council pedagogical policy, and field visit logs
                </CardDescription>
              </div>
              <Button
                onClick={() => setIsUploadEvidenceOpen(true)}
                size="sm"
                className="bg-teal-600 text-white hover:bg-teal-700"
              >
                <UploadCloud className="mr-1.5 h-4 w-4" /> Attach New Dossier
              </Button>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {evidenceList.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex flex-col justify-between rounded-lg border p-4 hover:border-teal-300 transition-all bg-card space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <Badge variant="outline" className="text-xs">
                          {doc.documentType} · {doc.fileSize}
                        </Badge>
                        <Badge
                          className={
                            doc.status === "Approved"
                              ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                              : "bg-sky-500/10 text-sky-700 border-sky-500/20"
                          }
                        >
                          {doc.status}
                        </Badge>
                      </div>

                      <h4 className="font-semibold text-foreground text-sm line-clamp-2">{doc.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{doc.description}</p>
                    </div>

                    <div className="pt-2 border-t flex items-center justify-between text-xs text-muted-foreground">
                      <span>{doc.department}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-teal-600 hover:text-teal-700"
                          onClick={() => setViewingDoc(doc)}
                        >
                          <Eye className="mr-1 h-3 w-3" /> View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => {
                            const blob = new Blob([`Dummy Evidence Content for ${doc.title}`], {
                              type: "application/pdf",
                            });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = doc.fileName;
                            a.click();
                          }}
                        >
                          <Download className="mr-1 h-3 w-3" /> Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* DIALOG 1: ADD INDUSTRIAL VISIT */}
      <Dialog open={isAddVisitOpen} onOpenChange={setIsAddVisitOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-teal-600">
              <Plus className="h-5 w-5" /> Add Industrial Visit Record (Experiential Learning)
            </DialogTitle>
            <DialogDescription>
              Record factory, power plant, or research lab expedition with geo-coordinates and learning outcomes
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddVisit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="indName">Industry / Plant Name *</Label>
              <Input
                id="indName"
                placeholder="e.g. Tata Steel Kalinganagar Complex"
                required
                value={newVisit.industryName}
                onChange={(e) => setNewVisit({ ...newVisit, industryName: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="indLoc">Location & City *</Label>
              <Input
                id="indLoc"
                placeholder="e.g. Kalinganagar Industrial Complex, Jajpur, Odisha"
                required
                value={newVisit.location}
                onChange={(e) => setNewVisit({ ...newVisit, location: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="visitDept">Department</Label>
                <Select
                  value={newVisit.department}
                  onValueChange={(val) => setNewVisit({ ...newVisit, department: val })}
                >
                  <SelectTrigger id="visitDept">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="visitDate">Date of Visit</Label>
                <Input
                  id="visitDate"
                  type="date"
                  value={newVisit.visitDate}
                  onChange={(e) => setNewVisit({ ...newVisit, visitDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="studentCount">Students Benefitted</Label>
                <Input
                  id="studentCount"
                  type="number"
                  min="1"
                  value={newVisit.studentsCount}
                  onChange={(e) => setNewVisit({ ...newVisit, studentsCount: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="geoCoords">Geo-Tag Coordinates</Label>
                <Input
                  id="geoCoords"
                  placeholder="e.g. 20.9620° N, 86.0125° E"
                  value={newVisit.geoTagCoordinates}
                  onChange={(e) => setNewVisit({ ...newVisit, geoTagCoordinates: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="facultyInCharge">Faculty In-Charge (comma-separated)</Label>
              <Input
                id="facultyInCharge"
                placeholder="e.g. Prof. Satyabrata Dash, Dr. Bimalendu Rout"
                value={newVisit.facultyCoordinators}
                onChange={(e) => setNewVisit({ ...newVisit, facultyCoordinators: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="outcomes">Specific Learning Outcomes</Label>
              <Textarea
                id="outcomes"
                placeholder="Describe machines observed, industrial workflow, and student takeaways..."
                value={newVisit.learningOutcomes}
                onChange={(e) => setNewVisit({ ...newVisit, learningOutcomes: e.target.value })}
                rows={2}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddVisitOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-teal-600 text-white hover:bg-teal-700">
                Save Visit Log
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: ADD CAPSTONE PROJECT */}
      <Dialog open={isAddCapstoneOpen} onOpenChange={setIsAddCapstoneOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-indigo-600">
              <Plus className="h-5 w-5" /> Add Capstone / Problem-Solving Project
            </DialogTitle>
            <DialogDescription>
              Record student final-year capstone solving authentic industrial or community problems
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddCapstone} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="capTitle">Project Title *</Label>
              <Input
                id="capTitle"
                placeholder="e.g. AI-Powered Smart Grid Fault Localization"
                required
                value={newCapstone.projectTitle}
                onChange={(e) => setNewCapstone({ ...newCapstone, projectTitle: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="capDept">Department</Label>
                <Input
                  id="capDept"
                  value={newCapstone.department}
                  onChange={(e) => setNewCapstone({ ...newCapstone, department: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="capDomain">Domain</Label>
                <Input
                  id="capDomain"
                  placeholder="e.g. IoT / Robotics / Clean Energy"
                  value={newCapstone.domain}
                  onChange={(e) => setNewCapstone({ ...newCapstone, domain: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="capTeam">Student Team Members</Label>
              <Input
                id="capTeam"
                placeholder="e.g. Ankit Behera, Priyanka Sahoo, Subham Mohapatra"
                value={newCapstone.studentTeam}
                onChange={(e) => setNewCapstone({ ...newCapstone, studentTeam: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="capGuide">Faculty Guide</Label>
                <Input
                  id="capGuide"
                  placeholder="e.g. Dr. Snigdha Mohanty"
                  value={newCapstone.facultyGuide}
                  onChange={(e) => setNewCapstone({ ...newCapstone, facultyGuide: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="capPartner">Industry Partner / Sponsor</Label>
                <Input
                  id="capPartner"
                  placeholder="e.g. Odisha Power Transmission Corp"
                  value={newCapstone.industryPartner}
                  onChange={(e) => setNewCapstone({ ...newCapstone, industryPartner: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="capProblem">Problem Statement</Label>
              <Textarea
                id="capProblem"
                placeholder="What industry challenge does this project solve?"
                value={newCapstone.problemStatement}
                onChange={(e) => setNewCapstone({ ...newCapstone, problemStatement: e.target.value })}
                rows={2}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddCapstoneOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700">
                Save Capstone Project
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 3: VIEW VISIT DETAILS & GEO-TAGGED LOG */}
      {selectedVisitForPhoto && (
        <Dialog open={!!selectedVisitForPhoto} onOpenChange={() => setSelectedVisitForPhoto(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge className="bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20">
                  {selectedVisitForPhoto.department}
                </Badge>
                <Badge variant="outline" className="font-mono text-xs">
                  {selectedVisitForPhoto.visitDate}
                </Badge>
              </div>
              <DialogTitle className="mt-2 text-lg text-foreground">
                {selectedVisitForPhoto.industryName}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-1 text-xs">
                <MapPin className="h-3.5 w-3.5 text-teal-600" />
                {selectedVisitForPhoto.location}
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-lg border p-4 bg-muted/30 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground">Target Programme:</span>{" "}
                  <span className="font-semibold text-foreground">{selectedVisitForPhoto.programme}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Students Count:</span>{" "}
                  <span className="font-bold text-teal-600">{selectedVisitForPhoto.studentsCount} Students</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Faculty In-Charge:</span>{" "}
                  <span className="font-medium text-foreground">
                    {selectedVisitForPhoto.facultyCoordinators.join(", ")}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Geo-Tag Coordinates:</span>{" "}
                  <span className="font-mono font-medium text-foreground">
                    {selectedVisitForPhoto.geoTagCoordinates}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-background border">
                <span className="font-semibold text-primary">Learning Outcomes:</span>
                <p className="mt-1 text-muted-foreground">{selectedVisitForPhoto.learningOutcomes}</p>
              </div>

              <div className="flex items-center justify-between p-3 rounded bg-teal-50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-teal-600" />
                  <span className="font-medium">Visit Report & Geo-Tagged Attendance Dossier</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => {
                    const blob = new Blob([`Report for ${selectedVisitForPhoto.industryName}`], {
                      type: "application/pdf",
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${selectedVisitForPhoto.industryName.replace(/\s+/g, "_")}_Report.pdf`;
                    a.click();
                  }}
                >
                  <Download className="mr-1 h-3 w-3" /> Report
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedVisitForPhoto(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* DIALOG 4: ATTACH EVIDENCE */}
      <Dialog open={isUploadEvidenceOpen} onOpenChange={setIsUploadEvidenceOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-teal-600">
              <UploadCloud className="h-5 w-5" /> Attach Metric 2.3.1 Evidentiary Dossier
            </DialogTitle>
            <DialogDescription>
              Upload geo-tagged photo compendiums, capstone project files, or active learning audit documents
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadEvidence} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="eviTitle">Document Title *</Label>
              <Input
                id="eviTitle"
                placeholder="e.g. Geo-Tagged Photos Compendium 2025-26"
                required
                value={evidenceForm.title}
                onChange={(e) => setEvidenceForm({ ...evidenceForm, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="eviType">Document Type</Label>
                <Select
                  value={evidenceForm.documentType}
                  onValueChange={(val: "PDF" | "XLSX" | "ZIP") =>
                    setEvidenceForm({ ...evidenceForm, documentType: val })
                  }
                >
                  <SelectTrigger id="eviType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF Document</SelectItem>
                    <SelectItem value="XLSX">Excel Spreadsheet (XLSX)</SelectItem>
                    <SelectItem value="ZIP">ZIP Archive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="eviDept">Department</Label>
                <Input
                  id="eviDept"
                  value={evidenceForm.department}
                  onChange={(e) => setEvidenceForm({ ...evidenceForm, department: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="eviFileName">File Name *</Label>
              <Input
                id="eviFileName"
                placeholder="e.g. Geotagged_Photo_Compendium_2025_26.pdf"
                required
                value={evidenceForm.fileName}
                onChange={(e) => setEvidenceForm({ ...evidenceForm, fileName: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="eviDesc">Description / Remarks</Label>
              <Input
                id="eviDesc"
                placeholder="Brief summary of document, endorsing authority, and approval reference..."
                value={evidenceForm.description}
                onChange={(e) => setEvidenceForm({ ...evidenceForm, description: e.target.value })}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsUploadEvidenceOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-teal-600 text-white hover:bg-teal-700">
                Upload & Verify
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 5: VIEW EVIDENCE DOCUMENT */}
      {viewingDoc && (
        <Dialog open={!!viewingDoc} onOpenChange={() => setViewingDoc(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{viewingDoc.documentType}</Badge>
                <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20">
                  {viewingDoc.status}
                </Badge>
              </div>
              <DialogTitle className="mt-2 text-lg">{viewingDoc.title}</DialogTitle>
              <DialogDescription>{viewingDoc.description}</DialogDescription>
            </DialogHeader>

            <div className="rounded-lg border p-4 bg-muted/30 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Department:</span>{" "}
                  <span className="font-medium text-foreground">{viewingDoc.department}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Academic Year:</span>{" "}
                  <span className="font-medium text-foreground">{viewingDoc.academicYear}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Uploaded By:</span>{" "}
                  <span className="font-medium text-foreground">
                    {viewingDoc.uploadedBy} on {viewingDoc.uploadDate}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Verified By:</span>{" "}
                  <span className="font-medium text-foreground">{viewingDoc.verifiedBy || "IQAC Committee"}</span>
                </div>
              </div>

              {viewingDoc.remarks && (
                <div className="p-2.5 rounded bg-background border text-xs">
                  <span className="font-semibold text-primary">Verification Remarks:</span> {viewingDoc.remarks}
                </div>
              )}

              <div className="flex items-center justify-between p-3 rounded bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40 text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-teal-600" />
                  <span className="font-mono">{viewingDoc.fileName}</span>
                  <span className="text-muted-foreground">({viewingDoc.fileSize})</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => {
                    const blob = new Blob([`Evidence Content for ${viewingDoc.title}`], {
                      type: "application/pdf",
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = viewingDoc.fileName;
                    a.click();
                  }}
                >
                  <Download className="mr-1 h-3.5 w-3.5" /> Download
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setViewingDoc(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
