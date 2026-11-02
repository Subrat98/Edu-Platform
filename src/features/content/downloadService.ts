import { mockRequest } from "@/mocks/api/client";
import { getDownloadsByInstitution } from "@/mocks/data/downloads";
import type { DownloadDocument, InstitutionType } from "@/types";

export const downloadService = {
  list: (institutionId: InstitutionType) =>
    mockRequest<DownloadDocument[]>(() => getDownloadsByInstitution(institutionId), { latencyMs: [250, 500] }),
};
