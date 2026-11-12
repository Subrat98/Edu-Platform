import { useState, useEffect } from "react";
import {
  Wifi,
  Monitor,
  Server,
  Network,
  CheckCircle2,
  FileText,
  Search,
  Plus,
  ExternalLink,
  UploadCloud,
  ShieldCheck,
  Zap,
  Activity,
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
  getItFacilityData,
  addComputerLabAsset,
  addWifiAccessPoint,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type { ItFacilityData, NaacEvidenceDocument } from "@/types";

interface ItInfrastructureConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function ItInfrastructureConsole({ onEvidenceUpdated }: ItInfrastructureConsoleProps) {
  const [data, setData] = useState<ItFacilityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [evidenceList, setEvidenceList] = useState<NaacEvidenceDocument[]>([]);
  const [activeTab, setActiveTab] = useState("labs");
  const [searchQuery, setSearchQuery] = useState("");

  // Add Lab Modal
  const [showAddLabModal, setShowAddLabModal] = useState(false);
  const [labName, setLabName] = useState("");
  const [labLocation, setLabLocation] = useState("");
  const [totalWorkstations, setTotalWorkstations] = useState(60);
  const [processorSpecs, setProcessorSpecs] = useState("Intel Core i5-13500 (14-Core)");
  const [ramGb, setRamGb] = useState(16);
  const [storageType] = useState("512 GB NVMe SSD");
  const [osInstalled, setOsInstalled] = useState("Dual Boot (Ubuntu / Windows 11)");
  const [primaryUsage, setPrimaryUsage] = useState("Full-Stack Programming & Cloud Tools");

  // Add AP Modal
  const [showAddApModal, setShowAddApModal] = useState(false);
  const [zoneOrBlock, setZoneOrBlock] = useState("");
  const [apModel, setApModel] = useState("Aruba AP-515 Wi-Fi 6");
  const [ipAddress, setIpAddress] = useState("192.168.10.50");
  const [macAddress, setMacAddress] = useState("98:2C:BC:2A:44:01");
  const [maxCapacity, setMaxCapacity] = useState(250);

  // Upload Evidence Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDept, setEvidenceDept] = useState("IT Infrastructure Cell");
  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadConsoleData();
  }, []);

  async function loadConsoleData() {
    setLoading(true);
    try {
      const [itData, evidences] = await Promise.all([
        getItFacilityData(),
        getEvidenceForMetric("4.3.1"),
      ]);
      setData(itData);
      setEvidenceList(evidences);
    } catch (err) {
      console.error("Failed to load IT facility console data", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddLab(e: React.FormEvent) {
    e.preventDefault();
    if (!labName || !labLocation) return;
    try {
      await addComputerLabAsset(
        {
          labName,
          location: labLocation,
          totalWorkstations,
          processorSpecs,
          ramGb,
          storageType,
          osInstalled,
          studentToPcRatio: "1:1 per batch",
          internetConnected: true,
          lanPortSpeed: "1 Gbps Gigabit Ethernet",
          primaryUsage,
        },
        { name: "System Administrator", role: "IT Admin" }
      );
      setShowAddLabModal(false);
      setLabName("");
      setLabLocation("");
      await loadConsoleData();
    } catch (err) {
      console.error("Failed to add lab asset", err);
    }
  }

  async function handleAddAp(e: React.FormEvent) {
    e.preventDefault();
    if (!zoneOrBlock) return;
    try {
      await addWifiAccessPoint(
        {
          zoneOrBlock,
          apModel,
          macAddress,
          ipAddress,
          dualBandSupport: true,
          maxCapacityClients: maxCapacity,
          activeClients: Math.floor(maxCapacity * 0.45),
          status: "Online",
          downloadSpeedMbps: 650,
          uploadSpeedMbps: 620,
        },
        { name: "Network Engineer", role: "IT Admin" }
      );
      setShowAddApModal(false);
      setZoneOrBlock("");
      await loadConsoleData();
    } catch (err) {
      console.error("Failed to add Wi-Fi access point", err);
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
          criterionId: 4,
          indicatorCode: "4.3",
          metricCode: "4.3.1",
          title: evidenceTitle,
          academicYear: "2025-26",
          department: evidenceDept,
          documentType: "PDF",
          description: evidenceDesc || "IT infrastructure and bandwidth compliance document.",
          remarks: "Verified against ISP SLA and campus network audit records.",
        },
        dummyFile,
        { name: "IT Administrator", role: "Admin" }
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
      <Card className="border-indigo-200 shadow-md">
        <CardContent className="p-8 text-center text-muted-foreground">
          <Activity className="w-8 h-8 mx-auto mb-3 animate-spin text-indigo-600" />
          <p>Loading IT Facilities & Campus Wi-Fi Console...</p>
        </CardContent>
      </Card>
    );
  }

  const filteredLabs = data.labs.filter(
    (l) =>
      l.labName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.primaryUsage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAps = data.accessPoints.filter(
    (ap) =>
      ap.zoneOrBlock.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ap.apModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ap.ipAddress.includes(searchQuery)
  );

  return (
    <Card className="border-indigo-200 shadow-lg bg-card">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-indigo-600 text-white hover:bg-indigo-700">Metric 4.3.1</Badge>
              <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-50">
                Statutory NAAC Compliant
              </Badge>
              <Badge variant="outline" className="text-blue-700 border-blue-300 bg-blue-50">
                1 Gbps Leased Line Active
              </Badge>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Network className="w-6 h-6 text-indigo-600" />
              IT Facilities & Campus Wi-Fi Infrastructure Console
            </CardTitle>
            <CardDescription className="text-slate-600">
              Campus-wide 1 Gbps (1:1 symmetrical) dedicated leased line, 540 student workstations (4:1 student-to-computer ratio), 48 Wi-Fi 6 access points, and enterprise datacenter.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowUploadModal(true)}
              className="text-indigo-700 border-indigo-300 hover:bg-indigo-100"
            >
              <UploadCloud className="w-4 h-4 mr-1.5" />
              Upload Evidence
            </Button>
            <Button
              size="sm"
              onClick={() => setShowAddLabModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Computer Lab
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Dedicated Bandwidth</span>
                <Zap className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-indigo-700">1 Gbps</span>
                <span className="text-xs font-medium text-emerald-600">(1:1 Symmetrical)</span>
              </div>
              <p className="text-xs text-slate-600 truncate">{data.ispProvider.split("(")[0]}</p>
            </CardContent>
          </Card>

          <Card className="border border-blue-100 bg-gradient-to-br from-blue-50/50 to-white shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Student-PC Ratio</span>
                <Monitor className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-blue-700">{data.studentToComputerRatio}</span>
                <span className="text-xs text-slate-500">(540 PCs / 2,160 Students)</span>
              </div>
              <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Exceeds NAAC 5:1 Norm
              </p>
            </CardContent>
          </Card>

          <Card className="border border-purple-100 bg-gradient-to-br from-purple-50/50 to-white shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Wi-Fi & LAN Network</span>
                <Wifi className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-purple-700">{data.totalWifiAccessPoints} APs</span>
                <span className="text-xs text-slate-500">({data.totalLanNodes} LAN Nodes)</span>
              </div>
              <p className="text-xs text-slate-600">Aruba & Cisco Wi-Fi 6 Dual-Band</p>
            </CardContent>
          </Card>

          <Card className="border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Network Uptime SLA</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-emerald-700">99.91%</span>
                <span className="text-xs text-emerald-600 font-semibold">Tier-3 Reliability</span>
              </div>
              <p className="text-xs text-slate-600">Dual Emerson 20 kVA Online UPS</p>
            </CardContent>
          </Card>
        </div>

        {/* Server Room & Backbone Banner */}
        <Card className="bg-slate-900 text-white border-none shadow-md overflow-hidden">
          <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-600/30 rounded-lg border border-indigo-500/40">
                <Server className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-semibold text-sm tracking-wide text-slate-200">
                  Campus Core Datacenter & Next-Gen Firewall
                </h4>
                <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
                  {data.serverRoomRackSpecs}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="border-indigo-400 text-indigo-300 bg-indigo-950/50 whitespace-nowrap">
              Fiber Backbone 10G Ready
            </Badge>
          </CardContent>
        </Card>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search labs, AP locations, IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddApModal(true)}
              className="text-purple-700 border-purple-200 hover:bg-purple-50"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Wi-Fi AP
            </Button>
          </div>
        </div>

        {/* Console Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full sm:w-auto max-w-xl">
            <TabsTrigger value="labs">Computer Labs ({data.labs.length})</TabsTrigger>
            <TabsTrigger value="ap">Wi-Fi APs ({data.accessPoints.length})</TabsTrigger>
            <TabsTrigger value="bills">Bandwidth Bills ({data.bandwidthBills.length})</TabsTrigger>
            <TabsTrigger value="evidence">Evidences ({evidenceList.length})</TabsTrigger>
          </TabsList>

          {/* Tab 1: Computer Labs */}
          <TabsContent value="labs" className="pt-4">
            <ResponsiveTableContainer>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">Lab Name & Location</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">Workstations</TableHead>
                    <TableHead className="font-semibold text-slate-700">Hardware Specifications</TableHead>
                    <TableHead className="font-semibold text-slate-700">Operating System</TableHead>
                    <TableHead className="font-semibold text-slate-700">Network & Connectivity</TableHead>
                    <TableHead className="font-semibold text-slate-700">Primary Curricular Usage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLabs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No computer laboratories match your search query.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLabs.map((lab) => (
                      <TableRow key={lab.id} className="hover:bg-slate-50/80">
                        <TableCell>
                          <div className="font-medium text-slate-900">{lab.labName}</div>
                          <div className="text-xs text-slate-500">{lab.location}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 font-bold">
                            {lab.totalWorkstations} PCs
                          </Badge>
                          <div className="text-[10px] text-slate-400 mt-0.5">{lab.studentToPcRatio}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-semibold text-slate-800">{lab.processorSpecs}</div>
                          <div className="text-[11px] text-slate-500">
                            {lab.ramGb} GB RAM | {lab.storageType}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {lab.osInstalled}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            {lab.lanPortSpeed}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-slate-600 max-w-xs truncate" title={lab.primaryUsage}>
                            {lab.primaryUsage}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ResponsiveTableContainer>
          </TabsContent>

          {/* Tab 2: Wi-Fi Access Points */}
          <TabsContent value="ap" className="pt-4">
            <ResponsiveTableContainer>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">Campus Zone / Block</TableHead>
                    <TableHead className="font-semibold text-slate-700">Access Point Hardware</TableHead>
                    <TableHead className="font-semibold text-slate-700">IP & MAC Address</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">Active / Max Capacity</TableHead>
                    <TableHead className="font-semibold text-slate-700">Throughput Tested</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAps.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No Wi-Fi access points match your search query.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAps.map((ap) => (
                      <TableRow key={ap.id} className="hover:bg-slate-50/80">
                        <TableCell>
                          <div className="font-medium text-slate-900">{ap.zoneOrBlock}</div>
                          <div className="text-xs text-slate-500">Dual-Band 2.4 GHz & 5 GHz Active</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            {ap.apModel}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-slate-600">
                          <div>{ap.ipAddress}</div>
                          <div className="text-[11px] text-slate-400">{ap.macAddress}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="text-xs font-bold text-slate-800">
                            {ap.activeClients} / {ap.maxCapacityClients}
                          </div>
                          <Progress
                            value={(ap.activeClients / ap.maxCapacityClients) * 100}
                            className="h-1.5 mt-1 max-w-[80px] mx-auto"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-slate-700 font-medium">
                            ↓ {ap.downloadSpeedMbps} Mbps | ↑ {ap.uploadSpeedMbps} Mbps
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">
                            {ap.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ResponsiveTableContainer>
          </TabsContent>

          {/* Tab 3: Bandwidth Invoices */}
          <TabsContent value="bills" className="pt-4">
            <ResponsiveTableContainer>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">Invoice Number</TableHead>
                    <TableHead className="font-semibold text-slate-700">Billing Period</TableHead>
                    <TableHead className="font-semibold text-slate-700">ISP Provider & Contract</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">Monthly Rental</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">Uptime SLA</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">Payment Status</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.bandwidthBills.map((bill) => (
                    <TableRow key={bill.id} className="hover:bg-slate-50/80">
                      <TableCell className="font-mono text-xs font-semibold text-indigo-700">
                        {bill.billInvoiceNo}
                      </TableCell>
                      <TableCell className="font-medium text-slate-900">{bill.billingPeriod}</TableCell>
                      <TableCell>
                        <div className="text-xs text-slate-800 font-medium">{bill.ispProvider}</div>
                        <div className="text-[11px] text-slate-500">{bill.speedContracted}</div>
                      </TableCell>
                      <TableCell className="text-right font-bold text-slate-800">
                        ₹{bill.monthlyRentalInr.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 font-mono">
                          {bill.uptimeSlaPercentage}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-emerald-600 text-white">{bill.paymentStatus}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs text-indigo-600 hover:text-indigo-800"
                          onClick={() => window.open(bill.receiptUrl, "_blank")}
                        >
                          <FileText className="w-3.5 h-3.5 mr-1" />
                          View Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ResponsiveTableContainer>
          </TabsContent>

          {/* Tab 4: Statutory Evidences */}
          <TabsContent value="evidence" className="pt-4">
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
                        No uploaded evidence documents found for Metric 4.3.1.
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
                            className="h-8 text-xs text-indigo-700 border-indigo-200"
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

      {/* Add Lab Modal */}
      <Dialog open={showAddLabModal} onOpenChange={setShowAddLabModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Computer Laboratory Asset</DialogTitle>
            <DialogDescription>
              Register a new computing lab for Metric 4.3.1 stock registers and student-to-computer ratio calculations.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddLab} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-semibold">Laboratory Name</Label>
              <Input
                placeholder="e.g. AI & Machine Learning Lab"
                value={labName}
                onChange={(e) => setLabName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Physical Location</Label>
              <Input
                placeholder="e.g. IT Block, 2nd Floor (Room IT-204)"
                value={labLocation}
                onChange={(e) => setLabLocation(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Workstations Count</Label>
                <Input
                  type="number"
                  min="1"
                  value={totalWorkstations}
                  onChange={(e) => setTotalWorkstations(Number(e.target.value))}
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">RAM (GB)</Label>
                <Input
                  type="number"
                  min="4"
                  value={ramGb}
                  onChange={(e) => setRamGb(Number(e.target.value))}
                  required
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold">Processor Specs</Label>
              <Input
                value={processorSpecs}
                onChange={(e) => setProcessorSpecs(e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Operating System</Label>
              <Input
                value={osInstalled}
                onChange={(e) => setOsInstalled(e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Primary Usage</Label>
              <Input
                value={primaryUsage}
                onChange={(e) => setPrimaryUsage(e.target.value)}
                required
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowAddLabModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700">
                Save Laboratory
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add AP Modal */}
      <Dialog open={showAddApModal} onOpenChange={setShowAddApModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Register Wi-Fi Access Point</DialogTitle>
            <DialogDescription>
              Deploy a new wireless access point to the campus network monitoring matrix.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddAp} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-semibold">Zone / Block Location</Label>
              <Input
                placeholder="e.g. Science Block 1st Floor Corridor"
                value={zoneOrBlock}
                onChange={(e) => setZoneOrBlock(e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">AP Model</Label>
              <Input
                value={apModel}
                onChange={(e) => setApModel(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">IP Address</Label>
                <Input
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Max Client Capacity</Label>
                <Input
                  type="number"
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(Number(e.target.value))}
                  required
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold">MAC Address</Label>
              <Input
                value={macAddress}
                onChange={(e) => setMacAddress(e.target.value)}
                required
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowAddApModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-purple-600 text-white hover:bg-purple-700">
                Register Access Point
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Upload Evidence Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload IT Infrastructure Evidence</DialogTitle>
            <DialogDescription>
              Upload bandwidth bills, network topology diagrams, or stock registers for Metric 4.3.1.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadEvidence} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-semibold">Document Title</Label>
              <Input
                placeholder="e.g. Airtel 1 Gbps ISP Bill & SLA Uptime Log - Q4"
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
                placeholder="Brief summary of what this document proves"
                value={evidenceDesc}
                onChange={(e) => setEvidenceDesc(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">File Attachment (PDF / Image)</Label>
              <Input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setEvidenceFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowUploadModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploading} className="bg-indigo-600 text-white hover:bg-indigo-700">
                {uploading ? "Uploading..." : "Submit Evidence"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
