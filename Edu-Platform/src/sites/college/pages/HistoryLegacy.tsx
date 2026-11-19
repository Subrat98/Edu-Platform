import { Link } from "react-router-dom";
import {
  Calendar,
  Award,
  BookOpen,
  Landmark,
  Scroll,
  Sparkles,
  Download,
  Building,
  GraduationCap,
  History,
} from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { collegeHeroUrl } from "@/mocks/data/images";
import { institutions } from "@/mocks/data/institutions";
import { useLiveSiteContent } from "@/features/content/siteContentService";

export default function HistoryLegacy() {
  const institution = institutions.college;
  const siteContent = useLiveSiteContent("college");
  const about = siteContent?.about;

  const defaultTimeline = [
    {
      year: "1868",
      title: "Dawn of Modern Higher Education in Odisha",
      event: "Establishment of the Collegiate Institution in Cuttack, opening the first formal portal of collegiate learning in Eastern India.",
      tag: "Collegiate Founding",
    },
    {
      year: "1876",
      title: "Elevation to Full Degree College",
      event: "Upgraded with full undergraduate degree faculties in Physical Sciences, Natural Sciences, Classical Languages, and Humanities.",
      tag: "Academic Expansion",
    },
    {
      year: "1943",
      title: "State Legislative Assembly University Charter",
      event: "Chartered on November 27, 1943 under the Odisha Legislative Assembly Act as the premier state university of Odisha, affiliating colleges across the state.",
      tag: "University Charter",
    },
    {
      year: "1958",
      title: "Laying of the Vani Vihar Foundation",
      event: "Foundation stone laid by Dr. Rajendra Prasad, the first President of India, across 350+ acres of scenic academic campus in Bhubaneswar.",
      tag: "Campus Expansion",
    },
    {
      year: "1962",
      title: "Inauguration of Iconic Red-Brick Quadrangle",
      event: "Inauguration of the historic administrative building and central library quadrangle by Dr. S. Radhakrishnan, President of India.",
      tag: "Architectural Landmark",
    },
    {
      year: "1989",
      title: "Platinum Jubilee & CIF Establishment",
      event: "Celebrated 120 years of collegiate foundation; inaugurated the modern Central Instrumentation Facility (CIF) for cutting-edge scientific research.",
      tag: "Research Core",
    },
    {
      year: "2017",
      title: "NAAC Cycle 2 Grade A Accreditation",
      event: "Conferred Grade A status with autonomous academic excellence recognition by UGC and Ministry of Education, Government of India.",
      tag: "Quality Benchmark",
    },
    {
      year: "2023",
      title: "NAAC Grade A+ (CGPA 3.42) & UGC Category-1",
      event: "Recognized as a premier Category-1 University under UGC Autonomous Regulations with top quartile state university ranking.",
      tag: "National Preeminence",
    },
    {
      year: "2026",
      title: "NEP 2020 Multidisciplinary Hub & Smart Campus",
      event: "Full roll-out of four-year multidisciplinary undergraduate curriculum (FYUGP), AI-enabled smart labs, and statewide academic bank of credits (ABC).",
      tag: "Modern Era",
    },
  ];

  const timeline = (about?.timeline && about.timeline.length > 0)
    ? about.timeline.map((item, idx) => ({
        year: item.year,
        title: item.event.split(".")[0] || `Historic Milestone ${item.year}`,
        event: item.event,
        tag: `Milestone ${idx + 1}`,
      }))
    : defaultTimeline;

  const heritageAssets = [
    {
      title: "Historic Red-Brick Quadrangle (1868 / 1962)",
      description: "Classical colonial-Gothic arches, exposed brick arcades, and landscaped quadrangles designed to inspire contemplative academic scholarship.",
      image: collegeHeroUrl(1),
    },
    {
      title: "Parija Central Library & Manuscript Repository",
      description: "Founded in honor of pioneer botanist Dr. P. K. Parija, preserving over 250,000 scholarly volumes and rare medieval palm-leaf manuscripts.",
      image: collegeHeroUrl(2),
    },
    {
      title: "Central Instrumentation Facility (CIF)",
      description: "High-end research equipment hub supporting XRD, FE-SEM, FTIR spectroscopy, and chemical characterization across scientific faculties.",
      image: collegeHeroUrl(3),
    },
  ];

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/college" },
          { label: "About", href: "/college/about" },
          { label: "History & Legacy" },
        ]}
      />

      <Hero
        variant="compact"
        title="History & Heritage"
        subtitle="Over 150 Years of Scholarly Legacy, Public Leadership & Nation-Building"
        imageUrl={about?.heroImage || collegeHeroUrl(1)}
      />

      <Container className="py-10 space-y-12">
        {/* Intro Story */}
        <div className="space-y-4 border-b pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
              Estd. 1868 · Chartered 1943
            </Badge>
            <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs">
              UGC Category-1 · NAAC Grade A+
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Sculpting the Intellectual Landscape of Eastern India
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl">
            From its historic collegiate inception in the 19th century through the momentous University Charter of 1943,
            {institution.name} has stood as the cradle of intellectual resurgence, democratic enlightenment, and scientific inquiry in Odisha.
            Generations of scholars, freedom fighters, chief ministers, jurists, civil servants, and scientists have walked these corridors,
            carrying forward an unyielding commitment to truth, societal advancement, and academic integrity.
          </p>
        </div>

        {/* Chronological Heritage Timeline */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Calendar className="size-5 text-primary" />
                Chronological Heritage Milestones (1868 – Present)
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Key statutory, academic, and infrastructural benchmarks across more than a century and a half.
              </p>
            </div>
            <Badge variant="outline" className="font-mono text-xs w-fit">
              {timeline.length} Documented Epochs
            </Badge>
          </div>

          <div className="relative border-l-2 border-primary/30 ml-4 pl-6 space-y-8">
            {timeline.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline Node Dot */}
                <div className="absolute -left-[31px] top-1 size-4 rounded-full bg-card border-2 border-primary group-hover:scale-125 transition-transform" />

                <Card className="p-5 border border-border/70 bg-card hover:border-primary/50 transition-all shadow-xs space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-primary text-base sm:text-lg">
                        {item.year}
                      </span>
                      <span className="text-muted-foreground/50">|</span>
                      <span className="font-bold text-foreground text-sm sm:text-base">
                        {item.title}
                      </span>
                    </div>
                    {item.tag && (
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                        {item.tag}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.event}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Architectural & Campus Heritage Showcase */}
        <div className="space-y-6">
          <div className="border-b pb-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Landmark className="size-5 text-primary" />
              Living Heritage Landmarks
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Architectural treasures reflecting the transition from classical collegiate legacy to 21st-century scientific excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {heritageAssets.map((asset, i) => (
              <Card key={i} className="overflow-hidden border border-border/70 bg-card shadow-xs flex flex-col justify-between">
                <div>
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={asset.image}
                      alt={asset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-sm text-foreground">{asset.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{asset.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Archival Downloads & Quick Navigation Strip */}
        <div className="p-6 rounded-2xl bg-muted/40 border border-border/70 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2 justify-center md:justify-start">
              <Scroll className="size-4 text-primary" />
              Historic Charter Gazettes & Publications
            </h3>
            <p className="text-xs text-muted-foreground">
              Explore primary source gazettes, convocation compendiums, and historical statutes preserved in our archives.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm" variant="outline" asChild className="text-xs gap-1.5 border-primary/30 text-primary">
              <Link to="/college/about/act-statutes">
                <BookOpen className="size-3.5" />
                <span>View Act & Statutes</span>
              </Link>
            </Button>
            <Button size="sm" asChild className="text-xs gap-1.5 bg-primary text-white shadow-xs">
              <Link to="/college/about/former-leaders">
                <Award className="size-3.5" />
                <span>Roll of Honor</span>
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
