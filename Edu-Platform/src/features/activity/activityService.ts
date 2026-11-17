import { mockRequest } from "@/mocks/api/client";
import { getActivityByInstitution } from "@/mocks/data/activityLog";
import type { ActivityCategory, ActivityEvent, InstitutionType } from "@/types";

export const activityService = {
  list: (institutionId: InstitutionType, category?: ActivityCategory) =>
    mockRequest<ActivityEvent[]>(() => getActivityByInstitution(institutionId, category), { latencyMs: [200, 450] }),
};
