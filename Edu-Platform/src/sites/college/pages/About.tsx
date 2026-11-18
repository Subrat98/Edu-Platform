import { Link } from "react-router-dom";
import {
  Award,
  BookOpen,
  Calendar,
  Download,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { collegeHeroUrl } from "@/mocks/data/images";
import { institutions } from "@/mocks/data/institutions";
import { accreditationBadges } from "@/mocks/data/accreditation";
import { AccreditationStrip } from "@/components/sections/AccreditationStrip";
import { useLiveSiteContent } from "@/features/content/siteContentService";

export default function CollegeAbout() {
  const institution = institutions.college;
  const siteContent = useLiveSiteContent("college");
  const about = siteContent?.about;

  const timeline = (about?.timeline && about.timeline.length > 0) ? about.timeline : [
    { year: "1868", event: "Establishment of the Collegiate Institution, marking the dawn of modern higher education in Odisha." },
    { year: "1876", event: "Upgraded to a full-fledged Degree College with Science and Arts faculties." },
    { year: "1943", event: "Chartered as the first state university of Odisha under the historic Legislative Assembly Act." },
    { year: "1989", event: "Celebrated Platinum Jubilee and established the Central Instrumentation Facility." },
    { year: "2017", event: "Awarded NAAC Cycle 2 Grade A with autonomous excellence status." },
    { year: "2023", event: "Achieved NAAC Grade A+ (CGPA 3.42) in Cycle 3; recognized as UGC Category-1 University." },
  ];

  const formerVcs = (about?.formerLeaders && about.formerLeaders.length > 0) ? about.formerLeaders : [
    { name: "Dr. Prana Krushna Parija", tenure: "1943 – 1948", field: "Eminent Botanist & Pioneer Educationist" },
    { name: "Dr. Chintamani Acharya", tenure: "1948 – 1951", field: "Legal Luminary & Scholar" },
    { name: "Prof. Trilochan Pradhan", tenure: "1989 – 1991", field: "Eminent Theoretical Physicist & IOP Founder" },
    { name: "Prof. Radhamohan", tenure: "1994 – 1997", field: "Environmentalist & Padma Shri Awardee" },
    { name: "Prof. (Dr.) Soumendra Mohan Patnaik", tenure: "2017 – 2020", field: "Anthropologist & Academic Reformer" },
  ];

  return (
    <>
      <Hero
        variant="compact"
        title={about?.heroTitle || "About the University"}
        subtitle={about?.heroSubtitle || "Heritage, Vision, Academic Excellence & 150+ Years of Public Higher Education"}
        imageUrl={about?.heroImage || collegeHeroUrl(4)}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/college" }, { label: "About" }]} />

      <Container className="py-10 space-y-12">
        {/* Institutional Story & Vision Strip */}
        <div className="space-y-6">
          <div className="border-b pb-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                History & Heritage
              </Badge>
              <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs">
                Over 150 Years of Scholarly Legacy
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground mt-2">
              {about?.storyTitle || "Sculpting Heart, Head & Hand Since 1868 / 1943"}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl leading-relaxed">
              {about?.storyText || `${institution.name} stands as the premier state university of Odisha, uniting historic collegiate heritage with cutting-edge 21st-century research, NEP 2020 multi-disciplinary pedagogy, and NAAC A+ accredited governance.`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-border/70 bg-card p-5 space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Sparkles className="size-4" />
                <span>{about?.visionTitle || "Our Vision"}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {about?.visionText || "To stand as an internationally acclaimed centre of higher learning and research, nurturing visionary leaders, ethical innovators, and socially responsible citizens dedicated to holistic regional, national, and global development."}
              </p>
            </Card>

            <Card className="border border-border/70 bg-card p-5 space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <BookOpen className="size-4" />
                <span>{about?.missionTitle || "Our Mission"}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {about?.missionText || "To provide accessible, high-caliber undergraduate, postgraduate, and doctoral education; foster transformative interdisciplinary research in Science, Humanities, and Commerce; and uphold democratic transparency and sustainable community advancement."}
              </p>
            </Card>
          </div>
        </div>

        {/* Stats Strip */}
        <Stats tone="primary" items={institution.stats} />

        {/* Historical Timeline */}
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="size-5 text-primary" />
              Chronological Heritage Timeline (1868 – Present)
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Key milestones across more than a century of academic preeminence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {timeline.map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-border/60 bg-card hover:border-primary/40 space-y-1 shadow-xs transition-all"
              >
                <Badge className="bg-primary/10 text-primary border-primary/20 font-mono text-xs">
                  {item.year}
                </Badge>
                <p className="text-xs text-foreground font-medium pt-1 leading-snug">
                  {item.event}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* University Act, Statutes & Governance Organogram */}
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" />
              Statutory University Act & Governance Structure
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Legal foundation and hierarchical organogram governing university operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border border-border/60 bg-card p-4 space-y-3 flex flex-col justify-between">
              <div>
                <span className="font-bold text-xs text-foreground block">Odisha Universities Act</span>
                <p className="text-xs text-muted-foreground mt-1">
                  Statutory legislative act establishing the university, defining constitutional powers of the Chancellor, Vice-Chancellor, and Syndicate.
                </p>
              </div>
              <Button size="xs" variant="outline" asChild className="gap-1.5 text-xs text-primary">
                <a href="/documents/statutes/Odisha_Universities_Act_Gazette.pdf" target="_blank" rel="noreferrer">
                  <Download className="size-3" />
                  <span>Download Act (PDF)</span>
                </a>
              </Button>
            </Card>

            <Card className="border border-border/60 bg-card p-4 space-y-3 flex flex-col justify-between">
              <div>
                <span className="font-bold text-xs text-foreground block">University Statutes & Ordinances</span>
                <p className="text-xs text-muted-foreground mt-1">
                  Regulations governing faculty appointments, PG council operations, examination rules, student elections, and disciplinary procedures.
                </p>
              </div>
              <Button size="xs" variant="outline" asChild className="gap-1.5 text-xs text-primary">
                <a href="/documents/statutes/University_Statutes_Compendium.pdf" target="_blank" rel="noreferrer">
                  <Download className="size-3" />
                  <span>Download Statutes (PDF)</span>
                </a>
              </Button>
            </Card>

            <Card className="border border-border/60 bg-card p-4 space-y-3 flex flex-col justify-between">
              <div>
                <span className="font-bold text-xs text-foreground block">Institutional Organogram</span>
                <p className="text-xs text-muted-foreground mt-1">
                  Visual reporting hierarchy from the Hon'ble Chancellor down to statutory deans, registrars, and departmental heads.
                </p>
              </div>
              <Button size="xs" variant="outline" asChild className="gap-1.5 text-xs text-primary">
                <Link to="/college/administration">
                  <span>View Governance Matrix</span>
                  <ExternalLink className="size-3" />
                </Link>
              </Button>
            </Card>
          </div>
        </div>

        {/* Former Vice-Chancellors Roll of Honor */}
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Award className="size-5 text-amber-600" />
              Former Vice-Chancellors Roll of Honor
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Acknowledging the visionary leadership that stewarded the institution across decades.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {formerVcs.map((vc, i) => {
              const initials = vc?.name
                ? vc.name
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
                <div key={i} className="p-3.5 rounded-xl border border-border/60 bg-card text-center space-y-1 shadow-xs">
                  <div className="size-12 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center mx-auto text-sm">
                    {initials}
                  </div>
                  <div className="text-xs font-bold text-foreground pt-1">{vc?.name || "Former Vice-Chancellor"}</div>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {vc?.tenure || ""}
                  </Badge>
                  <div className="text-[10px] text-muted-foreground">{vc?.field || ""}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Accreditation Strip */}
        <AccreditationStrip items={accreditationBadges} tone="surface" />
      </Container>
    </>
  );
}
