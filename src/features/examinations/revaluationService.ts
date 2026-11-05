import { mockRequest } from "@/mocks/api/client";
import { allRevaluationRequests, getRevaluationsByInstitution, getRevaluationsByStudent } from "@/mocks/data/revaluationRequests";
import { allMarksEntries } from "@/mocks/data/erp/examinations";
import { getStudent } from "@/mocks/data/erp/studentsGuardians";
import { logActivity } from "@/mocks/data/activityLog";
import { pushNotification } from "@/mocks/data/notifications";
import type { InstitutionType, RevaluationRequest } from "@/types";

export const revaluationService = {
  listByInstitution: (institutionId: InstitutionType) =>
    mockRequest<RevaluationRequest[]>(() => [...getRevaluationsByInstitution(institutionId)].sort((a, b) => b.requestedDate.localeCompare(a.requestedDate))),

  listByStudent: (studentId: string) => mockRequest<RevaluationRequest[]>(() => getRevaluationsByStudent(studentId)),

  create: (input: { institutionId: InstitutionType; examinationId: string; examinationName: string; studentId: string; subject: string; originalMarks: number; maxMarks: number; reason: string }) =>
    mockRequest<{ ok: true; request: RevaluationRequest } | { ok: false; error: string }>(() => {
      const student = getStudent(input.studentId);
      if (!student) return { ok: false, error: "Student not found." };
      const existing = getRevaluationsByStudent(input.studentId).find((r) => r.examinationId === input.examinationId && r.subject === input.subject && r.status === "Pending");
      if (existing) return { ok: false, error: "A revaluation request for this subject is already pending." };

      const request: RevaluationRequest = {
        id: `reval-live-${Date.now()}`,
        institutionId: input.institutionId,
        examinationId: input.examinationId,
        examinationName: input.examinationName,
        studentId: input.studentId,
        studentName: student.name,
        subject: input.subject,
        originalMarks: input.originalMarks,
        maxMarks: input.maxMarks,
        reason: input.reason,
        status: "Pending",
        requestedDate: "2026-11-04",
      };
      allRevaluationRequests.unshift(request);
      logActivity({ institutionId: input.institutionId, category: "Examinations", action: `${student.name} requested revaluation for ${input.subject}`, actor: student.name });
      return { ok: true, request };
    }, { latencyMs: [350, 650] }),

  review: (id: string, decision: "Approved" | "Rejected", actor: string, revisedMarks: number | undefined, note: string | undefined) =>
    mockRequest<{ ok: true } | { ok: false; error: string }>(() => {
      const request = allRevaluationRequests.find((r) => r.id === id);
      if (!request) return { ok: false, error: "Request not found." };
      request.status = decision;
      request.reviewedBy = actor;
      request.reviewedDate = "2026-11-04";
      request.reviewNote = note;
      if (decision === "Approved" && revisedMarks !== undefined) {
        request.revisedMarks = revisedMarks;
        const entry = allMarksEntries.find((m) => m.examinationId === request.examinationId && m.studentId === request.studentId && m.subject === request.subject);
        if (entry) entry.marksObtained = revisedMarks;
      }
      logActivity({ institutionId: request.institutionId, category: "Examinations", action: `${decision} revaluation for ${request.studentName} — ${request.subject}`, actor });
      pushNotification({
        institutionId: request.institutionId,
        category: "Academics",
        title: `Revaluation ${decision.toLowerCase()}`,
        body: `Your revaluation request for ${request.subject} (${request.examinationName}) was ${decision.toLowerCase()}${decision === "Approved" && revisedMarks !== undefined ? ` — revised marks: ${revisedMarks}` : ""}.`,
        roles: ["student", "parent"],
        studentId: request.studentId,
      });
      return { ok: true };
    }, { latencyMs: [350, 650] }),
};
