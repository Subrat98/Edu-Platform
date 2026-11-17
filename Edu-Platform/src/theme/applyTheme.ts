import type { ThemeTokens } from "@/types";

/**
 * Writes an institution's brand, background, text, and button tokens onto
 * :root as CSS custom properties.
 *
 * This ensures that when the user modifies any color in the Theme Designer
 * (e.g. changing the red primary color to green, or changing the white
 * background, text, or button colors), the change is instantly reflected
 * across every Tailwind utility class (bg-primary, text-primary, bg-background,
 * text-foreground, bg-card, border-border, etc.) across the entire website.
 */
export function applyTheme(theme: ThemeTokens) {
  if (typeof document === "undefined") return;
  const root = document.documentElement.style;
  const colors = theme.colors;

  // 1. Primary Brand Color (Where red is now)
  if (colors.primary) {
    root.setProperty("--color-primary", colors.primary);
    root.setProperty("--primary", colors.primary);
    root.setProperty("--color-brand-primary", colors.primary);
    root.setProperty("--chart-1", colors.primary);
    root.setProperty("--sidebar-primary", colors.primary);
  }
  if (colors.primaryForeground) {
    root.setProperty("--color-primary-foreground", colors.primaryForeground);
    root.setProperty("--primary-foreground", colors.primaryForeground);
    root.setProperty("--sidebar-primary-foreground", colors.primaryForeground);
  }

  // 2. Buttons (Button background & text)
  // If buttonBackground is customized, use it; otherwise follows primary
  const btnBg = colors.buttonBackground || colors.primary;
  const btnFg = colors.buttonForeground || colors.primaryForeground || "#FFFFFF";
  if (btnBg) {
    root.setProperty("--color-button-bg", btnBg);
    root.setProperty("--button-bg", btnBg);
  }
  if (btnFg) {
    root.setProperty("--color-button-fg", btnFg);
    root.setProperty("--button-fg", btnFg);
  }

  // 3. Background & Surface (Where white is now)
  if (colors.background) {
    root.setProperty("--color-bg", colors.background);
    root.setProperty("--background", colors.background);
    root.setProperty("--sidebar-accent", colors.background);
  }
  if (colors.surface) {
    root.setProperty("--color-surface", colors.surface);
    root.setProperty("--card", colors.surface);
    root.setProperty("--popover", colors.surface);
    root.setProperty("--sidebar", colors.surface);
  }

  // 4. Main Text & Heading Color
  if (colors.textPrimary) {
    root.setProperty("--color-text", colors.textPrimary);
    root.setProperty("--foreground", colors.textPrimary);
    root.setProperty("--card-foreground", colors.textPrimary);
    root.setProperty("--popover-foreground", colors.textPrimary);
    root.setProperty("--sidebar-foreground", colors.textPrimary);
    root.setProperty("--color-heading", colors.textPrimary);
    root.setProperty("--heading", colors.textPrimary);
  }
  if (colors.textSecondary) {
    root.setProperty("--color-text-muted", colors.textSecondary);
    root.setProperty("--muted-foreground", colors.textSecondary);
  }

  // 5. Accent & Secondary (Secondary buttons, active links, rings)
  if (colors.accent) {
    root.setProperty("--color-accent", colors.accent);
    root.setProperty("--color-brand-accent", colors.accent);
    root.setProperty("--secondary", colors.accent);
    root.setProperty("--accent", colors.accent);
    root.setProperty("--ring", colors.accent);
    root.setProperty("--sidebar-ring", colors.accent);
    root.setProperty("--chart-2", colors.accent);
  }
  if (colors.accentForeground) {
    root.setProperty("--color-accent-foreground", colors.accentForeground);
    root.setProperty("--secondary-foreground", colors.accentForeground);
    root.setProperty("--accent-foreground", colors.accentForeground);
  }

  // 6. Highlight (Key CTA buttons like Apply Now)
  if (colors.highlight) {
    root.setProperty("--color-highlight", colors.highlight);
    root.setProperty("--color-brand-highlight", colors.highlight);
    root.setProperty("--highlight", colors.highlight);
    root.setProperty("--chart-3", colors.highlight);
  }
  if (colors.highlightForeground) {
    root.setProperty("--color-highlight-foreground", colors.highlightForeground);
    root.setProperty("--highlight-foreground", colors.highlightForeground);
  }

  // 7. Border & Divider
  if (colors.border) {
    root.setProperty("--color-border", colors.border);
    root.setProperty("--border", colors.border);
    root.setProperty("--input", colors.border);
    root.setProperty("--sidebar-border", colors.border);
  }

  // 8. Alerts & Status
  if (colors.success) root.setProperty("--color-success", colors.success);
  if (colors.warning) root.setProperty("--color-warning", colors.warning);
  if (colors.error) {
    root.setProperty("--color-error", colors.error);
    root.setProperty("--destructive", colors.error);
  }
  if (colors.info) root.setProperty("--color-info", colors.info);

  // 9. Typography & Radius
  if (theme.typography?.headingFont) root.setProperty("--font-heading", theme.typography.headingFont);
  if (theme.typography?.bodyFont) root.setProperty("--font-body", theme.typography.bodyFont);
  if (theme.radius) root.setProperty("--radius", theme.radius);

  // Meta theme-color for browser tab and PWA chrome
  if (colors.primary) {
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", colors.primary);
  }
}
