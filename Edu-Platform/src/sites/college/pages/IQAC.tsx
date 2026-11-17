import { useMemo, useState } from "react";
import {
  GraduationCap,
  Users,
  Calendar,
  FileText,
  ClipboardList,
  BookOpen,
  ShieldCheck,
  Search,
  Download,
  Mail,
  Phone,
  Check,
  ExternalLink,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Hero } from "@/components/sections/Hero";
import { AccreditationStrip } from "@/components/sections/AccreditationStrip";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { AvatarInitials } from "@/components/common/AvatarInitials";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { collegeHeroUrl } from "@/mocks/data/images";
import { accreditationBadges } from "@/mocks/data/accreditation";
import { naacDocumentDirectory, type NaacDirectorySection } from "@/mocks/data/naac/documentDirectory";
import {
  initialIqacMembers,
  initialIqacMeetings,
  initialIqacActionTaken,
} from "@/mocks/data/naac/iqac";

const SECTION_ICONS: Record<NaacDirectorySection["id"], typeof Users> = {
  iqac: Users,
  aqar: FileText,
  iiqa: ClipboardList,
  ssr: BookOpen,
  dvv: ShieldCheck,
};

export default function CollegeIQAC() {
  const [meetingSearch, setMeetingSearch] = useState("");
  const [atrFilter, setAtrFilter] = useState<"All" | "Completed" | "In Progress">("All");

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
    return initialIqacActionTaken.filter((a) => (atrFilter === "All" ? true : a.status === atrFilter));
  }, [atrFilter]);

  const chairperson = initialIqacMembers.find((m) => m.role === "Chairperson");
  const coordinator = initialIqacMembers.find((m) => m.role === "Coordinator");

  return (
    <>
      <Hero variant="compact" title="IQAC, NAAC & Quality Assurance" imageUrl={collegeHeroUrl(1)} />
      <Breadcrumbs items={[{ label: "Home", href: "/college" }, { label: "IQAC / NAAC" }]} />

      <AccreditationStrip items={accreditationBadges} tone="surface" />

      {/* About / Genesis / Vision, with featured Chairperson & Coordinator */}
      <section className="bg-surface">
        <Container className="grid grid-cols-1 gap-10 py-14 sm:py-16 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="text-primary text-xs font-semibold tracking-wider uppercase">About</p>
            <div className="text-muted-foreground mt-4 max-w-2xl space-y-4 text-base leading-relaxed">
              <p>
                In pursuance of its action plan for performance evaluation, assessment and accreditation, NAAC
                proposes that every accredited institution establish an Internal Quality Assurance Cell (IQAC) as a
                post-accreditation quality-sustenance measure. Since quality enhancement is a continuous process, the
                IQAC becomes part of the institution&rsquo;s own system, channelling every effort toward conscious,
                consistent and catalytic improvement in overall academic and administrative performance.
              </p>
            </div>

            <h3 className="text-foreground mt-6 text-base font-bold">Genesis of IQAC at Our College</h3>
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
              The Internal Quality Assurance Cell (IQAC) of Our College was established on 10 January 2023, with the
              committee reconstituted periodically as per NAAC guidelines.
            </p>

            <h3 className="text-foreground mt-5 text-base font-bold">Vision</h3>
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
              To act as a catalyst for continuous improvement in teaching, research, infrastructure and student
              support &mdash; institutionalizing best practices through periodic review, and building a quality
              culture that sustains well beyond each accreditation cycle.
            </p>
          </div>

          <div className="space-y-6">
            {chairperson && (
              <div className="text-center">
                <AvatarInitials name={chairperson.name} size="2xl" className="mx-auto" />
                <p className="text-foreground mt-3 text-sm font-bold">{chairperson.name}</p>
                <p className="text-muted-foreground text-xs">{chairperson.designation}</p>
                <p className="text-primary mt-0.5 text-xs font-semibold">Chairperson, IQAC</p>
              </div>
            )}
            {coordinator && (
              <div className="text-center">
                <AvatarInitials name={coordinator.name} size="2xl" className="mx-auto" />
                <p className="text-foreground mt-3 text-sm font-bold">{coordinator.name}</p>
                <p className="text-muted-foreground text-xs">{coordinator.designation}</p>
                <p className="text-primary mt-0.5 text-xs font-semibold">Coordinator, IQAC</p>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Document Directory — sidebar + per-category downloads, matching the official NAAC disclosure page format */}
      <Container className="py-10 sm:py-12">
        <div className="mb-6 flex flex-col gap-2 border-b border-border/50 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary text-xs">
              Statutory Public Disclosure
            </Badge>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              National Assessment and Accreditation Council (NAAC)
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Official institutional submissions published for public access, per NAAC's HEI disclosure requirements.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="gap-1.5 self-start text-xs sm:self-auto">
            <Link to="/admin/naac">
              <ShieldCheck className="size-3.5 text-primary" />
              <span>Admin IQAC Console</span>
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
          {/* Sidebar nav */}
          <nav className="flex gap-2 overflow-x-auto pb-2 lg:sticky lg:top-24 lg:h-fit lg:flex-col lg:overflow-visible lg:pb-0">
            {naacDocumentDirectory.map((section) => {
              const Icon = SECTION_ICONS[section.id];
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors lg:shrink"
                >
                  <Icon className="size-4" />
                  <span>{section.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Stacked category sections */}
          <div className="space-y-12">
            {naacDocumentDirectory.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-28">
                <h3 className="text-lg font-bold text-foreground sm:text-xl">{section.heading}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {section.documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="border-border bg-card hover:border-primary/40 hover:shadow-md flex flex-col items-center gap-3 rounded-xl border p-6 text-center transition-all"
                    >
                      <div className="bg-primary/10 text-primary flex size-14 items-center justify-center rounded-full">
                        <GraduationCap className="size-7" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{doc.title}</p>
                        <p className="text-muted-foreground mt-1 text-xs">{doc.subtitle}</p>
                      </div>
                    </a>
                  ))}
                </div>

                {section.id === "iqac" && (
                  <div className="mt-8 space-y-8">
                    {/* Committee */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-foreground">Statutory Committee Composition</h4>
                        <Badge variant="secondary" className="text-[10px]">
                          {initialIqacMembers.length} Members
                        </Badge>
                      </div>
                      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {initialIqacMembers.map((m) => (
                          <div key={m.id} className="border-border/60 bg-muted/20 flex flex-col justify-between gap-2.5 rounded-lg border p-3.5">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between gap-1">
                                <Badge variant={m.role === "Chairperson" || m.role === "Coordinator" ? "default" : "secondary"} className="text-[10px] font-semibold">
                                  {m.role}
                                </Badge>
                                <span className="text-muted-foreground font-mono text-[10px]">{m.tenure}</span>
                              </div>
                              <h5 className="pt-1 text-xs font-bold text-foreground sm:text-sm">{m.name}</h5>
                              <p className="text-primary text-[11px] font-medium">{m.designation}</p>
                              <p className="text-muted-foreground text-[11px]">{m.department}</p>
                            </div>
                            <div className="border-border/40 space-y-1 border-t pt-2 text-[11px]">
                              <a href={`mailto:${m.email}`} className="text-muted-foreground hover:text-primary flex items-center gap-1.5 truncate">
                                <Mail className="size-3 shrink-0" />
                                <span className="truncate">{m.email}</span>
                              </a>
                              <a href={`tel:${m.contact}`} className="text-muted-foreground hover:text-primary flex items-center gap-1.5">
                                <Phone className="size-3 shrink-0" />
                                <span>{m.contact}</span>
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Meetings */}
                    <div>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h4 className="text-sm font-bold text-foreground">Meetings Archive & Signed Minutes</h4>
                        <div className="relative w-full sm:w-72">
                          <Search className="text-muted-foreground absolute left-2.5 top-2.5 size-3.5" />
                          <Input
                            placeholder="Search meeting agenda, number…"
                            value={meetingSearch}
                            onChange={(e) => setMeetingSearch(e.target.value)}
                            className="h-8 pl-8 text-xs"
                          />
                        </div>
                      </div>
                      <div className="mt-3 space-y-3">
                        {filteredMeetings.map((m) => (
                          <Card key={m.id} className="border-border/60 bg-muted/10 shadow-xs">
                            <CardHeader className="border-border/40 border-b p-4 pb-2">
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge className="bg-indigo-600 font-mono text-xs text-white">{m.meetingNumber}</Badge>
                                  <span className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                                    <Calendar className="text-muted-foreground size-3.5" />
                                    {new Date(m.meetingDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                                  </span>
                                </div>
                                {m.documents && m.documents[0] && (
                                  <Button size="xs" variant="outline" asChild className="h-7 gap-1 text-xs text-primary">
                                    <a href={m.documents[0].url} target="_blank" rel="noreferrer">
                                      <Download className="size-3" />
                                      <span>Signed Minutes PDF</span>
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-2 p-4 pt-3 text-xs">
                              <ul className="text-muted-foreground list-inside list-disc space-y-0.5">
                                {m.agenda.map((ag, i) => (
                                  <li key={i}>{ag}</li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* ATR */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-foreground">Action Taken Reports (ATR)</h4>
                        {(["All", "Completed", "In Progress"] as const).map((st) => (
                          <Button key={st} variant={atrFilter === st ? "default" : "outline"} size="xs" onClick={() => setAtrFilter(st)} className="h-7 text-xs">
                            {st}
                          </Button>
                        ))}
                      </div>
                      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                        {filteredAtrs.map((atr) => (
                          <Card key={atr.id} className="border-border/60 bg-muted/10 flex flex-col justify-between shadow-xs">
                            <CardHeader className="border-border/40 border-b p-3.5 pb-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-foreground text-[11px] font-semibold">{atr.responsiblePerson}</span>
                                <Badge
                                  className={cn(
                                    "text-[10px]",
                                    atr.status === "Completed"
                                      ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                      : "border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
                                  )}
                                >
                                  {atr.status}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-2 p-3.5 pt-2.5 text-xs">
                              <p className="text-foreground font-medium">{atr.decision}</p>
                              <div className="bg-card border-border/50 space-y-1 rounded border p-2.5">
                                <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                  <Check className="size-3" />
                                  Action Taken
                                </span>
                                <p className="text-foreground text-xs leading-relaxed">{atr.actionTaken}</p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      </Container>

      {/* Link out to the full criterion-wise data management console */}
      <Container className="pb-14">
        <Card className="border-primary/20 bg-primary/5 shadow-xs">
          <CardContent className="flex flex-col items-center gap-3 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <CardTitle className="text-base font-bold text-foreground">Explore the Seven NAAC Criteria in Detail</CardTitle>
              <p className="text-muted-foreground mt-1 text-sm">
                Criterion-wise metrics, evidence repository, and statutory compliance documentation.
              </p>
            </div>
            <Button asChild className="shrink-0 gap-1.5">
              <Link to="/admin/naac/criteria">
                <Award className="size-4" />
                <span>View Criteria Data</span>
                <ExternalLink className="size-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
