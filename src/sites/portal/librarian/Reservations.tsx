import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { X } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { useAuthStore } from "@/features/auth/authStore";
import { libraryService } from "@/features/library/libraryService";
import { getBookTitle } from "@/mocks/data/library/bookTitles";
import { getMember } from "@/mocks/data/library/members";
import { queryKeys } from "@/lib/queryKeys";

export default function Reservations() {
  const { institutionId } = useInstitutionData();
  const currentUser = useAuthStore((s) => s.currentUser);
  const queryClient = useQueryClient();
  const { data: reservations, isLoading } = useQuery({
    queryKey: queryKeys.libraryReservations(institutionId),
    queryFn: () => libraryService.listReservations(institutionId),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => libraryService.cancelReservation(id, currentUser?.name ?? "Librarian"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.libraryReservations(institutionId) });
      toast.success("Reservation cancelled");
    },
  });

  const active = (reservations ?? []).filter((r) => r.status === "Queued").sort((a, b) => a.queuePosition - b.queuePosition);

  if (isLoading) return <PageLoadingSkeleton />;

  return (
    <div>
      <AdminPageHeader title="Reservations" description="Waitlists for titles with no copies currently available." />
      {active.length === 0 ? (
        <EmptyState title="No active reservations" />
      ) : (
        <div className="border-border rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Queue position</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {active.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{getBookTitle(r.titleId)?.title}</TableCell>
                  <TableCell>{getMember(r.membershipId)?.memberName}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">#{r.queuePosition}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">{r.requestedDate}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="gap-1" onClick={() => cancelMutation.mutate(r.id)}>
                      <X className="size-3.5" /> Cancel
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
