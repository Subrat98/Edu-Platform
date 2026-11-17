import { readStorage, writeStorage } from "@/lib/storage";
import { institutions } from "@/mocks/data/institutions";
import { applyTheme } from "./applyTheme";
import type { ThemeTokens, ColorTokens, InstitutionType } from "@/types";

export type ThemeTargetScope = "global" | "college" | "school";

export function getCustomTheme(institutionId: InstitutionType): ThemeTokens {
  const custom = readStorage<ThemeTokens | null>(`custom_theme_${institutionId}`, null);
  const global = readStorage<ThemeTokens | null>("custom_theme_global", null);
  const base = institutions[institutionId]?.theme ?? institutions.college.theme;

  const effectiveBase: ThemeTokens =
    global && global.colors
      ? {
          ...base,
          ...global,
          colors: { ...base.colors, ...global.colors },
          radius: global.radius || base.radius,
        }
      : base;

  if (custom && custom.colors) {
    return {
      ...effectiveBase,
      ...custom,
      colors: { ...effectiveBase.colors, ...custom.colors },
      radius: custom.radius || effectiveBase.radius,
    };
  }
  return effectiveBase;
}

export function saveCustomTheme(
  scope: ThemeTargetScope,
  colors: Partial<ColorTokens>,
  radius?: string
): { collegeTheme: ThemeTokens; schoolTheme: ThemeTokens } {
  const currentGlobal = readStorage<Partial<ThemeTokens>>("custom_theme_global", {}) ?? {};
  const currentCollege = readStorage<ThemeTokens | null>("custom_theme_college", null);
  const currentSchool = readStorage<ThemeTokens | null>("custom_theme_school", null);

  const baseCollege = currentCollege?.colors ? currentCollege : institutions.college.theme;
  const baseSchool = currentSchool?.colors ? currentSchool : institutions.school.theme;

  const resolvedRadius = radius || currentGlobal.radius || institutions.college.theme.radius;

  if (scope === "global") {
    const updatedCollege: ThemeTokens = {
      ...institutions.college.theme,
      ...baseCollege,
      colors: {
        ...institutions.college.theme.colors,
        ...(baseCollege.colors ?? {}),
        ...colors,
      },
      radius: resolvedRadius,
    };
    const updatedSchool: ThemeTokens = {
      ...institutions.school.theme,
      ...baseSchool,
      colors: {
        ...institutions.school.theme.colors,
        ...(baseSchool.colors ?? {}),
        ...colors,
      },
      radius: resolvedRadius,
    };

    institutions.college.theme = updatedCollege;
    institutions.school.theme = updatedSchool;

    writeStorage("custom_theme_global", {
      colors: { ...(currentGlobal?.colors ?? {}), ...colors },
      radius: resolvedRadius,
    });
    writeStorage("custom_theme_college", updatedCollege);
    writeStorage("custom_theme_school", updatedSchool);

    applyTheme(updatedCollege);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("eduplatform:theme-changed", { detail: updatedCollege }));
      window.dispatchEvent(new Event("storage"));
    }
    return { collegeTheme: updatedCollege, schoolTheme: updatedSchool };
  } else {
    const baseTarget = scope === "college" ? baseCollege : baseSchool;
    const instBase = institutions[scope]?.theme ?? institutions.college.theme;
    const updated: ThemeTokens = {
      ...instBase,
      ...baseTarget,
      colors: {
        ...instBase.colors,
        ...(baseTarget.colors ?? {}),
        ...colors,
      },
      radius: radius || baseTarget.radius || instBase.radius,
    };

    institutions[scope].theme = updated;
    writeStorage(`custom_theme_${scope}`, updated);

    applyTheme(updated);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("eduplatform:theme-changed", { detail: updated }));
      window.dispatchEvent(new Event("storage"));
    }
    return {
      collegeTheme: institutions.college.theme,
      schoolTheme: institutions.school.theme,
    };
  }
}

export function resetCustomTheme(scope: ThemeTargetScope) {
  if (scope === "global") {
    writeStorage("custom_theme_global", null);
    writeStorage("custom_theme_college", null);
    writeStorage("custom_theme_school", null);
  } else {
    writeStorage(`custom_theme_${scope}`, null);
  }
  const restored = getCustomTheme(scope === "school" ? "school" : "college");
  applyTheme(restored);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("eduplatform:theme-changed", { detail: restored }));
    window.dispatchEvent(new Event("storage"));
  }
}

export function initStoredTheme(activeId?: InstitutionType) {
  if (typeof window === "undefined") return;
  const id: InstitutionType =
    activeId ??
    (window.location.pathname.startsWith("/school") ? "school" : "college");
  const theme = getCustomTheme(id);
  applyTheme(theme);
}
