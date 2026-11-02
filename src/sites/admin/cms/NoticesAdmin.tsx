import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pin } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { cmsService } from "@/features/cms/cmsService";
import { queryKeys } from "@/lib/queryKeys";
import type { Notice, NoticeAudience, NoticeCategory } from "@/types";

const CATEGORIES: NoticeCategory[] = ["Admission", "Examination", "Holiday", "Circular", "Event", "General", "Scholarship", "Library"];
const AUDIENCES: NoticeAudience[] = ["Public", "Students", "Parents", "Staff"];
const STATUS_TONE: Record<string, string> = {
  Published: "bg-success/10 text-success border-success/30",
  Draft: "bg-muted text-muted-foreground",
  "Pending Approval": "bg-warning/10 text-warning border-warning/30",
  Scheduled: "bg-info/10 text-info border-info/30",
  Expired: "bg-muted text-muted-foreground",
  Archived: "bg-muted text-muted-foreground",
};

function emptyNotice(institutionId: "school" | "college"): Omit<Notice, "id"> {
  return {
    institutionId,
    title: "",
    category: "General",
    summary: "",
    date: "2026-10-29",
    pinned: false,
    status: "Draft",
    audience: ["Public"],
  };
}

export default function NoticesAdmin() {
  const { institutionId } = useInstitutionData();
  const queryClient = useQueryClient();
  const { data: notices, isLoading } = useQuery({ queryKey: queryKeys.cmsNotices(institutionId), queryFn: () => cmsService.listNoticesForCms(institutionId) });

  const [editorOpen, setEditorOpen] = useState(false);
  const [draft, setDraft] = useState<Omit<Notice, "id">>(emptyNotice(institutionId));
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const createMutation = useMutation({
    mutationFn: (payload: Omit<Notice, "id">) => cmsService.createNotice(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cmsNotices(institutionId) });
      toast.success("Notice saved");
      setEditorOpen(false);
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: NonNullable<Notice["status"]> }) => cmsService.setNoticeStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cmsNotices(institutionId) });
      toast.success("Notice status updated");
    },
  });

  const filtered = useMemo(() => {
    const list = notices ?? [];
    if (statusFilter === "All") return list;
    return list.filter((n) => (n.status ?? "Published") === statusFilter);
  }, [notices, statusFilter]);

  function openNew() {
    setDraft(emptyNotice(institutionId));
    setEditorOpen(true);
  }

  function toggleAudience(a: NoticeAudience) {
    setDraft((d) => {
      const current = d.audience ?? [];
      return { ...d, audience: current.includes(a) ? current.filter((x) => x !== a) : [...current, a] };
    });
  }

  if (isLoading) return <PageLoadingSkeleton />;

  return (
    <div>
      <AdminPageHeader
        title="Notices"
        description="Publish and manage circulars shown on the public site and portals."
        actions={
          <Button onClick={openNew} className="gap-1.5">
            <Plus className="size-4" /> New Notice
          </Button>
        }
      />

      <div className="mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All statuses</SelectItem>
            {["Published", "Draft", "Pending Approval", "Scheduled", "Expired", "Archived"].map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No notices found" />
      ) : (
        <div className="border-border rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((n) => (
                <TableRow key={n.id}>
                  <TableCell className="font-medium">
                    <span className="flex items-center gap-1.5">
                      {n.pinned ? <Pin className="text-highlight size-3.5" /> : null}
                      {n.title}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{n.category}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">{(n.audience ?? ["Public"]).join(", ")}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{n.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={STATUS_TONE[n.status ?? "Published"]}>
                      {n.status ?? "Published"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {(n.status ?? "Published") === "Published" ? (
                      <Button variant="ghost" size="sm" onClick={() => statusMutation.mutate({ id: n.id, status: "Archived" })}>
                        Archive
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => statusMutation.mutate({ id: n.id, status: "Published" })}>
                        Publish
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New notice</DialogTitle>
          </DialogHeader>
          <div className="max-h-[65vh] space-y-3 overflow-y-auto">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Summary</Label>
              <Textarea value={draft.summary} onChange={(e) => setDraft((d) => ({ ...d, summary: e.target.value }))} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={draft.category} onValueChange={(v) => setDraft((d) => ({ ...d, category: v as NoticeCategory }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Publication date</Label>
                <Input type="date" value={draft.date} onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Audience</Label>
              <div className="flex flex-wrap gap-2">
                {AUDIENCES.map((a) => (
                  <Button
                    key={a}
                    type="button"
                    size="sm"
                    variant={draft.audience?.includes(a) ? "default" : "outline"}
                    onClick={() => toggleAudience(a)}
                  >
                    {a}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="pinned-switch">Pin to top of notice board</Label>
              <Switch id="pinned-switch" checked={draft.pinned} onCheckedChange={(v) => setDraft((d) => ({ ...d, pinned: v }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => createMutation.mutate(draft)}
              disabled={!draft.title.trim() || createMutation.isPending}
            >
              Save as draft
            </Button>
            <Button
              onClick={() => createMutation.mutate({ ...draft, status: "Published" })}
              disabled={!draft.title.trim() || createMutation.isPending}
            >
              Publish now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
