import type { InstitutionType } from "./institution";

export type LeaveRequestStatus = "Pending" | "Approved" | "Rejected";

export interface LeaveRequest {
  id: string;
  institutionId: InstitutionType;
  studentId: string;
  studentName: string;
  classOrProgrammeId: string;
  section: string;
  requestedBy: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveRequestStatus;
  requestedDate: string;
  reviewedBy?: string;
  reviewedDate?: string;
}
