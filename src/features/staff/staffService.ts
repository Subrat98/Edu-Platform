import { mockRequest } from "@/mocks/api/client";
import { allStaff, getStaffByInstitution } from "@/mocks/data/staff";
import { getTimetableForStaff } from "@/mocks/data/erp/timetable";
import { schoolClasses } from "@/mocks/data/classes";
import { programmes } from "@/mocks/data/programmes";
import type { InstitutionType, StaffMember } from "@/types";

function classOrProgrammeName(id: string): string {
  return schoolClasses.find((c) => c.id === id)?.name ?? programmes.find((p) => p.id === id)?.name ?? id;
}

export const staffService = {
  list: (institutionId: InstitutionType) =>
    mockRequest<StaffMember[]>(() => getStaffByInstitution(institutionId), { latencyMs: [300, 600] }),

  get: (id: string) => mockRequest<StaffMember | null>(() => allStaff.find((s) => s.id === id) ?? null),

  listByDepartment: (departmentId: string) => mockRequest<StaffMember[]>(() => allStaff.filter((s) => s.departmentId === departmentId)),

  /** Distinct class/section/subject combinations a staff member teaches, derived from the timetable. */
  getAssignments: (staffId: string) =>
    mockRequest(() => {
      const entries = getTimetableForStaff(staffId);
      const seen = new Map<string, { classOrProgrammeId: string; className: string; section: string; subject: string; periodCount: number }>();
      entries.forEach((e) => {
        const key = `${e.classOrProgrammeId}::${e.section}::${e.subject}`;
        if (!seen.has(key)) {
          seen.set(key, { classOrProgrammeId: e.classOrProgrammeId, className: classOrProgrammeName(e.classOrProgrammeId), section: e.section, subject: e.subject, periodCount: 0 });
        }
        seen.get(key)!.periodCount += 1;
      });
      return Array.from(seen.values());
    }),
};
