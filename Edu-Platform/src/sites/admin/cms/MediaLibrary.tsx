import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Upload, Trash2, Search } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { cmsService } from "@/features/cms/cmsService";
import { queryKeys } from "@/lib/queryKeys";

export default function MediaLibrary() {
  const { institutionId } = useInstitutionData();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");

  const { data: media, isLoading } = useQuery({ queryKey: queryKeys.cmsMedia(institutionId), queryFn: () => cmsService.listMedia(institutionId) });

  const uploadMutation = useMutation({
    mutationFn: (file: File) =>
      cmsService.addMedia({
        institutionId,
        fileName: file.name,
        fileType: file.type.startsWith("video") ? "video" : file.type === "application/pdf" ? "pdf" : "image",
        url: URL.createObjectURL(file),
        altText: file.name.replace(/\.[^.]+$/, ""),
        sizeLabel: `${Math.max(1, Math.round(file.size / 1024))} KB`,
        uploadedDate: "2026-10-29",
        uploadedBy: "You",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cmsMedia(institutionId) });
      toast.success("File uploaded");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => cmsService.deleteMedia(institutionId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cmsMedia(institutionId) });
      toast.success("File removed");
    },
  });

  const filtered = (media ?? []).filter((m) => m.fileName.toLowerCase().includes(search.toLowerCase()));

  if (isLoading) return <PageLoadingSkeleton />;

  return (
    <div>
      <AdminPageHeader
        title="Media Library"
        description="Images and documents used across the website."
        actions={
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf,video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadMutation.mutate(file);
                e.target.value = "";
              }}
            />
            <Button className="gap-1.5" onClick={() => fileInputRef.current?.click()} disabled={uploadMutation.isPending}>
              <Upload className="size-4" /> {uploadMutation.isPending ? "Uploading…" : "Upload"}
            </Button>
          </>
        }
      />

      <div className="relative mb-4 max-w-xs">
        <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
        <Input placeholder="Search files…" className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No files found" description="Upload an image or document to get started." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {filtered.map((m) => (
            <div key={m.id} className="border-border bg-surface group relative overflow-hidden rounded-lg border">
              <div className="bg-background aspect-square overflow-hidden">
                {m.fileType === "image" ? (
                  <img src={m.url} alt={m.altText} loading="lazy" className="size-full object-cover" />
                ) : (
                  <div className="text-muted-foreground flex size-full items-center justify-center text-xs uppercase">
                    {m.fileType}
                  </div>
                )}
              </div>
              <div className="p-2">
                <p className="truncate text-xs font-medium">{m.fileName}</p>
                <p className="text-muted-foreground text-[10px]">{m.sizeLabel}</p>
              </div>
              <Button
                variant="secondary"
                size="icon-sm"
                className="absolute top-1.5 right-1.5 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => deleteMutation.mutate(m.id)}
                title="Delete"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
