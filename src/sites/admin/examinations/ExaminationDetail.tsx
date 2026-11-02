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
import { examinationService } from "@/features/examinations/examinationService";
import { studentService } from "@/features/students/studentService";
import { useAuthStore } from "@/features/auth/authStore";
import { queryKeys } from "@/lib/queryKeys";
import type { ExamStatus } from "@/types";

const NEXT_STATUS: Partial<Record<ExamStatus, ExamStatus>> = {
  "Marks Entry": "Under Verification",
  "Under Verification": "Published",
};

export default function ExaminationDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((s) => s.currentUser);

  const { data: exam, isLoading: loadingExam } = useQuery({ queryKey: queryKeys.examination(id ?? ""), queryFn: () => examinationService.get(id!), enabled: !!id });
  const { data: marks, isLoading: loadingMarks } = useQuery({ queryKey: queryKeys.examinationMarks(id ?? ""), queryFn: () => examinationService.getMarks(id!), enabled: !!id });
  const { data: students } = useQuery({
    queryKey: queryKeys.students(exam?.institutionId ?? ""),
    queryFn: () => studentService.list(exam!.institutionId),
    enabled: !!exam,
  });

  const updateMark = useMutation({
    mutationFn: ({ studentId, subject, value }: { studentId: string; subject: string; value: number }) =>
      examinationService.updateMark(id!, studentId, subject, value),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.examinationMarks(id ?? "") }),
  });

  const statusMutation = useMutation({
    mutationFn: (status: ExamStatus) => examinationService.setStatus(id!, status, currentUser?.name ?? "Admin"),
    onSuccess: (_r, status) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.examination(id ?? "") });
      toast.success(status === "Published" ? "Results published to students and guardians" : "Status updated");
    },
  });

  const rows = useMemo(() => {
    if (!exam || !marks || !students) return [];
    const relevantStudents = students.filter((s) => s.classOrProgrammeId === exam.classOrProgrammeId && s.status === "Active");
    return relevantStudents.map((student) => {
      const subjectMarks = Object.fromEntries(marks.filter((m) => m.studentId === student.id).map((m) => [m.subject, m]));
      const total = exam.subjects.reduce((sum, s) => sum + (subjectMarks[s.subject]?.marksObtained ?? 0), 0);
      const maxTotal = exam.subjects.reduce((sum, s) => sum + s.maxMarks, 0);
      return { student, subjectMarks, total, maxTotal, percentage: maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0 };
    });
  }, [exam, marks, students]);

  if (loadingExam || loadingMarks) return <PageLoadingSkeleton />;
  if (!exam) return <EmptyState title="Examination not found" />;

  const nextStatus = NEXT_STATUS[exam.status];

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 gap-1.5">
        <Link to="/admin/examinations">
          <ArrowLeft className="size-4" /> Back to examinations
        </Link>
      </Button>

      <AdminPageHeader
        title={exam.name}
        description={`${exam.className} · ${exam.term} · ${exam.academicYear}`}
        actions={
          <>
            <Badge variant="outline">{exam.status}</Badge>
            {nextStatus ? (
              <Button onClick={() => statusMutation.mutate(nextStatus)} disabled={statusMutation.isPending}>
                {nextStatus === "Published" ? "Publish Results" : `Move to ${nextStatus}`}
              </Button>
            ) : null}
          </>
        }
      />

      {rows.length === 0 ? (
        <EmptyState title="No students enrolled in this class yet" />
      ) : (
        <div className="border-border overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                {exam.subjects.map((s) => (
                  <TableHead key={s.subject} className="text-center">
                    {s.subject}
                    <span className="text-muted-foreground block text-[10px] font-normal">/{s.maxMarks}</span>
                  </TableHead>
                ))}
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ student, subjectMarks, total, maxTotal, percentage }) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {student.name}
                    <span className="text-muted-foreground ml-1 text-xs">({student.rollNumber})</span>
                  </TableCell>
                  {exam.subjects.map((s) => {
                    const entry = subjectMarks[s.subject];
                    return (
                      <TableCell key={s.subject} className="text-center">
                        <Input
                          type="number"
                          min={0}
                          max={s.maxMarks}
                          defaultValue={entry?.marksObtained ?? 0}
                          disabled={exam.status === "Published"}
                          className="mx-auto h-8 w-16 text-center"
                          onBlur={(e) => {
                            const value = Math.min(s.maxMarks, Math.max(0, Number(e.target.value) || 0));
                            if (value !== entry?.marksObtained) updateMark.mutate({ studentId: student.id, subject: s.subject, value });
                          }}
                        />
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-right whitespace-nowrap">
                    <span className="font-medium">
                      {total}/{maxTotal}
                    </span>{" "}
                    <Badge variant="outline" className="ml-1">
                      {percentage}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
