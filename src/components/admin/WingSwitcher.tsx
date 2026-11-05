import { GraduationCap, Landmark } from "lucide-react";
import { useAuthStore } from "@/features/auth/authStore";
import { useInstitutionStore } from "@/features/institutions/institutionStore";
import { cn } from "@/lib/utils";
import type { InstitutionType } from "@/types";

const WINGS: { id: InstitutionType; label: string; icon: typeof GraduationCap }[] = [
  { id: "school", label: "School Wing", icon: GraduationCap },
  { id: "college", label: "College Wing", icon: Landmark },
];

/**
 * Only rendered for personas whose homeInstitutionId is a Both-mode
 * UnifiedInstitution (see src/types/unified.ts). Switching a wing updates
 * the signed-in persona's *current* institutionId directly — every other
 * screen in the app already reads institutionId via useInstitutionData(),
 * so nothing else needs to know a wing switch happened.
 */
export function WingSwitcher() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const setUser = useAuthStore((s) => s.setUser);
  const setInstitution = useInstitutionStore((s) => s.setInstitution);

  if (!currentUser) return null;

  function switchTo(wing: InstitutionType) {
    if (!currentUser || currentUser.institutionId === wing) return;
    setUser({ ...currentUser, institutionId: wing });
    setInstitution(wing);
  }

  return (
    <div className="bg-muted flex items-center gap-0.5 rounded-md p-0.5 group-data-[collapsible=icon]:hidden">
      {WINGS.map((w) => (
        <button
          key={w.id}
          type="button"
          onClick={() => switchTo(w.id)}
          className={cn(
            "flex flex-1 items-center justify-center gap-1 rounded px-1.5 py-1 text-[11px] font-medium transition-colors",
            currentUser.institutionId === w.id ? "bg-surface text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
          )}
        >
          <w.icon className="size-3" />
          {w.label}
        </button>
      ))}
    </div>
  );
}
