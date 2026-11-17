import { useEffect, type ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { applyTheme } from "@/theme/applyTheme";
import { applyManifest } from "@/theme/applyManifest";
import { getCustomTheme } from "@/theme/themePersistence";
import { useInstitutionStore } from "@/features/institutions/institutionStore";
import { queryKeys } from "@/lib/queryKeys";
import { institutionService } from "@/features/institutions/institutionService";

function InstitutionThemeEffect() {
  const activeInstitutionId = useInstitutionStore((s) => s.activeInstitutionId);
  const onUnifiedRoute = typeof window !== "undefined" && window.location.pathname.startsWith("/unified");

  // Determine current active wing from URL path if public route, or active store state
  const effectiveWing =
    typeof window !== "undefined" && window.location.pathname.startsWith("/school")
      ? "school"
      : typeof window !== "undefined" && window.location.pathname.startsWith("/college")
        ? "college"
        : activeInstitutionId;

  const { data } = useQuery({
    queryKey: queryKeys.institution(effectiveWing),
    queryFn: () => institutionService.get(effectiveWing),
  });

  useEffect(() => {
    if (onUnifiedRoute) return;
    // Apply synchronously from custom persisted storage so there's no flash
    const storedTheme = getCustomTheme(effectiveWing);
    applyTheme(storedTheme);
    applyManifest(effectiveWing);
  }, [effectiveWing, onUnifiedRoute]);

  useEffect(() => {
    if (onUnifiedRoute) return;
    if (data?.theme) {
      applyTheme(data.theme);
    } else {
      applyTheme(getCustomTheme(effectiveWing));
    }
  }, [data, effectiveWing, onUnifiedRoute]);

  // Reactive listener for live theme changes in the same tab or across tabs
  useEffect(() => {
    if (onUnifiedRoute) return;
    const handleThemeChange = () => {
      const updatedTheme = getCustomTheme(effectiveWing);
      applyTheme(updatedTheme);
    };

    window.addEventListener("storage", handleThemeChange);
    window.addEventListener("eduplatform:theme-changed", handleThemeChange);
    return () => {
      window.removeEventListener("storage", handleThemeChange);
      window.removeEventListener("eduplatform:theme-changed", handleThemeChange);
    };
  }, [effectiveWing, onUnifiedRoute]);

  return null;
}

/**
 * Dark/light mode is handled by next-themes (toggles the `.dark` class,
 * persists the choice, respects system preference). Institution branding
 * (primary/accent/highlight/fonts/radius) is a separate, orthogonal axis
 * handled by InstitutionThemeEffect writing CSS custom properties — see
 * src/theme/applyTheme.ts.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem storageKey="eduplatform:theme-mode">
      <InstitutionThemeEffect />
      {children}
    </NextThemesProvider>
  );
}
