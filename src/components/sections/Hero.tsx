import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/Container";
import { cn } from "@/lib/utils";

interface HeroCta {
  label: string;
  href: string;
}

export interface HeroProps {
  badge?: string;
  title: string;
  description?: string;
  imageUrl: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  variant?: "full" | "compact";
}

export function Hero({ badge, title, description, imageUrl, primaryCta, secondaryCta, variant = "full" }: HeroProps) {
  const isCompact = variant === "compact";

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={imageUrl} alt="" className="size-full object-cover" />
        <div className="from-primary/95 via-primary/80 absolute inset-0 bg-gradient-to-r to-transparent" />
      </div>
      <Container className={cn("relative py-20 sm:py-28", isCompact && "py-14 sm:py-16")}>
        <div className={cn("max-w-2xl", isCompact && "max-w-xl")}>
          {badge ? (
            <span className="bg-highlight text-highlight-foreground mb-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
              {badge}
            </span>
          ) : null}
          <h1
            className={cn(
              "font-heading text-3xl font-bold text-balance text-white sm:text-5xl",
              isCompact && "text-2xl sm:text-3xl",
            )}
          >
            {title}
          </h1>
          {description ? (
            <p className={cn("mt-4 text-base text-white/85 sm:text-lg", isCompact && "mt-2 text-sm sm:text-base")}>
              {description}
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
