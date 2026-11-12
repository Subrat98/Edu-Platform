import { useState, useEffect } from "react";
import {
  Sun,
  Zap,
  Leaf,
  DollarSign,
  FileText,
  Search,
  Plus,
  ExternalLink,
  UploadCloud,
  CheckCircle2,
  Calendar,
  Activity,
  Flame,
  Lightbulb,
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
import { ResponsiveTableContainer } from "@/components/admin/ResponsiveTableContainer";
import {
  getRenewableEnergyData,
  addSolarGenerationRecord,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type {
  RenewableEnergyData,
  NaacEvidenceDocument,
} from "@/types";

interface RenewableEnergyConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function RenewableEnergyConsole({ onEvidenceUpdated }: RenewableEnergyConsoleProps) {
  const [data, setData] = useState<RenewableEnergyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [evidenceList, setEvidenceList] = useState<NaacEvidenceDocument[]>([]);
  const [activeTab, setActiveTab] = useState("initiatives");
  const [searchQuery, setSearchQuery] = useState("");

  // Add Monthly Generation Modal
  const [showAddLogModal, setShowAddLogModal] = useState(false);
  const [billingMonth, setBillingMonth] = useState("March 2025");
  const [solarGenerationUnitsKwh, setSolarGenerationUnitsKwh] = useState(13500);
  const [campusConsumptionKwh, setCampusConsumptionKwh] = useState(10500);
  const [wheeledToGridKwh, setWheeledToGridKwh] = useState(3000);
  const [netMeteringBillInr, setNetMeteringBillInr] = useState(18500);
  const [co2SavedTonnes, setCo2SavedTonnes] = useState(11.2);

  // Upload Evidence Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDept, setEvidenceDept] = useState("Estate & Electrical Maintenance Cell");
  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadConsoleData();
  }, []);

  async function loadConsoleData() {
    setLoading(true);
    try {
      const [energyData, evidences] = await Promise.all([
        getRenewableEnergyData(),
        getEvidenceForMetric("7.1.2"),
      ]);
      setData(energyData);
      setEvidenceList(evidences);
    } catch (err) {
      console.error("Failed to load renewable energy data", err);
    } finally {
      setLoading(false);
    }
  }

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!billingMonth.trim()) return;

    try {
      await addSolarGenerationRecord(
        {
          billingMonth,
          solarGenerationUnitsKwh,
          campusConsumptionKwh,
          wheeledToGridKwh,
          netMeteringBillInr,
          co2SavedTonnes,
          billPdfUrl: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
        },
        { name: "Er. Ramesh Chandra", role: "Executive Electrical Engineer" }
      );
      setShowAddLogModal(false);
      loadConsoleData();
    } catch (err) {
      console.error("Failed to add solar log", err);
    }
  };

  const handleUploadEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceTitle.trim() || !evidenceFile) return;

    setUploading(true);
    try {
      await uploadEvidenceDocument(
        {
          metricCode: "7.1.2",
          title: evidenceTitle,
          description: evidenceDesc || "DISCOM solar net metering bills, solar plant sanction order, and energy audit report",
          criterion: 7,
          fileType: "pdf",
          department: evidenceDept,
          academicYear: "2024-25",
          url: URL.createObjectURL(evidenceFile),
        },
        evidenceFile,
        { name: "Er. Ramesh Chandra", role: "Executive Electrical Engineer" }
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
          <p className="text-sm text-muted-foreground">Loading Renewable Energy & Solar Generation data...</p>
        </div>
      </div>
    );
  }

  const filteredInitiatives = data.initiatives.filter(
    (i) =>
      i.initiativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.vendorOrInstallationAgency.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLogs = data.generationMonthlyLogs.filter(
    (l) => l.billingMonth.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitiativeIcon = (type: string) => {
    if (type.includes("Solar")) return <Sun className="h-5 w-5 text-amber-500" />;
    if (type.includes("LED")) return <Lightbulb className="h-5 w-5 text-blue-500" />;
    if (type.includes("Biogas")) return <Flame className="h-5 w-5 text-orange-500" />;
    return <Zap className="h-5 w-5 text-emerald-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-transparent p-6 dark:from-amber-950/20 dark:via-yellow-950/20 md:flex-row md:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-amber-500 font-semibold text-amber-600 dark:text-amber-400">
              NAAC Metric 7.1.2
            </Badge>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
              {data.campusRenewablePowerSharePercentage}% Renewable Energy Share
            </Badge>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Renewable Energy & Energy Conservation Initiatives</h2>
          <p className="text-sm text-muted-foreground">
            120 kW rooftop solar PV grid, DISCOM wheeling-to-grid net metering, sensor-based automation, and 100% LED campus lighting.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowUploadModal(true)} className="gap-2">
            <UploadCloud className="h-4 w-4" />
            Upload DISCOM Bills
          </Button>
          <Button size="sm" onClick={() => setShowAddLogModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Generation Log
          </Button>
        </div>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solar Grid Capacity</CardTitle>
            <Sun className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {data.solarGridCapacityKw} kW Grid
            </div>
            <p className="text-xs text-muted-foreground">Rooftop Poly-Crystalline Arrays</p>
            <Progress value={data.campusRenewablePowerSharePercentage} className="mt-2 h-1.5 bg-amber-100 dark:bg-amber-950" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Generation</CardTitle>
            <Zap className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {data.annualSolarGenerationUnits.toLocaleString()} kWh
            </div>
            <p className="text-xs text-muted-foreground">{data.campusRenewablePowerSharePercentage}% Campus Demand Met</p>
            <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" /> Bi-directional Net Metering
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Offsetting</CardTitle>
            <Leaf className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">
              {data.totalAnnualCo2MitigatedTonnes} Tonnes
            </div>
            <p className="text-xs text-muted-foreground">CO2 Emissions Mitigated Annually</p>
            <p className="mt-2 text-xs text-muted-foreground">Equivalent to 6,200 planted trees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Financial Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ₹{data.annualEnergyCostSavingsLakhs.toFixed(2)}L
            </div>
            <p className="text-xs text-muted-foreground">Annual Power Tariff Reduction</p>
            <p className="mt-2 text-xs text-emerald-600 font-medium">Payback Period: 4.2 Years</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <TabsList className="grid w-full grid-cols-3 sm:w-auto">
            <TabsTrigger value="initiatives" className="gap-2">
              <Zap className="h-4 w-4" />
              Conservation Facilities ({data.initiatives.length})
            </TabsTrigger>
            <TabsTrigger value="monthlyLogs" className="gap-2">
              <Calendar className="h-4 w-4" />
              DISCOM Net Metering Logs ({data.generationMonthlyLogs.length})
            </TabsTrigger>
            <TabsTrigger value="evidence" className="gap-2">
              <FileText className="h-4 w-4" />
              Evidences ({evidenceList.length})
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search initiatives, agency, month..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Tab 1: Initiatives */}
        <TabsContent value="initiatives" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredInitiatives.map((item) => (
              <Card key={item.id} className="overflow-hidden border transition-all hover:shadow-md">
                <CardHeader className="bg-muted/30 pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        {getInitiativeIcon(item.type)}
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-1 text-xs">
                          {item.type}
                        </Badge>
                        <CardTitle className="text-base">{item.initiativeName}</CardTitle>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Capacity / Rating: </span>
                      <span className="font-semibold">{item.capacityOrRating}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Annual Energy Saved: </span>
                      <span className="font-semibold text-emerald-600">{item.annualEnergySavedKwh.toLocaleString()} kWh</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Financial Savings: </span>
                      <span className="font-semibold text-blue-600">₹{item.annualFinancialSavingsLakhs.toFixed(2)} Lakhs</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Executing Agency: </span>
                      <span className="font-semibold">{item.vendorOrInstallationAgency}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 2: Monthly Solar Logs */}
        <TabsContent value="monthlyLogs" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">DISCOM Net Metering & Generation Ledger</CardTitle>
              <CardDescription>
                Audited monthly electricity generation units, campus consumption, grid wheeling, and DISCOM net bills.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Billing Month</TableHead>
                      <TableHead className="text-right">Solar Generated (kWh)</TableHead>
                      <TableHead className="text-right">Campus Consumed (kWh)</TableHead>
                      <TableHead className="text-right">Wheeled to Grid (kWh)</TableHead>
                      <TableHead className="text-right">CO2 Saved (Tonnes)</TableHead>
                      <TableHead className="text-right">DISCOM Bill (₹)</TableHead>
                      <TableHead className="text-right">Bill Copy</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                          No generation logs found matching your search.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium text-sm">{log.billingMonth}</TableCell>
                          <TableCell className="text-right font-semibold text-xs text-amber-600">
                            {log.solarGenerationUnitsKwh.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right font-medium text-xs">
                            {log.campusConsumptionKwh.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right font-medium text-xs text-blue-600">
                            {log.wheeledToGridKwh.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right font-medium text-xs text-teal-600">
                            {log.co2SavedTonnes.toFixed(1)} t
                          </TableCell>
                          <TableCell className="text-right font-semibold text-xs">
                            ₹{log.netMeteringBillInr.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => window.open(log.billPdfUrl, "_blank")}
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
                  <CardTitle className="text-base">NAAC Metric 7.1.2 Statutory Evidences</CardTitle>
                  <CardDescription>
                    DISCOM net metering contracts, monthly electricity bills, commissioning certificates, and energy audit.
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
                  <p className="text-xs text-muted-foreground">Upload DISCOM agreements and net metering bills.</p>
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
                          <FileText className="h-5 w-5 text-amber-500" />
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

      {/* Modal: Add Solar Generation Record */}
      <Dialog open={showAddLogModal} onOpenChange={setShowAddLogModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Monthly Generation & Billing Log</DialogTitle>
            <DialogDescription>
              Record solar generation, campus consumption, grid wheeling, and DISCOM invoice data.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddLog} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="billingMonth" className="text-xs">Billing Month</Label>
              <Input
                id="billingMonth"
                placeholder="e.g., April 2025"
                value={billingMonth}
                onChange={(e) => setBillingMonth(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="solarUnits" className="text-xs">Solar Generated (kWh)</Label>
                <Input
                  id="solarUnits"
                  type="number"
                  value={solarGenerationUnitsKwh}
                  onChange={(e) => setSolarGenerationUnitsKwh(Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="campusUnits" className="text-xs">Campus Consumption (kWh)</Label>
                <Input
                  id="campusUnits"
                  type="number"
                  value={campusConsumptionKwh}
                  onChange={(e) => setCampusConsumptionKwh(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="wheelUnits" className="text-xs">Wheeled to Grid (kWh)</Label>
                <Input
                  id="wheelUnits"
                  type="number"
                  value={wheeledToGridKwh}
                  onChange={(e) => setWheeledToGridKwh(Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="co2Saved" className="text-xs">CO2 Mitigated (Tonnes)</Label>
                <Input
                  id="co2Saved"
                  type="number"
                  step="0.1"
                  value={co2SavedTonnes}
                  onChange={(e) => setCo2SavedTonnes(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="netBill" className="text-xs">Net Metering Bill Paid (₹ INR)</Label>
              <Input
                id="netBill"
                type="number"
                value={netMeteringBillInr}
                onChange={(e) => setNetMeteringBillInr(Number(e.target.value))}
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddLogModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Generation Record</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Upload Official Evidence */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Renewable Energy Evidence</DialogTitle>
            <DialogDescription>
              Attach statutory net metering agreements, DISCOM billing statements, or energy audit reports.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadEvidence} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="evidenceTitle" className="text-xs">Document Title</Label>
              <Input
                id="evidenceTitle"
                placeholder="e.g., DISCOM Solar Net Metering Annual Billing Proofs"
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
                placeholder="Capacity ratings, consumer numbers, tariff reductions..."
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
