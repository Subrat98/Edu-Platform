import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useAuthStore } from "@/features/auth/authStore";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { leaveRequestService } from "@/features/academics/leaveRequestService";
import { schoolClasses } from "@/mocks/data/classes";
import { programmes } from "@/mocks/data/programmes";
import { queryKeys } from "@/lib/queryKeys";
import type { LeaveRequestStatus } from "@/types";

function classOrProgrammeName(id: string): string {
  return schoolClasses.find((c) => c.id === id)?.name ?? programmes.find((p) => p.id === id)?.name ?? id;
}

const STATUS_TONE: Record<LeaveRequestStatus, string> = {
  Pending: "border-warning/30 bg-warning/10 text-warning",
  Approved: "border-success/30 bg-success/10 text-success",
  Rejected: "border-destructive/30 text-destructive",
};

export default function AdminLeaveRequests() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const { institutionId } = useInstitutionData();
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({ queryKey: queryKeys.leaveRequests(institutionId), queryFn: () => leaveRequestService.listByInstitution(institutionId) });

  const reviewMutation = useMutation({
    mutationFn: ({ id, decision }: { id: string; decision: "Approved" | "Rejected" }) => leaveRequestService.review(id, decision, currentUser?.name ?? "Admin"),
    onSuccess: () => {
      toast.success("Request reviewed");
      queryClient.invalidateQueries({ queryKey: queryKeys.leaveRequests(institutionId) });
    },
  });

  if (isLoading) return <PageLoadingSkeleton />;

  return (
    <div>
      <AdminPageHeader title="Leave Requests" description="All student leave requests across the institution." />
      {!requests || requests.length === 0 ? (
        <EmptyState title="No leave requests" />
      ) : (
        <div className="border-border rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Class / Programme</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.studentName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {classOrProgrammeName(r.classOrProgrammeId)} — {r.section}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {r.startDate} → {r.endDate}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{r.requestedBy}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={STATUS_TONE[r.status]}>
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {r.status === "Pending" ? (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" className="text-destructive" onClick={() => reviewMutation.mutate({ id: r.id, decision: "Rejected" })}>
                          Reject
                        </Button>
                        <Button size="sm" onClick={() => reviewMutation.mutate({ id: r.id, decision: "Approved" })}>
                          Approve
                        </Button>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">By {r.reviewedBy}</span>
                    )}
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
