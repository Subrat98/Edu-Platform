import { Award } from "lucide-react";
import { Container } from "@/components/common/Container";
import type { AccreditationBadge } from "@/types";

export interface AccreditationStripProps {
  items: AccreditationBadge[];
  tone?: "surface" | "background";
}

export function AccreditationStrip({ items, tone = "background" }: AccreditationStripProps) {
  return (
    <section className={tone === "surface" ? "bg-surface" : "bg-background"}>
      <Container className="py-8">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {items.map((badge) => (
            <div key={badge.id} className="flex items-center gap-3">
              <div className="border-accent/40 text-accent flex size-12 items-center justify-center rounded-full border-2">
                <Award className="size-5" />
              </div>
              <div>
                <p className="text-foreground text-sm leading-tight font-semibold">{badge.label}</p>
                <p className="text-muted-foreground text-xs leading-tight">{badge.sublabel}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
