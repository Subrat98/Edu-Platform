import { useState, useEffect } from "react";
import {
  Droplets,
  Recycle,
  Trees,
  Award,
  FileText,
  Search,
  Plus,
  ExternalLink,
  UploadCloud,
  CheckCircle2,
  Building,
  Activity,
  Layers,
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
  getEnvironmentalAuditData,
  addWasteFacility,
  addRainwaterUnit,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type {
  EnvironmentalAuditData,
  WasteManagementFacilityRecord,
  RainwaterHarvestingRecord,
  NaacEvidenceDocument,
} from "@/types";

interface EnvironmentManagementConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function EnvironmentManagementConsole({ onEvidenceUpdated }: EnvironmentManagementConsoleProps) {
  const [data, setData] = useState<EnvironmentalAuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [evidenceList, setEvidenceList] = useState<NaacEvidenceDocument[]>([]);
  const [activeTab, setActiveTab] = useState("waste");
  const [searchQuery, setSearchQuery] = useState("");

  // Add Waste Facility Modal
  const [showAddWasteModal, setShowAddWasteModal] = useState(false);
  const [wasteType, setWasteType] = useState<WasteManagementFacilityRecord["wasteType"]>("Solid Waste Management (Composting)");
  const [facilityName, setFacilityName] = useState("");
  const [dailyCapacity, setDailyCapacity] = useState("");
  const [disposalOrRecyclingProtocol, setDisposalOrRecyclingProtocol] = useState("");
  const [mouPartnerOrVendor, setMouPartnerOrVendor] = useState("");
  const [inspectionCertificateRef, setInspectionCertificateRef] = useState("SPCB/ENV/2024-25/781");

  // Add Rainwater Unit Modal
  const [showAddRwhModal, setShowAddRwhModal] = useState(false);
  const [unitLocation, setUnitLocation] = useState("");
  const [catchmentAreaSqM, setCatchmentAreaSqM] = useState(1500);
  const [storageCapacityLitres, setStorageCapacityLitres] = useState(100000);
  const [rechargeBorewellsCount, setRechargeBorewellsCount] = useState(2);
  const [filtrationStages, setFiltrationStages] = useState("Dual-chamber sand and gravel filtration with overflow recharge");

  // Upload Evidence Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDept, setEvidenceDept] = useState("Green Campus & Environmental Cell");
  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadConsoleData();
  }, []);

  async function loadConsoleData() {
    setLoading(true);
    try {
      const [envData, evidences] = await Promise.all([
        getEnvironmentalAuditData(),
        getEvidenceForMetric("7.1.3"),
      ]);
      setData(envData);
      setEvidenceList(evidences);
    } catch (err) {
      console.error("Failed to load environment management data", err);
    } finally {
      setLoading(false);
    }
  }

  const handleAddWaste = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facilityName.trim()) return;

    try {
      await addWasteFacility(
        {
          wasteType,
          facilityName,
          dailyCapacity,
          disposalOrRecyclingProtocol,
          mouPartnerOrVendor,
          inspectionCertificateRef,
        },
        { name: "Dr. Sandeep Deshmukh", role: "Environmental Cell Convener" }
      );
      setShowAddWasteModal(false);
      setFacilityName("");
      loadConsoleData();
    } catch (err) {
      console.error("Failed to add waste facility", err);
    }
  };

  const handleAddRwh = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitLocation.trim()) return;

    try {
      await addRainwaterUnit(
        {
          unitLocation,
          catchmentAreaSqM,
          storageCapacityLitres,
          rechargeBorewellsCount,
          filtrationStages,
          geoTaggedPhotoUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=1200&q=80",
        },
        { name: "Dr. Sandeep Deshmukh", role: "Environmental Cell Convener" }
      );
      setShowAddRwhModal(false);
      setUnitLocation("");
      loadConsoleData();
    } catch (err) {
      console.error("Failed to add rainwater unit", err);
    }
  };

  const handleUploadEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceTitle.trim() || !evidenceFile) return;

    setUploading(true);
    try {
      await uploadEvidenceDocument(
        {
          metricCode: "7.1.3",
          title: evidenceTitle,
          description: evidenceDesc || "Green audit certificate, rainwater harvesting geo-tagged drawings, and waste management MoUs",
          criterion: 7,
          fileType: "pdf",
          department: evidenceDept,
          academicYear: "2024-25",
          url: URL.createObjectURL(evidenceFile),
        },
        evidenceFile,
        { name: "Dr. Sandeep Deshmukh", role: "Environmental Cell Convener" }
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
          <p className="text-sm text-muted-foreground">Loading Waste Management & Water Conservation data...</p>
        </div>
      </div>
    );
  }

  const filteredWaste = data.wasteFacilities.filter(
    (w) =>
      w.facilityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.wasteType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.mouPartnerOrVendor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRwh = data.rainwaterUnits.filter(
    (r) =>
      r.unitLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.filtrationStages.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border bg-gradient-to-r from-emerald-600/10 via-teal-600/10 to-transparent p-6 dark:from-emerald-950/20 dark:via-teal-950/20 md:flex-row md:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-emerald-600 font-semibold text-emerald-700 dark:text-emerald-400">
              NAAC Metric 7.1.3
            </Badge>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
              {data.greenAuditCertification}
            </Badge>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Waste Management & Water Conservation Systems</h2>
          <p className="text-sm text-muted-foreground">
            4.5 Lakh Litres rainwater harvesting capacity, 100 KLD MBBR sewage treatment plant, organic vermicomposting, and certified e-waste buyback protocols.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowUploadModal(true)} className="gap-2">
            <UploadCloud className="h-4 w-4" />
            Upload Green Audit
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setShowAddRwhModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add RWH Unit
          </Button>
          <Button size="sm" onClick={() => setShowAddWasteModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Register Waste Plant
          </Button>
        </div>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rainwater Harvesting</CardTitle>
            <Droplets className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {(data.totalRainwaterCapacityLitres / 100000).toFixed(1)} Lakh Litres
            </div>
            <p className="text-xs text-muted-foreground">3 Central Catchment Tanks & 6 Recharge Wells</p>
            <Progress value={95} className="mt-2 h-1.5 bg-blue-100 dark:bg-blue-950" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">STP Recycled Water</CardTitle>
            <Recycle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {data.stpPlantCapacityKld} KLD
            </div>
            <p className="text-xs text-muted-foreground">MBBR Biological Treatment Plant</p>
            <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" /> 100% Recycled for Gardens & Flushing
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vermicompost Output</CardTitle>
            <Trees className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">
              {data.annualCompostGeneratedKg.toLocaleString()} kg/yr
            </div>
            <p className="text-xs text-muted-foreground">Organic Fertilizer for Campus Flora</p>
            <p className="mt-2 text-xs text-muted-foreground">Zero Wet Food Waste to Landfill</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Green Certification</CardTitle>
            <Award className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">ISO 14001</div>
            <p className="text-xs text-muted-foreground">Platinum Green Campus Certified</p>
            <p className="mt-2 text-xs text-emerald-600 font-medium">{data.auditAgency}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <TabsList className="grid w-full grid-cols-3 sm:w-auto">
            <TabsTrigger value="waste" className="gap-2">
              <Recycle className="h-4 w-4" />
              Waste Management Units ({data.wasteFacilities.length})
            </TabsTrigger>
            <TabsTrigger value="rwh" className="gap-2">
              <Droplets className="h-4 w-4" />
              Rainwater Harvesting ({data.rainwaterUnits.length})
            </TabsTrigger>
            <TabsTrigger value="evidence" className="gap-2">
              <FileText className="h-4 w-4" />
              Evidences ({evidenceList.length})
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search facility, vendor, type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Tab 1: Waste Management */}
        <TabsContent value="waste" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Waste Management & Recycling Facilities</CardTitle>
              <CardDescription>
                Solid waste vermicomposting, sewage treatment, e-waste buyback MoUs, and biomedical disposal protocols.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Facility Name</TableHead>
                      <TableHead>Waste Category</TableHead>
                      <TableHead>Daily Capacity</TableHead>
                      <TableHead>Disposal / Recycling Protocol</TableHead>
                      <TableHead>Partner / Recycler</TableHead>
                      <TableHead>Compliance Ref.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWaste.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                          No waste management facilities found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredWaste.map((w) => (
                        <TableRow key={w.id}>
                          <TableCell className="font-medium text-sm">{w.facilityName}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {w.wasteType}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs font-semibold text-emerald-600">{w.dailyCapacity}</TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-xs">{w.disposalOrRecyclingProtocol}</TableCell>
                          <TableCell className="text-xs font-medium">{w.mouPartnerOrVendor}</TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">{w.inspectionCertificateRef}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ResponsiveTableContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Rainwater Harvesting */}
        <TabsContent value="rwh" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Rainwater Harvesting & Ground Water Recharge Units</CardTitle>
              <CardDescription>
                Rooftop catchment areas, storage reservoirs, and deep borewell recharge shafts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unit Location</TableHead>
                      <TableHead className="text-right">Catchment Area (sq.m)</TableHead>
                      <TableHead className="text-right">Storage Capacity (L)</TableHead>
                      <TableHead className="text-center">Recharge Borewells</TableHead>
                      <TableHead>Filtration Stages</TableHead>
                      <TableHead className="text-right">Geo-Tagged Photo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRwh.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                          No rainwater harvesting units found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRwh.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="font-medium text-sm">{r.unitLocation}</TableCell>
                          <TableCell className="text-right font-medium text-xs">
                            {r.catchmentAreaSqM.toLocaleString()} sq.m
                          </TableCell>
                          <TableCell className="text-right font-bold text-xs text-blue-600">
                            {r.storageCapacityLitres.toLocaleString()} L
                          </TableCell>
                          <TableCell className="text-center font-medium text-xs">
                            {r.rechargeBorewellsCount} Units
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-xs">{r.filtrationStages}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => window.open(r.geoTaggedPhotoUrl, "_blank")}
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
                  <CardTitle className="text-base">NAAC Metric 7.1.3 Statutory Evidences</CardTitle>
                  <CardDescription>
                    ISO 14001 certificates, State Pollution Control Board consents, green audit reports, and recycling MoUs.
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
                  <p className="text-xs text-muted-foreground">Upload green audit reports and SPCB consents.</p>
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

      {/* Modal: Add Waste Facility */}
      <Dialog open={showAddWasteModal} onOpenChange={setShowAddWasteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Register Waste Management Facility</DialogTitle>
            <DialogDescription>
              Document institutional solid, liquid, chemical, or e-waste recycling infrastructure.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddWaste} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="facilityName" className="text-xs">Facility Name</Label>
              <Input
                id="facilityName"
                placeholder="e.g., 100 KLD MBBR Sewage Treatment Plant (STP)"
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="wasteType" className="text-xs">Waste Category</Label>
              <Select
                value={wasteType}
                onValueChange={(val) => setWasteType(val as WasteManagementFacilityRecord["wasteType"])}
              >
                <SelectTrigger id="wasteType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Solid Waste Management (Composting)">Solid Waste Management (Composting)</SelectItem>
                  <SelectItem value="Liquid Waste Treatment (STP / Greywater)">Liquid Waste Treatment (STP / Greywater)</SelectItem>
                  <SelectItem value="Biomedical Waste Management">Biomedical Waste Management</SelectItem>
                  <SelectItem value="E-Waste Recycling & Buyback">E-Waste Recycling & Buyback</SelectItem>
                  <SelectItem value="Hazardous Chemical Neutralization">Hazardous Chemical Neutralization</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="dailyCap" className="text-xs">Daily Capacity</Label>
                <Input
                  id="dailyCap"
                  placeholder="e.g., 100 KLD"
                  value={dailyCapacity}
                  onChange={(e) => setDailyCapacity(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="partner" className="text-xs">Partner / Recycler</Label>
                <Input
                  id="partner"
                  placeholder="e.g., GreenEarth Recyclers Ltd"
                  value={mouPartnerOrVendor}
                  onChange={(e) => setMouPartnerOrVendor(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="protocol" className="text-xs">Disposal / Recycling Protocol</Label>
              <Input
                id="protocol"
                placeholder="e.g., Biological MBBR aeration, filtration and chlorination"
                value={disposalOrRecyclingProtocol}
                onChange={(e) => setDisposalOrRecyclingProtocol(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="certRef" className="text-xs">SPCB / Audit Certificate Ref.</Label>
              <Input
                id="certRef"
                value={inspectionCertificateRef}
                onChange={(e) => setInspectionCertificateRef(e.target.value)}
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddWasteModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Register Facility</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Add Rainwater Unit */}
      <Dialog open={showAddRwhModal} onOpenChange={setShowAddRwhModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Rainwater Harvesting Unit</DialogTitle>
            <DialogDescription>
              Record catchment structures, storage reservoirs, and groundwater recharge shafts.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddRwh} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="unitLoc" className="text-xs">Unit Location / Structure</Label>
              <Input
                id="unitLoc"
                placeholder="e.g., North Academic Complex Rooftop Catchment"
                value={unitLocation}
                onChange={(e) => setUnitLocation(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="catchArea" className="text-xs">Catchment Area (sq.m)</Label>
                <Input
                  id="catchArea"
                  type="number"
                  value={catchmentAreaSqM}
                  onChange={(e) => setCatchmentAreaSqM(Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="rwhCap" className="text-xs">Storage Capacity (Litres)</Label>
                <Input
                  id="rwhCap"
                  type="number"
                  value={storageCapacityLitres}
                  onChange={(e) => setStorageCapacityLitres(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="wells" className="text-xs">Recharge Borewells Count</Label>
              <Input
                id="wells"
                type="number"
                value={rechargeBorewellsCount}
                onChange={(e) => setRechargeBorewellsCount(Number(e.target.value))}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="filtration" className="text-xs">Filtration & De-silting Details</Label>
              <Input
                id="filtration"
                value={filtrationStages}
                onChange={(e) => setFiltrationStages(e.target.value)}
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddRwhModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Save RWH Unit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Upload Official Evidence */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Environmental Audit Evidence</DialogTitle>
            <DialogDescription>
              Attach statutory green audit certificates, SPCB consent orders, or layout blueprints.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadEvidence} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="evidenceTitle" className="text-xs">Document Title</Label>
              <Input
                id="evidenceTitle"
                placeholder="e.g., ISO 14001:2015 Green Campus & Energy Audit Report"
                value={evidenceTitle}
                onChange={(e) => setEvidenceTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="evidenceDept" className="text-xs">Directorate / Cell</Label>
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
                placeholder="Audit ratings, SPCB numbers, certified water quality metrics..."
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
