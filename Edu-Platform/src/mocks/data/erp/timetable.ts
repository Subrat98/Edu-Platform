import { allStudents } from "./studentsGuardians";
import { SCHOOL_SUBJECTS_BY_STAGE, COLLEGE_SUBJECTS } from "./examinations";
import { schoolClasses } from "../classes";
import { programmes } from "../programmes";
import { getStaffByInstitution } from "../staff";
import type { InstitutionType, TimetableEntry } from "@/types";

const DAYS: TimetableEntry["day"][] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const PERIODS: { startTime: string; endTime: string }[] = [
  { startTime: "09:00", endTime: "09:40" },
  { startTime: "09:40", endTime: "10:20" },
  { startTime: "10:20", endTime: "11:00" },
  { startTime: "11:20", endTime: "12:00" },
  { startTime: "12:00", endTime: "12:40" },
  { startTime: "13:30", endTime: "14:10" },
];
const ROOMS = ["Room 101", "Room 102", "Room 103", "Science Lab", "Computer Lab", "Room 201", "Room 202"];

function groupActiveStudents(institutionId: InstitutionType) {
  const groups = new Map<string, { classOrProgrammeId: string; className: string; section: string }>();
  allStudents
    .filter((s) => s.institutionId === institutionId && s.status === "Active")
    .forEach((s) => {
      const key = `${s.classOrProgrammeId}::${s.section}`;
      if (!groups.has(key)) {
        groups.set(key, { classOrProgrammeId: s.classOrProgrammeId, className: s.classOrProgrammeName, section: s.section });
      }
    });
  return Array.from(groups.values());
}

const entries: TimetableEntry[] = [];
let seed = 0;

// ---- School: one row per active class/section, cycling the stage's subject list across the week ----
const schoolStaffList = getStaffByInstitution("school").filter((s) => !s.isLeadership);
groupActiveStudents("school").forEach((group) => {
  const cls = schoolClasses.find((c) => c.id === group.classOrProgrammeId);
  const subjects = cls ? SCHOOL_SUBJECTS_BY_STAGE[cls.stage] ?? [] : [];
  if (subjects.length === 0 || schoolStaffList.length === 0) return;

  DAYS.forEach((day, dayIndex) => {
    PERIODS.forEach((slot, periodIndex) => {
      const subject = subjects[(dayIndex + periodIndex) % subjects.length]!;
      // Physics periods in the Senior Secondary science stream are taught by the demo teacher persona.
      const isDemoTeacherSlot = cls?.stage === "Senior Secondary" && group.classOrProgrammeId === "class-11-12-science" && subject === subjects[0];
      const staffId = isDemoTeacherSlot ? "staff-sch-03" : schoolStaffList[seed % schoolStaffList.length]!.id;
      entries.push({
        id: `tt-sch-${seed}`,
        institutionId: "school",
        classOrProgrammeId: group.classOrProgrammeId,
        section: group.section,
        day,
        periodIndex,
        startTime: slot.startTime,
        endTime: slot.endTime,
        subject,
        staffId,
        room: ROOMS[seed % ROOMS.length]!,
      });
      seed += 1;
    });
  });
});

// ---- College: one row per active programme/semester, cycling the generic subject list ----
const collegeStaffList = getStaffByInstitution("college").filter((s) => !s.isLeadership);
groupActiveStudents("college").forEach((group) => {
  if (collegeStaffList.length === 0) return;
  const prog = programmes.find((p) => p.id === group.classOrProgrammeId);

  DAYS.forEach((day, dayIndex) => {
    PERIODS.forEach((slot, periodIndex) => {
      const subject = COLLEGE_SUBJECTS[(dayIndex + periodIndex) % COLLEGE_SUBJECTS.length]!;
      // Core Paper I periods for the B.Sc. CS programme are taught by the demo faculty persona.
      const isDemoFacultySlot = prog?.id === "prog-bsc-cs" && subject === COLLEGE_SUBJECTS[0];
      const staffId = isDemoFacultySlot ? "staff-col-02" : collegeStaffList[seed % collegeStaffList.length]!.id;
      entries.push({
        id: `tt-col-${seed}`,
        institutionId: "college",
        classOrProgrammeId: group.classOrProgrammeId,
        section: group.section,
        day,
        periodIndex,
        startTime: slot.startTime,
        endTime: slot.endTime,
        subject,
        staffId,
        room: ROOMS[seed % ROOMS.length]!,
      });
      seed += 1;
    });
  });
});

export const allTimetableEntries = entries;

export function getTimetableGroups(institutionId: InstitutionType) {
  return groupActiveStudents(institutionId);
}

export function getTimetableForGroup(institutionId: InstitutionType, classOrProgrammeId: string, section: string): TimetableEntry[] {
  return allTimetableEntries
    .filter((e) => e.institutionId === institutionId && e.classOrProgrammeId === classOrProgrammeId && e.section === section)
    .sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day) || a.periodIndex - b.periodIndex);
}

export function getTimetableForStaff(staffId: string): TimetableEntry[] {
  return allTimetableEntries.filter((e) => e.staffId === staffId).sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day) || a.periodIndex - b.periodIndex);
}

export function setTimetableEntry(id: string, subject: string, staffId: string, room: string): boolean {
  const entry = allTimetableEntries.find((e) => e.id === id);
  if (!entry) return false;
  entry.subject = subject;
  entry.staffId = staffId;
  entry.room = room;
  return true;
}
