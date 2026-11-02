import { Container } from "@/components/common/Container";

export interface StatsProps {
  items: { label: string; value: string }[];
  tone?: "surface" | "primary";
}

export function Stats({ items, tone = "surface" }: StatsProps) {
  const isPrimary = tone === "primary";
  return (
    <section className={isPrimary ? "bg-primary text-white" : "bg-surface"}>
      <Container className="py-10 sm:py-12">
        <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {items.map((item) => (
            <div key={item.label} className="text-center">
              <dd className="font-heading text-3xl font-bold sm:text-4xl">{item.value}</dd>
              <dt className={isPrimary ? "mt-1 text-sm text-white/80" : "text-muted-foreground mt-1 text-sm"}>
                {item.label}
              </dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
