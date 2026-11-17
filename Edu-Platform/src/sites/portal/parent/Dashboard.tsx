import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarCheck, CalendarDays, FileBadge, IndianRupee, Megaphone, Pencil, Trophy } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AvatarInitials } from "@/components/common/AvatarInitials";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useAuthStore } from "@/features/auth/authStore";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { studentService } from "@/features/students/studentService";
import { examinationService } from "@/features/examinations/examinationService";
import { financeService } from "@/features/finance/financeService";
import { noticeService } from "@/features/notices/noticeService";
import { leaveRequestService } from "@/features/academics/leaveRequestService";
import { certificateRequestService } from "@/features/students/certificateRequestService";
import { queryKeys } from "@/lib/queryKeys";
import type { CertificateType, Invoice, PaymentMode } from "@/types";

export default function ParentDashboard() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const { institutionId } = useInstitutionData();
  const guardianId = currentUser?.guardianId;
  const [childId, setChildId] = useState<string | null>(null);
  const [payDialog, setPayDialog] = useState<Invoice | null>(null);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<PaymentMode>("Online");
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ startDate: "", endDate: "", reason: "" });
  const [contactEditing, setContactEditing] = useState(false);
  const [contactForm, setContactForm] = useState({ phone: "", email: "" });
  const [certDialogOpen, setCertDialogOpen] = useState(false);
  const [certForm, setCertForm] = useState<{ type: CertificateType; reason: string }>({ type: "Bonafide Certificate", reason: "" });
  const queryClient = useQueryClient();

  const { data: children, isLoading: loadingChildren } = useQuery({
    queryKey: queryKeys.studentsByGuardian(guardianId ?? ""),
    queryFn: () => studentService.getByGuardian(guardianId!),
    enabled: !!guardianId,
  });

  const activeChildId = childId ?? children?.[0]?.id ?? null;
  const child = children?.find((c) => c.id === activeChildId) ?? null;

  const { data: attendance } = useQuery({ queryKey: queryKeys.studentAttendance(activeChildId ?? ""), queryFn: () => studentService.getAttendanceSummary(activeChildId!), enabled: !!activeChildId });
  const { data: results } = useQuery({ queryKey: queryKeys.studentResults(activeChildId ?? ""), queryFn: () => studentService.getResultsSummary(activeChildId!), enabled: !!activeChildId });
  const { data: invoices } = useQuery({ queryKey: queryKeys.studentFees(activeChildId ?? ""), queryFn: () => studentService.getFeeLedger(activeChildId!), enabled: !!activeChildId });
  const { data: exams } = useQuery({ queryKey: queryKeys.examinations(institutionId), queryFn: () => examinationService.list(institutionId) });
  const { data: notices } = useQuery({ queryKey: queryKeys.notices(institutionId), queryFn: () => noticeService.list(institutionId) });
  const { data: guardian } = useQuery({ queryKey: queryKeys.guardian(guardianId ?? ""), queryFn: () => studentService.getGuardian(guardianId!), enabled: !!guardianId });
  const { data: leaveRequests } = useQuery({ queryKey: queryKeys.leaveRequestsByStudent(activeChildId ?? ""), queryFn: () => leaveRequestService.listByStudent(activeChildId!), enabled: !!activeChildId });
  const { data: certRequests } = useQuery({
    queryKey: queryKeys.certificateRequestsByStudent(activeChildId ?? ""),
    queryFn: () => certificateRequestService.listByStudent(activeChildId!),
    enabled: !!activeChildId && institutionId === "school",
  });

  const publishedResults = useMemo(() => {
    const publishedExamIds = new Set((exams ?? []).filter((e) => e.status === "Published").map((e) => e.id));
    return (results ?? []).filter((m) => publishedExamIds.has(m.examinationId));
  }, [results, exams]);

  const payMutation = useMutation({
    mutationFn: () => financeService.recordPayment(payDialog!.id, Number(amount), mode, currentUser?.name ?? "Parent"),
    onSuccess: (res) => {
      if (res.ok) {
        toast.success("Payment recorded", { description: `Receipt ${res.payment.receiptNo}` });
        queryClient.invalidateQueries({ queryKey: queryKeys.studentFees(activeChildId ?? "") });
        setPayDialog(null);
        setAmount("");
      } else {
        toast.error(res.error);
      }
    },
  });

  const leaveMutation = useMutation({
    mutationFn: () => leaveRequestService.create({ studentId: activeChildId!, requestedBy: `${currentUser?.name} (${guardian?.relationship ?? "Guardian"})`, ...leaveForm }),
    onSuccess: (res) => {
      if (!res.ok) return toast.error(res.error);
      toast.success("Leave request submitted");
      queryClient.invalidateQueries({ queryKey: queryKeys.leaveRequestsByStudent(activeChildId ?? "") });
      setLeaveDialogOpen(false);
      setLeaveForm({ startDate: "", endDate: "", reason: "" });
    },
  });

  const contactMutation = useMutation({
    mutationFn: () => studentService.updateGuardianContact(guardianId!, contactForm, currentUser?.name ?? "Parent"),
    onSuccess: (res) => {
      if (!res.ok) return toast.error(res.error);
      toast.success("Contact details updated");
      queryClient.invalidateQueries({ queryKey: queryKeys.guardian(guardianId ?? "") });
      setContactEditing(false);
    },
  });

  const certMutation = useMutation({
    mutationFn: () => certificateRequestService.create(activeChildId!, certForm.type, certForm.reason, currentUser?.name ?? "Parent"),
    onSuccess: (res) => {
      if (!res.ok) return toast.error(res.error);
      toast.success(`${certForm.type} requested`);
      queryClient.invalidateQueries({ queryKey: queryKeys.certificateRequestsByStudent(activeChildId ?? "") });
      setCertDialogOpen(false);
      setCertForm({ type: "Bonafide Certificate", reason: "" });
    },
  });

  if (!guardianId) {
    return (
      <div>
        <AdminPageHeader title="Welcome" description="Your children's academic activity at a glance." />
        <EmptyState title="No guardian record linked" description="This demo persona isn't linked to a guardian record." />
      </div>
    );
  }

  if (loadingChildren) return <PageLoadingSkeleton />;
  if (!children || children.length === 0) return <EmptyState title="No children on record" />;

  const outstandingInvoices = (invoices ?? []).filter((i) => i.status !== "Paid");
  const totalOutstanding = outstandingInvoices.reduce((sum, i) => sum + (i.amount - i.concession - i.amountPaid), 0);

  return (
    <div>
      <AdminPageHeader title={`Welcome, ${currentUser?.name?.split(" ")[0] ?? "Parent"}`} description="Your children's attendance, results and fees." />

      {children.length > 1 ? (
        <Tabs value={activeChildId ?? undefined} onValueChange={setChildId} className="mb-6">
          <TabsList>
            {children.map((c) => (
              <TabsTrigger key={c.id} value={c.id} className="gap-1.5">
                <AvatarInitials name={c.name} size="sm" /> {c.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      ) : null}

      {child ? (
        <>
          <div className="mb-4 flex items-center gap-3">
            <AvatarInitials name={child.name} size="lg" />
            <div>
              <p className="font-heading text-lg font-semibold">{child.name}</p>
              <p className="text-muted-foreground text-sm">
                {child.classOrProgrammeName} ({child.section}) · Roll {child.rollNumber}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Attendance" value={`${attendance?.percentage ?? 0}%`} icon={CalendarCheck} tone={attendance && attendance.percentage < 75 ? "warning" : "success"} />
            <StatCard label="Published Results" value={new Set(publishedResults.map((r) => r.examinationId)).size} icon={Trophy} />
            <StatCard
              label="Fees Outstanding"
              value={`₹${totalOutstanding.toLocaleString("en-IN")}`}
              icon={IndianRupee}
              tone={totalOutstanding > 0 ? "warning" : "success"}
            />
            <StatCard label="Notices" value={(notices ?? []).length} icon={Megaphone} />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent attendance</CardTitle>
              </CardHeader>
              <CardContent>
                {(attendance?.recent ?? []).length === 0 ? (
                  <EmptyState title="No attendance recorded yet" />
                ) : (
                  <ul className="divide-border divide-y">
                    {(attendance?.recent ?? []).slice(0, 8).map((r) => (
                      <li key={r.id} className="flex items-center justify-between py-2 text-sm">
                        <span className="text-muted-foreground">{r.date}</span>
                        <Badge variant="outline">{r.status}</Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Published results</CardTitle>
              </CardHeader>
              <CardContent>
                {publishedResults.length === 0 ? (
                  <EmptyState title="No results published yet" description="Results appear here once the school publishes them." />
                ) : (
                  <ul className="divide-border divide-y">
                    {publishedResults.map((m) => (
                      <li key={m.id} className="flex items-center justify-between py-2 text-sm">
                        <span>{m.subject}</span>
                        <span className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            {m.marksObtained}/{m.maxMarks}
                          </span>
                          <Badge variant="outline">{m.grade}</Badge>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Fee ledger</CardTitle>
              </CardHeader>
              <CardContent>
                {(invoices ?? []).length === 0 ? (
                  <EmptyState title="No invoices on record" />
                ) : (
                  <ul className="divide-border divide-y">
                    {(invoices ?? []).map((inv) => {
                      const balance = inv.amount - inv.concession - inv.amountPaid;
                      return (
                        <li key={inv.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                          <div>
                            <p className="font-medium">{inv.description}</p>
                            <p className="text-muted-foreground text-xs">
                              ₹{inv.amountPaid} of ₹{inv.amount - inv.concession} paid · Due {inv.dueDate}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{inv.status}</Badge>
                            {balance > 0 ? (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setPayDialog(inv);
                                  setAmount(String(balance));
                                }}
                              >
                                Pay Now
                              </Button>
                            ) : null}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CalendarDays className="size-4" /> Leave requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(leaveRequests ?? []).length === 0 ? (
                  <p className="text-muted-foreground text-sm">No leave requests yet.</p>
                ) : (
                  <ul className="divide-border divide-y">
                    {(leaveRequests ?? []).map((r) => (
                      <li key={r.id} className="flex items-center justify-between py-2 text-sm">
                        <span>
                          {r.startDate} → {r.endDate}
                        </span>
                        <Badge
                          variant="outline"
                          className={
                            r.status === "Approved"
                              ? "border-success/30 bg-success/10 text-success"
                              : r.status === "Rejected"
                                ? "border-destructive/30 text-destructive"
                                : "border-warning/30 bg-warning/10 text-warning"
                          }
                        >
                          {r.status}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
                <Button size="sm" variant="outline" className="mt-3" onClick={() => setLeaveDialogOpen(true)}>
                  Submit leave request
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Pencil className="size-4" /> Contact details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {contactEditing ? (
                  <div className="space-y-3">
                    <div>
                      <Label>Phone</Label>
                      <Input className="mt-1.5" value={contactForm.phone} onChange={(e) => setContactForm((f) => ({ ...f, phone: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input className="mt-1.5" value={contactForm.email} onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))} />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => contactMutation.mutate()} disabled={contactMutation.isPending}>
                        {contactMutation.isPending ? "Saving…" : "Save"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setContactEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5 text-sm">
                    <p>
                      <span className="text-muted-foreground">Phone:</span> {guardian?.phone}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Email:</span> {guardian?.email}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => {
                        setContactForm({ phone: guardian?.phone ?? "", email: guardian?.email ?? "" });
                        setContactEditing(true);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {institutionId === "school" ? (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileBadge className="size-4" /> Certificate requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(certRequests ?? []).length === 0 ? (
                    <p className="text-muted-foreground text-sm">No certificate requests yet.</p>
                  ) : (
                    <ul className="divide-border divide-y">
                      {(certRequests ?? []).map((r) => (
                        <li key={r.id} className="flex items-center justify-between py-2 text-sm">
                          <span>{r.type}</span>
                          <Badge
                            variant="outline"
                            className={
                              r.status === "Issued"
                                ? "border-success/30 bg-success/10 text-success"
                                : r.status === "Rejected"
                                  ? "border-destructive/30 text-destructive"
                                  : "border-warning/30 bg-warning/10 text-warning"
                            }
                          >
                            {r.status}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Button size="sm" variant="outline" className="mt-3" onClick={() => setCertDialogOpen(true)}>
                    Request a certificate
                  </Button>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </>
      ) : null}

      <Dialog open={!!payDialog} onOpenChange={(open) => !open && setPayDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay {payDialog?.description}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Amount (₹)</Label>
              <Input type="number" className="mt-1.5" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div>
              <Label>Payment Mode</Label>
              <Select value={mode} onValueChange={(v) => setMode(v as PaymentMode)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayDialog(null)}>
              Cancel
            </Button>
            <Button onClick={() => payMutation.mutate()} disabled={payMutation.isPending || !amount}>
              {payMutation.isPending ? "Processing…" : "Pay"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit leave request — {child?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>From</Label>
                <Input type="date" className="mt-1.5" value={leaveForm.startDate} onChange={(e) => setLeaveForm((f) => ({ ...f, startDate: e.target.value }))} />
              </div>
              <div>
                <Label>To</Label>
                <Input type="date" className="mt-1.5" value={leaveForm.endDate} onChange={(e) => setLeaveForm((f) => ({ ...f, endDate: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label>Reason</Label>
              <Textarea className="mt-1.5" rows={2} value={leaveForm.reason} onChange={(e) => setLeaveForm((f) => ({ ...f, reason: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLeaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => leaveMutation.mutate()} disabled={leaveMutation.isPending || !leaveForm.startDate || !leaveForm.endDate}>
              {leaveMutation.isPending ? "Submitting…" : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={certDialogOpen} onOpenChange={setCertDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request a certificate — {child?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Certificate type</Label>
              <Select value={certForm.type} onValueChange={(v) => setCertForm((f) => ({ ...f, type: v as CertificateType }))}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bonafide Certificate">Bonafide Certificate</SelectItem>
                  <SelectItem value="Transfer Certificate">Transfer Certificate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Reason</Label>
              <Textarea className="mt-1.5" rows={2} value={certForm.reason} onChange={(e) => setCertForm((f) => ({ ...f, reason: e.target.value }))} placeholder="e.g. Required for passport application" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCertDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => certMutation.mutate()} disabled={certMutation.isPending}>
              {certMutation.isPending ? "Submitting…" : "Submit request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
