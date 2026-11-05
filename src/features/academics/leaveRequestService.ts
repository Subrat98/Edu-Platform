import { mockRequest } from "@/mocks/api/client";
import { allLeaveRequests, getLeaveRequestsByInstitution, getLeaveRequestsByStudent } from "@/mocks/data/leaveRequests";
import { getStudent } from "@/mocks/data/erp/studentsGuardians";
import { logActivity } from "@/mocks/data/activityLog";
import { pushNotification } from "@/mocks/data/notifications";
import type { InstitutionType, LeaveRequest, LeaveRequestStatus } from "@/types";

export const leaveRequestService = {
  listByInstitution: (institutionId: InstitutionType) =>
    mockRequest<LeaveRequest[]>(() => [...getLeaveRequestsByInstitution(institutionId)].sort((a, b) => b.requestedDate.localeCompare(a.requestedDate))),

  listByStudent: (studentId: string) => mockRequest<LeaveRequest[]>(() => getLeaveRequestsByStudent(studentId)),

  /** Requests for students in any of the given class/section groups — used by the Teacher portal's approval queue. */
  listForGroups: (institutionId: InstitutionType, groups: { classOrProgrammeId: string; section: string }[]) =>
    mockRequest<LeaveRequest[]>(() =>
      getLeaveRequestsByInstitution(institutionId).filter((r) => groups.some((g) => g.classOrProgrammeId === r.classOrProgrammeId && g.section === r.section)),
    ),

  create: (input: { studentId: string; requestedBy: string; startDate: string; endDate: string; reason: string }) =>
    mockRequest<{ ok: true; request: LeaveRequest } | { ok: false; error: string }>(() => {
      const student = getStudent(input.studentId);
      if (!student) return { ok: false, error: "Student not found." };
      if (!input.startDate || !input.endDate || input.startDate > input.endDate) return { ok: false, error: "Enter a valid date range." };

      const request: LeaveRequest = {
        id: `leave-live-${Date.now()}`,
        institutionId: student.institutionId,
        studentId: input.studentId,
        studentName: student.name,
        classOrProgrammeId: student.classOrProgrammeId,
        section: student.section,
        requestedBy: input.requestedBy,
        startDate: input.startDate,
        endDate: input.endDate,
        reason: input.reason,
        status: "Pending",
        requestedDate: "2026-11-04",
      };
      allLeaveRequests.unshift(request);
      logActivity({ institutionId: student.institutionId, category: "Students", action: `${input.requestedBy} submitted a leave request for ${student.name}`, actor: input.requestedBy });
      return { ok: true, request };
    }, { latencyMs: [350, 650] }),

  review: (id: string, decision: Exclude<LeaveRequestStatus, "Pending">, actor: string) =>
    mockRequest<{ ok: true } | { ok: false; error: string }>(() => {
      const request = allLeaveRequests.find((r) => r.id === id);
      if (!request) return { ok: false, error: "Request not found." };
      request.status = decision;
      request.reviewedBy = actor;
      request.reviewedDate = "2026-11-04";
      logActivity({ institutionId: request.institutionId, category: "Students", action: `${decision} leave request for ${request.studentName}`, actor });
      pushNotification({
        institutionId: request.institutionId,
        category: "General",
        title: `Leave request ${decision.toLowerCase()}`,
        body: `Your leave request (${request.startDate} to ${request.endDate}) was ${decision.toLowerCase()} by ${actor}.`,
        roles: ["student", "parent"],
        studentId: request.studentId,
      });
      return { ok: true };
    }, { latencyMs: [300, 550] }),
};
