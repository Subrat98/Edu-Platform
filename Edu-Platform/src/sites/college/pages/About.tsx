import { Link } from "react-router-dom";
import {
  Award,
  BookOpen,
  Calendar,
  Download,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  MapPin,
  Compass,
  Network,
  Scale,
  History,
  ArrowRight,
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

  const aboutSections = [
    {
      title: "University Profile",
      desc: "Comprehensive overview of collegiate origins, 150+ years of scholarly growth, and public higher education mission.",
      path: "/college/about",
      badge: "Overview",
      icon: BookOpen,
    },
    {
      title: "History & Heritage",
      desc: "Chronological evolution from 1868 collegiate founding through the 1943 University Charter to the modern era.",
      path: "/college/about/history",
      badge: "1868 – Present",
      icon: History,
    },
    {
      title: "Vision & Mission",
      desc: "Guiding institutional philosophy, core ethical values (Satya, Jnana, Samanvaya), and NEP 2020 strategic roadmap.",
      path: "/college/about/vision-mission",
      badge: "Core Values",
      icon: Sparkles,
    },
    {
      title: "Act & Statutes",
      desc: "The Odisha Universities Act, 1989, statutory ordinances, gazette notifications, and legal regulatory compendiums.",
      path: "/college/about/act-statutes",
      badge: "Legal Framework",
      icon: Scale,
    },
    {
      title: "Institutional Organogram",
      desc: "Constitutional governance hierarchy from the Hon'ble Chancellor down to statutory deans, registrars, and faculty heads.",
      path: "/college/about/organogram",
      badge: "Governance Tree",
      icon: Network,
    },
    {
      title: "Former Vice-Chancellors",
      desc: "Roll of Honor commemorating visionary scientists, legal luminaries, and reformers who stewarded the university.",
      path: "/college/about/former-leaders",
      badge: "Roll of Honor",
      icon: Award,
    },
    {
      title: "Location & How to Reach",
      desc: "Transit access guide via international airport (BBI), central railway station (BBS), NH-16 highway, and campus entry gates.",
      path: "/college/about/location",
      badge: "Transit & Map",
      icon: MapPin,
    },
    {
      title: "Virtual Campus Tour",
      desc: "Interactive 360° virtual tour exploring the historic red-brick quadrangle, Parija Library, CIF labs, and auditorium.",
      path: "/college/virtual-tour",
      badge: "360° Interactive",
      icon: Compass,
    },
  ];

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
      <Breadcrumbs items={[{ label: "Home", href: "/college" }, { label: "About" }]} />
      <Hero
        variant="compact"
        title={about?.heroTitle || "About the University"}
        subtitle={about?.heroSubtitle || "Heritage, Vision, Academic Excellence & 150+ Years of Public Higher Education"}
        imageUrl={about?.heroImage || collegeHeroUrl(4)}
      />

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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <Sparkles className="size-4" />
                  <span>{about?.visionTitle || "Our Vision"}</span>
                </div>
                <Button size="xs" variant="ghost" asChild className="text-[11px] text-primary gap-1">
                  <Link to="/college/about/vision-mission">
                    <span>Explore Vision</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {about?.visionText || "To stand as an internationally acclaimed centre of higher learning and research, nurturing visionary leaders, ethical innovators, and socially responsible citizens dedicated to holistic regional, national, and global development."}
              </p>
            </Card>

            <Card className="border border-border/70 bg-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <BookOpen className="size-4" />
                  <span>{about?.missionTitle || "Our Mission"}</span>
                </div>
                <Button size="xs" variant="ghost" asChild className="text-[11px] text-primary gap-1">
                  <Link to="/college/about/vision-mission">
                    <span>Explore Mission</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {about?.missionText || "To provide accessible, high-caliber undergraduate, postgraduate, and doctoral education; foster transformative interdisciplinary research in Science, Humanities, and Commerce; and uphold democratic transparency and sustainable community advancement."}
              </p>
            </Card>
          </div>
        </div>

        {/* 8 Dedicated University Portals Directory */}
        <div className="space-y-6">
          <div className="border-b pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <BookOpen className="size-5 text-primary" />
                Explore the About Section (8 Dedicated Portals)
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Navigate to individual dedicated pages for each facet of our university.
              </p>
            </div>
            <Badge variant="outline" className="text-xs font-mono w-fit text-primary border-primary/30">
              8 Dedicated Pages
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {aboutSections.map((sec, idx) => {
              const Icon = sec.icon;
              return (
                <Card
                  key={idx}
                  className="p-5 border border-border/70 bg-card hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="size-4" />
                      </div>
                      <Badge variant="secondary" className="text-[10px] font-mono">
                        {sec.badge}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                      {sec.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {sec.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border/50">
                    <Button size="xs" variant="ghost" asChild className="w-full justify-between text-xs text-primary font-bold p-0 hover:bg-transparent">
                      <Link to={sec.path}>
                        <span>Open Page</span>
                        <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Stats Strip */}
        <Stats tone="primary" items={institution.stats} />

        {/* Historical Timeline */}
        <div className="space-y-4">
          <div className="border-b pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Calendar className="size-5 text-primary" />
                Chronological Heritage Timeline (1868 – Present)
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Key milestones across more than a century of academic preeminence.
              </p>
            </div>
            <Button size="xs" variant="outline" asChild className="gap-1.5 text-xs text-primary border-primary/30 w-fit">
              <Link to="/college/about/history">
                <History className="size-3" />
                <span>Full Heritage Page</span>
              </Link>
            </Button>
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
          <div className="border-b pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="size-5 text-primary" />
                Statutory University Act & Governance Structure
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Legal foundation and hierarchical organogram governing university operations.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="xs" variant="outline" asChild className="text-xs text-primary border-primary/30">
                <Link to="/college/about/act-statutes">
                  <span>Act & Statutes Page</span>
                </Link>
              </Button>
              <Button size="xs" asChild className="text-xs bg-primary text-white">
                <Link to="/college/about/organogram">
                  <span>Organogram Page</span>
                </Link>
              </Button>
            </div>
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
                <Link to="/college/about/act-statutes">
                  <Download className="size-3" />
                  <span>View Act & Gazettes</span>
                </Link>
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
                <Link to="/college/about/act-statutes">
                  <Download className="size-3" />
                  <span>View Compendiums</span>
                </Link>
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
                <Link to="/college/about/organogram">
                  <span>View Flowchart</span>
                  <ExternalLink className="size-3" />
                </Link>
              </Button>
            </Card>
          </div>
        </div>

        {/* Former Vice-Chancellors Roll of Honor */}
        <div className="space-y-4">
          <div className="border-b pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Award className="size-5 text-amber-600" />
                Former Vice-Chancellors Roll of Honor
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Acknowledging the visionary leadership that stewarded the institution across decades.
              </p>
            </div>
            <Button size="xs" variant="outline" asChild className="gap-1.5 text-xs text-primary border-primary/30 w-fit">
              <Link to="/college/about/former-leaders">
                <Award className="size-3" />
                <span>Full Roll of Honor</span>
              </Link>
            </Button>
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
