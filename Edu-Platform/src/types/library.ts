import type { InstitutionType } from "./institution";

export type CopyStatus = "Available" | "On Loan" | "Reserved" | "Lost" | "Damaged" | "Retired";

export interface BookTitle {
  id: string;
  institutionId: InstitutionType;
  title: string;
  authors: string;
  category: string;
  isbn: string;
  publisher: string;
  edition: string;
  isReference: boolean;
  coverColor: string;
}

export interface BookCopy {
  id: string;
  institutionId: InstitutionType;
  titleId: string;
  accessionNo: string;
  shelfLocation: string;
  status: CopyStatus;
}

export type MembershipStatus = "Active" | "Lapsed" | "Suspended" | "Closed";
export type MemberType = "student" | "faculty";

export interface LibraryMembership {
  id: string;
  institutionId: InstitutionType;
  memberName: string;
  memberType: MemberType;
  memberRefId: string;
  membershipNo: string;
  status: MembershipStatus;
  validFrom: string;
  validTo: string;
  maxLoans: number;
  loanPeriodDays: number;
}

export type BookingStatus = "Booked" | "Verified" | "Issued" | "Returned" | "Cancelled" | "Expired";

export interface Booking {
  id: string;
  institutionId: InstitutionType;
  bookingNo: string;
  membershipId: string;
  copyId: string;
  titleId: string;
  bookingDate: string;
  expiresAt: string;
  status: BookingStatus;
  cancellationReason?: string;
  cancelledBy?: string;
}

export type LoanStatus = "Active" | "Returned" | "Overdue";

export interface Loan {
  id: string;
  institutionId: InstitutionType;
  copyId: string;
  titleId: string;
  membershipId: string;
  bookingId: string | null;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  renewedCount: number;
  status: LoanStatus;
  issuedBy: string;
}

export type ReservationStatus = "Queued" | "Ready" | "Expired" | "Cancelled" | "Fulfilled";

export interface Reservation {
  id: string;
  institutionId: InstitutionType;
  titleId: string;
  membershipId: string;
  queuePosition: number;
  status: ReservationStatus;
  requestedDate: string;
  availableAt?: string;
  holdExpiresAt?: string;
}

export type FineStatus = "Outstanding" | "Paid" | "Waived";

export interface Fine {
  id: string;
  institutionId: InstitutionType;
  loanId: string;
  membershipId: string;
  assessedAmount: number;
  outstandingAmount: number;
  reason: string;
  status: FineStatus;
  waiverReason?: string;
  createdDate: string;
  resolvedDate?: string;
}

export type LibraryAuditAction =
  | "Booking Created"
  | "Booking Verified"
  | "Booking Cancelled"
  | "Book Issued"
  | "Book Returned"
  | "Loan Renewed"
  | "Fine Waived"
  | "Fine Collected"
  | "Reservation Created"
  | "Reservation Cancelled";

export interface LibraryAuditEvent {
  id: string;
  institutionId: InstitutionType;
  action: LibraryAuditAction;
  actor: string;
  timestamp: string;
  bookingNo?: string;
  memberName?: string;
  bookTitle?: string;
  reason?: string;
}

export interface LibrarySettings {
  institutionId: InstitutionType;
  loanPeriodDays: number;
  maxConcurrentLoans: number;
  renewalLimit: number;
  fineRatePerDay: number;
  fineCap: number;
  reservationHoldDays: number;
  bookingCollectionDeadlineDays: number;
}
