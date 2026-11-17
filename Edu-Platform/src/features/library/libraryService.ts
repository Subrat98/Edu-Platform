import { mockRequest } from "@/mocks/api/client";
import {
  allBookings,
  allLoans,
  allReservations,
  allFines,
  allLibraryAuditEvents,
  getBookTitlesByInstitution,
  getBookTitle,
  getCopiesByTitle,
  getCopy,
  setCopyStatus,
  getCopiesByInstitution,
  getMembersByInstitution,
  getMember,
  getBookingsByInstitution,
  getLoansByInstitution,
  getReservationsByInstitution,
  getFinesByInstitution,
  getAuditEventsByInstitution,
  getBookingsByMember,
  getLoansByMember,
  getFinesByMember,
  findBookingByNumber,
  librarySettings,
} from "@/mocks/data/library";
import type {
  Booking,
  BookCopy,
  BookTitle,
  Fine,
  InstitutionType,
  Loan,
  LibraryAuditEvent,
  LibraryMembership,
  Reservation,
} from "@/types";

const TODAY = new Date().toISOString().slice(0, 10);

function nextBookingNo(): string {
  return `BK-2026-${String(allBookings.length + 1).padStart(6, "0")}`;
}

function logAudit(event: Omit<LibraryAuditEvent, "id">) {
  allLibraryAuditEvents.unshift({ id: `audit-live-${Date.now()}`, ...event });
}

export interface CatalogueEntry {
  title: BookTitle;
  copies: BookCopy[];
  availableCount: number;
  totalCount: number;
}

function buildCatalogueEntry(title: BookTitle): CatalogueEntry {
  const copies = getCopiesByTitle(title.id);
  return {
    title,
    copies,
    availableCount: copies.filter((c) => c.status === "Available").length,
    totalCount: copies.length,
  };
}

export interface BookingVerificationResult {
  valid: boolean;
  reason?: string;
  booking?: Booking;
  member?: LibraryMembership;
  title?: BookTitle;
  copy?: BookCopy;
}

function daysBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}

export const libraryService = {
  // ---- Catalogue ----
  listCatalogue: (institutionId: InstitutionType, search = "") =>
    mockRequest<CatalogueEntry[]>(() => {
      const titles = getBookTitlesByInstitution(institutionId);
      const filtered = search
        ? titles.filter(
            (t) =>
              t.title.toLowerCase().includes(search.toLowerCase()) ||
              t.authors.toLowerCase().includes(search.toLowerCase()) ||
              t.isbn.includes(search),
          )
        : titles;
      return filtered.map(buildCatalogueEntry);
    }),

  getCatalogueEntry: (titleId: string) =>
    mockRequest<CatalogueEntry | null>(() => {
      const title = getBookTitle(titleId);
      return title ? buildCatalogueEntry(title) : null;
    }),

  listAllCopies: (institutionId: InstitutionType) =>
    mockRequest<BookCopy[]>(() => getCopiesByInstitution(institutionId)),

  // ---- Members ----
  listMembers: (institutionId: InstitutionType) =>
    mockRequest<LibraryMembership[]>(() => getMembersByInstitution(institutionId)),

  // ---- Student-facing bookings ----
  listMyBookings: (membershipId: string) =>
    mockRequest<Booking[]>(() => [...getBookingsByMember(membershipId)].sort((a, b) => b.bookingDate.localeCompare(a.bookingDate))),

  listMyLoans: (membershipId: string) =>
    mockRequest<Loan[]>(() => [...getLoansByMember(membershipId)].sort((a, b) => b.issueDate.localeCompare(a.issueDate))),

  listMyFines: (membershipId: string) => mockRequest<Fine[]>(() => getFinesByMember(membershipId)),

  createBooking: (institutionId: InstitutionType, membershipId: string, titleId: string) =>
    mockRequest<{ ok: true; booking: Booking } | { ok: false; error: string }>(
      () => {
        const member = getMember(membershipId);
        if (!member || member.status !== "Active") return { ok: false, error: "Membership is not active." };

        const activeLoans = getLoansByMember(membershipId).filter((l) => l.status !== "Returned").length;
        const activeBookings = getBookingsByMember(membershipId).filter(
          (b) => b.status === "Booked" || b.status === "Verified",
        ).length;
        if (activeLoans + activeBookings >= member.maxLoans) {
          return { ok: false, error: `Loan limit reached (${member.maxLoans} items). Return a book before booking another.` };
        }

        const copies = getCopiesByTitle(titleId);
        const available = copies.find((c) => c.status === "Available");
        if (!available) return { ok: false, error: "No copies currently available for booking." };

        const settings = librarySettings[institutionId];
        const booking: Booking = {
          id: `booking-live-${Date.now()}`,
          institutionId,
          bookingNo: nextBookingNo(),
          membershipId,
          copyId: available.id,
          titleId,
          bookingDate: TODAY,
          expiresAt: addDays(TODAY, settings.bookingCollectionDeadlineDays),
          status: "Booked",
        };
        allBookings.unshift(booking);
        setCopyStatus(available.id, "Reserved");
        logAudit({
          institutionId,
          action: "Booking Created",
          actor: member.memberName,
          timestamp: `${TODAY}T00:00:00`,
          bookingNo: booking.bookingNo,
          memberName: member.memberName,
          bookTitle: getBookTitle(titleId)?.title,
        });
        return { ok: true, booking };
      },
      { latencyMs: [400, 800] },
    ),

  cancelBooking: (bookingId: string, reason: string, actor: string) =>
    mockRequest<{ ok: true } | { ok: false; error: string }>(() => {
      const booking = allBookings.find((b) => b.id === bookingId);
      if (!booking) return { ok: false, error: "Booking not found." };
      if (booking.status !== "Booked" && booking.status !== "Verified") {
        return { ok: false, error: "Only an active booking can be cancelled." };
      }
      booking.status = "Cancelled";
      booking.cancellationReason = reason;
      booking.cancelledBy = actor;
      setCopyStatus(booking.copyId, "Available");
      const member = getMember(booking.membershipId);
      logAudit({
        institutionId: booking.institutionId,
        action: "Booking Cancelled",
        actor,
        timestamp: `${TODAY}T00:00:00`,
        bookingNo: booking.bookingNo,
        memberName: member?.memberName,
        reason,
      });
      return { ok: true };
    }),

  // ---- Librarian desk ----
  verifyBookingNumber: (bookingNoValue: string, institutionId: InstitutionType) =>
    mockRequest<BookingVerificationResult>(() => {
      const booking = findBookingByNumber(bookingNoValue, institutionId);
      if (!booking) return { valid: false, reason: "No booking found with this number." };

      const member = getMember(booking.membershipId);
      const title = getBookTitle(booking.titleId);
      const copy = getCopy(booking.copyId);

      if (booking.status === "Issued") return { valid: false, reason: "This booking has already been issued.", booking, member, title, copy };
      if (booking.status === "Cancelled") return { valid: false, reason: "This booking was cancelled.", booking, member, title, copy };
      if (booking.status === "Expired") return { valid: false, reason: "This booking has expired — the collection window has passed.", booking, member, title, copy };
      if (booking.status === "Returned") return { valid: false, reason: "This booking's loan has already been returned.", booking, member, title, copy };
      if (!member || member.status !== "Active") return { valid: false, reason: "The member's library membership is not active.", booking, member, title, copy };
      if (booking.expiresAt < TODAY) return { valid: false, reason: "This booking's collection deadline has passed.", booking, member, title, copy };

      return { valid: true, booking, member, title, copy };
    }, { latencyMs: [300, 600] }),

  issueBooking: (bookingId: string, librarianName: string) =>
    mockRequest<{ ok: true; loan: Loan } | { ok: false; error: string }>(() => {
      const booking = allBookings.find((b) => b.id === bookingId);
      if (!booking) return { ok: false, error: "Booking not found." };
      if (booking.status === "Issued") return { ok: false, error: "This booking has already been issued." };
      if (booking.status !== "Booked" && booking.status !== "Verified") {
        return { ok: false, error: "This booking is not in an issuable state." };
      }

      const member = getMember(booking.membershipId)!;
      const settings = librarySettings[booking.institutionId];
      booking.status = "Issued";
      setCopyStatus(booking.copyId, "On Loan");

      const loan: Loan = {
        id: `loan-live-${Date.now()}`,
        institutionId: booking.institutionId,
        copyId: booking.copyId,
        titleId: booking.titleId,
        membershipId: booking.membershipId,
        bookingId: booking.id,
        issueDate: TODAY,
        dueDate: addDays(TODAY, member.loanPeriodDays || settings.loanPeriodDays),
        returnDate: null,
        renewedCount: 0,
        status: "Active",
        issuedBy: librarianName,
      };
      allLoans.unshift(loan);

      logAudit({
        institutionId: booking.institutionId,
        action: "Booking Verified",
        actor: librarianName,
        timestamp: `${TODAY}T00:00:00`,
        bookingNo: booking.bookingNo,
        memberName: member.memberName,
        bookTitle: getBookTitle(booking.titleId)?.title,
      });
      logAudit({
        institutionId: booking.institutionId,
        action: "Book Issued",
        actor: librarianName,
        timestamp: `${TODAY}T00:01:00`,
        bookingNo: booking.bookingNo,
        memberName: member.memberName,
        bookTitle: getBookTitle(booking.titleId)?.title,
      });

      return { ok: true, loan };
    }, { latencyMs: [400, 700] }),

  returnLoan: (loanId: string, librarianName: string) =>
    mockRequest<{ ok: true; fine: Fine | null } | { ok: false; error: string }>(() => {
      const loan = allLoans.find((l) => l.id === loanId);
      if (!loan) return { ok: false, error: "Loan not found." };
      if (loan.status === "Returned") return { ok: false, error: "This loan was already returned." };

      loan.returnDate = TODAY;
      loan.status = "Returned";
      setCopyStatus(loan.copyId, "Available");
      if (loan.bookingId) {
        const booking = allBookings.find((b) => b.id === loan.bookingId);
        if (booking) booking.status = "Returned";
      }

      const member = getMember(loan.membershipId);
      const settings = librarySettings[loan.institutionId];
      let fine: Fine | null = null;
      const overdueDays = daysBetween(loan.dueDate, TODAY);
      if (overdueDays > 0) {
        const amount = Math.min(settings.fineCap, overdueDays * settings.fineRatePerDay);
        fine = {
          id: `fine-live-${Date.now()}`,
          institutionId: loan.institutionId,
          loanId: loan.id,
          membershipId: loan.membershipId,
          assessedAmount: amount,
          outstandingAmount: amount,
          reason: `Returned ${overdueDays} day${overdueDays > 1 ? "s" : ""} late`,
          status: "Outstanding",
          createdDate: TODAY,
        };
        allFines.unshift(fine);
      }

      logAudit({
        institutionId: loan.institutionId,
        action: "Book Returned",
        actor: librarianName,
        timestamp: `${TODAY}T00:00:00`,
        memberName: member?.memberName,
        bookTitle: getBookTitle(loan.titleId)?.title,
      });

      return { ok: true, fine };
    }, { latencyMs: [400, 700] }),

  renewLoan: (loanId: string) =>
    mockRequest<{ ok: true; loan: Loan } | { ok: false; error: string }>(() => {
      const loan = allLoans.find((l) => l.id === loanId);
      if (!loan) return { ok: false, error: "Loan not found." };
      if (loan.status === "Returned") return { ok: false, error: "This loan has already been returned." };
      const settings = librarySettings[loan.institutionId];
      if (loan.renewedCount >= settings.renewalLimit) {
        return { ok: false, error: "Renewal limit reached for this loan." };
      }
      const hasReservation = allReservations.some((r) => r.titleId === loan.titleId && r.status === "Queued");
      if (hasReservation) {
        return { ok: false, error: "Cannot renew — another member is waiting for this title." };
      }
      loan.dueDate = addDays(loan.dueDate, settings.loanPeriodDays);
      loan.renewedCount += 1;
      loan.status = "Active";
      const member = getMember(loan.membershipId);
      logAudit({
        institutionId: loan.institutionId,
        action: "Loan Renewed",
        actor: member?.memberName ?? "Member",
        timestamp: `${TODAY}T00:00:00`,
        memberName: member?.memberName,
        bookTitle: getBookTitle(loan.titleId)?.title,
      });
      return { ok: true, loan };
    }, { latencyMs: [300, 600] }),

  // ---- Fines ----
  waiveFine: (fineId: string, reason: string, actor: string) =>
    mockRequest<{ ok: true } | { ok: false; error: string }>(() => {
      const fine = allFines.find((f) => f.id === fineId);
      if (!fine) return { ok: false, error: "Fine not found." };
      if (fine.status !== "Outstanding") return { ok: false, error: "Only an outstanding fine can be waived." };
      fine.status = "Waived";
      fine.outstandingAmount = 0;
      fine.waiverReason = reason;
      fine.resolvedDate = TODAY;
      const member = getMember(fine.membershipId);
      logAudit({
        institutionId: fine.institutionId,
        action: "Fine Waived",
        actor,
        timestamp: `${TODAY}T00:00:00`,
        memberName: member?.memberName,
        reason,
      });
      return { ok: true };
    }),

  collectFine: (fineId: string, actor: string) =>
    mockRequest<{ ok: true } | { ok: false; error: string }>(() => {
      const fine = allFines.find((f) => f.id === fineId);
      if (!fine) return { ok: false, error: "Fine not found." };
      if (fine.status !== "Outstanding") return { ok: false, error: "This fine is not outstanding." };
      fine.status = "Paid";
      fine.outstandingAmount = 0;
      fine.resolvedDate = TODAY;
      const member = getMember(fine.membershipId);
      logAudit({
        institutionId: fine.institutionId,
        action: "Fine Collected",
        actor,
        timestamp: `${TODAY}T00:00:00`,
        memberName: member?.memberName,
      });
      return { ok: true };
    }),

  // ---- Reservations ----
  listReservations: (institutionId: InstitutionType) => mockRequest<Reservation[]>(() => getReservationsByInstitution(institutionId)),

  createReservation: (institutionId: InstitutionType, membershipId: string, titleId: string) =>
    mockRequest<{ ok: true; reservation: Reservation } | { ok: false; error: string }>(() => {
      const existing = allReservations.filter((r) => r.titleId === titleId && r.status === "Queued");
      const member = getMember(membershipId)!;
      const reservation: Reservation = {
        id: `reservation-live-${Date.now()}`,
        institutionId,
        titleId,
        membershipId,
        queuePosition: existing.length + 1,
        status: "Queued",
        requestedDate: TODAY,
      };
      allReservations.unshift(reservation);
      logAudit({
        institutionId,
        action: "Reservation Created",
        actor: member.memberName,
        timestamp: `${TODAY}T00:00:00`,
        memberName: member.memberName,
        bookTitle: getBookTitle(titleId)?.title,
      });
      return { ok: true, reservation };
    }),

  cancelReservation: (id: string, actor: string) =>
    mockRequest<{ ok: true } | { ok: false; error: string }>(() => {
      const reservation = allReservations.find((r) => r.id === id);
      if (!reservation) return { ok: false, error: "Reservation not found." };
      reservation.status = "Cancelled";
      const member = getMember(reservation.membershipId);
      logAudit({
        institutionId: reservation.institutionId,
        action: "Reservation Cancelled",
        actor,
        timestamp: `${TODAY}T00:00:00`,
        memberName: member?.memberName,
      });
      return { ok: true };
    }),

  // ---- Librarian dashboard / reports ----
  getDashboardStats: (institutionId: InstitutionType) =>
    mockRequest(() => {
      const copies = getCopiesByInstitution(institutionId);
      const bookings = getBookingsByInstitution(institutionId);
      const loans = getLoansByInstitution(institutionId);
      const fines = getFinesByInstitution(institutionId);
      return {
        totalTitles: getBookTitlesByInstitution(institutionId).length,
        totalCopies: copies.length,
        availableCopies: copies.filter((c) => c.status === "Available").length,
        activeLoans: loans.filter((l) => l.status === "Active" || l.status === "Overdue").length,
        overdueLoans: loans.filter((l) => l.status === "Overdue" || (l.status === "Active" && l.dueDate < TODAY)).length,
        bookingsAwaitingCollection: bookings.filter((b) => b.status === "Booked" || b.status === "Verified").length,
        outstandingFines: fines.filter((f) => f.status === "Outstanding").reduce((sum, f) => sum + f.outstandingAmount, 0),
        finesCollected: fines.filter((f) => f.status === "Paid").reduce((sum, f) => sum + f.assessedAmount, 0),
      };
    }),

  listBookings: (institutionId: InstitutionType) =>
    mockRequest<Booking[]>(() => [...getBookingsByInstitution(institutionId)].sort((a, b) => b.bookingDate.localeCompare(a.bookingDate))),

  listLoans: (institutionId: InstitutionType) =>
    mockRequest<Loan[]>(() => [...getLoansByInstitution(institutionId)].sort((a, b) => b.issueDate.localeCompare(a.issueDate))),

  listFines: (institutionId: InstitutionType) => mockRequest<Fine[]>(() => getFinesByInstitution(institutionId)),

  listAuditEvents: (institutionId: InstitutionType) => mockRequest<LibraryAuditEvent[]>(() => getAuditEventsByInstitution(institutionId)),
};

function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
