import { Link } from "react-router-dom";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Download,
  FileCheck2,
  FileText,
  Landmark,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Building,
} from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { collegeHeroUrl } from "@/mocks/data/images";
import { initialAccreditationCycles } from "@/mocks/data/naac/accreditation";
import { initialSsrRecord } from "@/mocks/data/naac/aqar";
import { naacDocumentDirectory } from "@/mocks/data/naac/documentDirectory";

export default function CollegeAccreditationSsr() {
  const ssrDocs = naacDocumentDirectory.find((s) => s.id === "ssr")?.documents ?? [];
  const iiqaDocs = naacDocumentDirectory.find((s) => s.id === "iiqa")?.documents ?? [];
  const dvvDocs = naacDocumentDirectory.find((s) => s.id === "dvv")?.documents ?? [];

  return (
    <>
      <Hero
        variant="compact"
        title="NAAC Accreditation & Self Study Report (SSR)"
        imageUrl={collegeHeroUrl(2)}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/college" },
          { label: "Quality (IQAC / NAAC)", href: "/college/iqac" },
          { label: "Accreditation & SSR" },
        ]}
      />

      {/* Main Dossier Banner */}
      <section className="bg-gradient-to-b from-primary/5 via-background to-background py-10 sm:py-14 border-b border-border/60">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                <Sparkles className="size-3.5" />
                <span>National Assessment and Accreditation Council (NAAC)</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-heading">
                Accredited with <span className="text-primary font-black">Grade "A+"</span> · CGPA 3.42
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl">
                Our College is recognized as an autonomous premier institution committed to academic excellence,
                pioneering research, sustainable campus governance, and societal empowerment. Accredited in Cycle 3
                by the National Assessment and Accreditation Council (NAAC), Bengaluru, India.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground/80 bg-muted/60 px-3 py-2 rounded-lg border border-border/60">
                  <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Valid Until: 17 November 2028</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground/80 bg-muted/60 px-3 py-2 rounded-lg border border-border/60">
                  <Landmark className="size-4 text-primary" />
                  <span>AISHE Code: C-39281</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground/80 bg-muted/60 px-3 py-2 rounded-lg border border-border/60">
                  <Award className="size-4 text-amber-500" />
                  <span>UGC Autonomous Status 2(f) & 12(B)</span>
                </div>
              </div>
            </div>

            {/* Accreditation Badge Card */}
            <div className="lg:col-span-4">
              <Card className="border-2 border-primary/20 shadow-lg bg-card/80 backdrop-blur-xs relative overflow-hidden">
                <div className="absolute -right-8 -top-8 size-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
                <CardHeader className="text-center pb-2">
                  <Badge variant="outline" className="mx-auto border-primary/30 text-primary font-bold text-xs uppercase px-3 py-0.5 mb-2">
                    Cycle 3 Accreditation
                  </Badge>
                  <div className="size-20 mx-auto rounded-2xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/30 font-black text-3xl font-heading mb-2">
                    A+
                  </div>
                  <CardTitle className="text-xl font-bold">NAAC Peer Team Score</CardTitle>
                  <CardDescription className="text-sm font-semibold text-foreground">
                    Cumulative Grade Point Average: <span className="text-primary text-base font-extrabold">3.42</span> / 4.00
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-2 text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-border/50">
                    <span className="text-muted-foreground">Accreditation Body</span>
                    <span className="font-bold">NAAC, UGC India</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-border/50">
                    <span className="text-muted-foreground">Assessment Date</span>
                    <span className="font-semibold">18 November 2023</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-border/50">
                    <span className="text-muted-foreground">SSR Clearance</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">100% DVV Verified</span>
                  </div>
                  <Button asChild className="w-full mt-2 gap-1.5" size="sm">
                    <a href="/documents/naac/naac-cycle-3-certificate.pdf" target="_blank" rel="noopener noreferrer">
                      <Download className="size-3.5" />
                      <span>Download NAAC Certificate (PDF)</span>
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* Multi-Cycle Accreditation History */}
      <section className="py-14 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="Institutional Progression"
            title="NAAC Multi-Cycle Accreditation Journey"
            description="Our College has undergone continuous statutory quality assessment through three successive cycles of NAAC accreditation."
          />

          <div className="mt-8">
            <Tabs defaultValue="cycle-3" className="w-full">
              <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-8 h-11">
                <TabsTrigger value="cycle-3" className="font-bold text-xs sm:text-sm">
                  Cycle 3 (2023–28)
                </TabsTrigger>
                <TabsTrigger value="cycle-2" className="font-bold text-xs sm:text-sm">
                  Cycle 2 (2017–22)
                </TabsTrigger>
                <TabsTrigger value="cycle-1" className="font-bold text-xs sm:text-sm">
                  Cycle 1 (2011–16)
                </TabsTrigger>
              </TabsList>

              {initialAccreditationCycles.map((cycle) => (
                <TabsContent key={cycle.id} value={cycle.id} className="focus:outline-hidden">
                  <Card className="border border-border/80 shadow-xs">
                    <CardHeader className="bg-muted/30 border-b border-border/60">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-primary hover:bg-primary/90 font-bold">
                              Cycle {cycle.cycleNumber}
                            </Badge>
                            <span className="text-sm font-semibold text-muted-foreground">
                              Accredited Status: {cycle.status}
                            </span>
                          </div>
                          <CardTitle className="text-xl sm:text-2xl font-bold mt-2 font-heading">
                            Grade {cycle.grade} · CGPA {cycle.cgpa.toFixed(2)} on 7-Point Scale
                          </CardTitle>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Accreditation Period</p>
                          <p className="text-sm font-bold font-mono text-foreground">
                            {new Date(cycle.accreditationDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })} —{" "}
                            {new Date(cycle.validUntil).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-surface border border-border/60">
                          <p className="text-xs text-muted-foreground">Peer Team Visit Dates</p>
                          <p className="text-base font-bold text-foreground mt-1 flex items-center gap-1.5">
                            <Calendar className="size-4 text-primary" />
                            <span>{cycle.peerTeamVisitDate}</span>
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-surface border border-border/60">
                          <p className="text-xs text-muted-foreground">SSR Submission Date</p>
                          <p className="text-base font-bold text-foreground mt-1 flex items-center gap-1.5">
                            <FileCheck2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                            <span>{cycle.ssrSubmissionDate}</span>
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-surface border border-border/60">
                          <p className="text-xs text-muted-foreground">Annual Quality Status</p>
                          <p className="text-base font-bold text-foreground mt-1 flex items-center gap-1.5">
                            <TrendingUp className="size-4 text-indigo-600 dark:text-indigo-400" />
                            <span>{cycle.aqarStatus}</span>
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
                        <h4 className="text-sm font-bold text-foreground mb-1.5 flex items-center gap-2">
                          <CheckCircle2 className="size-4 text-emerald-600" />
                          <span>Peer Team Observations & Recommendations</span>
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {cycle.remarks}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <Button asChild variant="outline" size="sm" className="gap-2">
                          <a href={cycle.certificateUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="size-3.5" />
                            <span>Download Cycle {cycle.cycleNumber} Official Certificate (PDF)</span>
                          </a>
                        </Button>
                        <Button asChild variant="secondary" size="sm" className="gap-2">
                          <Link to="/college/iqac">
                            <span>View Full IQAC Minutes & ATRs</span>
                            <ChevronRight className="size-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </Container>
      </section>

      {/* Self Study Report (SSR) & Dossier Section */}
      <section className="bg-surface py-14 sm:py-16 border-y border-border/60">
        <Container>
          <SectionHeading
            eyebrow="Statutory Documentation"
            title="Self Study Report (SSR) & DVV Verification Dossier"
            description="The comprehensive five-year institutional evaluation submitted to NAAC under Cycle 3, covering qualitative metrics, quantitative metrics, and Data Validation & Verification (DVV)."
          />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: SSR Documents */}
            <Card className="border border-border/70 shadow-xs">
              <CardHeader className="pb-3">
                <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                  <BookOpen className="size-5" />
                </div>
                <CardTitle className="text-lg font-bold">Self Study Report (SSR)</CardTitle>
                <CardDescription className="text-xs">
                  Cycle 3 consolidated 5-year self-evaluation report.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="p-3 rounded-lg bg-muted/50 border border-border/50 text-xs space-y-1">
                  <p className="font-semibold text-foreground">Completion Score: {initialSsrRecord.overallCompletion}%</p>
                  <p className="text-muted-foreground">Years: {initialSsrRecord.academicYearsCovered.join(", ")}</p>
                  <p className="text-muted-foreground">Executive Summary & Profile: Completed</p>
                </div>
                <ul className="space-y-2 text-xs">
                  {ssrDocs.map((doc) => (
                    <li key={doc.id}>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:border-primary/50 hover:bg-muted/30 transition-colors group"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                            {doc.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">{doc.subtitle}</p>
                        </div>
                        <Download className="size-3.5 text-muted-foreground group-hover:text-primary shrink-0" />
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Column 2: IIQA Submission */}
            <Card className="border border-border/70 shadow-xs">
              <CardHeader className="pb-3">
                <div className="size-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                  <FileText className="size-5" />
                </div>
                <CardTitle className="text-lg font-bold">IIQA Submissions</CardTitle>
                <CardDescription className="text-xs">
                  Institutional Information for Quality Assessment filed with NAAC.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="p-3 rounded-lg bg-muted/50 border border-border/50 text-xs space-y-1">
                  <p className="font-semibold text-foreground">IIQA Status: Accepted by NAAC</p>
                  <p className="text-muted-foreground">Clearance granted to upload SSR within statutory 45 days.</p>
                </div>
                <ul className="space-y-2 text-xs">
                  {iiqaDocs.map((doc) => (
                    <li key={doc.id}>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:border-emerald-600/50 hover:bg-muted/30 transition-colors group"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-semibold text-foreground group-hover:text-emerald-600 transition-colors truncate">
                            {doc.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">{doc.subtitle}</p>
                        </div>
                        <Download className="size-3.5 text-muted-foreground group-hover:text-emerald-600 shrink-0" />
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Column 3: DVV Clarifications */}
            <Card className="border border-border/70 shadow-xs">
              <CardHeader className="pb-3">
                <div className="size-10 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2">
                  <ShieldCheck className="size-5" />
                </div>
                <CardTitle className="text-lg font-bold">DVV Clarifications</CardTitle>
                <CardDescription className="text-xs">
                  Data Validation and Verification responses and metric proofs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="p-3 rounded-lg bg-muted/50 border border-border/50 text-xs space-y-1">
                  <p className="font-semibold text-foreground">DVV Compliance: 100% Resolved</p>
                  <p className="text-muted-foreground">All metric deviation queries answered with verified HEI input.</p>
                </div>
                <ul className="space-y-2 text-xs">
                  {dvvDocs.map((doc) => (
                    <li key={doc.id}>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:border-indigo-600/50 hover:bg-muted/30 transition-colors group"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-semibold text-foreground group-hover:text-indigo-600 transition-colors truncate">
                            {doc.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">{doc.subtitle}</p>
                        </div>
                        <Download className="size-3.5 text-muted-foreground group-hover:text-indigo-600 shrink-0" />
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* Additional Statutory Accreditations (NIRF, ISO, Green Audit) */}
      <section className="py-14 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="Recognitions & Audits"
            title="National Rankings, ISO & Environmental Audits"
            description="Complementary statutory benchmarks and certifications held by Our College."
          />

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card className="border border-border/60 hover:border-primary/50 transition-colors">
              <CardContent className="p-5 space-y-2">
                <div className="size-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Award className="size-5" />
                </div>
                <h4 className="font-bold text-base text-foreground">NIRF 2025 Ranking</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Participating HEI in College Category under Ministry of Education, Government of India.
                </p>
                <Badge variant="secondary" className="text-[10px]">Rank-band 151–200</Badge>
              </CardContent>
            </Card>

            <Card className="border border-border/60 hover:border-primary/50 transition-colors">
              <CardContent className="p-5 space-y-2">
                <div className="size-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <ShieldCheck className="size-5" />
                </div>
                <h4 className="font-bold text-base text-foreground">ISO 9001:2015</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Quality Management System Certified by TUV Nord for Higher Education & Research.
                </p>
                <Badge variant="secondary" className="text-[10px]">Valid thru 2027</Badge>
              </CardContent>
            </Card>

            <Card className="border border-border/60 hover:border-primary/50 transition-colors">
              <CardContent className="p-5 space-y-2">
                <div className="size-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Building className="size-5" />
                </div>
                <h4 className="font-bold text-base text-foreground">Green & Energy Audit</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  ISO 14001 & ISO 50001 certified campus with 120 kWp Rooftop Solar and zero-liquid discharge.
                </p>
                <Badge variant="secondary" className="text-[10px]">Grade A+ Green Campus</Badge>
              </CardContent>
            </Card>

            <Card className="border border-border/60 hover:border-primary/50 transition-colors">
              <CardContent className="p-5 space-y-2">
                <div className="size-10 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <Landmark className="size-5" />
                </div>
                <h4 className="font-bold text-base text-foreground">AISHE Survey 2024–25</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  All India Survey on Higher Education annual institutional data uploaded and verified.
                </p>
                <Badge variant="secondary" className="text-[10px]">Certificate Verified</Badge>
              </CardContent>
            </Card>
          </div>

          <div className="mt-10 p-6 rounded-2xl bg-muted/40 border border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-foreground">Looking for detailed NAAC Criteria I–VII Evidence?</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Explore individual key indicators, metric proofs, and uploaded documentary evidence.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild size="sm" className="gap-1.5">
                <Link to="/college/criteria-evidence">
                  <span>Explore Criteria I–VII</span>
                  <ChevronRight className="size-3.5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="gap-1.5">
                <Link to="/college/aqar-archive">
                  <span>View 8-Year AQARs</span>
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
