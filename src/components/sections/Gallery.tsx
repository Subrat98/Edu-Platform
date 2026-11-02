import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { galleryService } from "@/features/gallery/galleryService";
import { queryKeys } from "@/lib/queryKeys";
import type { GalleryImage, InstitutionType } from "@/types";

export interface GalleryProps {
  institutionId: InstitutionType;
  title?: string;
  albumLimit?: number;
  imagesPerAlbumLimit?: number;
}

export function Gallery({ institutionId, title = "Gallery", albumLimit, imagesPerAlbumLimit }: GalleryProps) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.gallery(institutionId),
    queryFn: () => galleryService.list(institutionId),
  });

  const [lightbox, setLightbox] = useState<{ images: GalleryImage[]; index: number } | null>(null);

  const albums = useMemo(() => {
    const list = data ?? [];
    return albumLimit ? list.slice(0, albumLimit) : list;
  }, [data, albumLimit]);

  return (
    <section className="bg-surface">
      <Container className="py-14 sm:py-16">
        <SectionHeading eyebrow="Campus life" title={title} />

        <div className="mt-8 space-y-10">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          ) : isError ? (
            <ErrorState onRetry={() => refetch()} message="Couldn't load the gallery right now." />
          ) : albums.length === 0 ? (
            <EmptyState title="No albums published yet" />
          ) : (
            albums.map((album) => {
              const images = imagesPerAlbumLimit ? album.images.slice(0, imagesPerAlbumLimit) : album.images;
              return (
                <div key={album.id}>
                  <div className="mb-3 flex items-baseline justify-between">
                    <h3 className="font-heading text-foreground text-base font-semibold">{album.title}</h3>
                    <span className="text-muted-foreground text-xs">
                      {new Date(album.date).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {images.map((img, idx) => (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() => setLightbox({ images: album.images, index: idx })}
                        className="group focus-visible:ring-ring relative aspect-square overflow-hidden rounded-lg focus-visible:ring-2 focus-visible:outline-none"
                      >
                        <img
                          src={img.url}
                          alt={img.caption}
                          loading="lazy"
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Container>

      <Dialog open={!!lightbox} onOpenChange={(open) => !open && setLightbox(null)}>
        <DialogContent className="max-w-3xl border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">
            {lightbox ? lightbox.images[lightbox.index]?.caption : "Gallery image"}
          </DialogTitle>
          {lightbox ? (
            <div className="relative">
              <img
                src={lightbox.images[lightbox.index]?.url}
                alt={lightbox.images[lightbox.index]?.caption}
                className="max-h-[80vh] w-full rounded-lg object-contain"
              />
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="absolute top-3 right-3 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
              {lightbox.images.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setLightbox((s) =>
                        s ? { ...s, index: (s.index - 1 + s.images.length) % s.images.length } : s,
                      )
                    }
                    className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setLightbox((s) => (s ? { ...s, index: (s.index + 1) % s.images.length } : s))}
                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
                    aria-label="Next image"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
