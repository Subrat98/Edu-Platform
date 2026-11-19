import { Link } from "react-router-dom";
import {
  Sparkles,
  BookOpen,
  Target,
  ShieldCheck,
  Compass,
  HeartHandshake,
  Lightbulb,
  Globe,
  Award,
  ArrowRight,
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

export default function VisionMission() {
  const institution = institutions.college;
  const siteContent = useLiveSiteContent("college");
  const about = siteContent?.about;

  const coreValues = [
    {
      title: "Satya · Truth & Academic Integrity",
      desc: "Uncompromising ethical standards in scientific inquiry, authorship, evaluation, and institutional administration.",
      icon: ShieldCheck,
      color: "text-blue-600 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Jnana · Pursuit of Transformative Knowledge",
      desc: "Nurturing deep critical thinking, curiosity-driven discovery, and multidisciplinary exploration across sciences, arts, and commerce.",
      icon: Lightbulb,
      color: "text-amber-600 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Samanvaya · Inclusion & Social Equity",
      desc: "Ensuring democratic access, gender equality, and affirmative support for first-generation learners and marginalized communities.",
      icon: HeartHandshake,
      color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Utkarsha · Striving for Highest Excellence",
      desc: "Continuous self-improvement, rigorous peer review, NAAC benchmarks, and global competitiveness in teaching and research.",
      icon: Award,
      color: "text-purple-600 bg-purple-500/10 border-purple-500/20",
    },
    {
      title: "Seva · Community & Environmental Stewardship",
      desc: "Active grassroots engagement, regional problem-solving, environmental sustainability, and disaster resilience for Odisha.",
      icon: Globe,
      color: "text-rose-600 bg-rose-500/10 border-rose-500/20",
    },
  ];

  const missionPillars = [
    {
      num: "01",
      title: "Student-Centric NEP 2020 Pedagogy",
      desc: "Implementing flexible 4-year undergraduate frameworks (FYUGP), multiple entry/exit pathways, credit mobility, and continuous holistic evaluation.",
    },
    {
      num: "02",
      title: "Translational & Interdisciplinary Research",
      desc: "Accelerating discovery in biotechnology, material sciences, renewable energy, Odishan heritage, and AI with dedicated extramural funding.",
    },
    {
      num: "03",
      title: "Inclusive & Affordable Higher Education",
      desc: "Promoting merit-cum-means scholarships, free hostel waivers for underprivileged students, and 100% barrier-free campus infrastructure.",
    },
    {
      num: "04",
      title: "Transparent, Digital & Accountable Governance",
      desc: "Leveraging e-office workflows, paperless Samarth ERP systems, RTI compliance, and public disclosure in accordance with UGC and GIGW 3.0 norms.",
    },
  ];

  const strategicGoals = [
    { target: "NIRF Top 50", metric: "Consolidated state university rank by 2028 through enhanced research output and citation impact." },
    { target: "100% NEP 2020", metric: "Complete transition across all affiliated departments with multidisciplinary major/minor choices." },
    { target: "₹50+ Cr Grants", metric: "Attracting national research sponsorships from DST, SERB, DBT, ICSSR, and CSIR." },
    { target: "Net-Zero Campus", metric: "Solar rooftop microgrid, rainwater harvesting aquifers, and single-use plastic eradication." },
  ];

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/college" },
          { label: "About", href: "/college/about" },
          { label: "Vision & Mission" },
        ]}
      />

      <Hero
        variant="compact"
        title="Vision, Mission & Core Values"
        subtitle="Guiding Principles of Academic Preeminence, Transformative Research & Social Equity"
        imageUrl={about?.heroImage || collegeHeroUrl(2)}
      />

      <Container className="py-10 space-y-12">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 border-b pb-4">
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
            Guiding Philosophy
          </Badge>
          <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs">
            NEP 2020 Aligned · UGC Category-1
          </Badge>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vision */}
          <Card className="p-6 border-2 border-primary/30 bg-primary/5 space-y-4 shadow-sm relative overflow-hidden">
            <div className="size-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-md">
              <Sparkles className="size-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-mono font-bold text-primary block">
                Institutional Horizon
              </span>
              <h2 className="text-2xl font-black text-foreground mt-1">
                {about?.visionTitle || "Our Vision"}
              </h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-medium">
              "{about?.visionText || "To stand as an internationally acclaimed centre of higher learning and research, nurturing visionary leaders, ethical innovators, and socially responsible citizens dedicated to holistic regional, national, and global development."}"
            </p>
            <div className="pt-2 border-t border-primary/20 text-xs text-muted-foreground">
              Anchored in 150+ years of scholarly excellence and focused on shaping India's knowledge economy.
            </div>
          </Card>

          {/* Mission */}
          <Card className="p-6 border-2 border-border/80 bg-card space-y-4 shadow-sm relative overflow-hidden">
            <div className="size-12 rounded-xl bg-foreground text-background flex items-center justify-center shadow-md">
              <BookOpen className="size-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-mono font-bold text-muted-foreground block">
                Guiding Charter
              </span>
              <h2 className="text-2xl font-black text-foreground mt-1">
                {about?.missionTitle || "Our Mission"}
              </h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-medium">
              "{about?.missionText || "To provide accessible, high-caliber undergraduate, postgraduate, and doctoral education; foster transformative interdisciplinary research in Science, Humanities, and Commerce; and uphold democratic transparency and sustainable community advancement."}"
            </p>
            <div className="pt-2 border-t border-border/60 text-xs text-muted-foreground">
              Committed to regional empowerment through equal access, quality benchmarks, and ethical leadership.
            </div>
          </Card>
        </div>

        {/* Mission Pillars */}
        <div className="space-y-6">
          <div className="border-b pb-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Target className="size-5 text-primary" />
              Strategic Mission Pillars
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Concrete operational commitments transforming our high-level vision into daily educational practice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {missionPillars.map((pillar, idx) => (
              <Card key={idx} className="p-5 border border-border/70 bg-card hover:border-primary/40 transition-all shadow-xs space-y-2">
                <span className="font-mono text-2xl font-black text-primary/40 block">
                  {pillar.num}
                </span>
                <h3 className="font-bold text-sm text-foreground">{pillar.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{pillar.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Core Institutional Values */}
        <div className="space-y-6">
          <div className="border-b pb-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Compass className="size-5 text-primary" />
              Core Institutional Values
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Timeless tenets that govern faculty conduct, student character building, and academic governance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coreValues.map((val, i) => {
              const Icon = val.icon;
              return (
                <Card key={i} className="p-5 border border-border/70 bg-card hover:border-primary/40 transition-all shadow-xs space-y-3">
                  <div className={`size-10 rounded-xl flex items-center justify-center border ${val.color}`}>
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{val.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1.5">{val.desc}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Strategic Goals 2026–2030 */}
        <div className="space-y-6">
          <div className="border-b pb-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Award className="size-5 text-primary" />
              Strategic Goals 2026–2030
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Measurable institutional deliverables supporting the Vision 2030 roadmap.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {strategicGoals.map((g, i) => (
              <div key={i} className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-1.5">
                <Badge className="bg-primary text-white text-[10px]">{g.target}</Badge>
                <p className="text-xs text-foreground font-medium pt-1 leading-snug">{g.metric}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation Strip */}
        <div className="p-6 rounded-2xl bg-muted/40 border border-border/70 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-base text-foreground">Explore Governance & Structure</h3>
            <p className="text-xs text-muted-foreground">Learn how our mission translates into statutory governance and university leadership.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" asChild className="gap-1.5 bg-primary text-white shadow-xs text-xs font-bold">
              <Link to="/college/about/organogram">
                <span>View Organogram</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
