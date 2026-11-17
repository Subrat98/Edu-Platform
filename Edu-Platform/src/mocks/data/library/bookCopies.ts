import { allBookTitles } from "./bookTitles";
import type { BookCopy, CopyStatus } from "@/types";

const SHELVES = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "D1", "D2"];

function shelfFor(i: number) {
  return SHELVES[i % SHELVES.length]!;
}

export const bookCopies: BookCopy[] = allBookTitles.flatMap((title, titleIdx) => {
  const copyCount = title.isReference ? 1 : 2 + (titleIdx % 2);
  return Array.from({ length: copyCount }, (_, copyIdx) => {
    const prefix = title.institutionId === "school" ? "PSPS" : "PSC";
    const accessionNo = `${prefix}-${String(titleIdx + 1).padStart(3, "0")}-${copyIdx + 1}`;
    // Deterministic default status — specific copies are overridden to
    // "On Loan" / "Reserved" by the loans/bookings/reservations mock data
    // below, via setCopyStatus, so the two datasets never disagree.
    const status: CopyStatus = "Available";
    return {
      id: `copy-${title.id}-${copyIdx + 1}`,
      institutionId: title.institutionId,
      titleId: title.id,
      accessionNo,
      shelfLocation: `${title.category.slice(0, 3).toUpperCase()}-${shelfFor(titleIdx + copyIdx)}`,
      status,
    };
  });
});

const copyIndex = new Map(bookCopies.map((c) => [c.id, c]));

export function getCopy(id: string): BookCopy | undefined {
  return copyIndex.get(id);
}

export function getCopiesByTitle(titleId: string): BookCopy[] {
  return bookCopies.filter((c) => c.titleId === titleId);
}

export function getCopiesByInstitution(id: "school" | "college"): BookCopy[] {
  return bookCopies.filter((c) => c.institutionId === id);
}

/** Mutates a copy's status in the in-memory mock dataset (demo-only). */
export function setCopyStatus(id: string, status: CopyStatus): void {
  const copy = copyIndex.get(id);
  if (copy) copy.status = status;
}
