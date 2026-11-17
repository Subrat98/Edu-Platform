import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { libraryService } from "@/features/library/libraryService";
import { queryKeys } from "@/lib/queryKeys";

export default function StudentLibraryCatalogue() {
  const { institutionId } = useInstitutionData();
  const [search, setSearch] = useState("");
  const { data: catalogue, isLoading } = useQuery({
    queryKey: queryKeys.catalogue(institutionId, search),
    queryFn: () => libraryService.listCatalogue(institutionId, search),
  });

  const sorted = useMemo(() => [...(catalogue ?? [])].sort((a, b) => a.title.title.localeCompare(b.title.title)), [catalogue]);

  return (
    <div>
      <AdminPageHeader title="Library Catalogue" description="Search the catalogue and book an available title." />
      <div className="relative mb-5 max-w-sm">
        <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
        <Input placeholder="Search by title, author or ISBN…" className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <PageLoadingSkeleton />
      ) : sorted.length === 0 ? (
        <EmptyState title="No titles found" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((entry) => (
            <Link key={entry.title.id} to={`/portal/student/library/book/${entry.title.id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="flex gap-3">
                  <div
                    className="flex h-24 w-16 shrink-0 items-center justify-center rounded-md text-xs font-semibold text-white"
                    style={{ backgroundColor: entry.title.coverColor }}
                  >
                    {entry.title.category.slice(0, 3).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate text-sm font-semibold">{entry.title.title}</p>
                    <p className="text-muted-foreground truncate text-xs">{entry.title.authors}</p>
                    <Badge variant="secondary" className="mt-1.5 text-[10px]">
                      {entry.title.category}
                    </Badge>
                    <p className="mt-2 text-xs">
                      {entry.availableCount > 0 ? (
                        <span className="text-success font-medium">{entry.availableCount} available</span>
                      ) : (
                        <span className="text-destructive font-medium">All copies on loan</span>
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
