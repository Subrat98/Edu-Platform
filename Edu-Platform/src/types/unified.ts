import type { InstitutionType } from "./institution";
import type { ThemeTokens } from "./theme";

/**
 * A "Both mode" institution per spec v4.2 §4.2 — one brand running a
 * School wing and a College wing together. In this frontend-only demo
 * there is exactly one School dataset (PSPS) and one College dataset
 * (PSC), so a Both-mode institution is a shared front door over that
 * existing data rather than a third, fully independent tenant: its
 * wings point at the real "school"/"college" records, and what's new
 * per Unified institution is just its own brand identity, personas and
 * combined dashboard view. See useUnifiedContext.ts for how a signed-in
 * persona's "home" institution and "current wing" are kept distinct.
 */
export interface WingSummary {
  type: InstitutionType;
  name: string;
  tagline: string;
}

export interface UnifiedInstitution {
  id: string;
  mode: "both";
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  theme: ThemeTokens;
  wings: WingSummary[];
  modulesEnabled: string[];
  createdAt: string;
}
