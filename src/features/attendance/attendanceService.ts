import { mockRequest } from "@/mocks/api/client";
import {
  allAttendanceRecords,
  allAttendanceSessions,
  getSessionsByInstitution,
  getRecordsBySession,
} from "@/mocks/data/erp/attendance";
import { getStudentsByInstitution } from "@/mocks/data/erp/studentsGuardians";
import { logActivity } from "@/mocks/data/activityLog";
import type { AttendanceRecord, AttendanceSession, AttendanceStatus, InstitutionType } from "@/types";

export const attendanceService = {
  listSessions: (institutionId: InstitutionType) =>
    mockRequest<AttendanceSession[]>(() => [...getSessionsByInstitution(institutionId)].sort((a, b) => b.date.localeCompare(a.date))),

  getSessionWithRecords: (sessionId: string) =>
    mockRequest(() => {
      const session = allAttendanceSessions.find((s) => s.id === sessionId);
      if (!session) return null;
      const records = getRecordsBySession(sessionId);
      return { session, records };
    }),

  getClassGroups: (institutionId: InstitutionType) =>
    mockRequest(() => {
      const students = getStudentsByInstitution(institutionId).filter((s) => s.status === "Active");
      const groups = new Map<string, { classOrProgrammeId: string; className: string; section: string; studentCount: number }>();
      students.forEach((s) => {
        const key = `${s.classOrProgrammeId}::${s.section}`;
        if (!groups.has(key)) {
          groups.set(key, { classOrProgrammeId: s.classOrProgrammeId, className: s.classOrProgrammeName, section: s.section, studentCount: 0 });
        }
        groups.get(key)!.studentCount += 1;
      });
      return Array.from(groups.values());
    }),

  getStudentsForGroup: (institutionId: InstitutionType, classOrProgrammeId: string, section: string) =>
    mockRequest(() => getStudentsByInstitution(institutionId).filter((s) => s.classOrProgrammeId === classOrProgrammeId && s.section === section && s.status === "Active")),

  markAttendance: (
    institutionId: InstitutionType,
    classOrProgrammeId: string,
    section: string,
    subject: string,
    date: string,
    takenBy: string,
    statuses: Record<string, AttendanceStatus>,
  ) =>
    mockRequest<{ ok: true; sessionId: string }>(() => {
      const existing = allAttendanceSessions.find(
        (s) => s.institutionId === institutionId && s.classOrProgrammeId === classOrProgrammeId && s.section === section && s.date === date && s.subject === subject,
      );
      const sessionId = existing?.id ?? `attsess-live-${Date.now()}`;
      if (!existing) {
        allAttendanceSessions.unshift({ id: sessionId, institutionId, date, classOrProgrammeId, section, subject, takenBy });
      }
      Object.entries(statuses).forEach(([studentId, status]) => {
        const existingRecord = allAttendanceRecords.find((r) => r.sessionId === sessionId && r.studentId === studentId);
        if (existingRecord) existingRecord.status = status;
        else allAttendanceRecords.push({ id: `attrec-live-${Date.now()}-${studentId}`, sessionId, studentId, status });
      });
      logActivity({
        institutionId,
        category: "Attendance",
        action: `Marked attendance for ${section} (${subject}) — ${Object.keys(statuses).length} students`,
        actor: takenBy,
      });
      return { ok: true, sessionId };
    }, { latencyMs: [400, 700] }),

  getDailySummary: (institutionId: InstitutionType, date: string) =>
    mockRequest(() => {
      const sessions = getSessionsByInstitution(institutionId).filter((s) => s.date === date);
      const records: AttendanceRecord[] = sessions.flatMap((s) => getRecordsBySession(s.id));
      const present = records.filter((r) => r.status === "Present" || r.status === "Late").length;
      const absent = records.filter((r) => r.status === "Absent").length;
      const late = records.filter((r) => r.status === "Late").length;
      const leave = records.filter((r) => r.status === "Approved Leave").length;
      return { total: records.length, present, absent, late, leave, percentage: records.length > 0 ? Math.round((present / records.length) * 100) : 0 };
    }),
};
