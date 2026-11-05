import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FileQuestion } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useAuthStore } from "@/features/auth/authStore";
import { revaluationService } from "@/features/examinations/revaluationService";
import { queryKeys } from "@/lib/queryKeys";
import type { RevaluationRequest, RevaluationStatus } from "@/types";

const STATUS_TONE: Record<RevaluationStatus, string> = {
  Pending: "border-warning/30 bg-warning/10 text-warning",
  Approved: "border-success/30 bg-success/10 text-success",
  Rejected: "border-destructive/30 bg-destructive/10 text-destructive",
};

export default function ExamCellRevaluation() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const queryClient = useQueryClient();
  const [reviewing, setReviewing] = useState<RevaluationRequest | null>(null);
  const [revisedMarks, setRevisedMarks] = useState("");
  const [note, setNote] = useState("");

  const { data: requests, isLoading } = useQuery({ queryKey: queryKeys.revaluations("college"), queryFn: () => revaluationService.listByInstitution("college") });

  const reviewMutation = useMutation({
    mutationFn: (decision: "Approved" | "Rejected") =>
      revaluationService.review(reviewing!.id, decision, currentUser?.name ?? "Examination Cell", decision === "Approved" ? Number(revisedMarks) || reviewing!.originalMarks : undefined, note || undefined),
    onSuccess: () => {
      toast.success("Request reviewed");
      queryClient.invalidateQueries({ queryKey: queryKeys.revaluations("college") });
      setReviewing(null);
      setRevisedMarks("");
      setNote("");
    },
  });

  if (isLoading) return <PageLoadingSkeleton />;

  const pending = (requests ?? []).filter((r) => r.status === "Pending");
  const decided = (requests ?? []).filter((r) => r.status !== "Pending");

  return (
    <div>
      <AdminPageHeader title="Revaluation Requests" description="Review and decide student revaluation requests." />

      {(requests ?? []).length === 0 ? (
        <EmptyState icon={FileQuestion} title="No revaluation requests" />
      ) : (
        <div className="space-y-6">
          {pending.length > 0 ? (
            <div>
              <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">Pending ({pending.length})</p>
              <div className="space-y-3">
                {pending.map((r) => (
                  <Card key={r.id}>
                    <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
                      <div>
                        <p className="font-medium">
                          {r.studentName} — {r.subject}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {r.examinationName} · Original: {r.originalMarks}/{r.maxMarks}
                        </p>
                        <p className="text-muted-foreground mt-1 text-xs">"{r.reason}"</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={STATUS_TONE[r.status]}>
                          {r.status}
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => {
                            setReviewing(r);
                            setRevisedMarks(String(r.originalMarks));
                          }}
                        >
                          Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : null}

          {decided.length > 0 ? (
            <div>
              <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">Decided</p>
              <div className="space-y-3">
                {decided.map((r) => (
                  <Card key={r.id}>
                    <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
                      <div>
                        <p className="font-medium">
                          {r.studentName} — {r.subject}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {r.originalMarks}
                          {r.revisedMarks !== undefined ? ` → ${r.revisedMarks}` : ""}/{r.maxMarks} · Reviewed by {r.reviewedBy}
                        </p>
                      </div>
                      <Badge variant="outline" className={STATUS_TONE[r.status]}>
                        {r.status}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}

      <Dialog open={!!reviewing} onOpenChange={(open) => !open && setReviewing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Review — {reviewing?.studentName} ({reviewing?.subject})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Revised marks (if approving)</Label>
              <Input type="number" min={0} max={reviewing?.maxMarks} className="mt-1.5" value={revisedMarks} onChange={(e) => setRevisedMarks(e.target.value)} />
            </div>
            <div>
              <Label>Note</Label>
              <Textarea className="mt-1.5" rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Reason for the decision…" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="text-destructive" onClick={() => reviewMutation.mutate("Rejected")} disabled={reviewMutation.isPending}>
              Reject
            </Button>
            <Button onClick={() => reviewMutation.mutate("Approved")} disabled={reviewMutation.isPending}>
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
