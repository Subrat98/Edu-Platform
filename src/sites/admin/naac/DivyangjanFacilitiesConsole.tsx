import { useState, useEffect } from "react";
import {
  Accessibility,
  FileText,
  Search,
  Plus,
  ExternalLink,
  UploadCloud,
  CheckCircle2,
  Building,
  Activity,
  Monitor,
  Footprints,
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
  getDivyangjanInclusionData,
  addDivyangjanFacility,
  addAssistiveTool,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type {
  DivyangjanInclusionData,
  DivyangjanFacilityRecord,
  AssistiveTechnologyRecord,
  NaacEvidenceDocument,
} from "@/types";

interface DivyangjanFacilitiesConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function DivyangjanFacilitiesConsole({ onEvidenceUpdated }: DivyangjanFacilitiesConsoleProps) {
  const [data, setData] = useState<DivyangjanInclusionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [evidenceList, setEvidenceList] = useState<NaacEvidenceDocument[]>([]);
  const [activeTab, setActiveTab] = useState("facilities");
  const [searchQuery, setSearchQuery] = useState("");

  // Add Facility Modal
  const [showAddFacilityModal, setShowAddFacilityModal] = useState(false);
  const [facilityName, setFacilityName] = useState("");
  const [facilityCategory, setFacilityCategory] = useState<DivyangjanFacilityRecord["facilityCategory"]>(
    "Built Environment with Ramps / Lifts"
  );
  const [buildingLocation, setBuildingLocation] = useState("");
  const [technicalSpecs, setTechnicalSpecs] = useState("1:12 slope gradient, non-slip vitrified tiles, SS handrails");

  // Add Assistive Tool Modal
  const [showAddToolModal, setShowAddToolModal] = useState(false);
  const [softwareOrToolName, setSoftwareOrToolName] = useState("");
  const [toolType, setToolType] = useState<AssistiveTechnologyRecord["type"]>(
    "Screen Reading Software (NVDA / JAWS)"
  );
  const [workstationsConfigured, setWorkstationsConfigured] = useState(4);
  const [location, setLocation] = useState("Central Digital Library");
  const [licenseDetails, setLicenseDetails] = useState("Institutional Multi-User Enterprise License");

  // Upload Evidence Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDept, setEvidenceDept] = useState("Equal Opportunity Cell (EOC) / Estate Office");
  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadConsoleData();
  }, []);

  async function loadConsoleData() {
    setLoading(true);
    try {
      const [divData, evidences] = await Promise.all([
        getDivyangjanInclusionData(),
        getEvidenceForMetric("7.1.7"),
      ]);
      setData(divData);
      setEvidenceList(evidences);
    } catch (err) {
      console.error("Failed to load divyangjan facilities data", err);
    } finally {
      setLoading(false);
    }
  }

  const handleAddFacility = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facilityName.trim() || !buildingLocation.trim()) return;

    try {
      await addDivyangjanFacility(
        {
          facilityName,
          facilityCategory,
          buildingLocation,
          technicalSpecs,
          geoTaggedPhotoUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
          complianceStandard: "Harmonized Guidelines & CPWD Norms",
        },
        { name: "Prof. Anjali Saxena", role: "Equal Opportunity Cell Coordinator" }
      );
      setShowAddFacilityModal(false);
      setFacilityName("");
      setBuildingLocation("");
      loadConsoleData();
    } catch (err) {
      console.error("Failed to add facility", err);
    }
  };

  const handleAddTool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!softwareOrToolName.trim()) return;

    try {
      await addAssistiveTool(
        {
          softwareOrToolName,
          type: toolType,
          workstationsConfigured,
          location,
          licenseDetails,
        },
        { name: "Prof. Anjali Saxena", role: "Equal Opportunity Cell Coordinator" }
      );
      setShowAddToolModal(false);
      setSoftwareOrToolName("");
      loadConsoleData();
    } catch (err) {
      console.error("Failed to add assistive tool", err);
    }
  };

  const handleUploadEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceTitle.trim() || !evidenceFile) return;

    setUploading(true);
    try {
      await uploadEvidenceDocument(
        {
          metricCode: "7.1.7",
          title: evidenceTitle,
          description: evidenceDesc || "Barrier-free access audit report, CPWD compliance certificate, and geo-tagged facility photos",
          criterion: 7,
          fileType: "pdf",
          department: evidenceDept,
          academicYear: "2024-25",
          url: URL.createObjectURL(evidenceFile),
        },
        evidenceFile,
        { name: "Prof. Anjali Saxena", role: "Equal Opportunity Cell Coordinator" }
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
          <p className="text-sm text-muted-foreground">Loading Divyangjan Barrier-Free Facilities data...</p>
        </div>
      </div>
    );
  }

  const filteredFacilities = data.facilities.filter(
    (f) =>
      f.facilityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.facilityCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.buildingLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTools = data.assistiveTools.filter(
    (t) =>
      t.softwareOrToolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border bg-gradient-to-r from-blue-500/10 via-teal-500/10 to-transparent p-6 dark:from-blue-950/20 dark:via-teal-950/20 md:flex-row md:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-blue-500 font-semibold text-blue-600 dark:text-blue-400">
              NAAC Metric 7.1.7
            </Badge>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
              CPWD Harmonized Guidelines Compliant
            </Badge>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Divyangjan Barrier-Free Campus Facilities</h2>
          <p className="text-sm text-muted-foreground">
            14 universal access ramps, 4 Braille audio elevators, 8 dedicated disabled-friendly washrooms, 850m tactile paving, and assistive workstations.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowUploadModal(true)} className="gap-2">
            <UploadCloud className="h-4 w-4" />
            Upload Accessibility Audit
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setShowAddToolModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Assistive Software
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
            <CardTitle className="text-sm font-medium">Access Ramps</CardTitle>
            <Accessibility className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {data.totalRampsWithHandrailsCount} Ramps
            </div>
            <p className="text-xs text-muted-foreground">1:12 Gradient with Dual Handrails</p>
            <Progress value={100} className="mt-2 h-1.5 bg-blue-100 dark:bg-blue-950" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Braille Elevators</CardTitle>
            <Building className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {data.brailleElevatorsCount} Lifts
            </div>
            <p className="text-xs text-muted-foreground">Audio Voice Prompts & Braille Buttons</p>
            <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" /> All Multi-Storey Blocks Connected
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tactile Pathways</CardTitle>
            <Footprints className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {data.tactilePavingLengthMeters} Meters
            </div>
            <p className="text-xs text-muted-foreground">Guiding & Warning Pavers Installed</p>
            <p className="mt-2 text-xs text-muted-foreground">{data.dedicatedDisabledWashroomsCount} Accessible Washrooms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assistive Tech Stations</CardTitle>
            <Monitor className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">
              {data.screenReaderWorkstationsCount} Workstations
            </div>
            <p className="text-xs text-muted-foreground">NVDA, JAWS, DAISY & Braille Tools</p>
            <p className="mt-2 text-xs text-emerald-600 font-medium">Equal Opportunity Cell Supervised</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <TabsList className="grid w-full grid-cols-3 sm:w-auto">
            <TabsTrigger value="facilities" className="gap-2">
              <Accessibility className="h-4 w-4" />
              Barrier-Free Facilities ({data.facilities.length})
            </TabsTrigger>
            <TabsTrigger value="tools" className="gap-2">
              <Monitor className="h-4 w-4" />
              Assistive Technologies ({data.assistiveTools.length})
            </TabsTrigger>
            <TabsTrigger value="evidence" className="gap-2">
              <FileText className="h-4 w-4" />
              Evidences ({evidenceList.length})
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search facility, building, tool..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Tab 1: Facilities */}
        <TabsContent value="facilities" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Barrier-Free Infrastructure Roster</CardTitle>
              <CardDescription>
                Physical accessibility provisions compliant with the CPWD Harmonized Accessibility Guidelines.
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
                      <TableHead>Technical Specifications</TableHead>
                      <TableHead>Standard</TableHead>
                      <TableHead className="text-right">Geo-Tagged Photo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFacilities.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                          No facilities found matching your search.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredFacilities.map((fac) => (
                        <TableRow key={fac.id}>
                          <TableCell className="font-medium text-sm">{fac.facilityName}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {fac.facilityCategory}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{fac.buildingLocation}</TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-xs">{fac.technicalSpecs}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[10px] border-emerald-300 text-emerald-700 dark:text-emerald-400">
                              {fac.complianceStandard}
                            </Badge>
                          </TableCell>
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

        {/* Tab 2: Assistive Technologies */}
        <TabsContent value="tools" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Screen-Reading Software & Assistive Tool Infrastructure</CardTitle>
              <CardDescription>
                Licensed software, audio workstations, Braille display consoles, and magnifiers for visually and mobility-impaired scholars.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Software / Tool Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-center">Workstations</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>License Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTools.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                          No assistive tools found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTools.map((tool) => (
                        <TableRow key={tool.id}>
                          <TableCell className="font-medium text-sm">{tool.softwareOrToolName}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {tool.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center font-bold text-xs text-blue-600">
                            {tool.workstationsConfigured}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{tool.location}</TableCell>
                          <TableCell className="text-xs text-muted-foreground font-mono">{tool.licenseDetails}</TableCell>
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
                  <CardTitle className="text-base">NAAC Metric 7.1.7 Statutory Evidences</CardTitle>
                  <CardDescription>
                    Barrier-free access audit certificates, tactile layout blueprints, software invoice licenses, and geo-tagged photos.
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
                  <p className="text-xs text-muted-foreground">Upload CPWD audit certificates and assistive licenses.</p>
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

      {/* Modal: Add Barrier-Free Facility */}
      <Dialog open={showAddFacilityModal} onOpenChange={setShowAddFacilityModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Register Barrier-Free Facility</DialogTitle>
            <DialogDescription>
              Document accessibility ramps, Braille elevators, tactile paths, or specialized washrooms.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddFacility} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="facilityName" className="text-xs">Facility Name</Label>
              <Input
                id="facilityName"
                placeholder="e.g., Access Ramp with Dual SS Handrails (1:12)"
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="category" className="text-xs">Facility Category</Label>
              <Select
                value={facilityCategory}
                onValueChange={(val) => setFacilityCategory(val as DivyangjanFacilityRecord["facilityCategory"])}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Built Environment with Ramps / Lifts">Built Environment with Ramps / Lifts</SelectItem>
                  <SelectItem value="Divyangjan-Friendly Washrooms">Divyangjan-Friendly Washrooms</SelectItem>
                  <SelectItem value="Illuminated Signage & Tactile Paths">Illuminated Signage & Tactile Paths</SelectItem>
                  <SelectItem value="Assistive Software & Reading Facilities">Assistive Software & Reading Facilities</SelectItem>
                  <SelectItem value="Barrier-Free Vehicle Accessibility">Barrier-Free Vehicle Accessibility</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="loc" className="text-xs">Building Location</Label>
              <Input
                id="loc"
                placeholder="e.g., Main Administrative Complex Entrance"
                value={buildingLocation}
                onChange={(e) => setBuildingLocation(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="specs" className="text-xs">Technical Specifications</Label>
              <Input
                id="specs"
                value={technicalSpecs}
                onChange={(e) => setTechnicalSpecs(e.target.value)}
                required
              />
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

      {/* Modal: Add Assistive Technology */}
      <Dialog open={showAddToolModal} onOpenChange={setShowAddToolModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Assistive Technology Tool</DialogTitle>
            <DialogDescription>
              Record screen-readers, Braille keyboards, DAISY players, or audiobooks.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddTool} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="toolName" className="text-xs">Software / Hardware Name</Label>
              <Input
                id="toolName"
                placeholder="e.g., NVDA Screen Reader & Freedom Scientific JAWS"
                value={softwareOrToolName}
                onChange={(e) => setSoftwareOrToolName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="toolType" className="text-xs">Tool Category</Label>
                <Select
                  value={toolType}
                  onValueChange={(val) => setToolType(val as AssistiveTechnologyRecord["type"])}
                >
                  <SelectTrigger id="toolType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Screen Reading Software (NVDA / JAWS)">Screen Reading Software (NVDA / JAWS)</SelectItem>
                    <SelectItem value="Braille Signage & Tactile Display">Braille Signage & Tactile Display</SelectItem>
                    <SelectItem value="Magnification Equipment">Magnification Equipment</SelectItem>
                    <SelectItem value="Audiobook Recording & Kiosk">Audiobook Recording & Kiosk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="wsCount" className="text-xs">Workstations Configured</Label>
                <Input
                  id="wsCount"
                  type="number"
                  value={workstationsConfigured}
                  onChange={(e) => setWorkstationsConfigured(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="toolLoc" className="text-xs">Location</Label>
              <Input
                id="toolLoc"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="lic" className="text-xs">License / Procurement Details</Label>
              <Input
                id="lic"
                value={licenseDetails}
                onChange={(e) => setLicenseDetails(e.target.value)}
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddToolModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Assistive Tool</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Upload Official Evidence */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Accessibility Evidence</DialogTitle>
            <DialogDescription>
              Attach statutory CPWD accessibility compliance audit, tactile layout drawings, or software invoices.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadEvidence} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="evidenceTitle" className="text-xs">Document Title</Label>
              <Input
                id="evidenceTitle"
                placeholder="e.g., CPWD Barrier-Free Accessibility Audit Certificate"
                value={evidenceTitle}
                onChange={(e) => setEvidenceTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="evidenceDept" className="text-xs">Issuing Authority / Cell</Label>
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
                placeholder="Audit certificate numbers, tactile path diagrams, software licenses..."
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
