import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { examinationService } from "@/features/examinations/examinationService";
import { queryKeys } from "@/lib/queryKeys";
import type { ExamStatus } from "@/types";

const STATUS_TONE: Record<ExamStatus, string> = {
  Scheduled: "bg-muted text-muted-foreground",
  "Marks Entry": "border-warning/30 bg-warning/10 text-warning",
  "Under Verification": "border-info/30 bg-info/10 text-info",
  Published: "border-success/30 bg-success/10 text-success",
};

export default function ExamCellExaminations() {
  const { data: exams, isLoading } = useQuery({ queryKey: queryKeys.examinations("college"), queryFn: () => examinationService.list("college") });

  if (isLoading) return <PageLoadingSkeleton />;

  return (
    <div>
      <AdminPageHeader title="Examinations" description="Schedule, verify marks and publish results across every programme." />
      {!exams || exams.length === 0 ? (
        <EmptyState title="No examinations configured" />
      ) : (
        <div className="border-border rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Examination</TableHead>
                <TableHead>Programme</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.map((e) => (
                <TableRow key={e.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <Link to={`/portal/examcell/examinations/${e.id}`}>{e.name}</Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{e.className}</TableCell>
                  <TableCell className="text-muted-foreground">{e.term}</TableCell>
                  <TableCell className="text-muted-foreground">{e.subjects.length}</TableCell>
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
