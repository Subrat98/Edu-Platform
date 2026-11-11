import { useState, useEffect } from "react";
import {
  Monitor,
  Wifi,
  Video,
  Layers,
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
  Building2,
  BookOpen,
  Laptop,
  Users,
  Tv,
  Check,
  X,
  Sparkles,
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
  getIctClassroomLmsData,
  addIctRoomInventoryItem,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type {
  IctRoomInventoryItem,
  LmsCourseUsageStat,
  DigitalLearningResource,
  IctClassroomLmsData,
  NaacEvidenceDocument,
} from "@/types";

interface IctClassroomsLmsConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function IctClassroomsLmsConsole({ onEvidenceUpdated }: IctClassroomsLmsConsoleProps) {
  const [activeTab, setActiveTab] = useState("rooms");
  const [, setLoading] = useState(true);

  // Data states
  const [ictData, setIctData] = useState<IctClassroomLmsData | null>(null);
  const [rooms, setRooms] = useState<IctRoomInventoryItem[]>([]);
  const [lmsCourses, setLmsCourses] = useState<LmsCourseUsageStat[]>([]);
  const [digitalResources, setDigitalResources] = useState<DigitalLearningResource[]>([]);
  const [evidenceList, setEvidenceList] = useState<NaacEvidenceDocument[]>([]);

  // Search & Filter
  const [roomSearch, setRoomSearch] = useState("");
  const [blockFilter, setBlockFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [courseSearch, setCourseSearch] = useState("");

  // Dialogs
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [isUploadEvidenceOpen, setIsUploadEvidenceOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<NaacEvidenceDocument | null>(null);

  // Add room form
  const [newRoom, setNewRoom] = useState({
    roomNumber: "",
    blockOrBuilding: "Ramanujan Academic Block",
    floor: "First Floor",
    roomType: "Smart Classroom" as "Smart Classroom" | "Seminar Hall" | "Virtual Lab / Studio" | "Auditorium",
    seatingCapacity: 70,
    hasInteractivePanel: true,
    hasProjector: true,
    hasHighSpeedWifi: true,
    hasAudioSystem: true,
    hasLectureCapture: true,
    departmentAllocated: "Computer Science & Engineering",
  });

  // Upload evidence form
  const [evidenceForm, setEvidenceForm] = useState({
    title: "",
    documentType: "PDF" as "PDF" | "XLSX" | "ZIP",
    department: "Central IT & Infrastructure Cell",
    description: "",
    fileName: "",
    fileSize: "5.8 MB",
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const data = await getIctClassroomLmsData();
      setIctData(data);
      setRooms(data.rooms);
      setLmsCourses(data.lmsCourses);
      setDigitalResources(data.digitalResources);

      const evis = await getEvidenceForMetric("2.3.2");
      setEvidenceList(evis);
    } catch (err) {
      console.error("Failed to load ICT and LMS data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoom.roomNumber) return;

    try {
      const added = await addIctRoomInventoryItem(
        {
          roomNumber: newRoom.roomNumber,
          blockOrBuilding: newRoom.blockOrBuilding,
          floor: newRoom.floor,
          roomType: newRoom.roomType,
          seatingCapacity: Number(newRoom.seatingCapacity),
          hasInteractivePanel: newRoom.hasInteractivePanel,
          hasProjector: newRoom.hasProjector,
          hasHighSpeedWifi: newRoom.hasHighSpeedWifi,
          hasAudioSystem: newRoom.hasAudioSystem,
          hasLectureCapture: newRoom.hasLectureCapture,
          departmentAllocated: newRoom.departmentAllocated,
          isLmsConnected: true,
          photoUrl: `/images/naac/ict/${newRoom.roomNumber}.jpg`,
        },
        {
          name: "Er. Tapan Kumar Sahoo",
          role: "IT Head",
        }
      );

      setRooms((prev) => [added, ...prev]);
      setIsAddRoomOpen(false);
      setNewRoom({
        roomNumber: "",
        blockOrBuilding: "Ramanujan Academic Block",
        floor: "First Floor",
        roomType: "Smart Classroom",
        seatingCapacity: 70,
        hasInteractivePanel: true,
        hasProjector: true,
        hasHighSpeedWifi: true,
        hasAudioSystem: true,
        hasLectureCapture: true,
        departmentAllocated: "Computer Science & Engineering",
      });
      loadAllData();
    } catch (err) {
      console.error("Failed to add room inventory item", err);
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
          metricCode: "2.3.2",
          title: evidenceForm.title,
          academicYear: "2025-26",
          department: evidenceForm.department,
          documentType: evidenceForm.documentType,
          description: evidenceForm.description,
          fileName: evidenceForm.fileName,
          fileSize: evidenceForm.fileSize,
          evidenceUrl: `/documents/naac/evidence/${evidenceForm.fileName}`,
          remarks: "Uploaded via ICT Classrooms & LMS Utilization Console for Metric 2.3.2",
        },
        {
          name: "Er. Tapan Kumar Sahoo",
          role: "IT Head",
        }
      );

      setEvidenceList((prev) => [newEvi, ...prev]);
      setIsUploadEvidenceOpen(false);
      setEvidenceForm({
        title: "",
        documentType: "PDF",
        department: "Central IT & Infrastructure Cell",
        description: "",
        fileName: "",
        fileSize: "5.8 MB",
      });
      if (onEvidenceUpdated) onEvidenceUpdated();
    } catch (err) {
      console.error("Failed to upload evidence", err);
    }
  };

  // Filter rooms
  const filteredRooms = rooms.filter((r) => {
    const matchesSearch =
      r.roomNumber.toLowerCase().includes(roomSearch.toLowerCase()) ||
      r.departmentAllocated.toLowerCase().includes(roomSearch.toLowerCase()) ||
      r.blockOrBuilding.toLowerCase().includes(roomSearch.toLowerCase());
    const matchesBlock = blockFilter === "all" || r.blockOrBuilding === blockFilter;
    const matchesType = typeFilter === "all" || r.roomType === typeFilter;
    return matchesSearch && matchesBlock && matchesType;
  });

  const blocks = Array.from(new Set(rooms.map((r) => r.blockOrBuilding)));

  // Filter courses
  const filteredCourses = lmsCourses.filter((c) => {
    return (
      c.courseCode.toLowerCase().includes(courseSearch.toLowerCase()) ||
      c.courseTitle.toLowerCase().includes(courseSearch.toLowerCase()) ||
      c.facultyName.toLowerCase().includes(courseSearch.toLowerCase()) ||
      c.department.toLowerCase().includes(courseSearch.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-slate-950 via-cyan-950 to-blue-950 p-6 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 -mb-10 h-48 w-48 rounded-full bg-blue-500/10 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-cyan-400/40 bg-cyan-500/20 text-cyan-200">
                Criterion 2 · Metric 2.3.2
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> High Benchmark (89.5% ICT Enabled)
              </Badge>
              <Badge variant="outline" className="border-blue-400/40 bg-blue-500/20 text-blue-200">
                100% Faculty LMS Adoption
              </Badge>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              ICT-Enabled Classrooms & LMS Utilization (2.3.2)
            </h1>
            <p className="max-w-3xl text-sm text-slate-300">
              Interactive flat panels, smart projectors, lecture capture studios, EduPlatform LMS deployment (142
              active course portals), 42 flipped classroom modules, and digital library e-resources.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => setIsUploadEvidenceOpen(true)}
              variant="outline"
              className="border-cyan-400/30 bg-cyan-900/40 text-cyan-100 hover:bg-cyan-800/60"
            >
              <UploadCloud className="mr-2 h-4 w-4 text-cyan-300" />
              Attach Evidence
            </Button>
            <Button
              onClick={() => setIsAddRoomOpen(true)}
              className="bg-cyan-600 font-medium text-white shadow-lg hover:bg-cyan-500"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Room Inventory
            </Button>
          </div>
        </div>

        {/* 4 Key Metric Cards */}
        <div className="relative z-10 mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">ICT-Enabled Rooms</span>
              <Monitor className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-cyan-300">
              {ictData?.ictPercentage || 89.5}%
            </div>
            <div className="mt-1 text-xs text-slate-300">
              {ictData?.ictEnabledCount || 34} of {ictData?.totalClassroomsAndHalls || 38} Rooms
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">LMS Course Portals</span>
              <Laptop className="h-4 w-4 text-blue-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-white">
              {ictData?.lmsActiveCourses || 142}
            </div>
            <div className="mt-1 text-xs text-slate-300">Active Syllabus Portals</div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">Faculty LMS Usage</span>
              <Users className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-emerald-300">100%</div>
            <div className="mt-1 text-xs text-slate-300">135 / 135 Teachers Active</div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">Flipped Modules</span>
              <Video className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-amber-300">
              {ictData?.flippedClassroomModulesCount || 42}
            </div>
            <div className="mt-1 text-xs text-slate-300">Recorded E-Lectures</div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-1 p-1 bg-muted/60 rounded-lg">
          <TabsTrigger value="rooms" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span>Room Inventory ({rooms.length})</span>
          </TabsTrigger>
          <TabsTrigger value="lms" className="flex items-center gap-2">
            <Laptop className="h-4 w-4" />
            <span>LMS Course Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="flipped" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Flipped & Digital Resources</span>
          </TabsTrigger>
          <TabsTrigger value="evidence" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Evidence Dossiers ({evidenceList.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: INSTRUCTIONAL ROOM INVENTORY */}
        <TabsContent value="rooms" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-lg">Master ICT-Enabled Instructional Room Inventory</CardTitle>
                  <CardDescription>
                    38 Total spaces: 28 Smart Classrooms, 6 Seminar Halls, 4 E-Content Studios, with 34 ICT-enabled (89.5% coverage)
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setIsAddRoomOpen(true)}
                    size="sm"
                    className="bg-cyan-600 text-white hover:bg-cyan-700"
                  >
                    <Plus className="mr-1.5 h-4 w-4" /> Add Instructional Space
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search room number, building, department..."
                    className="pl-8"
                    value={roomSearch}
                    onChange={(e) => setRoomSearch(e.target.value)}
                  />
                </div>

                <Select value={blockFilter} onValueChange={setBlockFilter}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      <SelectValue placeholder="All Blocks" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Academic Blocks</SelectItem>
                    {blocks.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                      <SelectValue placeholder="All Room Types" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Room Types</SelectItem>
                    <SelectItem value="Smart Classroom">Smart Classroom</SelectItem>
                    <SelectItem value="Seminar Hall">Seminar Hall</SelectItem>
                    <SelectItem value="Virtual Lab / Studio">Virtual Lab / Studio</SelectItem>
                    <SelectItem value="Auditorium">Auditorium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent>
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Room & Building</TableHead>
                      <TableHead>Type & Floor</TableHead>
                      <TableHead className="text-center">Capacity</TableHead>
                      <TableHead>Equipment & Smart Facilities</TableHead>
                      <TableHead>Allocated Department</TableHead>
                      <TableHead className="text-center">LMS Sync</TableHead>
                      <TableHead className="text-right">ICT Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRooms.map((r) => {
                      const isIct = r.hasInteractivePanel || r.hasProjector;
                      return (
                        <TableRow key={r.id} className="hover:bg-muted/40">
                          <TableCell>
                            <div>
                              <div className="font-bold text-foreground flex items-center gap-1.5">
                                {r.roomNumber}
                              </div>
                              <div className="text-xs text-muted-foreground">{r.blockOrBuilding}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs">
                            <Badge variant="outline" className="text-[11px] mb-0.5">
                              {r.roomType}
                            </Badge>
                            <div className="text-muted-foreground">{r.floor}</div>
                          </TableCell>
                          <TableCell className="text-center font-bold text-foreground">
                            {r.seatingCapacity}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {r.hasInteractivePanel && (
                                <Badge className="bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20 text-[10px]">
                                  75" Panel
                                </Badge>
                              )}
                              {r.hasProjector && (
                                <Badge variant="outline" className="text-[10px]">
                                  Projector
                                </Badge>
                              )}
                              {r.hasHighSpeedWifi && (
                                <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300">
                                  Wi-Fi 6
                                </Badge>
                              )}
                              {r.hasLectureCapture && (
                                <Badge className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20 text-[10px]">
                                  Capture
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {r.departmentAllocated}
                          </TableCell>
                          <TableCell className="text-center">
                            {r.isLmsConnected ? (
                              <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20 text-[10px]">
                                Connected
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-[10px] text-muted-foreground">
                                Offline
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {isIct ? (
                              <Badge className="bg-emerald-600 text-white text-[11px]">
                                ICT Enabled
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-[11px]">
                                Standard
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ResponsiveTableContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: LMS COURSE ANALYTICS */}
        <TabsContent value="lms" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-lg">EduPlatform LMS Course Portals & Student Engagement</CardTitle>
                  <CardDescription>
                    Real-time monitoring of active courses, syllabus materials, interactive quizzes, student submissions, and login frequencies
                  </CardDescription>
                </div>
                <div className="w-full sm:w-64">
                  <Input
                    placeholder="Search course code, faculty..."
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course Details</TableHead>
                      <TableHead>Faculty Instructor</TableHead>
                      <TableHead className="text-center">Enrolled</TableHead>
                      <TableHead className="text-center">E-Resources</TableHead>
                      <TableHead className="text-center">Quizzes</TableHead>
                      <TableHead className="text-center">Submissions</TableHead>
                      <TableHead className="text-center">Weekly Logins</TableHead>
                      <TableHead className="text-right">Last Activity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCourses.map((c) => (
                      <TableRow key={c.courseCode} className="hover:bg-muted/40">
                        <TableCell>
                          <div>
                            <div className="font-semibold text-foreground">{c.courseTitle}</div>
                            <div className="font-mono text-xs text-primary">{c.courseCode}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">
                          <div className="font-medium text-foreground">{c.facultyName}</div>
                          <div className="text-muted-foreground">{c.department}</div>
                        </TableCell>
                        <TableCell className="text-center font-bold text-foreground">
                          {c.enrolledStudents}
                        </TableCell>
                        <TableCell className="text-center font-medium text-cyan-600">
                          {c.uploadedResourcesCount}
                        </TableCell>
                        <TableCell className="text-center font-medium">{c.quizzesCount}</TableCell>
                        <TableCell className="text-center font-bold text-emerald-600 dark:text-emerald-400">
                          {c.assignmentsSubmitted}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="border-blue-400 text-blue-700 dark:text-blue-300">
                            {c.averageStudentLoginsPerWeek} / wk
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs font-mono text-muted-foreground">
                          {c.lastActivityDate}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ResponsiveTableContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: FLIPPED LEARNING & DIGITAL RESOURCES */}
        <TabsContent value="flipped" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Institutional Digital Learning Subscriptions & E-Resources</CardTitle>
              <CardDescription>
                Subscribed inter-library networks, high-definition DTH broadcast channels, and open repositories accessible campus-wide
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {digitalResources.map((res) => (
                  <div key={res.name} className="rounded-lg border p-4 bg-card space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20 text-xs">
                        {res.status}
                      </Badge>
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {res.activeUsersCount.toLocaleString()} Active Users
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-foreground text-sm">{res.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{res.type}</p>
                      <div className="text-xs text-muted-foreground mt-1">
                        Provider: <span className="font-medium text-foreground">{res.provider}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t flex items-center justify-between">
                      <a
                        href={res.accessUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-cyan-600 hover:underline flex items-center gap-1 font-medium"
                      >
                        <ExternalLink className="h-3 w-3" /> Access Gateway
                      </a>
                      <Badge variant="outline" className="text-[10px]">
                        Single Sign-On (SSO)
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: EVIDENCE DOSSIERS */}
        <TabsContent value="evidence" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg">Metric 2.3.2 Evidentiary Dossiers & Infrastructure Audits</CardTitle>
                <CardDescription>
                  Master ICT room audits, EduPlatform LMS server logs, e-resource subscription invoices, and flipped classroom documentation
                </CardDescription>
              </div>
              <Button
                onClick={() => setIsUploadEvidenceOpen(true)}
                size="sm"
                className="bg-cyan-600 text-white hover:bg-cyan-700"
              >
                <UploadCloud className="mr-1.5 h-4 w-4" /> Attach New Dossier
              </Button>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {evidenceList.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex flex-col justify-between rounded-lg border p-4 hover:border-cyan-300 transition-all bg-card space-y-3"
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
                          className="h-7 text-xs text-cyan-600 hover:text-cyan-700"
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

      {/* DIALOG 1: ADD ROOM INVENTORY */}
      <Dialog open={isAddRoomOpen} onOpenChange={setIsAddRoomOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-cyan-600">
              <Plus className="h-5 w-5" /> Add Instructional Space to ICT Inventory
            </DialogTitle>
            <DialogDescription>
              Record classroom or seminar hall specifications and smart hardware equipment
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddRoom} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="roomNum">Room Number *</Label>
                <Input
                  id="roomNum"
                  placeholder="e.g. RAB-103"
                  required
                  value={newRoom.roomNumber}
                  onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="roomBlock">Building Block *</Label>
                <Input
                  id="roomBlock"
                  placeholder="e.g. Ramanujan Academic Block"
                  required
                  value={newRoom.blockOrBuilding}
                  onChange={(e) => setNewRoom({ ...newRoom, blockOrBuilding: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="roomFloor">Floor</Label>
                <Input
                  id="roomFloor"
                  value={newRoom.floor}
                  onChange={(e) => setNewRoom({ ...newRoom, floor: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="roomType">Space Type</Label>
                <Select
                  value={newRoom.roomType}
                  onValueChange={(val: "Smart Classroom" | "Seminar Hall" | "Virtual Lab / Studio" | "Auditorium") =>
                    setNewRoom({ ...newRoom, roomType: val })
                  }
                >
                  <SelectTrigger id="roomType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Smart Classroom">Smart Classroom</SelectItem>
                    <SelectItem value="Seminar Hall">Seminar Hall</SelectItem>
                    <SelectItem value="Virtual Lab / Studio">Virtual Lab / Studio</SelectItem>
                    <SelectItem value="Auditorium">Auditorium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="capacity">Seating Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={newRoom.seatingCapacity}
                  onChange={(e) => setNewRoom({ ...newRoom, seatingCapacity: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="deptAlloc">Allocated Department</Label>
              <Input
                id="deptAlloc"
                value={newRoom.departmentAllocated}
                onChange={(e) => setNewRoom({ ...newRoom, departmentAllocated: e.target.value })}
              />
            </div>

            <div className="rounded-lg border p-3 bg-muted/30 space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Smart Hardware Equipment
              </Label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newRoom.hasInteractivePanel}
                    onChange={(e) => setNewRoom({ ...newRoom, hasInteractivePanel: e.target.checked })}
                    className="rounded text-cyan-600"
                  />
                  <span>75" Interactive Flat Panel (IFP)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newRoom.hasProjector}
                    onChange={(e) => setNewRoom({ ...newRoom, hasProjector: e.target.checked })}
                    className="rounded text-cyan-600"
                  />
                  <span>Ceiling Laser Projector</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newRoom.hasHighSpeedWifi}
                    onChange={(e) => setNewRoom({ ...newRoom, hasHighSpeedWifi: e.target.checked })}
                    className="rounded text-cyan-600"
                  />
                  <span>High-Speed Wi-Fi 6 AP</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newRoom.hasLectureCapture}
                    onChange={(e) => setNewRoom({ ...newRoom, hasLectureCapture: e.target.checked })}
                    className="rounded text-cyan-600"
                  />
                  <span>Lecture Capture Camera</span>
                </label>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddRoomOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-cyan-600 text-white hover:bg-cyan-700">
                Save Instructional Space
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: ATTACH EVIDENCE */}
      <Dialog open={isUploadEvidenceOpen} onOpenChange={setIsUploadEvidenceOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-cyan-600">
              <UploadCloud className="h-5 w-5" /> Attach Metric 2.3.2 Evidentiary Dossier
            </DialogTitle>
            <DialogDescription>
              Upload master room inventories, LMS server usage analytics, or digital library subscriptions
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadEvidence} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="eviTitle">Document Title *</Label>
              <Input
                id="eviTitle"
                placeholder="e.g. Master ICT-Enabled Classrooms Audit 2025-26"
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
                placeholder="e.g. Master_ICT_Classrooms_Audit_2025_26.pdf"
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
              <Button type="submit" className="bg-cyan-600 text-white hover:bg-cyan-700">
                Upload & Verify
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 3: VIEW EVIDENCE DOCUMENT */}
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

              <div className="flex items-center justify-between p-3 rounded bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-900/40 text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-cyan-600" />
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
