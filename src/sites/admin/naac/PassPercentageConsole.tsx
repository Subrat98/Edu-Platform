import { useState, useEffect } from "react";
import {
  GraduationCap,
  Award,
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
  BarChart3,
  Percent,
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
  getPassPercentageData,
  addProgrammePassRecord,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type {
  PassPercentageData,
  ProgrammePassRecord,
  PoCoAttainmentRecord,
  NaacEvidenceDocument,
} from "@/types";

interface PassPercentageConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function PassPercentageConsole({ onEvidenceUpdated }: PassPercentageConsoleProps) {
  const [data, setData] = useState<PassPercentageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [evidenceList, setEvidenceList] = useState<NaacEvidenceDocument[]>([]);
  const [activeTab, setActiveTab] = useState("programmes");
  const [searchProg, setSearchProg] = useState("");
  const [filterLevel, setFilterLevel] = useState<string>("all");

  // Add Programme Result Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [progCode, setProgCode] = useState("");
  const [progName, setProgName] = useState("");
  const [degreeLevel, setDegreeLevel] = useState<"Undergraduate" | "Postgraduate">("Undergraduate");
  const [dept, setDept] = useState("Computer Science");
  const [appeared, setAppeared] = useState(50);
  const [passed, setPassed] = useState(48);
  const [distinction, setDistinction] = useState(30);
  const [firstClass, setFirstClass] = useState(15);
  const [secondClass, setSecondClass] = useState(3);
  const [ranks, setRanks] = useState(2);

  // Upload Evidence Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDept, setEvidenceDept] = useState("Examination Cell");
  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadConsoleData();
  }, []);

  async function loadConsoleData() {
    setLoading(true);
    try {
      const [passData, evidences] = await Promise.all([
        getPassPercentageData(),
        getEvidenceForMetric("2.6.3"),
      ]);
      setData(passData);
      setEvidenceList(evidences);
    } catch (err) {
      console.error("Failed to load pass percentage data", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredProgrammes = (data?.programmes || []).filter((p) => {
    const matchesSearch =
      p.programmeName.toLowerCase().includes(searchProg.toLowerCase()) ||
      p.programmeCode.toLowerCase().includes(searchProg.toLowerCase()) ||
      p.department.toLowerCase().includes(searchProg.toLowerCase());
    const matchesLevel = filterLevel === "all" || p.degreeLevel === filterLevel;
    return matchesSearch && matchesLevel;
  });

  async function handleAddProgramme(e: React.FormEvent) {
    e.preventDefault();
    if (!progName || !progCode) return;

    const passPct = Number(((Number(passed) / (Number(appeared) || 1)) * 100).toFixed(1));

    try {
      await addProgrammePassRecord(
        {
          programmeCode: progCode,
          programmeName: progName,
          degreeLevel,
          department: dept,
          eligibleAppeared: Number(appeared),
          studentsPassed: Number(passed),
          passPercentage: passPct,
          distinctionCount: Number(distinction),
          firstClassCount: Number(firstClass),
          secondClassCount: Number(secondClass),
          universityRankHoldersCount: Number(ranks),
        },
        { name: "Dr. Sanjit Kumar Pattnayak", role: "Controller of Examinations" }
      );

      setShowAddModal(false);
      resetAddForm();
      loadConsoleData();
    } catch (err) {
      console.error("Failed to add programme pass record", err);
    }
  }

  function resetAddForm() {
    setProgCode("");
    setProgName("");
    setAppeared(50);
    setPassed(48);
    setDistinction(30);
    setFirstClass(15);
    setSecondClass(3);
    setRanks(2);
  }

  async function handleUploadEvidence(e: React.FormEvent) {
    e.preventDefault();
    if (!evidenceTitle) return;

    setUploading(true);
    try {
      await uploadEvidenceDocument(
        {
          criterionId: 2,
          indicatorCode: "2.6",
          metricCode: "2.6.3",
          title: evidenceTitle,
          academicYear: "2025-26",
          department: evidenceDept,
          documentType: "PDF",
          description: evidenceDesc || "University final examination gazette and PO/CO attainment dossier.",
          remarks: "Verified against University Controller of Examinations gazette notification.",
          fileName: evidenceFile?.name || `${evidenceTitle.replace(/\s+/g, "_")}.pdf`,
          fileSize: evidenceFile ? `${(evidenceFile.size / (1024 * 1024)).toFixed(1)} MB` : "4.2 MB",
          evidenceUrl: `/documents/naac/evidence/PassResult_${Date.now()}.pdf`,
        },
        { name: "Dr. Sanjit Kumar Pattnayak", role: "Controller of Examinations" }
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
      <Card className="border-blue-200 bg-white/70 backdrop-blur">
        <CardContent className="p-12 text-center text-muted-foreground">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          Loading Student Pass Percentage & Attainment Console...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Card */}
      <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/70 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-blue-700 text-white hover:bg-blue-800">
                  NAAC Metric 2.6.3
                </Badge>
                <Badge variant="outline" className="text-blue-700 border-blue-300">
                  Quantitative DVV Metric
                </Badge>
                <Badge className="bg-emerald-600 text-white">Weightage: 30 Marks</Badge>
              </div>
              <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-blue-600" />
                Student Pass Percentage & PO/CO Attainment Analysis
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Aggregate pass percentage of final year outgoing batch ({data.overallPassPercentage}%), university distinction metrics, and Outcome-Based Education (OBE) attainment levels.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-50 text-xs sm:text-sm"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Programme Result
              </Button>
              <Button
                className="bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm shadow-sm"
                onClick={() => setShowUploadModal(true)}
              >
                <UploadCloud className="w-4 h-4 mr-1.5" />
                Upload Gazette
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Average Pass Rate</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-blue-800 mt-1">
                {data.overallPassPercentage}%
              </div>
              <div className="text-xs text-emerald-600 font-medium mt-1">
                {data.totalPassed} / {data.totalAppeared} Passed (Target ≥ 85%)
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>University Gold Medals</span>
                <Award className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-black text-amber-600 mt-1">
                {data.universityGoldMedalists}
              </div>
              <div className="text-xs text-gray-500 mt-1">{data.topRankHoldersCount} University Top-10 Ranks</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>PO/CO Attainment</span>
                <TrendingUp className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-3xl font-black text-indigo-700 mt-1">
                {data.averagePoCoAttainment} <span className="text-sm font-normal text-gray-500">/ 3.0</span>
              </div>
              <div className="text-xs text-emerald-600 font-medium mt-1">89.3% OBE Level Achieved</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Total Programmes</span>
                <Building2 className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-3xl font-black text-purple-700 mt-1">
                {data.programmes.length}
              </div>
              <div className="text-xs text-gray-500 mt-1">11 UG & 3 PG Programmes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Layout */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-lg bg-gray-100 p-1">
          <TabsTrigger value="programmes" className="text-xs sm:text-sm">
            Programmes Result ({data.programmes.length})
          </TabsTrigger>
          <TabsTrigger value="attainment" className="text-xs sm:text-sm">
            PO/CO Attainment ({data.attainmentRecords.length})
          </TabsTrigger>
          <TabsTrigger value="evidence" className="text-xs sm:text-sm">
            Evidences ({evidenceList.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Programme-Wise Results */}
        <TabsContent value="programmes" className="space-y-4 mt-4">
          <Card className="border border-blue-100 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-semibold text-gray-800">
                    Programme-Wise Pass Percentage (Outgoing Batch 2025-26)
                  </CardTitle>
                  <CardDescription>
                    Official examination records certified by Utkal University gazette notification.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative w-48 sm:w-60">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-3 text-gray-400" />
                    <Input
                      placeholder="Search programme, department..."
                      className="pl-8 text-xs h-9"
                      value={searchProg}
                      onChange={(e) => setSearchProg(e.target.value)}
                    />
                  </div>
                  <Select value={filterLevel} onValueChange={setFilterLevel}>
                    <SelectTrigger className="w-36 text-xs h-9">
                      <SelectValue placeholder="Degree Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="Undergraduate">Undergraduate (UG)</SelectItem>
                      <SelectItem value="Postgraduate">Postgraduate (PG)</SelectItem>
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
                      <TableHead className="font-semibold text-xs">Programme Code & Title</TableHead>
                      <TableHead className="font-semibold text-xs">Degree Level</TableHead>
                      <TableHead className="font-semibold text-xs text-right">Appeared</TableHead>
                      <TableHead className="font-semibold text-xs text-right">Passed</TableHead>
                      <TableHead className="font-semibold text-xs text-right">Pass %</TableHead>
                      <TableHead className="font-semibold text-xs text-center">Distinction</TableHead>
                      <TableHead className="font-semibold text-xs text-center">1st Class</TableHead>
                      <TableHead className="font-semibold text-xs text-center">Univ Ranks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProgrammes.map((prog) => (
                      <TableRow key={prog.id} className="hover:bg-blue-50/30">
                        <TableCell>
                          <div className="font-semibold text-xs text-gray-900">{prog.programmeName}</div>
                          <div className="text-[10px] text-gray-500 font-mono">{prog.programmeCode} • {prog.department}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">
                            {prog.degreeLevel}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-right font-medium text-gray-700">
                          {prog.eligibleAppeared}
                        </TableCell>
                        <TableCell className="text-xs text-right font-semibold text-blue-700">
                          {prog.studentsPassed}
                        </TableCell>
                        <TableCell className="text-xs text-right">
                          <span className={`font-bold ${prog.passPercentage >= 95 ? "text-emerald-700" : prog.passPercentage >= 90 ? "text-blue-700" : "text-amber-700"}`}>
                            {prog.passPercentage}%
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-center font-medium text-emerald-800">
                          {prog.distinctionCount}
                        </TableCell>
                        <TableCell className="text-xs text-center text-gray-600">
                          {prog.firstClassCount}
                        </TableCell>
                        <TableCell className="text-center">
                          {prog.universityRankHoldersCount > 0 ? (
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 text-[10px] font-semibold">
                              🏆 {prog.universityRankHoldersCount} Ranks
                            </Badge>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ResponsiveTableContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: PO/CO Attainment */}
        <TabsContent value="attainment" className="space-y-4 mt-4">
          <Card className="border border-blue-100 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                Outcome-Based Education (OBE) PO/CO Attainment Matrix
              </CardTitle>
              <CardDescription>
                Direct assessment (80% weight from CIE and University exam results) + Indirect assessment (20% weight from graduate exit surveys). Target Level: 2.50 / 3.00.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/80">
                      <TableHead className="font-semibold text-xs">Programme Name</TableHead>
                      <TableHead className="font-semibold text-xs text-center">Direct Attainment (80%)</TableHead>
                      <TableHead className="font-semibold text-xs text-center">Indirect Attainment (20%)</TableHead>
                      <TableHead className="font-semibold text-xs text-center">Overall Attainment</TableHead>
                      <TableHead className="font-semibold text-xs text-center">Target Level</TableHead>
                      <TableHead className="font-semibold text-xs text-center">Attainment %</TableHead>
                      <TableHead className="font-semibold text-xs text-center">Benchmark Met</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.attainmentRecords.map((rec) => (
                      <TableRow key={rec.programmeCode} className="hover:bg-indigo-50/30">
                        <TableCell>
                          <div className="font-medium text-xs text-gray-900">{rec.programmeName}</div>
                          <div className="text-[10px] text-gray-400 font-mono">{rec.programmeCode}</div>
                        </TableCell>
                        <TableCell className="text-xs text-center font-mono font-medium text-gray-700">
                          {rec.directAttainment.toFixed(2)} / 3.0
                        </TableCell>
                        <TableCell className="text-xs text-center font-mono font-medium text-gray-700">
                          {rec.indirectAttainment.toFixed(2)} / 3.0
                        </TableCell>
                        <TableCell className="text-xs text-center font-mono font-bold text-indigo-700">
                          {rec.overallAttainment.toFixed(2)} / 3.0
                        </TableCell>
                        <TableCell className="text-xs text-center font-mono text-gray-500">
                          {rec.targetLevel.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-xs text-center">
                          <Badge className="bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                            {rec.attainmentPercentage}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-300 text-[10px] flex items-center justify-center gap-1 w-fit mx-auto">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Target Met
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ResponsiveTableContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Evidences */}
        <TabsContent value="evidence" className="space-y-4 mt-4">
          <Card className="border border-blue-100 shadow-xs">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-gray-800">
                  Evidentiary Documentation (Metric 2.6.3)
                </CardTitle>
                <CardDescription>
                  Affiliating university final result gazettes, pass registers, and PO/CO calculation files.
                </CardDescription>
              </div>
              <Button
                size="sm"
                className="bg-blue-700 hover:bg-blue-800 text-white text-xs"
                onClick={() => setShowUploadModal(true)}
              >
                <UploadCloud className="w-3.5 h-3.5 mr-1" />
                Upload Gazette Proof
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {evidenceList.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-xs transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
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
                        className="text-blue-700 font-medium hover:underline inline-flex items-center gap-1"
                      >
                        View Gazette <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Programme Result Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-800">
              <GraduationCap className="w-5 h-5" />
              Add Programme Result Record
            </DialogTitle>
            <DialogDescription>
              Record outgoing batch examination results for NAAC pass percentage calculation.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddProgramme} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Programme Code</Label>
                <Input
                  className="text-xs h-9"
                  required
                  placeholder="e.g. BSC-STATS"
                  value={progCode}
                  onChange={(e) => setProgCode(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">Degree Level</Label>
                <Select
                  value={degreeLevel}
                  onValueChange={(val: any) => setDegreeLevel(val)}
                >
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Undergraduate">Undergraduate (UG)</SelectItem>
                    <SelectItem value="Postgraduate">Postgraduate (PG)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs">Programme Title</Label>
              <Input
                className="text-xs h-9"
                required
                placeholder="e.g. B.Sc. Statistics (Honours)"
                value={progName}
                onChange={(e) => setProgName(e.target.value)}
              />
            </div>

            <div>
              <Label className="text-xs">Department</Label>
              <Input
                className="text-xs h-9"
                value={dept}
                onChange={(e) => setDept(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Students Appeared</Label>
                <Input
                  type="number"
                  className="text-xs h-9"
                  value={appeared}
                  onChange={(e) => setAppeared(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Students Passed</Label>
                <Input
                  type="number"
                  className="text-xs h-9"
                  value={passed}
                  onChange={(e) => setPassed(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs">Distinction</Label>
                <Input
                  type="number"
                  className="text-xs h-9"
                  value={distinction}
                  onChange={(e) => setDistinction(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">1st Class</Label>
                <Input
                  type="number"
                  className="text-xs h-9"
                  value={firstClass}
                  onChange={(e) => setFirstClass(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Univ Ranks</Label>
                <Input
                  type="number"
                  className="text-xs h-9"
                  value={ranks}
                  onChange={(e) => setRanks(Number(e.target.value))}
                />
              </div>
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
              <Button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white text-xs h-9">
                Save Result Record
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Upload Gazette Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-800">
              <UploadCloud className="w-5 h-5" />
              Upload University Result Gazette
            </DialogTitle>
            <DialogDescription>
              Attach university certified gazette, medal award lists, or PO/CO calculation files.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadEvidence} className="space-y-3">
            <div>
              <Label className="text-xs">Document Title</Label>
              <Input
                className="text-xs h-9"
                required
                placeholder="e.g. Utkal University Final Gazette Notification 2025-26"
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
                placeholder="Brief summary of statutory compliance"
                value={evidenceDesc}
                onChange={(e) => setEvidenceDesc(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs">Select Document (PDF/XLSX)</Label>
              <Input
                type="file"
                className="text-xs h-9"
                accept=".pdf,.xlsx,.csv,.docx"
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
                className="bg-blue-700 hover:bg-blue-800 text-white text-xs h-9"
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
