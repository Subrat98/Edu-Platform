import { mockRequest } from "@/mocks/api/client";
import { getTimetableForGroup, getTimetableForStaff, getTimetableGroups, setTimetableEntry } from "@/mocks/data/erp/timetable";
import type { InstitutionType, TimetableEntry } from "@/types";

export const timetableService = {
  listGroups: (institutionId: InstitutionType) => mockRequest(() => getTimetableGroups(institutionId)),

  getForGroup: (institutionId: InstitutionType, classOrProgrammeId: string, section: string) =>
    mockRequest<TimetableEntry[]>(() => getTimetableForGroup(institutionId, classOrProgrammeId, section)),

  getForStaff: (staffId: string) => mockRequest<TimetableEntry[]>(() => getTimetableForStaff(staffId)),

  updateEntry: (id: string, subject: string, staffId: string, room: string) =>
    mockRequest<{ ok: true } | { ok: false; error: string }>(() => {
      const ok = setTimetableEntry(id, subject, staffId, room);
      return ok ? { ok: true } : { ok: false, error: "Timetable entry not found." };
    }),
};
