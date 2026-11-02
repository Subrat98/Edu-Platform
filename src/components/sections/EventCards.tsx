import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin } from "lucide-react";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { eventService } from "@/features/events/eventService";
import { queryKeys } from "@/lib/queryKeys";
import type { InstitutionType } from "@/types";

export interface EventCardsProps {
  institutionId: InstitutionType;
  limit?: number;
  title?: string;
  viewAllHref?: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function EventCards({ institutionId, limit, title = "Upcoming Events", viewAllHref }: EventCardsProps) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.events(institutionId),
    queryFn: () => eventService.list(institutionId),
  });

  const items = useMemo(() => {
    const now = "2026-10-29";
    const upcoming = (data ?? []).filter((e) => e.date >= now);
    const list = upcoming.length > 0 ? upcoming : (data ?? []);
    return limit ? list.slice(0, limit) : list;
  }, [data, limit]);

  return (
    <section className="bg-background">
      <Container className="py-14 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="What's happening" title={title} />
          {viewAllHref ? (
            <Button asChild variant="outline" size="sm">
              <Link to={viewAllHref}>View all events</Link>
            </Button>
          ) : null}
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: limit ?? 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))}
            </div>
          ) : isError ? (
            <ErrorState onRetry={() => refetch()} message="Couldn't load events right now." />
          ) : items.length === 0 ? (
            <EmptyState title="No events scheduled" description="Check back soon for upcoming events." />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((event) => (
                <div key={event.id} className="border-border bg-surface overflow-hidden rounded-xl border">
                  <div className="relative aspect-video overflow-hidden">
                    <img src={event.imageUrl} alt="" className="size-full object-cover" loading="lazy" />
                    <div className="bg-surface absolute top-3 left-3 rounded-lg px-2.5 py-1.5 text-center shadow-sm">
                      <p className="text-primary text-sm leading-none font-bold">
                        {new Date(event.date).getDate()}
                      </p>
                      <p className="text-muted-foreground text-[10px] tracking-wide uppercase">
                        {new Date(event.date).toLocaleDateString("en-IN", { month: "short" })}
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <Badge variant="secondary" className="mb-2 text-xs">
                      {event.category}
                    </Badge>
                    <p className="font-heading text-foreground text-sm font-semibold text-balance">{event.title}</p>
                    <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                      <MapPin className="size-3" /> {event.location}
                    </p>
                    <p className="text-muted-foreground mt-2 line-clamp-2 text-xs">{event.description}</p>
                    {event.endDate ? (
                      <p className="text-muted-foreground mt-2 flex items-center gap-1 text-xs">
                        <CalendarDays className="size-3" /> {formatDate(event.date)} – {formatDate(event.endDate)}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
