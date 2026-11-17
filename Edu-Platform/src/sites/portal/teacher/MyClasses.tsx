import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useAuthStore } from "@/features/auth/authStore";
import { staffService } from "@/features/staff/staffService";
import { queryKeys } from "@/lib/queryKeys";

export default function MyClasses() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const staffId = currentUser?.staffId;

  const { data: assignments, isLoading } = useQuery({
    queryKey: queryKeys.staffAssignments(staffId ?? ""),
    queryFn: () => staffService.getAssignments(staffId!),
    enabled: !!staffId,
  });

  if (!staffId) return <EmptyState title="No staff record linked" />;
  if (isLoading) return <PageLoadingSkeleton />;

  return (
    <div>
      <AdminPageHeader title="My Classes" description="Classes and subjects you teach, derived from the institution's timetable." />
      {(assignments ?? []).length === 0 ? (
        <EmptyState title="No classes assigned" />
      ) : (
        <div className="border-border rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class / Programme</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Periods / week</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(assignments ?? []).map((a) => (
                <TableRow key={`${a.classOrProgrammeId}::${a.section}::${a.subject}`}>
                  <TableCell className="font-medium">{a.className}</TableCell>
                  <TableCell className="text-muted-foreground">{a.section}</TableCell>
                  <TableCell className="text-muted-foreground">{a.subject}</TableCell>
                  <TableCell className="text-muted-foreground">{a.periodCount}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link to="/portal/teacher/attendance">Attendance</Link>
                    </Button>
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
