// Accessibility helpers for GIGW 3.0 and WCAG 2.1 AA compliance

export type TextZoomLevel = "small" | "normal" | "medium";

export interface TextZoomOption {
  level: TextZoomLevel;
  label: string;
  percent: number;
  description: string;
}

export const TEXT_ZOOM_OPTIONS: TextZoomOption[] = [
  { level: "small", label: "-A", percent: 90, description: "Decrease Text Size (-A 90%)" },
  { level: "normal", label: "A", percent: 100, description: "Normal Default Size (A 100%)" },
  { level: "medium", label: "A+", percent: 115, description: "Increase Text Size (A+ 115%)" },
];

/**
 * Set root font-size percentage smoothly (e.g. from 80% to 150%).
 * Updates the HTML root element and persists to localStorage.
 */
export function setTextZoomPercent(percent: number) {
  if (typeof document === "undefined") return;
  const clamped = Math.max(75, Math.min(160, Math.round(percent)));
  const html = document.documentElement;

  html.style.fontSize = `${clamped}%`;

  let level: TextZoomLevel = "normal";
  if (clamped < 98) {
    level = "small";
  } else if (clamped > 105) {
    level = "medium";
  } else {
    level = "normal";
  }

  html.setAttribute("data-text-zoom", level);
  html.setAttribute("data-text-zoom-percent", clamped.toString());

  try {
    localStorage.setItem("eduplatform_text_zoom_percent", clamped.toString());
    localStorage.setItem("eduplatform_text_zoom", level);
    window.dispatchEvent(
      new CustomEvent("eduplatform_text_zoom_changed", {
        detail: { percent: clamped, level },
      })
    );
  } catch (e) {
    // ignore
  }
}

/**
 * Discrete zoom level helper: small (-A, 90%), normal (A, 100%), medium (A+, 115%)
 */
export function setTextZoom(level: TextZoomLevel) {
  const percentMap: Record<TextZoomLevel, number> = {
    small: 90,
    normal: 100,
    medium: 115,
  };
  setTextZoomPercent(percentMap[level] ?? 100);
}

export function getStoredTextZoomPercent(): number {
  if (typeof localStorage === "undefined") return 100;
  try {
    const storedPercent = localStorage.getItem("eduplatform_text_zoom_percent");
    if (storedPercent) {
      const parsed = parseInt(storedPercent, 10);
      if (!isNaN(parsed) && parsed >= 75 && parsed <= 160) {
        return parsed;
      }
    }
    const storedLevel = localStorage.getItem("eduplatform_text_zoom") as TextZoomLevel;
    if (storedLevel === "small") return 90;
    if (storedLevel === "medium") return 115;
    return 100;
  } catch {
    return 100;
  }
}

export function getStoredTextZoom(): TextZoomLevel {
  const percent = getStoredTextZoomPercent();
  if (percent < 98) return "small";
  if (percent > 105) return "medium";
  return "normal";
}

export function initTextZoom() {
  if (typeof window === "undefined") return;
  const percent = getStoredTextZoomPercent();
  setTextZoomPercent(percent);
}
