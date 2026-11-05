import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarDays } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useAuthStore } from "@/features/auth/authStore";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { staffService } from "@/features/staff/staffService";
import { leaveRequestService } from "@/features/academics/leaveRequestService";
import { queryKeys } from "@/lib/queryKeys";
import type { LeaveRequestStatus } from "@/types";

const STATUS_TONE: Record<LeaveRequestStatus, string> = {
  Pending: "border-warning/30 bg-warning/10 text-warning",
  Approved: "border-success/30 bg-success/10 text-success",
  Rejected: "border-destructive/30 text-destructive",
};

export default function TeacherLeaveRequests() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const { institutionId } = useInstitutionData();
  const staffId = currentUser?.staffId;
  const queryClient = useQueryClient();

  const { data: assignments, isLoading: loadingAssignments } = useQuery({
    queryKey: queryKeys.staffAssignments(staffId ?? ""),
    queryFn: () => staffService.getAssignments(staffId!),
    enabled: !!staffId,
  });

  const groups = useMemo(() => {
    const seen = new Map<string, { classOrProgrammeId: string; section: string }>();
    (assignments ?? []).forEach((a) => seen.set(`${a.classOrProgrammeId}::${a.section}`, { classOrProgrammeId: a.classOrProgrammeId, section: a.section }));
    return Array.from(seen.values());
  }, [assignments]);

  const { data: requests, isLoading: loadingRequests } = useQuery({
    queryKey: queryKeys.leaveRequestsForTeacher(staffId ?? ""),
    queryFn: () => leaveRequestService.listForGroups(institutionId, groups),
    enabled: !!staffId && groups.length > 0,
  });

  const reviewMutation = useMutation({
    mutationFn: ({ id, decision }: { id: string; decision: "Approved" | "Rejected" }) => leaveRequestService.review(id, decision, currentUser?.name ?? "Teacher"),
    onSuccess: () => {
      toast.success("Request reviewed");
      queryClient.invalidateQueries({ queryKey: queryKeys.leaveRequestsForTeacher(staffId ?? "") });
    },
  });

  if (!staffId) return <EmptyState title="No staff record linked" />;
  if (loadingAssignments || loadingRequests) return <PageLoadingSkeleton />;

  const list = requests ?? [];
  const pending = list.filter((r) => r.status === "Pending");
  const decided = list.filter((r) => r.status !== "Pending");

  return (
    <div>
      <AdminPageHeader title="Leave Requests" description="Review leave requests from students in your classes." />
      {list.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No leave requests" />
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
                        <p className="font-medium">{r.studentName}</p>
                        <p className="text-muted-foreground text-sm">
                          {r.startDate} → {r.endDate} · Requested by {r.requestedBy}
                        </p>
                        <p className="text-muted-foreground mt-1 text-xs">"{r.reason}"</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="text-destructive" onClick={() => reviewMutation.mutate({ id: r.id, decision: "Rejected" })} disabled={reviewMutation.isPending}>
                          Reject
                        </Button>
                        <Button size="sm" onClick={() => reviewMutation.mutate({ id: r.id, decision: "Approved" })} disabled={reviewMutation.isPending}>
                          Approve
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
                        <p className="font-medium">{r.studentName}</p>
                        <p className="text-muted-foreground text-sm">
                          {r.startDate} → {r.endDate} · Reviewed by {r.reviewedBy}
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
    </div>
  );
}
