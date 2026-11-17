import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, IdCard } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function ExamCellExaminationDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((s) => s.currentUser);

  const { data: exam, isLoading: loadingExam } = useQuery({ queryKey: queryKeys.examination(id ?? ""), queryFn: () => examinationService.get(id!), enabled: !!id });
  const { data: marks, isLoading: loadingMarks } = useQuery({ queryKey: queryKeys.examinationMarks(id ?? ""), queryFn: () => examinationService.getMarks(id!), enabled: !!id });
  const { data: students } = useQuery({
    queryKey: queryKeys.students("college"),
    queryFn: () => studentService.list("college"),
    enabled: !!exam,
  });

  const updateMark = useMutation({
    mutationFn: ({ studentId, subject, value }: { studentId: string; subject: string; value: number }) =>
      examinationService.updateMark(id!, studentId, subject, value),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.examinationMarks(id ?? "") }),
  });

  const statusMutation = useMutation({
    mutationFn: (status: ExamStatus) => examinationService.setStatus(id!, status, currentUser?.name ?? "Examination Cell"),
    onSuccess: (_r, status) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.examination(id ?? "") });
      toast.success(status === "Published" ? "Results published to students and guardians" : "Status updated");
    },
  });

  const relevantStudents = useMemo(() => {
    if (!exam || !students) return [];
    return students.filter((s) => s.classOrProgrammeId === exam.classOrProgrammeId && s.status === "Active");
  }, [exam, students]);

  const rows = useMemo(() => {
    if (!exam || !marks) return [];
    return relevantStudents.map((student) => {
      const subjectMarks = Object.fromEntries(marks.filter((m) => m.studentId === student.id).map((m) => [m.subject, m]));
      const total = exam.subjects.reduce((sum, s) => sum + (subjectMarks[s.subject]?.marksObtained ?? 0), 0);
      const maxTotal = exam.subjects.reduce((sum, s) => sum + s.maxMarks, 0);
      return { student, subjectMarks, total, maxTotal, percentage: maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0 };
    });
  }, [exam, marks, relevantStudents]);

  if (loadingExam || loadingMarks) return <PageLoadingSkeleton />;
  if (!exam) return <EmptyState title="Examination not found" />;

  const nextStatus = NEXT_STATUS[exam.status];

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 gap-1.5">
        <Link to="/portal/examcell/examinations">
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
        <EmptyState title="No students enrolled in this programme yet" />
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

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <IdCard className="size-4" /> Hall tickets
          </CardTitle>
        </CardHeader>
        <CardContent>
          {relevantStudents.length === 0 ? (
            <EmptyState title="No students to issue hall tickets for" />
          ) : (
            <div className="flex flex-wrap gap-2">
              {relevantStudents.map((s) => (
                <Button key={s.id} asChild variant="outline" size="sm">
                  <Link to={`/hall-ticket/${exam.id}/${s.id}`} target="_blank" rel="noopener noreferrer">
                    {s.name}
                  </Link>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
