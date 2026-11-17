import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Download,
  CheckCircle2,
  Search,
  ShieldCheck,
  ChevronRight,
  Award,
} from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { collegeHeroUrl } from "@/mocks/data/images";

interface AqarArchiveItem {
  id: string;
  year: string;
  cycle: number;
  status: "Submitted & Acknowledged" | "Approved & Validated" | "In Compilation";
  submissionDate: string;
  completionScore: number;
  coordinator: string;
  criteriaScores: { [key: number]: number };
  highlights: string[];
  aqarPdfUrl: string;
  atrPdfUrl: string;
  minutesPdfUrl: string;
}

const EIGHT_YEAR_AQAR_DATA: AqarArchiveItem[] = [
  {
    id: "aqar-2024-25",
    year: "2024-25",
    cycle: 3,
    status: "Submitted & Acknowledged",
    submissionDate: "28 November 2025",
    completionScore: 100,
    coordinator: "Dr. Snigdha Mohanty",
    criteriaScores: { 1: 100, 2: 100, 3: 100, 4: 100, 5: 100, 6: 100, 7: 100 },
    highlights: [
      "Rollout of NEP 2020 4-year undergraduate curriculum with multidisciplinary minors.",
      "Commissioning of 120 kWp Solar Photovoltaic Grid interactive project.",
      "78 Scopus/WoS indexed faculty publications and 4 published design patents.",
    ],
    aqarPdfUrl: "/documents/naac/aqar/AQAR_Final_2024_25.pdf",
    atrPdfUrl: "/documents/naac/aqar/ATR_2024_25.pdf",
    minutesPdfUrl: "/documents/naac/iqac/IQAC_Minutes_2024_25.pdf",
  },
  {
    id: "aqar-2023-24",
    year: "2023-24",
    cycle: 3,
    status: "Submitted & Acknowledged",
    submissionDate: "15 December 2024",
    completionScore: 100,
    coordinator: "Dr. Snigdha Mohanty",
    criteriaScores: { 1: 100, 2: 100, 3: 100, 4: 100, 5: 100, 6: 100, 7: 100 },
    highlights: [
      "First statutory post-accreditation AQAR of NAAC Cycle 3 (Grade A+).",
      "Full cloud automation of campus ERP, student lifecycle and library RFID kiosk.",
      "Institutional Seed Money Grant awarded to 18 junior faculty researchers.",
    ],
    aqarPdfUrl: "/documents/naac/aqar/AQAR_Final_2023_24.pdf",
    atrPdfUrl: "/documents/naac/aqar/ATR_2023_24.pdf",
    minutesPdfUrl: "/documents/naac/iqac/IQAC_Minutes_2023_24.pdf",
  },
  {
    id: "aqar-2022-23",
    year: "2022-23",
    cycle: 3,
    status: "Approved & Validated",
    submissionDate: "20 November 2023",
    completionScore: 98.4,
    coordinator: "Dr. Rashmita Mishra",
    criteriaScores: { 1: 100, 2: 98, 3: 96, 4: 100, 5: 97, 6: 100, 7: 100 },
    highlights: [
      "SSR compilation year leading directly to NAAC Cycle 3 Peer Team Visit.",
      "Completion of Institutional Information for Quality Assessment (IIQA).",
      "Green Audit, Energy Audit & Environmental Quality Certification awarded.",
    ],
    aqarPdfUrl: "/documents/naac/aqar/AQAR_Final_2022_23.pdf",
    atrPdfUrl: "/documents/naac/aqar/ATR_2022_23.pdf",
    minutesPdfUrl: "/documents/naac/iqac/IQAC_Minutes_2022_23.pdf",
  },
  {
    id: "aqar-2021-22",
    year: "2021-22",
    cycle: 2,
    status: "Approved & Validated",
    submissionDate: "18 December 2022",
    completionScore: 96.8,
    coordinator: "Dr. Rashmita Mishra",
    criteriaScores: { 1: 96, 2: 98, 3: 94, 4: 98, 5: 95, 6: 98, 7: 98 },
    highlights: [
      "Post-COVID hybrid pedagogical integration into LMS and virtual laboratory platforms.",
      "Faculty enrichment through national FDPs on digital evaluation benchmarks.",
      "85% on-campus and remote campus placement drive across IT & core domains.",
    ],
    aqarPdfUrl: "/documents/naac/aqar/AQAR_Final_2021_22.pdf",
    atrPdfUrl: "/documents/naac/aqar/ATR_2021_22.pdf",
    minutesPdfUrl: "/documents/naac/iqac/IQAC_Minutes_2021_22.pdf",
  },
  {
    id: "aqar-2020-21",
    year: "2020-21",
    cycle: 2,
    status: "Approved & Validated",
    submissionDate: "22 December 2021",
    completionScore: 95.2,
    coordinator: "Prof. Satyabrata Dash",
    criteriaScores: { 1: 94, 2: 96, 3: 92, 4: 96, 5: 94, 6: 96, 7: 98 },
    highlights: [
      "Emergency distance education protocol and G-Suite for Education enterprise deployment.",
      "Establishment of Student Psychosocial Counseling and Mentorship Cell.",
      "Online faculty research seminars and IEEE international virtual conference.",
    ],
    aqarPdfUrl: "/documents/naac/aqar/AQAR_Final_2020_21.pdf",
    atrPdfUrl: "/documents/naac/aqar/ATR_2020_21.pdf",
    minutesPdfUrl: "/documents/naac/iqac/IQAC_Minutes_2020_21.pdf",
  },
  {
    id: "aqar-2019-20",
    year: "2019-20",
    cycle: 2,
    status: "Approved & Validated",
    submissionDate: "14 December 2020",
    completionScore: 94.6,
    coordinator: "Prof. Satyabrata Dash",
    criteriaScores: { 1: 94, 2: 95, 3: 90, 4: 95, 5: 94, 6: 95, 7: 96 },
    highlights: [
      "Implementation of Learning Outcomes-based Curriculum Framework (LOCF).",
      "Overhaul of Central Instrumentation Facility with modern analytical equipment.",
      "State-level inter-college cultural & sports fest with 2,400+ attendees.",
    ],
    aqarPdfUrl: "/documents/naac/aqar/AQAR_Final_2019_20.pdf",
    atrPdfUrl: "/documents/naac/aqar/ATR_2019_20.pdf",
    minutesPdfUrl: "/documents/naac/iqac/IQAC_Minutes_2019_20.pdf",
  },
  {
    id: "aqar-2018-19",
    year: "2018-19",
    cycle: 2,
    status: "Approved & Validated",
    submissionDate: "10 December 2019",
    completionScore: 93.8,
    coordinator: "Prof. Satyabrata Dash",
    criteriaScores: { 1: 92, 2: 94, 3: 90, 4: 94, 5: 93, 6: 94, 7: 95 },
    highlights: [
      "Full migration to Choice Based Credit System (CBCS) across all undergraduate streams.",
      "Installation of smart interactive displays in 24 lecture halls.",
      "Institutional Innovation Council (IIC) constituted under MHRD guidelines.",
    ],
    aqarPdfUrl: "/documents/naac/aqar/AQAR_Final_2018_19.pdf",
    atrPdfUrl: "/documents/naac/aqar/ATR_2018_19.pdf",
    minutesPdfUrl: "/documents/naac/iqac/IQAC_Minutes_2018_19.pdf",
  },
  {
    id: "aqar-2017-18",
    year: "2017-18",
    cycle: 2,
    status: "Approved & Validated",
    submissionDate: "05 December 2018",
    completionScore: 92.5,
    coordinator: "Dr. Bimal Patra",
    criteriaScores: { 1: 90, 2: 92, 3: 88, 4: 92, 5: 92, 6: 93, 7: 94 },
    highlights: [
      "Inaugural year of NAAC Cycle 2 accreditation tenure (Grade A).",
      "Revised examination bye-laws incorporating continuous internal evaluation (CIE).",
      "Establishment of Dedicated Career Guidance and Civil Services coaching cell.",
    ],
    aqarPdfUrl: "/documents/naac/aqar/AQAR_Final_2017_18.pdf",
    atrPdfUrl: "/documents/naac/aqar/ATR_2017_18.pdf",
    minutesPdfUrl: "/documents/naac/iqac/IQAC_Minutes_2017_18.pdf",
  },
];

export default function CollegeAqarArchive() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cycleFilter, setCycleFilter] = useState<string>("all");

  const filteredAqars = useMemo(() => {
    return EIGHT_YEAR_AQAR_DATA.filter((item) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        item.year.toLowerCase().includes(q) ||
        item.coordinator.toLowerCase().includes(q) ||
        item.highlights.some((h) => h.toLowerCase().includes(q));

      const matchesCycle =
        cycleFilter === "all" ||
        (cycleFilter === "cycle-3" && item.cycle === 3) ||
        (cycleFilter === "cycle-2" && item.cycle === 2);

      return matchesSearch && matchesCycle;
    });
  }, [searchTerm, cycleFilter]);

  return (
    <>
      <Hero
        variant="compact"
        title="Annual Quality Assurance Report (AQAR) 8-Year Archive"
        imageUrl={collegeHeroUrl(3)}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/college" },
          { label: "Quality (IQAC / NAAC)", href: "/college/iqac" },
          { label: "AQAR Archive" },
        ]}
      />

      {/* Overview & Key Stats */}
      <section className="bg-gradient-to-b from-primary/5 via-background to-background py-10 sm:py-14 border-b border-border/60">
        <Container>
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="size-3.5" />
              <span>Statutory Compliance Repository</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-heading">
              Eight Years of Quality Assurance & Transparency
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              In accordance with NAAC guidelines, the Internal Quality Assurance Cell (IQAC) of Our College submits
              an Annual Quality Assurance Report (AQAR) every academic year. Below is the statutory repository of
              validated AQAR reports, Action Taken Reports (ATRs), and quarterly meeting proceedings spanning 2017 through 2025.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            <div className="p-4 rounded-xl bg-card border border-border/60 shadow-xs">
              <p className="text-xs text-muted-foreground">Longitudinal Span</p>
              <p className="text-2xl font-black text-foreground mt-1">8 Years</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">2017-18 to 2024-25</p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border/60 shadow-xs">
              <p className="text-xs text-muted-foreground">Submission Compliance</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">100%</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Zero Delinquency</p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border/60 shadow-xs">
              <p className="text-xs text-muted-foreground">NAAC Validation</p>
              <p className="text-2xl font-black text-primary mt-1">Grade A+</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">CGPA 3.42 (Cycle 3)</p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border/60 shadow-xs">
              <p className="text-xs text-muted-foreground">Action Taken Reports</p>
              <p className="text-2xl font-black text-foreground mt-1">32 ATRs</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Statutory Minutes</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Filter and Search Bar */}
      <section className="py-8 bg-surface border-b border-border/60">
        <Container>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                placeholder="Search year, coordinator, or initiatives..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-10 text-sm bg-background"
              />
            </div>

            <div className="flex items-center gap-3">
              <Select value={cycleFilter} onValueChange={setCycleFilter}>
                <SelectTrigger className="h-10 w-[180px] bg-background text-xs">
                  <SelectValue placeholder="All Accreditation Cycles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cycles (8 Years)</SelectItem>
                  <SelectItem value="cycle-3">Cycle 3 (2022–Present)</SelectItem>
                  <SelectItem value="cycle-2">Cycle 2 (2017–2022)</SelectItem>
                </SelectContent>
              </Select>

              <Badge variant="outline" className="h-10 px-3 text-xs font-semibold bg-background">
                Showing {filteredAqars.length} Reports
              </Badge>
            </div>
          </div>
        </Container>
      </section>

      {/* Reports List */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="space-y-6">
            {filteredAqars.map((aqar) => (
              <Card key={aqar.id} className="border border-border/70 shadow-xs hover:border-primary/40 transition-colors overflow-hidden">
                <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-xl sm:text-2xl font-black text-foreground">
                          Academic Year {aqar.year}
                        </span>
                        <Badge
                          variant={aqar.cycle === 3 ? "default" : "secondary"}
                          className="font-bold text-xs"
                        >
                          NAAC Cycle {aqar.cycle}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 text-xs font-semibold gap-1"
                        >
                          <CheckCircle2 className="size-3" />
                          <span>{aqar.status}</span>
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <span>Submitted on: <strong>{aqar.submissionDate}</strong></span>
                        <span>•</span>
                        <span>IQAC Coordinator: <strong>{aqar.coordinator}</strong></span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button asChild size="sm" className="gap-1.5 shadow-xs">
                        <a href={aqar.aqarPdfUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="size-3.5" />
                          <span>Full AQAR PDF</span>
                        </a>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="gap-1.5">
                        <a href={aqar.atrPdfUrl} target="_blank" rel="noopener noreferrer">
                          <FileText className="size-3.5" />
                          <span>Action Taken (ATR)</span>
                        </a>
                      </Button>
                      <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
                        <a href={aqar.minutesPdfUrl} target="_blank" rel="noopener noreferrer">
                          <span>Minutes</span>
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-5">
                  {/* Criteria scores strip */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="font-semibold text-foreground">Criteria I–VII Verified Implementation Progress:</span>
                      <span className="font-bold font-mono text-primary">{aqar.completionScore}% Complete</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1.5 text-center">
                      {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                        const score = aqar.criteriaScores[num] ?? 100;
                        return (
                          <div key={num} className="p-2 rounded-lg bg-surface border border-border/50">
                            <p className="text-[10px] text-muted-foreground font-semibold">Crit. {num}</p>
                            <p className="text-xs font-black text-foreground mt-0.5">{score}%</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50">
                    <p className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
                      <Award className="size-3.5 text-primary" />
                      <span>Key Quality Initiatives & Milestones for {aqar.year}:</span>
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-muted-foreground">
                      {aqar.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-primary font-bold">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Statutory Signoff Footer Note */}
          <div className="mt-12 p-6 rounded-2xl bg-surface border border-border/70 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-foreground">Statutory NAAC IQAC Compliance Certificate</h4>
              <p className="text-xs text-muted-foreground">
                All AQARs archived above are verified against original NAAC HEI portal submission acknowledgments.
                Hard copies are maintained in the IQAC Central Archives Office, Administrative Block.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button asChild variant="secondary" size="sm" className="gap-1.5">
                <Link to="/college/iqac">
                  <span>Visit IQAC Portal</span>
                  <ChevronRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
