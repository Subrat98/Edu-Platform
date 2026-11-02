import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { FileText, FileSpreadsheet, File, Download } from "lucide-react";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { downloadService } from "@/features/content/downloadService";
import { queryKeys } from "@/lib/queryKeys";
import type { InstitutionType } from "@/types";

export interface DownloadsProps {
  institutionId: InstitutionType;
  title?: string;
  category?: string;
}

const FILE_ICON = { pdf: FileText, xls: FileSpreadsheet, doc: File } as const;

export function Downloads({ institutionId, title = "Downloads", category }: DownloadsProps) {
  const [activeCategory, setActiveCategory] = useState<string>(category ?? "All");
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.downloads(institutionId),
    queryFn: () => downloadService.list(institutionId),
  });

  const categories = useMemo(() => Array.from(new Set((data ?? []).map((d) => d.category))), [data]);
  const filtered = useMemo(() => {
    const list = data ?? [];
    if (activeCategory === "All") return list;
    return list.filter((d) => d.category === activeCategory);
  }, [data, activeCategory]);

  return (
    <section className="bg-surface">
      <Container className="py-14 sm:py-16">
        <SectionHeading eyebrow="Resources" title={title} />

        {!category && categories.length > 1 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={activeCategory === "All" ? "default" : "outline"}
              onClick={() => setActiveCategory("All")}
            >
              All
            </Button>
            {categories.map((c) => (
              <Button
                key={c}
                size="sm"
                variant={activeCategory === c ? "default" : "outline"}
                onClick={() => setActiveCategory(c)}
              >
                {c}
              </Button>
            ))}
          </div>
        ) : null}

        <div className="mt-8">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : isError ? (
            <ErrorState onRetry={() => refetch()} message="Couldn't load downloads right now." />
          ) : filtered.length === 0 ? (
            <EmptyState title="No documents in this category yet" />
          ) : (
            <ul className="divide-border divide-y">
              {filtered.map((doc) => {
                const Icon = FILE_ICON[doc.fileType];
                return (
                  <li key={doc.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="bg-accent/10 text-accent flex size-9 shrink-0 items-center justify-center rounded-lg">
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-foreground truncate text-sm font-medium">{doc.title}</p>
                        <p className="text-muted-foreground text-xs">
                          {doc.sizeLabel} · Updated{" "}
                          {new Date(doc.updatedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0 gap-1.5"
                      onClick={() =>
                        toast.info("Demo document", {
                          description: `${doc.title} is a placeholder file in this demo and isn't available to download.`,
                        })
                      }
                    >
                      <Download className="size-4" />
                      <span className="hidden sm:inline">Download</span>
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Container>
    </section>
  );
}
