import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Download, Pin } from "lucide-react";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { noticeService } from "@/features/notices/noticeService";
import { queryKeys } from "@/lib/queryKeys";
import type { InstitutionType, NoticeCategory } from "@/types";

export interface NoticeBoardProps {
  institutionId: InstitutionType;
  limit?: number;
  showFilter?: boolean;
  title?: string;
  viewAllHref?: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function NoticeBoard({
  institutionId,
  limit,
  showFilter = false,
  title = "Notices & Circulars",
  viewAllHref,
}: NoticeBoardProps) {
  const [category, setCategory] = useState<NoticeCategory | "All">("All");
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.notices(institutionId),
    queryFn: () => noticeService.list(institutionId),
  });

  const categories = useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(data.map((n) => n.category)));
  }, [data]);

  const filtered = useMemo(() => {
    let items = data ?? [];
    if (showFilter && category !== "All") items = items.filter((n) => n.category === category);
    if (limit) items = items.slice(0, limit);
    return items;
  }, [data, category, showFilter, limit]);

  return (
    <section className="bg-surface">
      <Container className="py-14 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Stay informed" title={title} />
          {viewAllHref ? (
            <Button asChild variant="outline" size="sm">
              <Link to={viewAllHref}>View all notices</Link>
            </Button>
          ) : null}
        </div>

        {showFilter && categories.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            <Button size="sm" variant={category === "All" ? "default" : "outline"} onClick={() => setCategory("All")}>
              All
            </Button>
            {categories.map((c) => (
              <Button key={c} size="sm" variant={category === c ? "default" : "outline"} onClick={() => setCategory(c)}>
                {c}
              </Button>
            ))}
          </div>
        ) : null}

        <div className="mt-8">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: limit ?? 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : isError ? (
            <ErrorState onRetry={() => refetch()} message="Couldn't load notices right now." />
          ) : filtered.length === 0 ? (
            <EmptyState title="No notices found" description="Try a different category or check back later." />
          ) : (
            <ul className="divide-border divide-y">
              {filtered.map((notice) => (
                <li key={notice.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {notice.pinned ? <Pin className="text-highlight size-3.5" aria-hidden="true" /> : null}
                      <Badge variant="secondary" className="text-xs">
                        {notice.category}
                      </Badge>
                      <span className="text-muted-foreground text-xs">{formatDate(notice.date)}</span>
                    </div>
                    <p className="text-foreground mt-1 font-medium text-balance">{notice.title}</p>
                    <p className="text-muted-foreground mt-0.5 text-sm">{notice.summary}</p>
                  </div>
                  {notice.fileName ? (
                    <Button variant="ghost" size="sm" className="shrink-0 gap-1.5">
                      <Download className="size-4" /> PDF
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </section>
  );
}
