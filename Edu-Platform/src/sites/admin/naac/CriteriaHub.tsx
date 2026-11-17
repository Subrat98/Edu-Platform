import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FileText,
  Search,
  FolderOpen,
  Edit2,
  CheckCircle2,
  ExternalLink,
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveTableContainer } from "@/components/admin/ResponsiveTableContainer";
import { CurriculumPlanningConsole } from "./CurriculumPlanningConsole";
import { CurriculumRevisionConsole } from "./CurriculumRevisionConsole";
import { CbcsManagementConsole } from "./CbcsManagementConsole";
import { ValueAddedCoursesConsole } from "./ValueAddedCoursesConsole";
import { CrosscuttingIssuesConsole } from "./CrosscuttingIssuesConsole";
import { StakeholderFeedbackConsole } from "./StakeholderFeedbackConsole";
import { StudentEnrolmentConsole } from "./StudentEnrolmentConsole";
import { FacultyRatioConsole } from "./FacultyRatioConsole";
import { StudentCentricPedagogyConsole } from "./StudentCentricPedagogyConsole";
import { IctClassroomsLmsConsole } from "./IctClassroomsLmsConsole";
import { CieEvaluationConsole } from "./CieEvaluationConsole";
import { PassPercentageConsole } from "./PassPercentageConsole";
import { StudentSatisfactionSurveyConsole } from "./StudentSatisfactionSurveyConsole";
import { ResearchFundingConsole } from "./ResearchFundingConsole";
import { InnovationEcosystemConsole } from "./InnovationEcosystemConsole";
import { PublicationsMasterConsole } from "./PublicationsMasterConsole";
import { BooksProceedingsConsole } from "./BooksProceedingsConsole";
import { ConsultancyConsole } from "./ConsultancyConsole";
import { CommunityOutreachConsole } from "./CommunityOutreachConsole";
import { FunctionalMousConsole } from "./FunctionalMousConsole";
import { ItInfrastructureConsole } from "./ItInfrastructureConsole";
import { MaintenanceExpenditureConsole } from "./MaintenanceExpenditureConsole";
import { ScholarshipsConsole } from "./ScholarshipsConsole";
import { SkillEnhancementConsole } from "./SkillEnhancementConsole";
import { CareerGuidanceConsole } from "./CareerGuidanceConsole";
import { StudentProgressionConsole } from "./StudentProgressionConsole";
import { AlumniAssociationConsole } from "./AlumniAssociationConsole";
import { StrategicPlanConsole } from "./StrategicPlanConsole";
import { EGovernanceConsole } from "./EGovernanceConsole";
import { FacultyEmpowermentConsole } from "./FacultyEmpowermentConsole";
import { FinancialAuditsConsole } from "./FinancialAuditsConsole";
import { GenderEquityConsole } from "./GenderEquityConsole";
import { RenewableEnergyConsole } from "./RenewableEnergyConsole";
import { EnvironmentManagementConsole } from "./EnvironmentManagementConsole";
import { DivyangjanFacilitiesConsole } from "./DivyangjanFacilitiesConsole";
import {
  getCriteriaList,
  updateMetricValue,
} from "@/features/naac/naacService";
import type { NaacCriterion, NaacMetric } from "@/types";

export default function CriteriaHub() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCriterion = searchParams.get("tab") || "1";

  const [criteria, setCriteria] = useState<NaacCriterion[]>([]);
  const [, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialCriterion);
  const [searchQuery, setSearchQuery] = useState("");
  const [showConsole111, setShowConsole111] = useState(false);
  const [showConsole112, setShowConsole112] = useState(false);
  const [showConsole121, setShowConsole121] = useState(false);
  const [showConsole122, setShowConsole122] = useState(false);
  const [showConsole131, setShowConsole131] = useState(false);
  const [showConsole141, setShowConsole141] = useState(false);
  const [showConsole211, setShowConsole211] = useState(false);
  const [showConsole221, setShowConsole221] = useState(false);
  const [showConsole231, setShowConsole231] = useState(false);
  const [showConsole232, setShowConsole232] = useState(false);
  const [showConsole251, setShowConsole251] = useState(false);
  const [showConsole263, setShowConsole263] = useState(false);
  const [showConsole271, setShowConsole271] = useState(false);
  const [showConsole311, setShowConsole311] = useState(false);
  const [showConsole321, setShowConsole321] = useState(false);
  const [showConsole331, setShowConsole331] = useState(false);
  const [showConsole332, setShowConsole332] = useState(false);
  const [showConsole351, setShowConsole351] = useState(false);
  const [showConsole361, setShowConsole361] = useState(false);
  const [showConsole371, setShowConsole371] = useState(false);
  const [showConsole431, setShowConsole431] = useState(false);
  const [showConsole441, setShowConsole441] = useState(false);
  const [showConsole511, setShowConsole511] = useState(false);
  const [showConsole512, setShowConsole512] = useState(false);
  const [showConsole513, setShowConsole513] = useState(false);
  const [showConsole521, setShowConsole521] = useState(false);
  const [showConsole541, setShowConsole541] = useState(false);
  const [showConsole611, setShowConsole611] = useState(false);
  const [showConsole622, setShowConsole622] = useState(false);
  const [showConsole631, setShowConsole631] = useState(false);
  const [showConsole641, setShowConsole641] = useState(false);
  const [showConsole711, setShowConsole711] = useState(false);
  const [showConsole712, setShowConsole712] = useState(false);
  const [showConsole713, setShowConsole713] = useState(false);
  const [showConsole717, setShowConsole717] = useState(false);

  const [editingMetric, setEditingMetric] = useState<NaacMetric | null>(null);
  const [metricValue, setMetricValue] = useState("");
  const [metricStatus, setMetricStatus] = useState<NaacMetric["status"]>("In Progress");
  const [metricRemarks, setMetricRemarks] = useState("");

  const loadData = () => {
    setLoading(true);
    getCriteriaList()
      .then((data) => setCriteria(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    setSearchParams({ tab: val });
  };

  const openMetricEditor = (m: NaacMetric) => {
    setEditingMetric(m);
    setMetricValue(m.type === "quantitative" ? String(m.quantitativeValue ?? "") : m.qualitativeText || "");
    setMetricStatus(m.status);
    setMetricRemarks(m.remarks || "");
  };

  const handleSaveMetric = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMetric) return;

    await updateMetricValue(
      editingMetric.id,
      {
        quantitativeValue: editingMetric.type === "quantitative" ? metricValue : undefined,
        qualitativeText: editingMetric.type === "qualitative" ? metricValue : undefined,
        status: metricStatus,
        remarks: metricRemarks,
      },
      { name: "Dr. Snigdha Mohanty", role: "IQAC Coordinator" }
    );

    setEditingMetric(null);
    loadData();
  };

  const currentCriterion = criteria.find((c) => String(c.id) === activeTab) ?? criteria[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full min-w-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              The Seven NAAC Criteria Hub
            </h1>
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
              Metric Repository
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete curriculum, teaching, research, infrastructure, student support, and governance metric evaluation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/naac/evidence" className="gap-1.5">
              <FolderOpen className="size-4" />
              <span>Evidence Repository</span>
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/admin/naac/reports" className="gap-1.5">
              <FileText className="size-4" />
              <span>Export Metric Dossier</span>
            </Link>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <div className="overflow-x-auto pb-1 scrollbar-none">
          <TabsList className="h-auto flex-nowrap sm:flex-wrap justify-start gap-1 p-1 bg-muted/60 min-w-max">
            {criteria.map((c) => (
              <TabsTrigger
                key={c.id}
                value={String(c.id)}
                className="gap-1.5 py-2 px-3 text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:shadow-xs whitespace-nowrap"
              >
                <span className="font-bold">C{c.id}</span>
                <span className="hidden sm:inline truncate max-w-[140px]">{c.name}</span>
                <Badge variant="secondary" className="text-[10px] ml-1 px-1 py-0">
                  {c.completionPercentage}%
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {currentCriterion && (
          <TabsContent value={String(currentCriterion.id)} className="space-y-6">
            <Card className="border-border/60 shadow-xs">
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardDescription className="text-xs uppercase font-semibold text-primary">
                      Criterion {currentCriterion.id}
                    </CardDescription>
                    <CardTitle className="text-xl font-bold text-foreground">
                      {currentCriterion.name}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      Weightage: <strong className="ml-1 text-foreground">{currentCriterion.weightage}</strong>
                    </Badge>
                    <Badge className="bg-primary/90 text-primary-foreground text-xs">
                      Score: {(currentCriterion.weightedScore ?? ((currentCriterion.score ?? 3.5) / 4) * currentCriterion.weightage).toFixed(1)} / {currentCriterion.weightage}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {currentCriterion.executiveSummary || currentCriterion.description}
                </p>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-muted-foreground">Criterion Readiness & Evidentiary Coverage</span>
                    <span className="text-foreground">{currentCriterion.completionPercentage}% Complete</span>
                  </div>
                  <Progress value={currentCriterion.completionPercentage} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Metric Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search key indicators, metric code (e.g. 1.1.1) or description..."
                className="pl-9 h-9 text-xs sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Special Integration: Metric 1.1.1 Curriculum Planning Console */}
            {currentCriterion.id === 1 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 rounded-lg border border-primary/20 bg-primary/5 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-mono text-xs font-bold shrink-0">
                    1.1.1
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-foreground">
                      Curriculum Planning & Implementation Console
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Academic Council resolutions, semester calendars (≥90 days), LOCF-NEP syllabus structures, and evidence attachments.
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={showConsole111 ? "default" : "outline"}
                  onClick={() => {
                    setShowConsole111(!showConsole111);
                    if (!showConsole111) setShowConsole112(false);
                  }}
                  className="gap-1.5 text-xs shrink-0"
                >
                  {showConsole111 ? "Hide 1.1.1 Console" : "Open 1.1.1 Console & Evidences 📋"}
                </Button>
              </div>
            )}

            {currentCriterion.id === 1 && showConsole111 && (
              <CurriculumPlanningConsole onEvidenceUpdated={loadData} />
            )}

            {/* Special Integration: Metric 1.1.2 Programme Revision Console */}
            {currentCriterion.id === 1 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 rounded-lg border border-blue-500/20 bg-blue-500/5 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-md bg-blue-600 text-white font-mono text-xs font-bold shrink-0">
                    1.1.2
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-foreground">
                        5-Year Programme Revision & BoS Console
                      </h4>
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px]">
                        78.4% ≥ 70% Benchmark Verified
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Board of Studies (BoS) minutes, comparative syllabus analysis (old vs new), and quantitative 5-year DVV calculation.
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={showConsole112 ? "default" : "outline"}
                  onClick={() => {
                    setShowConsole112(!showConsole112);
                    if (!showConsole112) setShowConsole111(false);
                  }}
                  className="gap-1.5 text-xs shrink-0"
                >
                  {showConsole112 ? "Hide 1.1.2 Console" : "Open 1.1.2 Revision Console 🔄"}
                </Button>
              </div>
            )}

            {currentCriterion.id === 1 && showConsole112 && (
              <CurriculumRevisionConsole onEvidenceUpdated={loadData} />
            )}

            {/* Special Integration: Metric 1.2.1 Choice Based Credit System (CBCS) Console */}
            {currentCriterion.id === 1 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 rounded-lg border border-indigo-500/20 bg-indigo-500/5 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-md bg-indigo-600 text-white font-mono text-xs font-bold shrink-0">
                    1.2.1
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-foreground">
                        Choice Based Credit System (CBCS) & Academic Flexibility Console
                      </h4>
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px]">
                        100% Adoption Verified
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      UGC circulars, affiliating university gazettes, 14-programme credit audits (Core, DSE, GE, SEC), and SWAYAM credit transfer.
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={showConsole121 ? "default" : "outline"}
                  onClick={() => {
                    setShowConsole121(!showConsole121);
                    if (!showConsole121) {
                      setShowConsole111(false);
                      setShowConsole112(false);
                    }
                  }}
                  className="gap-1.5 text-xs shrink-0"
                >
                  {showConsole121 ? "Hide 1.2.1 Console" : "Open 1.2.1 CBCS Console 🎓"}
                </Button>
              </div>
            )}

            {currentCriterion.id === 1 && showConsole121 && (
              <CbcsManagementConsole onEvidenceUpdated={loadData} />
            )}

            {/* Special Integration: Metric 1.2.2 Value-Added Courses Console */}
            {currentCriterion.id === 1 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 rounded-lg border border-teal-500/20 bg-teal-500/5 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-md bg-teal-600 text-white font-mono text-xs font-bold shrink-0">
                    1.2.2
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-foreground">
                        Certificate & Value-Added Courses Console
                      </h4>
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px]">
                        42 Courses (1,840 Students) Verified
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Consolidated 5-year directory (all ≥30 contact hours), SWAYAM/NPTEL local chapter, and 1,840 student completion records.
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={showConsole122 ? "default" : "outline"}
                  onClick={() => {
                    setShowConsole122(!showConsole122);
                    if (!showConsole122) {
                      setShowConsole111(false);
                      setShowConsole112(false);
                      setShowConsole121(false);
                    }
                  }}
                  className="gap-1.5 text-xs shrink-0"
                >
                  {showConsole122 ? "Hide 1.2.2 Console" : "Open 1.2.2 Courses Console 📚"}
                </Button>
              </div>
            )}

            {currentCriterion.id === 1 && showConsole122 && (
              <ValueAddedCoursesConsole onEvidenceUpdated={loadData} />
            )}

            {/* Special Integration: Metric 1.3.1 Crosscutting Issues Console */}
            {currentCriterion.id === 1 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-md bg-emerald-600 text-white font-mono text-xs font-bold shrink-0">
                    1.3.1
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-foreground">
                        Crosscutting Issues Integration Console (Gender, Environment, Values, Ethics)
                      </h4>
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px]">
                        28 Courses Mapped • 100% UG Covered
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Course-by-course unit mapping with highlighted syllabi, statutory policy handbooks, and 6 co-curricular student outreach initiatives.
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={showConsole131 ? "default" : "outline"}
                  onClick={() => {
                    setShowConsole131(!showConsole131);
                    if (!showConsole131) {
                      setShowConsole111(false);
                      setShowConsole112(false);
                      setShowConsole121(false);
                      setShowConsole122(false);
                    }
                  }}
                  className="gap-1.5 text-xs shrink-0"
                >
                  {showConsole131 ? "Hide 1.3.1 Console" : "Open 1.3.1 Crosscutting Console 🌿"}
                </Button>
              </div>
            )}

            {currentCriterion.id === 1 && showConsole131 && (
              <CrosscuttingIssuesConsole onEvidenceUpdated={loadData} />
            )}

            {/* Special Integration: Metric 1.4.1 Stakeholder Feedback Console */}
            {currentCriterion.id === 1 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 rounded-lg border border-sky-500/20 bg-sky-500/5 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-md bg-sky-600 text-white font-mono text-xs font-bold shrink-0">
                    1.4.1
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-foreground">
                        Stakeholder Feedback & Action Taken Report (ATR) Console
                      </h4>
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px]">
                        Option A Verified (2,582 Responses)
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Structured 5-stakeholder feedback (Students, Teachers, Alumni, Employers, Parents) & published website Action Taken Reports.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={showConsole141 ? "default" : "outline"}
                    onClick={() => {
                      setShowConsole141(!showConsole141);
                      if (!showConsole141) {
                        setShowConsole111(false);
                        setShowConsole112(false);
                        setShowConsole121(false);
                        setShowConsole122(false);
                        setShowConsole131(false);
                      }
                    }}
                    className="gap-1.5 text-xs"
                  >
                    {showConsole141 ? "Hide 1.4.1 Console" : "Open 1.4.1 Feedback Console 💬"}
                  </Button>
                  <Button size="sm" variant="outline" asChild className="text-xs gap-1">
                    <Link to="/admin/naac/feedback">
                      <span>Full Page</span>
                      <ExternalLink className="size-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {currentCriterion.id === 1 && showConsole141 && (
              <StakeholderFeedbackConsole onEvidenceUpdated={loadData} />
            )}

            {/* Special Integration: Metric 2.1.1 Student Enrolment & Reservation Compliance Console */}
            {currentCriterion.id === 2 && (
              <div className="rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50/70 via-slate-50 to-sky-50/70 dark:from-indigo-950/30 dark:via-background dark:to-sky-950/30 p-4 md:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-indigo-600 text-white text-[11px]">
                      Metric 2.1.1
                    </Badge>
                    <Badge variant="outline" className="border-indigo-400/40 text-indigo-700 dark:text-indigo-300 bg-indigo-500/10 text-[11px]">
                      Student Profile Enrolment (94.6%)
                    </Badge>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> High Benchmark (3,122 / 3,300)
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-foreground">
                    Student Enrolment & Reservation Compliance Console (2.1.1)
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-2xl">
                    5-year quantitative DVV calculation (94.6%), Odisha state reservation registers (SC 16.25%, ST 22.50%, OBC 11.25%, PwD 5%), and SAMS centralized admissions.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={showConsole211 ? "secondary" : "default"}
                    onClick={() => setShowConsole211(!showConsole211)}
                    className="gap-1.5 text-xs bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    {showConsole211 ? "Hide 2.1.1 Console" : "Open 2.1.1 Enrolment Console 📊"}
                  </Button>
                </div>
              </div>
            )}

            {currentCriterion.id === 2 && showConsole211 && (
              <StudentEnrolmentConsole onEvidenceUpdated={loadData} />
            )}

            {/* Special Integration: Metric 2.2.1 Student - Full Time Teacher Ratio Console */}
            {currentCriterion.id === 2 && (
              <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-gradient-to-r from-blue-50/70 via-slate-50 to-indigo-50/70 dark:from-blue-950/30 dark:via-background dark:to-indigo-950/30 p-4 md:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-600 text-white text-[11px]">
                      Metric 2.2.1
                    </Badge>
                    <Badge variant="outline" className="border-blue-400/40 text-blue-700 dark:text-blue-300 bg-blue-500/10 text-[11px]">
                      Faculty Ratio (16:1)
                    </Badge>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> UGC/AICTE Cadre Norms (2,160 / 135)
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-foreground">
                    Student – Full Time Teacher Ratio Console (2.2.1)
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-2xl">
                    Institutional ratio calculation (16:1), 135 approved full-time faculty roster with appointment orders, 2,160 active student cohort rolls, and 1:16 proctorial mentorship.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={showConsole221 ? "secondary" : "default"}
                    onClick={() => {
                      setShowConsole221(!showConsole221);
                      if (!showConsole221) setShowConsole211(false);
                    }}
                    className="gap-1.5 text-xs bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {showConsole221 ? "Hide 2.2.1 Console" : "Open 2.2.1 Faculty Ratio Console 👥"}
                  </Button>
                </div>
              </div>
            )}

            {currentCriterion.id === 2 && showConsole221 && (
              <FacultyRatioConsole onEvidenceUpdated={loadData} />
            )}

            {/* Special Integration: Metric 2.3.1 Student-Centric Pedagogy Console */}
            {currentCriterion.id === 2 && (
              <div className="rounded-xl border border-teal-200 dark:border-teal-900/60 bg-gradient-to-r from-teal-50/70 via-slate-50 to-emerald-50/70 dark:from-teal-950/30 dark:via-background dark:to-emerald-950/30 p-4 md:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-teal-600 text-white text-[11px]">
                      Metric 2.3.1
                    </Badge>
                    <Badge variant="outline" className="border-teal-400/40 text-teal-700 dark:text-teal-300 bg-teal-500/10 text-[11px]">
                      Student-Centric Pedagogy
                    </Badge>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> 18 Field Visits & Capstones
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-foreground">
                    Student-Centric Learning Methodologies Console (2.3.1)
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-2xl">
                    Experiential learning via 18 field visits with geo-tagged verification, 24 capstones, and participative peer tutoring.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={showConsole231 ? "secondary" : "default"}
                    onClick={() => {
                      setShowConsole231(!showConsole231);
                      if (!showConsole231) {
                        setShowConsole211(false);
                        setShowConsole221(false);
                        setShowConsole232(false);
                      }
                    }}
                    className="gap-1.5 text-xs bg-teal-600 text-white hover:bg-teal-700"
                  >
                    {showConsole231 ? "Hide 2.3.1 Console" : "Open 2.3.1 Pedagogy Console 🔬"}
                  </Button>
                </div>
              </div>
            )}

            {currentCriterion.id === 2 && showConsole231 && (
              <StudentCentricPedagogyConsole onEvidenceUpdated={loadData} />
            )}

            {/* Special Integration: Metric 2.3.2 ICT Classrooms & LMS Console */}
            {currentCriterion.id === 2 && (
              <div className="rounded-xl border border-cyan-200 dark:border-cyan-900/60 bg-gradient-to-r from-cyan-50/70 via-slate-50 to-blue-50/70 dark:from-cyan-950/30 dark:via-background dark:to-blue-950/30 p-4 md:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-cyan-600 text-white text-[11px]">
                      Metric 2.3.2
                    </Badge>
                    <Badge variant="outline" className="border-cyan-400/40 text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 text-[11px]">
                      ICT Classrooms & LMS (89.5%)
                    </Badge>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> 34 ICT Rooms & 142 LMS Portals
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-foreground">
                    ICT-Enabled Classrooms & LMS Utilization Console (2.3.2)
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-2xl">
                    34 ICT-enabled rooms, EduPlatform LMS deployment with 142 course portals, 100% faculty adoption, and 42 flipped modules.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={showConsole232 ? "secondary" : "default"}
                    onClick={() => {
                      setShowConsole232(!showConsole232);
                      if (!showConsole232) {
                        setShowConsole211(false);
                        setShowConsole221(false);
                        setShowConsole231(false);
                      }
                    }}
                    className="gap-1.5 text-xs bg-cyan-600 text-white hover:bg-cyan-700"
                  >
                    {showConsole232 ? "Hide 2.3.2 Console" : "Open 2.3.2 ICT & LMS Console 💻"}
                  </Button>
                </div>
              </div>
            )}

            {currentCriterion.id === 2 && showConsole232 && (
              <IctClassroomsLmsConsole onEvidenceUpdated={loadData} />
            )}

            {/* Special Integration: Metric 2.5.1 CIE Evaluation Console */}
            {currentCriterion.id === 2 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-emerald-500/40 text-emerald-600 dark:text-emerald-400">
                      Metric 2.5.1
                    </Badge>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> 100% Grievance Resolution (3.2d Turnaround)
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-foreground">
                    Continuous Internal Evaluation (CIE) & Grievance Console (2.5.1)
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-2xl">
                    Institutional CIE assessment calendars, three-tier transparent grievance redressal (18 resolved), and answer script verification.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={showConsole251 ? "secondary" : "default"}
                    onClick={() => {
                      setShowConsole251(!showConsole251);
                      if (!showConsole251) {
                        setShowConsole211(false);
                        setShowConsole221(false);
                        setShowConsole231(false);
                        setShowConsole232(false);
                        setShowConsole263(false);
                        setShowConsole271(false);
                      }
                    }}
                    className="gap-1.5 text-xs bg-emerald-700 text-white hover:bg-emerald-800"
                  >
                    {showConsole251 ? "Hide 2.5.1 Console" : "Open 2.5.1 CIE Console ⚖️"}
                  </Button>
                </div>
              </div>
            )}

            {currentCriterion.id === 2 && showConsole251 && (
              <CieEvaluationConsole onEvidenceUpdated={loadData} />
            )}

            {/* Special Integration: Metric 2.6.3 Pass Percentage Console */}
            {currentCriterion.id === 2 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 backdrop-blur-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-blue-500/40 text-blue-600 dark:text-blue-400">
                      Metric 2.6.3
                    </Badge>
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> 92.8% Average Pass Rate (617 / 665 Passed)
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-foreground">
                    Student Pass Percentage & PO/CO Attainment Console (2.6.3)
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-2xl">
                    Final year outgoing result analysis, 4 University Gold Medals, and 14-programme Outcome-Based Education (OBE) attainment calculation.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={showConsole263 ? "secondary" : "default"}
                    onClick={() => {
                      setShowConsole263(!showConsole263);
                      if (!showConsole263) {
                        setShowConsole211(false);
                        setShowConsole221(false);
                        setShowConsole231(false);
                        setShowConsole232(false);
                        setShowConsole251(false);
                        setShowConsole271(false);
                      }
                    }}
                    className="gap-1.5 text-xs bg-blue-700 text-white hover:bg-blue-800"
                  >
                    {showConsole263 ? "Hide 2.6.3 Console" : "Open 2.6.3 Pass Rate Console 🎓"}
                  </Button>
                </div>
              </div>
            )}

            {currentCriterion.id === 2 && showConsole263 && (
              <PassPercentageConsole onEvidenceUpdated={loadData} />
            )}

            {/* Special Integration: Metric 2.7.1 Student Satisfaction Survey Console */}
            {currentCriterion.id === 2 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-pink-500/30 bg-pink-500/5 backdrop-blur-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-pink-500/40 text-pink-600 dark:text-pink-400">
                      Metric 2.7.1
                    </Badge>
                    <span className="text-xs font-semibold text-pink-600 dark:text-pink-400 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> 3.78 / 4.00 (85.2% Response Rate)
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-foreground">
                    Online Student Satisfaction Survey (SSS) Console (2.7.1)
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-2xl">
                    National NAAC 21-question questionnaire, automated response tabulation of 1,840 student responses, and published IQAC ATR.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={showConsole271 ? "secondary" : "default"}
                    onClick={() => {
                      setShowConsole271(!showConsole271);
                      if (!showConsole271) {
                        setShowConsole211(false);
                        setShowConsole221(false);
                        setShowConsole231(false);
                        setShowConsole232(false);
                        setShowConsole251(false);
                        setShowConsole263(false);
                      }
                    }}
                    className="gap-1.5 text-xs bg-pink-700 text-white hover:bg-pink-800"
                  >
                    {showConsole271 ? "Hide 2.7.1 Console" : "Open 2.7.1 SSS Console 📊"}
                  </Button>
                </div>
              </div>
            )}

            {currentCriterion.id === 2 && showConsole271 && (
              <StudentSatisfactionSurveyConsole onEvidenceUpdated={loadData} />
            )}

            {/* ========================================================= */}
            {/* CRITERION 3 SPECIAL INTEGRATIONS */}
            {/* ========================================================= */}

            {/* Special Integration: Metric 3.1.1 Research Grants Console */}
            {currentCriterion.id === 3 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-purple-500/30 bg-purple-500/5 backdrop-blur-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-purple-500/40 text-purple-600 dark:text-purple-400">
                      Metric 3.1.1
                    </Badge>
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> ₹142.50 Lakhs Mobilized (DST, CSIR, UGC)
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-foreground">
                    Grants & Mobilization for Research Console (3.1.1)
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-2xl">
                    Sponsored government research projects register, sanction orders, and Chartered Accountant audited Utilization Certificates (UC).
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={showConsole311 ? "secondary" : "default"}
                    onClick={() => {
                      setShowConsole311(!showConsole311);
                      if (!showConsole311) {
                        setShowConsole321(false);
                        setShowConsole331(false);
                        setShowConsole332(false);
                        setShowConsole351(false);
                        setShowConsole361(false);
                        setShowConsole371(false);
                      }
                    }}
                    className="gap-1.5 text-xs bg-purple-700 text-white hover:bg-purple-800"
                  >
                    {showConsole311 ? "Hide 3.1.1 Console" : "Open 3.1.1 Grants Console 💰"}
                  </Button>
                </div>
              </div>
            )}

            {currentCriterion.id === 3 && showConsole311 && (
              <ResearchFundingConsole onEvidenceUpdated={loadData} />
            )}

            {/* Special Integration: Metric 3.2.1 Innovation & Patents Console */}
            {currentCriterion.id === 3 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 backdrop-blur-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-amber-500/40 text-amber-600 dark:text-amber-400">
                      Metric 3.2.1
                    </Badge>
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> 8 Patents & 6 Startups (IIC 4.5★)
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-foreground">
                    Innovation Ecosystem, Incubation & Patents Console (3.2.1)
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-2xl">
                    Indian Patent Office (IPO) filings and grants, Ministry of Education IIC, EduVenture incubator, and seed capital records.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={showConsole321 ? "secondary" : "default"}
                    onClick={() => {
                      setShowConsole321(!showConsole321);
                      if (!showConsole321) {
                        setShowConsole311(false);
                        setShowConsole331(false);
                        setShowConsole332(false);
                        setShowConsole351(false);
                        setShowConsole361(false);
                        setShowConsole371(false);
                      }
                    }}
                    className="gap-1.5 text-xs bg-amber-600 text-white hover:bg-amber-700"
                  >
                    {showConsole321 ? "Hide 3.2.1 Console" : "Open 3.2.1 Innovation Console 💡"}
                  </Button>
                </div>
              </div>
            )}

            {currentCriterion.id === 3 && showConsole321 && (
              <InnovationEcosystemConsole onEvidenceUpdated={loadData} />
            )}

            {/* Special Integration: Metric 3.3.1 Publications Console */}
            {currentCriterion.id === 3 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/5 backdrop-blur-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-indigo-500/40 text-indigo-600 dark:text-indigo-400">
                      Metric 3.3.1
                    </Badge>
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> 68 Scopus/WoS/UGC-CARE Papers
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-foreground">
                    Scopus & UGC-CARE Publications Master Directory (3.3.1)
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-2xl">
                    Complete searchable inventory of 68 faculty publications with live DOIs, impact factor metrics, and institutional citations.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={showConsole331 ? "secondary" : "default"}
                    onClick={() => {
                      setShowConsole331(!showConsole331);
                      if (!showConsole331) {
                        setShowConsole311(false);
                        setShowConsole321(false);
                        setShowConsole332(false);
                        setShowConsole351(false);
                        setShowConsole361(false);
                        setShowConsole371(false);
                      }
                    }}
                    className="gap-1.5 text-xs bg-indigo-700 text-white hover:bg-indigo-800"
                  >
                    {showConsole331 ? "Hide 3.3.1 Console" : "Open 3.3.1 Scopus Master 📚"}
                  </Button>
                </div>
              </div>
            )}

            {currentCriterion.id === 3 && showConsole331 && (
              <PublicationsMasterConsole onEvidenceUpdated={loadData} />
            )}

            {/* Special Integration: Metric 3.3.2 Books & Proceedings Console */}
            {currentCriterion.id === 3 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-teal-500/30 bg-teal-500/5 backdrop-blur-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-teal-500/40 text-teal-600 dark:text-teal-400">
                      Metric 3.3.2
                    </Badge>
                    <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> 34 Books, Chapters & Proceedings
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-foreground">
                    Books, Book Chapters & Conference Proceedings Directory (3.3.2)
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-2xl">
                    Authored books, edited collections (CRC, Springer, Routledge), and international IEEE conference proceedings with ISBN proofs.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={showConsole332 ? "secondary" : "default"}
                    onClick={() => {
                      setShowConsole332(!showConsole332);
                      if (!showConsole332) {
                        setShowConsole311(false);
                        setShowConsole321(false);
                        setShowConsole331(false);
                        setShowConsole351(false);
                        setShowConsole361(false);
                        setShowConsole371(false);
                      }
                    }}
                    className="gap-1.5 text-xs bg-teal-700 text-white hover:bg-teal-800"
                  >
                    {showConsole332 ? "Hide 3.3.2 Console" : "Open 3.3.2 Books Console 📖"}
                  </Button>
                </div>
              </div>
            )}

            {currentCriterion.id === 3 && showConsole332 && (
              <BooksProceedingsConsole onEvidenceUpdated={loadData} />
            )}

            {/* Special Integration: Metric 3.5.1 Consultancy Console */}
            {currentCriterion.id === 3 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-cyan-500/40 text-cyan-600 dark:text-cyan-400">
                      Metric 3.5.1
                    </Badge>
                    <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> ₹28.40 Lakhs Generated (8 Corporate Clients)
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-foreground">
                    Consultancy Services & Corporate MoUs Console (3.5.1)
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-2xl">
                    Institutional consultancy projects (NALCO, Tata Steel, OSDMA, PPL, JSL), work orders, and CA audited revenue receipts.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={showConsole351 ? "secondary" : "default"}
                    onClick={() => {
                      setShowConsole351(!showConsole351);
                      if (!showConsole351) {
                        setShowConsole311(false);
                        setShowConsole321(false);
                        setShowConsole331(false);
                        setShowConsole332(false);
                        setShowConsole361(false);
                        setShowConsole371(false);
                      }
                    }}
                    className="gap-1.5 text-xs bg-cyan-700 text-white hover:bg-cyan-800"
                  >
                    {showConsole351 ? "Hide 3.5.1 Console" : "Open 3.5.1 Consultancy Console 💼"}
                  </Button>
                </div>
              </div>
            )}

            {currentCriterion.id === 3 && showConsole351 && (
              <ConsultancyConsole onEvidenceUpdated={loadData} />
            )}

            {/* Special Integration: Metric 3.6.1 Community Outreach Console */}
            {currentCriterion.id === 3 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 backdrop-blur-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-rose-500/40 text-rose-600 dark:text-rose-400">
                      Metric 3.6.1
                    </Badge>
                    <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> 14 Documented Extension Drives (1,640 Students)
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-foreground">
                    Community Outreach & Geo-Tagged Extension Compendium (3.6.1)
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-2xl">
                    NSS, NCC, Red Cross, and Eco Club community drives with exact GPS coordinates, volunteer attendance rolls, and press clippings.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={showConsole361 ? "secondary" : "default"}
                    onClick={() => {
                      setShowConsole361(!showConsole361);
                      if (!showConsole361) {
                        setShowConsole311(false);
                        setShowConsole321(false);
                        setShowConsole331(false);
                        setShowConsole332(false);
                        setShowConsole351(false);
                        setShowConsole371(false);
                      }
                    }}
                    className="gap-1.5 text-xs bg-rose-700 text-white hover:bg-rose-800"
                  >
                    {showConsole361 ? "Hide 3.6.1 Console" : "Open 3.6.1 Outreach Console 🤝"}
                  </Button>
                </div>
              </div>
            )}

            {currentCriterion.id === 3 && showConsole361 && (
              <CommunityOutreachConsole onEvidenceUpdated={loadData} />
            )}

            {/* Special Integration: Metric 3.7.1 Functional MoUs Console */}
            {currentCriterion.id === 3 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-sky-500/30 bg-sky-500/5 backdrop-blur-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-sky-500/40 text-sky-600 dark:text-sky-400">
                      Metric 3.7.1
                    </Badge>
                    <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> 16 Active Functional MoUs (48 Activities)
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-foreground">
                    Functional MoUs & Institutional Linkages Console (3.7.1)
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-2xl">
                    Premier partnerships with IIT Bhubaneswar, CSIR-IMMT, ILS, Infosys, NALCO, and TCS with student internship and collaborative research logs.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={showConsole371 ? "secondary" : "default"}
                    onClick={() => {
                      setShowConsole371(!showConsole371);
                      if (!showConsole371) {
                        setShowConsole311(false);
                        setShowConsole321(false);
                        setShowConsole331(false);
                        setShowConsole332(false);
                        setShowConsole351(false);
                        setShowConsole361(false);
                      }
                    }}
                    className="gap-1.5 text-xs bg-sky-700 text-white hover:bg-sky-800"
                  >
                    {showConsole371 ? "Hide 3.7.1 Console" : "Open 3.7.1 MoUs Console 📜"}
                  </Button>
                </div>
              </div>
            )}

            {currentCriterion.id === 3 && showConsole371 && (
              <FunctionalMousConsole onEvidenceUpdated={loadData} />
            )}

            {/* Special Integration: Metric 4.3.1 IT Infrastructure Console */}
            {currentCriterion.id === 4 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/5 backdrop-blur-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-indigo-500/40 text-indigo-600 dark:text-indigo-400">
                      Metric 4.3.1
                    </Badge>
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> 1 Gbps Leased Line & 4:1 Student-PC Ratio
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-foreground">
                    IT Facilities & Campus Wi-Fi Bandwidth Console (4.3.1)
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-2xl">
                    Campus-wide 1 Gbps leased line, 540 student workstations across 8 labs, 48 Wi-Fi 6 APs, 620 LAN nodes, and Cisco/Fortinet datacenter.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={showConsole431 ? "secondary" : "default"}
                    onClick={() => {
                      setShowConsole431(!showConsole431);
                      if (!showConsole431) {
                        setShowConsole441(false);
                      }
                    }}
                    className="gap-1.5 text-xs bg-indigo-700 text-white hover:bg-indigo-800"
                  >
                    {showConsole431 ? "Hide 4.3.1 Console" : "Open 4.3.1 IT Console 💻"}
                  </Button>
                </div>
              </div>
            )}

            {currentCriterion.id === 4 && showConsole431 && (
              <ItInfrastructureConsole onEvidenceUpdated={loadData} />
            )}

            {/* Special Integration: Metric 4.4.1 Infrastructure Maintenance Console */}
            {currentCriterion.id === 4 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-teal-500/30 bg-teal-500/5 backdrop-blur-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-teal-500/40 text-teal-600 dark:text-teal-400">
                      Metric 4.4.1
                    </Badge>
                    <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> ₹48.75 Lakhs Audited (37.94% Non-Salary)
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-foreground">
                    Infrastructure Maintenance & Expenditure Console (4.4.1)
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-2xl">
                    Audited maintenance expenditure for physical and academic assets supported by 6 active AMCs and CA verification certificates.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={showConsole441 ? "secondary" : "default"}
                    onClick={() => {
                      setShowConsole441(!showConsole441);
                      if (!showConsole441) {
                        setShowConsole431(false);
                      }
                    }}
                    className="gap-1.5 text-xs bg-teal-700 text-white hover:bg-teal-800"
                  >
                    {showConsole441 ? "Hide 4.4.1 Console" : "Open 4.4.1 Maint. Console 🔧"}
                  </Button>
                </div>
              </div>
            )}

            {currentCriterion.id === 4 && showConsole441 && (
              <MaintenanceExpenditureConsole onEvidenceUpdated={loadData} />
            )}

            {/* Special Integration: Metric 5.1.1 Scholarships Console */}
            {currentCriterion.id === 5 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-sky-500/30 bg-sky-500/5 backdrop-blur-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-sky-500/40 text-sky-600 dark:text-sky-400">
                      Metric 5.1.1
                    </Badge>
                    <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> 68.2% Covered (1,473 Beneficiaries)
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-foreground">
                    Scholarships & Freeships Beneficiaries Console (5.1.1)
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-2xl">
                    Govt PRERANA Post-Matric, National Scholarships (NSP), Medhabruti, and institutional freeships totalling ₹142.80 Lakhs.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={showConsole511 ? "secondary" : "default"}
                    onClick={() => {
                      setShowConsole511(!showConsole511);
                      if (!showConsole511) {
                        setShowConsole512(false);
                        setShowConsole513(false);
                        setShowConsole521(false);
                      }
                    }}
                    className="gap-1.5 text-xs bg-sky-700 text-white hover:bg-sky-800"
                  >
                    {showConsole511 ? "Hide 5.1.1 Console" : "Open 5.1.1 Schol. Console 🎓"}
                  </Button>
                </div>
              </div>
            )}

            {currentCriterion.id === 5 && showConsole511 && (
              <ScholarshipsConsole onEvidenceUpdated={loadData} />
            )}

            {/* Special Integration: Metric 5.1.2 Skill Enhancement Console */}
            {currentCriterion.id === 5 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 backdrop-blur-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-amber-500/40 text-amber-600 dark:text-amber-400">
                      Metric 5.1.2
                    </Badge>
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> 12 Programmes (1,860 Students Benefited)
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-foreground">
                    Capacity Building & Skills Development Console (5.1.2)
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-2xl">
                    Full 4-domain coverage: Soft Skills, 60-seat Language Lab, Yoga/Wellness, and ICT computing bootcamps with verified event logs.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={showConsole512 ? "secondary" : "default"}
                    onClick={() => {
                      setShowConsole512(!showConsole512);
                      if (!showConsole512) {
                        setShowConsole511(false);
                        setShowConsole513(false);
                        setShowConsole521(false);
                      }
                    }}
                    className="gap-1.5 text-xs bg-amber-600 text-white hover:bg-amber-700"
                  >
                    {showConsole512 ? "Hide 5.1.2 Console" : "Open 5.1.2 Skills Console ✨"}
                  </Button>
                </div>
              </div>
            )}

            {currentCriterion.id === 5 && showConsole512 && (
              <SkillEnhancementConsole onEvidenceUpdated={loadData} />
            )}

            {/* Special Integration: Metric 5.1.3 Career Guidance Console */}
            {currentCriterion.id === 5 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 backdrop-blur-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-rose-500/40 text-rose-600 dark:text-rose-400">
                      Metric 5.1.3
                    </Badge>
                    <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> 640 Trained (86 Qualified, AIR 142)
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-foreground">
                    Competitive Exams Guidance & Counseling Console (5.1.3)
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-2xl">
                    Specialized mentoring for GATE, CAT/XAT, GRE/TOEFL, and UPSC Civil Services with authenticated student qualifiers hall of fame.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={showConsole513 ? "secondary" : "default"}
                    onClick={() => {
                      setShowConsole513(!showConsole513);
                      if (!showConsole513) {
                        setShowConsole511(false);
                        setShowConsole512(false);
                        setShowConsole521(false);
                      }
                    }}
                    className="gap-1.5 text-xs bg-rose-700 text-white hover:bg-rose-800"
                  >
                    {showConsole513 ? "Hide 5.1.3 Console" : "Open 5.1.3 Career Console 🧭"}
                  </Button>
                </div>
              </div>
            )}

            {currentCriterion.id === 5 && showConsole513 && (
              <CareerGuidanceConsole onEvidenceUpdated={loadData} />
            )}

            {/* Special Integration: Metric 5.2.1 Student Progression Console */}
            {currentCriterion.id === 5 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-emerald-500/40 text-emerald-600 dark:text-emerald-400">
                      Metric 5.2.1
                    </Badge>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> 428 Offers (76.4% Progression)
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-foreground">
                    Placements & Higher Education Progression Console (5.2.1)
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-2xl">
                    428 campus placement selections across 38 recruiters (highest CTC ₹14.50 LPA) and 86 higher study admits to IITs, NITs, and overseas universities.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={showConsole521 ? "secondary" : "default"}
                    onClick={() => {
                      setShowConsole521(!showConsole521);
                      if (!showConsole521) {
                        setShowConsole511(false);
                        setShowConsole512(false);
                        setShowConsole513(false);
                        setShowConsole541(false);
                      }
                    }}
                    className="gap-1.5 text-xs bg-emerald-700 text-white hover:bg-emerald-800"
                  >
                    {showConsole521 ? "Hide 5.2.1 Console" : "Open 5.2.1 Placements Console 💼"}
                  </Button>
                </div>
              </div>
            )}

            {currentCriterion.id === 5 && showConsole521 && (
              <StudentProgressionConsole onEvidenceUpdated={loadData} />
            )}

            {/* Special Integration: Metric 5.4.1 Alumni Association Console */}
            {currentCriterion.id === 5 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 backdrop-blur-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-blue-500/40 text-blue-600 dark:text-blue-400">
                      Metric 5.4.1
                    </Badge>
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> Societies Act XXI Registered | ₹24.50L Mobilized
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-foreground">
                    Alumni Association & Chapter Activities Console (5.4.1)
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-2xl">
                    EduPlatform Alumni Association (Regn No. 4412/2014-15) with 4,850 alumni, 5 active global/regional chapters, and ₹24.50 Lakhs in annual financial/in-kind contributions.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={showConsole541 ? "secondary" : "default"}
                    onClick={() => {
                      setShowConsole541(!showConsole541);
                      if (!showConsole541) {
                        setShowConsole511(false);
                        setShowConsole512(false);
                        setShowConsole513(false);
                        setShowConsole521(false);
                      }
                    }}
                    className="gap-1.5 text-xs bg-blue-700 text-white hover:bg-blue-800"
                  >
                    {showConsole541 ? "Hide 5.4.1 Console" : "Open 5.4.1 Alumni Console 🤝"}
                  </Button>
                </div>
              </div>
            )}

            {currentCriterion.id === 5 && showConsole541 && (
              <AlumniAssociationConsole onEvidenceUpdated={loadData} />
            )}

            {/* Special Integration: Metric 6.1.1 Strategic Plan Console */}
            {currentCriterion.id === 6 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 backdrop-blur-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-blue-500/40 text-blue-600 dark:text-blue-400">
                      Metric 6.1.1
                    </Badge>
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> 10-Year Plan (2020-2030) | 24 Decentralized Bodies
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-foreground">
                    Strategic Planning & Governance Deployment Console (6.1.1)
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-2xl">
                    Institutional vision, 10-year Perspective Plan (2020-2030), committee organogram, and decentralized academic bodies with student representation.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={showConsole611 ? "secondary" : "default"}
                    onClick={() => {
                      setShowConsole611(!showConsole611);
                      if (!showConsole611) {
                        setShowConsole622(false);
                        setShowConsole631(false);
                        setShowConsole641(false);
                      }
                    }}
                    className="gap-1.5 text-xs bg-blue-700 text-white hover:bg-blue-800"
                  >
                    {showConsole611 ? "Hide 6.1.1 Console" : "Open 6.1.1 Strategy Console 🧭"}
                  </Button>
                </div>
              </div>
            )}

            {currentCriterion.id === 6 && showConsole611 && (
              <StrategicPlanConsole onEvidenceUpdated={loadData} />
            )}

            {/* Special Integration: Metric 6.2.2 E-Governance Console */}
            {currentCriterion.id === 6 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/5 backdrop-blur-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-indigo-500/40 text-indigo-600 dark:text-indigo-400">
                      Metric 6.2.2
                    </Badge>
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> 4 of 4 Domains Operational (100% Digitized)
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-foreground">
                    E-Governance Across Operational Domains Console (6.2.2)
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-2xl">
                    Administration (HRMS), Finance & Accounts (SmartFee/Tally), Student Admission, and Examination fully digitized with CERT-In security audits.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={showConsole622 ? "secondary" : "default"}
                    onClick={() => {
                      setShowConsole622(!showConsole622);
                      if (!showConsole622) {
                        setShowConsole611(false);
                        setShowConsole631(false);
                        setShowConsole641(false);
                      }
                    }}
                    className="gap-1.5 text-xs bg-indigo-700 text-white hover:bg-indigo-800"
                  >
                    {showConsole622 ? "Hide 6.2.2 Console" : "Open 6.2.2 ERP Console 💻"}
                  </Button>
                </div>
              </div>
            )}

            {currentCriterion.id === 6 && showConsole622 && (
              <EGovernanceConsole onEvidenceUpdated={loadData} />
            )}

            {/* Special Integration: Metric 6.3.1 Faculty Empowerment Console */}
            {currentCriterion.id === 6 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-emerald-500/40 text-emerald-600 dark:text-emerald-400">
                      Metric 6.3.1
                    </Badge>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> ₹18.50L Seed Grants | ₹8.20L Travel | 135 Appraisals
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-foreground">
                    Staff Development & Institutional Seed Grants Console (6.3.1)
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-2xl">
                    Institutional research seed money grants (14 faculty), international conference travel sponsorships (48 faculty), and PBAS appraisals.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={showConsole631 ? "secondary" : "default"}
                    onClick={() => {
                      setShowConsole631(!showConsole631);
                      if (!showConsole631) {
                        setShowConsole611(false);
                        setShowConsole622(false);
                        setShowConsole641(false);
                      }
                    }}
                    className="gap-1.5 text-xs bg-emerald-700 text-white hover:bg-emerald-800"
                  >
                    {showConsole631 ? "Hide 6.3.1 Console" : "Open 6.3.1 Faculty Console 🎓"}
                  </Button>
                </div>
              </div>
            )}

            {currentCriterion.id === 6 && showConsole631 && (
              <FacultyEmpowermentConsole onEvidenceUpdated={loadData} />
            )}

            {/* Special Integration: Metric 6.4.1 Financial Audits Console */}
            {currentCriterion.id === 6 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-blue-600/30 bg-blue-600/5 backdrop-blur-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-blue-600/40 text-blue-700 dark:text-blue-400">
                      Metric 6.4.1
                    </Badge>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> CA Certified Balance Sheet (UDIN Verified) | 94.13% Spent
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-foreground">
                    Budget Allocation, Utilization & Audits Console (6.4.1)
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-2xl">
                    Internal & external statutory audits, clean unqualified opinions, CA certified balance sheets with verified UDIN, and transparent budget utilization.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={showConsole641 ? "secondary" : "default"}
                    onClick={() => {
                      setShowConsole641(!showConsole641);
                      if (!showConsole641) {
                        setShowConsole611(false);
                        setShowConsole622(false);
                        setShowConsole631(false);
                      }
                    }}
                    className="gap-1.5 text-xs bg-blue-700 text-white hover:bg-blue-800"
                  >
                    {showConsole641 ? "Hide 6.4.1 Console" : "Open 6.4.1 Audits Console 📊"}
                  </Button>
                </div>
              </div>
            )}

            {currentCriterion.id === 6 && showConsole641 && (
              <FinancialAuditsConsole onEvidenceUpdated={loadData} />
            )}

            {/* Special Integration: Metric 7.1.1 Gender Equity Console */}
            {currentCriterion.id === 7 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-pink-500/30 bg-pink-500/5 backdrop-blur-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-pink-500/40 text-pink-600 dark:text-pink-400">
                      Metric 7.1.1
                    </Badge>
                    <span className="text-xs font-semibold text-pink-600 dark:text-pink-400 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> 148 CCTVs | 24x7 Guards | Day Care Crèche | Grade A+
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-foreground">
                    Gender Equity Promotion & Campus Safety Facilities Console (7.1.1)
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-2xl">
                    24x7 security surveillance with 148 cameras, 'Anandghar' Day Care Crèche (18 children), girls' common rooms with incinerators, and 100% ICC redressal.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={showConsole711 ? "secondary" : "default"}
                    onClick={() => {
                      setShowConsole711(!showConsole711);
                      if (!showConsole711) {
                        setShowConsole712(false);
                        setShowConsole713(false);
                        setShowConsole717(false);
                      }
                    }}
                    className="gap-1.5 text-xs bg-pink-700 text-white hover:bg-pink-800"
                  >
                    {showConsole711 ? "Hide 7.1.1 Console" : "Open 7.1.1 Gender Console 🌸"}
                  </Button>
                </div>
              </div>
            )}

            {currentCriterion.id === 7 && showConsole711 && (
              <GenderEquityConsole onEvidenceUpdated={loadData} />
            )}

            {/* Special Integration: Metric 7.1.2 Renewable Energy Console */}
            {currentCriterion.id === 7 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 backdrop-blur-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-amber-500/40 text-amber-600 dark:text-amber-400">
                      Metric 7.1.2
                    </Badge>
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> 120 kW Solar Grid | 42.5% Power Share | 128t CO2 Saved
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-foreground">
                    Renewable Energy & Conservation Initiatives Console (7.1.2)
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-2xl">
                    120 kW rooftop solar PV grid, DISCOM wheeling-to-grid net metering bills, hostel biogas plant, and 100% LED lighting retrofitting.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={showConsole712 ? "secondary" : "default"}
                    onClick={() => {
                      setShowConsole712(!showConsole712);
                      if (!showConsole712) {
                        setShowConsole711(false);
                        setShowConsole713(false);
                        setShowConsole717(false);
                      }
                    }}
                    className="gap-1.5 text-xs bg-amber-700 text-white hover:bg-amber-800"
                  >
                    {showConsole712 ? "Hide 7.1.2 Console" : "Open 7.1.2 Solar Console ☀️"}
                  </Button>
                </div>
              </div>
            )}

            {currentCriterion.id === 7 && showConsole712 && (
              <RenewableEnergyConsole onEvidenceUpdated={loadData} />
            )}

            {/* Special Integration: Metric 7.1.3 Waste Management Console */}
            {currentCriterion.id === 7 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-teal-500/30 bg-teal-500/5 backdrop-blur-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-teal-500/40 text-teal-600 dark:text-teal-400">
                      Metric 7.1.3
                    </Badge>
                    <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> 4.5 Lakh L RWH | 100 KLD STP | ISO 14001:2015 Platinum
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-foreground">
                    Waste Management & Water Conservation Console (7.1.3)
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-2xl">
                    4.5 Lakh Litres rainwater harvesting capacity, 100 KLD MBBR sewage treatment plant, vermicomposting, and certified e-waste buyback protocols.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={showConsole713 ? "secondary" : "default"}
                    onClick={() => {
                      setShowConsole713(!showConsole713);
                      if (!showConsole713) {
                        setShowConsole711(false);
                        setShowConsole712(false);
                        setShowConsole717(false);
                      }
                    }}
                    className="gap-1.5 text-xs bg-teal-700 text-white hover:bg-teal-800"
                  >
                    {showConsole713 ? "Hide 7.1.3 Console" : "Open 7.1.3 Green Console 💧"}
                  </Button>
                </div>
              </div>
            )}

            {currentCriterion.id === 7 && showConsole713 && (
              <EnvironmentManagementConsole onEvidenceUpdated={loadData} />
            )}

            {/* Special Integration: Metric 7.1.7 Divyangjan Inclusion Console */}
            {currentCriterion.id === 7 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-purple-500/30 bg-purple-500/5 backdrop-blur-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-purple-500/40 text-purple-600 dark:text-purple-400">
                      Metric 7.1.7
                    </Badge>
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> 14 Ramps | 4 Braille Lifts | 850m Tactile Paths | NVDA
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-foreground">
                    Divyangjan Barrier-Free Campus Facilities Console (7.1.7)
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-2xl">
                    14 universal access ramps with handrails, 4 Braille voice lifts, 8 disabled washrooms, 850m tactile paths, and NVDA/JAWS screen-reading stations.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={showConsole717 ? "secondary" : "default"}
                    onClick={() => {
                      setShowConsole717(!showConsole717);
                      if (!showConsole717) {
                        setShowConsole711(false);
                        setShowConsole712(false);
                        setShowConsole713(false);
                      }
                    }}
                    className="gap-1.5 text-xs bg-purple-700 text-white hover:bg-purple-800"
                  >
                    {showConsole717 ? "Hide 7.1.7 Console" : "Open 7.1.7 Inclusion Console ♿"}
                  </Button>
                </div>
              </div>
            )}

            {currentCriterion.id === 7 && showConsole717 && (
              <DivyangjanFacilitiesConsole onEvidenceUpdated={loadData} />
            )}

            {/* Key Indicators & Metric Tables */}
            <div className="space-y-6">
              {currentCriterion.keyIndicators.map((ki) => {
                const filteredMetrics = ki.metrics.filter((m) =>
                  searchQuery
                    ? m.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      m.description.toLowerCase().includes(searchQuery.toLowerCase())
                    : true
                );

                if (searchQuery && filteredMetrics.length === 0) return null;

                return (
                  <Card key={ki.id} className="border-border/60 shadow-xs overflow-hidden">
                    <CardHeader className="bg-muted/20 border-b border-border/50 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-bold text-sm text-primary shrink-0">{ki.code}</span>
                          <CardTitle className="text-sm sm:text-base font-bold text-foreground truncate">
                            {ki.name}
                          </CardTitle>
                        </div>
                        <Badge variant="outline" className="text-xs shrink-0">
                          Weightage: {ki.weightage}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      {/* Mobile Card View (< md) */}
                      <div className="md:hidden divide-y divide-border/60">
                        {filteredMetrics.map((m) => (
                          <div key={m.id} className="p-3.5 space-y-2.5">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-xs text-foreground">{m.code}</span>
                                  <Badge
                                    variant="outline"
                                    className={`text-[9px] uppercase px-1 py-0 ${
                                      m.type === "quantitative"
                                        ? "border-blue-500/30 text-blue-600 dark:text-blue-400"
                                        : "border-purple-500/30 text-purple-600 dark:text-purple-400"
                                    }`}
                                  >
                                    {m.type}
                                  </Badge>
                                </div>
                                <p className="font-semibold text-xs text-foreground mt-1">{m.name}</p>
                              </div>
                              <Badge
                                variant="secondary"
                                className={`text-[10px] shrink-0 ${
                                  m.status === "Completed"
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                }`}
                              >
                                {m.status}
                              </Badge>
                            </div>

                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {m.description}
                            </p>

                            {m.benchmark && (
                              <p className="text-[11px] text-primary/90 font-medium">
                                Benchmark: {m.benchmark}
                              </p>
                            )}

                            <div className="rounded bg-muted/40 p-2 text-xs">
                              <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                                Current Value / Summary
                              </span>
                              <span className="text-foreground font-medium text-xs mt-0.5 block">
                                {m.type === "quantitative"
                                  ? m.quantitativeValue || "Pending Data"
                                  : m.qualitativeText || "Drafting summary..."}
                              </span>
                            </div>

                            <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40 flex-wrap">
                              <div className="flex items-center gap-1.5">
                                <Button asChild size="xs" variant="outline" className="gap-1 text-xs">
                                  <Link to={`/admin/naac/evidence?criterion=${currentCriterion.id}`}>
                                    <FolderOpen className="size-3" />
                                    <span>{m.evidenceCount} Files</span>
                                  </Link>
                                </Button>
                                {m.code === "1.1.1" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole111(true)}
                                    className="gap-1 text-[11px] bg-primary/10 text-primary border border-primary/20"
                                  >
                                    1.1.1 Console
                                  </Button>
                                )}
                                {m.code === "1.1.2" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole112(true)}
                                    className="gap-1 text-[11px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                                  >
                                    1.1.2 Revision
                                  </Button>
                                )}
                                {m.code === "1.2.1" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole121(true)}
                                    className="gap-1 text-[11px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                                  >
                                    1.2.1 CBCS
                                  </Button>
                                )}
                                {m.code === "1.2.2" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole122(true)}
                                    className="gap-1 text-[11px] bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20"
                                  >
                                    1.2.2 VAC
                                  </Button>
                                )}
                                {m.code === "1.3.1" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole131(true)}
                                    className="gap-1 text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                  >
                                    1.3.1 Crosscutting
                                  </Button>
                                )}
                                {m.code === "1.4.1" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole141(true)}
                                    className="gap-1 text-[11px] bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20"
                                  >
                                    1.4.1 Feedback
                                  </Button>
                                )}
                                {m.code === "2.1.1" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole211(true)}
                                    className="gap-1 text-[11px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                                  >
                                    2.1.1 Enrolment
                                  </Button>
                                )}
                                {m.code === "2.2.1" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole221(true)}
                                    className="gap-1 text-[11px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                                  >
                                    2.2.1 Faculty Ratio
                                  </Button>
                                )}
                                {m.code === "2.3.1" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole231(true)}
                                    className="gap-1 text-[11px] bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20"
                                  >
                                    2.3.1 Pedagogy
                                  </Button>
                                )}
                                {m.code === "2.3.2" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole232(true)}
                                    className="gap-1 text-[11px] bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20"
                                  >
                                    2.3.2 ICT & LMS
                                  </Button>
                                )}
                                {m.code === "2.5.1" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole251(true)}
                                    className="gap-1 text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                  >
                                    2.5.1 CIE Console
                                  </Button>
                                )}
                                {m.code === "2.6.3" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole263(true)}
                                    className="gap-1 text-[11px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                                  >
                                    2.6.3 Pass %
                                  </Button>
                                )}
                                {m.code === "2.7.1" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole271(true)}
                                    className="gap-1 text-[11px] bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20"
                                  >
                                    2.7.1 SSS
                                  </Button>
                                )}
                                {m.code === "3.1.1" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole311(true)}
                                    className="gap-1 text-[11px] bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                                  >
                                    3.1.1 Grants
                                  </Button>
                                )}
                                {m.code === "3.2.1" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole321(true)}
                                    className="gap-1 text-[11px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                  >
                                    3.2.1 Innovation
                                  </Button>
                                )}
                                {m.code === "3.3.1" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole331(true)}
                                    className="gap-1 text-[11px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                                  >
                                    3.3.1 Scopus
                                  </Button>
                                )}
                                {m.code === "3.3.2" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole332(true)}
                                    className="gap-1 text-[11px] bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20"
                                  >
                                    3.3.2 Books
                                  </Button>
                                )}
                                {m.code === "3.5.1" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole351(true)}
                                    className="gap-1 text-[11px] bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20"
                                  >
                                    3.5.1 Consultancy
                                  </Button>
                                )}
                                {m.code === "3.6.1" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole361(true)}
                                    className="gap-1 text-[11px] bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                                  >
                                    3.6.1 Outreach
                                  </Button>
                                )}
                                {m.code === "3.7.1" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole371(true)}
                                    className="gap-1 text-[11px] bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20"
                                  >
                                    3.7.1 MoUs
                                  </Button>
                                )}
                                {m.code === "4.3.1" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole431(true)}
                                    className="gap-1 text-[11px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                                  >
                                    4.3.1 IT & Wi-Fi
                                  </Button>
                                )}
                                {m.code === "4.4.1" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole441(true)}
                                    className="gap-1 text-[11px] bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20"
                                  >
                                    4.4.1 Maint.
                                  </Button>
                                )}
                                {m.code === "5.1.1" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole511(true)}
                                    className="gap-1 text-[11px] bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20"
                                  >
                                    5.1.1 Schol.
                                  </Button>
                                )}
                                {m.code === "5.1.2" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole512(true)}
                                    className="gap-1 text-[11px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                  >
                                    5.1.2 Skills
                                  </Button>
                                )}
                                {m.code === "5.1.3" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole513(true)}
                                    className="gap-1 text-[11px] bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                                  >
                                    5.1.3 Career
                                  </Button>
                                )}
                                {m.code === "5.2.1" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole521(true)}
                                    className="gap-1 text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                  >
                                    5.2.1 Placements
                                  </Button>
                                )}
                                {m.code === "5.4.1" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole541(true)}
                                    className="gap-1 text-[11px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                                  >
                                    5.4.1 Alumni
                                  </Button>
                                )}
                                {m.code === "6.1.1" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole611(true)}
                                    className="gap-1 text-[11px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                                  >
                                    6.1.1 Strategy
                                  </Button>
                                )}
                                {m.code === "6.2.2" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole622(true)}
                                    className="gap-1 text-[11px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                                  >
                                    6.2.2 ERP
                                  </Button>
                                )}
                                {m.code === "6.3.1" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole631(true)}
                                    className="gap-1 text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                  >
                                    6.3.1 Faculty
                                  </Button>
                                )}
                                {m.code === "6.4.1" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole641(true)}
                                    className="gap-1 text-[11px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                                  >
                                    6.4.1 Audits
                                  </Button>
                                )}
                                {m.code === "7.1.1" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole711(true)}
                                    className="gap-1 text-[11px] bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20"
                                  >
                                    7.1.1 Gender
                                  </Button>
                                )}
                                {m.code === "7.1.2" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole712(true)}
                                    className="gap-1 text-[11px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                  >
                                    7.1.2 Solar
                                  </Button>
                                )}
                                {m.code === "7.1.3" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole713(true)}
                                    className="gap-1 text-[11px] bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20"
                                  >
                                    7.1.3 Green
                                  </Button>
                                )}
                                {m.code === "7.1.7" && (
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={() => setShowConsole717(true)}
                                    className="gap-1 text-[11px] bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                                  >
                                    7.1.7 Inclusion
                                  </Button>
                                )}
                              </div>

                              <Button size="xs" variant="ghost" onClick={() => openMetricEditor(m)} className="gap-1">
                                <Edit2 className="size-3" />
                                <span>Edit Value</span>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Desktop Data Table (md+) */}
                      <div className="hidden md:block">
                        <ResponsiveTableContainer>
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-muted/10">
                                <TableHead className="w-20 font-semibold">Metric</TableHead>
                                <TableHead className="font-semibold min-w-[260px]">Description & Benchmark</TableHead>
                                <TableHead className="w-28 font-semibold">Type</TableHead>
                                <TableHead className="w-40 font-semibold">Current Value / Status</TableHead>
                                <TableHead className="w-28 font-semibold text-center">Evidence</TableHead>
                                <TableHead className="w-24 font-semibold text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredMetrics.map((m) => (
                                <TableRow key={m.id} className="hover:bg-muted/20">
                                  <TableCell className="font-bold text-xs text-foreground align-top">
                                    {m.code}
                                    <div className="text-[10px] text-muted-foreground font-normal mt-0.5">
                                      Wt: {m.weightage}
                                    </div>
                                  </TableCell>
                                  <TableCell className="align-top">
                                    <p className="font-semibold text-xs sm:text-sm text-foreground">{m.name}</p>
                                    <p className="mt-1 text-xs text-muted-foreground leading-normal line-clamp-2">
                                      {m.description}
                                    </p>
                                    {m.benchmark && (
                                      <p className="mt-1 text-[11px] text-primary/90 font-medium">
                                        Benchmark: {m.benchmark}
                                      </p>
                                    )}
                                  </TableCell>
                                  <TableCell className="align-top">
                                    <Badge
                                      variant="outline"
                                      className={`text-[10px] uppercase font-medium ${
                                        m.type === "quantitative"
                                          ? "border-blue-500/30 text-blue-600 dark:text-blue-400"
                                          : "border-purple-500/30 text-purple-600 dark:text-purple-400"
                                      }`}
                                    >
                                      {m.type}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="align-top">
                                    {m.type === "quantitative" ? (
                                      <div>
                                        <span className="font-bold text-xs text-foreground">
                                          {m.quantitativeValue || "Pending"}
                                        </span>
                                        <div className="mt-1">
                                          <Badge
                                            variant="secondary"
                                            className={`text-[10px] ${
                                              m.status === "Completed"
                                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                            }`}
                                          >
                                            {m.status}
                                          </Badge>
                                        </div>
                                      </div>
                                    ) : (
                                      <div>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                          {m.qualitativeText || "Drafting summary..."}
                                        </p>
                                        <Badge
                                          variant="secondary"
                                          className="text-[10px] mt-1 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                        >
                                          {m.status}
                                        </Badge>
                                      </div>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-center align-top">
                                    <Button asChild size="xs" variant="outline" className="gap-1 text-xs">
                                      <Link to={`/admin/naac/evidence?criterion=${currentCriterion.id}`}>
                                        <FolderOpen className="size-3" />
                                        <span>{m.evidenceCount} Files</span>
                                      </Link>
                                    </Button>
                                  </TableCell>
                                  <TableCell className="text-right align-top">
                                    <div className="flex items-center justify-end gap-1">
                                      {m.code === "1.1.1" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole111(true)}
                                          className="gap-1 text-xs bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30"
                                          title="Open 1.1.1 Curriculum Planning Console"
                                        >
                                          <span>1.1.1 Console</span>
                                        </Button>
                                      )}
                                      {m.code === "1.1.2" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole112(true)}
                                          className="gap-1 text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 border border-blue-500/30"
                                          title="Open 1.1.2 Programme Revision Console"
                                        >
                                          <span>1.1.2 Revision</span>
                                        </Button>
                                      )}
                                      {m.code === "1.2.1" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole121(true)}
                                          className="gap-1 text-xs bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/30"
                                          title="Open 1.2.1 CBCS & Academic Flexibility Console"
                                        >
                                          <span>1.2.1 CBCS</span>
                                        </Button>
                                      )}
                                      {m.code === "1.2.2" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole122(true)}
                                          className="gap-1 text-xs bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/20 border border-teal-500/30"
                                          title="Open 1.2.2 Certificate & Value-Added Courses Console"
                                        >
                                          <span>1.2.2 VAC</span>
                                        </Button>
                                      )}
                                      {m.code === "1.3.1" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole131(true)}
                                          className="gap-1 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30"
                                          title="Open 1.3.1 Crosscutting Issues Console"
                                        >
                                          <span>1.3.1 Crosscutting</span>
                                        </Button>
                                      )}
                                      {m.code === "1.4.1" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole141(true)}
                                          className="gap-1 text-xs bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 border border-sky-500/30"
                                          title="Open 1.4.1 Stakeholder Feedback Console"
                                        >
                                          <span>1.4.1 Feedback</span>
                                        </Button>
                                      )}
                                      {m.code === "2.1.1" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole211(true)}
                                          className="gap-1 text-xs bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/30"
                                          title="Open 2.1.1 Student Enrolment Console"
                                        >
                                          <span>2.1.1 Enrolment</span>
                                        </Button>
                                      )}
                                      {m.code === "2.2.1" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole221(true)}
                                          className="gap-1 text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 border border-blue-500/30"
                                          title="Open 2.2.1 Student-Full Time Teacher Ratio Console"
                                        >
                                          <span>2.2.1 Faculty Ratio</span>
                                        </Button>
                                      )}
                                      {m.code === "2.3.1" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole231(true)}
                                          className="gap-1 text-xs bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/20 border border-teal-500/30"
                                          title="Open 2.3.1 Student-Centric Pedagogy Console"
                                        >
                                          <span>2.3.1 Pedagogy</span>
                                        </Button>
                                      )}
                                      {m.code === "2.3.2" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole232(true)}
                                          className="gap-1 text-xs bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30"
                                          title="Open 2.3.2 ICT Classrooms & LMS Utilization Console"
                                        >
                                          <span>2.3.2 ICT & LMS</span>
                                        </Button>
                                      )}
                                      {m.code === "2.5.1" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole251(true)}
                                          className="gap-1 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30"
                                          title="Open 2.5.1 Continuous Internal Evaluation (CIE) Console"
                                        >
                                          <span>2.5.1 CIE</span>
                                        </Button>
                                      )}
                                      {m.code === "2.6.3" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole263(true)}
                                          className="gap-1 text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 border border-blue-500/30"
                                          title="Open 2.6.3 Student Pass Percentage Console"
                                        >
                                          <span>2.6.3 Pass %</span>
                                        </Button>
                                      )}
                                      {m.code === "2.7.1" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole271(true)}
                                          className="gap-1 text-xs bg-pink-500/10 text-pink-600 dark:text-pink-400 hover:bg-pink-500/20 border border-pink-500/30"
                                          title="Open 2.7.1 Online Student Satisfaction Survey Console"
                                        >
                                          <span>2.7.1 SSS</span>
                                        </Button>
                                      )}
                                      {m.code === "3.1.1" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole311(true)}
                                          className="gap-1 text-xs bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 border border-purple-500/30"
                                          title="Open 3.1.1 Research Grants Console"
                                        >
                                          <span>3.1.1 Grants</span>
                                        </Button>
                                      )}
                                      {m.code === "3.2.1" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole321(true)}
                                          className="gap-1 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/30"
                                          title="Open 3.2.1 Innovation & Patents Console"
                                        >
                                          <span>3.2.1 Innovation</span>
                                        </Button>
                                      )}
                                      {m.code === "3.3.1" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole331(true)}
                                          className="gap-1 text-xs bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/30"
                                          title="Open 3.3.1 Scopus Publications Master Directory"
                                        >
                                          <span>3.3.1 Scopus</span>
                                        </Button>
                                      )}
                                      {m.code === "3.3.2" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole332(true)}
                                          className="gap-1 text-xs bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/20 border border-teal-500/30"
                                          title="Open 3.3.2 Books & Proceedings Directory"
                                        >
                                          <span>3.3.2 Books</span>
                                        </Button>
                                      )}
                                      {m.code === "3.5.1" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole351(true)}
                                          className="gap-1 text-xs bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30"
                                          title="Open 3.5.1 Consultancy & Corporate Revenue Console"
                                        >
                                          <span>3.5.1 Consultancy</span>
                                        </Button>
                                      )}
                                      {m.code === "3.6.1" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole361(true)}
                                          className="gap-1 text-xs bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/30"
                                          title="Open 3.6.1 Community Outreach Compendium"
                                        >
                                          <span>3.6.1 Outreach</span>
                                        </Button>
                                      )}
                                      {m.code === "3.7.1" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole371(true)}
                                          className="gap-1 text-xs bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 border border-sky-500/30"
                                          title="Open 3.7.1 Functional MoUs Console"
                                        >
                                          <span>3.7.1 MoUs</span>
                                        </Button>
                                      )}
                                      {m.code === "4.3.1" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole431(true)}
                                          className="gap-1 text-xs bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/30"
                                          title="Open 4.3.1 IT & Campus Wi-Fi Console"
                                        >
                                          <span>4.3.1 IT & Wi-Fi</span>
                                        </Button>
                                      )}
                                      {m.code === "4.4.1" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole441(true)}
                                          className="gap-1 text-xs bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/20 border border-teal-500/30"
                                          title="Open 4.4.1 Infrastructure Maintenance Console"
                                        >
                                          <span>4.4.1 Maint.</span>
                                        </Button>
                                      )}
                                      {m.code === "5.1.1" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole511(true)}
                                          className="gap-1 text-xs bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 border border-sky-500/30"
                                          title="Open 5.1.1 Scholarships Console"
                                        >
                                          <span>5.1.1 Schol.</span>
                                        </Button>
                                      )}
                                      {m.code === "5.1.2" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole512(true)}
                                          className="gap-1 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/30"
                                          title="Open 5.1.2 Skill Enhancement Console"
                                        >
                                          <span>5.1.2 Skills</span>
                                        </Button>
                                      )}
                                      {m.code === "5.1.3" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole513(true)}
                                          className="gap-1 text-xs bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/30"
                                          title="Open 5.1.3 Competitive Exams Console"
                                        >
                                          <span>5.1.3 Career</span>
                                        </Button>
                                      )}
                                      {m.code === "5.2.1" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole521(true)}
                                          className="gap-1 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30"
                                          title="Open 5.2.1 Placements & Progression Console"
                                        >
                                          <span>5.2.1 Placements</span>
                                        </Button>
                                      )}
                                      {m.code === "5.4.1" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole541(true)}
                                          className="gap-1 text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 border border-blue-500/30"
                                          title="Open 5.4.1 Alumni Association Console"
                                        >
                                          <span>5.4.1 Alumni</span>
                                        </Button>
                                      )}
                                      {m.code === "6.1.1" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole611(true)}
                                          className="gap-1 text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 border border-blue-500/30"
                                          title="Open 6.1.1 Strategic Plan Console"
                                        >
                                          <span>6.1.1 Strategy</span>
                                        </Button>
                                      )}
                                      {m.code === "6.2.2" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole622(true)}
                                          className="gap-1 text-xs bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/30"
                                          title="Open 6.2.2 E-Governance Console"
                                        >
                                          <span>6.2.2 ERP</span>
                                        </Button>
                                      )}
                                      {m.code === "6.3.1" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole631(true)}
                                          className="gap-1 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30"
                                          title="Open 6.3.1 Faculty Empowerment Console"
                                        >
                                          <span>6.3.1 Faculty</span>
                                        </Button>
                                      )}
                                      {m.code === "6.4.1" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole641(true)}
                                          className="gap-1 text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 border border-blue-500/30"
                                          title="Open 6.4.1 Financial Audits Console"
                                        >
                                          <span>6.4.1 Audits</span>
                                        </Button>
                                      )}
                                      {m.code === "7.1.1" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole711(true)}
                                          className="gap-1 text-xs bg-pink-500/10 text-pink-600 dark:text-pink-400 hover:bg-pink-500/20 border border-pink-500/30"
                                          title="Open 7.1.1 Gender Equity Console"
                                        >
                                          <span>7.1.1 Gender</span>
                                        </Button>
                                      )}
                                      {m.code === "7.1.2" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole712(true)}
                                          className="gap-1 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/30"
                                          title="Open 7.1.2 Renewable Energy Console"
                                        >
                                          <span>7.1.2 Solar</span>
                                        </Button>
                                      )}
                                      {m.code === "7.1.3" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole713(true)}
                                          className="gap-1 text-xs bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/20 border border-teal-500/30"
                                          title="Open 7.1.3 Waste Management Console"
                                        >
                                          <span>7.1.3 Green</span>
                                        </Button>
                                      )}
                                      {m.code === "7.1.7" && (
                                        <Button
                                          size="xs"
                                          variant="secondary"
                                          onClick={() => setShowConsole717(true)}
                                          className="gap-1 text-xs bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 border border-purple-500/30"
                                          title="Open 7.1.7 Divyangjan Facilities Console"
                                        >
                                          <span>7.1.7 Inclusion</span>
                                        </Button>
                                      )}
                                      <Button size="xs" variant="ghost" onClick={() => openMetricEditor(m)} className="gap-1">
                                        <Edit2 className="size-3" />
                                        <span>Edit</span>
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </ResponsiveTableContainer>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Metric Value Editor Dialog */}
      {editingMetric && (
        <Dialog open={!!editingMetric} onOpenChange={() => setEditingMetric(null)}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="font-bold text-primary">{editingMetric.code}</span>
                <span className="truncate">{editingMetric.name}</span>
              </DialogTitle>
              <DialogDescription>
                Update the official SSR assessment value and supporting verification status.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveMetric} className="space-y-4 pt-2">
              <div className="rounded-lg bg-muted/40 p-3 text-xs space-y-1">
                <p className="text-muted-foreground">{editingMetric.description}</p>
                {editingMetric.benchmark && (
                  <p className="font-semibold text-primary">Benchmark: {editingMetric.benchmark}</p>
                )}
              </div>

              <div>
                <Label htmlFor="val">
                  {editingMetric.type === "quantitative" ? "Quantitative Metric Value" : "Qualitative Executive Narrative"}
                </Label>
                {editingMetric.type === "quantitative" ? (
                  <Input
                    id="val"
                    value={metricValue}
                    onChange={(e) => setMetricValue(e.target.value)}
                    placeholder="e.g. 94.6% or 16:1 or 88 Faculty"
                    required
                  />
                ) : (
                  <Textarea
                    id="val"
                    rows={4}
                    value={metricValue}
                    onChange={(e) => setMetricValue(e.target.value)}
                    placeholder="Provide detailed narrative up to 500 words for qualitative SSR review..."
                    required
                  />
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="status">Assessment Status</Label>
                  <Select value={metricStatus} onValueChange={(v) => setMetricStatus(v as NaacMetric["status"])}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Under Review">Under Review</SelectItem>
                      <SelectItem value="Completed">Completed & Verified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="remarks">Internal Coordinator Notes</Label>
                  <Input
                    id="remarks"
                    value={metricRemarks}
                    onChange={(e) => setMetricRemarks(e.target.value)}
                    placeholder="e.g. Verified with Examination records"
                  />
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={() => setEditingMetric(null)}>
                  Cancel
                </Button>
                <Button type="submit">Save Assessment</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
