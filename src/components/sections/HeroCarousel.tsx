import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { Container } from "@/components/common/Container";
import { cn } from "@/lib/utils";

interface HeroCta {
  label: string;
  href: string;
}

export interface HeroCarouselProps {
  badge?: string;
  title: string;
  description?: string;
  /** Multiple background photos, auto-advancing behind one fixed headline/CTA. */
  images: string[];
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
}

/**
 * The homepage hero: a real, swipeable Embla carousel (not a decorative
 * fake) cycling the campus photography, with one fixed headline/CTA
 * overlaid on top so the message never gets lost mid-rotation. Autoplay
 * pauses on hover/touch and is skipped entirely for
 * prefers-reduced-motion, per spec §6.4.
 */
export function HeroCarousel({ badge, title, description, images, primaryCta, secondaryCta }: HeroCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const plugins = reducedMotion || images.length <= 1 ? [] : [Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true })];

  return (
    <section className="relative isolate overflow-hidden">
      <Carousel opts={{ loop: images.length > 1 }} plugins={plugins} setApi={setApi}>
        <CarouselContent className="ml-0">
          {images.map((src, i) => (
            <CarouselItem key={src} className="pl-0">
              <div className="relative h-[520px] sm:h-[600px] lg:h-[680px]">
                <img
                  src={src}
                  alt=""
                  className="size-full object-cover"
                  style={
                    reducedMotion
                      ? undefined
                      : {
                          transform: i === current ? "scale(1.07)" : "scale(1)",
                          transition: i === current ? "transform 7000ms ease-out" : "transform 0ms",
                        }
                  }
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="from-primary/95 via-primary/80 pointer-events-none absolute inset-0 z-[5] bg-gradient-to-r to-transparent" />

      <div className="absolute inset-0 z-10 flex items-center">
        <Container className="py-16 sm:py-20">
          <div className="max-w-2xl">
            {badge ? (
              <span className="bg-highlight text-highlight-foreground mb-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                {badge}
              </span>
            ) : null}
            <h1 className="font-heading text-3xl font-bold text-balance text-white sm:text-5xl">{title}</h1>
            {description ? <p className="mt-4 text-base text-white/85 sm:text-lg">{description}</p> : null}
            {primaryCta || secondaryCta ? (
              <div className="mt-8 flex flex-wrap gap-3">
                {primaryCta ? (
                  <Button asChild size="lg" className="bg-highlight text-highlight-foreground hover:bg-highlight/90">
                    <Link to={primaryCta.href}>
                      {primaryCta.label}
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                ) : null}
                {secondaryCta ? (
                  <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                    <Link to={secondaryCta.href}>{secondaryCta.label}</Link>
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        </Container>
      </div>

      {images.length > 1 ? (
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show slide ${i + 1} of ${images.length}`}
              aria-current={i === current}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === current ? "w-7 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80",
              )}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
