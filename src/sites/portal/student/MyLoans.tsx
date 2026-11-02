import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useCurrentMembership } from "@/features/library/useCurrentMembership";
import { libraryService } from "@/features/library/libraryService";
import { getBookTitle } from "@/mocks/data/library/bookTitles";
import { queryKeys } from "@/lib/queryKeys";

const TODAY = "2026-10-29";

export default function MyLoans() {
  const membership = useCurrentMembership();
  const queryClient = useQueryClient();

  const { data: loans, isLoading } = useQuery({
    queryKey: queryKeys.myLoans(membership?.id ?? ""),
    queryFn: () => libraryService.listMyLoans(membership!.id),
    enabled: !!membership,
  });

  const renewMutation = useMutation({
    mutationFn: (loanId: string) => libraryService.renewLoan(loanId),
    onSuccess: (res) => {
      if (res.ok) {
        toast.success("Loan renewed", { description: `New due date: ${res.loan.dueDate}` });
        queryClient.invalidateQueries({ queryKey: queryKeys.myLoans(membership?.id ?? "") });
      } else {
        toast.error("Couldn't renew", { description: res.error });
      }
    },
  });

  if (isLoading) return <PageLoadingSkeleton />;

  return (
    <div>
      <AdminPageHeader title="My Loans" description="Books currently issued to you, and your loan history." />
      {!loans || loans.length === 0 ? (
        <EmptyState title="No loans yet" />
      ) : (
        <div className="space-y-3">
          {loans.map((l) => {
            const overdue = l.status !== "Returned" && l.dueDate < TODAY;
            return (
              <Card key={l.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{getBookTitle(l.titleId)?.title}</p>
                    <p className="text-muted-foreground text-xs">
                      Issued {l.issueDate} · {l.status === "Returned" ? `Returned ${l.returnDate}` : `Due ${l.dueDate}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        l.status === "Returned"
                          ? "bg-muted text-muted-foreground"
                          : overdue
                            ? "border-destructive/30 bg-destructive/10 text-destructive"
                            : "border-success/30 bg-success/10 text-success"
                      }
                    >
                      {l.status === "Returned" ? "Returned" : overdue ? "Overdue" : "Active"}
                    </Badge>
                    {l.status !== "Returned" ? (
                      <Button variant="ghost" size="sm" disabled={renewMutation.isPending} onClick={() => renewMutation.mutate(l.id)}>
                        Renew
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
