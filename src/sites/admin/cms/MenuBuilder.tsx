import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowUp, ArrowDown, Pencil, Trash2, Plus, ChevronDown } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { cmsService } from "@/features/cms/cmsService";
import { queryKeys } from "@/lib/queryKeys";
import type { NavItem } from "@/types";

function emptyItem(): NavItem {
  return { label: "", path: "/" };
}

export default function MenuBuilder() {
  const { institutionId } = useInstitutionData();
  const queryClient = useQueryClient();
  const { data: menu, isLoading } = useQuery({ queryKey: queryKeys.navMenu(institutionId), queryFn: () => cmsService.getMenu(institutionId) });

  const [items, setItems] = useState<NavItem[]>([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<NavItem>(emptyItem());
  const [childDraft, setChildDraft] = useState("");

  useEffect(() => {
    if (menu) setItems(menu.items);
  }, [menu]);

  const saveMutation = useMutation({
    mutationFn: (next: NavItem[]) => cmsService.updateMenuItems(institutionId, next),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.navMenu(institutionId) });
      toast.success("Menu updated");
    },
  });

  function persist(next: NavItem[]) {
    setItems(next);
    saveMutation.mutate(next);
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...items];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target]!, next[index]!];
    persist(next);
  }

  function openNew() {
    setDraft(emptyItem());
    setEditingIndex(null);
    setEditorOpen(true);
  }

  function openEdit(index: number) {
    setDraft({ ...items[index]! });
    setEditingIndex(index);
    setEditorOpen(true);
  }

  function removeItem(index: number) {
    persist(items.filter((_, i) => i !== index));
  }

  function addChild() {
    if (!childDraft.trim()) return;
    const path = `/${institutionId}/${childDraft.trim().toLowerCase().replace(/\s+/g, "-")}`;
    setDraft((d) => ({ ...d, children: [...(d.children ?? []), { label: childDraft.trim(), path }] }));
    setChildDraft("");
  }

  function removeChild(i: number) {
    setDraft((d) => ({ ...d, children: (d.children ?? []).filter((_, idx) => idx !== i) }));
  }

  function saveDraft() {
    if (!draft.label.trim() || !draft.path.trim()) {
      toast.error("Label and path are required.");
      return;
    }
    const next = [...items];
    if (editingIndex === null) next.push(draft);
    else next[editingIndex] = draft;
    persist(next);
    setEditorOpen(false);
  }

  if (isLoading) return <PageLoadingSkeleton />;

  return (
    <div>
      <AdminPageHeader
        title="Menu Builder"
        description="Manage the main navigation shown on the public website header."
        actions={
          <Button onClick={openNew} className="gap-1.5">
            <Plus className="size-4" /> Add item
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-2">
          {items.map((item, index) => (
            <Card key={`${item.label}-${index}`}>
              <CardContent className="flex items-center gap-2 py-3">
                <div className="flex flex-col">
                  <Button variant="ghost" size="icon-sm" disabled={index === 0} onClick={() => move(index, -1)}>
                    <ArrowUp className="size-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" disabled={index === items.length - 1} onClick={() => move(index, 1)}>
                    <ArrowDown className="size-3.5" />
                  </Button>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-sm font-medium">
                    {item.label}
                    {item.children?.length ? <ChevronDown className="text-muted-foreground size-3.5" /> : null}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">{item.path}</p>
                  {item.children?.length ? (
                    <ul className="mt-1.5 space-y-0.5 border-l pl-3">
                      {item.children.map((c) => (
                        <li key={c.path} className="text-muted-foreground text-xs">
                          {c.label} <span className="opacity-60">— {c.path}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <Button variant="ghost" size="icon-sm" onClick={() => openEdit(index)}>
                  <Pencil className="size-4" />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => removeItem(index)}>
                  <Trash2 className="size-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">Live preview</p>
          <div className="border-border bg-surface overflow-x-auto rounded-lg border p-3">
            <nav className="flex min-w-max gap-3">
              {items.map((item) => (
                <span key={item.label} className="text-foreground flex items-center gap-1 text-sm font-medium">
                  {item.label}
                  {item.children?.length ? <ChevronDown className="size-3" /> : null}
                </span>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingIndex === null ? "Add menu item" : "Edit menu item"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Label</Label>
              <Input value={draft.label} onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Path</Label>
              <Input value={draft.path} onChange={(e) => setDraft((d) => ({ ...d, path: e.target.value }))} placeholder={`/${institutionId}/...`} />
            </div>
            <div className="space-y-1.5">
              <Label>Dropdown items (optional)</Label>
              <div className="flex gap-2">
                <Input value={childDraft} onChange={(e) => setChildDraft(e.target.value)} placeholder="Child label" />
                <Button type="button" variant="outline" onClick={addChild}>
                  Add
                </Button>
              </div>
              {draft.children?.length ? (
                <ul className="mt-1 space-y-1">
                  {draft.children.map((c, i) => (
                    <li key={c.path} className="bg-background flex items-center justify-between rounded-md px-2 py-1 text-sm">
                      {c.label}
                      <Button variant="ghost" size="icon-sm" onClick={() => removeChild(i)}>
                        <Trash2 className="size-3.5" />
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveDraft}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
