import { getStudent } from "./erp/studentsGuardians";
import type { CertificateRequest, InstitutionType } from "@/types";

const requests: CertificateRequest[] = [];

function seedFor(studentId: string, type: CertificateRequest["type"], status: CertificateRequest["status"]) {
  const student = getStudent(studentId);
  if (!student) return;
  requests.push({
    id: `cert-seed-${requests.length}`,
    institutionId: student.institutionId,
    studentId,
    studentName: student.name,
    type,
    status,
    requestedDate: "2026-10-22",
    issuedDate: status === "Issued" ? "2026-10-24" : undefined,
    issuedBy: status === "Issued" ? "Sujata Rout" : undefined,
  });
}

seedFor("student-sch-001", "Bonafide Certificate", "Issued");

export const allCertificateRequests = requests;

export function getCertificateRequestsByInstitution(id: InstitutionType): CertificateRequest[] {
  return allCertificateRequests.filter((r) => r.institutionId === id);
}
export function getCertificateRequestsByStudent(studentId: string): CertificateRequest[] {
  return allCertificateRequests.filter((r) => r.studentId === studentId);
}
