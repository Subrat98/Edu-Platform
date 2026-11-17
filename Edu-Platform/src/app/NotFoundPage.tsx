import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/Container";

export function NotFoundPage() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <SearchX className="text-muted-foreground mb-4 size-12" />
      <h1 className="font-heading text-foreground text-3xl font-bold">Page not found</h1>
      <p className="text-muted-foreground mt-2 max-w-md text-sm">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Button asChild className="mt-6">
        <Link to="/">Back to Home</Link>
      </Button>
    </Container>
  );
}
