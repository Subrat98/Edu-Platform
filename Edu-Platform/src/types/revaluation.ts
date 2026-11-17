import type { InstitutionType } from "./institution";

export type RevaluationStatus = "Pending" | "Approved" | "Rejected";

export interface RevaluationRequest {
  id: string;
  institutionId: InstitutionType;
  examinationId: string;
  examinationName: string;
  studentId: string;
  studentName: string;
  subject: string;
  originalMarks: number;
  maxMarks: number;
  reason: string;
  status: RevaluationStatus;
  requestedDate: string;
  revisedMarks?: number;
  reviewedBy?: string;
  reviewedDate?: string;
  reviewNote?: string;
}
