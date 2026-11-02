import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { cn } from "@/lib/utils";

export interface RichTextProps {
  eyebrow?: string;
  title?: string;
  paragraphs: string[];
  tone?: "surface" | "background";
  columns?: 1 | 2;
}

export function RichText({ eyebrow, title, paragraphs, tone = "surface", columns = 1 }: RichTextProps) {
  return (
    <section className={tone === "surface" ? "bg-surface" : "bg-background"}>
      <Container className="py-14 sm:py-16">
        {title ? <SectionHeading eyebrow={eyebrow} title={title} className="mb-6" /> : null}
        <div
          className={cn(
            "text-muted-foreground max-w-3xl space-y-4 text-base leading-relaxed",
            columns === 2 && "sm:columns-2 sm:gap-8 sm:space-y-0",
          )}
        >
          {paragraphs.map((p, i) => (
            <p key={i} className="break-inside-avoid-column">
              {p}
            </p>
          ))}
        </div>
      </Container>
    </section>
  );
}
