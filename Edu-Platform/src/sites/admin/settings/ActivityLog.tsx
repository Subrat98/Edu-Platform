import { useQuery } from "@tanstack/react-query";
import { History } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { activityService } from "@/features/activity/activityService";
import { queryKeys } from "@/lib/queryKeys";
import type { ActivityCategory } from "@/types";

const CATEGORY_TONE: Record<ActivityCategory, string> = {
  Admissions: "bg-accent/10 text-accent border-accent/30",
  Students: "bg-info/10 text-info border-info/30",
  Attendance: "border-success/30 bg-success/10 text-success",
  Examinations: "border-warning/30 bg-warning/10 text-warning",
  Finance: "border-success/30 bg-success/10 text-success",
  CMS: "bg-muted text-muted-foreground",
  Settings: "bg-muted text-muted-foreground",
};

export default function ActivityLog() {
  const { institutionId } = useInstitutionData();
  const { data: events, isLoading } = useQuery({ queryKey: queryKeys.activityLog(institutionId), queryFn: () => activityService.list(institutionId) });

  if (isLoading) return <PageLoadingSkeleton />;

  return (
    <div>
      <AdminPageHeader title="Activity Log" description="Append-only history of ERP and CMS actions for this institution." />
      {(events ?? []).length === 0 ? (
        <EmptyState title="No activity recorded yet" icon={History} />
      ) : (
        <div className="border-border rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(events ?? []).map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="text-muted-foreground text-xs whitespace-nowrap">{e.timestamp.replace("T", " ")}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={CATEGORY_TONE[e.category]}>
                      {e.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{e.action}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{e.actor}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{e.detail ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
