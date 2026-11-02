import { mockRequest } from "@/mocks/api/client";
import { departments, getDepartment } from "@/mocks/data/departments";
import { programmes, getProgramme } from "@/mocks/data/programmes";
import { schoolClasses } from "@/mocks/data/classes";
import type { Department, Programme, SchoolClass } from "@/types";

export const academicService = {
  listDepartments: () => mockRequest<Department[]>(() => departments, { latencyMs: [250, 500] }),
  getDepartment: (slug: string) =>
    mockRequest<Department | null>(() => getDepartment(slug) ?? null, { latencyMs: [200, 400] }),
  listProgrammes: () => mockRequest<Programme[]>(() => programmes, { latencyMs: [250, 500] }),
  getProgramme: (slug: string) =>
    mockRequest<Programme | null>(() => getProgramme(slug) ?? null, { latencyMs: [200, 400] }),
  listSchoolClasses: () => mockRequest<SchoolClass[]>(() => schoolClasses, { latencyMs: [250, 500] }),
};
