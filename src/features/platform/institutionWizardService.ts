import { mockRequest } from "@/mocks/api/client";
import { pushUnifiedInstitution } from "@/mocks/data/unifiedInstitutions";
import { institutions } from "@/mocks/data/institutions";
import { demoUsers } from "@/mocks/data/users";
import { portraitUrl } from "@/mocks/data/images";
import { logActivity } from "@/mocks/data/activityLog";
import { UNIFIED_THEME } from "@/theme/tokens";
import { SCHOOL_PRESETS, COLLEGE_PRESETS } from "@/theme/presets";
import type { DemoUser, UnifiedInstitution } from "@/types";

export interface WizardInput {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  presetId: string;
  modulesEnabled: string[];
  adminName: string;
  adminTitle: string;
}

export const ALL_TEMPLATE_PRESETS = [...SCHOOL_PRESETS, ...COLLEGE_PRESETS];

const MODULE_OPTIONS = [
  { id: "admissions", label: "Admissions" },
  { id: "attendance", label: "Attendance" },
  { id: "examinations", label: "Examinations" },
  { id: "fees", label: "Fees & Finance" },
  { id: "notices", label: "Notices" },
  { id: "library", label: "Library" },
] as const;

export { MODULE_OPTIONS };

export const institutionWizardService = {
  /**
   * This demo has exactly one School dataset and one College dataset, so
   * a wizard-created Both-mode institution can't get a genuinely separate
   * third dataset (see src/types/unified.ts). What it creates is real: a
   * new brand identity, a new signed-in persona, and a new entry on the
   * login grid — its wings simply point at the same underlying PSPS/PSC
   * academic data as the built-in demo institution.
   */
  createUnifiedInstitution: (input: WizardInput, actor: string) =>
    mockRequest<{ ok: true; institution: UnifiedInstitution; user: DemoUser } | { ok: false; error: string }>(() => {
      if (!input.name.trim()) return { ok: false, error: "Institution name is required." };
      if (!input.adminName.trim()) return { ok: false, error: "An admin persona name is required." };

      const id = `unified-${Date.now()}`;
      const preset = ALL_TEMPLATE_PRESETS.find((p) => p.id === input.presetId);
      const shortName = input.shortName.trim() || input.name.trim().slice(0, 6).toUpperCase();

      const institution: UnifiedInstitution = {
        id,
        mode: "both",
        name: input.name.trim(),
        shortName,
        tagline: input.tagline.trim() || "One campus, two journeys.",
        description: input.description.trim(),
        theme: preset ? preset.theme : UNIFIED_THEME,
        wings: [
          { type: "school", name: institutions.school.name, tagline: institutions.school.tagline },
          { type: "college", name: institutions.college.name, tagline: institutions.college.tagline },
        ],
        modulesEnabled: input.modulesEnabled,
        createdAt: "2026-11-04",
      };
      pushUnifiedInstitution(institution);

      const slug = shortName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const user: DemoUser = {
        id: `user-${id}`,
        name: input.adminName.trim(),
        email: `${slug}-admin@eduplatform.demo`,
        role: "institution_admin",
        institutionId: "school",
        homeInstitutionId: id,
        avatarUrl: portraitUrl(12),
        title: input.adminTitle.trim() || `Institution Admin, ${shortName}`,
      };
      demoUsers.push(user);

      logActivity({
        institutionId: "school",
        category: "Settings",
        action: `Created institution "${institution.name}" via the Setup Wizard`,
        actor,
        detail: `Mode: Both · Admin persona: ${user.name}`,
      });

      return { ok: true, institution, user };
    }, { latencyMs: [500, 900] }),
};
