import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/common/Container";

export function PageLoadingSkeleton() {
  return (
    <Container className="py-14">
      <Skeleton className="h-10 w-2/3 rounded-lg" />
      <Skeleton className="mt-4 h-4 w-1/2 rounded-lg" />
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    </Container>
  );
}
