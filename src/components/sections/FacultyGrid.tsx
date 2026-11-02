import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { AvatarInitials } from "@/components/common/AvatarInitials";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { staffService } from "@/features/staff/staffService";
import { queryKeys } from "@/lib/queryKeys";
import type { InstitutionType } from "@/types";

export interface FacultyGridCard {
  name: string;
  role: string;
  meta?: string;
  bio?: string;
}

export interface FacultyGridProps {
  eyebrow?: string;
  title: string;
  description?: string;
  institutionId?: InstitutionType;
  showDepartmentFilter?: boolean;
  items?: FacultyGridCard[];
}

export function FacultyGrid({ eyebrow, title, description, institutionId, showDepartmentFilter, items }: FacultyGridProps) {
  const [dept, setDept] = useState<string>("All");
  const enabled = !items && !!institutionId;
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: institutionId ? queryKeys.staff(institutionId) : ["staff", "static"],
    queryFn: () => staffService.list(institutionId!),
    enabled,
  });

  const cards: FacultyGridCard[] = useMemo(() => {
    if (items) return items;
    return (data ?? []).map((s) => ({ name: s.name, role: s.designation, meta: s.department, bio: s.qualification }));
  }, [items, data]);

  const departments = useMemo(() => {
    return Array.from(new Set(cards.map((c) => c.meta).filter(Boolean))) as string[];
  }, [cards]);

  const filtered = useMemo(() => {
    if (!showDepartmentFilter || dept === "All") return cards;
    return cards.filter((c) => c.meta === dept);
  }, [cards, dept, showDepartmentFilter]);

  return (
    <section className="bg-background">
      <Container className="py-14 sm:py-16">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />

        {showDepartmentFilter && departments.length > 1 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            <Button size="sm" variant={dept === "All" ? "default" : "outline"} onClick={() => setDept("All")}>
              All
            </Button>
            {departments.map((d) => (
              <Button key={d} size="sm" variant={dept === d ? "default" : "outline"} onClick={() => setDept(d)}>
                {d}
              </Button>
            ))}
          </div>
        ) : null}

        <div className="mt-8">
          {enabled && isLoading ? (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-xl" />
              ))}
            </div>
          ) : enabled && isError ? (
            <ErrorState onRetry={() => refetch()} message="Couldn't load the faculty directory." />
          ) : filtered.length === 0 ? (
            <EmptyState title="No one to show here yet" />
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((card) => (
                <div
                  key={card.name + card.role}
                  className="border-border bg-surface flex flex-col items-center rounded-xl border p-5 text-center"
                >
                  <AvatarInitials name={card.name} size="xl" />
                  <p className="font-heading text-foreground mt-3 text-sm font-semibold">{card.name}</p>
                  <p className="text-accent text-xs font-medium">{card.role}</p>
                  {card.meta ? <p className="text-muted-foreground mt-0.5 text-xs">{card.meta}</p> : null}
                  {card.bio ? <p className="text-muted-foreground mt-2 text-xs">{card.bio}</p> : null}
                </div>
              ))}
            </div>
          )}
        </div>
        {institutionId ? (
          <p className="text-muted-foreground mt-6 flex items-center justify-center gap-1.5 text-xs">
            <Mail className="size-3.5" /> Full contact directory available at the front office.
          </p>
        ) : null}
      </Container>
    </section>
  );
}
