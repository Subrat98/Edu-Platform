import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, BookOpen } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { libraryService, type CatalogueEntry } from "@/features/library/libraryService";
import { queryKeys } from "@/lib/queryKeys";
import type { CopyStatus } from "@/types";

const COPY_STATUS_TONE: Record<CopyStatus, string> = {
  Available: "bg-success/10 text-success border-success/30",
  "On Loan": "bg-info/10 text-info border-info/30",
  Reserved: "bg-warning/10 text-warning border-warning/30",
  Lost: "bg-destructive/10 text-destructive border-destructive/30",
  Damaged: "bg-destructive/10 text-destructive border-destructive/30",
  Retired: "bg-muted text-muted-foreground",
};

export default function LibrarianCatalogue() {
  const { institutionId } = useInstitutionData();
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<CatalogueEntry | null>(null);

  const { data: catalogue, isLoading } = useQuery({
    queryKey: queryKeys.catalogue(institutionId, search),
    queryFn: () => libraryService.listCatalogue(institutionId, search),
  });

  const sorted = useMemo(() => [...(catalogue ?? [])].sort((a, b) => a.title.title.localeCompare(b.title.title)), [catalogue]);

  return (
    <div>
      <AdminPageHeader title="Catalogue" description="Manage book titles and track individual copies." />

      <div className="relative mb-4 max-w-xs">
        <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
        <Input placeholder="Search by title, author or ISBN…" className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <PageLoadingSkeleton />
      ) : sorted.length === 0 ? (
        <EmptyState title="No titles found" icon={BookOpen} />
      ) : (
        <div className="border-border rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author(s)</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead className="text-right">Copies</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((entry) => (
                <TableRow key={entry.title.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => setDetail(entry)}>
                  <TableCell className="font-medium">{entry.title.title}</TableCell>
                  <TableCell className="text-muted-foreground">{entry.title.authors}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{entry.title.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={entry.availableCount > 0 ? "border-success/30 text-success" : "border-destructive/30 text-destructive"}>
                      {entry.availableCount} of {entry.totalCount} available
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{entry.totalCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!detail} onOpenChange={(open) => !open && setDetail(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{detail?.title.title}</DialogTitle>
          </DialogHeader>
          {detail ? (
            <div className="space-y-3">
              <p className="text-muted-foreground text-sm">
                {detail.title.authors} · {detail.title.publisher} · {detail.title.edition}
              </p>
              <p className="text-muted-foreground text-xs">ISBN {detail.title.isbn}</p>
              {detail.title.isReference ? <Badge variant="outline">Reference — library use only</Badge> : null}
              <div>
                <p className="mb-2 text-xs font-semibold tracking-wide uppercase">Copies</p>
                <ul className="divide-border divide-y">
                  {detail.copies.map((c) => (
                    <li key={c.id} className="flex items-center justify-between py-2 text-sm">
                      <span>
                        {c.accessionNo} <span className="text-muted-foreground">· Shelf {c.shelfLocation}</span>
                      </span>
                      <Badge variant="outline" className={COPY_STATUS_TONE[c.status]}>
                        {c.status}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
