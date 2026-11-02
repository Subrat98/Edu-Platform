import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { BookOpen, Repeat, AlertTriangle, Bookmark, ScanLine, IndianRupee } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { libraryService } from "@/features/library/libraryService";
import { queryKeys } from "@/lib/queryKeys";

export default function LibrarianDashboard() {
  const { institutionId } = useInstitutionData();
  const { data: stats } = useQuery({ queryKey: queryKeys.libraryDashboard(institutionId), queryFn: () => libraryService.getDashboardStats(institutionId) });
  const { data: bookings } = useQuery({ queryKey: queryKeys.libraryBookings(institutionId), queryFn: () => libraryService.listBookings(institutionId) });

  const awaitingCollection = (bookings ?? []).filter((b) => b.status === "Booked" || b.status === "Verified").slice(0, 6);

  return (
    <div>
      <AdminPageHeader
        title="Librarian Dashboard"
        description="Circulation overview for today."
        actions={
          <Button asChild className="gap-1.5">
            <Link to="/portal/librarian/verify">
              <ScanLine className="size-4" /> Verify a Booking
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Titles" value={stats?.totalTitles ?? "—"} icon={BookOpen} />
        <StatCard label="Available Copies" value={stats?.availableCopies ?? "—"} icon={BookOpen} />
        <StatCard label="Active Loans" value={stats?.activeLoans ?? "—"} icon={Repeat} />
        <StatCard label="Overdue" value={stats?.overdueLoans ?? "—"} icon={AlertTriangle} tone="error" />
        <StatCard label="Awaiting Collection" value={stats?.bookingsAwaitingCollection ?? "—"} icon={Bookmark} />
        <StatCard label="Outstanding Fines" value={stats ? `₹${stats.outstandingFines}` : "—"} icon={IndianRupee} tone="warning" />
        <StatCard label="Fines Collected" value={stats ? `₹${stats.finesCollected}` : "—"} icon={IndianRupee} tone="success" />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Bookings awaiting collection</CardTitle>
        </CardHeader>
        <CardContent>
          {awaitingCollection.length === 0 ? (
            <p className="text-muted-foreground text-sm">No bookings currently awaiting collection.</p>
          ) : (
            <ul className="divide-border divide-y">
              {awaitingCollection.map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <div>
                    <p className="font-mono text-xs">{b.bookingNo}</p>
                    <p className="text-muted-foreground text-xs">Expires {b.expiresAt}</p>
                  </div>
                  <Badge variant="outline">{b.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
