import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowLeft,
  GripVertical,
  Eye,
  EyeOff,
  Trash2,
  Smartphone,
  Tablet,
  Monitor,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { PageRenderer } from "@/features/cms/PageRenderer";
import { cmsService } from "@/features/cms/cmsService";
import { SECTION_META, ALL_SECTION_TYPES } from "@/features/cms/sectionMeta";
import { defaultPropsFor } from "@/features/cms/defaultSectionProps";
import { queryKeys } from "@/lib/queryKeys";
import { cn } from "@/lib/utils";
import type { Section, SectionType } from "@/types";

function SortableRow({
  section,
  selected,
  onSelect,
  onToggleHidden,
  onDelete,
}: {
  section: Section;
  selected: boolean;
  onSelect: () => void;
  onToggleHidden: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const meta = SECTION_META[section.type];
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-surface flex items-center gap-2 rounded-lg border p-2.5",
        selected ? "border-accent ring-accent/30 ring-2" : "border-border",
        isDragging && "opacity-50",
        section.hidden && "opacity-60",
      )}
    >
      <button
        type="button"
        className="text-muted-foreground cursor-grab touch-none active:cursor-grabbing"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <GripVertical className="size-4" />
      </button>
      <button type="button" onClick={onSelect} className="flex min-w-0 flex-1 items-center gap-2 text-left">
        <meta.icon className="text-accent size-4 shrink-0" />
        <span className="truncate text-sm font-medium">{meta.label}</span>
        {section.hidden ? (
          <Badge variant="outline" className="text-[10px]">
            Hidden
          </Badge>
        ) : null}
      </button>
      <Button variant="ghost" size="icon-sm" onClick={onToggleHidden} title={section.hidden ? "Show section" : "Hide section"}>
        {section.hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </Button>
      <Button variant="ghost" size="icon-sm" onClick={onDelete} title="Delete section">
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}

export default function PageBuilder() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: record, isLoading } = useQuery({
    queryKey: queryKeys.cmsPage(id ?? ""),
    queryFn: () => cmsService.getPage(id!),
    enabled: !!id,
  });

  const [sections, setSections] = useState<Section[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [propsDraft, setPropsDraft] = useState("");
  const [propsError, setPropsError] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [previewWidth, setPreviewWidth] = useState<"desktop" | "tablet" | "mobile">("desktop");

  useEffect(() => {
    if (record) setSections([...record.page.sections].sort((a, b) => a.order - b.order));
  }, [record]);

  const selected = useMemo(() => sections.find((s) => s.id === selectedId) ?? null, [sections, selectedId]);

  useEffect(() => {
    if (selected) setPropsDraft(JSON.stringify(selected.props, null, 2));
    setPropsError(null);
  }, [selected]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const saveMutation = useMutation({
    mutationFn: (next: Section[]) => cmsService.updatePageSections(id!, next),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cmsPage(id ?? "") });
      queryClient.invalidateQueries({ queryKey: ["cmsPages"] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status: "Published" | "Draft" | "Pending Approval") => cmsService.setPageStatus(id!, status),
    onSuccess: (_r, status) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cmsPage(id ?? "") });
      queryClient.invalidateQueries({ queryKey: ["cmsPages"] });
      toast.success(status === "Published" ? "Page published" : "Status updated");
    },
  });

  function persist(next: Section[]) {
    setSections(next);
    saveMutation.mutate(next);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(sections, oldIndex, newIndex).map((s, i) => ({ ...s, order: i + 1 }));
    persist(reordered);
  }

  function addSection(type: SectionType) {
    if (!record) return;
    const newSection: Section = {
      id: `section-${Date.now()}`,
      type,
      order: sections.length + 1,
      props: defaultPropsFor(type, record.institutionId),
    };
    persist([...sections, newSection]);
    setSelectedId(newSection.id);
    setAddOpen(false);
    toast.success(`${SECTION_META[type].label} added`);
  }

  function toggleHidden(sectionId: string) {
    persist(sections.map((s) => (s.id === sectionId ? { ...s, hidden: !s.hidden } : s)));
  }

  function deleteSection(sectionId: string) {
    persist(sections.filter((s) => s.id !== sectionId).map((s, i) => ({ ...s, order: i + 1 })));
    if (selectedId === sectionId) setSelectedId(null);
  }

  function savePropsDraft() {
    if (!selected) return;
    try {
      const parsed = JSON.parse(propsDraft);
      persist(sections.map((s) => (s.id === selected.id ? { ...s, props: parsed } : s)));
      toast.success("Section content updated");
    } catch {
      setPropsError("Invalid JSON — please fix the syntax before saving.");
    }
  }

  if (isLoading) return <PageLoadingSkeleton />;
  if (!record) return <EmptyState title="Page not found" />;

  const previewPage = { ...record.page, sections };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon-sm">
            <Link to="/admin/cms/pages">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="font-heading text-foreground text-lg font-semibold">{record.title}</h1>
            <p className="text-muted-foreground text-xs">/{record.slug} · {record.siteArea}</p>
          </div>
          <Badge variant="outline">{record.status}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="border-border flex items-center gap-0.5 rounded-lg border p-0.5">
            <Button variant={previewWidth === "mobile" ? "secondary" : "ghost"} size="icon-sm" onClick={() => setPreviewWidth("mobile")}>
              <Smartphone className="size-4" />
            </Button>
            <Button variant={previewWidth === "tablet" ? "secondary" : "ghost"} size="icon-sm" onClick={() => setPreviewWidth("tablet")}>
              <Tablet className="size-4" />
            </Button>
            <Button variant={previewWidth === "desktop" ? "secondary" : "ghost"} size="icon-sm" onClick={() => setPreviewWidth("desktop")}>
              <Monitor className="size-4" />
            </Button>
          </div>
          {record.status !== "Published" ? (
            <Button onClick={() => statusMutation.mutate("Published")}>Publish</Button>
          ) : (
            <Button variant="outline" onClick={() => statusMutation.mutate("Draft")}>
              Unpublish
            </Button>
          )}
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[280px_1fr_340px]">
        {/* Left: section list + add */}
        <div className="flex min-h-0 flex-col gap-3">
          <Button variant="outline" className="gap-1.5" onClick={() => setAddOpen(true)}>
            <Plus className="size-4" /> Add section
          </Button>
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
            {sections.length === 0 ? (
              <EmptyState title="No sections yet" description="Add your first section to start building this page." />
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                  {sections.map((s) => (
                    <SortableRow
                      key={s.id}
                      section={s}
                      selected={selectedId === s.id}
                      onSelect={() => setSelectedId(s.id)}
                      onToggleHidden={() => toggleHidden(s.id)}
                      onDelete={() => deleteSection(s.id)}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>

        {/* Center: live preview */}
        <div className="border-border bg-background min-h-0 overflow-y-auto rounded-lg border">
          <div
            className={cn(
              "mx-auto bg-white transition-all",
              previewWidth === "mobile" && "max-w-sm",
              previewWidth === "tablet" && "max-w-2xl",
              previewWidth === "desktop" && "max-w-full",
            )}
          >
            <PageRenderer page={previewPage} />
          </div>
        </div>

        {/* Right: section settings (desktop) */}
        <div className="hidden min-h-0 flex-col lg:flex">
          {selected ? (
            <Card className="flex min-h-0 flex-1 flex-col">
              <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
                <div>
                  <p className="font-heading text-sm font-semibold">{SECTION_META[selected.type].label}</p>
                  <p className="text-muted-foreground text-xs">{SECTION_META[selected.type].description}</p>
                </div>
                <Textarea
                  value={propsDraft}
                  onChange={(e) => setPropsDraft(e.target.value)}
                  className="min-h-0 flex-1 font-mono text-xs"
                />
                {propsError ? <p className="text-destructive text-xs">{propsError}</p> : null}
                <Button onClick={savePropsDraft} size="sm">
                  Save section content
                </Button>
              </CardContent>
            </Card>
          ) : (
            <EmptyState title="Select a section" description="Choose a section from the list to edit its content." />
          )}
        </div>
      </div>

      {/* Mobile section settings drawer */}
      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelectedId(null)}>
        <SheetContent side="bottom" className="h-[70vh] lg:hidden">
          <SheetHeader>
            <SheetTitle>{selected ? SECTION_META[selected.type].label : ""}</SheetTitle>
          </SheetHeader>
          <div className="flex flex-1 flex-col gap-3 px-4 pb-4">
            <Textarea value={propsDraft} onChange={(e) => setPropsDraft(e.target.value)} className="min-h-[200px] font-mono text-xs" />
            {propsError ? <p className="text-destructive text-xs">{propsError}</p> : null}
            <Button onClick={savePropsDraft} size="sm">
              Save section content
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add a section</DialogTitle>
          </DialogHeader>
          <div className="grid max-h-[60vh] grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
            {ALL_SECTION_TYPES.map((type) => {
              const meta = SECTION_META[type];
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => addSection(type)}
                  className="border-border hover:border-accent hover:bg-accent/5 flex items-start gap-3 rounded-lg border p-3 text-left transition-colors"
                >
                  <meta.icon className="text-accent mt-0.5 size-5 shrink-0" />
                  <span>
                    <span className="block text-sm font-medium">{meta.label}</span>
                    <span className="text-muted-foreground block text-xs">{meta.description}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
