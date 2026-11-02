import type { LibrarySettings } from "@/types";

export const librarySettings: Record<"school" | "college", LibrarySettings> = {
  school: {
    institutionId: "school",
    loanPeriodDays: 14,
    maxConcurrentLoans: 2,
    renewalLimit: 1,
    fineRatePerDay: 2,
    fineCap: 200,
    reservationHoldDays: 2,
    bookingCollectionDeadlineDays: 2,
  },
  college: {
    institutionId: "college",
    loanPeriodDays: 14,
    maxConcurrentLoans: 3,
    renewalLimit: 1,
    fineRatePerDay: 2,
    fineCap: 200,
    reservationHoldDays: 2,
    bookingCollectionDeadlineDays: 2,
  },
};
