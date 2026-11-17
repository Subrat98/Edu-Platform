import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Search, IndianRupee, Receipt as ReceiptIcon, CheckCircle2, AlertTriangle } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { useAuthStore } from "@/features/auth/authStore";
import { financeService } from "@/features/finance/financeService";
import { getStudent } from "@/mocks/data/erp/studentsGuardians";
import { queryKeys } from "@/lib/queryKeys";
import type { Invoice, InvoiceStatus, PaymentMode } from "@/types";

const STATUS_TONE: Record<InvoiceStatus, string> = {
  Paid: "border-success/30 bg-success/10 text-success",
  "Partially Paid": "border-warning/30 bg-warning/10 text-warning",
  Unpaid: "bg-muted text-muted-foreground",
  Overdue: "border-destructive/30 bg-destructive/10 text-destructive",
};

export default function InvoicesList() {
  const { institutionId } = useInstitutionData();
  const currentUser = useAuthStore((s) => s.currentUser);
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<InvoiceStatus | "All">("All");
  const [payTarget, setPayTarget] = useState<Invoice | null>(null);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<PaymentMode>("Cash");

  const { data: invoices, isLoading } = useQuery({ queryKey: queryKeys.invoices(institutionId), queryFn: () => financeService.listInvoices(institutionId) });
  const { data: stats } = useQuery({ queryKey: queryKeys.financeStats(institutionId), queryFn: () => financeService.getDashboardStats(institutionId) });

  const payMutation = useMutation({
    mutationFn: () => financeService.recordPayment(payTarget!.id, Number(amount), mode, currentUser?.name ?? "Accountant"),
    onSuccess: (res) => {
      if (res.ok) {
        toast.success("Payment recorded", { description: `Receipt ${res.payment.receiptNo}` });
        queryClient.invalidateQueries({ queryKey: queryKeys.invoices(institutionId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.financeStats(institutionId) });
        setPayTarget(null);
        setAmount("");
      } else {
        toast.error("Couldn't record payment", { description: res.error });
      }
    },
  });

  const filtered = useMemo(() => {
    let list = invoices ?? [];
    if (status !== "All") list = list.filter((i) => i.status === status);
    if (search) {
      list = list.filter((i) => {
        const studentName = getStudent(i.studentId)?.name ?? "";
        return studentName.toLowerCase().includes(search.toLowerCase()) || i.invoiceNo.toLowerCase().includes(search.toLowerCase());
      });
    }
    return list;
  }, [invoices, status, search]);

  if (isLoading) return <PageLoadingSkeleton />;

  return (
    <div>
      <AdminPageHeader title="Invoices" description="Student fee invoices, concessions and payment recording." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Due" value={`₹${(stats?.totalDue ?? 0).toLocaleString("en-IN")}`} icon={IndianRupee} />
        <StatCard label="Collected" value={`₹${(stats?.totalCollected ?? 0).toLocaleString("en-IN")}`} icon={CheckCircle2} tone="success" />
        <StatCard label="Outstanding" value={`₹${(stats?.outstanding ?? 0).toLocaleString("en-IN")}`} icon={AlertTriangle} tone="warning" />
        <StatCard label="Overdue Invoices" value={stats?.overdueCount ?? 0} icon={ReceiptIcon} tone="error" />
      </div>

      <div className="my-4 flex flex-wrap gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input placeholder="Search by student or invoice no…" className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as InvoiceStatus | "All")}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All statuses</SelectItem>
            {(["Paid", "Partially Paid", "Unpaid", "Overdue"] as InvoiceStatus[]).map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No invoices found" />
      ) : (
        <div className="border-border rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice No.</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.slice(0, 100).map((inv) => {
                const balance = inv.amount - inv.concession - inv.amountPaid;
                return (
                  <TableRow key={inv.id}>
                    <TableCell className="font-mono text-xs">{inv.invoiceNo}</TableCell>
                    <TableCell className="font-medium">{getStudent(inv.studentId)?.name ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{inv.description}</TableCell>
                    <TableCell>₹{(inv.amount - inv.concession).toLocaleString("en-IN")}</TableCell>
                    <TableCell className={balance > 0 ? "text-destructive" : "text-success"}>₹{balance.toLocaleString("en-IN")}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={STATUS_TONE[inv.status]}>
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {balance > 0 ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setPayTarget(inv);
                            setAmount(String(balance));
                          }}
                        >
                          Record Payment
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!payTarget} onOpenChange={(open) => !open && setPayTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record payment — {payTarget?.invoiceNo}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Amount (₹)</Label>
              <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Payment mode</Label>
              <Select value={mode} onValueChange={(v) => setMode(v as PaymentMode)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["Cash", "Online", "Bank Transfer", "Cheque"] as PaymentMode[]).map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayTarget(null)}>
              Cancel
            </Button>
            <Button disabled={!amount || payMutation.isPending} onClick={() => payMutation.mutate()}>
              {payMutation.isPending ? "Recording…" : "Record & Issue Receipt"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
