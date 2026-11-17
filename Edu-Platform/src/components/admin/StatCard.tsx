import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "default" | "warning" | "error" | "success";
}

const TONE_CLASSES: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "bg-accent/10 text-accent",
  warning: "bg-warning/10 text-warning",
  error: "bg-destructive/10 text-destructive",
  success: "bg-success/10 text-success",
};

export function StatCard({ label, value, icon: Icon, tone = "default" }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", TONE_CLASSES[tone])}>
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="font-heading text-foreground text-2xl font-bold">{value}</p>
          <p className="text-muted-foreground truncate text-xs">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
