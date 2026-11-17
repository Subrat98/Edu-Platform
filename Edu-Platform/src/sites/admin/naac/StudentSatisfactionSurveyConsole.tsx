import { useState, useEffect } from "react";
import {
  MessageSquareHeart,
  CheckCircle2,
  FileText,
  Search,
  Download,
  ExternalLink,
  UploadCloud,
  ShieldCheck,
  Smile,
  HelpCircle,
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
  getSssSurveyData,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type { SssSurveyData, NaacEvidenceDocument } from "@/types";

interface StudentSatisfactionSurveyConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function StudentSatisfactionSurveyConsole({ onEvidenceUpdated }: StudentSatisfactionSurveyConsoleProps) {
  const [data, setData] = useState<SssSurveyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [evidenceList, setEvidenceList] = useState<NaacEvidenceDocument[]>([]);
  const [activeTab, setActiveTab] = useState("questions");
  const [searchQuestion, setSearchQuestion] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Upload Evidence Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDept, setEvidenceDept] = useState("IQAC");
  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadConsoleData();
  }, []);

  async function loadConsoleData() {
    setLoading(true);
    try {
      const [sssData, evidences] = await Promise.all([
        getSssSurveyData(),
        getEvidenceForMetric("2.7.1"),
      ]);
      setData(sssData);
      setEvidenceList(evidences);
    } catch (err) {
      console.error("Failed to load SSS survey data", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredQuestions = (data?.questions || []).filter((q) => {
    const matchesSearch =
      q.questionText.toLowerCase().includes(searchQuestion.toLowerCase()) ||
      q.questionNumber.toLowerCase().includes(searchQuestion.toLowerCase());
    const matchesCat = filterCategory === "all" || q.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  async function handleUploadEvidence(e: React.FormEvent) {
    e.preventDefault();
    if (!evidenceTitle) return;

    setUploading(true);
    try {
      await uploadEvidenceDocument(
        {
          criterionId: 2,
          indicatorCode: "2.7",
          metricCode: "2.7.1",
          title: evidenceTitle,
          academicYear: "2025-26",
          department: evidenceDept,
          documentType: "PDF",
          description: evidenceDesc || "Student Satisfaction Survey statistical report and IQAC ATR.",
          remarks: "Verified against national NAAC online survey portal submission.",
          fileName: evidenceFile?.name || `${evidenceTitle.replace(/\s+/g, "_")}.pdf`,
          fileSize: evidenceFile ? `${(evidenceFile.size / (1024 * 1024)).toFixed(1)} MB` : "3.8 MB",
          evidenceUrl: `/documents/naac/evidence/SSS_${Date.now()}.pdf`,
        },
        { name: "Dr. Snigdha Mohanty", role: "IQAC Coordinator" }
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
      <Card className="border-pink-200 bg-white/70 backdrop-blur">
        <CardContent className="p-12 text-center text-muted-foreground">
          <div className="animate-spin w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full mx-auto mb-4" />
          Loading Online Student Satisfaction Survey (SSS) Console...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Card */}
      <Card className="border-2 border-pink-300 bg-gradient-to-br from-pink-50/80 via-white to-rose-50/70 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-pink-700 text-white hover:bg-pink-800">
                  NAAC Metric 2.7.1
                </Badge>
                <Badge variant="outline" className="text-pink-700 border-pink-300">
                  Online Student Survey
                </Badge>
                <Badge className="bg-purple-600 text-white">Weightage: 60 Marks</Badge>
              </div>
              <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MessageSquareHeart className="w-6 h-6 text-pink-600" />
                Online Student Satisfaction Survey (SSS) Analytics
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                National NAAC 21-question automated online questionnaire covering teaching-learning, institutional support, evaluation transparency, and skill development.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                className="border-pink-300 text-pink-700 hover:bg-pink-50 text-xs sm:text-sm"
                onClick={() => {
                  window.open(
                    "https://documents.eduplatform.ac.in/naac/SSS_National_Questionnaire_2025_26.pdf",
                    "_blank"
                  );
                }}
              >
                <Download className="w-4 h-4 mr-1.5" />
                Download Report
              </Button>
              <Button
                className="bg-pink-700 hover:bg-pink-800 text-white text-xs sm:text-sm shadow-sm"
                onClick={() => setShowUploadModal(true)}
              >
                <UploadCloud className="w-4 h-4 mr-1.5" />
                Attach Evidence
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-pink-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Overall SSS Index</span>
                <Smile className="w-4 h-4 text-pink-600" />
              </div>
              <div className="text-3xl font-black text-pink-700 mt-1">
                {data.overallSatisfactionIndex} <span className="text-sm font-normal text-gray-500">/ 4.00</span>
              </div>
              <div className="text-xs text-emerald-600 font-medium mt-1">
                {data.overallSatisfactionPercentage}% Satisfaction Rating
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-pink-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Response Rate</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-emerald-700 mt-1">
                {data.responseRatePercentage}%
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {data.totalResponsesReceived.toLocaleString()} / {data.totalEligibleStudents.toLocaleString()} Students
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-pink-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Total Questions</span>
                <HelpCircle className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-3xl font-black text-indigo-700 mt-1">
                21
              </div>
              <div className="text-xs text-gray-500 mt-1">Standard National NAAC Format</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-pink-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>IQAC ATR Published</span>
                <ShieldCheck className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-3xl font-black text-purple-700 mt-1">
                100%
              </div>
              <div className="text-xs text-emerald-600 font-medium mt-1">All 3 Recommendations Addressed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Domain Performance Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {data.categoryAverages.map((cat, idx) => (
          <div key={idx} className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-xs space-y-2">
            <div className="text-xs font-semibold text-gray-700 truncate">{cat.category}</div>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold text-gray-900">{cat.averageScore.toFixed(2)}</span>
              <span className="text-xs font-semibold text-pink-600">{cat.percentage}%</span>
            </div>
            <Progress value={cat.percentage} className="h-1.5 bg-gray-100 [&>div]:bg-pink-600" />
          </div>
        ))}
      </div>

      {/* Tabs Layout */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md bg-gray-100 p-1">
          <TabsTrigger value="questions" className="text-xs sm:text-sm">
            21 Questions Tabulation
          </TabsTrigger>
          <TabsTrigger value="atr" className="text-xs sm:text-sm">
            Action Taken Report (ATR)
          </TabsTrigger>
          <TabsTrigger value="evidence" className="text-xs sm:text-sm">
            Evidences ({evidenceList.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: 21 Questions Tabulation */}
        <TabsContent value="questions" className="space-y-4 mt-4">
          <Card className="border border-pink-100 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-semibold text-gray-800">
                    Question-Wise Tabulation & Likert Distribution
                  </CardTitle>
                  <CardDescription>
                    Automated tabulation of 1,840 student responses across 5-point Likert scale (Score 4 to 0).
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative w-48 sm:w-60">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-3 text-gray-400" />
                    <Input
                      placeholder="Search question text, Q#..."
                      className="pl-8 text-xs h-9"
                      value={searchQuestion}
                      onChange={(e) => setSearchQuestion(e.target.value)}
                    />
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-40 text-xs h-9">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Domains</SelectItem>
                      <SelectItem value="Curriculum & Teaching">Curriculum & Teaching</SelectItem>
                      <SelectItem value="Evaluation & Feedback">Evaluation & Feedback</SelectItem>
                      <SelectItem value="Mentoring & Guidance">Mentoring & Guidance</SelectItem>
                      <SelectItem value="Skills & Competencies">Skills & Competencies</SelectItem>
                      <SelectItem value="Institutional Environment">Institutional Environment</SelectItem>
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
                      <TableHead className="w-12 font-semibold text-xs text-center">#</TableHead>
                      <TableHead className="font-semibold text-xs">Question Parameter</TableHead>
                      <TableHead className="font-semibold text-xs">Domain</TableHead>
                      <TableHead className="font-semibold text-xs text-center">Mean Score (4.00)</TableHead>
                      <TableHead className="font-semibold text-xs text-center">Satisfaction %</TableHead>
                      <TableHead className="font-semibold text-xs text-center">Likert Distribution (4/3/2/1/0)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuestions.map((q) => (
                      <TableRow key={q.id} className="hover:bg-pink-50/30">
                        <TableCell className="font-bold text-xs text-pink-700 text-center font-mono">
                          {q.questionNumber}
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-gray-900 leading-snug font-medium max-w-xl">
                            {q.questionText}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">
                            {q.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-center font-mono font-bold text-gray-900">
                          {q.averageScore.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-xs text-center">
                          <span className="font-bold text-emerald-700">
                            {q.percentageSatisfaction}%
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-center font-mono text-[11px] text-gray-600">
                          <span className="text-emerald-700 font-semibold">{q.distribution.score4}%</span> /{" "}
                          <span className="text-blue-700">{q.distribution.score3}%</span> /{" "}
                          <span className="text-amber-700">{q.distribution.score2}%</span> /{" "}
                          <span className="text-rose-600">{q.distribution.score1}%</span> /{" "}
                          <span className="text-gray-400">{q.distribution.score0}%</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ResponsiveTableContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Action Taken Report (ATR) */}
        <TabsContent value="atr" className="space-y-4 mt-4">
          <Card className="border border-pink-100 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                IQAC Action Taken Report (ATR) on Student Feedback
              </CardTitle>
              <CardDescription>
                Statutory resolution passed by IQAC and Governing Body in response to qualitative student observations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.actionTakenItems.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-pink-200 transition-all space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-pink-600" />
                        {item.areaOfImprovement}
                      </h4>
                      <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">
                        Implemented: {item.implementedTimeline}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="font-semibold text-gray-700">Student Suggestion: </span>
                      {item.studentFeedbackSummary}
                    </div>
                    <div className="text-xs text-emerald-900 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-100">
                      <span className="font-semibold text-emerald-800">Action Taken by IQAC: </span>
                      {item.actionTakenByIqac}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Evidences */}
        <TabsContent value="evidence" className="space-y-4 mt-4">
          <Card className="border border-pink-100 shadow-xs">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-gray-800">
                  Evidentiary Documentation (Metric 2.7.1)
                </CardTitle>
                <CardDescription>
                  National SSS analytical reports, raw response databases, and published Action Taken Reports.
                </CardDescription>
              </div>
              <Button
                size="sm"
                className="bg-pink-700 hover:bg-pink-800 text-white text-xs"
                onClick={() => setShowUploadModal(true)}
              >
                <UploadCloud className="w-3.5 h-3.5 mr-1" />
                Upload Evidence
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {evidenceList.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl border border-gray-100 bg-white hover:border-pink-200 hover:shadow-xs transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-pink-50 text-pink-700 rounded-lg">
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
                        className="text-pink-700 font-medium hover:underline inline-flex items-center gap-1"
                      >
                        View Report <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upload Evidence Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-pink-800">
              <UploadCloud className="w-5 h-5" />
              Upload SSS Survey Evidence
            </DialogTitle>
            <DialogDescription>
              Attach statutory survey report, response databases, or IQAC Action Taken Reports.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadEvidence} className="space-y-3">
            <div>
              <Label className="text-xs">Document Title</Label>
              <Input
                className="text-xs h-9"
                required
                placeholder="e.g. National NAAC SSS Institutional Analysis 2025-26"
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
                placeholder="Brief summary of survey findings"
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
                className="bg-pink-700 hover:bg-pink-800 text-white text-xs h-9"
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
