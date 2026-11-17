import { useQuery } from "@tanstack/react-query";
import { IndianRupee } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useCurrentMembership } from "@/features/library/useCurrentMembership";
import { libraryService } from "@/features/library/libraryService";
import { queryKeys } from "@/lib/queryKeys";
import type { Fine } from "@/types";

const STATUS_TONE: Record<Fine["status"], string> = {
  Outstanding: "border-destructive/30 bg-destructive/10 text-destructive",
  Paid: "border-success/30 bg-success/10 text-success",
  Waived: "bg-muted text-muted-foreground",
};

export default function MyFines() {
  const membership = useCurrentMembership();
  const { data: fines, isLoading } = useQuery({
    queryKey: queryKeys.myFines(membership?.id ?? ""),
    queryFn: () => libraryService.listMyFines(membership!.id),
    enabled: !!membership,
  });

  if (isLoading) return <PageLoadingSkeleton />;

  const total = (fines ?? []).filter((f) => f.status === "Outstanding").reduce((s, f) => s + f.outstandingAmount, 0);

  return (
    <div>
      <AdminPageHeader title="My Fines" description="Overdue fines associated with your library loans." />
      {total > 0 ? (
        <div className="border-warning/30 bg-warning/5 mb-4 flex items-center gap-3 rounded-lg border p-4">
          <IndianRupee className="text-warning size-5" />
          <p className="text-sm">
            You have <span className="font-semibold">₹{total}</span> in outstanding fines. Please settle these at the library desk.
          </p>
        </div>
      ) : null}
      {!fines || fines.length === 0 ? (
        <EmptyState title="No fines on your account" icon={IndianRupee} />
      ) : (
        <div className="space-y-3">
          {fines.map((f) => (
            <Card key={f.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">₹{f.assessedAmount}</p>
                  <p className="text-muted-foreground text-xs">{f.reason}</p>
                </div>
                <Badge variant="outline" className={STATUS_TONE[f.status]}>
                  {f.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
