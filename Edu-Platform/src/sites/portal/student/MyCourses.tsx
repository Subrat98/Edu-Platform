import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, FileQuestion } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useAuthStore } from "@/features/auth/authStore";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { courseRegistrationService } from "@/features/academics/courseRegistrationService";
import { studentService } from "@/features/students/studentService";
import { examinationService } from "@/features/examinations/examinationService";
import { revaluationService } from "@/features/examinations/revaluationService";
import { queryKeys } from "@/lib/queryKeys";
import { cn } from "@/lib/utils";
import type { MarksEntry } from "@/types";

export default function MyCourses() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const { institutionId } = useInstitutionData();
  const studentId = currentUser?.studentId;
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<string[] | null>(null);
  const [revalTarget, setRevalTarget] = useState<MarksEntry | null>(null);
  const [reason, setReason] = useState("");

  const { data: subjects, isLoading: loadingSubjects } = useQuery({ queryKey: queryKeys.availableSubjects(), queryFn: () => courseRegistrationService.listAvailableSubjects(), enabled: institutionId === "college" });
  const { data: registration, isLoading: loadingRegistration } = useQuery({
    queryKey: queryKeys.myRegistration(studentId ?? ""),
    queryFn: () => courseRegistrationService.getMyRegistration(studentId!),
    enabled: !!studentId,
  });
  const { data: results } = useQuery({ queryKey: queryKeys.studentResults(studentId ?? ""), queryFn: () => studentService.getResultsSummary(studentId!), enabled: !!studentId });
  const { data: exams } = useQuery({ queryKey: queryKeys.examinations(institutionId), queryFn: () => examinationService.list(institutionId), enabled: institutionId === "college" });
  const { data: myRevaluations } = useQuery({ queryKey: queryKeys.revaluationsByStudent(studentId ?? ""), queryFn: () => revaluationService.listByStudent(studentId!), enabled: !!studentId });

  const registerMutation = useMutation({
    mutationFn: () => courseRegistrationService.register(studentId!, selected ?? [], currentUser?.name ?? "Student"),
    onSuccess: (res) => {
      if (!res.ok) return toast.error(res.error);
      toast.success("Course registration saved");
      queryClient.invalidateQueries({ queryKey: queryKeys.myRegistration(studentId ?? "") });
      setSelected(null);
    },
  });

  const revalMutation = useMutation({
    mutationFn: () => {
      const exam = (exams ?? []).find((e) => e.id === revalTarget!.examinationId);
      return revaluationService.create({
        institutionId: "college",
        examinationId: revalTarget!.examinationId,
        examinationName: exam?.name ?? "Examination",
        studentId: studentId!,
        subject: revalTarget!.subject,
        originalMarks: revalTarget!.marksObtained,
        maxMarks: revalTarget!.maxMarks,
        reason,
      });
    },
    onSuccess: (res) => {
      if (!res.ok) return toast.error(res.error);
      toast.success("Revaluation request submitted");
      queryClient.invalidateQueries({ queryKey: queryKeys.revaluationsByStudent(studentId ?? "") });
      setRevalTarget(null);
      setReason("");
    },
  });

  const publishedExamIds = useMemo(() => new Set((exams ?? []).filter((e) => e.status === "Published").map((e) => e.id)), [exams]);
  const myRegisteredIds = selected ?? registration ?? [];
  const publishedResults = (results ?? []).filter((m) => publishedExamIds.has(m.examinationId) && myRegisteredIds.includes(m.subject));

  if (institutionId !== "college") {
    return (
      <div>
        <AdminPageHeader title="My Courses" description="Course registration is a College feature." />
        <EmptyState title="Not applicable" description="School students don't register for individual courses — see your Results tab instead." />
      </div>
    );
  }

  if (!studentId) return <EmptyState title="No student record linked" description="This demo persona isn't linked to an ERP student record." />;
  if (loadingSubjects || loadingRegistration) return <PageLoadingSkeleton />;

  return (
    <div>
      <AdminPageHeader
        title="My Courses"
        description="Register for this semester's courses and view your results once published."
        actions={
          selected !== null ? (
            <Button onClick={() => registerMutation.mutate()} disabled={registerMutation.isPending}>
              {registerMutation.isPending ? "Saving…" : "Save registration"}
            </Button>
          ) : null
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Available courses this semester</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(subjects ?? []).map((subj) => {
              const isSelected = myRegisteredIds.includes(subj);
              return (
                <button
                  key={subj}
                  type="button"
                  onClick={() => {
                    const base = selected ?? registration ?? [];
                    setSelected(base.includes(subj) ? base.filter((s) => s !== subj) : [...base, subj]);
                  }}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    isSelected ? "border-success/40 bg-success/10 text-success" : "border-border text-muted-foreground hover:bg-muted",
                  )}
                >
                  {isSelected ? <Check className="mr-1 inline size-3" /> : null}
                  {subj}
                </button>
              );
            })}
          </div>
          {!registration || registration.length === 0 ? (
            <p className="text-muted-foreground mt-3 text-xs">You haven't registered for any courses yet — select your courses above and save.</p>
          ) : null}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Published results for registered courses</CardTitle>
        </CardHeader>
        <CardContent>
          {publishedResults.length === 0 ? (
            <EmptyState title="No published results yet" description="Results for your registered courses will appear here once published." />
          ) : (
            <ul className="divide-border divide-y">
              {publishedResults.map((m) => {
                const pendingReval = (myRevaluations ?? []).find((r) => r.examinationId === m.examinationId && r.subject === m.subject && r.status === "Pending");
                return (
                  <li key={m.id} className="flex items-center justify-between py-2.5 text-sm">
                    <span>{m.subject}</span>
                    <span className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        {m.marksObtained}/{m.maxMarks}
                      </span>
                      <Badge variant="outline">{m.grade}</Badge>
                      {pendingReval ? (
                        <Badge variant="outline" className="border-warning/30 bg-warning/10 text-warning">
                          Revaluation pending
                        </Badge>
                      ) : (
                        <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs" onClick={() => setRevalTarget(m)}>
                          <FileQuestion className="size-3.5" /> Request revaluation
                        </Button>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!revalTarget} onOpenChange={(open) => !open && setRevalTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request revaluation — {revalTarget?.subject}</DialogTitle>
          </DialogHeader>
          <div>
            <Label>Reason</Label>
            <Textarea className="mt-1.5" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Explain why you'd like this subject rechecked…" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevalTarget(null)}>
              Cancel
            </Button>
            <Button onClick={() => revalMutation.mutate()} disabled={revalMutation.isPending || !reason.trim()}>
              {revalMutation.isPending ? "Submitting…" : "Submit request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
