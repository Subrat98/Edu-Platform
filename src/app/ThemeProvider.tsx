import { useEffect, type ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { applyTheme } from "@/theme/applyTheme";
import { applyManifest } from "@/theme/applyManifest";
import { institutions } from "@/mocks/data/institutions";
import { useInstitutionStore } from "@/features/institutions/institutionStore";
import { queryKeys } from "@/lib/queryKeys";
import { institutionService } from "@/features/institutions/institutionService";

function InstitutionThemeEffect() {
  const activeInstitutionId = useInstitutionStore((s) => s.activeInstitutionId);
  const { data } = useQuery({
    queryKey: queryKeys.institution(activeInstitutionId),
    queryFn: () => institutionService.get(activeInstitutionId),
  });

  // /unified manages its own theme/manifest entirely (see UnifiedLanding.tsx)
  // — it isn't driven by activeInstitutionId at all. Without this guard,
  // this effect's *async* branch below (which fires once the mock request
  // resolves, after /unified's own one-shot effect has already run) would
  // race it and silently clobber the Unified brand colour with whatever
  // institution was last active on the public site.
  const onUnifiedRoute = window.location.pathname.startsWith("/unified");

  useEffect(() => {
    if (onUnifiedRoute) return;
    // Apply synchronously from the static seed first so there's no flash
    // of the wrong brand colour while the (fast) mock request resolves.
    applyTheme(institutions[activeInstitutionId].theme);
    applyManifest(activeInstitutionId);
  }, [activeInstitutionId, onUnifiedRoute]);

  useEffect(() => {
    if (onUnifiedRoute) return;
    if (data) applyTheme(data.theme);
  }, [data, onUnifiedRoute]);

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
