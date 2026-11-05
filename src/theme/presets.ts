import { SCHOOL_COLORS, COLLEGE_COLORS, BRAND_TYPOGRAPHY } from "./tokens";
import type { ColorTokens, ThemeTokens } from "@/types";

export interface ThemePreset {
  id: string;
  label: string;
  description: string;
  theme: ThemeTokens;
}

function colors(overrides: Partial<ColorTokens>, base: ColorTokens = SCHOOL_COLORS): ColorTokens {
  return { ...base, ...overrides };
}

// ---- School presets (spec §5.3) ----

export const SCHOOL_PRESETS: ThemePreset[] = [
  {
    id: "school-classic-scholar",
    label: "Classic Scholar",
    description: "Navy and gold, traditional centered header, principal message and toppers up front. Suited to established schools.",
    theme: {
      colors: colors({ primary: "#1f3a5f", accent: "#8a6d1f", accentForeground: "#ffffff", highlight: "#c98a00", highlightForeground: "#1f1300" }),
      typography: BRAND_TYPOGRAPHY,
      radius: "0.5rem",
      logoUrl: "",
    },
  },
  {
    id: "school-bright-kids",
    label: "Bright Kids",
    description: "Playful palette, rounded cards, large imagery, activity-focused homepage. Suited to pre-primary and primary.",
    theme: {
      colors: colors({ primary: "#1d7a7a", accent: "#e0a100", accentForeground: "#1f1300", highlight: "#e8590c", highlightForeground: "#ffffff" }),
      typography: BRAND_TYPOGRAPHY,
      radius: "1.25rem",
      logoUrl: "",
    },
  },
  {
    id: "school-modern-campus",
    label: "Modern Campus",
    description: "Transparent header over a full-bleed hero, video-friendly, parent-corner shortcuts. Suited to senior secondary.",
    theme: {
      colors: colors({ primary: "#1a2b4a", accent: "#2563a8", accentForeground: "#ffffff", highlight: "#16a34a", highlightForeground: "#ffffff" }),
      typography: BRAND_TYPOGRAPHY,
      radius: "0.75rem",
      logoUrl: "",
    },
  },
];

// ---- College presets (spec §5.3) ----

export const COLLEGE_PRESETS: ThemePreset[] = [
  {
    id: "college-academic-classic",
    label: "Academic Classic",
    description: "Accreditation strip, mega-menu, department and programme cards. Suited to degree colleges.",
    theme: {
      colors: colors({ primary: "#1b2f52", accent: "#2563a8", accentForeground: "#ffffff", highlight: "#c98a00", highlightForeground: "#1f1300" }, COLLEGE_COLORS),
      typography: BRAND_TYPOGRAPHY,
      radius: "0.5rem",
      logoUrl: "",
    },
  },
  {
    id: "college-research-forward",
    label: "Research Forward",
    description: "Research, publications and IQAC emphasis; documents-heavy layout for accreditation.",
    theme: {
      colors: colors({ primary: "#2f3e46", accent: "#52796f", accentForeground: "#ffffff", highlight: "#b45309", highlightForeground: "#ffffff" }, COLLEGE_COLORS),
      typography: BRAND_TYPOGRAPHY,
      radius: "0.375rem",
      logoUrl: "",
    },
  },
  {
    id: "college-campus-life",
    label: "Campus Life",
    description: "Events, placements and student corner emphasis; vibrant imagery and bottom-tab mobile navigation.",
    theme: {
      colors: colors({ primary: "#6d28d9", accent: "#db2777", accentForeground: "#ffffff", highlight: "#f59e0b", highlightForeground: "#1f1300" }, COLLEGE_COLORS),
      typography: BRAND_TYPOGRAPHY,
      radius: "1rem",
      logoUrl: "",
    },
  },
];

export function presetsFor(siteArea: "school" | "college"): ThemePreset[] {
  return siteArea === "school" ? SCHOOL_PRESETS : COLLEGE_PRESETS;
}
