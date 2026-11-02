import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({ eyebrow, title, description, align = "left", className }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <p className="text-accent mb-2 text-sm font-semibold tracking-wide uppercase">{eyebrow}</p>
      ) : null}
      <h2 className="font-heading text-foreground text-2xl font-semibold text-balance sm:text-3xl">{title}</h2>
      {description ? <p className="text-muted-foreground mt-3 text-base">{description}</p> : null}
    </div>
  );
}
