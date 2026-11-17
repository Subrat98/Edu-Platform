import { mockRequest } from "@/mocks/api/client";
import {
  allStudents,
  allGuardians,
  getStudentsByInstitution,
  getStudent,
  getGuardian,
  getGuardiansByInstitution,
} from "@/mocks/data/erp/studentsGuardians";
import { getInvoicesByStudent } from "@/mocks/data/erp/finance";
import { getMarksByStudent } from "@/mocks/data/erp/examinations";
import { getRecordsByStudent, getSession } from "@/mocks/data/erp/attendance";
import { logActivity } from "@/mocks/data/activityLog";
import type { Guardian, InstitutionType, Student } from "@/types";

export const studentService = {
  list: (institutionId: InstitutionType) => mockRequest<Student[]>(() => getStudentsByInstitution(institutionId)),

  get: (id: string) => mockRequest<Student | null>(() => getStudent(id) ?? null),

  getGuardian: (id: string) => mockRequest<Guardian | null>(() => getGuardian(id) ?? null),

  listGuardians: (institutionId: InstitutionType) => mockRequest<Guardian[]>(() => getGuardiansByInstitution(institutionId)),

  getByGuardian: (guardianId: string) =>
    mockRequest<Student[]>(() => {
      const guardian = getGuardian(guardianId);
      if (!guardian) return [];
      return guardian.studentIds.map((id) => getStudent(id)).filter((s): s is Student => !!s);
    }),

  updateStatus: (studentId: string, status: Student["status"]) =>
    mockRequest<{ ok: true } | { ok: false; error: string }>(() => {
      const student = allStudents.find((s) => s.id === studentId);
      if (!student) return { ok: false, error: "Student not found." };
      student.status = status;
      return { ok: true };
    }),

  getAttendanceSummary: (studentId: string) =>
    mockRequest(() => {
      const records = getRecordsByStudent(studentId);
      const total = records.length;
      const present = records.filter((r) => r.status === "Present" || r.status === "Late").length;
      return {
        total,
        present,
        percentage: total > 0 ? Math.round((present / total) * 100) : 0,
        recent: records
          .map((r) => ({ ...r, date: getSession(r.sessionId)?.date ?? "" }))
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, 10),
      };
    }),

  getResultsSummary: (studentId: string) => mockRequest(() => getMarksByStudent(studentId)),

  getFeeLedger: (studentId: string) => mockRequest(() => getInvoicesByStudent(studentId)),

  /** Self-service contact update — scoped to phone/email only, unlike the admin-only institutionService.update. */
  updateGuardianContact: (guardianId: string, patch: { phone?: string; email?: string }, actor: string) =>
    mockRequest<{ ok: true } | { ok: false; error: string }>(() => {
      const guardian = allGuardians.find((g) => g.id === guardianId);
      if (!guardian) return { ok: false, error: "Guardian record not found." };
      if (patch.phone !== undefined) guardian.phone = patch.phone;
      if (patch.email !== undefined) guardian.email = patch.email;
      logActivity({ institutionId: guardian.institutionId, category: "Students", action: `${actor} updated their contact details`, actor });
      return { ok: true };
    }, { latencyMs: [300, 550] }),

  getDashboardStats: (institutionId: InstitutionType) =>
    mockRequest(() => {
      const students = getStudentsByInstitution(institutionId);
      return {
        total: students.length,
        active: students.filter((s) => s.status === "Active").length,
        transferred: students.filter((s) => s.status === "Transferred").length,
        graduated: students.filter((s) => s.status === "Graduated").length,
      };
    }),
};
