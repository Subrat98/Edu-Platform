import { Link } from "react-router-dom";
import { CalendarCheck, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";

export interface AdmissionsCTAProps {
  title: string;
  description: string;
  deadline?: string;
  eligibility?: string;
  steps?: string[];
  ctaLabel: string;
  ctaHref: string;
}

export function AdmissionsCTA({ title, description, deadline, eligibility, steps, ctaLabel, ctaHref }: AdmissionsCTAProps) {
  return (
    <section className="bg-primary text-white">
      <Container className="grid grid-cols-1 gap-10 py-14 sm:py-16 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h2 className="font-heading text-2xl font-bold text-balance sm:text-3xl">{title}</h2>
          <p className="mt-3 max-w-xl text-white/85">{description}</p>
          <div className="mt-6 flex flex-wrap gap-6 text-sm">
            {deadline ? (
              <div className="flex items-center gap-2">
                <CalendarCheck className="text-highlight size-4" />
                <span>Last date: {deadline}</span>
              </div>
            ) : null}
            {eligibility ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-highlight size-4" />
                <span>{eligibility}</span>
              </div>
            ) : null}
          </div>
          <Button asChild size="lg" className="bg-highlight text-highlight-foreground hover:bg-highlight/90 mt-7">
            <Link to={ctaHref}>{ctaLabel}</Link>
          </Button>
        </div>
        {steps && steps.length > 0 ? (
          <ol className="space-y-3">
            {steps.map((step, i) => (
              <li key={step} className="flex items-start gap-3 rounded-lg bg-white/10 p-3 text-sm">
                <span className="bg-highlight text-highlight-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        ) : null}
      </Container>
    </section>
  );
}
