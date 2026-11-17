import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Download,
  Calendar,
  Building2,
  ExternalLink,
  Users,
  CheckCircle2,
  Clock,
  Search,
} from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { collegeHeroUrl } from "@/mocks/data/images";

export default function CollegeRecruitment() {
  const [tab, setTab] = useState<"teaching" | "non_teaching" | "shortlists">("teaching");

  const teachingJobs = [
    {
      id: "rec-01",
      advtNo: "KSU/REC/06/2026",
      postTitle: "Assistant Professor in Computer Science & Engineering",
      vacancies: 4,
      department: "Department of Computer Science",
      payScale: "Academic Level 10 (₹57,700 – ₹1,82,400)",
      lastDate: "2026-12-15",
      status: "Active",
      pdfUrl: "/documents/recruitment/advt-06-2026-cs.pdf",
    },
    {
      id: "rec-02",
      advtNo: "KSU/REC/06/2026",
      postTitle: "Associate Professor in Physics (Condensed Matter / Nanotechnology)",
      vacancies: 2,
      department: "Department of Physics",
      payScale: "Academic Level 13A (₹1,31,400 – ₹2,17,100)",
      lastDate: "2026-12-15",
      status: "Active",
      pdfUrl: "/documents/recruitment/advt-06-2026-physics.pdf",
    },
    {
      id: "rec-03",
      advtNo: "KSU/REC/06/2026",
      postTitle: "Assistant Professor in Economics & Development Studies",
      vacancies: 3,
      department: "Department of Economics",
      payScale: "Academic Level 10 (₹57,700 – ₹1,82,400)",
      lastDate: "2026-12-15",
      status: "Active",
      pdfUrl: "/documents/recruitment/advt-06-2026-economics.pdf",
    },
    {
      id: "rec-04",
      advtNo: "KSU/REC/WALKIN/03/2026",
      postTitle: "Walk-in Interview for Guest Faculty in Odia Literature & Botany",
      vacancies: 6,
      department: "Departments of Odia & Botany",
      payScale: "Honorarium as per Higher Education Dept Norms (₹1,500/class)",
      lastDate: "2026-11-20 (Walk-In)",
      status: "Active",
      pdfUrl: "/documents/recruitment/walkin-guest-faculty-nov2026.pdf",
    },
  ];

  const nonTeachingJobs = [
    {
      id: "rec-nt-01",
      advtNo: "KSU/NT/02/2026",
      postTitle: "Senior Technical Assistant (Central Instrumentation Facility)",
      vacancies: 2,
      department: "Central Instrumentation Facility (CIF)",
      payScale: "Pay Level 9 (₹35,400 – ₹1,12,400)",
      lastDate: "2026-11-28",
      status: "Active",
      pdfUrl: "/documents/recruitment/advt-cif-tech-assistant.pdf",
    },
    {
      id: "rec-nt-02",
      advtNo: "KSU/NT/02/2026",
      postTitle: "System Administrator / Network Engineer",
      vacancies: 1,
      department: "ICT & Computer Centre",
      payScale: "Pay Level 10 (₹44,900 – ₹1,42,400)",
      lastDate: "2026-11-28",
      status: "Active",
      pdfUrl: "/documents/recruitment/advt-network-engineer.pdf",
    },
  ];

  return (
    <>
      <Hero variant="compact" title="Recruitment & Careers" imageUrl={collegeHeroUrl(1)} />
      <Breadcrumbs items={[{ label: "Home", href: "/college" }, { label: "Recruitment" }]} />

      <Container className="py-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                Careers at University
              </Badge>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs">
                Online Application Portal
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground">
              Faculty & Staff Recruitment Opportunities
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl">
              Official advertisements, UGC 2018 regulations eligibility criteria, online application forms, and shortlisted candidate notifications.
            </p>
          </div>

          <Button size="sm" asChild className="gap-1.5 text-xs font-bold self-start md:self-auto">
            <a href="https://samarth.edu.in" target="_blank" rel="noreferrer">
              <span>Samarth Recruitment Portal</span>
              <ExternalLink className="size-3" />
            </a>
          </Button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/50 border border-border/70 overflow-x-auto">
          {[
            { id: "teaching", label: "Teaching & Faculty Posts (4 Open)" },
            { id: "non_teaching", label: "Non-Teaching & Technical (2 Open)" },
            { id: "shortlists", label: "Shortlisted Candidates & Results" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id as any)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                tab === item.id
                  ? "bg-card text-primary shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Teaching Positions */}
        {tab === "teaching" && (
          <div className="space-y-3">
            {teachingJobs.map((job) => (
              <Card key={job.id} className="border border-border/60 bg-card p-4 sm:p-5 hover:border-primary/40 shadow-xs transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                        {job.advtNo}
                      </Badge>
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px]">
                        {job.vacancies} Post(s)
                      </Badge>
                      <span className="text-xs text-muted-foreground font-mono">
                        Dept: {job.department}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-foreground">
                      {job.postTitle}
                    </h3>

                    <div className="text-xs text-muted-foreground">
                      <span>Scale of Pay: </span>
                      <strong className="text-foreground">{job.payScale}</strong>
                    </div>

                    <div className="text-[11px] text-rose-600 font-semibold pt-0.5">
                      Application Deadline: {job.lastDate}
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col gap-2 shrink-0">
                    <Button size="xs" variant="outline" asChild className="gap-1.5 text-xs text-primary h-8">
                      <a href={job.pdfUrl} target="_blank" rel="noreferrer">
                        <Download className="size-3" />
                        <span>Advertisement PDF</span>
                      </a>
                    </Button>
                    <Button size="xs" asChild className="gap-1.5 text-xs h-8">
                      <a href="https://samarth.edu.in" target="_blank" rel="noreferrer">
                        <span>Apply Online</span>
                        <ExternalLink className="size-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Non-Teaching Positions */}
        {tab === "non_teaching" && (
          <div className="space-y-3">
            {nonTeachingJobs.map((job) => (
              <Card key={job.id} className="border border-border/60 bg-card p-4 sm:p-5 hover:border-primary/40 shadow-xs transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                        {job.advtNo}
                      </Badge>
                      <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-[10px]">
                        {job.vacancies} Post(s)
                      </Badge>
                      <span className="text-xs text-muted-foreground font-mono">
                        {job.department}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-foreground">
                      {job.postTitle}
                    </h3>

                    <div className="text-xs text-muted-foreground">
                      <span>Scale of Pay: </span>
                      <strong className="text-foreground">{job.payScale}</strong>
                    </div>

                    <div className="text-[11px] text-rose-600 font-semibold pt-0.5">
                      Application Deadline: {job.lastDate}
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col gap-2 shrink-0">
                    <Button size="xs" variant="outline" asChild className="gap-1.5 text-xs text-primary h-8">
                      <a href={job.pdfUrl} target="_blank" rel="noreferrer">
                        <Download className="size-3" />
                        <span>Advertisement PDF</span>
                      </a>
                    </Button>
                    <Button size="xs" asChild className="gap-1.5 text-xs h-8">
                      <a href="https://samarth.edu.in" target="_blank" rel="noreferrer">
                        <span>Apply Online</span>
                        <ExternalLink className="size-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Shortlists & Results */}
        {tab === "shortlists" && (
          <Card className="border border-border/60 bg-card p-5 space-y-4">
            <h3 className="text-sm font-bold text-foreground">
              Eligible Candidates for Written Tests & Interviews
            </h3>
            <div className="divide-y divide-border/40 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-foreground">
                    List of Shortlisted Candidates for Senior Technical Assistant (CIF)
                  </div>
                  <div className="text-muted-foreground text-[11px]">Advt No. KSU/NT/02/2026 · Skill test date: 18-Nov-2026</div>
                </div>
                <Button size="xs" variant="outline" asChild className="text-xs text-primary gap-1">
                  <a href="/documents/recruitment/shortlist-sta.pdf" target="_blank" rel="noreferrer">
                    <Download className="size-3" />
                    <span>Download List (PDF)</span>
                  </a>
                </Button>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-foreground">
                    Final Result: Selection for Post of Junior Assistant (Establishment Branch)
                  </div>
                  <div className="text-muted-foreground text-[11px]">Advt No. KSU/NT/01/2026 · Syndicate Ratified</div>
                </div>
                <Button size="xs" variant="outline" asChild className="text-xs text-primary gap-1">
                  <a href="/documents/recruitment/final-result-ja.pdf" target="_blank" rel="noreferrer">
                    <Download className="size-3" />
                    <span>Download Result (PDF)</span>
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        )}
      </Container>
    </>
  );
}
