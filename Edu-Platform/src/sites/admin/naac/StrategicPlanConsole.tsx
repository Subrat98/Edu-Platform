import { useState, useEffect } from "react";
import {
  Compass,
  Target,
  Search,
  Plus,
  ExternalLink,
  UploadCloud,
  Activity,
  Users,
  GitBranch,
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
  getStrategicPlanData,
  addStrategicGoal,
  addGovernanceCommittee,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type {
  StrategicPlanData,
  StrategicGoalRecord,
  NaacEvidenceDocument,
} from "@/types";

interface StrategicPlanConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function StrategicPlanConsole({ onEvidenceUpdated }: StrategicPlanConsoleProps) {
  const [data, setData] = useState<StrategicPlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [evidenceList, setEvidenceList] = useState<NaacEvidenceDocument[]>([]);
  const [activeTab, setActiveTab] = useState("goals");
  const [searchQuery, setSearchQuery] = useState("");

  // Add Goal Modal
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [goalNumber, setGoalNumber] = useState("Goal 2.2");
  const [pillar, setPillar] = useState<StrategicGoalRecord["pillar"]>("Research & Innovation");
  const [targetDescription, setTargetDescription] = useState("");
  const [baseline2020, setBaseline2020] = useState("");
  const [target2030, setTarget2030] = useState("");
  const [currentProgress2025, setCurrentProgress2025] = useState("");
  const [achievementPercentage, setAchievementPercentage] = useState(80);
  const [nodalOfficer, setNodalOfficer] = useState("Dean Research");

  // Add Committee Modal
  const [showAddCommitteeModal, setShowAddCommitteeModal] = useState(false);
  const [committeeName, setCommitteeName] = useState("");
  const [chairperson, setChairperson] = useState("Principal / Director");
  const [frequencyOfMeetings, setFrequencyOfMeetings] = useState("Quarterly");
  const [facultyCount, setFacultyCount] = useState(6);
  const [studentCount, setStudentCount] = useState(2);
  const [externalCount, setExternalCount] = useState(2);
  const [primaryMandate, setPrimaryMandate] = useState("");

  // Upload Evidence Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDept, setEvidenceDept] = useState("IQAC Secretariat");
  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadConsoleData();
  }, []);

  async function loadConsoleData() {
    setLoading(true);
    try {
      const [planData, evidences] = await Promise.all([
        getStrategicPlanData(),
        getEvidenceForMetric("6.1.1"),
      ]);
      setData(planData);
      setEvidenceList(evidences);
    } catch (err) {
      console.error("Failed to load strategic plan data", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddGoal(e: React.FormEvent) {
    e.preventDefault();
    if (!targetDescription || !target2030) return;
    try {
      await addStrategicGoal(
        {
          goalNumber,
          pillar,
          targetDescription,
          tenYearHorizon: "2020-2030",
          baseline2020: baseline2020 || "Base assessment",
          target2030,
          currentProgress2025: currentProgress2025 || "Initial deployment",
          achievementPercentage,
          nodalOfficer,
          status: "On Track",
        },
        { name: "Principal Office", role: "Admin" }
      );
      setShowAddGoalModal(false);
      setTargetDescription("");
      await loadConsoleData();
    } catch (err) {
      console.error("Failed to add goal", err);
    }
  }

  async function handleAddCommittee(e: React.FormEvent) {
    e.preventDefault();
    if (!committeeName) return;
    try {
      await addGovernanceCommittee(
        {
          committeeName,
          chairperson,
          frequencyOfMeetings,
          facultyMembersCount: facultyCount,
          studentRepresentativesCount: studentCount,
          externalExpertsCount: externalCount,
          primaryMandate,
          recentMeetingDate: new Date().toISOString().split("T")[0]!,
        },
        { name: "Registrar Office", role: "Admin" }
      );
      setShowAddCommitteeModal(false);
      setCommitteeName("");
      setPrimaryMandate("");
      await loadConsoleData();
    } catch (err) {
      console.error("Failed to add committee", err);
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
          criterionId: 6,
          indicatorCode: "6.1",
          metricCode: "6.1.1",
          title: evidenceTitle,
          academicYear: "2025-26",
          department: evidenceDept,
          documentType: "PDF",
          description: evidenceDesc || "Strategic plan document and organogram records.",
          remarks: "Approved by Governing Body resolution.",
        },
        dummyFile,
        { name: "IQAC Office", role: "Admin" }
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
          <p>Loading Strategic Planning & Deployment Console...</p>
        </CardContent>
      </Card>
    );
  }

  const filteredGoals = data.goals.filter(
    (g) =>
      g.goalNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.pillar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.targetDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.nodalOfficer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="border-indigo-200 shadow-lg bg-card">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-indigo-600 text-white hover:bg-indigo-700">Metric 6.1.1</Badge>
              <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-50">
                10-Year Perspective Plan (2020-2030)
              </Badge>
              <Badge variant="outline" className="text-blue-700 border-blue-300 bg-blue-50">
                24 Decentralized Committees
              </Badge>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Compass className="w-6 h-6 text-indigo-600" />
              Strategic Planning & Deployment Console (6.1.1)
            </CardTitle>
            <CardDescription className="text-slate-600">
              {data.planTitle} — Institutional vision deployment across 5 strategic pillars, governance organogram, and decentralized participative management.
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
              variant="outline"
              onClick={() => setShowAddCommitteeModal(true)}
              className="text-purple-700 border-purple-300 hover:bg-purple-50"
            >
              <Users className="w-4 h-4 mr-1.5" />
              Add Committee
            </Button>
            <Button
              size="sm"
              onClick={() => setShowAddGoalModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Strategic Goal
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Plan Horizon</span>
                <Compass className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-indigo-700">2020 – 2030</span>
              </div>
              <p className="text-xs text-slate-600">10-Year Perspective Plan</p>
            </CardContent>
          </Card>

          <Card className="border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Milestone Progress</span>
                <Target className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-emerald-700">
                  {data.overallMilestoneAchievementPercentage}%
                </span>
                <span className="text-xs font-semibold text-emerald-600">On Schedule</span>
              </div>
              <Progress value={data.overallMilestoneAchievementPercentage} className="h-1.5" />
            </CardContent>
          </Card>

          <Card className="border border-purple-100 bg-gradient-to-br from-purple-50/50 to-white shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Decentralized Bodies</span>
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-purple-700">
                  {data.committees.length} Committees
                </span>
              </div>
              <p className="text-xs text-slate-600">Participative faculty & student roles</p>
            </CardContent>
          </Card>

          <Card className="border border-blue-100 bg-gradient-to-br from-blue-50/50 to-white shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Organogram Status</span>
                <GitBranch className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-blue-700">GB Approved</span>
              </div>
              <p className="text-xs text-slate-600">Statutory decentralization policy</p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Controls */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <TabsList className="grid grid-cols-3 w-full sm:w-auto max-w-md">
              <TabsTrigger value="goals">Strategic Goals ({data.goals.length})</TabsTrigger>
              <TabsTrigger value="committees">Committees ({data.committees.length})</TabsTrigger>
              <TabsTrigger value="evidence">Evidences ({evidenceList.length})</TabsTrigger>
            </TabsList>

            {activeTab === "goals" && (
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search goals, pillars, nodal officer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-sm"
                />
              </div>
            )}
          </div>

          {/* Tab 1: Strategic Goals */}
          <TabsContent value="goals">
            <ResponsiveTableContainer>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">Goal & Strategic Pillar</TableHead>
                    <TableHead className="font-semibold text-slate-700">Target Description</TableHead>
                    <TableHead className="font-semibold text-slate-700">Baseline (2020) → Target (2030)</TableHead>
                    <TableHead className="font-semibold text-slate-700">Current Progress (2025-26)</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">Progress</TableHead>
                    <TableHead className="font-semibold text-slate-700">Nodal Officer</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGoals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No strategic goals match your search query.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredGoals.map((g) => (
                      <TableRow key={g.id} className="hover:bg-slate-50/80">
                        <TableCell>
                          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 mb-1">
                            {g.goalNumber}
                          </Badge>
                          <div className="font-semibold text-slate-900">{g.pillar}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-slate-800 max-w-sm">{g.targetDescription}</div>
                        </TableCell>
                        <TableCell className="text-xs text-slate-600">
                          <div><span className="font-medium text-slate-500">2020:</span> {g.baseline2020}</div>
                          <div><span className="font-semibold text-indigo-700">2030:</span> {g.target2030}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-semibold text-slate-900">{g.currentProgress2025}</div>
                          <Badge
                            className={
                              g.status === "Completed Ahead of Target"
                                ? "bg-purple-600 text-white text-[10px] mt-1"
                                : "bg-emerald-600 text-white text-[10px] mt-1"
                            }
                          >
                            {g.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="text-xs font-bold text-slate-800">{g.achievementPercentage}%</div>
                          <Progress value={g.achievementPercentage} className="h-1.5 max-w-[70px] mx-auto mt-1" />
                        </TableCell>
                        <TableCell className="text-xs text-slate-600">{g.nodalOfficer}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ResponsiveTableContainer>
          </TabsContent>

          {/* Tab 2: Decentralized Committees */}
          <TabsContent value="committees">
            <ResponsiveTableContainer>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">Committee Name & Chairperson</TableHead>
                    <TableHead className="font-semibold text-slate-700">Meeting Frequency</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">Composition (Faculty / Student / Expert)</TableHead>
                    <TableHead className="font-semibold text-slate-700">Primary Mandate & Scope</TableHead>
                    <TableHead className="font-semibold text-slate-700">Last Meeting</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.committees.map((com) => (
                    <TableRow key={com.id} className="hover:bg-slate-50/80">
                      <TableCell>
                        <div className="font-semibold text-slate-900">{com.committeeName}</div>
                        <div className="text-xs text-slate-500">Chair: {com.chairperson}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs bg-slate-50">
                          {com.frequencyOfMeetings}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-mono text-xs">
                        <span className="text-indigo-600 font-bold">{com.facultyMembersCount}F</span> /{" "}
                        <span className="text-emerald-600 font-bold">{com.studentRepresentativesCount}S</span> /{" "}
                        <span className="text-purple-600 font-bold">{com.externalExpertsCount}E</span>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-slate-600 max-w-md line-clamp-2" title={com.primaryMandate}>
                          {com.primaryMandate}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 font-mono">
                        {com.recentMeetingDate}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ResponsiveTableContainer>
          </TabsContent>

          {/* Tab 3: Statutory Evidences */}
          <TabsContent value="evidence">
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
                        No uploaded evidence documents found for Metric 6.1.1.
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

      {/* Add Goal Modal */}
      <Dialog open={showAddGoalModal} onOpenChange={setShowAddGoalModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Strategic Goal Milestone</DialogTitle>
            <DialogDescription>
              Record a milestone target under the 10-year Strategic Perspective Plan.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddGoal} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Goal Number</Label>
                <Input
                  value={goalNumber}
                  onChange={(e) => setGoalNumber(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Strategic Pillar</Label>
                <Select
                  value={pillar}
                  onValueChange={(val) => setPillar(val as StrategicGoalRecord["pillar"])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Academic Excellence">Academic Excellence</SelectItem>
                    <SelectItem value="Research & Innovation">Research & Innovation</SelectItem>
                    <SelectItem value="Infrastructure & Green Campus">Infrastructure & Green Campus</SelectItem>
                    <SelectItem value="Industry Linkage & Placements">Industry Linkage & Placements</SelectItem>
                    <SelectItem value="Global Outreach & Governance">Global Outreach & Governance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold">Target Description</Label>
              <Input
                placeholder="Specific objective and outcome"
                value={targetDescription}
                onChange={(e) => setTargetDescription(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Baseline 2020</Label>
                <Input
                  value={baseline2020}
                  onChange={(e) => setBaseline2020(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Target 2030</Label>
                <Input
                  value={target2030}
                  onChange={(e) => setTarget2030(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Current Progress (2025)</Label>
                <Input
                  value={currentProgress2025}
                  onChange={(e) => setCurrentProgress2025(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Achievement (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={achievementPercentage}
                  onChange={(e) => setAchievementPercentage(Number(e.target.value))}
                  required
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold">Nodal Officer</Label>
              <Input
                value={nodalOfficer}
                onChange={(e) => setNodalOfficer(e.target.value)}
                required
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowAddGoalModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700">
                Save Goal
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Committee Modal */}
      <Dialog open={showAddCommitteeModal} onOpenChange={setShowAddCommitteeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Register Governance Committee</DialogTitle>
            <DialogDescription>
              Record a decentralized institutional committee for participative management.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddCommittee} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-semibold">Committee Name</Label>
              <Input
                placeholder="e.g. Student Grievance Redressal Committee"
                value={committeeName}
                onChange={(e) => setCommitteeName(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Chairperson</Label>
                <Input
                  value={chairperson}
                  onChange={(e) => setChairperson(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Meeting Frequency</Label>
                <Input
                  value={frequencyOfMeetings}
                  onChange={(e) => setFrequencyOfMeetings(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs font-semibold">Faculty</Label>
                <Input
                  type="number"
                  value={facultyCount}
                  onChange={(e) => setFacultyCount(Number(e.target.value))}
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Students</Label>
                <Input
                  type="number"
                  value={studentCount}
                  onChange={(e) => setStudentCount(Number(e.target.value))}
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">External</Label>
                <Input
                  type="number"
                  value={externalCount}
                  onChange={(e) => setExternalCount(Number(e.target.value))}
                  required
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold">Primary Mandate & Powers</Label>
              <Input
                placeholder="Scope of work and responsibilities"
                value={primaryMandate}
                onChange={(e) => setPrimaryMandate(e.target.value)}
                required
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowAddCommitteeModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-purple-600 text-white hover:bg-purple-700">
                Save Committee
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Upload Evidence Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Governance & Strategic Plan Evidence</DialogTitle>
            <DialogDescription>
              Upload strategic plan document, organogram, or governing body resolutions for Metric 6.1.1.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadEvidence} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-semibold">Document Title</Label>
              <Input
                placeholder="e.g. 10-Year Strategic Plan (2020-2030) Approved Copy"
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
                placeholder="Brief summary of document"
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
