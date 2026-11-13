import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileCheck2,
  Bell,
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  Users,
  ShieldCheck,
  Building2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  Play,
  Pause,
  Video,
  FileText,
  CreditCard,
  Utensils,
  CheckCircle2,
  ArrowRight,
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
import { schoolNotices } from "@/mocks/data/notices";
import { schoolEvents } from "@/mocks/data/events";
import { schoolHeroUrl, schoolGalleryUrl } from "@/mocks/data/images";
import { institutions } from "@/mocks/data/institutions";

export default function SchoolHome() {
  const [tickerPaused, setTickerPaused] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [principalMessageOpen, setPrincipalMessageOpen] = useState(false);
  const [noticeTab, setNoticeTab] = useState<"All" | "Admission" | "Examination" | "Circular">("All");

  const school = institutions.school;

  const heroSlides = [
    {
      title: "Nurturing Young Minds to Shine",
      subtitle: "CBSE Affiliated Senior Secondary School (Nursery to Class XII) · Estd. 1998",
      description: "Empowering 1,250+ students in Khandapara, Nayagarh with holistic NEP 2020 pedagogy, Atal Tinkering Lab innovations, PM-POSHAN nutrition, and 98.4% board result excellence.",
      image: schoolHeroUrl(1),
      primaryCta: { label: "Admissions 2026-27 (RTE 25%)", href: "/school/admissions" },
      secondaryCta: { label: "Mandatory Public Disclosure", href: "/school/mandatory-disclosure" },
      badge: "CBSE Affiliation No. 3330123 · School Code: 15234",
    },
    {
      title: "Hands-on Innovation at Atal Tinkering Lab",
      subtitle: "Robotics, 3D Printing, Electronics & Internet of Things (IoT) Kits",
      description: "Fostering STEM curiosity from Class VI onwards under NITI Aayog's ATL initiative, preparing the innovators, scientists, and engineers of tomorrow.",
      image: schoolHeroUrl(2),
      primaryCta: { label: "Explore Campus Facilities", href: "/school/facilities" },
      secondaryCta: { label: "Science & Co-Curriculars", href: "/school/student-life" },
      badge: "NITI Aayog ATL Innovation School",
    },
    {
      title: "Fit India & Inclusive Sports Excellence",
      subtitle: "Athletics, Football, Kho-Kho, Junior Red Cross & Scouts/Guides",
      description: "Building character, teamwork, and health across 4.0 acres of green campus, playground, indoor badminton hall, and dedicated yoga periods.",
      image: schoolHeroUrl(3),
      primaryCta: { label: "Student Life & Houses", href: "/school/student-life" },
      secondaryCta: { label: "Board Results & Toppers", href: "/school/results" },
      badge: "Fit India Certified School",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const quickLinks = [
    {
      title: "Mandatory Disclosure",
      desc: "CBSE Appendix IX (Circular 1/2026)",
      href: "/school/mandatory-disclosure",
      icon: FileCheck2,
      color: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:border-amber-500",
      highlight: true,
    },
    {
      title: "Admissions 2026-27",
      desc: "Nursery to XI & RTE 25% Quota",
      href: "/school/admissions",
      icon: GraduationCap,
      color: "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:border-blue-500",
    },
    {
      title: "Fee Structure",
      desc: "Annual Class-wise Fee Schedule",
      href: "/school/admissions",
      icon: CreditCard,
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:border-emerald-500",
    },
    {
      title: "Academic Calendar",
      desc: "220 Working Days, Exams & PTMs",
      href: "/school/academics",
      icon: Calendar,
      color: "bg-purple-500/10 text-purple-600 border-purple-500/20 hover:border-purple-500",
    },
    {
      title: "Board Results",
      desc: "Class X & XII 3-Year Analysis",
      href: "/school/results",
      icon: Award,
      color: "bg-rose-500/10 text-rose-600 border-rose-500/20 hover:border-rose-500",
    },
    {
      title: "PM-POSHAN Meal",
      desc: "Weekly Nutrition Menu & Kitchen",
      href: "/school/student-life",
      icon: Utensils,
      color: "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:border-amber-500",
    },
    {
      title: "Staff Directory",
      desc: "48 Qualified Teachers & PGTs",
      href: "/school/faculty-staff",
      icon: Users,
      color: "bg-teal-500/10 text-teal-600 border-teal-500/20 hover:border-teal-500",
    },
    {
      title: "Grievance Redressal",
      desc: "Online Form & Childline 1098",
      href: "/school/grievance",
      icon: ShieldCheck,
      color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 hover:border-indigo-500",
    },
    {
      title: "Mo School Abhiyan",
      desc: "Alumni Partnership (2x Grant)",
      href: "/school/alumni",
      icon: Heart,
      color: "bg-pink-500/10 text-pink-600 border-pink-500/20 hover:border-pink-500",
    },
    {
      title: "RTI & Transparency",
      desc: "Section 4(1)(b) Proactive Manuals",
      href: "/school/rti",
      icon: FileText,
      color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20 hover:border-cyan-500",
    },
  ];

  const filteredNotices = schoolNotices.filter((n) => {
    if (noticeTab === "All") return true;
    return n.category === noticeTab;
  });

  return (
    <div id="main-content" className="space-y-10 pb-16">
      {/* H2: PROMINENT MANDATORY PUBLIC DISCLOSURE STRIP (CBSE CIRCULAR 1/2026 MANDATE) */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 py-2.5 shadow-sm border-y border-amber-600/30">
        <Container className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-center sm:text-left">
            <div className="size-8 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
              <FileCheck2 className="size-4 animate-pulse" />
            </div>
            <div>
              <span className="font-black text-slate-950 text-sm block leading-tight">
                CBSE MANDATORY PUBLIC DISCLOSURE (APPENDIX IX)
              </span>
              <span className="text-[11px] font-semibold text-slate-900/80">
                Self-attested certificates, fee structure, SMC list, board results & staff qualifications updated as per CBSE Circular No. 1/2026.
              </span>
            </div>
          </div>
          <Button asChild size="sm" className="bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold text-xs shrink-0 shadow-md">
            <Link to="/school/mandatory-disclosure">
              <span>View Full Disclosure</span>
              <ArrowRight className="size-3.5 ml-1" />
            </Link>
          </Button>
        </Container>
      </div>

      {/* H3: OFFICIAL SCHOOL NOTICE TICKER */}
      <div className="bg-primary/5 border-y border-primary/15 py-2">
        <Container className="flex items-center gap-3">
          <div className="relative z-10 flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider shadow-xs">
            <Bell className="size-3.5 animate-bounce" />
            <span>Updates</span>
          </div>

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
              {[...schoolNotices, ...schoolNotices].map((n, idx) => (
                <Link
                  key={`${n.id}-${idx}`}
                  to="/school/notices"
                  className="hover:text-primary transition-colors inline-flex items-center gap-2"
                >
                  <span className="font-semibold text-foreground underline-offset-2 hover:underline">
                    {n.title}
                  </span>
                  <Badge className="bg-rose-600 text-white text-[9px] px-1 py-0 animate-pulse">
                    NEW
                  </Badge>
                  <span className="text-muted-foreground text-[11px]">({n.date})</span>
                  <span className="text-muted-foreground/40">✦</span>
                </Link>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setTickerPaused((prev) => !prev)}
            className="relative z-10 p-1.5 rounded-md bg-muted text-muted-foreground hover:text-foreground shrink-0 transition-colors"
            title={tickerPaused ? "Resume Ticker" : "Pause Ticker"}
          >
            {tickerPaused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
          </button>
        </Container>
      </div>

      {/* H4: HERO BANNER SLIDER */}
      <Container>
        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-border/60 bg-slate-950 min-h-[460px] sm:min-h-[500px] flex items-center">
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
            style={{
              backgroundImage: `url(${heroSlides[activeSlide].image})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-transparent" />

          {/* Hero Content Overlay */}
          <div className="relative z-10 p-6 sm:p-12 max-w-3xl space-y-4">
            <Badge className="bg-primary text-primary-foreground font-bold text-xs shadow-md">
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

          {/* Slider Navigation */}
          <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
              className="p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 border border-white/20 transition-colors"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="size-4" />
            </button>
            <div className="flex items-center gap-1.5 px-2">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    activeSlide === idx ? "w-6 bg-primary" : "w-2 bg-white/40"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setActiveSlide((prev) => (prev + 1) % heroSlides.length)}
              className="p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 border border-white/20 transition-colors"
              aria-label="Next Slide"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </Container>

      {/* H8: KEY PERFORMANCE METRICS & SCALE COUNTERS */}
      <Container>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-xl border bg-card text-center space-y-1 shadow-2xs">
            <div className="text-2xl font-black text-primary">1,250+</div>
            <div className="text-xs font-semibold text-foreground">Enrolled Students</div>
            <div className="text-[10px] text-muted-foreground">Nursery to Class XII</div>
          </div>
          <div className="p-4 rounded-xl border bg-card text-center space-y-1 shadow-2xs">
            <div className="text-2xl font-black text-foreground">48</div>
            <div className="text-xs font-semibold text-foreground">Qualified Faculty</div>
            <div className="text-[10px] text-muted-foreground">100% Trained & B.Ed.</div>
          </div>
          <div className="p-4 rounded-xl border bg-card text-center space-y-1 shadow-2xs">
            <div className="text-2xl font-black text-amber-600">36</div>
            <div className="text-xs font-semibold text-foreground">Smart Classrooms</div>
            <div className="text-[10px] text-muted-foreground">ICT & Interactive Panels</div>
          </div>
          <div className="p-4 rounded-xl border bg-card text-center space-y-1 shadow-2xs">
            <div className="text-2xl font-black text-emerald-600">98.4%</div>
            <div className="text-xs font-semibold text-foreground">Board Pass Rate</div>
            <div className="text-[10px] text-muted-foreground">Class X & XII CBSE</div>
          </div>
          <div className="p-4 rounded-xl border bg-card text-center space-y-1 shadow-2xs">
            <div className="text-2xl font-black text-purple-600">4.0 Acres</div>
            <div className="text-xs font-semibold text-foreground">Green Campus</div>
            <div className="text-[10px] text-muted-foreground">Pucca Boundary Secured</div>
          </div>
          <div className="p-4 rounded-xl border bg-card text-center space-y-1 shadow-2xs">
            <div className="text-2xl font-black text-rose-600">27 Years</div>
            <div className="text-xs font-semibold text-foreground">Legacy of Service</div>
            <div className="text-[10px] text-muted-foreground">Established 1998</div>
          </div>
        </div>
      </Container>

      {/* H6: 10 QUICK ACCESS SERVICES TILES */}
      <Container className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <div>
            <h2 className="text-lg font-bold text-foreground">Quick Access & Citizen Services</h2>
            <p className="text-xs text-muted-foreground">Direct pathways for parents, students, inspectors, and community stakeholders.</p>
          </div>
          <span className="text-xs text-muted-foreground font-mono">GIGW 3.0 Standard</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.title}
                to={link.href}
                className={`p-3.5 rounded-xl border transition-all hover:shadow-md flex flex-col justify-between space-y-2 bg-card ${link.color}`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-background/80 shadow-2xs">
                    <Icon className="size-4" />
                  </div>
                  {link.highlight && (
                    <Badge className="bg-amber-500 text-slate-950 font-black text-[9px] px-1 py-0 animate-pulse">
                      MANDATORY
                    </Badge>
                  )}
                </div>
                <div>
                  <div className="font-bold text-xs text-foreground leading-snug">{link.title}</div>
                  <div className="text-[11px] text-muted-foreground line-clamp-1">{link.desc}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>

      {/* H5 & H7: LEADERSHIP DESK & ABOUT SCHOOL PROFILE */}
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Principal's Desk Card (H5) */}
          <Card className="border border-border/70 bg-card p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="size-14 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center font-black text-primary text-xl shrink-0">
                SM
              </div>
              <div>
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold">
                  Principal's Desk
                </Badge>
                <h3 className="text-base font-bold text-foreground mt-0.5">Smt. Sunita Mohanty</h3>
                <p className="text-xs text-muted-foreground">M.Sc. (Physics), B.Ed. · 22 Years Exp.</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed italic border-l-2 border-primary/30 pl-3">
              "Welcome to Our School. True education transcends examination marks; it nurtures scientific temperament, moral fortitude, and compassionate citizenship. Our teachers walk with every learner to ensure no child is left behind."
            </p>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPrincipalMessageOpen(true)}
              className="w-full text-xs font-bold"
            >
              Read Full Principal's Message
            </Button>
          </Card>

          {/* About School Profile & UDISE+ Details (H7) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="border-b pb-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                  School Profile
                </Badge>
                <span className="text-xs text-muted-foreground">CBSE Affiliated Senior Secondary</span>
              </div>
              <h2 className="text-xl font-bold text-foreground mt-1">
                Rooted in Values, Inspired by Innovation
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Established in 1998, <strong>Our School</strong> is a premier CBSE-affiliated co-educational institution located in Khandapara, Nayagarh, Odisha. We provide an integrated educational trajectory from Nursery to Class XII across Science, Commerce, and Humanities streams, compliant with NEP 2020 and Right to Education norms.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
                <div className="font-bold text-foreground">UDISE+ Code</div>
                <div className="font-mono text-primary font-semibold">21160401201</div>
              </div>
              <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
                <div className="font-bold text-foreground">CBSE Affiliation</div>
                <div className="font-mono text-primary font-semibold">3330123</div>
              </div>
              <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
                <div className="font-bold text-foreground">Medium of Study</div>
                <div className="font-semibold text-foreground">English (with Odia)</div>
              </div>
              <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
                <div className="font-bold text-foreground">Campus Status</div>
                <div className="font-semibold text-emerald-600">Day School (Co-Ed)</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button asChild size="sm" className="text-xs font-bold gap-1.5">
                <Link to="/school/about">
                  <span>Explore School History & Vision</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="text-xs font-bold">
                <Link to="/school/facilities">
                  <span>View Campus & 6 Labs</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>

      {/* H9: TABBED NOTICES, CIRCULARS & EVENTS BOARD */}
      <Container className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-2">
          <div>
            <h2 className="text-lg font-bold text-foreground">Notices, Circulars & School Calendar</h2>
            <p className="text-xs text-muted-foreground">Official circulars, exam datesheets, and event schedules.</p>
          </div>
          <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg">
            {(["All", "Admission", "Examination", "Circular"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setNoticeTab(tab)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  noticeTab === tab
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotices.slice(0, 6).map((notice) => (
            <Card key={notice.id} className="border border-border/70 p-4 space-y-3 bg-card hover:border-primary transition-all flex flex-col justify-between shadow-xs">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <Badge variant="outline" className="text-[10px] font-semibold">
                    {notice.category}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">{notice.date}</span>
                </div>
                <h3 className="font-bold text-sm text-foreground leading-snug line-clamp-2">
                  {notice.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {notice.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                {notice.fileName ? (
                  <Button asChild size="sm" variant="ghost" className="h-7 text-xs text-primary gap-1 p-0">
                    <a href={`/documents/school/notices/${notice.fileName}`} download>
                      <Download className="size-3" />
                      <span>Download PDF</span>
                    </a>
                  </Button>
                ) : (
                  <Link to="/school/notices" className="text-primary text-xs font-semibold hover:underline">
                    Read Details
                  </Link>
                )}
                <span className="text-[10px] text-muted-foreground">Valid till {notice.expiryDate ?? "2027"}</span>
              </div>
            </Card>
          ))}
        </div>
      </Container>

      {/* H10 & H11: ACHIEVEMENTS & PM-POSHAN NUTRITION MENU */}
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Achievements (H10) */}
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Award className="size-5 text-primary" />
                <span>Student Achievements & Board Accolades</span>
              </h2>
              <p className="text-xs text-muted-foreground">Recognizing excellence in CBSE exams, science fairs, and sports.</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl border bg-card space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">CBSE Class X 100% Pass Record</span>
                  <Badge className="bg-emerald-600 text-white text-[10px]">Academic 2024</Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  All 98 enrolled students cleared the All India Secondary School Examination (AISSE) with first division. 18 students scored above 90% aggregate.
                </p>
              </div>

              <div className="p-4 rounded-xl border bg-card space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-600">National Children's Science Congress</span>
                  <Badge variant="outline" className="text-[10px]">State Winner</Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Our Atal Tinkering Lab team won 1st Prize at State Science Conclave for their project on "Automated Drip Irrigation for Small Farmers in Nayagarh".
                </p>
              </div>

              <div className="p-4 rounded-xl border bg-card space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-600">Fit India Gold Certified School</span>
                  <Badge className="bg-purple-600 text-white text-[10px]">Sports Authority</Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Recognized for 60 minutes daily physical activity, qualified coaches, yoga curriculum, and district inter-school athletic championships.
                </p>
              </div>
            </div>
          </div>

          {/* PM-POSHAN Weekly Nutrition Menu (H11) */}
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Utensils className="size-5 text-emerald-600" />
                <span>PM-POSHAN (Mid-Day Meal) Nutrition</span>
              </h2>
              <p className="text-xs text-muted-foreground">Hygienic hot-cooked wholesome meals served to enrolled students under government guidelines.</p>
            </div>

            <div className="border rounded-xl overflow-hidden bg-card shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/80 text-foreground font-bold border-b">
                  <tr>
                    <th className="p-2.5">Day</th>
                    <th className="p-2.5">Meal & Nutritional Menu</th>
                    <th className="p-2.5 text-right">Calories</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-muted/30">
                    <td className="p-2.5 font-bold text-primary">Monday</td>
                    <td className="p-2.5 text-foreground">Rice, Dalma (Nutritious Lentils with Local Veggies), Boiled Egg / Fruit</td>
                    <td className="p-2.5 text-right font-mono text-muted-foreground">580 kcal</td>
                  </tr>
                  <tr className="hover:bg-muted/30">
                    <td className="p-2.5 font-bold text-primary">Tuesday</td>
                    <td className="p-2.5 text-foreground">Soyabean Curry, Steamed Rice, Green Leafy Salad</td>
                    <td className="p-2.5 text-right font-mono text-muted-foreground">550 kcal</td>
                  </tr>
                  <tr className="hover:bg-muted/30">
                    <td className="p-2.5 font-bold text-primary">Wednesday</td>
                    <td className="p-2.5 text-foreground">Rice, Mixed Vegetable Sambar, Boiled Egg / Seasonal Banana</td>
                    <td className="p-2.5 text-right font-mono text-muted-foreground">590 kcal</td>
                  </tr>
                  <tr className="hover:bg-muted/30">
                    <td className="p-2.5 font-bold text-primary">Thursday</td>
                    <td className="p-2.5 text-foreground">Khichdi with Greens, Roasted Papad, Tomato Chutney</td>
                    <td className="p-2.5 text-right font-mono text-muted-foreground">540 kcal</td>
                  </tr>
                  <tr className="hover:bg-muted/30">
                    <td className="p-2.5 font-bold text-primary">Friday</td>
                    <td className="p-2.5 text-foreground">Steamed Rice, Chana Dal with Pumpkin, Boiled Egg / Curd</td>
                    <td className="p-2.5 text-right font-mono text-muted-foreground">580 kcal</td>
                  </tr>
                  <tr className="hover:bg-muted/30">
                    <td className="p-2.5 font-bold text-primary">Saturday</td>
                    <td className="p-2.5 text-foreground">Vegetable Pulao, Potato Pea Curry, Roasted Chana Snack</td>
                    <td className="p-2.5 text-right font-mono text-muted-foreground">520 kcal</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="text-[11px] text-muted-foreground">
              Cooked under strict supervision of the School Food Safety In-charge and Parent Volunteers. RO purified water used exclusively.
            </div>
          </div>
        </div>
      </Container>

      {/* H12: SCHOOL PHOTO GALLERY PREVIEW */}
      <Container className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <div>
            <h2 className="text-lg font-bold text-foreground">Campus Life in Pictures</h2>
            <p className="text-xs text-muted-foreground">Glimpses of daily classrooms, science fairs, sports events, and cultural celebrations.</p>
          </div>
          <Button asChild size="sm" variant="outline" className="text-xs font-semibold">
            <Link to="/school/gallery">View Full Gallery</Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="relative rounded-xl overflow-hidden aspect-4/3 group border bg-muted shadow-2xs">
              <img
                src={schoolGalleryUrl(idx)}
                alt={`School Campus Event ${idx}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors" />
            </div>
          ))}
        </div>
      </Container>

      {/* H13: CONTACT STRIP & HOW TO REACH */}
      <Container>
        <Card className="border border-border/70 p-6 bg-card space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                <span>Visit Our School — Contact & Transport</span>
              </h3>
              <p className="text-xs text-muted-foreground">Khandapara Road, Near Bus Stand, Nayagarh, Odisha — 752054</p>
            </div>
            <Button asChild size="sm" className="text-xs font-bold shrink-0">
              <Link to="/school/contact">
                <span>Contact Office & Helpdesk</span>
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-muted-foreground">
            <div className="flex items-start gap-2.5">
              <Phone className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground block">Phone Helplines:</strong>
                <span>+91 98765 43210 / 06757-223456</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Mail className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground block">Official Email:</strong>
                <span>info@ourschool.edu.in</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground block">Visiting Hours:</strong>
                <span>Monday to Saturday: 8:30 AM – 3:30 PM</span>
              </div>
            </div>
          </div>
        </Card>
      </Container>

      {/* Principal Vision Dialog Modal */}
      <Dialog open={principalMessageOpen} onOpenChange={setPrincipalMessageOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <GraduationCap className="size-5 text-primary" />
              <span>Vision Statement from the Principal</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Smt. Sunita Mohanty, Principal, Our School
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs text-muted-foreground leading-relaxed pt-2">
            <p>
              "Dear Parents, Students, and Well-Wishers, welcome to Our School. For over 27 years, our campus has stood as a beacon of academic diligence, ethical discipline, and joyful learning in Nayagarh."
            </p>
            <p>
              "In alignment with the National Education Policy (NEP 2020), we have modernised our learning ecosystem with 100% smart interactive classrooms, experiential science laboratories, and an Atal Tinkering Lab. We believe that true learning begins with curiosity and blossoms with empathy."
            </p>
            <p>
              "Our dedicated team of 48 trained educators ensures personal attention with a 1:26 student-teacher ratio. As an inclusive school, we provide specialised support through our dedicated Special Educator and Child Wellness Counsellor. I invite you to partner with us in shaping confident, responsible citizens for India."
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
