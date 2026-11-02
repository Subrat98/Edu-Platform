import { mockRequest } from "@/mocks/api/client";
import { getHomePage } from "@/mocks/data/pages";
import type { InstitutionType, Page } from "@/types";

export const pageService = {
  getHome: (institutionId: InstitutionType) =>
    mockRequest<Page>(() => getHomePage(institutionId), { latencyMs: [200, 400] }),
};
