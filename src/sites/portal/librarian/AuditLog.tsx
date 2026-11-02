import { useQuery } from "@tanstack/react-query";
import { History } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { libraryService } from "@/features/library/libraryService";
import { queryKeys } from "@/lib/queryKeys";
import type { LibraryAuditAction } from "@/types";

const ACTION_TONE: Record<LibraryAuditAction, string> = {
  "Booking Created": "bg-info/10 text-info border-info/30",
  "Booking Verified": "bg-accent/10 text-accent border-accent/30",
  "Booking Cancelled": "bg-muted text-muted-foreground",
  "Book Issued": "border-success/30 bg-success/10 text-success",
  "Book Returned": "bg-muted text-muted-foreground",
  "Loan Renewed": "bg-accent/10 text-accent border-accent/30",
  "Fine Waived": "border-warning/30 bg-warning/10 text-warning",
  "Fine Collected": "border-success/30 bg-success/10 text-success",
  "Reservation Created": "bg-info/10 text-info border-info/30",
  "Reservation Cancelled": "bg-muted text-muted-foreground",
};

export default function AuditLog() {
  const { institutionId } = useInstitutionData();
  const { data: events, isLoading } = useQuery({ queryKey: queryKeys.libraryAudit(institutionId), queryFn: () => libraryService.listAuditEvents(institutionId) });

  if (isLoading) return <PageLoadingSkeleton />;

  return (
    <div>
      <AdminPageHeader title="Library Audit Log" description="Append-only history of circulation actions — cannot be edited or deleted." />
      {(events ?? []).length === 0 ? (
        <EmptyState title="No audit events yet" icon={History} />
      ) : (
        <div className="border-border rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Booking / Book</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(events ?? []).map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="text-muted-foreground text-xs whitespace-nowrap">{e.timestamp.replace("T", " ")}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={ACTION_TONE[e.action]}>
                      {e.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{e.actor}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{e.memberName ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{e.bookingNo ?? e.bookTitle ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{e.reason ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
