import type { ThemeTokens } from "@/types";

/**
 * Only brand-identity tokens are written as inline styles. Surface tokens
 * (background/surface/text/border) are deliberately excluded — those are
 * owned by the light/dark mode CSS cascade (see .dark in globals.css).
 * Inline styles always beat class-based rules, so if we wrote those here
 * too we'd permanently clobber dark mode for every institution.
 */
const IDENTITY_VAR_MAP: Partial<Record<keyof ThemeTokens["colors"], string>> = {
  primary: "--color-primary",
  primaryForeground: "--color-primary-foreground",
  accent: "--color-accent",
  accentForeground: "--color-accent-foreground",
  highlight: "--color-highlight",
  highlightForeground: "--color-highlight-foreground",
  success: "--color-success",
  warning: "--color-warning",
  error: "--color-error",
  info: "--color-info",
};

/**
 * Writes an institution's brand-identity theme tokens onto :root as CSS
 * custom properties. This is the multi-tenant re-theming mechanism: every
 * Tailwind utility class (bg-primary, text-muted, font-heading, ...) reads
 * these vars indirectly through the shadcn primitive tokens wired up in
 * src/styles/globals.css, so no component needs institution-aware logic.
 */
export function applyTheme(theme: ThemeTokens) {
  const root = document.documentElement.style;

  (Object.keys(IDENTITY_VAR_MAP) as (keyof ThemeTokens["colors"])[]).forEach((key) => {
    const cssVar = IDENTITY_VAR_MAP[key];
    if (cssVar) root.setProperty(cssVar, theme.colors[key]);
  });

  root.setProperty("--font-heading", theme.typography.headingFont);
  root.setProperty("--font-body", theme.typography.bodyFont);
  root.setProperty("--radius", theme.radius);
}
