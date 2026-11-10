import { useState, useEffect } from "react";
import {
  Sparkles,
  CheckCircle2,
  Edit2,
  ExternalLink,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getBestPractices, updateBestPractice } from "@/features/naac/naacService";
import type { BestPracticeItem, InstitutionalDistinctivenessItem } from "@/types";

export default function BestPracticesPage() {
  const [practices, setPractices] = useState<BestPracticeItem[]>([]);
  const [distinctiveness, setDistinctiveness] = useState<InstitutionalDistinctivenessItem | null>(null);
  const [loading, setLoading] = useState(true);

  const [editPractice, setEditPractice] = useState<BestPracticeItem | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formPracticeText, setFormPracticeText] = useState("");
  const [formOutcome, setFormOutcome] = useState("");

  const loadData = () => {
    setLoading(true);
    getBestPractices()
      .then((res) => {
        setPractices(res.practices);
        setDistinctiveness(res.distinctiveness);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openEditor = (bp: BestPracticeItem) => {
    setEditPractice(bp);
    setFormPracticeText(bp.practice);
    setFormOutcome(bp.outcome);
    setEditModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPractice) return;
    await updateBestPractice(
      editPractice.id,
      {
        practice: formPracticeText,
        outcome: formOutcome,
      },
      { name: "Dr. Snigdha Mohanty", role: "IQAC Coordinator" }
    );
    setEditModalOpen(false);
    loadData();
  };

  if (loading || !distinctiveness) {
    return <div className="p-6">Loading Best Practices...</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full min-w-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Best Practices & Institutional Distinctiveness
            </h1>
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
              NAAC Criterion 7.2 & 7.3
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Formally documented institutional practices, societal impacts, and distinctive regional stewardship.
          </p>
        </div>
      </div>

      <Tabs defaultValue="bp" className="space-y-6">
        <TabsList className="bg-muted/60 p-1">
          <TabsTrigger value="bp" className="gap-1.5 text-xs sm:text-sm">
            <Sparkles className="size-3.5" />
            <span>Two Best Practices ({practices.length})</span>
          </TabsTrigger>
          <TabsTrigger value="id" className="gap-1.5 text-xs sm:text-sm">
            <Award className="size-3.5" />
            <span>Institutional Distinctiveness</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bp" className="space-y-6">
          {practices.map((bp, idx) => (
            <Card key={bp.id} className="border-border/60 shadow-xs">
              <CardHeader className="bg-muted/10 border-b border-border/40 py-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
                      {idx + 1}
                    </span>
                    <CardTitle className="text-base font-bold text-foreground">
                      {bp.title}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{bp.academicYear}</Badge>
                    <Button size="xs" variant="outline" onClick={() => openEditor(bp)} className="gap-1">
                      <Edit2 className="size-3" /> Edit
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 text-xs leading-relaxed">
                <div>
                  <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] text-primary">
                    1. Objectives of the Practice
                  </h4>
                  <p className="mt-1 text-muted-foreground">{bp.objectives}</p>
                </div>
                <div>
                  <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] text-primary">
                    2. The Context & Regional Need
                  </h4>
                  <p className="mt-1 text-muted-foreground">{bp.context}</p>
                </div>
                <div>
                  <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] text-primary">
                    3. The Practice & Implementation Details
                  </h4>
                  <p className="mt-1 text-muted-foreground">{bp.practice}</p>
                </div>
                <div>
                  <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] text-primary">
                    4. Evidence of Success & Tangible Outcomes
                  </h4>
                  <p className="mt-1 text-emerald-700 dark:text-emerald-400 font-medium">{bp.outcome}</p>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2 border-t border-border/40">
                  <div>
                    <span className="font-semibold text-foreground">Problems Encountered:</span>
                    <p className="text-muted-foreground mt-0.5">{bp.problemsEncountered}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Person Responsible:</span>
                    <p className="text-muted-foreground mt-0.5">{bp.personResponsible}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="id" className="space-y-6">
          <Card className="border-border/60 shadow-xs">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs uppercase font-semibold text-primary">
                Criterion 7.3 · Distinctive Institutional Priority
              </CardDescription>
              <CardTitle className="text-xl font-bold text-foreground mt-0.5">
                {distinctiveness.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs leading-relaxed">
              <p className="text-muted-foreground leading-normal">{distinctiveness.description}</p>

              <div>
                <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] text-primary">
                  Core Objectives
                </h4>
                <p className="mt-1 text-muted-foreground">{distinctiveness.objectives}</p>
              </div>

              <div>
                <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] text-primary">
                  Unique Operational Features
                </h4>
                <ul className="mt-1.5 space-y-1.5">
                  {distinctiveness.uniqueFeatures.map((uf, i) => (
                    <li key={i} className="flex items-start gap-2 text-foreground">
                      <CheckCircle2 className="size-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{uf}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] text-primary">
                  Major Achievements & Institutional Impact
                </h4>
                <ul className="mt-1.5 space-y-1.5">
                  {distinctiveness.majorAchievements.map((ma, i) => (
                    <li key={i} className="flex items-start gap-2 text-foreground">
                      <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{ma}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-muted/20 border border-border/50 text-muted-foreground">
                <strong className="text-foreground">Measurable Impact: </strong>
                {distinctiveness.impact}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Practice: {editPractice?.title}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div>
              <Label htmlFor="bpPractice">Practice Details</Label>
              <Textarea
                id="bpPractice"
                rows={4}
                value={formPracticeText}
                onChange={(e) => setFormPracticeText(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="bpOutcome">Tangible Outcomes & Impact</Label>
              <Textarea
                id="bpOutcome"
                rows={3}
                value={formOutcome}
                onChange={(e) => setFormOutcome(e.target.value)}
                required
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Practice</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
