import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/Container";
import { HeroCarousel } from "./HeroCarousel";
import { cn } from "@/lib/utils";

interface HeroCta {
  label: string;
  href: string;
}

export interface HeroProps {
  badge?: string;
  title: string;
  description?: string;
  subtitle?: string;
  imageUrl?: string;
  /** When given (2+ photos), the hero renders as an auto-advancing, swipeable carousel instead of a single static image. */
  images?: string[];
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  variant?: "full" | "compact";
}

export function Hero({ badge, title, description, subtitle, imageUrl, images, primaryCta, secondaryCta, variant = "full" }: HeroProps) {
  const isCompact = variant === "compact";
  const heroDescription = description ?? subtitle;

  if (!isCompact && images && images.length > 1) {
    return <HeroCarousel badge={badge} title={title} description={heroDescription} images={images} primaryCta={primaryCta} secondaryCta={secondaryCta} />;
  }

  return (
    <section className={cn("relative overflow-hidden flex items-center", isCompact ? "min-h-[380px] sm:min-h-[440px] md:min-h-[480px]" : "min-h-[500px] sm:min-h-[580px]")}>
      <div className="absolute inset-0">
        <img src={imageUrl ?? images?.[0] ?? ""} alt="" className="size-full object-cover" />
        {/* Transparent neutral gradient overlay so only the pure photograph image is visible, with no colored blur */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/15" />
      </div>
      <Container className={cn("relative w-full", isCompact ? "py-24 sm:py-32 md:py-36" : "py-20 sm:py-28")}>
        <div className={cn("max-w-2xl", isCompact && "max-w-2xl sm:max-w-3xl")}>
          {badge ? (
            <span className="bg-highlight text-highlight-foreground mb-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase shadow-sm">
              {badge}
            </span>
          ) : null}
          <h1
            className={cn(
              "font-heading text-3xl font-bold text-balance text-white sm:text-5xl drop-shadow-md",
              isCompact && "text-3xl sm:text-4xl md:text-5xl font-black leading-tight",
            )}
          >
            {title}
          </h1>
          {heroDescription ? (
            <p className={cn("mt-4 text-base text-white/95 sm:text-lg drop-shadow-sm", isCompact && "mt-3 text-base sm:text-lg md:text-xl text-white/95 leading-relaxed")}>
              {heroDescription}
            </p>
          ) : null}
          {(primaryCta || secondaryCta) && !isCompact ? (
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
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                >
                  <Link to={secondaryCta.href}>{secondaryCta.label}</Link>
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
