import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, BookOpen, CheckCircle2, Hash } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { useCurrentMembership } from "@/features/library/useCurrentMembership";
import { libraryService } from "@/features/library/libraryService";
import { queryKeys } from "@/lib/queryKeys";

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const { institutionId } = useInstitutionData();
  const membership = useCurrentMembership();
  const queryClient = useQueryClient();
  const [bookingNo, setBookingNo] = useState<string | null>(null);

  const { data: entry, isLoading } = useQuery({
    queryKey: queryKeys.catalogueEntry(id ?? ""),
    queryFn: () => libraryService.getCatalogueEntry(id!),
    enabled: !!id,
  });

  const bookMutation = useMutation({
    mutationFn: () => libraryService.createBooking(institutionId, membership!.id, id!),
    onSuccess: (res) => {
      if (res.ok) {
        setBookingNo(res.booking.bookingNo);
        toast.success("Booking created", { description: "Present this Booking Number at the library desk." });
        queryClient.invalidateQueries({ queryKey: queryKeys.catalogueEntry(id ?? "") });
        queryClient.invalidateQueries({ queryKey: queryKeys.myBookings(membership?.id ?? "") });
      } else {
        toast.error("Couldn't create booking", { description: res.error });
      }
    },
  });

  const reserveMutation = useMutation({
    mutationFn: () => libraryService.createReservation(institutionId, membership!.id, id!),
    onSuccess: (res) => {
      if (res.ok) toast.success("Added to reservation queue", { description: `Queue position #${res.reservation.queuePosition}` });
    },
  });

  if (isLoading) return <PageLoadingSkeleton />;
  if (!entry) return <EmptyState title="Book not found" />;

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 gap-1.5">
        <Link to="/portal/student/library">
          <ArrowLeft className="size-4" /> Back to catalogue
        </Link>
      </Button>

      <AdminPageHeader title={entry.title.title} description={entry.title.authors} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[200px_1fr]">
        <div
          className="flex h-56 items-center justify-center rounded-xl text-white"
          style={{ backgroundColor: entry.title.coverColor }}
        >
          <BookOpen className="size-10 opacity-70" />
        </div>

        <Card>
          <CardContent className="space-y-3 pt-6">
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground text-xs">Publisher</dt>
                <dd>{entry.title.publisher}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">Edition</dt>
                <dd>{entry.title.edition}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">ISBN</dt>
                <dd>{entry.title.isbn}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">Category</dt>
                <dd>
                  <Badge variant="secondary">{entry.title.category}</Badge>
                </dd>
              </div>
            </dl>

            <p className="text-sm">
              {entry.availableCount > 0 ? (
                <span className="text-success font-medium">{entry.availableCount} of {entry.totalCount} copies available</span>
              ) : (
                <span className="text-destructive font-medium">All {entry.totalCount} copies are currently on loan</span>
              )}
            </p>

            {entry.title.isReference ? (
              <p className="text-muted-foreground text-sm">This is a reference title — library use only, not available for booking.</p>
            ) : !membership ? (
              <p className="text-muted-foreground text-sm">Log in with a student or faculty account to book this title.</p>
            ) : bookingNo ? (
              <div className="border-success/30 bg-success/5 flex items-center gap-3 rounded-lg border p-4">
                <CheckCircle2 className="text-success size-6 shrink-0" />
                <div>
                  <p className="font-medium">Booking confirmed</p>
                  <p className="flex items-center gap-1 font-mono text-sm">
                    <Hash className="size-3.5" /> {bookingNo}
                  </p>
                </div>
              </div>
            ) : entry.availableCount > 0 ? (
              <Button onClick={() => bookMutation.mutate()} disabled={bookMutation.isPending}>
                {bookMutation.isPending ? "Booking…" : "Book Now"}
              </Button>
            ) : (
              <Button variant="outline" onClick={() => reserveMutation.mutate()} disabled={reserveMutation.isPending}>
                {reserveMutation.isPending ? "Adding…" : "Join Reservation Queue"}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
