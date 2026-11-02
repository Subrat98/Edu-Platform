import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { BookOpen, Bookmark, IndianRupee, Megaphone } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { useAuthStore } from "@/features/auth/authStore";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { useCurrentMembership } from "@/features/library/useCurrentMembership";
import { libraryService } from "@/features/library/libraryService";
import { noticeService } from "@/features/notices/noticeService";
import { getBookTitle } from "@/mocks/data/library/bookTitles";
import { queryKeys } from "@/lib/queryKeys";

export default function StudentDashboard() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const { institutionId } = useInstitutionData();
  const membership = useCurrentMembership();

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
    </div>
  );
}
