import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useAuthStore } from "@/features/auth/authStore";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { studentService } from "@/features/students/studentService";
import { examinationService } from "@/features/examinations/examinationService";
import { queryKeys } from "@/lib/queryKeys";
import { cn } from "@/lib/utils";
import type { MarksEntry, Examination } from "@/types";

function gradeBadgeClass(grade: string) {
  if (["A1", "A2"].includes(grade)) return "border-success/30 bg-success/10 text-success";
  if (["B1", "B2"].includes(grade)) return "border-blue-500/30 bg-blue-500/10 text-blue-600";
  if (["C1", "D"].includes(grade)) return "border-warning/30 bg-warning/10 text-warning";
  return "border-destructive/30 bg-destructive/10 text-destructive"; // E = fail
}

function isPassing(marksObtained: number, maxMarks: number) {
  return marksObtained >= Math.round(maxMarks * 0.33);
}

export default function MyResults() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const { institutionId } = useInstitutionData();
  const studentId = currentUser?.studentId;

  const { data: exams, isLoading: loadingExams } = useQuery({
    queryKey: queryKeys.examinations(institutionId),
    queryFn: () => examinationService.list(institutionId),
  });

  const { data: results, isLoading: loadingResults } = useQuery({
    queryKey: queryKeys.studentResults(studentId ?? ""),
    queryFn: () => studentService.getResultsSummary(studentId!),
    enabled: !!studentId,
  });

  const isLoading = loadingExams || loadingResults;

  // Group results by examination, only for Published exams
  const groupedResults = useMemo(() => {
    if (!exams || !results) return [];

    const publishedExams = exams.filter((e: Examination) => e.status === "Published");
    const publishedExamMap = new Map(publishedExams.map((e: Examination) => [e.id, e]));

    const byExam = new Map<string, { exam: Examination; marks: MarksEntry[] }>();
    for (const mark of results as MarksEntry[]) {
      const exam = publishedExamMap.get(mark.examinationId);
      if (!exam) continue;
      if (!byExam.has(exam.id)) {
        byExam.set(exam.id, { exam, marks: [] });
      }
      byExam.get(exam.id)!.marks.push(mark);
    }

    return Array.from(byExam.values());
  }, [exams, results]);

  if (isLoading) return <PageLoadingSkeleton />;

  if (!studentId) {
    return (
      <div>
        <AdminPageHeader title="My Results" description="Your published examination results." />
        <EmptyState title="No student record linked" description="This account isn't linked to a student record." />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader title="My Results" description="Published examination results, grouped by exam." />

      {groupedResults.length === 0 ? (
        <EmptyState
          title="No results published yet"
          description="Results will appear here once the institution publishes them."
        />
      ) : (
        <div className="space-y-6">
          {groupedResults.map(({ exam, marks }) => {
            const totalObtained = marks.reduce((s, m) => s + m.marksObtained, 0);
            const totalMax = marks.reduce((s, m) => s + m.maxMarks, 0);
            const overallPercent = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;
            const passCount = marks.filter((m) => isPassing(m.marksObtained, m.maxMarks)).length;

            return (
              <Card key={exam.id}>
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-base">{exam.name}</CardTitle>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        {exam.className} · {exam.academicYear} · Published {exam.publishedDate}
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-semibold">{overallPercent}%</p>
                      <p className="text-muted-foreground text-xs">
                        {passCount}/{marks.length} subjects passed
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="divide-border divide-y">
                    {marks.map((m) => {
                      const passing = isPassing(m.marksObtained, m.maxMarks);
                      const percent = m.maxMarks > 0 ? Math.round((m.marksObtained / m.maxMarks) * 100) : 0;
                      return (
                        <li key={m.id} className="py-3">
                          <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
                            <span className="font-medium">{m.subject}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">
                                {m.marksObtained}/{m.maxMarks}
                              </span>
                              <Badge
                                variant="outline"
                                className={cn(gradeBadgeClass(m.grade))}
                              >
                                {m.grade}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={cn(
                                  passing
                                    ? "border-success/30 bg-success/10 text-success"
                                    : "border-destructive/30 bg-destructive/10 text-destructive"
                                )}
                              >
                                {passing ? "Pass" : "Fail"}
                              </Badge>
                            </div>
                          </div>
                          {/* Progress bar */}
                          <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all",
                                passing ? "bg-success" : "bg-destructive"
                              )}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
