import { useState, useMemo } from "react";
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
  Heart,
  Leaf,
  Scale,
  Star,
  Globe,
  MessageSquare,
  Search,
  Download,
  Mail,
  Phone,
  Clock,
  ShieldCheck,
  Building2,
  Check,
  History,
  FileCheck2,
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
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { collegeHeroUrl } from "@/mocks/data/images";
import { accreditationBadges } from "@/mocks/data/accreditation";
import {
  initialIqacMembers,
  initialIqacMeetings,
  initialIqacActionTaken,
} from "@/mocks/data/naac/iqac";
import { initialAqarRecords, initialSsrRecord } from "@/mocks/data/naac/aqar";
import { initialAccreditationCycles } from "@/mocks/data/naac/accreditation";
import {
  initialAcademicCouncilMeetings,
  initialSemesterCalendars,
  initialProgrammeSyllabusStructures,
} from "@/mocks/data/naac/curriculumPlanning";
import { initialBosMeetings } from "@/mocks/data/naac/curriculumRevision";
import {
  initialUniversityNotifications,
  initialElectiveCourseOptions,
} from "@/mocks/data/naac/cbcs";
import { initialValueAddedCourses } from "@/mocks/data/naac/valueAddedCourses";

export default function CollegeIQAC() {
  const [activeCriterion, setActiveCriterion] = useState<number>(1);
  const [meetingSearch, setMeetingSearch] = useState("");
  const [atrFilter, setAtrFilter] = useState<"All" | "Completed" | "In Progress">("All");
  const [downloadCategory, setDownloadCategory] = useState<"All" | "AQAR" | "SSR" | "Accreditation">("All");

  const filteredMeetings = useMemo(() => {
    return initialIqacMeetings.filter((m) => {
      const q = meetingSearch.toLowerCase();
      return (
        m.meetingNumber.toLowerCase().includes(q) ||
        m.meetingDate.toLowerCase().includes(q) ||
        m.agenda.some((a) => a.toLowerCase().includes(q)) ||
        m.decisions.some((d) => d.toLowerCase().includes(q))
      );
    });
  }, [meetingSearch]);

  const filteredAtrs = useMemo(() => {
    return initialIqacActionTaken.filter((a) => {
      if (atrFilter === "All") return true;
      return a.status === atrFilter;
    });
  }, [atrFilter]);

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
      score: "3.58 / 4.00",
      weightage: 350,
      description:
        "Student-centric pedagogy, 16:1 teacher ratio, experiential learning, transparent CIE (100% resolved), 92.8% pass percentage, and national Student Satisfaction Survey (SSS).",
      highlight: "92.8% Pass Rate & 94.5% SSS Satisfaction Rating (1,840 responses)",
    },
    {
      id: 3,
      title: "Criterion 3: Research, Innovations & Extension",
      score: "3.82 / 4.00",
      weightage: 110,
      description:
        "₹142.50L research grants (DST, CSIR, UGC), 68 Scopus/WoS publications, 8 patents & 6 startups (IIC 4.5★), ₹28.4L consultancy, 14 community drives, and 16 functional MoUs.",
      highlight: "₹142.50L Research Grants & 68 Scopus/UGC-CARE Publications",
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
      score: "3.74 / 4.00",
      weightage: 140,
      description:
        "Government and institutional scholarships (68.2% covered), career guidance & competitive exam coaching, and 428 campus recruitment offers.",
      highlight: "428 Campus Offers (76.4% Progression) & ₹1.43 Cr Scholarships",
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

      {/* Statutory IQAC Governance Portal: Dynamic Accordion */}
      <Container className="py-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/50 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary text-xs">
                  Statutory Transparency & Public Disclosure
                </Badge>
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs">
                  NAAC HEI Disclosure Compliant
                </Badge>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mt-2">
                IQAC Governance Portal & Public Compliance Repository
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-3xl">
                Official institutional records: statutory committee composition, archive of quarterly IQAC meetings with signed minutes, Action Taken Reports (ATRs) on stakeholder resolutions, and published AQAR / SSR accreditation dossiers.
              </p>
            </div>

            <Button asChild size="sm" variant="outline" className="gap-1.5 self-start sm:self-auto text-xs shrink-0">
              <Link to="/admin/naac">
                <ShieldCheck className="size-3.5 text-primary" />
                <span>Admin IQAC Console</span>
              </Link>
            </Button>
          </div>

          <Accordion
            type="multiple"
            defaultValue={["committee", "meetings", "atr", "downloads"]}
            className="w-full space-y-4"
          >
            {/* 1. Committee Composition */}
            <AccordionItem value="committee" className="border border-border/70 rounded-xl px-4 sm:px-6 bg-card shadow-xs">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Users className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-bold text-foreground">
                        Public Committee Composition (Statutory Roster 2023–2028)
                      </span>
                      <Badge variant="secondary" className="text-[10px]">
                        {initialIqacMembers.length} Statutory Members
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Statutory IQAC structure complying with NAAC guidelines (Chairperson, Coordinator, Faculty, Administrative, Industry & Alumni).
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {initialIqacMembers.map((m) => (
                    <div
                      key={m.id}
                      className="rounded-lg border border-border/60 bg-muted/20 p-3.5 space-y-2.5 flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <Badge
                            variant={m.role === "Chairperson" || m.role === "Coordinator" ? "default" : "secondary"}
                            className="text-[10px] font-semibold"
                          >
                            {m.role}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            Tenure: {m.tenure}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-foreground pt-1">
                          {m.name}
                        </h4>
                        <p className="text-[11px] font-medium text-primary">
                          {m.designation}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {m.department}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-border/40 space-y-1 text-[11px]">
                        <a
                          href={`mailto:${m.email}`}
                          className="flex items-center gap-1.5 text-muted-foreground hover:text-primary truncate"
                        >
                          <Mail className="size-3 shrink-0" />
                          <span className="truncate">{m.email}</span>
                        </a>
                        <a
                          href={`tel:${m.contact}`}
                          className="flex items-center gap-1.5 text-muted-foreground hover:text-primary"
                        >
                          <Phone className="size-3 shrink-0" />
                          <span>{m.contact}</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 2. Meetings Archive & Minutes */}
            <AccordionItem value="meetings" className="border border-border/70 rounded-xl px-4 sm:px-6 bg-card shadow-xs">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <div className="size-9 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                    <Calendar className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-bold text-foreground">
                        IQAC Meetings Archive & Signed Minutes of Meetings (MoM)
                      </span>
                      <Badge className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-[10px] border-indigo-500/20">
                        Quarterly Releases
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Chronological archive of statutory meetings, approved agendas, institutional resolutions, and signed proceedings.
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search meeting agenda, number..."
                      value={meetingSearch}
                      onChange={(e) => setMeetingSearch(e.target.value)}
                      className="pl-8 h-8 text-xs"
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Showing {filteredMeetings.length} of {initialIqacMeetings.length} statutory proceedings
                  </span>
                </div>

                <div className="space-y-3">
                  {filteredMeetings.map((m) => (
                    <Card key={m.id} className="border border-border/60 bg-muted/10 shadow-xs">
                      <CardHeader className="p-4 pb-2 border-b border-border/40">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-indigo-600 text-white font-mono text-xs">
                              {m.meetingNumber}
                            </Badge>
                            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                              <Calendar className="size-3.5 text-muted-foreground" />
                              {new Date(m.meetingDate).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[11px]">
                              {m.membersPresent.length} Members Attended
                            </Badge>
                            {m.documents && m.documents[0] && (
                              <Button
                                size="xs"
                                variant="outline"
                                asChild
                                className="gap-1 text-xs text-primary h-7"
                              >
                                <a href={m.documents[0].url} target="_blank" rel="noreferrer">
                                  <Download className="size-3" />
                                  <span>Signed Minutes PDF</span>
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-3 space-y-3 text-xs">
                        <div>
                          <span className="font-bold text-foreground text-[11px] uppercase tracking-wider text-muted-foreground">
                            Agendas Discussed:
                          </span>
                          <ul className="list-disc list-inside mt-1 space-y-0.5 text-muted-foreground">
                            {m.agenda.map((ag, i) => (
                              <li key={i}>{ag}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <span className="font-bold text-foreground text-[11px] uppercase tracking-wider text-muted-foreground">
                            Unanimous Decisions & Resolutions:
                          </span>
                          <ul className="list-disc list-inside mt-1 space-y-0.5 text-foreground font-medium">
                            {m.decisions.map((dec, i) => (
                              <li key={i}>{dec}</li>
                            ))}
                          </ul>
                        </div>

                        {m.actionItems && m.actionItems.length > 0 && (
                          <div className="pt-2 border-t border-border/40">
                            <span className="font-bold text-foreground text-[11px] uppercase tracking-wider text-muted-foreground">
                              Assigned Directives:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5">
                              {m.actionItems.map((ai, i) => (
                                <div
                                  key={i}
                                  className="p-2 rounded bg-card border border-border/50 flex items-center justify-between text-[11px]"
                                >
                                  <div>
                                    <div className="font-medium text-foreground">{ai.task}</div>
                                    <div className="text-muted-foreground text-[10px]">
                                      Assignee: {ai.assignee} · Due: {ai.deadline}
                                    </div>
                                  </div>
                                  <Badge
                                    variant={ai.status === "Done" ? "default" : "secondary"}
                                    className={`text-[9px] shrink-0 ${
                                      ai.status === "Done"
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                        : ""
                                    }`}
                                  >
                                    {ai.status}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 3. Action Taken Reports (ATR) */}
            <AccordionItem value="atr" className="border border-border/70 rounded-xl px-4 sm:px-6 bg-card shadow-xs">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <div className="size-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <CheckCircle2 className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-bold text-foreground">
                        Action Taken Reports (ATR) Releases
                      </span>
                      <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] border-emerald-500/20">
                        Verified Implementation
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Formal implementation audit following IQAC resolutions, stakeholder feedback, and academic investments.
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">Status Filter:</span>
                  {(["All", "Completed", "In Progress"] as const).map((st) => (
                    <Button
                      key={st}
                      variant={atrFilter === st ? "default" : "outline"}
                      size="xs"
                      onClick={() => setAtrFilter(st)}
                      className="text-xs h-7"
                    >
                      {st}
                    </Button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredAtrs.map((atr) => (
                    <Card key={atr.id} className="border border-border/60 bg-muted/10 shadow-xs flex flex-col justify-between">
                      <CardHeader className="p-3.5 pb-2 border-b border-border/40">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <Badge variant="outline" className="font-mono text-[10px]">
                              {atr.meetingNumber}
                            </Badge>
                            <span className="text-[11px] font-semibold text-foreground">
                              {atr.responsiblePerson}
                            </span>
                          </div>
                          <Badge
                            className={`text-[10px] ${
                              atr.status === "Completed"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                            }`}
                          >
                            {atr.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3.5 pt-2.5 space-y-2 text-xs flex-1">
                        <div>
                          <span className="font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">
                            Council Resolution / Decision:
                          </span>
                          <p className="text-foreground font-medium text-xs mt-0.5">
                            {atr.decision}
                          </p>
                        </div>
                        <div className="p-2.5 rounded bg-card border border-border/50 space-y-1">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[10px] uppercase tracking-wider flex items-center gap-1">
                            <Check className="size-3" />
                            Action Taken & Tangible Output:
                          </span>
                          <p className="text-foreground text-xs leading-relaxed">
                            {atr.actionTaken}
                          </p>
                          {atr.remarks && (
                            <p className="text-muted-foreground text-[11px] italic pt-1">
                              Note: {atr.remarks}
                            </p>
                          )}
                        </div>
                      </CardContent>
                      <div className="p-3.5 pt-0">
                        {atr.evidenceUrl && (
                          <Button
                            size="xs"
                            variant="outline"
                            asChild
                            className="w-full gap-1.5 text-xs text-primary"
                          >
                            <a href={atr.evidenceUrl} target="_blank" rel="noreferrer">
                              <Download className="size-3" />
                              <span>Download ATR Release & Proof Document</span>
                            </a>
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 4. Published AQAR & SSR Downloads */}
            <AccordionItem value="downloads" className="border border-border/70 rounded-xl px-4 sm:px-6 bg-card shadow-xs">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <div className="size-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                    <FileText className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-bold text-foreground">
                        Published AQAR, SSR & NAAC Accreditation Dossiers
                      </span>
                      <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px] border-amber-500/20">
                        Cycle 3 A+ Accredited
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Official statutory submissions acknowledged by NAAC, SSR reports, and Peer Team visit certificates.
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">Document Type:</span>
                  {(["All", "AQAR", "SSR", "Accreditation"] as const).map((cat) => (
                    <Button
                      key={cat}
                      variant={downloadCategory === cat ? "default" : "outline"}
                      size="xs"
                      onClick={() => setDownloadCategory(cat)}
                      className="text-xs h-7"
                    >
                      {cat}
                    </Button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* AQAR 2024-25 */}
                  {(downloadCategory === "All" || downloadCategory === "AQAR") && (
                    <Card className="border border-border/60 bg-muted/10 shadow-xs flex flex-col justify-between">
                      <CardHeader className="p-3.5 pb-2">
                        <div className="flex items-center justify-between">
                          <Badge className="bg-emerald-600 text-white text-[10px]">
                            AQAR 2024-25
                          </Badge>
                          <Badge variant="outline" className="text-emerald-600 text-[10px]">
                            Submitted & Acknowledged
                          </Badge>
                        </div>
                        <CardTitle className="text-sm font-bold text-foreground mt-2">
                          Annual Quality Assurance Report 2024-25
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Submitted to NAAC on 28-Nov-2025 · 100% Criteria Completion
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-3.5 pt-0 space-y-2">
                        <p className="text-xs text-muted-foreground">
                          Comprehensive report covering academic flexibility, research metrics, ERP automation, and green audits.
                        </p>
                        <Button size="xs" variant="outline" asChild className="w-full gap-1.5 text-xs text-primary">
                          <a href="/documents/naac/aqar/AQAR_Final_2024_25.pdf" target="_blank" rel="noreferrer">
                            <Download className="size-3" />
                            <span>Download Final AQAR (PDF)</span>
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* AQAR 2023-24 */}
                  {(downloadCategory === "All" || downloadCategory === "AQAR") && (
                    <Card className="border border-border/60 bg-muted/10 shadow-xs flex flex-col justify-between">
                      <CardHeader className="p-3.5 pb-2">
                        <div className="flex items-center justify-between">
                          <Badge className="bg-emerald-600 text-white text-[10px]">
                            AQAR 2023-24
                          </Badge>
                          <Badge variant="outline" className="text-emerald-600 text-[10px]">
                            Acknowledged
                          </Badge>
                        </div>
                        <CardTitle className="text-sm font-bold text-foreground mt-2">
                          Annual Quality Assurance Report 2023-24
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Submitted on 15-Dec-2024 · First AQAR of Cycle 3
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-3.5 pt-0 space-y-2">
                        <p className="text-xs text-muted-foreground">
                          Focuses on NEP 2020 LOCF adoption, 42 certificate courses, and student progression benchmarks.
                        </p>
                        <Button size="xs" variant="outline" asChild className="w-full gap-1.5 text-xs text-primary">
                          <a href="/documents/naac/aqar/AQAR_Final_2023_24.pdf" target="_blank" rel="noreferrer">
                            <Download className="size-3" />
                            <span>Download Final AQAR (PDF)</span>
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* SSR Cycle 3 */}
                  {(downloadCategory === "All" || downloadCategory === "SSR") && (
                    <Card className="border border-border/60 bg-muted/10 shadow-xs flex flex-col justify-between">
                      <CardHeader className="p-3.5 pb-2">
                        <div className="flex items-center justify-between">
                          <Badge className="bg-primary text-primary-foreground text-[10px]">
                            Cycle 3 SSR
                          </Badge>
                          <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                            Grade A+ (CGPA 3.42)
                          </Badge>
                        </div>
                        <CardTitle className="text-sm font-bold text-foreground mt-2">
                          Self Study Report (SSR) — Cycle 3
                        </CardTitle>
                        <CardDescription className="text-xs">
                          5-Year Assessment (2018–2023) · DVV Verified
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-3.5 pt-0 space-y-2">
                        <p className="text-xs text-muted-foreground">
                          Complete institutional SSR dossier submitted to NAAC with qualitative & quantitative metrics.
                        </p>
                        <Button size="xs" variant="outline" asChild className="w-full gap-1.5 text-xs text-primary">
                          <a href="/documents/naac/ssr/SSR_Cycle_3_Final.pdf" target="_blank" rel="noreferrer">
                            <Download className="size-3" />
                            <span>Download SSR Cycle 3 (PDF)</span>
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* NAAC Peer Team Visit Report & Grade Certificate */}
                  {(downloadCategory === "All" || downloadCategory === "Accreditation") && (
                    <Card className="border border-border/60 bg-muted/10 shadow-xs flex flex-col justify-between">
                      <CardHeader className="p-3.5 pb-2">
                        <div className="flex items-center justify-between">
                          <Badge className="bg-amber-600 text-white text-[10px]">
                            Cycle 3 Certificate
                          </Badge>
                          <Badge variant="outline" className="text-amber-600 text-[10px]">
                            Valid to Nov 2028
                          </Badge>
                        </div>
                        <CardTitle className="text-sm font-bold text-foreground mt-2">
                          NAAC Grade Certificate & Peer Team Report
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Peer Team Visit: 14-Oct-2023 · CGPA 3.42
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-3.5 pt-0 space-y-2">
                        <p className="text-xs text-muted-foreground">
                          Official statutory accreditation certificate issued by the National Assessment and Accreditation Council.
                        </p>
                        <Button size="xs" variant="outline" asChild className="w-full gap-1.5 text-xs text-primary">
                          <a href="/documents/naac/naac-cycle-3-certificate.pdf" target="_blank" rel="noreferrer">
                            <Download className="size-3" />
                            <span>Download Certificate & Report</span>
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Cycle 2 Archive */}
                  {(downloadCategory === "All" || downloadCategory === "Accreditation" || downloadCategory === "SSR") && (
                    <Card className="border border-border/60 bg-muted/10 shadow-xs flex flex-col justify-between">
                      <CardHeader className="p-3.5 pb-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-[10px]">
                            Cycle 2 Archive
                          </Badge>
                          <Badge variant="secondary" className="text-[10px]">
                            Grade A (CGPA 3.16)
                          </Badge>
                        </div>
                        <CardTitle className="text-sm font-bold text-foreground mt-2">
                          Cycle 2 Accreditation Certificate (2017–2022)
                        </CardTitle>
                        <CardDescription className="text-xs">
                          College with Potential for Excellence (CPE)
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-3.5 pt-0 space-y-2">
                        <p className="text-xs text-muted-foreground">
                          Historical accreditation records and Peer Team visit evaluation matrix.
                        </p>
                        <Button size="xs" variant="outline" asChild className="w-full gap-1.5 text-xs text-primary">
                          <a href="/documents/naac/naac-cycle-2-certificate.pdf" target="_blank" rel="noreferrer">
                            <Download className="size-3" />
                            <span>Download Cycle 2 Certificate</span>
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Container>

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

                {/* Metric 1.1.2 Highlights: Programme Revision (78.4% >= 70%) */}
                <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-600 text-white font-mono text-xs">Metric 1.1.2</Badge>
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs">
                          78.4% ≥ 70% Benchmark Verified
                        </Badge>
                      </div>
                      <h4 className="text-sm font-bold text-foreground mt-1">
                        Programme Revision over Last Five Years (2021 – 2026)
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Statutory Board of Studies (BoS) records ratifying syllabus modernization across 11 out of 14 offered programmes.
                      </p>
                    </div>

                    <Button variant="outline" size="sm" asChild className="text-xs gap-1 self-start sm:self-auto">
                      <Link to="/admin/naac/criteria?tab=1">
                        <span>View 1.1.2 Revision Console</span>
                        <ExternalLink className="size-3" />
                      </Link>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <div className="rounded bg-card border border-border/60 p-3 text-xs space-y-1">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Users className="size-3.5 text-primary" />
                        BoS CS & Management Minutes
                      </span>
                      <p className="text-muted-foreground text-[11px]">
                        Introduced Generative AI, Cloud DevOps, Business Analytics, and E-Commerce GST.
                      </p>
                      <Button variant="ghost" size="xs" asChild className="text-primary text-[11px] p-0 h-auto">
                        <a href={initialBosMeetings[0].minutesDocumentUrl} target="_blank" rel="noreferrer">
                          Download BoS Minutes →
                        </a>
                      </Button>
                    </div>

                    <div className="rounded bg-card border border-border/60 p-3 text-xs space-y-1">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <FileText className="size-3.5 text-purple-600" />
                        5-Year Comparative Syllabus Matrix
                      </span>
                      <p className="text-muted-foreground text-[11px]">
                        Course-by-course audit (old vs new) certifying 135 updated courses in 2025-26.
                      </p>
                      <Button variant="ghost" size="xs" asChild className="text-primary text-[11px] p-0 h-auto">
                        <a href="/documents/naac/evidence/Five_Year_Syllabus_Revision_Comparative_Matrix_2021_2026.pdf" target="_blank" rel="noreferrer">
                          View Comparative Matrix →
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Metric 1.2.1 Highlights: Choice Based Credit System (CBCS) & Academic Flexibility */}
                <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-indigo-600 text-white font-mono text-xs">Metric 1.2.1</Badge>
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs">
                          100% CBCS Adoption Across 14 Programmes
                        </Badge>
                      </div>
                      <h4 className="text-sm font-bold text-foreground mt-1">
                        Choice Based Credit System (CBCS) & Elective Course Flexibility
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Statutory UGC guidelines & Utkal University regulations governing Core, Discipline Specific (DSE), Generic Elective (GE), and Skill Enhancement (SEC) courses.
                      </p>
                    </div>

                    <Button variant="outline" size="sm" asChild className="text-xs gap-1 self-start sm:self-auto">
                      <Link to="/admin/naac/criteria?tab=1">
                        <span>View 1.2.1 CBCS Console</span>
                        <ExternalLink className="size-3" />
                      </Link>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    <div className="rounded bg-card border border-border/60 p-3 text-xs space-y-1">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Award className="size-3.5 text-indigo-600" />
                        Statutory Notifications
                      </span>
                      <p className="text-muted-foreground text-[11px]">
                        UGC CBCS Gazette 2015 & Utkal Univ NEP-CBCS Notification 2023.
                      </p>
                      <Button variant="ghost" size="xs" asChild className="text-primary text-[11px] p-0 h-auto">
                        <a href={initialUniversityNotifications[0].gazetteOrderUrl} target="_blank" rel="noreferrer">
                          Download UGC Gazette →
                        </a>
                      </Button>
                    </div>

                    <div className="rounded bg-card border border-border/60 p-3 text-xs space-y-1">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <BookOpen className="size-3.5 text-emerald-600" />
                        Interdisciplinary Electives
                      </span>
                      <p className="text-muted-foreground text-[11px]">
                        6 cross-departmental electives with 1,196 student enrollments.
                      </p>
                      <Button variant="ghost" size="xs" asChild className="text-primary text-[11px] p-0 h-auto">
                        <a href="/documents/naac/evidence/Interdisciplinary_Elective_Enrollment_Summary_2025_26.pdf" target="_blank" rel="noreferrer">
                          View Enrollment Register →
                        </a>
                      </Button>
                    </div>

                    <div className="rounded bg-card border border-border/60 p-3 text-xs space-y-1">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Sparkles className="size-3.5 text-amber-600" />
                        SWAYAM & MOOCs Credit
                      </span>
                      <p className="text-muted-foreground text-[11px]">
                        Up to 20% credits transferable through NPTEL / SWAYAM national portal.
                      </p>
                      <Button variant="ghost" size="xs" asChild className="text-primary text-[11px] p-0 h-auto">
                        <a href={initialUniversityNotifications[2].gazetteOrderUrl} target="_blank" rel="noreferrer">
                          Credit Transfer Policy →
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Metric 1.2.2 Highlights: Certificate & Value-Added Courses */}
                <div className="rounded-lg border border-teal-500/30 bg-teal-500/5 p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-teal-600 text-white font-mono text-xs">Metric 1.2.2</Badge>
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs">
                          42 Courses (1,840 Students) Verified
                        </Badge>
                      </div>
                      <h4 className="text-sm font-bold text-foreground mt-1">
                        Certificate & Value-Added Courses with Minimum 30 Contact Hours
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Transferable skills, industry micro-certifications, and online MOOCs offered via SWAYAM/NPTEL (LC ID: 4128), AWS Academy, and Cambridge English.
                      </p>
                    </div>

                    <Button variant="outline" size="sm" asChild className="text-xs gap-1 self-start sm:self-auto">
                      <Link to="/admin/naac/criteria?tab=1">
                        <span>View 1.2.2 Courses Console</span>
                        <ExternalLink className="size-3" />
                      </Link>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    <div className="rounded bg-card border border-border/60 p-3 text-xs space-y-1">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <BookOpen className="size-3.5 text-teal-600" />
                        42 Course Directory
                      </span>
                      <p className="text-muted-foreground text-[11px]">
                        100% compliance with NAAC guideline requiring ≥30 contact hours.
                      </p>
                      <Button variant="ghost" size="xs" asChild className="text-primary text-[11px] p-0 h-auto">
                        <a href="/documents/naac/evidence/Consolidated_42_Value_Added_Courses_Catalog_2021_2026.pdf" target="_blank" rel="noreferrer">
                          Course Brochures & Catalog →
                        </a>
                      </Button>
                    </div>

                    <div className="rounded bg-card border border-border/60 p-3 text-xs space-y-1">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Users className="size-3.5 text-blue-600" />
                        1,840 Enrolled Students
                      </span>
                      <p className="text-muted-foreground text-[11px]">
                        95.2% certification rate with verified attendance (≥75%) logs.
                      </p>
                      <Button variant="ghost" size="xs" asChild className="text-primary text-[11px] p-0 h-auto">
                        <a href="/documents/naac/evidence/Master_Enrolment_Register_1840_Students_Value_Added.xlsx" target="_blank" rel="noreferrer">
                          Enrolment Register (XLSX) →
                        </a>
                      </Button>
                    </div>

                    <div className="rounded bg-card border border-border/60 p-3 text-xs space-y-1">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Sparkles className="size-3.5 text-purple-600" />
                        NPTEL Local Chapter
                      </span>
                      <p className="text-muted-foreground text-[11px]">
                        LC ID: 4128 with 364 MOOC completions & credit transfers.
                      </p>
                      <Button variant="ghost" size="xs" asChild className="text-primary text-[11px] p-0 h-auto">
                        <a href="/documents/naac/evidence/SWAYAM_NPTEL_Institutional_Chapter_Dossier_2025_26.pdf" target="_blank" rel="noreferrer">
                          View Chapter Dossier →
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Metric 1.3.1 Highlights: Crosscutting Issues Integration */}
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-600 text-white font-mono text-xs">Metric 1.3.1</Badge>
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs">
                          28 Courses Mapped • 100% UG Covered
                        </Badge>
                      </div>
                      <h4 className="text-sm font-bold text-foreground mt-1">
                        Integration of Crosscutting Issues (Gender, Environment, Values & Ethics)
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Statutory curriculum mapping with highlighted syllabus units, supported by ICC, Eco Club, NSS, and Research Ethics Board.
                      </p>
                    </div>

                    <Button variant="outline" size="sm" asChild className="text-xs gap-1 self-start sm:self-auto">
                      <Link to="/admin/naac/criteria?tab=1">
                        <span>View 1.3.1 Crosscutting Console</span>
                        <ExternalLink className="size-3" />
                      </Link>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-1">
                    <div className="rounded bg-card border border-border/60 p-3 text-xs space-y-1">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Heart className="size-3.5 text-rose-600" />
                        Gender Equity (6 Courses)
                      </span>
                      <p className="text-muted-foreground text-[11px]">
                        POSH Act 2013, Women in Literature, Grassroots Panchayati Raj & Inclusive Workplaces.
                      </p>
                      <Button variant="ghost" size="xs" asChild className="text-primary text-[11px] p-0 h-auto">
                        <a href="/documents/naac/evidence/Crosscutting_Issues_Curriculum_Mapping_Matrix_2025_26.pdf" target="_blank" rel="noreferrer">
                          View Syllabus Units →
                        </a>
                      </Button>
                    </div>

                    <div className="rounded bg-card border border-border/60 p-3 text-xs space-y-1">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Leaf className="size-3.5 text-emerald-600" />
                        Environment (8 Courses)
                      </span>
                      <p className="text-muted-foreground text-[11px]">
                        Compulsory AECC Environmental Studies, Green Chemistry, Renewable Energy & Carbon Accounting.
                      </p>
                      <Button variant="ghost" size="xs" asChild className="text-primary text-[11px] p-0 h-auto">
                        <a href="/documents/naac/evidence/Sample_Color_Coded_Crosscutting_Syllabi_Excerpts.pdf" target="_blank" rel="noreferrer">
                          Green Syllabi Excerpts →
                        </a>
                      </Button>
                    </div>

                    <div className="rounded bg-card border border-border/60 p-3 text-xs space-y-1">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Users className="size-3.5 text-amber-600" />
                        Human Values (7 Courses)
                      </span>
                      <p className="text-muted-foreground text-[11px]">
                        Universal Human Values (UHV), Indian Constitution, Gandhian Peace & Digital Civics.
                      </p>
                      <Button variant="ghost" size="xs" asChild className="text-primary text-[11px] p-0 h-auto">
                        <a href="/documents/naac/evidence/Code_of_Conduct_and_Institutional_Policies_Handbook.pdf" target="_blank" rel="noreferrer">
                          Values & Ethics Charter →
                        </a>
                      </Button>
                    </div>

                    <div className="rounded bg-card border border-border/60 p-3 text-xs space-y-1">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Scale className="size-3.5 text-blue-600" />
                        Ethics & IPR (7 Courses)
                      </span>
                      <p className="text-muted-foreground text-[11px]">
                        DPDP Act 2023, ACM Software Ethics, Turnitin Anti-Plagiarism & Corporate Governance.
                      </p>
                      <Button variant="ghost" size="xs" asChild className="text-primary text-[11px] p-0 h-auto">
                        <a href="/documents/naac/evidence/CoCurricular_Crosscutting_Activities_Report_2025_26.pdf" target="_blank" rel="noreferrer">
                          Activity Reports →
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Metric 1.4.1 Highlights: Stakeholder Feedback & Action Taken Reports (ATRs) */}
                <div id="feedback" className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-sky-600 text-white font-mono text-xs">Metric 1.4.1</Badge>
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs">
                          Option A Verified (All 5 Stakeholder Groups)
                        </Badge>
                      </div>
                      <h4 className="text-sm font-bold text-foreground mt-1">
                        Stakeholder Feedback System & Public Action Taken Reports (ATRs)
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Statutory 5-stakeholder feedback (Students, Teachers, Employers, Alumni, Parents) with 2,582 responses tabulated and annual ATRs hosted on the institutional portal.
                      </p>
                    </div>

                    <Button variant="outline" size="sm" asChild className="text-xs gap-1 self-start sm:self-auto">
                      <Link to="/admin/naac/feedback">
                        <span>View 1.4.1 Feedback Console</span>
                        <ExternalLink className="size-3" />
                      </Link>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    <div className="rounded bg-card border border-border/60 p-3 text-xs space-y-1">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Users className="size-3.5 text-sky-600" />
                        2,582 Responses Tabulated
                      </span>
                      <p className="text-muted-foreground text-[11px]">
                        Overall Satisfaction: 4.44 / 5.00 (Students 1,420, Parents 620, Alumni 380).
                      </p>
                      <Button variant="ghost" size="xs" asChild className="text-primary text-[11px] p-0 h-auto">
                        <a href="/documents/naac/evidence/Curriculum_Feedback_ATR_2025_26.pdf" target="_blank" rel="noreferrer">
                          Statistical Feedback Report →
                        </a>
                      </Button>
                    </div>

                    <div className="rounded bg-card border border-border/60 p-3 text-xs space-y-1">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <FileText className="size-3.5 text-purple-600" />
                        Published ATRs (5 Years)
                      </span>
                      <p className="text-muted-foreground text-[11px]">
                        Formal resolutions ratified by Governing Body from 2021-22 to 2025-26.
                      </p>
                      <Button variant="ghost" size="xs" asChild className="text-primary text-[11px] p-0 h-auto">
                        <a href="/documents/naac/evidence/Curriculum_Feedback_ATR_2025_26.pdf" target="_blank" rel="noreferrer">
                          Download 2025-26 ATR PDF →
                        </a>
                      </Button>
                    </div>

                    <div className="rounded bg-card border border-border/60 p-3 text-xs space-y-1">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Globe className="size-3.5 text-emerald-600" />
                        Option A Full Compliance
                      </span>
                      <p className="text-muted-foreground text-[11px]">
                        Feedback collected, analysed, action implemented & hosted on website.
                      </p>
                      <Button variant="ghost" size="xs" asChild className="text-primary text-[11px] p-0 h-auto">
                        <Link to="/admin/naac/feedback">
                          Audit Trail & Analysis →
                        </Link>
                      </Button>
                    </div>
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

          {activeCriterion === 2 && (
            <div className="space-y-4">
              <Card className="border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/50 via-card to-sky-50/40 dark:from-indigo-950/20 dark:via-card dark:to-sky-950/20 shadow-xs">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-indigo-600 text-white text-[11px]">Criterion 2</Badge>
                        <Badge variant="outline" className="border-indigo-300 text-indigo-700 dark:text-indigo-300 text-[11px]">
                          Teaching-Learning and Evaluation
                        </Badge>
                        <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20 text-[11px]">
                          Score: 3.82 / 4.00
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-bold text-foreground mt-2">
                        Student Enrolment, Profile & Experiential Pedagogy
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Centralized merit-based admissions through SAMS Odisha, full statutory reservation compliance, and 1:15 faculty-student mentor ratio.
                      </CardDescription>
                    </div>
                    <Button asChild size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700 text-xs gap-1.5 shrink-0">
                      <Link to="/admin/naac/criteria?tab=2">
                        <span>Criterion 2 Hub</span>
                        <ExternalLink className="size-3" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Metric 2.1.1 Highlight Card */}
                  <div className="rounded-lg border border-indigo-200/80 dark:border-indigo-900/50 bg-background p-4 shadow-xs">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-indigo-400 text-indigo-700 dark:text-indigo-300 font-mono text-[10px]">
                            Metric 2.1.1
                          </Badge>
                          <span className="text-xs font-bold text-foreground">
                            Student Enrolment & Reservation Compliance (DVV Certified)
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground max-w-2xl">
                          Enrolment percentage against sanctioned seats over 5 assessment years (2021-22 to 2025-26):{" "}
                          <strong>3,122 admitted / 3,300 sanctioned = 94.6%</strong> (NAAC high benchmark slab &ge; 90%).
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-center p-2 rounded-md bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
                          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">94.6%</div>
                          <div className="text-[10px] text-muted-foreground">5-Yr Fill Rate</div>
                        </div>
                        <div className="text-center p-2 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50">
                          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">100%</div>
                          <div className="text-[10px] text-muted-foreground">State Quota Adherence</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2 rounded bg-muted/30">
                        <span className="text-muted-foreground text-[11px]">Sanctioned Seats (5 Yrs):</span>
                        <div className="font-bold text-foreground text-sm">3,300 Seats</div>
                      </div>
                      <div className="p-2 rounded bg-muted/30">
                        <span className="text-muted-foreground text-[11px]">Admitted Students (5 Yrs):</span>
                        <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">3,122 Students</div>
                      </div>
                      <div className="p-2 rounded bg-muted/30">
                        <span className="text-muted-foreground text-[11px]">Centralized SAMS:</span>
                        <div className="font-bold text-foreground text-sm">Govt. of Odisha Portal</div>
                      </div>
                      <div className="p-2 rounded bg-muted/30">
                        <span className="text-muted-foreground text-[11px]">Reserved Quotas:</span>
                        <div className="font-bold text-foreground text-sm">SC/ST/OBC/SEBC/PwD</div>
                      </div>
                    </div>
                  </div>

                  {/* Metric 2.2.1 Highlight Card: Faculty Ratio */}
                  <div className="rounded-lg border border-blue-200/80 dark:border-blue-900/50 bg-background p-4 shadow-xs">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-blue-400 text-blue-700 dark:text-blue-300 font-mono text-[10px]">
                            Metric 2.2.1
                          </Badge>
                          <span className="text-xs font-bold text-foreground">
                            Student – Full Time Teacher Ratio (DVV Certified 16:1)
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground max-w-2xl">
                          Total active students across all degree cohorts divided by total approved full-time faculty on institutional payroll:{" "}
                          <strong>2,160 students / 135 teachers = 16:1</strong> (Exceeds UGC/AICTE norms &le; 20:1).
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-center p-2 rounded-md bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
                          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">16:1</div>
                          <div className="text-[10px] text-muted-foreground">Student:Teacher</div>
                        </div>
                        <div className="text-center p-2 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50">
                          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">60.7%</div>
                          <div className="text-[10px] text-muted-foreground">Ph.D. Qualified</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2 rounded bg-muted/30">
                        <span className="text-muted-foreground text-[11px]">Enrolled Students:</span>
                        <div className="font-bold text-foreground text-sm">2,160 Students</div>
                      </div>
                      <div className="p-2 rounded bg-muted/30">
                        <span className="text-muted-foreground text-[11px]">Full-Time Faculty:</span>
                        <div className="font-bold text-blue-600 dark:text-blue-400 text-sm">135 Teachers</div>
                      </div>
                      <div className="p-2 rounded bg-muted/30">
                        <span className="text-muted-foreground text-[11px]">Proctorial Ratio:</span>
                        <div className="font-bold text-foreground text-sm">1:16 Mentor-Mentee</div>
                      </div>
                      <div className="p-2 rounded bg-muted/30">
                        <span className="text-muted-foreground text-[11px]">Doctorate Holders:</span>
                        <div className="font-bold text-amber-600 dark:text-amber-400 text-sm">82 Ph.D. Faculty</div>
                      </div>
                    </div>
                  </div>

                  {/* Metric 2.3.1 Highlight Card: Student-Centric Pedagogy */}
                  <div className="rounded-lg border border-teal-200/80 dark:border-teal-900/50 bg-background p-4 shadow-xs">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-teal-400 text-teal-700 dark:text-teal-300 font-mono text-[10px]">
                            Metric 2.3.1
                          </Badge>
                          <span className="text-xs font-bold text-foreground">
                            Student-Centric Learning Methodologies & Industrial Field Expeditions
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground max-w-2xl">
                          Experiential learning through 18 documented industrial field visits (Tata Steel, Infosys, NALCO, CSIR-IMMT) with geo-tagged verification, multidisciplinary capstones, and participative learning.
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-center p-2 rounded-md bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/50">
                          <div className="text-2xl font-black text-teal-600 dark:text-teal-400">18</div>
                          <div className="text-[10px] text-muted-foreground">Field Visits</div>
                        </div>
                        <div className="text-center p-2 rounded-md bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/50">
                          <div className="text-2xl font-black text-sky-600 dark:text-sky-400">1,048+</div>
                          <div className="text-[10px] text-muted-foreground">Students Benefitted</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2 rounded bg-muted/30">
                        <span className="text-muted-foreground text-[11px]">Geo-Tagged Photos:</span>
                        <div className="font-bold text-foreground text-sm">100% Verified</div>
                      </div>
                      <div className="p-2 rounded bg-muted/30">
                        <span className="text-muted-foreground text-[11px]">Capstone Projects:</span>
                        <div className="font-bold text-teal-600 dark:text-teal-400 text-sm">24 Industry Cases</div>
                      </div>
                      <div className="p-2 rounded bg-muted/30">
                        <span className="text-muted-foreground text-[11px]">Collaborative Hackathons:</span>
                        <div className="font-bold text-foreground text-sm">Annual 36-Hr Event</div>
                      </div>
                      <div className="p-2 rounded bg-muted/30">
                        <span className="text-muted-foreground text-[11px]">Peer Tutoring Circles:</span>
                        <div className="font-bold text-foreground text-sm">Calculus & Mechanics</div>
                      </div>
                    </div>
                  </div>

                  {/* Metric 2.3.2 Highlight Card: ICT Classrooms & LMS */}
                  <div className="rounded-lg border border-cyan-200/80 dark:border-cyan-900/50 bg-background p-4 shadow-xs">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-cyan-400 text-cyan-700 dark:text-cyan-300 font-mono text-[10px]">
                            Metric 2.3.2
                          </Badge>
                          <span className="text-xs font-bold text-foreground">
                            ICT-Enabled Classrooms & EduPlatform LMS Utilization (89.5% ICT)
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground max-w-2xl">
                          Smart classrooms with 75-inch interactive flat panels, video lecture capture studios, campus-wide Wi-Fi 6, 142 course portals on EduPlatform LMS with 100% faculty engagement.
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-center p-2 rounded-md bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-900/50">
                          <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400">89.5%</div>
                          <div className="text-[10px] text-muted-foreground">ICT Classrooms</div>
                        </div>
                        <div className="text-center p-2 rounded-md bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
                          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">142</div>
                          <div className="text-[10px] text-muted-foreground">LMS Courses</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2 rounded bg-muted/30">
                        <span className="text-muted-foreground text-[11px]">Smart Classrooms:</span>
                        <div className="font-bold text-foreground text-sm">34 / 38 Spaces</div>
                      </div>
                      <div className="p-2 rounded bg-muted/30">
                        <span className="text-muted-foreground text-[11px]">Teacher Adoption:</span>
                        <div className="font-bold text-cyan-600 dark:text-cyan-400 text-sm">100% (135/135)</div>
                      </div>
                      <div className="p-2 rounded bg-muted/30">
                        <span className="text-muted-foreground text-[11px]">Flipped Modules:</span>
                        <div className="font-bold text-foreground text-sm">42 E-Lectures</div>
                      </div>
                      <div className="p-2 rounded bg-muted/30">
                        <span className="text-muted-foreground text-[11px]">E-Library Access:</span>
                        <div className="font-bold text-foreground text-sm">DELNET, IEEE, NDLI</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeCriterion !== 1 && activeCriterion !== 2 && (
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
                  Current participation: 1,840 responses with an average institutional satisfaction score of 3.78 / 4.00 (94.5%).
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

