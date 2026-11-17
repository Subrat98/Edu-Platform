import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Search, Pencil, Eye, Copy } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/common/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { useAuthStore } from "@/features/auth/authStore";
import { cmsService } from "@/features/cms/cmsService";
import { queryKeys } from "@/lib/queryKeys";
import type { PageStatus } from "@/types";

const STATUS_TONE: Record<PageStatus, string> = {
  Published: "bg-success/10 text-success border-success/30",
  Draft: "bg-muted text-muted-foreground",
  "Pending Approval": "bg-warning/10 text-warning border-warning/30",
  Scheduled: "bg-info/10 text-info border-info/30",
  Archived: "bg-muted text-muted-foreground",
};

export default function PagesList() {
  const { institutionId } = useInstitutionData();
  const currentUser = useAuthStore((s) => s.currentUser);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PageStatus | "All">("All");
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const { data: pages, isLoading } = useQuery({
    queryKey: queryKeys.cmsPages(institutionId),
    queryFn: () => cmsService.listPages(institutionId),
  });

  const createMutation = useMutation({
    mutationFn: () => cmsService.createPage(institutionId, newTitle, currentUser?.name ?? "Admin"),
    onSuccess: (page) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cmsPages(institutionId) });
      toast.success("Page created", { description: `"${page.title}" was added as a draft.` });
      setCreateOpen(false);
      setNewTitle("");
      navigate(`/admin/cms/pages/${page.id}`);
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status: s }: { id: string; status: PageStatus }) => cmsService.setPageStatus(id, s),
    onSuccess: (_res, vars) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cmsPages(institutionId) });
      toast.success(`Page ${vars.status.toLowerCase()}`);
    },
  });

  const filtered = useMemo(() => {
    let list = pages ?? [];
    if (status !== "All") list = list.filter((p) => p.status === status);
    if (search) list = list.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [pages, status, search]);

  return (
    <div>
      <AdminPageHeader
        title="Pages"
        description="Create, edit and publish pages for the public website."
        actions={
          <Button onClick={() => setCreateOpen(true)} className="gap-1.5">
            <Plus className="size-4" /> New Page
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input placeholder="Search pages…" className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as PageStatus | "All")}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All statuses</SelectItem>
            <SelectItem value="Published">Published</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Pending Approval">Pending Approval</SelectItem>
            <SelectItem value="Scheduled">Scheduled</SelectItem>
            <SelectItem value="Archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No pages found" description="Try a different search or filter." />
      ) : (
        <div className="border-border rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">{page.title}</TableCell>
                  <TableCell className="text-muted-foreground">/{page.slug}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={STATUS_TONE[page.status]}>
                      {page.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{page.author}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(page.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button asChild variant="ghost" size="icon-sm" title="Edit">
                        <Link to={`/admin/cms/pages/${page.id}`}>
                          <Pencil className="size-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="icon-sm" title="Preview on site">
                        <Link to={`/${page.siteArea}${page.slug === "home" ? "" : `/${page.slug}`}`} target="_blank">
                          <Eye className="size-4" />
                        </Link>
                      </Button>
                      {page.status === "Published" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => statusMutation.mutate({ id: page.id, status: "Archived" })}
                        >
                          Unpublish
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => statusMutation.mutate({ id: page.id, status: "Published" })}
                        >
                          Publish
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Copy className="size-4" /> Create a new page
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="new-page-title">Page title</Label>
            <Input id="new-page-title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Annual Sports Meet 2027" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button disabled={!newTitle.trim() || createMutation.isPending} onClick={() => createMutation.mutate()}>
              {createMutation.isPending ? "Creating…" : "Create draft"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
