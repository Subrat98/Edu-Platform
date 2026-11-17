import type { ColorTokens, ThemeTokens, TypographyTokens } from "@/types";
import eduPlatformLogo from "@/assets/Edu-Platform Education Logo.png";
import collegeLogo from "@/assets/college-logo.png";

export const SCHOOL_COLORS: ColorTokens = {
  primary: "#C21717",
  primaryForeground: "#FFFFFF",
  accent: "#991b1b",
  accentForeground: "#FFFFFF",
  highlight: "#e0a100",
  highlightForeground: "#1f1300",
  background: "#FFFFFF",
  surface: "#FFFFFF",
  textPrimary: "#7F0000",
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
  primary: "#C21717",
  accent: "#991b1b",
  accentForeground: "#FFFFFF",
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
  logoUrl: collegeLogo,
};

// A third, visually distinct identity (deep maroon + amber) so a "Both
// mode" institution's shared brand header is obviously its own thing,
// not just a relabelled school or college.
export const UNIFIED_COLORS: ColorTokens = {
  ...SCHOOL_COLORS,
  primary: "#7a2048",
  primaryForeground: "#FFFFFF",
  accent: "#b8761f",
  accentForeground: "#1f1300",
  highlight: "#1f8a5f",
  highlightForeground: "#FFFFFF",
};

export const UNIFIED_THEME: ThemeTokens = {
  colors: UNIFIED_COLORS,
  typography: BRAND_TYPOGRAPHY,
  radius: "0.65rem",
  logoUrl: eduPlatformLogo,
};
