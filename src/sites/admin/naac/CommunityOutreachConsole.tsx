import { useState, useEffect } from "react";
import {
  HeartHandshake,
  MapPin,
  CheckCircle2,
  TrendingUp,
  FileText,
  Search,
  Plus,
  Download,
  ExternalLink,
  UploadCloud,
  ShieldCheck,
  Building2,
  Filter,
  Eye,
  Users,
  Calendar,
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
  getExtensionActivitiesData,
  addCommunityOutreachRecord,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type {
  ExtensionActivitiesData,
  CommunityOutreachRecord,
  NaacEvidenceDocument,
} from "@/types";

interface CommunityOutreachConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function CommunityOutreachConsole({ onEvidenceUpdated }: CommunityOutreachConsoleProps) {
  const [data, setData] = useState<ExtensionActivitiesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [evidenceList, setEvidenceList] = useState<NaacEvidenceDocument[]>([]);
  const [activeTab, setActiveTab] = useState("drives");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterUnit, setFilterUnit] = useState<string>("all");

  // Add Drive Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [activityName, setActivityName] = useState("");
  const [organizingUnit, setOrganizingUnit] = useState<CommunityOutreachRecord["organizingUnit"]>("NSS Unit I");
  const [collaboratingAgency, setCollaboratingAgency] = useState("Red Cross Society");
  const [location, setLocation] = useState("Giri Village, Khordha");
  const [activityDate, setActivityDate] = useState("2025-10-15");
  const [volunteers, setVolunteers] = useState(120);
  const [coordinators, setCoordinators] = useState("Dr. B. K. Ray");
  const [beneficiaries, setBeneficiaries] = useState(450);
  const [lat, setLat] = useState(20.2961);
  const [lng, setLng] = useState(85.8245);
  const [brief, setBrief] = useState("Community health and literacy extension activity.");

  // Upload Evidence Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDept, setEvidenceDept] = useState("NSS & NCC Units");
  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadConsoleData();
  }, []);

  async function loadConsoleData() {
    setLoading(true);
    try {
      const [extData, evidences] = await Promise.all([
        getExtensionActivitiesData(),
        getEvidenceForMetric("3.6.1"),
      ]);
      setData(extData);
      setEvidenceList(evidences);
    } catch (err) {
      console.error("Failed to load extension activities data", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredDrives = (data?.drives || []).filter((d) => {
    const matchesSearch =
      d.activityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.collaboratingAgency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.targetCommunityOrLocation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUnit = filterUnit === "all" || d.organizingUnit === filterUnit;
    return matchesSearch && matchesUnit;
  });

  async function handleAddDrive(e: React.FormEvent) {
    e.preventDefault();
    if (!activityName || !collaboratingAgency) return;

    try {
      await addCommunityOutreachRecord(
        {
          activityName,
          organizingUnit,
          collaboratingAgency,
          targetCommunityOrLocation: location,
          activityDate,
          studentVolunteersCount: Number(volunteers),
          facultyCoordinators: coordinators.split(",").map((s) => s.trim()),
          beneficiariesReached: Number(beneficiaries),
          latitude: Number(lat),
          longitude: Number(lng),
          geoTaggedPhotoUrl: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=600&q=80",
          activityBrief: brief,
        },
        { name: "Dr. B. K. Ray", role: "NSS Programme Coordinator" }
      );

      setShowAddModal(false);
      setActivityName("");
      loadConsoleData();
    } catch (err) {
      console.error("Failed to add community outreach drive", err);
    }
  }

  async function handleUploadEvidence(e: React.FormEvent) {
    e.preventDefault();
    if (!evidenceTitle) return;

    setUploading(true);
    try {
      await uploadEvidenceDocument(
        {
          criterionId: 3,
          indicatorCode: "3.6",
          metricCode: "3.6.1",
          title: evidenceTitle,
          academicYear: "2025-26",
          department: evidenceDept,
          documentType: "PDF",
          description: evidenceDesc || "Geo-tagged photo compendium and community outreach reports.",
          remarks: "Verified with GPS coordinates and volunteer attendance rolls.",
          fileName: evidenceFile?.name || `${evidenceTitle.replace(/\s+/g, "_")}.pdf`,
          fileSize: evidenceFile ? `${(evidenceFile.size / (1024 * 1024)).toFixed(1)} MB` : "7.8 MB",
          evidenceUrl: `/documents/naac/evidence/ExtensionDrives_${Date.now()}.pdf`,
        },
        { name: "Dr. B. K. Ray", role: "NSS Programme Coordinator" }
      );

      setShowUploadModal(false);
      setEvidenceTitle("");
      setEvidenceDesc("");
      setEvidenceFile(null);
      loadConsoleData();
      if (onEvidenceUpdated) onEvidenceUpdated();
    } catch (err) {
      console.error("Failed to upload evidence", err);
    } finally {
      setUploading(false);
    }
  }

  if (loading || !data) {
    return (
      <Card className="border-rose-200 bg-white/70 backdrop-blur">
        <CardContent className="p-12 text-center text-muted-foreground">
          <div className="animate-spin w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full mx-auto mb-4" />
          Loading Community Outreach & Extension Activities Console...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Card */}
      <Card className="border-2 border-rose-300 bg-gradient-to-br from-rose-50/80 via-white to-red-50/70 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-rose-700 text-white hover:bg-rose-800">
                  NAAC Metric 3.6.1
                </Badge>
                <Badge variant="outline" className="text-rose-800 border-rose-300">
                  Community Outreach & Extension
                </Badge>
                <Badge className="bg-emerald-600 text-white">Weightage: 20 Marks</Badge>
              </div>
              <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <HeartHandshake className="w-6 h-6 text-rose-600" />
                Community Outreach & Geo-Tagged Extension Compendium (14 Drives)
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Institutional extension initiatives by NSS Units I & II, NCC Army/Naval Wings, Youth Red Cross, and Eco Club with GPS geo-coordinates, volunteer registers, and beneficiary impact.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                className="border-rose-300 text-rose-800 hover:bg-rose-50 text-xs sm:text-sm"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Outreach Drive
              </Button>
              <Button
                className="bg-rose-700 hover:bg-rose-800 text-white text-xs sm:text-sm shadow-sm"
                onClick={() => setShowUploadModal(true)}
              >
                <UploadCloud className="w-4 h-4 mr-1.5" />
                Upload Compendium
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Documented Drives</span>
                <HeartHandshake className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-3xl font-black text-rose-800 mt-1">
                {data.totalExtensionDrives}
              </div>
              <div className="text-xs text-emerald-600 font-medium mt-1">
                Benchmark: ≥ 10 Drives/Year (140% Met)
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Student Volunteers</span>
                <Users className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-3xl font-black text-indigo-700 mt-1">
                {data.totalStudentParticipants.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 mt-1">Active NSS/NCC/YRC Cadets</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Community Beneficiaries</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-emerald-700 mt-1">
                {data.totalBeneficiaries.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 mt-1">Rural, Tribal & Coastal Zones</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>State Recognitions</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-black text-amber-600 mt-1">
                {data.awardsAndRecognitionsCount}
              </div>
              <div className="text-xs text-emerald-600 font-medium mt-1">Red Cross & Govt Citations</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Layout */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-sm bg-gray-100 p-1">
          <TabsTrigger value="drives" className="text-xs sm:text-sm">
            14 Outreach Drives
          </TabsTrigger>
          <TabsTrigger value="evidence" className="text-xs sm:text-sm">
            Evidences & Geo-Photos ({evidenceList.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Drives Table */}
        <TabsContent value="drives" className="space-y-4 mt-4">
          <Card className="border border-rose-100 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-semibold text-gray-800">
                    Community Outreach Activities Register
                  </CardTitle>
                  <CardDescription>
                    All 14 extension drives with geo-coordinates, volunteer counts, and collaborating partners.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative w-48 sm:w-60">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-3 text-gray-400" />
                    <Input
                      placeholder="Search drive, partner, location..."
                      className="pl-8 text-xs h-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={filterUnit} onValueChange={setFilterUnit}>
                    <SelectTrigger className="w-40 text-xs h-9">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Units</SelectItem>
                      <SelectItem value="NSS Unit I">NSS Unit I</SelectItem>
                      <SelectItem value="NSS Unit II">NSS Unit II</SelectItem>
                      <SelectItem value="NCC Army Wing">NCC Army Wing</SelectItem>
                      <SelectItem value="NCC Naval Wing">NCC Naval Wing</SelectItem>
                      <SelectItem value="Youth Red Cross (YRC)">Youth Red Cross (YRC)</SelectItem>
                      <SelectItem value="Eco Club">Eco Club</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/80">
                      <TableHead className="font-semibold text-xs">Drive Title & Location</TableHead>
                      <TableHead className="font-semibold text-xs">Organizing Unit</TableHead>
                      <TableHead className="font-semibold text-xs">Collaborating Agency</TableHead>
                      <TableHead className="font-semibold text-xs">Date</TableHead>
                      <TableHead className="font-semibold text-xs text-center">Volunteers</TableHead>
                      <TableHead className="font-semibold text-xs text-center">Beneficiaries</TableHead>
                      <TableHead className="font-semibold text-xs text-center">GPS Proof</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDrives.map((d) => (
                      <TableRow key={d.id} className="hover:bg-rose-50/30">
                        <TableCell>
                          <div className="font-semibold text-xs text-gray-900 max-w-sm sm:max-w-md leading-snug">
                            {d.activityName}
                          </div>
                          <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-rose-500" />
                            {d.targetCommunityOrLocation}
                          </div>
                          <div className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{d.activityBrief}</div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              d.organizingUnit.includes("Red Cross")
                                ? "border-rose-300 text-rose-800 bg-rose-50 text-[10px]"
                                : d.organizingUnit.includes("NCC")
                                ? "border-blue-300 text-blue-800 bg-blue-50 text-[10px]"
                                : "text-[10px]"
                            }
                          >
                            {d.organizingUnit}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-gray-800">
                          {d.collaboratingAgency}
                        </TableCell>
                        <TableCell className="text-xs text-gray-600 font-mono">
                          {d.activityDate}
                        </TableCell>
                        <TableCell className="text-xs text-center font-bold text-indigo-700">
                          {d.studentVolunteersCount}
                        </TableCell>
                        <TableCell className="text-xs text-center font-bold text-emerald-700">
                          {d.beneficiariesReached.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center font-mono text-[10px] text-gray-600">
                          <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">
                            {d.latitude.toFixed(4)}, {d.longitude.toFixed(4)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ResponsiveTableContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Evidences */}
        <TabsContent value="evidence" className="space-y-4 mt-4">
          <Card className="border border-rose-100 shadow-xs">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-gray-800">
                  Evidentiary Documentation (Metric 3.6.1)
                </CardTitle>
                <CardDescription>
                  Geo-tagged photo compendiums, volunteer registers, and community letters of appreciation.
                </CardDescription>
              </div>
              <Button
                size="sm"
                className="bg-rose-700 hover:bg-rose-800 text-white text-xs"
                onClick={() => setShowUploadModal(true)}
              >
                <UploadCloud className="w-3.5 h-3.5 mr-1" />
                Upload Photo Compendium
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {evidenceList.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl border border-gray-100 bg-white hover:border-rose-200 hover:shadow-xs transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-rose-50 text-rose-700 rounded-lg">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900 leading-snug">
                            {doc.title}
                          </h4>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            {doc.department} • {doc.academicYear} • {doc.fileSize}
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">
                        {doc.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{doc.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] text-gray-500">
                      <span>Uploaded by: {doc.uploadedBy}</span>
                      <a
                        href={doc.evidenceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-rose-700 font-medium hover:underline inline-flex items-center gap-1"
                      >
                        View Compendium <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-800">
              <HeartHandshake className="w-5 h-5" />
              Add Community Outreach Drive
            </DialogTitle>
            <DialogDescription>
              Record community extension event, volunteers, and geo-tagged coordinates.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddDrive} className="space-y-3">
            <div>
              <Label className="text-xs">Outreach Activity Name</Label>
              <Input
                className="text-xs h-9"
                required
                placeholder="e.g. Tree Plantation Drive in Adopted Village"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Organizing Unit</Label>
                <Select
                  value={organizingUnit}
                  onValueChange={(val: any) => setOrganizingUnit(val)}
                >
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NSS Unit I">NSS Unit I</SelectItem>
                    <SelectItem value="NSS Unit II">NSS Unit II</SelectItem>
                    <SelectItem value="NCC Army Wing">NCC Army Wing</SelectItem>
                    <SelectItem value="NCC Naval Wing">NCC Naval Wing</SelectItem>
                    <SelectItem value="Youth Red Cross (YRC)">Youth Red Cross (YRC)</SelectItem>
                    <SelectItem value="Eco Club">Eco Club</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Collaborating Agency</Label>
                <Input
                  className="text-xs h-9"
                  required
                  value={collaboratingAgency}
                  onChange={(e) => setCollaboratingAgency(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Target Location</Label>
                <Input
                  className="text-xs h-9"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">Activity Date</Label>
                <Input
                  type="date"
                  className="text-xs h-9"
                  value={activityDate}
                  onChange={(e) => setActivityDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Volunteers Count</Label>
                <Input
                  type="number"
                  className="text-xs h-9"
                  value={volunteers}
                  onChange={(e) => setVolunteers(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Beneficiaries Reached</Label>
                <Input
                  type="number"
                  className="text-xs h-9"
                  value={beneficiaries}
                  onChange={(e) => setBeneficiaries(Number(e.target.value))}
                />
              </div>
            </div>

            <div>
              <Label className="text-xs">Activity Brief</Label>
              <Input
                className="text-xs h-9"
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                className="text-xs h-9"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-rose-700 hover:bg-rose-800 text-white text-xs h-9">
                Save Outreach Drive
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Upload Evidence Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-800">
              <UploadCloud className="w-5 h-5" />
              Upload Extension Compendium
            </DialogTitle>
            <DialogDescription>
              Attach geo-tagged photographs, press clippings, and attendance rolls.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadEvidence} className="space-y-3">
            <div>
              <Label className="text-xs">Document Title</Label>
              <Input
                className="text-xs h-9"
                required
                placeholder="e.g. Community Outreach Compendium 14 Drives 2025-26"
                value={evidenceTitle}
                onChange={(e) => setEvidenceTitle(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs">Department / Issuer</Label>
              <Input
                className="text-xs h-9"
                value={evidenceDept}
                onChange={(e) => setEvidenceDept(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs">Description</Label>
              <Input
                className="text-xs h-9"
                placeholder="Brief summary of extension drives and geo-tagged proofs"
                value={evidenceDesc}
                onChange={(e) => setEvidenceDesc(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs">Select Document (PDF/XLSX)</Label>
              <Input
                type="file"
                className="text-xs h-9"
                accept=".pdf,.xlsx,.csv"
                onChange={(e) => setEvidenceFile(e.target.files?.[0] || null)}
              />
            </div>
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                className="text-xs h-9"
                onClick={() => setShowUploadModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={uploading}
                className="bg-rose-700 hover:bg-rose-800 text-white text-xs h-9"
              >
                {uploading ? "Uploading..." : "Upload & Link Document"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
