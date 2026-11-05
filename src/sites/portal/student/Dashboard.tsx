import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { BookOpen, Bookmark, CalendarDays, IndianRupee, Megaphone } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/common/EmptyState";
import { useAuthStore } from "@/features/auth/authStore";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { useCurrentMembership } from "@/features/library/useCurrentMembership";
import { libraryService } from "@/features/library/libraryService";
import { noticeService } from "@/features/notices/noticeService";
import { leaveRequestService } from "@/features/academics/leaveRequestService";
import { getBookTitle } from "@/mocks/data/library/bookTitles";
import { queryKeys } from "@/lib/queryKeys";

export default function StudentDashboard() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const { institutionId } = useInstitutionData();
  const membership = useCurrentMembership();
  const studentId = currentUser?.studentId;
  const queryClient = useQueryClient();
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ startDate: "", endDate: "", reason: "" });

  const { data: leaveRequests } = useQuery({
    queryKey: queryKeys.leaveRequestsByStudent(studentId ?? ""),
    queryFn: () => leaveRequestService.listByStudent(studentId!),
    enabled: !!studentId,
  });

  const leaveMutation = useMutation({
    mutationFn: () => leaveRequestService.create({ studentId: studentId!, requestedBy: currentUser?.name ?? "Student", ...leaveForm }),
    onSuccess: (res) => {
      if (!res.ok) return toast.error(res.error);
      toast.success("Leave request submitted");
      queryClient.invalidateQueries({ queryKey: queryKeys.leaveRequestsByStudent(studentId ?? "") });
      setLeaveDialogOpen(false);
      setLeaveForm({ startDate: "", endDate: "", reason: "" });
    },
  });

  const { data: loans } = useQuery({
    queryKey: queryKeys.myLoans(membership?.id ?? ""),
    queryFn: () => libraryService.listMyLoans(membership!.id),
    enabled: !!membership,
  });
  const { data: fines } = useQuery({
    queryKey: queryKeys.myFines(membership?.id ?? ""),
    queryFn: () => libraryService.listMyFines(membership!.id),
    enabled: !!membership,
  });
  const { data: bookings } = useQuery({
    queryKey: queryKeys.myBookings(membership?.id ?? ""),
    queryFn: () => libraryService.listMyBookings(membership!.id),
    enabled: !!membership,
  });
  const { data: notices } = useQuery({ queryKey: queryKeys.notices(institutionId), queryFn: () => noticeService.list(institutionId) });

  const activeLoans = (loans ?? []).filter((l) => l.status !== "Returned");
  const outstandingFines = (fines ?? []).filter((f) => f.status === "Outstanding");
  const pendingBookings = (bookings ?? []).filter((b) => b.status === "Booked" || b.status === "Verified");

  return (
    <div>
      <AdminPageHeader title={`Welcome, ${currentUser?.name?.split(" ")[0] ?? "Student"}`} description="Your library activity at a glance." />

      {studentId ? (
        <Card className="mb-6">
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
      ) : null}

      {!membership ? (
        <EmptyState title="No library membership found" description="This demo persona isn't linked to a library membership record." />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Active Loans" value={activeLoans.length} icon={BookOpen} />
            <StatCard label="Pending Bookings" value={pendingBookings.length} icon={Bookmark} />
            <StatCard
              label="Outstanding Fines"
              value={`₹${outstandingFines.reduce((s, f) => s + f.outstandingAmount, 0)}`}
              icon={IndianRupee}
              tone={outstandingFines.length ? "warning" : "default"}
            />
            <StatCard label="Membership" value={membership.status} icon={BookOpen} tone={membership.status === "Active" ? "success" : "error"} />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Current loans</CardTitle>
              </CardHeader>
              <CardContent>
                {activeLoans.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No active loans.</p>
                ) : (
                  <ul className="divide-border divide-y">
                    {activeLoans.map((l) => (
                      <li key={l.id} className="flex items-center justify-between gap-2 py-2 text-sm">
                        <span className="truncate">{getBookTitle(l.titleId)?.title}</span>
                        <Badge variant="outline" className={l.dueDate < "2026-10-29" ? "border-destructive/30 text-destructive" : ""}>
                          Due {l.dueDate}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
                <Button asChild variant="link" size="sm" className="mt-2 px-0">
                  <Link to="/portal/student/library/loans">View all loans →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Megaphone className="size-4" /> Latest notices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="divide-border divide-y">
                  {(notices ?? []).slice(0, 4).map((n) => (
                    <li key={n.id} className="py-2 text-sm">
                      {n.title}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Button asChild className="gap-1.5">
              <Link to="/portal/student/library">
                <BookOpen className="size-4" /> Browse library catalogue
              </Link>
            </Button>
          </div>
        </>
      )}

      <Dialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit leave request</DialogTitle>
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
    </div>
  );
}
