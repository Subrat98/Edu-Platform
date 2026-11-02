import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IndianRupee } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { useAuthStore } from "@/features/auth/authStore";
import { libraryService } from "@/features/library/libraryService";
import { getMember } from "@/mocks/data/library/members";
import { queryKeys } from "@/lib/queryKeys";
import type { Fine } from "@/types";

const STATUS_TONE: Record<Fine["status"], string> = {
  Outstanding: "border-destructive/30 bg-destructive/10 text-destructive",
  Paid: "border-success/30 bg-success/10 text-success",
  Waived: "bg-muted text-muted-foreground",
};

export default function Fines() {
  const { institutionId } = useInstitutionData();
  const currentUser = useAuthStore((s) => s.currentUser);
  const queryClient = useQueryClient();
  const [waiveTarget, setWaiveTarget] = useState<Fine | null>(null);
  const [waiverReason, setWaiverReason] = useState("");

  const { data: fines, isLoading } = useQuery({ queryKey: queryKeys.libraryFines(institutionId), queryFn: () => libraryService.listFines(institutionId) });

  const collectMutation = useMutation({
    mutationFn: (id: string) => libraryService.collectFine(id, currentUser?.name ?? "Librarian"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.libraryFines(institutionId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.libraryDashboard(institutionId) });
      toast.success("Fine collected");
    },
  });

  const waiveMutation = useMutation({
    mutationFn: () => libraryService.waiveFine(waiveTarget!.id, waiverReason, currentUser?.name ?? "Librarian"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.libraryFines(institutionId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.libraryDashboard(institutionId) });
      toast.success("Fine waived");
      setWaiveTarget(null);
      setWaiverReason("");
    },
  });

  if (isLoading) return <PageLoadingSkeleton />;

  const sorted = [...(fines ?? [])].sort((a, b) => b.createdDate.localeCompare(a.createdDate));

  return (
    <div>
      <AdminPageHeader title="Fines" description="Outstanding and resolved overdue fines." />
      {sorted.length === 0 ? (
        <EmptyState title="No fines recorded" icon={IndianRupee} />
      ) : (
        <div className="border-border rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">{getMember(f.membershipId)?.memberName}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{f.reason}</TableCell>
                  <TableCell>₹{f.assessedAmount}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={STATUS_TONE[f.status]}>
                      {f.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {f.status === "Outstanding" ? (
                      <div className="flex justify-end gap-1">
                        <Button variant="outline" size="sm" onClick={() => collectMutation.mutate(f.id)}>
                          Collect
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setWaiveTarget(f)}>
                          Waive
                        </Button>
                      </div>
                    ) : f.waiverReason ? (
                      <span className="text-muted-foreground text-xs">{f.waiverReason}</span>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!waiveTarget} onOpenChange={(open) => !open && setWaiveTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Waive fine</DialogTitle>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label>Reason (required)</Label>
            <Input value={waiverReason} onChange={(e) => setWaiverReason(e.target.value)} placeholder="e.g. First-time offense" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWaiveTarget(null)}>
              Cancel
            </Button>
            <Button disabled={!waiverReason.trim() || waiveMutation.isPending} onClick={() => waiveMutation.mutate()}>
              Confirm waiver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
