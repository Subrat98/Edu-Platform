import { mockRequest } from "@/mocks/api/client";
import { getNotificationsFor } from "@/mocks/data/notifications";
import type { InstitutionType, RoleKey } from "@/types";

export const notificationService = {
  listFor: (institutionId: InstitutionType, role: RoleKey, studentIds: string[] = []) =>
    mockRequest(() => getNotificationsFor(institutionId, role, studentIds), { latencyMs: [150, 350] }),
};
