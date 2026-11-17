import { useState } from "react";
import { Link } from "react-router-dom";
import { Hero } from "@/components/sections/Hero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { schoolHeroUrl } from "@/mocks/data/images";
import {
  BookOpen,
  Award,
  Calendar,
  Clock,
  Download,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  FileText,
} from "lucide-react";

export default function SchoolAcademics() {
  const academicStages = [
    {
      stage: "Foundational Stage (Ages 3–8)",
      classes: "Nursery, LKG, UKG, Class I & II",
      focus: "Play-based, activity-centric, and linguistic learning. Focus on foundational literacy, numeracy, and environmental awareness with zero examination stress.",
    },
    {
      stage: "Preparatory Stage (Ages 8–11)",
      classes: "Classes III, IV & V",
      focus: "Gradual transition from play to interactive classroom learning. Reading, writing, speaking, physical education, art, and basic mathematics.",
    },
    {
      stage: "Middle Stage (Ages 11–14)",
      classes: "Classes VI, VII & VIII",
      focus: "Subject-oriented learning across Sciences, Mathematics, Humanities, and Languages. Introduction to Atal Tinkering Lab, coding, and vocational exposure.",
    },
    {
      stage: "Secondary Stage (Ages 14–16)",
      classes: "Classes IX & X (AISSE)",
      focus: "Rigorous CBSE curriculum preparation across 5 core subjects: English Communicative, Odia / Hindi, Mathematics, Science, and Social Science.",
    },
    {
      stage: "Senior Secondary Stage (Ages 16–18)",
      classes: "Classes XI & XII (AISSCE)",
      focus: "Specialized streams in Science (PCM / PCB with Computer Science or Physical Education) and Commerce (Accountancy, Business Studies, Economics, Applied Math).",
    },
  ];

  const calendarEvents = [
    { month: "April 2026", details: "Commencement of New Academic Session 2026–27 · Baseline Diagnostic Assessments" },
    { month: "July 2026", details: "Periodic Assessment 1 (PA-1) for Classes I to XII · Quarter 1 PTM" },
    { month: "September 2026", details: "Half-Yearly / Term-1 Examinations (Classes VI to XII) · Mid-Term Assessment" },
    { month: "October 2026", details: "Dussehra & Puja Break · Half-Yearly Results & Remedial Support Sessions" },
    { month: "November 2026", details: "Annual Science Exhibition · Atal Tinkering Lab Innovation Conclave · Sports Meet" },
    { month: "December 2026", details: "Periodic Assessment 2 (PA-2) · Pre-Board 1 for Board Classes X & XII" },
    { month: "January 2027", details: "Pre-Board 2 Examinations · National Science Congress delegation" },
    { month: "February 2027", details: "CBSE Practical Examinations for Class XII · Annual Revision Camps" },
    { month: "March 2027", details: "CBSE AISSE & AISSCE Board Examinations · Annual Term End Exams (Classes I–IX & XI)" },
  ];

  return (
    <>
      <Hero
        variant="compact"
        title="Academics & Curriculum"
        subtitle="CBSE 5+3+3+4 Pedagogical Framework under NEP 2020, Holistic Progress Card & Academic Calendar"
        imageUrl={schoolHeroUrl(3)}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/school" }, { label: "Academics" }]} />

      <Container className="py-10 space-y-10">
        {/* NEP 2020 5+3+3+4 Pedagogical Structure */}
        <div className="space-y-4">
          <div className="border-b pb-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                NEP 2020 Framework
              </Badge>
              <span className="text-xs text-muted-foreground">CBSE Affiliation No. 3330123</span>
            </div>
            <h1 className="text-2xl font-black text-foreground mt-1">
              Curricular Progression from Nursery to Class XII
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
              Our School implements the National Curriculum Framework (NCF) with continuous and comprehensive evaluation, experiential lab learning, and holistic formative assessments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {academicStages.map((stage) => (
              <Card key={stage.stage} className="border border-border/70 p-5 space-y-2 bg-card shadow-xs">
                <Badge variant="outline" className="text-[10px] font-semibold text-primary">
                  {stage.classes}
                </Badge>
                <h3 className="font-bold text-sm text-foreground pt-0.5">{stage.stage}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {stage.focus}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* NEP 2020 Holistic Progress Card (HPC) */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-background to-teal-500/10 border-2 border-emerald-500/30 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-600 text-white font-bold text-xs uppercase px-2 py-0.5">
                  PARAKH & NEP 2020
                </Badge>
                <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200">360-Degree Multidimensional Assessment</span>
              </div>
              <h2 className="text-lg font-black text-foreground">
                Holistic Progress Card (HPC)
              </h2>
            </div>
            <Button asChild size="sm" variant="outline" className="border-emerald-600 text-emerald-700 dark:text-emerald-300 text-xs font-bold shrink-0">
              <a href="/documents/school/disclosure/Sample_Holistic_Progress_Card.pdf" download>
                <Download className="size-3.5 mr-1" />
                <span>Sample HPC Format</span>
              </a>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
            Moving away from rote memorization and single-number marks, Our School evaluates each student across cognitive, socio-emotional, and psychomotor domains. The progress card includes:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-card border space-y-1">
              <strong className="text-foreground block">1. Self & Peer Assessment</strong>
              <span className="text-muted-foreground">Students reflect on their own learning habits, strengths, and peer teamwork.</span>
            </div>
            <div className="p-3 rounded-xl bg-card border space-y-1">
              <strong className="text-foreground block">2. Teacher's Evaluation</strong>
              <span className="text-muted-foreground">Competency-based evaluation of conceptual grasp, creativity, and analytical skills.</span>
            </div>
            <div className="p-3 rounded-xl bg-card border space-y-1">
              <strong className="text-foreground block">3. Parent Reflection</strong>
              <span className="text-muted-foreground">Structured feedback on home habits, reading hours, and emotional wellbeing.</span>
            </div>
          </div>
        </div>

        {/* Annual Academic Calendar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-2">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Calendar className="size-4 text-primary" />
                <span>Annual Academic Calendar (2026–27 Session)</span>
              </h2>
              <p className="text-xs text-muted-foreground">220 instructional days, periodic assessment schedules, and gazetted holiday calendar.</p>
            </div>
            <Button asChild size="sm" variant="outline" className="text-xs font-semibold gap-1.5">
              <a href="/documents/school/disclosure/Academic_Calendar_2026_27.pdf" download>
                <Download className="size-3.5" />
                <span>Download Calendar PDF</span>
              </a>
            </Button>
          </div>

          <div className="border rounded-xl overflow-hidden bg-card shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/80 text-foreground font-bold border-b">
                <tr>
                  <th className="p-3 w-36">Month / Term</th>
                  <th className="p-3">Academic Milestones, Examinations & Key Activities</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {calendarEvents.map((ev) => (
                  <tr key={ev.month} className="hover:bg-muted/30">
                    <td className="p-3 font-bold text-primary font-mono">{ev.month}</td>
                    <td className="p-3 text-foreground">{ev.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* NCERT Textbooks & Digital Learning Link */}
        <div className="p-5 rounded-2xl border bg-card space-y-3 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <BookOpen className="size-4 text-primary" />
                <span>Prescribed NCERT Textbooks & Digital DIKSHA Portal</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                In strict adherence to CBSE directives, Our School prescribes solely NCERT / CBSE published textbooks across Classes I to XII. No private publishers' books are mandatory.
              </p>
            </div>
            <Button asChild size="sm" variant="outline" className="text-xs font-bold shrink-0">
              <a href="https://ncert.nic.in/textbook.php" target="_blank" rel="noreferrer">
                <span>NCERT e-Books Portal</span>
                <ExternalLink className="size-3.5 ml-1" />
              </a>
            </Button>
          </div>
        </div>

        {/* CTA to Board Results */}
        <div className="p-4 rounded-xl border bg-muted/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="space-y-0.5 text-center sm:text-left">
            <div className="font-bold text-sm text-foreground">Inspect Last 3 Years' Board Examination Results</div>
            <div className="text-xs text-muted-foreground">View Class X & XII pass percentages, school toppers, and district merits.</div>
          </div>
          <Button asChild size="sm" className="gap-1.5 text-xs font-bold">
            <Link to="/school/results">
              <span>View Board Results</span>
              <ChevronRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </Container>
    </>
  );
}
