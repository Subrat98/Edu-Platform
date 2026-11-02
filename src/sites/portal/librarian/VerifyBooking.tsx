import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ScanLine, CheckCircle2, XCircle, User, BookOpen, Hash, CalendarClock } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { useAuthStore } from "@/features/auth/authStore";
import { libraryService, type BookingVerificationResult } from "@/features/library/libraryService";
import { queryKeys } from "@/lib/queryKeys";
import { cn } from "@/lib/utils";

export default function VerifyBooking() {
  const { institutionId } = useInstitutionData();
  const currentUser = useAuthStore((s) => s.currentUser);
  const queryClient = useQueryClient();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<BookingVerificationResult | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const verifyMutation = useMutation({
    mutationFn: () => libraryService.verifyBookingNumber(input, institutionId),
    onSuccess: (res) => setResult(res),
  });

  const issueMutation = useMutation({
    mutationFn: () => libraryService.issueBooking(result!.booking!.id, currentUser?.name ?? "Librarian"),
    onSuccess: (res) => {
      if (res.ok) {
        toast.success("Book issued", { description: `Loan due on ${res.loan.dueDate}.` });
        setResult(null);
        setInput("");
        queryClient.invalidateQueries({ queryKey: queryKeys.libraryDashboard(institutionId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.libraryBookings(institutionId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.libraryLoans(institutionId) });
      } else {
        toast.error("Couldn't issue the book", { description: res.error });
      }
      setConfirmOpen(false);
    },
  });

  function handleVerify() {
    if (!input.trim()) return;
    verifyMutation.mutate();
  }

  return (
    <div>
      <AdminPageHeader title="Verify Booking Number" description="Enter the Booking Number a student presents at the desk." />

      <Card className="mx-auto max-w-xl">
        <CardContent className="space-y-4 pt-6">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              placeholder="BK-2026-000001"
              className="font-mono"
              autoFocus
            />
            <Button onClick={handleVerify} disabled={verifyMutation.isPending} className="gap-1.5 shrink-0">
              <ScanLine className="size-4" /> {verifyMutation.isPending ? "Checking…" : "Verify"}
            </Button>
          </div>

          {result ? (
            <div
              className={cn(
                "rounded-lg border p-4",
                result.valid ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5",
              )}
            >
              <div className="flex items-center gap-2 font-medium">
                {result.valid ? (
                  <CheckCircle2 className="text-success size-5" />
                ) : (
                  <XCircle className="text-destructive size-5" />
                )}
                <span>{result.valid ? "Valid booking — ready to issue" : result.reason}</span>
              </div>

              {result.booking ? (
                <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <User className="text-muted-foreground mt-0.5 size-4" />
                    <div>
                      <dt className="text-muted-foreground text-xs">Student</dt>
                      <dd className="font-medium">{result.member?.memberName ?? "—"}</dd>
                      <dd className="text-muted-foreground text-xs">{result.member?.membershipNo}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <BookOpen className="text-muted-foreground mt-0.5 size-4" />
                    <div>
                      <dt className="text-muted-foreground text-xs">Book</dt>
                      <dd className="font-medium">{result.title?.title ?? "—"}</dd>
                      <dd className="text-muted-foreground text-xs">Accession: {result.copy?.accessionNo}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Hash className="text-muted-foreground mt-0.5 size-4" />
                    <div>
                      <dt className="text-muted-foreground text-xs">Booking Number</dt>
                      <dd className="font-mono font-medium">{result.booking.bookingNo}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CalendarClock className="text-muted-foreground mt-0.5 size-4" />
                    <div>
                      <dt className="text-muted-foreground text-xs">Booking Date / Expires</dt>
                      <dd className="font-medium">
                        {result.booking.bookingDate} <Badge variant="outline" className="ml-1">{result.booking.status}</Badge>
                      </dd>
                    </div>
                  </div>
                </dl>
              ) : null}

              {result.valid ? (
                <Button className="mt-4 w-full" onClick={() => setConfirmOpen(true)}>
                  Confirm &amp; Issue Book
                </Button>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Issue this book?</AlertDialogTitle>
            <AlertDialogDescription>
              "{result?.title?.title}" will be issued to {result?.member?.memberName}. This creates a loan and marks the
              booking as issued — it cannot be undone from this screen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => issueMutation.mutate()} disabled={issueMutation.isPending}>
              {issueMutation.isPending ? "Issuing…" : "Issue Book"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
