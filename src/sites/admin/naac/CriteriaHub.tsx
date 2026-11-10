import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FileText,
  Search,
  FolderOpen,
  Edit2,
  CheckCircle2,
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
    setMetricValue(m.type === "quantitative" ? m.quantitativeValue || "" : m.qualitativeText || "");
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
                  onClick={() => setShowConsole111(!showConsole111)}
                  className="gap-1.5 text-xs shrink-0"
                >
                  {showConsole111 ? "Hide 1.1.1 Console" : "Open 1.1.1 Console & Evidences 📋"}
                </Button>
              </div>
            )}

            {currentCriterion.id === 1 && showConsole111 && (
              <CurriculumPlanningConsole onEvidenceUpdated={loadData} />
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
