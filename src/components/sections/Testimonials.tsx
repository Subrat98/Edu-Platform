import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { AvatarInitials } from "@/components/common/AvatarInitials";
import { Skeleton } from "@/components/ui/skeleton";
import { testimonialService } from "@/features/content/testimonialService";
import { queryKeys } from "@/lib/queryKeys";
import type { InstitutionType } from "@/types";

export interface TestimonialsProps {
  institutionId: InstitutionType;
  title?: string;
}

export function Testimonials({ institutionId, title = "What our community says" }: TestimonialsProps) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.testimonials(institutionId),
    queryFn: () => testimonialService.list(institutionId),
  });

  return (
    <section className="bg-background">
      <Container className="py-14 sm:py-16">
        <SectionHeading eyebrow="Voices" title={title} align="center" className="mx-auto" />

        <div className="mx-auto mt-10 max-w-3xl">
          {isLoading ? (
            <Skeleton className="h-48 w-full rounded-xl" />
          ) : (
            <Carousel opts={{ loop: true }}>
              <CarouselContent>
                {(data ?? []).map((t) => (
                  <CarouselItem key={t.id}>
                    <div className="border-border bg-surface rounded-2xl border p-8 text-center">
                      <div className="mb-3 flex justify-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={
                              i < t.rating ? "fill-highlight text-highlight size-4" : "text-border size-4"
                            }
                          />
                        ))}
                      </div>
                      <p className="text-foreground text-balance italic">&ldquo;{t.quote}&rdquo;</p>
                      <div className="mt-5 flex items-center justify-center gap-3">
                        <AvatarInitials name={t.name} size="sm" />
                        <div className="text-left">
                          <p className="text-foreground text-sm font-semibold">{t.name}</p>
                          <p className="text-muted-foreground text-xs">{t.role}</p>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4 sm:-left-10" />
              <CarouselNext className="-right-4 sm:-right-10" />
            </Carousel>
          )}
        </div>
      </Container>
    </section>
  );
}
