import { useState, useEffect } from "react";
import {
  Shield,
  Heart,
  Camera,
  Users,
  Baby,
  FileText,
  Search,
  Plus,
  ExternalLink,
  UploadCloud,
  CheckCircle2,
  Calendar,
  Building,
  Activity,
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
  getGenderEquityData,
  addGenderSafetyFacility,
  addGenderSensitizationEvent,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type {
  GenderEquityData,
  GenderSafetyFacilityRecord,
  GenderSensitizationEventRecord,
  NaacEvidenceDocument,
} from "@/types";

interface GenderEquityConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function GenderEquityConsole({ onEvidenceUpdated }: GenderEquityConsoleProps) {
  const [data, setData] = useState<GenderEquityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [evidenceList, setEvidenceList] = useState<NaacEvidenceDocument[]>([]);
  const [activeTab, setActiveTab] = useState("facilities");
  const [searchQuery, setSearchQuery] = useState("");

  // Add Facility Modal
  const [showAddFacilityModal, setShowAddFacilityModal] = useState(false);
  const [facilityName, setFacilityName] = useState("");
  const [category, setCategory] = useState<GenderSafetyFacilityRecord["category"]>("Safety & Security (CCTV / Security)");
  const [location, setLocation] = useState("");
  const [capacityOrCoverage, setCapacityOrCoverage] = useState("");
  const [operatingHours, setOperatingHours] = useState("24x7");
  const [inChargePersonnel, setInChargePersonnel] = useState("Chief Security Officer / ICC Chair");

  // Add Sensitization Event Modal
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [dateConducted, setDateConducted] = useState(new Date().toISOString().split("T")[0]);
  const [organizingBody, setOrganizingBody] = useState("Internal Complaints Committee (ICC) & WDC");
  const [resourcePerson, setResourcePerson] = useState("");
  const [participantsCount, setParticipantsCount] = useState(120);
  const [summaryImpact, setSummaryImpact] = useState("Sensitization on POSH Act, cyber harassment, and gender inclusion.");

  // Upload Evidence Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDept, setEvidenceDept] = useState("Internal Complaints Committee (ICC)");
  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadConsoleData();
  }, []);

  async function loadConsoleData() {
    setLoading(true);
    try {
      const [genData, evidences] = await Promise.all([
        getGenderEquityData(),
        getEvidenceForMetric("7.1.1"),
      ]);
      setData(genData);
      setEvidenceList(evidences);
    } catch (err) {
      console.error("Failed to load gender equity data", err);
    } finally {
      setLoading(false);
    }
  }

  const handleAddFacility = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facilityName.trim() || !location.trim()) return;

    try {
      await addGenderSafetyFacility(
        {
          facilityName,
          category,
          location,
          capacityOrCoverage,
          operatingHours,
          inChargePersonnel,
          geoTaggedPhotoUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80",
        },
        { name: "Dr. Radhika Sen", role: "ICC Presiding Officer" }
      );
      setShowAddFacilityModal(false);
      setFacilityName("");
      setLocation("");
      loadConsoleData();
    } catch (err) {
      console.error("Failed to add facility", err);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !resourcePerson.trim()) return;

    try {
      await addGenderSensitizationEvent(
        {
          eventTitle,
          dateConducted,
          organizingBody,
          resourcePerson,
          participantsCount,
          summaryImpact,
          eventReportUrl: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&w=1200&q=80",
        },
        { name: "Dr. Radhika Sen", role: "ICC Presiding Officer" }
      );
      setShowAddEventModal(false);
      setEventTitle("");
      setResourcePerson("");
      loadConsoleData();
    } catch (err) {
      console.error("Failed to add sensitization event", err);
    }
  };

  const handleUploadEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceTitle.trim() || !evidenceFile) return;

    setUploading(true);
    try {
      await uploadEvidenceDocument(
        {
          metricCode: "7.1.1",
          title: evidenceTitle,
          description: evidenceDesc || "Gender equity promotion audit report, geo-tagged safety facilities, and ICC annual summary",
          criterion: 7,
          fileType: "pdf",
          department: evidenceDept,
          academicYear: "2024-25",
          url: URL.createObjectURL(evidenceFile),
        },
        evidenceFile,
        { name: "Dr. Radhika Sen", role: "ICC Presiding Officer" }
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
          <p className="text-sm text-muted-foreground">Loading Gender Equity & Campus Safety data...</p>
        </div>
      </div>
    );
  }

  const filteredFacilities = data.facilities.filter(
    (f) =>
      f.facilityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEvents = data.sensitizationEvents.filter(
    (e) =>
      e.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.resourcePerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.organizingBody.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-transparent p-6 dark:from-pink-950/20 dark:via-rose-950/20 md:flex-row md:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-pink-500 font-semibold text-pink-600 dark:text-pink-400">
              NAAC Metric 7.1.1
            </Badge>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
              {data.genderAuditRating}
            </Badge>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Gender Equity Promotion & Campus Safety Facilities</h2>
          <p className="text-sm text-muted-foreground">
            24x7 security, 148 CCTV surveillance, day care crèche, dedicated girls' common rooms, sanitary hygiene units, and active ICC grievance redressal.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowUploadModal(true)} className="gap-2">
            <UploadCloud className="h-4 w-4" />
            Upload Gender Audit
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setShowAddEventModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Sensitization Event
          </Button>
          <Button size="sm" onClick={() => setShowAddFacilityModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Register Facility
          </Button>
        </div>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CCTV Surveillance</CardTitle>
            <Camera className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {data.totalCctvCamerasActive} Cameras
            </div>
            <p className="text-xs text-muted-foreground">100% Blind Spots & Perimeter Covered</p>
            <Progress value={95} className="mt-2 h-1.5 bg-blue-100 dark:bg-blue-950" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24x7 Security Guards</CardTitle>
            <Shield className="h-4 w-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">
              {data.securityGuardsRoundTheClock} Personnel
            </div>
            <p className="text-xs text-muted-foreground">Including 10 Female Security Officers</p>
            <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" /> Biometric Night Patrol Logged
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Day Care & Crèche</CardTitle>
            <Baby className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {data.dayCareChildrenEnrolled} Children
            </div>
            <p className="text-xs text-muted-foreground">Anandghar Day Care for Staff & Scholars</p>
            <p className="mt-2 text-xs text-muted-foreground">Qualified Nurse & Play Area Active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ICC Redressal Rate</CardTitle>
            <HeartHandshake className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">100%</div>
            <p className="text-xs text-muted-foreground">
              {data.iccComplaintsRedressed} of {data.iccComplaintsReceived} Complaints Resolved
            </p>
            <p className="mt-2 text-xs text-emerald-600 font-medium">POSH Act Compliant</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <TabsList className="grid w-full grid-cols-3 sm:w-auto">
            <TabsTrigger value="facilities" className="gap-2">
              <Shield className="h-4 w-4" />
              Safety Facilities ({data.facilities.length})
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-2">
              <Heart className="h-4 w-4" />
              Sensitization Events ({data.sensitizationEvents.length})
            </TabsTrigger>
            <TabsTrigger value="evidence" className="gap-2">
              <FileText className="h-4 w-4" />
              Evidences ({evidenceList.length})
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search facility, event, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Tab 1: Safety Facilities */}
        <TabsContent value="facilities" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Safety, Security & Support Facilities Compendium</CardTitle>
              <CardDescription>
                Physical infrastructure ensuring safety, privacy, personal health, and child care on campus.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Facility Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Capacity / Specs</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>In-Charge</TableHead>
                      <TableHead className="text-right">Geo-Tagged Photo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFacilities.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                          No facilities found matching your search.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredFacilities.map((fac) => (
                        <TableRow key={fac.id}>
                          <TableCell className="font-medium text-sm">{fac.facilityName}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {fac.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{fac.location}</TableCell>
                          <TableCell className="text-xs font-medium">{fac.capacityOrCoverage}</TableCell>
                          <TableCell className="text-xs">{fac.operatingHours}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{fac.inChargePersonnel}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => window.open(fac.geoTaggedPhotoUrl, "_blank")}
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

        {/* Tab 2: Sensitization Events */}
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Gender Sensitization & Equity Workshops</CardTitle>
              <CardDescription>
                Educational workshops, self-defense programmes, POSH awareness drives, and Women's Day celebrations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Resource Person</TableHead>
                      <TableHead>Organizing Body</TableHead>
                      <TableHead className="text-right">Participants</TableHead>
                      <TableHead>Impact & Summary</TableHead>
                      <TableHead className="text-right">Report</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                          No events found matching your search.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEvents.map((evt) => (
                        <TableRow key={evt.id}>
                          <TableCell className="font-medium text-sm">{evt.eventTitle}</TableCell>
                          <TableCell className="text-xs font-mono">{evt.dateConducted}</TableCell>
                          <TableCell className="text-xs font-medium">{evt.resourcePerson}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{evt.organizingBody}</TableCell>
                          <TableCell className="text-right font-semibold text-xs text-pink-600">
                            {evt.participantsCount}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                            {evt.summaryImpact}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => window.open(evt.eventReportUrl, "_blank")}
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

        {/* Tab 3: Evidences */}
        <TabsContent value="evidence" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">NAAC Metric 7.1.1 Statutory Proofs & Reports</CardTitle>
                  <CardDescription>
                    Official Gender Audit report, ICC annual reports, day care registration, and CCTV logs.
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
                  <p className="text-xs text-muted-foreground">Upload gender audit reports and ICC proceedings.</p>
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
                          <FileText className="h-5 w-5 text-pink-600" />
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

      {/* Modal: Add Gender Safety Facility */}
      <Dialog open={showAddFacilityModal} onOpenChange={setShowAddFacilityModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Register Gender Safety / Support Facility</DialogTitle>
            <DialogDescription>
              Document institutional facilities ensuring personal safety, privacy, and health.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddFacility} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="facilityName" className="text-xs">Facility Name</Label>
              <Input
                id="facilityName"
                placeholder="e.g., Central Campus CCTV Monitoring Control Room"
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="category" className="text-xs">Facility Category</Label>
              <Select
                value={category}
                onValueChange={(val) => setCategory(val as GenderSafetyFacilityRecord["category"])}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Safety & Security (CCTV / Security)">Safety & Security (CCTV / Security)</SelectItem>
                  <SelectItem value="Counseling & Redressal (ICC / Cell)">Counseling & Redressal (ICC / Cell)</SelectItem>
                  <SelectItem value="Common Rooms">Common Rooms</SelectItem>
                  <SelectItem value="Day Care Center for Staff/Students">Day Care Center for Staff/Students</SelectItem>
                  <SelectItem value="Sanitary Hygiene / Health">Sanitary Hygiene / Health</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="loc" className="text-xs">Location</Label>
                <Input
                  id="loc"
                  placeholder="e.g., Admin Block, Ground Floor"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="cap" className="text-xs">Capacity / Specs</Label>
                <Input
                  id="cap"
                  placeholder="e.g., 148 IP cameras, 30-day backup"
                  value={capacityOrCoverage}
                  onChange={(e) => setCapacityOrCoverage(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="hours" className="text-xs">Operating Hours</Label>
                <Input
                  id="hours"
                  value={operatingHours}
                  onChange={(e) => setOperatingHours(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="officer" className="text-xs">In-Charge Officer</Label>
                <Input
                  id="officer"
                  value={inChargePersonnel}
                  onChange={(e) => setInChargePersonnel(e.target.value)}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddFacilityModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Register Facility</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Add Sensitization Event */}
      <Dialog open={showAddEventModal} onOpenChange={setShowAddEventModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Gender Sensitization Event</DialogTitle>
            <DialogDescription>
              Record workshops, guest lectures, POSH orientations, and campaigns.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddEvent} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="evtTitle" className="text-xs">Event Title</Label>
              <Input
                id="evtTitle"
                placeholder="e.g., Legal Rights & Workplace Harassment Prevention (POSH)"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="evtDate" className="text-xs">Date Conducted</Label>
                <Input
                  id="evtDate"
                  type="date"
                  value={dateConducted}
                  onChange={(e) => setDateConducted(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="headCount" className="text-xs">Participants Count</Label>
                <Input
                  id="headCount"
                  type="number"
                  value={participantsCount}
                  onChange={(e) => setParticipantsCount(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="resource" className="text-xs">Resource Person / Speaker</Label>
              <Input
                id="resource"
                placeholder="e.g., Adv. Meenakshi Lekhi, High Court Advocate"
                value={resourcePerson}
                onChange={(e) => setResourcePerson(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="organizer" className="text-xs">Organizing Committee</Label>
              <Input
                id="organizer"
                value={organizingBody}
                onChange={(e) => setOrganizingBody(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="impact" className="text-xs">Summary Impact</Label>
              <Input
                id="impact"
                value={summaryImpact}
                onChange={(e) => setSummaryImpact(e.target.value)}
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddEventModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Event Record</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Upload Official Evidence */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Gender Equity Evidence</DialogTitle>
            <DialogDescription>
              Attach statutory Gender Audit reports, ICC minutes, or facility photographs.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadEvidence} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="evidenceTitle" className="text-xs">Document Title</Label>
              <Input
                id="evidenceTitle"
                placeholder="e.g., Institutional Gender Audit Report & Action Taken Plan"
                value={evidenceTitle}
                onChange={(e) => setEvidenceTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="evidenceDept" className="text-xs">Issuing Committee / Cell</Label>
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
                placeholder="Audit scores, committee composition, action items..."
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
