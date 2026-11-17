// Accessibility helpers for GIGW 3.0 and WCAG 2.1 AA compliance

export type TextZoomLevel = "small" | "normal" | "large";

export function setTextZoom(level: TextZoomLevel) {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  html.classList.remove("text-zoom-small", "text-zoom-large");

  if (level === "small") {
    html.classList.add("text-zoom-small");
    html.style.fontSize = "14px";
  } else if (level === "large") {
    html.classList.add("text-zoom-large");
    html.style.fontSize = "18px";
  } else {
    html.style.fontSize = "16px";
  }

  try {
    localStorage.setItem("eduplatform_text_zoom", level);
  } catch (e) {
    // ignore
  }
}

export function getStoredTextZoom(): TextZoomLevel {
  if (typeof localStorage === "undefined") return "normal";
  try {
    return (localStorage.getItem("eduplatform_text_zoom") as TextZoomLevel) || "normal";
  } catch {
    return "normal";
  }
}
