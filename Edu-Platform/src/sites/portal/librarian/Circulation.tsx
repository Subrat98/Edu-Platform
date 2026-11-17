import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RotateCw, Undo2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { useAuthStore } from "@/features/auth/authStore";
import { libraryService } from "@/features/library/libraryService";
import { getBookTitle } from "@/mocks/data/library/bookTitles";
import { getMember } from "@/mocks/data/library/members";
import { queryKeys } from "@/lib/queryKeys";

const TODAY = "2026-10-29";

export default function Circulation() {
  const { institutionId } = useInstitutionData();
  const currentUser = useAuthStore((s) => s.currentUser);
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("active");

  const { data: loans, isLoading } = useQuery({ queryKey: queryKeys.libraryLoans(institutionId), queryFn: () => libraryService.listLoans(institutionId) });

  const active = useMemo(() => (loans ?? []).filter((l) => l.status === "Active" && l.dueDate >= TODAY), [loans]);
  const overdue = useMemo(() => (loans ?? []).filter((l) => l.status === "Overdue" || (l.status === "Active" && l.dueDate < TODAY)), [loans]);
  const returned = useMemo(() => (loans ?? []).filter((l) => l.status === "Returned"), [loans]);

  const returnMutation = useMutation({
    mutationFn: (loanId: string) => libraryService.returnLoan(loanId, currentUser?.name ?? "Librarian"),
    onSuccess: (res) => {
      if (res.ok) {
        toast.success("Book returned", res.fine ? { description: `Overdue fine of ₹${res.fine.assessedAmount} assessed.` } : undefined);
        queryClient.invalidateQueries({ queryKey: queryKeys.libraryLoans(institutionId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.libraryDashboard(institutionId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.libraryFines(institutionId) });
      } else {
        toast.error(res.error);
      }
    },
  });

  const renewMutation = useMutation({
    mutationFn: (loanId: string) => libraryService.renewLoan(loanId),
    onSuccess: (res) => {
      if (res.ok) {
        toast.success("Loan renewed", { description: `New due date: ${res.loan.dueDate}` });
        queryClient.invalidateQueries({ queryKey: queryKeys.libraryLoans(institutionId) });
      } else {
        toast.error("Couldn't renew", { description: res.error });
      }
    },
  });

  if (isLoading) return <PageLoadingSkeleton />;

  function renderTable(list: typeof active, showActions: boolean) {
    if (list.length === 0) return <EmptyState title="Nothing here" />;
    return (
      <div className="border-border rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Book</TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Issued</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Status</TableHead>
              {showActions ? <TableHead className="text-right">Actions</TableHead> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell className="font-medium">{getBookTitle(loan.titleId)?.title ?? loan.titleId}</TableCell>
                <TableCell>{getMember(loan.membershipId)?.memberName ?? loan.membershipId}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{loan.issueDate}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{loan.dueDate}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      loan.status === "Returned"
                        ? "bg-muted text-muted-foreground"
                        : loan.dueDate < TODAY
                          ? "border-destructive/30 bg-destructive/10 text-destructive"
                          : "border-success/30 bg-success/10 text-success"
                    }
                  >
                    {loan.status === "Returned" ? "Returned" : loan.dueDate < TODAY ? "Overdue" : "Active"}
                  </Badge>
                </TableCell>
                {showActions ? (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1"
                        disabled={renewMutation.isPending}
                        onClick={() => renewMutation.mutate(loan.id)}
                      >
                        <RotateCw className="size-3.5" /> Renew
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        disabled={returnMutation.isPending}
                        onClick={() => returnMutation.mutate(loan.id)}
                      >
                        <Undo2 className="size-3.5" /> Return
                      </Button>
                    </div>
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader title="Circulation" description="Active loans, overdue items and return history." />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({overdue.length})</TabsTrigger>
          <TabsTrigger value="returned">Returned</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4">
          {renderTable(active, true)}
        </TabsContent>
        <TabsContent value="overdue" className="mt-4">
          {renderTable(overdue, true)}
        </TabsContent>
        <TabsContent value="returned" className="mt-4">
          {renderTable(returned, false)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
