import type { AcademicYear } from "@/types";

export const academicYears: AcademicYear[] = [
  { id: "ay-2526", label: "2025-26", startDate: "2025-06-01", endDate: "2026-04-30", isCurrent: false, terms: ["Term 1", "Term 2"] },
  { id: "ay-2627", label: "2026-27", startDate: "2026-06-01", endDate: "2027-04-30", isCurrent: true, terms: ["Term 1", "Term 2"] },
];

export function getCurrentAcademicYear(): AcademicYear {
  return academicYears.find((y) => y.isCurrent) ?? academicYears[0]!;
}
