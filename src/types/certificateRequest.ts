import type { InstitutionType } from "./institution";

export type CertificateType = "Transfer Certificate" | "Bonafide Certificate";
export type CertificateRequestStatus = "Requested" | "Issued" | "Rejected";

export interface CertificateRequest {
  id: string;
  institutionId: InstitutionType;
  studentId: string;
  studentName: string;
  type: CertificateType;
  reason?: string;
  status: CertificateRequestStatus;
  requestedDate: string;
  issuedDate?: string;
  issuedBy?: string;
}
