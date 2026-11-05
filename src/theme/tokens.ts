import type { ColorTokens, ThemeTokens, TypographyTokens } from "@/types";
import eduPlatformLogo from "@/assets/Edu-Platform Education Logo.png";

export const SCHOOL_COLORS: ColorTokens = {
  primary: "#1f3a5f",
  primaryForeground: "#ffffff",
  accent: "#0e8f8f",
  accentForeground: "#ffffff",
  highlight: "#e0a100",
  highlightForeground: "#1f1300",
  background: "#f5f7fb",
  surface: "#ffffff",
  textPrimary: "#172b4d",
  textSecondary: "#64748b",
  border: "#e2e8f0",
  success: "#15803d",
  warning: "#b45309",
  error: "#dc2626",
  info: "#2563eb",
};

// College gets a differentiated accent + slightly sharper corners so the
// theming engine is visibly proven, not just relabelled.
export const COLLEGE_COLORS: ColorTokens = {
  ...SCHOOL_COLORS,
  primary: "#1b2f52",
  accent: "#2563a8",
  accentForeground: "#ffffff",
  highlight: "#c98a00",
};

export const BRAND_TYPOGRAPHY: TypographyTokens = {
  headingFont: '"Poppins", ui-sans-serif, system-ui, sans-serif',
  bodyFont: '"Inter", ui-sans-serif, system-ui, sans-serif',
};

export const SCHOOL_THEME: ThemeTokens = {
  colors: SCHOOL_COLORS,
  typography: BRAND_TYPOGRAPHY,
  radius: "0.75rem",
  logoUrl: eduPlatformLogo,
};

export const COLLEGE_THEME: ThemeTokens = {
  colors: COLLEGE_COLORS,
  typography: BRAND_TYPOGRAPHY,
  radius: "0.5rem",
  logoUrl: eduPlatformLogo,
};

// A third, visually distinct identity (deep maroon + amber) so a "Both
// mode" institution's shared brand header is obviously its own thing,
// not just a relabelled school or college.
export const UNIFIED_COLORS: ColorTokens = {
  ...SCHOOL_COLORS,
  primary: "#7a2048",
  primaryForeground: "#ffffff",
  accent: "#b8761f",
  accentForeground: "#1f1300",
  highlight: "#1f8a5f",
  highlightForeground: "#ffffff",
};

export const UNIFIED_THEME: ThemeTokens = {
  colors: UNIFIED_COLORS,
  typography: BRAND_TYPOGRAPHY,
  radius: "0.65rem",
  logoUrl: eduPlatformLogo,
};
