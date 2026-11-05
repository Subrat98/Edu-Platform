import { institutions } from "./institutions";
import { UNIFIED_THEME } from "@/theme/tokens";
import type { UnifiedInstitution } from "@/types";

const seed: UnifiedInstitution[] = [
  {
    id: "unified",
    mode: "both",
    name: "Pathani Samanta Education Campus",
    shortName: "PSEC",
    tagline: "One campus, two journeys — Nursery to Postgraduate.",
    description:
      "A single administration running Pathani Samanta Public School and Pathani Samanta College together as two wings of one campus, sharing one brand, one set of users and one combined dashboard while each wing keeps its own academic structure, admissions, attendance, examinations and fees.",
    theme: UNIFIED_THEME,
    wings: [
      { type: "school", name: institutions.school.name, tagline: institutions.school.tagline },
      { type: "college", name: institutions.college.name, tagline: institutions.college.tagline },
    ],
    modulesEnabled: ["admissions", "attendance", "examinations", "fees", "notices", "library"],
    createdAt: "2026-01-01",
  },
];

export const unifiedInstitutions = seed;

export function getUnifiedInstitution(id: string): UnifiedInstitution | undefined {
  return unifiedInstitutions.find((u) => u.id === id);
}

export function listUnifiedInstitutions(): UnifiedInstitution[] {
  return unifiedInstitutions;
}

export function pushUnifiedInstitution(inst: UnifiedInstitution): void {
  unifiedInstitutions.push(inst);
}
