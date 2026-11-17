import { mockRequest } from "@/mocks/api/client";
import { getNoticesByInstitution } from "@/mocks/data/notices";
import type { InstitutionType, Notice } from "@/types";

export const noticeService = {
  list: (institutionId: InstitutionType) =>
    mockRequest<Notice[]>(
      () =>
        [...getNoticesByInstitution(institutionId)].sort((a, b) => {
          if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
          return b.date.localeCompare(a.date);
        }),
      { latencyMs: [300, 600] },
    ),
};
