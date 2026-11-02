import { mockRequest } from "@/mocks/api/client";
import {
  allStudents,
  getStudentsByInstitution,
  getStudent,
  getGuardian,
  getGuardiansByInstitution,
} from "@/mocks/data/erp/studentsGuardians";
import { getInvoicesByStudent } from "@/mocks/data/erp/finance";
import { getMarksByStudent } from "@/mocks/data/erp/examinations";
import { getRecordsByStudent, getSession } from "@/mocks/data/erp/attendance";
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
