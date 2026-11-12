import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Hero } from "@/components/sections/Hero";
import { ProgrammeCards } from "@/components/sections/ProgrammeCards";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { collegeHeroUrl } from "@/mocks/data/images";
import { academicService } from "@/features/academics/academicService";
import { queryKeys } from "@/lib/queryKeys";
import { departments } from "@/mocks/data/departments";
import type { ProgrammeLevel } from "@/types";

const LEVELS: (ProgrammeLevel | "All")[] = ["All", "UG", "PG", "Diploma", "Certificate"];

export default function CollegeProgrammes() {
  const [level, setLevel] = useState<ProgrammeLevel | "All">("All");
  const { data, isLoading } = useQuery({ queryKey: queryKeys.programmes(), queryFn: academicService.listProgrammes });

  const filtered = useMemo(() => {
    const list = data ?? [];
    return level === "All" ? list : list.filter((p) => p.level === level);
  }, [data, level]);

  return (
    <>
      <Hero variant="compact" title="Programmes & Courses" imageUrl={collegeHeroUrl(8)} />
      <Breadcrumbs items={[{ label: "Home", href: "/college" }, { label: "Programmes & Courses" }]} />

      <Container className="pt-10">
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((l) => (
            <Button key={l} size="sm" variant={level === l ? "default" : "outline"} onClick={() => setLevel(l)}>
              {l}
            </Button>
          ))}
        </div>
      </Container>

      {isLoading ? (
        <PageLoadingSkeleton />
      ) : (
        <ProgrammeCards
          title={`${filtered.length} programme${filtered.length === 1 ? "" : "s"} available`}
          ctaLabel="View programme details"
          items={filtered.map((p) => {
            const dept = departments.find((d) => d.id === p.departmentId);
            return {
              title: p.name,
              subtitle: `${dept?.name ?? ""} · ${p.durationYears} year${p.durationYears > 1 ? "s" : ""}`,
              description: p.description,
              href: `/college/programmes/${p.slug}`,
              badge: p.level,
            };
          })}
        />
      )}
    </>
  );
}
