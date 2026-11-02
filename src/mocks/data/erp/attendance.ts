import { allStudents } from "./studentsGuardians";
import type { AttendanceRecord, AttendanceSession, AttendanceStatus, InstitutionType } from "@/types";

const LAST_10_WEEKDAYS = [
  "2026-10-19", "2026-10-20", "2026-10-21", "2026-10-22", "2026-10-23",
  "2026-10-26", "2026-10-27", "2026-10-28", "2026-10-29", "2026-10-30",
];

function statusFor(seed: number): AttendanceStatus {
  const r = seed % 20;
  if (r === 0) return "Absent";
  if (r === 1) return "Late";
  if (r === 2) return "Approved Leave";
  return "Present";
}

const sessions: AttendanceSession[] = [];
const records: AttendanceRecord[] = [];

// Group active students by institution + classOrProgrammeId + section so
// each group gets one attendance session per day (one teacher's register).
type GroupKey = string;
const groups = new Map<GroupKey, { institutionId: InstitutionType; classOrProgrammeId: string; section: string; studentIds: string[] }>();

allStudents
  .filter((s) => s.status === "Active")
  .forEach((s) => {
    const key = `${s.institutionId}::${s.classOrProgrammeId}::${s.section}`;
    if (!groups.has(key)) {
      groups.set(key, { institutionId: s.institutionId, classOrProgrammeId: s.classOrProgrammeId, section: s.section, studentIds: [] });
    }
    groups.get(key)!.studentIds.push(s.id);
  });

let sessionSeed = 0;
let recordSeed = 0;
for (const group of groups.values()) {
  for (const date of LAST_10_WEEKDAYS) {
    const session: AttendanceSession = {
      id: `attsess-${sessionSeed}`,
      institutionId: group.institutionId,
      date,
      classOrProgrammeId: group.classOrProgrammeId,
      section: group.section,
      subject: group.institutionId === "school" ? "Class Teacher Period" : "Tutorial",
      takenBy: group.institutionId === "school" ? "Class Teacher" : "Faculty Advisor",
    };
    sessions.push(session);
    sessionSeed += 1;

    group.studentIds.forEach((studentId) => {
      records.push({
        id: `attrec-${recordSeed}`,
        sessionId: session.id,
        studentId,
        status: statusFor(recordSeed),
      });
      recordSeed += 1;
    });
  }
}

export const allAttendanceSessions = sessions;
export const allAttendanceRecords = records;

export function getSessionsByInstitution(id: InstitutionType): AttendanceSession[] {
  return allAttendanceSessions.filter((s) => s.institutionId === id);
}

export function getRecordsBySession(sessionId: string): AttendanceRecord[] {
  return allAttendanceRecords.filter((r) => r.sessionId === sessionId);
}

export function getRecordsByStudent(studentId: string): AttendanceRecord[] {
  return allAttendanceRecords.filter((r) => r.studentId === studentId);
}

export function getSession(id: string): AttendanceSession | undefined {
  return allAttendanceSessions.find((s) => s.id === id);
}
