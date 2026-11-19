import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  Search,
  Filter,
  UserCheck,
  BookOpen,
  Scale,
  Sparkles,
  ArrowRight,
  ExternalLink,
  GraduationCap,
  Landmark,
  Cpu,
  Heart,
  Send,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Hero } from "@/components/sections/Hero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { collegeHeroUrl } from "@/mocks/data/images";

interface AlumnusProfile {
  id: string;
  name: string;
  batch: string;
  degree: string;
  domain: "Statesmen & Civil Services" | "Science & Technology" | "Judiciary & Law" | "Literature & Arts" | "Corporate & Enterprise";
  honors: string[];
  career: string;
  summary: string;
  citation: string;
}

const DISTINGUISHED_ALUMNI_LIST: AlumnusProfile[] = [
  {
    id: "alumnus-01",
    name: "Dr. Harekrushna Mahatab",
    batch: "Class of 1920",
    degree: "B.A. (Hons)",
    domain: "Statesmen & Civil Services",
    honors: ["Former Chief Minister of Odisha", "Union Minister of Commerce & Industry", "Freedom Fighter"],
    career: "Key architect of modern Odisha, founder of The Prajatantra, and pioneer of the Hirakud Dam project.",
    summary: "Led the integration of the princely states into Odisha and served as Governor of Bombay State.",
    citation: "A timeless titan whose vision established foundational state infrastructure and public scholarship.",
  },
  {
    id: "alumnus-02",
    name: "Prof. (Dr.) Prana Krushna Parija",
    batch: "Class of 1913",
    degree: "B.Sc. (Hons)",
    domain: "Science & Technology",
    honors: ["Fellow of National Institute of Sciences (FNI)", "Padma Bhushan (1955)", "Vice-Chancellor, Utkal University"],
    career: "Eminent plant physiologist, Cambridge Tripos scholar, and premier educational administrator.",
    summary: "Conducted seminal research on water hyacinth respiration and transpiration kinetics.",
    citation: "The father of botanical and biological research in eastern India whose name adorns our central library.",
  },
  {
    id: "alumnus-03",
    name: "Justice B. K. Ray",
    batch: "Class of 1938",
    degree: "B.A. (Hons) / B.L.",
    domain: "Judiciary & Law",
    honors: ["Former Chief Justice", "Member of the Bar Council of India", "Pioneering Jurist"],
    career: "Distinguished legal scholar who adjudicated landmark constitutional and administrative cases.",
    summary: "Instrumental in reforming legal education curricula and judicial ethics oversight in Odisha.",
    citation: "A pillar of integrity and judicial jurisprudence whose legal rulings continue to guide legal scholars.",
  },
  {
    id: "alumnus-04",
    name: "Dr. Mayadhar Mansingh",
    batch: "Class of 1932",
    degree: "B.A. (Hons), Ph.D. (Durham)",
    domain: "Literature & Arts",
    honors: ["Padma Shri (1967)", "Celebrated Odia Romantic Poet", "Principal & Educationist"],
    career: "Authored definitive works on Odia literary history, Shakespearean translations, and lyrical poetry.",
    summary: "Principal of several premier colleges and author of the landmark 'History of Odia Literature'.",
    citation: "Illuminated twentieth-century Odia literature with emotional cadence, humanist philosophies, and elegance.",
  },
  {
    id: "alumnus-05",
    name: "Prof. Trilochan Pradhan",
    batch: "Class of 1949",
    degree: "B.Sc. Physics (Hons)",
    domain: "Science & Technology",
    honors: ["Padma Shri (1990)", "Founder-Director, Institute of Physics (IOP)", "Vice-Chancellor, Utkal University"],
    career: "World-renowned theoretical physicist specializing in quantum electrodynamics and high-energy physics.",
    summary: "Conducted research at University of Chicago with Enrico Fermi and established premier research infrastructure.",
    citation: "Nurtured generations of cutting-edge Indian physicists through the establishment of IOP Bhubaneswar.",
  },
  {
    id: "alumnus-06",
    name: "Smt. Pratibha Ray",
    batch: "Class of 1965",
    degree: "B.Sc. (Hons), M.Ed., Ph.D.",
    domain: "Literature & Arts",
    honors: ["Jnanpith Award (2011)", "Padma Bhushan (2022)", "Moortidevi Award"],
    career: "Pre-eminent Indian novelist and academician known for 'Yajnaseni', 'Shilapadma', and 'Uttarmarg'.",
    summary: "Represented Indian thought in international delegations and served as member of the Odisha Public Service Commission.",
    citation: "Reinterpreted classical epic narratives through feminist empathy and humanism, enriching world literature.",
  },
  {
    id: "alumnus-07",
    name: "Shri Sitakant Mahapatra",
    batch: "Class of 1957",
    degree: "B.A. History (Hons)",
    domain: "Statesmen & Civil Services",
    honors: ["Jnanpith Award (1993)", "Padma Vibhushan (2011)", "Union Culture Secretary (IAS)"],
    career: "Senior IAS administrator, Sahitya Akademi President, and world-renowned poet and anthropologist.",
    summary: "Extensively documented oral poetry and ritual traditions of eastern Indian tribal indigenous cultures.",
    citation: "Seamlessly harmonized high-level administrative governance with deep literary lyricism and tribal anthropology.",
  },
  {
    id: "alumnus-08",
    name: "Dr. Subrat Tripathy",
    batch: "Class of 1991",
    degree: "M.Sc. Electronics",
    domain: "Science & Technology",
    honors: ["Scientist G & Outstanding Scientist Award", "DRDO Technology Leadership Medal"],
    career: "Key contributor to national radar sensor payloads, electronic warfare suites, and avionics systems.",
    summary: "Leads research divisions developing indigenous radar cross-section analysis and telemetry instrumentation.",
    citation: "Exemplifies our institutional tradition of self-reliance and technological defense excellence.",
  },
  {
    id: "alumnus-09",
    name: "Shri Subroto Bagchi",
    batch: "Class of 1977",
    degree: "B.Sc. (Hons)",
    domain: "Corporate & Enterprise",
    honors: ["Co-founder, Mindtree Technologies", "Chairman, Odisha Skill Development Authority (OSDA)"],
    career: "Business leader, bestselling author, and transformative public philanthropist behind the Bagchi-Sri Shankara Cancer Hospital.",
    summary: "Pioneered India's global IT services growth and championed technical skill development for over 100,000 youths.",
    citation: "Transformed corporate leadership into societal philanthropy and visionary healthcare infrastructure.",
  },
];

export default function DistinguishedAlumni() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("All");
  const [nominateSubmitted, setNominateSubmitted] = useState(false);
  const [nomineeName, setNomineeName] = useState("");
  const [nomineeBatch, setNomineeBatch] = useState("");
  const [nomineeReason, setNomineeReason] = useState("");

  const domains = [
    "All",
    "Science & Technology",
    "Statesmen & Civil Services",
    "Literature & Arts",
    "Judiciary & Law",
    "Corporate & Enterprise",
  ];

  const filteredAlumni = useMemo(() => {
    return DISTINGUISHED_ALUMNI_LIST.filter((a) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !searchQuery ||
        a.name.toLowerCase().includes(q) ||
        a.batch.toLowerCase().includes(q) ||
        a.career.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.honors.some((h) => h.toLowerCase().includes(q));

      const matchesDomain = selectedDomain === "All" || a.domain === selectedDomain;

      return matchesSearch && matchesDomain;
    });
  }, [searchQuery, selectedDomain]);

  const handleNominate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomineeName.trim() || !nomineeReason.trim()) {
      toast.error("Please fill in nominee details");
      return;
    }
    setNominateSubmitted(true);
    toast.success("Nomination submitted to the Distinguished Alumnus Committee");
  };

  return (
    <div>
      {/* Hero Section */}
      <Hero
        title="Distinguished Alumni Hall of Fame"
        subtitle="Honoring immortal leaders, Bharat Ratna & Padma awardees, Jnanpith laureates, pioneering scientists, and jurists whose indelible contributions have shaped our nation."
        backgroundImage={collegeHeroUrl}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/college" },
          { label: "Alumni", href: "/college/alumni" },
          { label: "Distinguished Alumni", href: "/college/alumni/distinguished" },
        ]}
      />

      <Container className="py-12 space-y-12">
        {/* Intro & Search Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Hall of Fame Gallery</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Showing <strong>{filteredAlumni.length}</strong> illustrious alumni across varied national fields
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search alumni or honors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs h-9"
              />
            </div>

            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              aria-label="Filter Alumni by Domain"
              className="h-9 px-3 text-xs rounded-md border border-input bg-background focus:ring-1 focus:ring-primary"
            >
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Alumni Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((alumnus) => (
            <Card
              key={alumnus.id}
              className="border border-border/80 bg-card hover:border-primary/50 transition-all hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="outline" className="font-mono text-xs font-semibold text-primary border-primary/30">
                      {alumnus.batch}
                    </Badge>
                    <Badge className="bg-muted text-foreground text-[10px] font-medium border border-border">
                      {alumnus.domain}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold leading-tight">
                    {alumnus.name}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground pt-0.5">
                    {alumnus.degree}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 pt-0 text-xs">
                  {/* Honors & Accolades */}
                  <div className="flex flex-wrap gap-1.5">
                    {alumnus.honors.map((h, i) => (
                      <Badge key={i} className="bg-primary/10 text-primary text-[10px] border-primary/20 font-medium">
                        {h}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-foreground font-medium leading-relaxed">
                    {alumnus.career}
                  </p>

                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {alumnus.summary}
                  </p>

                  <div className="p-3 rounded-lg bg-muted/40 border-l-2 border-primary italic text-[11px] text-muted-foreground">
                    "{alumnus.citation}"
                  </div>
                </CardContent>
              </div>

              <div className="p-4 pt-0 border-t border-border/50 mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-primary" /> Lifetime Hall of Fame
                </span>
                <span className="font-semibold text-primary">PSC Laureate</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Nominate an Alumnus for DAA Section */}
        <Card className="border border-primary/30 bg-card shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <Badge className="bg-primary text-primary-foreground text-xs font-semibold">
                Annual Nominations
              </Badge>
            </div>
            <CardTitle className="text-xl font-bold mt-1">
              Nominate an Alumnus for the Distinguished Alumnus Award (DAA)
            </CardTitle>
            <CardDescription className="text-xs">
              Every year on Annual Alumni Day, the Syndicate confers the prestigious DAA upon alumni demonstrating extraordinary service to science, society, statecraft, or entrepreneurship.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!nominateSubmitted ? (
              <form onSubmit={handleNominate} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Nominee Full Name *</label>
                    <Input
                      type="text"
                      placeholder="e.g. Dr. Ramesh Chandra Senapati"
                      value={nomineeName}
                      onChange={(e) => setNomineeName(e.target.value)}
                      required
                      className="text-xs h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Graduation Batch / Year (Approximate)</label>
                    <Input
                      type="text"
                      placeholder="e.g. Batch of 1998 (Physics)"
                      value={nomineeBatch}
                      onChange={(e) => setNomineeBatch(e.target.value)}
                      className="text-xs h-9"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Summary of Significant Achievements & Impact *</label>
                  <textarea
                    rows={4}
                    placeholder="Describe their career achievements, publications, public leadership, or technological contributions..."
                    value={nomineeReason}
                    onChange={(e) => setNomineeReason(e.target.value)}
                    required
                    className="w-full rounded-md border border-input bg-background p-3 text-xs text-foreground focus:ring-1 focus:ring-primary leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-muted-foreground">
                    Nominations reviewed by the Senate Honours Committee.
                  </span>
                  <Button type="submit" className="font-bold gap-2 text-xs">
                    <Send className="w-4 h-4" /> Submit DAA Nomination
                  </Button>
                </div>
              </form>
            ) : (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-foreground">DAA Nomination Received</h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Thank you for nominating <strong>{nomineeName}</strong>. The nomination has been recorded for the upcoming Annual Convocation review panel.
                </p>
                <Button size="sm" variant="outline" onClick={() => setNominateSubmitted(false)}>
                  Nominate Another Alumnus
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cross-navigation to Other Alumni Sections */}
        <div className="pt-6 border-t border-border">
          <h3 className="text-lg font-bold mb-4">Explore More in Alumni & Giving</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/college/alumni/association"
              className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-sm group flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors text-sm">
                  Alumni Association
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">Chapters, Executive Roster & Life Membership</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/college/alumni/giving"
              className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-sm group flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors text-sm">
                  Give to the University
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">Endowments, 80G Tax Exemption & Scholarships</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/college/alumni/connect"
              className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-sm group flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors text-sm">
                  Mentorship & Reunions
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">Alumni Meet, Mentoring & Career Network</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
