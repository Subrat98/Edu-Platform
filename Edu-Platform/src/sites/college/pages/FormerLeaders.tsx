import { Link } from "react-router-dom";
import {
  Award,
  Calendar,
  BookOpen,
  GraduationCap,
  Sparkles,
  Search,
  ExternalLink,
  Landmark,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Hero } from "@/components/sections/Hero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { collegeHeroUrl } from "@/mocks/data/images";
import { institutions } from "@/mocks/data/institutions";
import { useLiveSiteContent } from "@/features/content/siteContentService";

export default function FormerLeaders() {
  const institution = institutions.college;
  const siteContent = useLiveSiteContent("college");
  const about = siteContent?.about;
  const [search, setSearch] = useState("");

  const defaultLeaders = [
    {
      name: "Dr. Prana Krushna Parija",
      tenure: "1943 – 1948",
      field: "Eminent Botanist & Pioneer Educationist",
      legacy: "First Vice-Chancellor of the university; laid the academic bylaws, established foundational science chairs, and represented Indian science at international botanical congresses.",
      honors: "OBE, Padmabhushan, Fellow of Indian National Science Academy (INSA)",
    },
    {
      name: "Dr. Chintamani Acharya",
      tenure: "1948 – 1951",
      field: "Legal Luminary, Jurist & Historian",
      legacy: "Drafted the primary statutes governing university autonomy, standardized degree examinations, and instituted research fellowships in regional history and classical languages.",
      honors: "Eminent Jurist, Author of 'Cuttack Itihasa'",
    },
    {
      name: "Prof. Parasuram Misra",
      tenure: "1951 – 1956",
      field: "Plant Physiologist & Academic Administrator",
      legacy: "Spearheaded the land acquisition for the 350-acre Vani Vihar campus; organized post-independence science faculties and postgraduate residential hostels.",
      honors: "Ph.D. (Leeds), Eminent Educationist",
    },
    {
      name: "Dr. Sriram Chandra Dash",
      tenure: "1969 – 1972",
      field: "Constitutional Scholar & Political Scientist",
      legacy: "Authored definitive treatises on the Constitution of India; consolidated the School of Social Sciences and instituted international exchange fellowships.",
      honors: "D.Phil (Berlin), National Constitutional Authority",
    },
    {
      name: "Prof. Trilochan Pradhan",
      tenure: "1989 – 1991",
      field: "Theoretical Physicist & Founder Director, IOP",
      legacy: "Pioneered quantum electrodynamics research; established the Central Instrumentation Facility (CIF) and modernized university laboratory infrastructure.",
      honors: "Padma Shri, Former Director Institute of Physics",
    },
    {
      name: "Prof. Radhamohan",
      tenure: "1994 – 1997",
      field: "Applied Economist & Environmentalist",
      legacy: "Integrated environmental science across all disciplines; established the university eco-conservation park and seed gene bank; advocated organic agriculture.",
      honors: "Padma Shri (2020), UNEP Global 500 Laureate",
    },
    {
      name: "Prof. (Dr.) Soumendra Mohan Patnaik",
      tenure: "2017 – 2020",
      field: "Anthropologist & Academic Reformer",
      legacy: "Led the university during its Diamond Jubilee era, initiated NAAC Cycle 2 accreditation milestones, and established the Center for Tribal Studies and World Bank OHEPEE projects.",
      honors: "President Indian Anthropological Association, Senior Fulbright Fellow",
    },
    {
      name: "Prof. Sabita Acharya",
      tenure: "2020 – 2023",
      field: "Distinguished Social Anthropologist",
      legacy: "First woman Vice-Chancellor in the university's history; successfully spearheaded the NAAC Cycle 3 accreditation resulting in Grade A+ (CGPA 3.42) and UGC Category-1 status.",
      honors: "Eminent Social Scientist, Member UGC Expert Panels",
    },
  ];

  const leaders = useMemo(() => {
    if (about?.formerLeaders && about.formerLeaders.length > 0) {
      // Merge live siteContent leaders with default details if available
      return about.formerLeaders.map((ldr) => {
        const match = defaultLeaders.find((d) => d.name.toLowerCase() === ldr.name.toLowerCase());
        return {
          name: ldr.name,
          tenure: ldr.tenure,
          field: ldr.field,
          legacy: match?.legacy || "Distinguished academic leadership stewarding the growth, governance, and scholastic reputation of the university.",
          honors: match?.honors || "Distinguished Academician & Scholar",
        };
      });
    }
    return defaultLeaders;
  }, [about?.formerLeaders]);

  const filteredLeaders = useMemo(() => {
    if (!search.trim()) return leaders;
    const q = search.toLowerCase();
    return leaders.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.tenure.toLowerCase().includes(q) ||
        l.field.toLowerCase().includes(q) ||
        l.legacy.toLowerCase().includes(q)
    );
  }, [leaders, search]);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/college" },
          { label: "About", href: "/college/about" },
          { label: "Former Vice-Chancellors" },
        ]}
      />

      <Hero
        variant="compact"
        title="Former Vice-Chancellors Roll of Honor"
        subtitle="Visionary Academic Leaders Who Stewarded Institutional Excellence Across Generations"
        imageUrl={about?.heroImage || collegeHeroUrl(5)}
      />

      <Container className="py-10 space-y-12">
        {/* Intro */}
        <div className="space-y-4 border-b pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 text-xs">
              Roll of Honor · 1943 – Present
            </Badge>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
              Visionary Academic Stewardship
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Eminent Vice-Chancellors of the University
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl">
            Since its university charter in 1943, {institution.name} has been steered by some of India's most celebrated scientists,
            constitutional jurists, literary figures, and social thinkers. Their collective vision laid the bedrock of higher education
            in Odisha, fostering world-class academic institutions, scientific discovery, and social enlightenment.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search by name, tenure, or field…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>
          <span className="text-xs text-muted-foreground">
            Displaying {filteredLeaders.length} of {leaders.length} Vice-Chancellors
          </span>
        </div>

        {/* Leaders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeaders.map((ldr, idx) => {
            const initials = ldr.name
              ? ldr.name
                  .replace(/^(Dr\.|Prof\.|Shri|Late|Mr\.|Mrs\.)\s*/i, "")
                  .trim()
                  .split(/\s+/)
                  .filter(Boolean)
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "VC"
              : "VC";

            return (
              <Card
                key={idx}
                className="p-5 border border-border/70 bg-card hover:border-primary/40 transition-all shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="size-12 rounded-xl bg-primary/10 text-primary font-black flex items-center justify-center shrink-0 text-sm shadow-xs border border-primary/20">
                      {initials}
                    </div>
                    <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30 shrink-0">
                      <Calendar className="size-3 mr-1 inline" />
                      {ldr.tenure}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-foreground leading-snug">
                      {ldr.name}
                    </h3>
                    <p className="text-xs text-primary font-medium mt-0.5">{ldr.field}</p>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {ldr.legacy}
                  </p>
                </div>

                {ldr.honors && (
                  <div className="pt-3 border-t border-border/50 text-[11px] text-muted-foreground flex items-start gap-1.5">
                    <Award className="size-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{ldr.honors}</span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Chancellors Tribute Strip */}
        <div className="p-6 rounded-2xl bg-muted/40 border border-border/70 space-y-3">
          <div className="flex items-center gap-2">
            <Landmark className="size-5 text-primary" />
            <h3 className="font-bold text-base text-foreground">The Office of the Chancellor</h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Under the Odisha Universities Act, the Governor of Odisha serves as the Hon'ble Chancellor of the university.
            Over eight decades, illustrious statesmen and constitutional heads have graced the Chancellorship, providing
            constitutional direction, presiding over annual convocations, and upholding the integrity of public higher education.
          </p>
          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <Badge variant="secondary">Dr. Kailash Nath Katju (1947–1948)</Badge>
            <Badge variant="secondary">Asaf Ali (1948–1952)</Badge>
            <Badge variant="secondary">Fazal Ali (1952–1954)</Badge>
            <Badge variant="secondary">Bhim Sen Sachar (1956–1957)</Badge>
            <Badge variant="secondary">Dr. S. C. Jamir (2013–2018)</Badge>
            <Badge variant="secondary">Prof. Ganeshi Lal (2018–2023)</Badge>
            <Badge variant="secondary">Shri Raghubar Das (2023–Present)</Badge>
          </div>
        </div>

        {/* Quick Nav */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl border border-border/70 bg-card">
          <div className="text-xs text-muted-foreground text-center sm:text-left">
            Explore directions, campus layout, and transit guidelines to visit our historic university.
          </div>
          <Button size="sm" asChild className="gap-1.5 bg-primary text-white text-xs font-bold shadow-xs">
            <Link to="/college/about/location">
              <span>Location & How to Reach</span>
              <ExternalLink className="size-3.5" />
            </Link>
          </Button>
        </div>
      </Container>
    </>
  );
}
