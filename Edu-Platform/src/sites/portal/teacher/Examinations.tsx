import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { useAuthStore } from "@/features/auth/authStore";
import { staffService } from "@/features/staff/staffService";
import { examinationService } from "@/features/examinations/examinationService";
import { queryKeys } from "@/lib/queryKeys";
import type { ExamStatus } from "@/types";

const STATUS_TONE: Record<ExamStatus, string> = {
  Scheduled: "bg-muted text-muted-foreground",
  "Marks Entry": "border-warning/30 bg-warning/10 text-warning",
  "Under Verification": "border-info/30 bg-info/10 text-info",
  Published: "border-success/30 bg-success/10 text-success",
};

export default function TeacherExaminations() {
  const { institutionId } = useInstitutionData();
  const currentUser = useAuthStore((s) => s.currentUser);
  const staffId = currentUser?.staffId;

  const { data: assignments, isLoading: loadingAssignments } = useQuery({
    queryKey: queryKeys.staffAssignments(staffId ?? ""),
    queryFn: () => staffService.getAssignments(staffId!),
    enabled: !!staffId,
  });
  const { data: exams, isLoading: loadingExams } = useQuery({ queryKey: queryKeys.examinations(institutionId), queryFn: () => examinationService.list(institutionId) });

  const myExams = useMemo(() => {
    const myClassIds = new Set((assignments ?? []).map((a) => a.classOrProgrammeId));
    return (exams ?? []).filter((e) => myClassIds.has(e.classOrProgrammeId));
  }, [exams, assignments]);

  if (!staffId) return <EmptyState title="No staff record linked" />;
  if (loadingAssignments || loadingExams) return <PageLoadingSkeleton />;

  return (
    <div>
      <AdminPageHeader title="Examinations" description="Enter marks for the classes you teach." />
      {myExams.length === 0 ? (
        <EmptyState title="No examinations for your classes" />
      ) : (
        <div className="border-border rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Examination</TableHead>
                <TableHead>Class / Programme</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myExams.map((e) => (
                <TableRow key={e.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <Link to={`/portal/teacher/examinations/${e.id}`}>{e.name}</Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{e.className}</TableCell>
                  <TableCell className="text-muted-foreground">{e.term}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={STATUS_TONE[e.status]}>
                      {e.status}
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
