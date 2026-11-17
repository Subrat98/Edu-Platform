import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { GraduationCap, Landmark, Sparkles } from "lucide-react";
import { getUnifiedInstitution } from "@/mocks/data/unifiedInstitutions";
import { applyTheme } from "@/theme/applyTheme";
import { applyManifest } from "@/theme/applyManifest";
import { NotFoundPage } from "@/app/NotFoundPage";
import { InstallPrompt } from "@/features/pwa/InstallPrompt";

export default function UnifiedLanding() {
  const { id = "unified" } = useParams<{ id: string }>();
  const institution = getUnifiedInstitution(id);

  useEffect(() => {
    if (institution) {
      applyTheme(institution.theme);
      applyManifest("unified");
    }
  }, [institution]);

  if (!institution) return <NotFoundPage />;

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <header className="border-border border-b px-6 py-4 sm:px-10">
        <div className="mx-auto flex max-w-5xl items-center gap-2">
          <span className="bg-primary flex size-9 items-center justify-center rounded-lg text-white">
            <Sparkles className="size-4" />
          </span>
          <div>
            <p className="font-heading text-foreground font-semibold">{institution.name}</p>
            <p className="text-muted-foreground text-xs">{institution.tagline}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-16 sm:px-10">
        <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">One campus, two wings</p>
        <h1 className="font-heading text-foreground max-w-2xl text-center text-3xl font-bold sm:text-4xl">{institution.description}</h1>

        <div className="mt-10 grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
          {institution.wings.map((wing) => (
            <Link
              key={wing.type}
              to={`/${wing.type}`}
              className="border-border hover:border-accent bg-surface group rounded-2xl border p-8 text-center transition-colors"
            >
              <span className="bg-accent/10 text-accent mx-auto mb-4 flex size-14 items-center justify-center rounded-full">
                {wing.type === "school" ? <GraduationCap className="size-7" /> : <Landmark className="size-7" />}
              </span>
              <p className="font-heading text-foreground text-xl font-semibold">{wing.name}</p>
              <p className="text-muted-foreground mt-1 text-sm">{wing.tagline}</p>
              <span className="text-accent mt-4 inline-block text-sm font-medium group-hover:underline">Visit site →</span>
            </Link>
          ))}
        </div>
      </main>

      <footer className="border-border border-t px-6 py-6 text-center sm:px-10">
        <p className="text-muted-foreground text-xs">
          {institution.shortName} is one campus administration running both wings with a shared login — each wing keeps its own
          academic structure, admissions, attendance, examinations and fees.
        </p>
      </footer>
      <InstallPrompt />
    </div>
  );
}
