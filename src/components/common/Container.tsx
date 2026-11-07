import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[96%] xl:max-w-[94%] 2xl:max-w-7xl px-3 sm:px-5 lg:px-6", className)}>{children}</div>;
}
