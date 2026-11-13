import { Link } from "react-router-dom";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { schoolHeroUrl } from "@/mocks/data/images";
import { institutions } from "@/mocks/data/institutions";
import {
  Sparkles,
  BookOpen,
  Award,
  ShieldCheck,
  Building2,
  Calendar,
  Users,
  Video,
  Download,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export default function SchoolAbout() {
  const institution = institutions.school;

  const milestones = [
    { year: "1998", event: "Establishment of Our School at Khandapara with Nursery to Class V to provide affordable quality English-medium education." },
    { year: "2004", event: "Received unconditional No Objection Certificate (NOC) from the School & Mass Education Department, Govt. of Odisha." },
    { year: "2008", event: "Granted composite affiliation by the Central Board of Secondary Education (CBSE) up to Secondary Level (Class X)." },
    { year: "2015", event: "Upgraded to Senior Secondary Level (Class XII) in Science and Commerce streams; established modern laboratories." },
    { year: "2020", event: "Selected by NITI Aayog for establishment of Atal Tinkering Lab (ATL); instituted smart interactive classrooms." },
    { year: "2024", event: "Achieved 100% pass result in Class X AISSE; awarded Fit India Gold Certified School status." },
    { year: "2026", event: "Affiliation extended through 2029; fully compliant with CBSE Appendix IX and NEP 2020 Holistic Progress standards." },
  ];

  return (
    <>
      <Hero
        variant="compact"
        title="About Our School"
        subtitle="Heritage, Vision, Educational Philosophy & 27 Years of Scholarly Excellence"
        imageUrl={schoolHeroUrl(1)}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/school" }, { label: "About Us" }]} />

      <Container className="py-10 space-y-12">
        {/* Story & Vision Header */}
        <div className="space-y-6">
          <div className="border-b pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                Estd. 1998 · Khandapara, Nayagarh
              </Badge>
              <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                CBSE Affiliation No. 3330123 · School Code: 15234
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground mt-2">
              Where Every Child Learns to Shine
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl leading-relaxed">
              Founded in 1998 in Khandapara, Nayagarh, <strong>Our School</strong> has grown over nearly three decades into a beacon of academic rigor, character building, and inclusive student care across 4.0 acres of green, modern infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-border/70 bg-card p-5 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Sparkles className="size-4" />
                <span>Our Vision</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                To nurture intellectually curious, morally rooted, and socially responsible global citizens capable of creative problem-solving and nation-building.
              </p>
            </Card>

            <Card className="border border-border/70 bg-card p-5 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <BookOpen className="size-4" />
                <span>Our Mission</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                To provide a joyful, fear-free learning ecosystem combining CBSE-NCERT excellence with Atal Tinkering Lab innovations, sports, and inclusive care.
              </p>
            </Card>

            <Card className="border border-border/70 bg-card p-5 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-sm">
                <Award className="size-4" />
                <span>Our Core Motto</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>"Vidya Dadati Vinayam"</strong> (Knowledge Bestows Humility) — shaping head, heart, and hands with humility, discipline, and scientific inquiry.
              </p>
            </Card>
          </div>
        </div>

        {/* School Emblem & Song */}
        <div className="p-6 rounded-2xl border bg-muted/20 space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary text-primary-foreground font-bold text-xs">School Identity</Badge>
            <span className="text-xs text-muted-foreground font-semibold">Emblem & Anthem</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-muted-foreground">
            <div className="space-y-2">
              <h3 className="font-bold text-foreground text-sm">The School Emblem</h3>
              <p className="leading-relaxed">
                The school crest features a blooming lotus symbolizing purity of thought, an open book representing eternal wisdom, an atom reflecting scientific spirit, and rising sun rays depicting enlightenment and hope for every learner.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-foreground text-sm">School Anthem</h3>
              <p className="leading-relaxed italic bg-background/80 p-3 rounded-lg border">
                "In Khandapara's sacred land of green and grace,<br />
                We learn with joy, we run with pace,<br />
                Our School, our guide, our shining sun,<br />
                United as learners, together as one!"
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics Stats Strip */}
        <Stats tone="primary" items={institution.stats} />

        {/* Chronological Heritage Timeline */}
        <div className="space-y-6">
          <div className="border-b pb-2">
            <h2 className="text-xl font-bold text-foreground">Our 27-Year Journey of Growth</h2>
            <p className="text-xs text-muted-foreground">Key milestones in the history and development of Our School.</p>
          </div>

          <div className="border-l-2 border-primary/30 ml-4 space-y-6 pl-6">
            {milestones.map((m) => (
              <div key={m.year} className="relative group">
                <div className="absolute -left-[31px] top-0 size-3.5 rounded-full bg-primary ring-4 ring-background group-hover:scale-125 transition-transform" />
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-black text-primary">{m.year}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{m.event}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links & Mandatory Disclosure CTA */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-background to-primary/10 border-2 border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-bold text-foreground">Mandatory Public Disclosure (CBSE Appendix IX)</h3>
            <p className="text-xs text-muted-foreground">Inspect self-attested copies of CBSE affiliation, building safety, fire NOC, and teacher qualifications.</p>
          </div>
          <Button asChild className="gap-2 bg-primary font-bold text-xs shrink-0 shadow-md">
            <Link to="/school/mandatory-disclosure">
              <span>View Mandatory Disclosure</span>
              <ChevronRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </Container>
    </>
  );
}
