import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  FlaskConical,
  Dumbbell,
  Bus,
  UtensilsCrossed,
  HeartPulse,
  ShieldCheck,
  Monitor,
  BookOpen,
  Users,
  GraduationCap,
  Microscope,
} from "lucide-react";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ICON_MAP = {
  building: Building2,
  lab: FlaskConical,
  sports: Dumbbell,
  transport: Bus,
  canteen: UtensilsCrossed,
  medical: HeartPulse,
  safety: ShieldCheck,
  computer: Monitor,
  library: BookOpen,
  people: Users,
  academics: GraduationCap,
  science: Microscope,
} as const;

export interface DepartmentCardItem {
  title: string;
  meta?: string;
  description: string;
  href?: string;
  icon?: keyof typeof ICON_MAP;
}

export interface DepartmentCardsProps {
  eyebrow?: string;
  title: string;
  description?: string;
  items: DepartmentCardItem[];
}

export function DepartmentCards({ eyebrow, title, description, items }: DepartmentCardsProps) {
  return (
    <section className="bg-surface">
      <Container className="py-14 sm:py-16">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => {
            const IconComp = (item.icon && ICON_MAP[item.icon]) || Building2;
            const body = (
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="bg-accent/10 text-accent flex size-10 items-center justify-center rounded-lg">
                    <IconComp className="size-5" aria-hidden="true" />
                  </div>
                  <CardTitle className="font-heading mt-2 text-base">{item.title}</CardTitle>
                  {item.meta ? <p className="text-muted-foreground text-xs">{item.meta}</p> : null}
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                  {item.href ? (
                    <span className="text-accent mt-3 inline-flex items-center gap-1 text-sm font-medium">
                      Learn more <ArrowRight className="size-3.5" />
                    </span>
                  ) : null}
                </CardContent>
              </Card>
            );
            return item.href ? (
              <Link key={item.title} to={item.href} className="block">
                {body}
              </Link>
            ) : (
              <div key={item.title}>{body}</div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
