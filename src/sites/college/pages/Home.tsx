import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  Bell,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  FileCheck2,
  FileText,
  GraduationCap,
  Heart,
  Landmark,
  Layers,
  MapPin,
  Pause,
  Play,
  Quote,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  Video,
  CreditCard,
  Briefcase,
  Megaphone,
} from "lucide-react";
import { Container } from "@/components/common/Container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { collegeNotices } from "@/mocks/data/notices";
import { collegeEvents } from "@/mocks/data/events";
import { collegeHeroUrl, collegeGalleryUrl } from "@/mocks/data/images";
import { MOCK_PUBLICATIONS_DATA } from "@/mocks/data/naac/publications";
import { MOCK_RESEARCH_FUNDING_DATA } from "@/mocks/data/naac/researchFunding";

export default function CollegeHome() {
  const [tickerPaused, setTickerPaused] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [noticeTab, setNoticeTab] = useState<"Announcements" | "Recruitment" | "Tenders">("Announcements");
  const [vcMessageOpen, setVcMessageOpen] = useState(false);
  const [chancellorMessageOpen, setChancellorMessageOpen] = useState(false);

  // Hero slides
  const heroSlides = [
    {
      title: "Sculpting Heart, Head & Hand",
      subtitle: "First & Premier State University of Odisha · Established 1868 / 1943",
      description: "Accredited Grade A+ (CGPA 3.42) by NAAC · Recognized under UGC Category-1 · 32 PG Departments, Central Instrumentation Facility, and over 150 years of higher education leadership.",
      image: collegeHeroUrl(1),
      primaryCta: { label: "e-Admission Portal 2026-27", href: "/college/admissions" },
      secondaryCta: { label: "NAAC Accreditation Dossier", href: "/college/iqac" },
      badge: "NAAC Grade A+ · CGPA 3.42",
    },
    {
      title: "Centre for Groundbreaking Research & Innovation",
      subtitle: "₹142.50 Lakhs Extramural Grants (DST, CSIR, UGC) · 68 Scopus Papers",
      description: "Advancing frontier inquiry in Artificial Intelligence, Perovskite Nanomaterials, Biodiversity of the Eastern Ghats, and Regional Development Economics with state-of-the-art CIF facilities.",
      image: collegeHeroUrl(2),
      primaryCta: { label: "Explore Scopus Register", href: "/college/research" },
      secondaryCta: { label: "Central Instrumentation Facility", href: "/college/research" },
      badge: "Metric 3.3.1 Scopus Verified",
    },
    {
      title: "Vibrant Campus Life & Heritage Legacy",
      subtitle: "Historic Red-Brick Quadrangle · Parija Central Library · 380+ Affiliated Colleges",
      description: "Empowering 24,000+ students with Choice Based Credit System (CBCS), NEP 2020 LOCF curricula, 42 micro-credentials, active clubs, and 84% campus placement record.",
      image: collegeHeroUrl(3),
      primaryCta: { label: "Explore Programmes & Syllabi", href: "/college/programmes" },
      secondaryCta: { label: "Take 360° Virtual Tour", href: "/college/virtual-tour" },
      badge: "600,000+ Global Alumni",
    },
  ];

  // Auto-advance hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Filtered notices for Tabbed Notice Panel (H7)
  const tabbedNotices = useMemo(() => {
    if (noticeTab === "Recruitment") {
      return collegeNotices.filter((n) => n.category === "Recruitment" || n.title.toLowerCase().includes("recruitment") || n.title.toLowerCase().includes("faculty"));
    }
    if (noticeTab === "Tenders") {
      return collegeNotices.filter((n) => n.category === "Tender" || n.title.toLowerCase().includes("tender") || n.title.toLowerCase().includes("rfp") || n.title.toLowerCase().includes("gem"));
    }
    return collegeNotices.filter((n) => n.category !== "Recruitment" && n.category !== "Tender");
  }, [noticeTab]);

  // E-Services Tiles (H5)
  const eServices = [
    { title: "e-Admission", desc: "SAMS UG/PG Application Portal", href: "/college/admissions", icon: GraduationCap, color: "text-blue-600 bg-blue-500/10 border-blue-500/20" },
    { title: "Exam Results", desc: "Provisional Marksheets & Cards", href: "/college/examination-cell", icon: Award, color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" },
    { title: "Examinations", desc: "Exam Schedules & Form Fill-up", href: "/college/examination-cell", icon: Calendar, color: "text-purple-600 bg-purple-500/10 border-purple-500/20" },
    { title: "Online Payment", desc: "SBI Collect Tuition & Fees", href: "/college/admissions", icon: CreditCard, color: "text-amber-600 bg-amber-500/10 border-amber-500/20" },
    { title: "e-Pratikar Grievance", desc: "Online Student/Staff Grievance", href: "/college/grievance", icon: ShieldCheck, color: "text-rose-600 bg-rose-500/10 border-rose-500/20" },
    { title: "Parija Library", desc: "Koha ILMS & EBSCO e-Resources", href: "/college/library", icon: BookOpen, color: "text-teal-600 bg-teal-500/10 border-teal-500/20" },
    { title: "Virtual Tour", desc: "360° Campus & How to Reach", href: "/college/virtual-tour", icon: Video, color: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20" },
    { title: "PM Internship", desc: "National Internship Scheme", href: "/college/placements", icon: Briefcase, color: "text-cyan-600 bg-cyan-500/10 border-cyan-500/20" },
    { title: "SWAYAM & NPTEL", desc: "Online MOOCs Credit Transfer", href: "/college/programmes", icon: Sparkles, color: "text-violet-600 bg-violet-500/10 border-violet-500/20" },
    { title: "Seminars & Conf", desc: "Academic Conclaves & Reg", href: "/college/news-events", icon: Users, color: "text-orange-600 bg-orange-500/10 border-orange-500/20" },
  ];

  return (
    <div id="main-content" className="space-y-10 pb-16">
      {/* H2: Official Announcement Ticker with NEW Badge */}
      <div className="bg-amber-500/10 dark:bg-amber-950/40 border-y border-amber-500/20 py-2">
        <Container className="flex items-center gap-3">
          <div className="relative z-10 flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded bg-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-xs">
            <Bell className="size-3.5 animate-bounce" />
            <span>Updates</span>
          </div>

          {/* Ticker viewport container with strict overflow clipping */}
          <div
            className="relative flex-1 overflow-hidden min-w-0 py-0.5"
            onMouseEnter={() => setTickerPaused(true)}
            onMouseLeave={() => setTickerPaused(false)}
          >
            <div
              className={`inline-flex items-center gap-8 text-xs text-foreground font-medium whitespace-nowrap ${
                tickerPaused ? "" : "animate-ticker"
              }`}
            >
              {[...collegeNotices.slice(0, 5), ...collegeNotices.slice(0, 5)].map((n, idx) => (
                <Link
                  key={`${n.id}-${idx}`}
                  to="/college/notices"
                  className="hover:text-primary transition-colors inline-flex items-center gap-2"
                >
                  <span className="font-semibold text-foreground underline-offset-2 hover:underline">
                    {n.title}
                  </span>
                  <Badge className="bg-rose-600 text-white text-[9px] px-1 py-0 animate-pulse">
                    NEW
                  </Badge>
                  <span className="text-muted-foreground text-[11px]">({n.date})</span>
                  <span className="text-muted-foreground/50">✦</span>
                </Link>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setTickerPaused((prev) => !prev)}
            className="relative z-10 p-1.5 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-muted-foreground hover:text-foreground shrink-0 transition-colors"
            title={tickerPaused ? "Resume Ticker" : "Pause Ticker"}
          >
            {tickerPaused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
          </button>
        </Container>
      </div>

      {/* H3: Hero Banner Slider */}
      <Container>
        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-border/60 bg-slate-950 min-h-[460px] sm:min-h-[500px] flex items-center">
          {/* Background Image with Dark Vignette */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
            style={{
              backgroundImage: `url(${heroSlides[activeSlide].image})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-transparent" />

          {/* Hero Content Overlay */}
          <div className="relative z-10 p-6 sm:p-12 max-w-3xl space-y-4">
            <Badge className="bg-amber-400 text-slate-950 font-bold border-amber-300 text-xs shadow-md">
              {heroSlides[activeSlide].badge}
            </Badge>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {heroSlides[activeSlide].title}
            </h1>

            <p className="text-sm sm:text-base font-semibold text-amber-300">
              {heroSlides[activeSlide].subtitle}
            </p>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
              {heroSlides[activeSlide].description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button asChild size="default" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg">
                <Link to={heroSlides[activeSlide].primaryCta.href}>
                  {heroSlides[activeSlide].primaryCta.label}
                </Link>
              </Button>
              <Button asChild size="default" variant="outline" className="border-white/40 text-white hover:bg-white/10 font-bold">
                <Link to={heroSlides[activeSlide].secondaryCta.href}>
                  {heroSlides[activeSlide].secondaryCta.label}
                </Link>
              </Button>
            </div>
          </div>

          {/* Slider Navigation Arrows & Indicators */}
          <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
              className="size-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/75 transition-colors border border-white/20"
              aria-label="Previous slide"
            >
              <ChevronLeft className="size-4" />
            </button>
            <div className="flex items-center gap-1 px-2">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveSlide(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    activeSlide === i ? "w-6 bg-amber-400" : "w-2 bg-white/40"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setActiveSlide((prev) => (prev + 1) % heroSlides.length)}
              className="size-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/75 transition-colors border border-white/20"
              aria-label="Next slide"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </Container>

      {/* H4: Legacy + Statistics Animated Counters */}
      <Container>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {[
            { label: "Years of Legacy", val: "80+", sub: "Est. 1868 / 1943" },
            { label: "Affiliated Colleges", val: "380+", sub: "Across Odisha" },
            { label: "PG Departments", val: "32", sub: "Centres of Excellence" },
            { label: "Enrolled Students", val: "24,000+", sub: "UG, PG & Ph.D." },
            { label: "Full-Time Faculty", val: "450+", sub: "16:1 Ratio" },
            { label: "Research Grants", val: "₹142.5L", sub: "DST, CSIR & UGC" },
            { label: "Scopus Papers", val: "3,500+", sub: "68 in 2025-26" },
            { label: "Global Alumni", val: "600,000+", sub: "Leadership Footprint" },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-3 rounded-xl border border-border/60 bg-card text-center space-y-1 shadow-xs hover:border-primary/40 transition-all"
            >
              <div className="text-lg sm:text-xl font-black text-primary tracking-tight">
                {stat.val}
              </div>
              <div className="text-[11px] font-bold text-foreground leading-tight">
                {stat.label}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* H5: E-Services Tile Grid */}
      <Container>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                <Landmark className="size-5 text-primary" />
                Quick E-Services & Academic Portals
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Single-window digital gateway for students, researchers, staff, and affiliated college coordinators.
              </p>
            </div>
            <Badge variant="outline" className="hidden sm:inline-block text-xs">
              10 Integrated Services
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {eServices.map((service, idx) => {
              const Icon = service.icon;
              return (
                <Link
                  key={idx}
                  to={service.href}
                  className="group p-4 rounded-xl border border-border/70 bg-card hover:border-primary hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className={`size-10 rounded-lg flex items-center justify-center border ${service.color}`}>
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {service.title}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                        {service.desc}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 text-[10px] font-semibold text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Access Portal</span>
                    <ChevronRight className="size-3" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </Container>

      {/* H6: Leadership Cards (Chancellor & Vice-Chancellor) */}
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Chancellor Card */}
          <Card className="border border-border/60 bg-gradient-to-br from-card via-card to-amber-500/5 shadow-xs">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center justify-between">
                <Badge className="bg-amber-600 text-white text-[10px]">
                  Head of the University
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">Raj Bhavan, Odisha</span>
              </div>
              <CardTitle className="text-lg font-bold text-foreground mt-2">
                Hon'ble Chancellor & Governor of Odisha
              </CardTitle>
              <CardDescription className="text-xs">
                Ex-Officio Head & Supreme Authority under the Odisha Universities Act
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-3">
              <div className="flex gap-4 items-center">
                <div className="size-20 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700 dark:text-amber-300 font-bold text-2xl shrink-0">
                  <Landmark className="size-10" />
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed">
                  <p className="italic">
                    “May this premier institution continue to illuminate the state through excellence in higher learning, inclusive research, and character building for future generations.”
                  </p>
                  <Button
                    variant="link"
                    size="xs"
                    onClick={() => setChancellorMessageOpen(true)}
                    className="p-0 text-primary h-auto font-semibold mt-1"
                  >
                    Read Chancellor's Full Address →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vice-Chancellor Card */}
          <Card className="border border-border/60 bg-gradient-to-br from-card via-card to-primary/5 shadow-xs">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center justify-between">
                <Badge className="bg-primary text-primary-foreground text-[10px]">
                  Principal Academic & Executive Officer
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">Vice-Chancellor's Secretariat</span>
              </div>
              <CardTitle className="text-lg font-bold text-foreground mt-2">
                Prof. (Dr.) B. K. Ray, Vice-Chancellor
              </CardTitle>
              <CardDescription className="text-xs">
                Ph.D., FNAAS · Leading Institutional Transformation & NAAC A++ Roadmap
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-3">
              <div className="flex gap-4 items-center">
                <div className="size-20 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold text-2xl shrink-0">
                  <UserCheck className="size-10" />
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed">
                  <p className="italic">
                    “Our mission is to empower every student through NEP 2020 student-centric learning, experiential innovation, transparent governance, and world-class research.”
                  </p>
                  <Button
                    variant="link"
                    size="xs"
                    onClick={() => setVcMessageOpen(true)}
                    className="p-0 text-primary h-auto font-semibold mt-1"
                  >
                    Read Vice-Chancellor's Vision Message →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>

      {/* H7: Notice & Circular Panel (Tabs: Announcements / Recruitment / Tenders) */}
      <Container>
        <Card className="border border-border/60 shadow-xs">
          <CardHeader className="p-4 sm:p-5 border-b border-border/60">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Megaphone className="size-5 text-primary" />
                  Notices, Official Circulars & Public Tenders
                </CardTitle>
                <CardDescription className="text-xs">
                  Statutory university announcements with dated PDFs, auto-expiry, and verified signatures.
                </CardDescription>
              </div>

              {/* Tab Selector */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-muted border border-border/70 self-start sm:self-auto">
                {(["Announcements", "Recruitment", "Tenders"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setNoticeTab(tab)}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                      noticeTab === tab
                        ? "bg-card text-primary shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {tabbedNotices.length > 0 ? (
                tabbedNotices.slice(0, 6).map((notice) => (
                  <div
                    key={notice.id}
                    className="p-4 hover:bg-muted/20 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="font-mono text-[10px] border-primary/30 text-primary"
                        >
                          {notice.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                          <Calendar className="size-3" />
                          {notice.date}
                        </span>
                        {notice.pinned && (
                          <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[9px] px-1 py-0">
                            NEW
                          </Badge>
                        )}
                      </div>
                      <Link
                        to="/college/notices"
                        className="text-xs sm:text-sm font-semibold text-foreground hover:text-primary transition-colors block"
                      >
                        {notice.title}
                      </Link>
                      {notice.summary && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {notice.summary}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {notice.fileName ? (
                        <Button
                          size="xs"
                          variant="outline"
                          asChild
                          className="gap-1 text-xs text-primary h-7"
                        >
                          <a href={`/documents/notices/${notice.fileName}`} target="_blank" rel="noreferrer">
                            <Download className="size-3" />
                            <span>PDF ({notice.fileName.endsWith(".pdf") ? "184 KB" : "View"})</span>
                          </a>
                        </Button>
                      ) : (
                        <Button size="xs" variant="ghost" asChild className="text-xs text-primary h-7">
                          <Link to="/college/notices">Details →</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  No active notices currently available under this category.
                </div>
              )}
            </div>

            <div className="p-3 bg-muted/10 border-t border-border/50 flex items-center justify-between px-4 text-xs">
              <span className="text-muted-foreground">
                Showing latest {Math.min(tabbedNotices.length, 6)} entries
              </span>
              <Button asChild variant="link" size="sm" className="p-0 text-primary text-xs font-semibold">
                <Link to={noticeTab === "Recruitment" ? "/college/recruitment" : noticeTab === "Tenders" ? "/college/tenders" : "/college/notices"}>
                  View Complete {noticeTab} Archive →
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </Container>

      {/* H10: Statutory Quality Dossier Strip (NAAC / IQAC / NIRF) */}
      <Container>
        <Card className="border-primary/30 bg-gradient-to-r from-primary/10 via-card to-background shadow-xs">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary text-primary-foreground text-xs">
                    Statutory Institutional Dossier
                  </Badge>
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs">
                    NAAC Grade A+ · CGPA 3.42
                  </Badge>
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Quality Assurance, Accreditation & Transparency Repository
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  In compliance with NAAC SOP and UGC Mandatory Self-Disclosure guidelines (2024), explore verified Criteria 1–7 evidence dossiers, 8-year AQAR archive, Self Study Reports (SSR), CA-audited balance sheets, and NIRF rankings.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Button asChild size="sm" className="bg-primary text-primary-foreground font-bold shadow-xs">
                  <Link to="/college/iqac">
                    <Award className="size-4 mr-1.5" />
                    <span>View IQAC Portal</span>
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to="/college/disclosure">
                    <FileCheck2 className="size-4 mr-1.5" />
                    <span>Mandatory Disclosure</span>
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>

      {/* H11: Research & Central Instrumentation Facility (CIF) Showcase */}
      <Container>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                  Research Ecosystem
                </Badge>
                <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs">
                  ₹142.50L Extramural Grants
                </Badge>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mt-1">
                Research Excellence, Publications & Innovation
              </h2>
            </div>
            <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs self-start sm:self-auto">
              <Link to="/college/research">
                <BookOpen className="size-3.5 text-primary" />
                <span>Search 68 Scopus Papers</span>
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border border-border/60 bg-card p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <Building2 className="size-4 text-purple-600" />
                <span>Central Instrumentation Facility (CIF)</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Equipped with X-Ray Diffractometer (XRD), FE-SEM, UV-Vis Spectrophotometers, and HPLC supporting interdisciplinary materials and biotech inquiry.
              </p>
              <Link to="/college/research" className="text-xs text-primary font-semibold block pt-1 hover:underline">
                View CIF Instruments List →
              </Link>
            </Card>

            <Card className="border border-border/60 bg-card p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <Award className="size-4 text-blue-600" />
                <span>Sponsored Research Projects (DST/CSIR)</span>
              </div>
              <p className="text-xs text-muted-foreground">
                5 ongoing and 3 completed extramural projects with 100% audited CA Utilization Certificates (UC) carrying statutory ICAI UDIN numbers.
              </p>
              <Link to="/college/research" className="text-xs text-primary font-semibold block pt-1 hover:underline">
                View Sanction Orders & Grants →
              </Link>
            </Card>

            <Card className="border border-border/60 bg-card p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <Sparkles className="size-4 text-amber-600" />
                <span>Incubation (UCIIF) & Startups</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Recognized IIC 4.5★ Innovation Cell supporting 8 filed patents, 6 student-led startups, and entrepreneurship bootcamps with MSME Odisha.
              </p>
              <Link to="/college/research" className="text-xs text-primary font-semibold block pt-1 hover:underline">
                Explore IPR & Incubation Hub →
              </Link>
            </Card>
          </div>
        </div>
      </Container>

      {/* H12: Top Recruiters & Placements */}
      <Container>
        <div className="p-6 rounded-2xl border border-border/70 bg-muted/20 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-600 text-white text-[10px]">
                  Placement Season 2025–26
                </Badge>
                <span className="text-xs font-bold text-foreground">84.2% Placement Rate</span>
              </div>
              <h3 className="text-lg font-bold text-foreground mt-1">
                Top Recruiters & Corporate Linkages
              </h3>
            </div>
            <Button asChild size="sm" variant="outline" className="text-xs gap-1.5 self-start sm:self-auto">
              <Link to="/college/placements">
                <span>View Placements Dossier</span>
                <ExternalLink className="size-3" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {[
              { name: "Tata Steel", offers: "48 Offers" },
              { name: "TCS", offers: "112 Offers" },
              { name: "Infosys", offers: "84 Offers" },
              { name: "Deloitte", offers: "26 Offers" },
              { name: "Vedanta Ltd", offers: "34 Offers" },
              { name: "NALCO", offers: "18 Offers" },
              { name: "Wipro", offers: "52 Offers" },
            ].map((rec, i) => (
              <div
                key={i}
                className="p-3 rounded-lg border border-border/60 bg-card text-center space-y-0.5 shadow-xs"
              >
                <div className="text-xs font-bold text-foreground truncate">{rec.name}</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{rec.offers}</div>
              </div>
            ))}
          </div>
        </div>
      </Container>

      {/* H15: Campus Lightbox Photo Gallery */}
      <Container>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-xl font-bold text-foreground">Campus Life & Heritage Architecture</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                From the historic red-brick quadrangle to cutting-edge smart research facilities.
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="text-xs">
              <Link to="/college/gallery">Full Gallery →</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <Link
                key={idx}
                to="/college/gallery"
                className="group relative rounded-xl overflow-hidden aspect-video border border-border/60 shadow-xs block"
              >
                <img
                  src={collegeGalleryUrl(idx)}
                  alt={`Campus facility ${idx}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                  View Photo
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Container>

      {/* Chancellor Address Modal Dialog */}
      <Dialog open={chancellorMessageOpen} onOpenChange={setChancellorMessageOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Landmark className="size-5 text-amber-600" />
              Address of the Hon'ble Chancellor
            </DialogTitle>
            <DialogDescription className="text-xs">
              Ex-Officio Chancellor & Governor of Odisha
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs text-muted-foreground leading-relaxed pt-2">
            <p>
              "The history of higher education in Odisha is intrinsically linked with the glorious trajectory of this university. From its historic inception in the 19th century through the pivotal university charter of 1943, this institution has nurtured scholars, freedom fighters, chief ministers, jurists, and scientists who shaped modern India."
            </p>
            <p>
              "In this transformative era of the National Education Policy (NEP 2020), I commend the Vice-Chancellor, the Academic Council, and the Internal Quality Assurance Cell (IQAC) for upholding rigorous standards, expanding interdisciplinary research, and fostering inclusive empowerment across our state."
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Vice-Chancellor Vision Modal Dialog */}
      <Dialog open={vcMessageOpen} onOpenChange={setVcMessageOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <UserCheck className="size-5 text-primary" />
              Vision Statement from the Vice-Chancellor
            </DialogTitle>
            <DialogDescription className="text-xs">
              Prof. (Dr.) B. K. Ray, Vice-Chancellor
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs text-muted-foreground leading-relaxed pt-2">
            <p>
              "Welcome to Our College. We stand at the intersection of timeless heritage and groundbreaking 21st-century innovation. Our accreditation with NAAC Grade A+ (CGPA 3.42) reflects our unyielding commitment to academic integrity, student-centric pedagogical reforms, and research excellence."
            </p>
            <p>
              "With 100% ICT-enabled smart classrooms, a ₹142.50 Lakh extramural sponsored research portfolio, and over 68 peer-reviewed Scopus publications this academic year, our faculty and students are solving crucial challenges facing our state and the nation. I invite prospective students and scholars to join our vibrant academic community."
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
