import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Hash } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useAuthStore } from "@/features/auth/authStore";
import { useCurrentMembership } from "@/features/library/useCurrentMembership";
import { libraryService } from "@/features/library/libraryService";
import { getBookTitle } from "@/mocks/data/library/bookTitles";
import { queryKeys } from "@/lib/queryKeys";
import type { BookingStatus } from "@/types";

const STATUS_TONE: Record<BookingStatus, string> = {
  Booked: "border-info/30 bg-info/10 text-info",
  Verified: "border-accent/30 bg-accent/10 text-accent",
  Issued: "border-success/30 bg-success/10 text-success",
  Returned: "bg-muted text-muted-foreground",
  Cancelled: "bg-muted text-muted-foreground",
  Expired: "border-destructive/30 bg-destructive/10 text-destructive",
};

export default function MyBookings() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const membership = useCurrentMembership();
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: queryKeys.myBookings(membership?.id ?? ""),
    queryFn: () => libraryService.listMyBookings(membership!.id),
    enabled: !!membership,
  });

  const cancelMutation = useMutation({
    mutationFn: (bookingId: string) => libraryService.cancelBooking(bookingId, "No longer needed", currentUser?.name ?? "Member"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myBookings(membership?.id ?? "") });
      toast.success("Booking cancelled");
    },
  });

  if (isLoading) return <PageLoadingSkeleton />;

  return (
    <div>
      <AdminPageHeader title="My Bookings" description="Present the Booking Number at the library desk to collect your book." />
      {!bookings || bookings.length === 0 ? (
        <EmptyState title="No bookings yet" description="Browse the catalogue to book a title." />
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <Card key={b.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{getBookTitle(b.titleId)?.title}</p>
                  <p className="text-muted-foreground flex items-center gap-1 font-mono text-xs">
                    <Hash className="size-3" /> {b.bookingNo}
                  </p>
                  <p className="text-muted-foreground text-xs">Booked {b.bookingDate} · Collect by {b.expiresAt}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={STATUS_TONE[b.status]}>
                    {b.status}
                  </Badge>
                  {b.status === "Booked" ? (
                    <Button variant="ghost" size="sm" onClick={() => cancelMutation.mutate(b.id)}>
                      Cancel
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
