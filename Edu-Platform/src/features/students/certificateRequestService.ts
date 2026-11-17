import { mockRequest } from "@/mocks/api/client";
import { allCertificateRequests, getCertificateRequestsByInstitution, getCertificateRequestsByStudent } from "@/mocks/data/certificateRequests";
import { getStudent } from "@/mocks/data/erp/studentsGuardians";
import { logActivity } from "@/mocks/data/activityLog";
import type { CertificateRequest, CertificateType, InstitutionType } from "@/types";

export const certificateRequestService = {
  listByInstitution: (institutionId: InstitutionType) =>
    mockRequest<CertificateRequest[]>(() => [...getCertificateRequestsByInstitution(institutionId)].sort((a, b) => b.requestedDate.localeCompare(a.requestedDate))),

  listByStudent: (studentId: string) => mockRequest<CertificateRequest[]>(() => getCertificateRequestsByStudent(studentId)),

  create: (studentId: string, type: CertificateType, reason: string, actor: string) =>
    mockRequest<{ ok: true; request: CertificateRequest } | { ok: false; error: string }>(() => {
      const student = getStudent(studentId);
      if (!student) return { ok: false, error: "Student not found." };
      const request: CertificateRequest = {
        id: `cert-live-${Date.now()}`,
        institutionId: student.institutionId,
        studentId,
        studentName: student.name,
        type,
        reason,
        status: "Requested",
        requestedDate: "2026-11-04",
      };
      allCertificateRequests.unshift(request);
      logActivity({ institutionId: student.institutionId, category: "Students", action: `${actor} requested a ${type} for ${student.name}`, actor });
      return { ok: true, request };
    }, { latencyMs: [350, 650] }),

  setStatus: (id: string, status: "Issued" | "Rejected", actor: string) =>
    mockRequest<{ ok: true } | { ok: false; error: string }>(() => {
      const request = allCertificateRequests.find((r) => r.id === id);
      if (!request) return { ok: false, error: "Request not found." };
      request.status = status;
      if (status === "Issued") {
        request.issuedDate = "2026-11-04";
        request.issuedBy = actor;
      }
      logActivity({ institutionId: request.institutionId, category: "Students", action: `${status} ${request.type} for ${request.studentName}`, actor });
      return { ok: true };
    }, { latencyMs: [300, 550] }),
};
