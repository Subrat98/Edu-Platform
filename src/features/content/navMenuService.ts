import { mockRequest } from "@/mocks/api/client";
import { getNavMenu } from "@/mocks/data/navMenus";
import type { InstitutionType, NavMenu } from "@/types";

export const navMenuService = {
  get: (institutionId: InstitutionType) =>
    mockRequest<NavMenu>(() => getNavMenu(institutionId), { latencyMs: [80, 180] }),
};
