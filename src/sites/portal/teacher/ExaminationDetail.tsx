import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useAuthStore } from "@/features/auth/authStore";
import { staffService } from "@/features/staff/staffService";
import { examinationService } from "@/features/examinations/examinationService";
import { studentService } from "@/features/students/studentService";
import { queryKeys } from "@/lib/queryKeys";

export default function TeacherExaminationDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((s) => s.currentUser);
  const staffId = currentUser?.staffId;

  const { data: assignments } = useQuery({
    queryKey: queryKeys.staffAssignments(staffId ?? ""),
    queryFn: () => staffService.getAssignments(staffId!),
    enabled: !!staffId,
  });
  const { data: exam, isLoading: loadingExam } = useQuery({ queryKey: queryKeys.examination(id ?? ""), queryFn: () => examinationService.get(id!), enabled: !!id });
  const { data: marks, isLoading: loadingMarks } = useQuery({ queryKey: queryKeys.examinationMarks(id ?? ""), queryFn: () => examinationService.getMarks(id!), enabled: !!id });
  const { data: students } = useQuery({
    queryKey: queryKeys.students(exam?.institutionId ?? ""),
    queryFn: () => studentService.list(exam!.institutionId),
    enabled: !!exam,
  });

  const myTaughtSubjects = useMemo(() => {
    if (!exam) return new Set<string>();
    return new Set((assignments ?? []).filter((a) => a.classOrProgrammeId === exam.classOrProgrammeId).map((a) => a.subject));
  }, [assignments, exam]);

  const updateMark = useMutation({
    mutationFn: ({ studentId, subject, value }: { studentId: string; subject: string; value: number }) => examinationService.updateMark(id!, studentId, subject, value),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.examinationMarks(id ?? "") }),
  });

  const statusMutation = useMutation({
    mutationFn: () => examinationService.setStatus(id!, "Under Verification", currentUser?.name ?? "Teacher"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.examination(id ?? "") });
      toast.success("Sent for verification", { description: "A Principal or Admin can now publish these results." });
    },
  });

  if (loadingExam || loadingMarks) return <PageLoadingSkeleton />;
  if (!exam) return <EmptyState title="Examination not found" />;

  const mySubjects = exam.subjects.filter((s) => myTaughtSubjects.has(s.subject));
  const relevantStudents = (students ?? []).filter((s) => s.classOrProgrammeId === exam.classOrProgrammeId && s.status === "Active");
  const editable = exam.status === "Marks Entry";

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 gap-1.5">
        <Link to="/portal/teacher/examinations">
          <ArrowLeft className="size-4" /> Back to examinations
        </Link>
      </Button>

      <AdminPageHeader
        title={exam.name}
        description={`${exam.className} · ${exam.term}`}
        actions={
          editable ? (
            <Button onClick={() => statusMutation.mutate()} disabled={statusMutation.isPending}>
              {statusMutation.isPending ? "Submitting…" : "Send for Verification"}
            </Button>
          ) : (
            <Badge variant="outline">{exam.status}</Badge>
          )
        }
      />

      {mySubjects.length === 0 ? (
        <EmptyState title="You don't teach a subject in this examination" />
      ) : (
        <div className="border-border overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                {mySubjects.map((s) => (
                  <TableHead key={s.subject}>
                    {s.subject} <span className="text-muted-foreground">/{s.maxMarks}</span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {relevantStudents.map((student) => {
                const subjectMarks = Object.fromEntries((marks ?? []).filter((m) => m.studentId === student.id).map((m) => [m.subject, m]));
                return (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    {mySubjects.map((s) => {
                      const entry = subjectMarks[s.subject];
                      return (
                        <TableCell key={s.subject}>
                          <Input
                            type="number"
                            className="w-20"
                            defaultValue={entry?.marksObtained ?? 0}
                            disabled={!editable}
                            onBlur={(e) => {
                              const value = Number(e.target.value);
                              if (value !== entry?.marksObtained) updateMark.mutate({ studentId: student.id, subject: s.subject, value });
                            }}
                          />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
