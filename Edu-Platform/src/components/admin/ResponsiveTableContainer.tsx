import { useState, useRef, useEffect, type ReactNode } from "react";
import { MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResponsiveTableContainerProps {
  children: ReactNode;
  className?: string;
  mobileHint?: boolean;
}

export function ResponsiveTableContainer({
  children,
  className,
  mobileHint = true,
}: ResponsiveTableContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const hasScroll = el.scrollWidth > el.clientWidth + 10;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
    setCanScrollRight(hasScroll && !atEnd);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [children]);

  return (
    <div className={cn("relative w-full min-w-0 max-w-full rounded-xl border border-border/70 bg-card shadow-xs", className)}>
      {/* Mobile Swipe Hint Badge */}
      {mobileHint && canScrollRight && (
        <div className="md:hidden flex items-center justify-end px-3 py-1.5 bg-muted/40 border-b border-border/50 text-[11px] text-muted-foreground gap-1.5 animate-pulse">
          <span>Swipe horizontally for full table</span>
          <MoveRight className="size-3 text-primary" />
        </div>
      )}

      {/* Scrolling Content Container */}
      <div
        ref={containerRef}
        onScroll={checkScroll}
        className="w-full min-w-0 max-w-full overflow-x-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 overscroll-x-contain touch-pan-x"
      >
        {children}
      </div>

      {/* Subtle Right Shadow Cue for mobile when more data is hidden */}
      {canScrollRight && (
        <div className="md:hidden pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-background/70 to-transparent" />
      )}
    </div>
  );
}
