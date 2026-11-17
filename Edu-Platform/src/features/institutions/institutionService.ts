import { mockRequest } from "@/mocks/api/client";
import { institutions } from "@/mocks/data/institutions";
import { logActivity } from "@/mocks/data/activityLog";
import type { ContactInfo, Institution, InstitutionType, SocialLinks } from "@/types";

export const institutionService = {
  get: (id: InstitutionType) => mockRequest<Institution>(() => institutions[id], { latencyMs: [100, 250] }),
  list: () => mockRequest<Institution[]>(() => Object.values(institutions), { latencyMs: [100, 250] }),

  update: (
    id: InstitutionType,
    patch: { tagline?: string; description?: string; contact?: Partial<ContactInfo>; socials?: Partial<SocialLinks> },
    actor: string,
  ) =>
    mockRequest<{ ok: true; institution: Institution }>(() => {
      const inst = institutions[id];
      if (patch.tagline !== undefined) inst.tagline = patch.tagline;
      if (patch.description !== undefined) inst.description = patch.description;
      if (patch.contact) Object.assign(inst.contact, patch.contact);
      if (patch.socials) Object.assign(inst.socials, patch.socials);
      logActivity({ institutionId: id, category: "Settings", action: "Updated institution profile", actor });
      return { ok: true, institution: inst };
    }, { latencyMs: [350, 650] }),
};
