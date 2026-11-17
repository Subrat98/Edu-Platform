import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface ProgrammeCardItem {
  title: string;
  subtitle?: string;
  description: string;
  href: string;
  badge?: string;
}

export interface ProgrammeCardsProps {
  eyebrow?: string;
  title: string;
  description?: string;
  items: ProgrammeCardItem[];
  ctaLabel?: string;
}

export function ProgrammeCards({ eyebrow, title, description, items, ctaLabel = "View details" }: ProgrammeCardsProps) {
  return (
    <section className="bg-background">
      <Container className="py-14 sm:py-16">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.title} className="flex flex-col justify-between transition-shadow hover:shadow-md">
              <CardHeader>
                {item.badge ? (
                  <Badge variant="outline" className="mb-2 w-fit">
                    {item.badge}
                  </Badge>
                ) : null}
                <CardTitle className="font-heading text-lg">{item.title}</CardTitle>
                {item.subtitle ? <p className="text-muted-foreground text-sm">{item.subtitle}</p> : null}
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </CardContent>
              <CardFooter>
                <Link
                  to={item.href}
                  className="text-accent inline-flex items-center gap-1 text-sm font-medium hover:underline"
                >
                  {ctaLabel} <ArrowRight className="size-3.5" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
