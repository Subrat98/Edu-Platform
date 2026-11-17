import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
}

export function EmptyState({ icon: Icon = Inbox, title, description }: EmptyStateProps) {
  return (
    <div className="border-border flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center">
      <Icon className="text-muted-foreground mb-3 size-10" aria-hidden="true" />
      <p className="text-foreground font-medium">{title}</p>
      {description ? <p className="text-muted-foreground mt-1 max-w-sm text-sm">{description}</p> : null}
    </div>
  );
}
