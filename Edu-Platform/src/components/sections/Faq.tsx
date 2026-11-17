import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { FaqItem } from "@/types";

export interface FaqProps {
  title?: string;
  items: FaqItem[];
}

export function Faq({ title = "Frequently Asked Questions", items }: FaqProps) {
  return (
    <section className="bg-background">
      <Container className="py-14 sm:py-16">
        <SectionHeading eyebrow="FAQ" title={title} />
        <Accordion type="single" collapsible className="mt-6 max-w-3xl">
          {items.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="text-left font-medium">{item.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}
