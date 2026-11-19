import { Link } from "react-router-dom";
import {
  FileText,
  Download,
  BookOpen,
  GraduationCap,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { collegeHeroUrl } from "@/mocks/data/images";
import { institutions } from "@/mocks/data/institutions";

export default function ProspectusLibrary() {
  const institution = institutions.college;

  const prospectuses = [
    {
      title: "Undergraduate (UG) Information Brochure 2026–27",
      level: "Four-Year FYUGP (NEP 2020)",
      description: "Complete guide to undergraduate honours programmes across Science, Arts, and Commerce. Includes credit matrix, major/minor subject combinations, intake capacity, and multiple entry/exit provisions.",
      fileSize: "4.8 MB",
      pages: "64 Pages",
      date: "02-May-2026",
      href: "/documents/prospectus/UG_Prospectus_2026-27.pdf",
      highlight: "NEP 2020 FYUGP",
    },
    {
      title: "Post-Graduate (P.G.) Prospectus 2026–27",
      level: "Master's Programmes (MA / M.Sc / M.Com)",
      description: "Official prospectus for all 32 PG Teaching Departments. Covers department profiles, faculty specializations, central research equipment, laboratory facilities, and SAMS CPET cut-off marks.",
      fileSize: "7.2 MB",
      pages: "92 Pages",
      date: "10-May-2026",
      href: "/documents/prospectus/PG_Prospectus_2026-27.pdf",
      highlight: "32 PG Departments",
    },
    {
      title: "Doctor of Philosophy (Ph.D.) Research Bulletin 2026–27",
      level: "Doctoral Research & Fellowships",
      description: "Statutory regulations for university research entrance tests (URET), UGC-NET/JRF exemptions, Pre-Ph.D. coursework requirements, doctoral research committees, and thesis submission norms.",
      fileSize: "2.6 MB",
      pages: "42 Pages",
      date: "18-May-2026",
      href: "/documents/prospectus/PhD_Research_Bulletin_2026-27.pdf",
      highlight: "URET / UGC-NET",
    },
    {
      title: "Self-Financing & Professional Programmes Brochure",
      level: "Professional & Technical Courses",
      description: "Admission guidelines, fee schedules, and industry placement profiles for specialized professional courses including MBA, MCA, Integrated B.Ed, M.Tech (Computer Science), and MSW.",
      fileSize: "3.9 MB",
      pages: "48 Pages",
      date: "15-May-2026",
      href: "/documents/prospectus/Self_Financing_Brochure_2026.pdf",
      highlight: "Placement Focused",
    },
    {
      title: "International & NRI Student Admission Handbook",
      level: "Global Admissions Wing",
      description: "Dedicated guidelines for foreign nationals, NRI sponsored applicants, ICCR scholars, visa processing, FRRO registration protocols, and international guest house facilities.",
      fileSize: "1.8 MB",
      pages: "28 Pages",
      date: "20-Apr-2026",
      href: "/documents/prospectus/International_Student_Handbook.pdf",
      highlight: "Global Scholars",
    },
    {
      title: "Student Code of Conduct & Anti-Ragging Mandate",
      level: "Statutory Guidelines & Welfare",
      description: "Mandatory statutory compendium containing UGC anti-ragging regulations, internal complaints committee (POSH) procedures, library conduct, and hostel residence rules.",
      fileSize: "1.4 MB",
      pages: "24 Pages",
      date: "01-Jun-2026",
      href: "/documents/prospectus/Anti_Ragging_Code_of_Conduct.pdf",
      highlight: "Zero Tolerance",
    },
  ];

  const keyHighlights = [
    { title: "Seat Matrix & Intake Capacity", desc: "Detailed breakdown of sanctioned seats across 24 UG honours subjects and 32 PG postgraduate departments." },
    { title: "Grading Scale & CGPA System", desc: "10-point absolute grading scale compliant with UGC CBCS guidelines and Odisha State Model Syllabi." },
    { title: "Mandatory Minimum Attendance", desc: "75% minimum physical classroom and laboratory attendance required to appear in semester examinations." },
    { title: "Hostel & Residential Boarding", desc: "Merit-cum-distance based boarding allotment across 14 university residence halls with 24x7 Wi-Fi." },
  ];

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/college" },
          { label: "Admissions", href: "/college/admissions" },
          { label: "Prospectus Library" },
        ]}
      />

      <Hero
        variant="compact"
        title="Prospectus Library"
        subtitle="Official Admission Prospectuses, Department Guidelines & Syllabus Regulations"
        imageUrl={collegeHeroUrl(3)}
      />

      <Container className="py-10 space-y-12">
        {/* Intro Strip */}
        <div className="space-y-4 border-b pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
              Official Publications
            </Badge>
            <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs">
              Academic Session 2026–27
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Official Information Brochures & Prospectus Library
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl">
            Download the official admission prospectuses and information bulletins published by the Central Admission Committee
            of {institution.name}. Each prospectus contains exhaustive syllabi, seat matrices, reservation details,
            fee structures, and academic regulations approved by the Academic Council and Syndicate.
          </p>
        </div>

        {/* Prospectuses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prospectuses.map((doc, idx) => (
            <Card
              key={idx}
              className="p-5 border border-border/70 bg-card hover:border-primary/40 transition-all shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                    {doc.highlight}
                  </Badge>
                  <span className="font-mono text-[11px] text-muted-foreground font-semibold">
                    {doc.fileSize}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-foreground leading-snug">
                    {doc.title}
                  </h3>
                  <div className="text-xs text-primary font-medium mt-1">{doc.level}</div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {doc.description}
                </p>
              </div>

              <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground font-mono">
                  {doc.pages} · {doc.date}
                </span>
                <Button size="xs" variant="outline" asChild className="gap-1.5 text-xs text-primary border-primary/30">
                  <a href={doc.href} target="_blank" rel="noreferrer">
                    <Download className="size-3" />
                    <span>Download</span>
                  </a>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Key Information Highlights Strip */}
        <div className="space-y-6">
          <div className="border-b pb-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="size-5 text-primary" />
              Essential Highlights at a Glance
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Crucial regulatory requirements highlighted across all university prospectuses.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {keyHighlights.map((k, i) => (
              <Card key={i} className="p-4 border border-border/70 bg-card space-y-1.5">
                <Badge variant="secondary" className="text-[10px] font-mono">
                  Mandatory Rule
                </Badge>
                <h4 className="font-bold text-sm text-foreground">{k.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{k.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Nav */}
        <div className="p-6 rounded-2xl bg-muted/40 border border-border/70 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-base text-foreground">Explore Fee Structure & Digital Payment</h3>
            <p className="text-xs text-muted-foreground">View detailed category-wise fee matrices and proceed to online semester fee payment.</p>
          </div>
          <Button size="sm" asChild className="gap-1.5 bg-primary text-white text-xs font-bold shadow-xs">
            <Link to="/college/admissions/fee-structure">
              <span>View Fee Structure</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </Container>
    </>
  );
}
