import { useEffect, type ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { applyTheme } from "@/theme/applyTheme";
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

  useEffect(() => {
    // Apply synchronously from the static seed first so there's no flash
    // of the wrong brand colour while the (fast) mock request resolves.
    applyTheme(institutions[activeInstitutionId].theme);
  }, [activeInstitutionId]);

  useEffect(() => {
    if (data) applyTheme(data.theme);
  }, [data]);

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
