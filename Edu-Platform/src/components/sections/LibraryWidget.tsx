import { Link } from "react-router-dom";
import { BookOpen, Clock, Search } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface LibraryWidgetProps {
  title?: string;
  volumeCount: string;
  hours: string;
  catalogueHref: string;
  loginHref: string;
}

export function LibraryWidget({ title = "Library", volumeCount, hours, catalogueHref, loginHref }: LibraryWidgetProps) {
  return (
    <section className="bg-accent/5">
      <Container className="py-14 sm:py-16">
        <div className="border-border bg-surface grid grid-cols-1 gap-8 rounded-2xl border p-8 sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <div className="bg-accent/10 text-accent flex size-12 items-center justify-center rounded-xl">
              <BookOpen className="size-6" />
            </div>
            <h2 className="font-heading text-foreground mt-4 text-2xl font-semibold">{title}</h2>
            <p className="text-muted-foreground mt-2 max-w-md text-sm">
              Search our catalogue, check availability, and book a title — pick it up at the desk with your
              Booking Number.
            </p>
            <dl className="text-muted-foreground mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm">
              <div className="flex items-center gap-1.5">
                <BookOpen className="size-4" /> <span>{volumeCount} volumes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="size-4" /> <span>{hours}</span>
              </div>
            </dl>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild>
                <Link to={catalogueHref}>Browse Catalogue</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to={loginHref}>My Library Login</Link>
              </Button>
            </div>
          </div>
          <div className="bg-background border-border flex items-center gap-2 rounded-xl border p-3">
            <Search className="text-muted-foreground size-5 shrink-0" />
            <Input placeholder="Search by title, author or ISBN…" className="border-none shadow-none focus-visible:ring-0" disabled />
            <Button size="sm" disabled>
              Search
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
