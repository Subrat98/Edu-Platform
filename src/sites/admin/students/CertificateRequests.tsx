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
import { certificateRequestService } from "@/features/students/certificateRequestService";
import { queryKeys } from "@/lib/queryKeys";
import type { CertificateRequestStatus } from "@/types";

const STATUS_TONE: Record<CertificateRequestStatus, string> = {
  Requested: "border-warning/30 bg-warning/10 text-warning",
  Issued: "border-success/30 bg-success/10 text-success",
  Rejected: "border-destructive/30 text-destructive",
};

export default function AdminCertificateRequests() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const { institutionId } = useInstitutionData();
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({ queryKey: queryKeys.certificateRequests(institutionId), queryFn: () => certificateRequestService.listByInstitution(institutionId) });

  const reviewMutation = useMutation({
    mutationFn: ({ id, decision }: { id: string; decision: "Issued" | "Rejected" }) => certificateRequestService.setStatus(id, decision, currentUser?.name ?? "Admin"),
    onSuccess: () => {
      toast.success("Request updated");
      queryClient.invalidateQueries({ queryKey: queryKeys.certificateRequests(institutionId) });
    },
  });

  if (isLoading) return <PageLoadingSkeleton />;

  return (
    <div>
      <AdminPageHeader title="Certificate Requests" description="Transfer and bonafide certificate requests awaiting issue." />
      {!requests || requests.length === 0 ? (
        <EmptyState title="No certificate requests" />
      ) : (
        <div className="border-border rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.studentName}</TableCell>
                  <TableCell className="text-muted-foreground">{r.type}</TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate text-sm">{r.reason || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{r.requestedDate}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={STATUS_TONE[r.status]}>
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {r.status === "Requested" ? (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" className="text-destructive" onClick={() => reviewMutation.mutate({ id: r.id, decision: "Rejected" })}>
                          Reject
                        </Button>
                        <Button size="sm" onClick={() => reviewMutation.mutate({ id: r.id, decision: "Issued" })}>
                          Issue
                        </Button>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">{r.issuedBy ? `By ${r.issuedBy}` : "—"}</span>
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
