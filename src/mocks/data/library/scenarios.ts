// Hand-curated demo scenarios for the Library module, built together in
// one place (rather than separate hand-authored files) so that book
// copies, bookings, loans, reservations and fines always cross-reference
// real, consistent IDs instead of guessed ones.
import { getCopiesByTitle, setCopyStatus } from "./bookCopies";
import { getMember } from "./members";
import type {
  Booking,
  BookingStatus,
  Fine,
  InstitutionType,
  Loan,
  LibraryAuditEvent,
  Reservation,
} from "@/types";

const TODAY = "2026-10-29";

let bookingSeq = 1;
let loanSeq = 1;
let reservationSeq = 1;
let fineSeq = 1;
let auditSeq = 1;

const bookings: Booking[] = [];
const loans: Loan[] = [];
const reservations: Reservation[] = [];
const fines: Fine[] = [];
const auditEvents: LibraryAuditEvent[] = [];

function pad(n: number) {
  return String(n).padStart(6, "0");
}

function bookingNo(year: string) {
  return `BK-${year}-${pad(bookingSeq)}`;
}

function nthCopy(titleId: string, n: number) {
  const copies = getCopiesByTitle(titleId);
  return copies[n] ?? copies[0]!;
}

function logAudit(event: Omit<LibraryAuditEvent, "id">) {
  auditEvents.push({ id: `audit-${String(auditSeq).padStart(3, "0")}`, ...event });
  auditSeq += 1;
}

interface CreateBookingArgs {
  institutionId: InstitutionType;
  memberId: string;
  titleId: string;
  copyIndex?: number;
  bookingDate: string;
  expiresAt: string;
  status: BookingStatus;
  cancellationReason?: string;
  cancelledBy?: string;
}

function createBooking(args: CreateBookingArgs): Booking {
  const copy = nthCopy(args.titleId, args.copyIndex ?? 0);
  const member = getMember(args.memberId)!;
  const booking: Booking = {
    id: `booking-${String(bookingSeq).padStart(3, "0")}`,
    institutionId: args.institutionId,
    bookingNo: bookingNo("2026"),
    membershipId: args.memberId,
    copyId: copy.id,
    titleId: args.titleId,
    bookingDate: args.bookingDate,
    expiresAt: args.expiresAt,
    status: args.status,
    cancellationReason: args.cancellationReason,
    cancelledBy: args.cancelledBy,
  };
  bookingSeq += 1;
  bookings.push(booking);

  logAudit({
    institutionId: args.institutionId,
    action: "Booking Created",
    actor: member.memberName,
    timestamp: `${args.bookingDate}T10:00:00`,
    bookingNo: booking.bookingNo,
    memberName: member.memberName,
  });

  if (args.status === "Booked") setCopyStatus(copy.id, "Reserved");
  if (args.status === "Cancelled") {
    logAudit({
      institutionId: args.institutionId,
      action: "Booking Cancelled",
      actor: args.cancelledBy ?? member.memberName,
      timestamp: `${args.bookingDate}T14:00:00`,
      bookingNo: booking.bookingNo,
      memberName: member.memberName,
      reason: args.cancellationReason,
    });
  }

  return booking;
}

interface IssueFromBookingArgs {
  bookingId: string;
  issueDate: string;
  dueDate: string;
  issuedBy: string;
}

function issueFromBooking(args: IssueFromBookingArgs): Loan {
  const booking = bookings.find((b) => b.id === args.bookingId)!;
  booking.status = "Issued";
  setCopyStatus(booking.copyId, "On Loan");

  const member = getMember(booking.membershipId)!;
  logAudit({
    institutionId: booking.institutionId,
    action: "Booking Verified",
    actor: args.issuedBy,
    timestamp: `${args.issueDate}T11:00:00`,
    bookingNo: booking.bookingNo,
    memberName: member.memberName,
  });
  logAudit({
    institutionId: booking.institutionId,
    action: "Book Issued",
    actor: args.issuedBy,
    timestamp: `${args.issueDate}T11:05:00`,
    bookingNo: booking.bookingNo,
    memberName: member.memberName,
  });

  const loan: Loan = {
    id: `loan-${String(loanSeq).padStart(3, "0")}`,
    institutionId: booking.institutionId,
    copyId: booking.copyId,
    titleId: booking.titleId,
    membershipId: booking.membershipId,
    bookingId: booking.id,
    issueDate: args.issueDate,
    dueDate: args.dueDate,
    returnDate: null,
    renewedCount: 0,
    status: args.dueDate < TODAY ? "Overdue" : "Active",
    issuedBy: args.issuedBy,
  };
  loanSeq += 1;
  loans.push(loan);
  return loan;
}

interface WalkInLoanArgs {
  institutionId: InstitutionType;
  memberId: string;
  titleId: string;
  copyIndex?: number;
  issueDate: string;
  dueDate: string;
  issuedBy: string;
  returnDate?: string;
}

function walkInLoan(args: WalkInLoanArgs): Loan {
  const copy = nthCopy(args.titleId, args.copyIndex ?? 0);
  const member = getMember(args.memberId)!;
  const returned = !!args.returnDate;
  setCopyStatus(copy.id, returned ? "Available" : "On Loan");

  logAudit({
    institutionId: args.institutionId,
    action: "Book Issued",
    actor: args.issuedBy,
    timestamp: `${args.issueDate}T12:00:00`,
    memberName: member.memberName,
  });
  if (returned) {
    logAudit({
      institutionId: args.institutionId,
      action: "Book Returned",
      actor: args.issuedBy,
      timestamp: `${args.returnDate}T12:00:00`,
      memberName: member.memberName,
    });
  }

  const loan: Loan = {
    id: `loan-${String(loanSeq).padStart(3, "0")}`,
    institutionId: args.institutionId,
    copyId: copy.id,
    titleId: args.titleId,
    membershipId: args.memberId,
    bookingId: null,
    issueDate: args.issueDate,
    dueDate: args.dueDate,
    returnDate: args.returnDate ?? null,
    renewedCount: 0,
    status: returned ? "Returned" : args.dueDate < TODAY ? "Overdue" : "Active",
    issuedBy: args.issuedBy,
  };
  loanSeq += 1;
  loans.push(loan);
  return loan;
}

function assessFine(args: {
  institutionId: InstitutionType;
  loanId: string;
  memberId: string;
  amount: number;
  reason: string;
  status: Fine["status"];
  waiverReason?: string;
  createdDate: string;
  resolvedDate?: string;
}): Fine {
  const fine: Fine = {
    id: `fine-${String(fineSeq).padStart(3, "0")}`,
    institutionId: args.institutionId,
    loanId: args.loanId,
    membershipId: args.memberId,
    assessedAmount: args.amount,
    outstandingAmount: args.status === "Outstanding" ? args.amount : 0,
    reason: args.reason,
    status: args.status,
    waiverReason: args.waiverReason,
    createdDate: args.createdDate,
    resolvedDate: args.resolvedDate,
  };
  fineSeq += 1;
  fines.push(fine);

  const member = getMember(args.memberId)!;
  if (args.status === "Waived") {
    logAudit({
      institutionId: args.institutionId,
      action: "Fine Waived",
      actor: "Librarian",
      timestamp: `${args.resolvedDate ?? args.createdDate}T15:00:00`,
      memberName: member.memberName,
      reason: args.waiverReason,
    });
  } else if (args.status === "Paid") {
    logAudit({
      institutionId: args.institutionId,
      action: "Fine Collected",
      actor: "Librarian",
      timestamp: `${args.resolvedDate ?? args.createdDate}T15:00:00`,
      memberName: member.memberName,
    });
  }

  return fine;
}

function createReservation(args: {
  institutionId: InstitutionType;
  titleId: string;
  memberId: string;
  queuePosition: number;
  requestedDate: string;
}): Reservation {
  const member = getMember(args.memberId)!;
  const reservation: Reservation = {
    id: `reservation-${String(reservationSeq).padStart(3, "0")}`,
    institutionId: args.institutionId,
    titleId: args.titleId,
    membershipId: args.memberId,
    queuePosition: args.queuePosition,
    status: "Queued",
    requestedDate: args.requestedDate,
  };
  reservationSeq += 1;
  reservations.push(reservation);

  logAudit({
    institutionId: args.institutionId,
    action: "Reservation Created",
    actor: member.memberName,
    timestamp: `${args.requestedDate}T09:00:00`,
    memberName: member.memberName,
  });

  return reservation;
}

// ---------------------------------------------------------------------
// School scenarios
// ---------------------------------------------------------------------

createBooking({
  institutionId: "school",
  memberId: "mem-sch-01",
  titleId: "bk-sch-01",
  bookingDate: "2026-10-27",
  expiresAt: "2026-10-31",
  status: "Booked",
});

createBooking({
  institutionId: "school",
  memberId: "mem-sch-03",
  titleId: "bk-sch-03",
  bookingDate: "2026-10-28",
  expiresAt: "2026-11-01",
  status: "Booked",
});

const bSch3 = createBooking({
  institutionId: "school",
  memberId: "mem-sch-02",
  titleId: "bk-sch-05",
  bookingDate: "2026-10-15",
  expiresAt: "2026-10-19",
  status: "Booked",
});
issueFromBooking({ bookingId: bSch3.id, issueDate: "2026-10-16", dueDate: "2026-10-30", issuedBy: "Niranjan Mallick" });

createBooking({
  institutionId: "school",
  memberId: "mem-sch-04",
  titleId: "bk-sch-07",
  bookingDate: "2026-10-10",
  expiresAt: "2026-10-14",
  status: "Cancelled",
  cancellationReason: "No longer needed",
  cancelledBy: "Priya Darshini Sahu",
});

createBooking({
  institutionId: "school",
  memberId: "mem-sch-05",
  titleId: "bk-sch-09",
  bookingDate: "2026-10-05",
  expiresAt: "2026-10-07",
  status: "Expired",
});

walkInLoan({ institutionId: "school", memberId: "mem-sch-07", titleId: "bk-sch-02", issueDate: "2026-10-22", dueDate: "2026-11-05", issuedBy: "Niranjan Mallick" });

const lSch3 = walkInLoan({ institutionId: "school", memberId: "mem-sch-08", titleId: "bk-sch-10", issueDate: "2026-10-05", dueDate: "2026-10-19", issuedBy: "Niranjan Mallick" });
assessFine({
  institutionId: "school",
  loanId: lSch3.id,
  memberId: "mem-sch-08",
  amount: Math.min(200, (new Date(TODAY).getTime() - new Date("2026-10-19").getTime()) / 86400000 * 2),
  reason: "Overdue return — NCERT Mathematics textbook not yet returned",
  status: "Outstanding",
  createdDate: "2026-10-20",
});

walkInLoan({ institutionId: "school", memberId: "mem-sch-09", titleId: "bk-sch-11", issueDate: "2026-09-01", dueDate: "2026-09-15", returnDate: "2026-09-14", issuedBy: "Niranjan Mallick" });

const lSch5 = walkInLoan({ institutionId: "school", memberId: "mem-sch-10", titleId: "bk-sch-13", issueDate: "2026-08-20", dueDate: "2026-09-03", returnDate: "2026-09-10", issuedBy: "Niranjan Mallick" });
assessFine({
  institutionId: "school",
  loanId: lSch5.id,
  memberId: "mem-sch-10",
  amount: 14,
  reason: "Returned 7 days late",
  status: "Paid",
  createdDate: "2026-09-10",
  resolvedDate: "2026-09-10",
});

createReservation({ institutionId: "school", titleId: "bk-sch-03", memberId: "mem-sch-11", queuePosition: 1, requestedDate: "2026-10-26" });

// ---------------------------------------------------------------------
// College scenarios
// ---------------------------------------------------------------------

createBooking({
  institutionId: "college",
  memberId: "mem-col-01",
  titleId: "bk-col-01",
  bookingDate: "2026-10-27",
  expiresAt: "2026-10-31",
  status: "Booked",
});

createBooking({
  institutionId: "college",
  memberId: "mem-col-05",
  titleId: "bk-col-13",
  bookingDate: "2026-10-28",
  expiresAt: "2026-11-01",
  status: "Booked",
});

const bCol3 = createBooking({
  institutionId: "college",
  memberId: "mem-col-02",
  titleId: "bk-col-02",
  bookingDate: "2026-10-09",
  expiresAt: "2026-10-13",
  status: "Booked",
});
issueFromBooking({ bookingId: bCol3.id, issueDate: "2026-10-10", dueDate: "2026-10-24", issuedBy: "Manoj Swain" });
const lCol1 = loans.find((l) => l.bookingId === bCol3.id)!;
assessFine({
  institutionId: "college",
  loanId: lCol1.id,
  memberId: "mem-col-02",
  amount: Math.min(200, (new Date(TODAY).getTime() - new Date("2026-10-24").getTime()) / 86400000 * 2),
  reason: "Overdue return — Database System Concepts not yet returned",
  status: "Outstanding",
  createdDate: "2026-10-25",
});

createBooking({
  institutionId: "college",
  memberId: "mem-col-04",
  titleId: "bk-col-06",
  bookingDate: "2026-10-08",
  expiresAt: "2026-10-12",
  status: "Cancelled",
  cancellationReason: "Found the book at the department library",
  cancelledBy: "Manoj Swain",
});

createBooking({
  institutionId: "college",
  memberId: "mem-col-09",
  titleId: "bk-col-16",
  bookingDate: "2026-10-03",
  expiresAt: "2026-10-05",
  status: "Expired",
});

walkInLoan({ institutionId: "college", memberId: "mem-col-03", titleId: "bk-col-03", issueDate: "2026-10-20", dueDate: "2026-11-03", issuedBy: "Manoj Swain" });
walkInLoan({ institutionId: "college", memberId: "mem-col-faculty-01", titleId: "bk-col-05", issueDate: "2026-10-01", dueDate: "2026-10-31", issuedBy: "Manoj Swain" });
walkInLoan({ institutionId: "college", memberId: "mem-col-06", titleId: "bk-col-10", issueDate: "2026-09-05", dueDate: "2026-09-19", returnDate: "2026-09-18", issuedBy: "Manoj Swain" });

const lCol5 = walkInLoan({ institutionId: "college", memberId: "mem-col-07", titleId: "bk-col-18", issueDate: "2026-08-15", dueDate: "2026-08-29", returnDate: "2026-09-05", issuedBy: "Manoj Swain" });
assessFine({
  institutionId: "college",
  loanId: lCol5.id,
  memberId: "mem-col-07",
  amount: 14,
  reason: "Returned 7 days late",
  status: "Waived",
  waiverReason: "First-time offense; member cleared outstanding dues same day",
  createdDate: "2026-09-05",
  resolvedDate: "2026-09-06",
});

createReservation({ institutionId: "college", titleId: "bk-col-01", memberId: "mem-col-08", queuePosition: 1, requestedDate: "2026-10-25" });
createReservation({ institutionId: "college", titleId: "bk-col-01", memberId: "mem-col-10", queuePosition: 2, requestedDate: "2026-10-27" });

// ---------------------------------------------------------------------

export const allBookings = bookings;
export const allLoans = loans;
export const allReservations = reservations;
export const allFines = fines;
export const allLibraryAuditEvents = auditEvents.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

export function getBookingsByInstitution(id: InstitutionType) {
  return allBookings.filter((b) => b.institutionId === id);
}
export function getLoansByInstitution(id: InstitutionType) {
  return allLoans.filter((l) => l.institutionId === id);
}
export function getReservationsByInstitution(id: InstitutionType) {
  return allReservations.filter((r) => r.institutionId === id);
}
export function getFinesByInstitution(id: InstitutionType) {
  return allFines.filter((f) => f.institutionId === id);
}
export function getAuditEventsByInstitution(id: InstitutionType) {
  return allLibraryAuditEvents.filter((e) => e.institutionId === id);
}

export function getBookingsByMember(membershipId: string) {
  return allBookings.filter((b) => b.membershipId === membershipId);
}
export function getLoansByMember(membershipId: string) {
  return allLoans.filter((l) => l.membershipId === membershipId);
}
export function getFinesByMember(membershipId: string) {
  return allFines.filter((f) => f.membershipId === membershipId);
}

/**
 * Scoped to the librarian's own institution — a booking number from
 * another institution's library must never resolve here, matching the
 * platform's tenant-isolation rule (never trust/return cross-tenant data,
 * even on a lookup-by-code path like this one).
 */
export function findBookingByNumber(bookingNoValue: string, institutionId: InstitutionType) {
  const normalized = bookingNoValue.toLowerCase().trim();
  return allBookings.find((b) => b.institutionId === institutionId && b.bookingNo.toLowerCase() === normalized);
}
