import { Construction } from "lucide-react";

export function ComingSoon({ title, phase }: { title: string; phase: string }) {
  return (
    <div className="border-border bg-surface mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-dashed px-8 py-16 text-center">
      <Construction className="text-accent mb-4 size-10" />
      <h1 className="font-heading text-foreground text-xl font-semibold">{title}</h1>
      <p className="text-muted-foreground mt-2 text-sm">This area is planned for {phase} of the EduPlatform build.</p>
    </div>
  );
}
