import { useState, useEffect } from "react";
import {
  Users,
  Star,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveTableContainer } from "@/components/admin/ResponsiveTableContainer";
import {
  getFeedbackBundle,
  submitFeedbackRecord,
  type FeedbackBundle,
} from "@/features/naac/naacService";
import type { StakeholderType } from "@/types";

export default function FeedbackPage() {
  const [data, setData] = useState<FeedbackBundle | null>(null);
  const [, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("Student");

  const [modalOpen, setModalOpen] = useState(false);
  const [respName, setRespName] = useState("");
  const [respDept, setRespDept] = useState("Computer Science");
  const [currRating, setCurrRating] = useState("5");
  const [teachRating, setTeachRating] = useState("4");
  const [infraRating, setInfraRating] = useState("5");
  const [resRating, setResRating] = useState("4");
  const [respSug, setRespSug] = useState("");

  const loadData = () => {
    setLoading(true);
    getFeedbackBundle()
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitFeedbackRecord({
      stakeholder: activeTab as StakeholderType,
      academicYear: "2025-26",
      department: respDept,
      respondentName: respName || undefined,
      curriculumRating: Number(currRating),
      teachingRating: Number(teachRating),
      infrastructureRating: Number(infraRating),
      resourcesRating: Number(resRating),
      overallSatisfaction: (Number(currRating) + Number(teachRating) + Number(infraRating) + Number(resRating)) / 4,
      suggestions: respSug,
    });
    setModalOpen(false);
    loadData();
  };

  if (!data) {
    return <div className="p-6">Loading stakeholder feedback...</div>;
  }

  const currentSummary = data.summaries.find((s) => s.stakeholder === activeTab) ?? data.summaries[0];
  const filteredRecords = data.records.filter((r) => r.stakeholder === activeTab);

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full min-w-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Stakeholder Feedback & Analysis
            </h1>
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
              Criterion 1.4 & IQAC
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Structured 5-stakeholder feedback collection, analysis dashboards, and published Action Taken Reports (ATRs).
          </p>
        </div>

        <Button onClick={() => setModalOpen(true)} className="gap-1.5 self-start sm:self-auto shrink-0">
          <Plus className="size-4" />
          <span>Record {activeTab} Response</span>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="overflow-x-auto pb-1 scrollbar-none">
          <TabsList className="bg-muted/60 p-1 flex-nowrap sm:flex-wrap justify-start min-w-max">
            {data.summaries.map((s) => (
              <TabsTrigger
                key={s.stakeholder}
                value={s.stakeholder}
                className="gap-1.5 text-xs sm:text-sm whitespace-nowrap"
              >
                <span>{s.stakeholder}s</span>
                <Badge variant="secondary" className="text-[10px] ml-1 px-1 py-0">
                  ★ {(s.averageRating ?? s.averageScore ?? 4.5).toFixed(1)}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="space-y-6">
          {/* Executive Rating Summary */}
          <Card className="border-border/60 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardDescription className="text-xs uppercase font-semibold text-primary">
                    {currentSummary.stakeholder} Satisfaction Overview · AY {currentSummary.academicYear || "2025-26"}
                  </CardDescription>
                  <CardTitle className="text-xl font-bold text-foreground">
                    Average Score: {(currentSummary.averageRating ?? currentSummary.averageScore ?? 4.5).toFixed(2)} / 5.00
                  </CardTitle>
                </div>
                <Badge className="bg-emerald-600 text-white font-medium px-3 py-1 self-start sm:self-auto">
                  {currentSummary.totalResponses} Responses Tabulated
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {currentSummary.categoryScores.map((cat, idx) => (
                  <div key={idx} className="rounded-lg border border-border/60 bg-card p-3">
                    <span className="text-xs text-muted-foreground">{cat.category}</span>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="font-bold text-sm text-foreground">{cat.score} / 5.0</span>
                      <div className="flex text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`size-3.5 ${
                              i < Math.round(cat.score) ? "fill-amber-400 text-amber-400" : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-lg bg-muted/20 border border-border/50 p-3 text-xs text-muted-foreground">
                <strong className="text-foreground">Institutional Action Taken Report (ATR): </strong>
                {currentSummary.atrSummary}
              </div>
            </CardContent>
          </Card>

          {/* Individual Feedback Responses Table & Mobile Cards */}
          <Card className="border-border/60 shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground">
                Individual Response Samples & Qualitative Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              {/* Mobile Cards for < md */}
              <div className="md:hidden space-y-3">
                {filteredRecords.map((r) => (
                  <Card key={r.id} className="border-border/70 p-3.5 shadow-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-xs sm:text-sm text-foreground">{r.respondentName || "Anonymous"}</h4>
                        <p className="text-[11px] text-muted-foreground">{r.department}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        ★ {(r.overallSatisfaction ?? 4.5).toFixed(1)} / 5
                      </Badge>
                    </div>

                    <div className="mt-2.5 grid grid-cols-3 gap-2 text-center text-xs bg-muted/20 p-2 rounded-lg border border-border/40">
                      <div>
                        <span className="text-[9px] uppercase text-muted-foreground block">Curriculum</span>
                        <span className="font-bold text-foreground text-xs">{r.curriculumRating}/5</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase text-muted-foreground block">Teaching</span>
                        <span className="font-bold text-foreground text-xs">{r.teachingRating}/5</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase text-muted-foreground block">Infra</span>
                        <span className="font-bold text-foreground text-xs">{r.infrastructureRating}/5</span>
                      </div>
                    </div>

                    {r.suggestions && (
                      <p className="mt-2 text-xs text-muted-foreground italic">
                        "{r.suggestions}"
                      </p>
                    )}

                    <div className="mt-2 text-right text-[10px] text-muted-foreground border-t border-border/40 pt-1.5">
                      Submitted on {r.date}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Desktop Table (md+) */}
              <div className="hidden md:block">
                <ResponsiveTableContainer>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40">
                        <TableHead className="font-semibold min-w-[130px]">Respondent</TableHead>
                        <TableHead className="font-semibold min-w-[130px]">Department</TableHead>
                        <TableHead className="font-semibold min-w-[90px]">Curriculum</TableHead>
                        <TableHead className="font-semibold min-w-[90px]">Teaching</TableHead>
                        <TableHead className="font-semibold min-w-[100px]">Infrastructure</TableHead>
                        <TableHead className="font-semibold min-w-[240px]">Suggestions & Feedback</TableHead>
                        <TableHead className="font-semibold min-w-[100px]">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="font-bold text-xs text-foreground">
                            {r.respondentName || "Anonymous"}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {r.department}
                          </TableCell>
                          <TableCell className="font-bold text-xs text-foreground">
                            {r.curriculumRating} / 5
                          </TableCell>
                          <TableCell className="font-bold text-xs text-foreground">
                            {r.teachingRating} / 5
                          </TableCell>
                          <TableCell className="font-bold text-xs text-foreground">
                            {r.infrastructureRating} / 5
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-sm">
                            {r.suggestions}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {r.date}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ResponsiveTableContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Record {activeTab} Feedback</DialogTitle>
            <DialogDescription>
              Submit structured stakeholder ratings on curriculum and institutional facilities.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div>
              <Label htmlFor="respName">Respondent Name (Optional)</Label>
              <Input
                id="respName"
                value={respName}
                onChange={(e) => setRespName(e.target.value)}
                placeholder="Leave blank for anonymous response"
              />
            </div>

            <div>
              <Label htmlFor="respDept">Department / Affiliation</Label>
              <Input
                id="respDept"
                value={respDept}
                onChange={(e) => setRespDept(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="currR">Curriculum (1-5)</Label>
                <Input
                  id="currR"
                  type="number"
                  min="1"
                  max="5"
                  value={currRating}
                  onChange={(e) => setCurrRating(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="teachR">Teaching (1-5)</Label>
                <Input
                  id="teachR"
                  type="number"
                  min="1"
                  max="5"
                  value={teachRating}
                  onChange={(e) => setTeachRating(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="infR">Infrastructure (1-5)</Label>
                <Input
                  id="infR"
                  type="number"
                  min="1"
                  max="5"
                  value={infraRating}
                  onChange={(e) => setInfraRating(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="resR">Resources (1-5)</Label>
                <Input
                  id="resR"
                  type="number"
                  min="1"
                  max="5"
                  value={resRating}
                  onChange={(e) => setResRating(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="respSug">Specific Suggestions / Feedback</Label>
              <Textarea
                id="respSug"
                rows={3}
                value={respSug}
                onChange={(e) => setRespSug(e.target.value)}
                placeholder="Share your thoughts on syllabus, internship support, or lab equipment..."
                required
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Feedback</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
