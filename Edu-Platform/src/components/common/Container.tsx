import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14",
        className
      )}
    >
      {children}
    </div>
  );
}
