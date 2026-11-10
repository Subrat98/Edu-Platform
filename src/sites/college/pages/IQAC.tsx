import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  FileText,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Award,
  Users,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { RichText } from "@/components/sections/RichText";
import { AccreditationStrip } from "@/components/sections/AccreditationStrip";
import { FacultyGrid } from "@/components/sections/FacultyGrid";
import { Downloads } from "@/components/sections/Downloads";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { collegeHeroUrl } from "@/mocks/data/images";
import { accreditationBadges } from "@/mocks/data/accreditation";
import { initialIqacMembers } from "@/mocks/data/naac/iqac";
import {
  initialAcademicCouncilMeetings,
  initialSemesterCalendars,
  initialProgrammeSyllabusStructures,
} from "@/mocks/data/naac/curriculumPlanning";

export default function CollegeIQAC() {
  const [activeCriterion, setActiveCriterion] = useState<number>(1);

  const sevenCriteria = [
    {
      id: 1,
      title: "Criterion 1: Curricular Aspects",
      score: "3.52 / 4.00",
      weightage: 100,
      description:
        "Learning Outcomes-based Curriculum Framework (LOCF), CBCS, NEP-2020 integration, annual Action Taken Reports (ATRs) on curriculum feedback.",
      highlight: "Metric 1.1.1: Academic Council Minutes & Semester Calendars (94 days)",
    },
    {
      id: 2,
      title: "Criterion 2: Teaching-Learning & Evaluation",
      score: "3.48 / 4.00",
      weightage: 350,
      description:
        "Student-centric pedagogy, 1:18 faculty ratio, experiential learning, centralized Continuous Internal Evaluation (CIE), and Student Satisfaction Survey (SSS).",
      highlight: "88.4% Student Satisfaction Rating across 1,420 responses",
    },
    {
      id: 3,
      title: "Criterion 3: Research, Innovations & Extension",
      score: "3.35 / 4.00",
      weightage: 110,
      description:
        "Faculty publications in Scopus/Web of Science, funded research projects, active community extension through NSS and NCC.",
      highlight: "48 Scopus/UGC-CARE indexed publications in 2025-26",
    },
    {
      id: 4,
      title: "Criterion 4: Infrastructure & Learning Resources",
      score: "3.65 / 4.00",
      weightage: 100,
      description:
        "Smart interactive classrooms, automated library with Koha ILMS & INFLIBNET N-LIST, 1 Gbps campus Wi-Fi, and modern laboratory infrastructure.",
      highlight: "100% ICT enabled classrooms & 42,000+ cataloged volumes",
    },
    {
      id: 5,
      title: "Criterion 5: Student Support & Progression",
      score: "3.42 / 4.00",
      weightage: 140,
      description:
        "Government and institutional scholarships, career guidance cell, competitive exam coaching, and active Alumni Association.",
      highlight: "₹1.42 Cr disbursed in financial aid & scholarships",
    },
    {
      id: 6,
      title: "Criterion 6: Governance, Leadership & Management",
      score: "3.50 / 4.00",
      weightage: 100,
      description:
        "Participative management, e-governance ERP deployment, annual administrative audit, and regular faculty development programs (FDP).",
      highlight: "Institutional ERP coverage across 14 modules",
    },
    {
      id: 7,
      title: "Criterion 7: Institutional Values & Best Practices",
      score: "3.70 / 4.00",
      weightage: 100,
      description:
        "Gender equity initiatives, solar power generation (120 kWp), zero-waste campus, Divyangjan-friendly ramps & restrooms, and rainwater harvesting.",
      highlight: "Green Audit Grade 'A+' & Solar microgrid self-reliance",
    },
  ];

  return (
    <>
      <Hero variant="compact" title="IQAC, NAAC & Quality Assurance" imageUrl={collegeHeroUrl(1)} />
      <Breadcrumbs items={[{ label: "Home", href: "/college" }, { label: "IQAC / NAAC" }]} />

      <AccreditationStrip items={accreditationBadges} tone="surface" />

      <RichText
        eyebrow="Internal Quality Assurance Cell"
        title="Institutionalizing Excellence & Statutory Quality Standards"
        paragraphs={[
          "Established in accordance with National Assessment and Accreditation Council (NAAC) guidelines, the Internal Quality Assurance Cell (IQAC) serves as the nodal agency for coordinating quality-related activities across Kalinga College.",
          "The cell oversees continuous curriculum enrichment, monitors statutory semester instructional day benchmarks (≥90 days), facilitates stakeholder feedback loops, and spearheads annual preparation of the Annual Quality Assurance Report (AQAR) and Self Study Report (SSR).",
        ]}
      />

      {/* Statutory IQAC Committee Roster (8 NAAC Statutory Members) */}
      <FacultyGrid
        eyebrow="Statutory Roster"
        title="Statutory IQAC Composition"
        institutionId="college"
        items={initialIqacMembers.map((m) => ({
          name: m.name,
          role: `${m.role} (${m.designation})`,
          meta: `${m.department} · Tenure: ${m.tenure}`,
        }))}
      />

      {/* The 7 NAAC Criteria & Metric 1.1.1 Statutory Documentation Showcase */}
      <Container className="py-12">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary text-xs">
                  Accreditation Matrix
                </Badge>
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs">
                  Current Grade: A++ (CGPA 3.52)
                </Badge>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mt-2">
                The Seven NAAC Criteria Framework
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-2xl">
                Explore our ongoing institutional quality parameters, audited evidence repositories, and statutory compliance documentation.
              </p>
            </div>

            <Button asChild size="sm" variant="outline" className="gap-1.5 self-start sm:self-auto text-xs">
              <Link to="/admin/naac">
                <Award className="size-3.5 text-primary" />
                <span>Admin IQAC Dashboard</span>
              </Link>
            </Button>
          </div>

          {/* Criteria Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
            {sevenCriteria.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCriterion(c.id)}
                className={`text-left p-3 rounded-lg border transition-all ${
                  activeCriterion === c.id
                    ? "border-primary bg-primary/10 shadow-xs"
                    : "border-border/60 bg-card hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className={activeCriterion === c.id ? "text-primary" : "text-foreground"}>
                    C{c.id}
                  </span>
                  <Badge variant="secondary" className="text-[9px] px-1 py-0">
                    {c.weightage} Wt
                  </Badge>
                </div>
                <p className="text-[11px] font-semibold text-foreground mt-1 line-clamp-1">
                  {c.title.replace(/^Criterion \d+: /, "")}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{c.score}</p>
              </button>
            ))}
          </div>

          {/* Detailed Active Criterion View with Metric 1.1.1 Highlight */}
          {activeCriterion === 1 && (
            <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-card to-background shadow-xs">
              <CardHeader className="pb-3 border-b border-border/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <Badge className="bg-primary text-primary-foreground text-xs font-mono">
                      Criterion 1 — Curricular Aspects
                    </Badge>
                    <CardTitle className="text-lg font-bold text-foreground mt-1.5">
                      Metric 1.1.1: Curriculum Planning, Statutory Council & Academic Calendars
                    </CardTitle>
                    <CardDescription className="text-xs mt-0.5">
                      Documented process of effective curriculum delivery adhering to UGC LOCF guidelines and NAAC benchmark of ≥90 instructional days.
                    </CardDescription>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs shrink-0">
                    Score: 3.52 / 4.00 (88%)
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-6">
                {/* Micro-Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-lg border border-border/60 bg-card p-3.5 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                      <Users className="size-4 text-primary" />
                      <span>Academic Council Resolutions</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ACM/XXXIV/2026 gazette approving LOCF curricula, 24% syllabus revisions, and credit structures across 6 departments.
                    </p>
                    <Button variant="ghost" size="xs" asChild className="text-xs p-0 h-auto text-primary gap-1">
                      <a href={initialAcademicCouncilMeetings[0].minutesDocumentUrl} target="_blank" rel="noreferrer">
                        <span>Download Council Minutes</span>
                        <ExternalLink className="size-3" />
                      </a>
                    </Button>
                  </div>

                  <div className="rounded-lg border border-border/60 bg-card p-3.5 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                      <Calendar className="size-4 text-emerald-600" />
                      <span>Semester Academic Calendars</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Statutory academic calendars with 94 instructional days (Odd Sem) and 92 days (Even Sem), meeting NAAC & UGC norms.
                    </p>
                    <Button variant="ghost" size="xs" asChild className="text-xs p-0 h-auto text-primary gap-1">
                      <a href={initialSemesterCalendars[0].calendarPdfUrl} target="_blank" rel="noreferrer">
                        <span>Download 2025-26 Calendar</span>
                        <ExternalLink className="size-3" />
                      </a>
                    </Button>
                  </div>

                  <div className="rounded-lg border border-border/60 bg-card p-3.5 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                      <BookOpen className="size-4 text-purple-600" />
                      <span>LOCF Syllabus Structures</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Choice Based Credit System (CBCS) with Course Outcomes mapped to Bloom's Taxonomy across B.Sc., BCA, and M.Sc.
                    </p>
                    <Button variant="ghost" size="xs" asChild className="text-xs p-0 h-auto text-primary gap-1">
                      <a href={initialProgrammeSyllabusStructures[0].syllabusDocumentUrl} target="_blank" rel="noreferrer">
                        <span>Download Course Structures</span>
                        <ExternalLink className="size-3" />
                      </a>
                    </Button>
                  </div>
                </div>

                {/* Evidence Linkage Strip */}
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <CheckCircle2 className="size-4 text-emerald-600" />
                      NAAC Peer Team Evidence Dossier (Metric 1.1.1)
                    </span>
                    <p className="text-xs text-muted-foreground">
                      All council gazettes, verified lesson plan audit registers, and syllabus structures are indexed in the NAAC repository.
                    </p>
                  </div>
                  <Button asChild size="sm" className="gap-1.5 text-xs shrink-0">
                    <Link to="/admin/naac/evidence?criterion=1">
                      <FileText className="size-3.5" />
                      <span>View Verified Evidences</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeCriterion !== 1 && (
            <Card className="border-border/60 bg-card shadow-xs">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-foreground">
                    {sevenCriteria.find((c) => c.id === activeCriterion)?.title}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    Score: {sevenCriteria.find((c) => c.id === activeCriterion)?.score}
                  </Badge>
                </div>
                <CardDescription className="text-xs mt-1">
                  {sevenCriteria.find((c) => c.id === activeCriterion)?.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-foreground">Key Criterion Highlight</span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {sevenCriteria.find((c) => c.id === activeCriterion)?.highlight}
                    </p>
                  </div>
                  <Button asChild size="sm" variant="outline" className="text-xs gap-1.5">
                    <Link to={`/admin/naac/criteria?tab=${activeCriterion}`}>
                      <span>View Criterion Hub</span>
                      <ExternalLink className="size-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </Container>

      {/* Online Student Satisfaction Survey (SSS) Linkage Banner */}
      <Container className="pb-8">
        <Card className="border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent shadow-xs">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-600 text-white text-xs">NAAC Metric 2.7.1</Badge>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    Online SSS Active
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  Student Satisfaction Survey (SSS) on Teaching-Learning
                </h3>
                <p className="text-xs text-muted-foreground max-w-2xl">
                  Enrolled students evaluate teaching quality, laboratory facilities, mentoring, and outcome-based curriculum delivery.
                  Current participation: 1,420 responses with an average institutional satisfaction score of 4.42 / 5.00 (88.4%).
                </p>
              </div>

              <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs shrink-0">
                <Link to="/admin/naac/feedback">
                  <Sparkles className="size-3.5" />
                  <span>View Feedback & SSS Analysis</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </Container>

      <Downloads institutionId="college" title="AQAR, SSR & Committee Documents" category="IQAC" />
    </>
  );
}

