import { useState } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Calendar,
  CheckCircle2,
  FileText,
  AlertCircle,
  ExternalLink,
  Download,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Clock,
  Sparkles,
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
import { useLiveSiteContent } from "@/features/content/siteContentService";

export default function AdmissionApply() {
  const institution = institutions.college;
  const siteContent = useLiveSiteContent("college");
  const adm = siteContent?.admissions;

  const admissionSchedule = [
    { event: "Opening of Online Application (UG & PG)", date: "15 May 2026", status: "Completed" },
    { event: "Last Date for Online Submission of Common Application Form (CAF)", date: "30 June 2026", status: "Active" },
    { event: "Publication of First Provisional Merit List", date: "10 July 2026", status: "Upcoming" },
    { event: "Document Verification & Phase 1 Admission Formalities", date: "15 – 20 July 2026", status: "Upcoming" },
    { event: "Publication of Second Merit List / Waiting List", date: "25 July 2026", status: "Upcoming" },
    { event: "Commencement of Academic Session (Induction & Classes)", date: "01 August 2026", status: "Scheduled" },
  ];

  const applicationSteps = [
    {
      step: "01",
      title: "Online Registration & Profile Creation",
      desc: "Register with a valid mobile number and email ID on SAMS Odisha / University Digital Portal. Receive OTP and create your secure password.",
    },
    {
      step: "02",
      title: "Choice Locking & Programme Selection",
      desc: "Select up to 5 preferred departments and subject combinations across Honours, Electives, and Multidisciplinary Minors under NEP 2020.",
    },
    {
      step: "03",
      title: "Document Uploading & Scrutiny",
      desc: "Upload clear scanned copies of 10th certificate, 10+2 mark sheet, caste/EWS certificate (if applicable), and migration certificates.",
    },
    {
      step: "04",
      title: "Merit Rank & Intimation Slip",
      desc: "Check your merit rank on the publication date. Shortlisted applicants download the official Intimation Slip for reporting.",
    },
    {
      step: "05",
      title: "Physical Verification & Online Fee Payment",
      desc: "Report to the respective PG / UG Department for physical scrutiny, submit CLC/TC in original, and pay the admission fee online.",
    },
  ];

  const reservationRoster = [
    { category: "Scheduled Castes (SC)", quota: "16.25%", criteria: "Valid certificate issued by competent revenue authority (Tahasildar)" },
    { category: "Scheduled Tribes (ST)", quota: "22.50%", criteria: "Valid ST certificate issued by competent authority" },
    { category: "Persons with Disabilities (PwD)", quota: "5.00%", criteria: "Minimum 40% benchmark disability certified by District Medical Board" },
    { category: "Ex-Servicemen / Defense Personnel", quota: "3.00%", criteria: "Discharge book / Zilla Sainik Board certificate" },
    { category: "Economically Weaker Sections (EWS)", quota: "10.00%", criteria: "Income & Asset certificate as per Govt. of Odisha norms" },
    { category: "Sports / NCC / NSS Weightage", quota: "Up to 5%", criteria: "National/State level representation / NCC 'C' or 'B' Certificate" },
  ];

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/college" },
          { label: "Admissions", href: "/college/admissions" },
          { label: "e-Admission Portal" },
        ]}
      />

      <Hero
        variant="compact"
        title="e-Admission Portal 2026–27"
        subtitle="Single-Window Digital Admission Portal for Undergraduate, Postgraduate & Ph.D. Programmes"
        imageUrl={adm?.heroImage || collegeHeroUrl(7)}
      />

      <Container className="py-10 space-y-12">
        {/* Intro Banner */}
        <div className="space-y-4 border-b pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
              SAMS Odisha Integrated
            </Badge>
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs">
              NEP 2020 Multi-Disciplinary Admissions
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Apply Online for 2026–27 Academic Session
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl">
            Welcome to the centralized e-admission portal of {institution.name}. Admissions to all undergraduate (FYUGP 4-Year),
            postgraduate (Master's), and doctoral research programs are conducted through a transparent, merit-based,
            single-window digital counseling process in accordance with Department of Higher Education, Government of Odisha regulations.
          </p>
        </div>

        {/* Action Gateway Card */}
        <Card className="border-2 border-primary/30 bg-primary/5 p-6 sm:p-8 space-y-6 shadow-sm overflow-hidden relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-primary/20 pb-6">
            <div className="space-y-2">
              <Badge className="bg-primary text-white text-[10px] uppercase tracking-wider font-mono">
                Admissions Now Open
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground">
                {adm?.bannerTitle || "Centralized Application Form (CAF) 2026–27"}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                Eligible candidates can apply for multiple programmes using a single Common Application Form.
                Ensure your documents and qualifying marks are ready before beginning.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              <Button asChild size="lg" className="bg-primary text-white font-bold text-sm shadow-md gap-2">
                <a href="https://samsodisha.gov.in" target="_blank" rel="noreferrer">
                  <span>Register on SAMS Odisha</span>
                  <ExternalLink className="size-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary/30 text-primary text-sm gap-2">
                <Link to="/college/admissions/prospectus">
                  <Download className="size-4" />
                  <span>Download Prospectus</span>
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-card border border-primary/20 space-y-1">
              <span className="font-bold text-foreground block">Application Deadline</span>
              <span className="font-mono text-primary font-bold text-sm">{adm?.deadline || "30 June 2026"}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-card border border-primary/20 space-y-1">
              <span className="font-bold text-foreground block">Application Fee</span>
              <span className="text-foreground">General: ₹500 · SC/ST: ₹300</span>
            </div>
            <div className="p-3.5 rounded-xl bg-card border border-primary/20 space-y-1">
              <span className="font-bold text-foreground block">Helpdesk Helpline</span>
              <span className="text-primary font-mono font-bold">+91 674 2567210</span>
            </div>
          </div>
        </Card>

        {/* 5-Step Application Process */}
        <div className="space-y-6">
          <div className="border-b pb-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="size-5 text-primary" />
              Five-Step Online Admission Process
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Step-by-step roadmap from initial online registration to physical departmental verification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {applicationSteps.map((s, idx) => (
              <Card key={idx} className="p-5 border border-border/70 bg-card hover:border-primary/40 transition-all shadow-xs space-y-2">
                <span className="font-mono text-2xl font-black text-primary/40 block">
                  {s.step}
                </span>
                <h3 className="font-bold text-sm text-foreground">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Admission Schedule Table */}
        <div className="space-y-6">
          <div className="border-b pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Calendar className="size-5 text-primary" />
                Important Dates & Admission Schedule 2026–27
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Key statutory deadlines approved by the Central Admission Committee.
              </p>
            </div>
            <Badge variant="outline" className="font-mono text-xs w-fit">
              Session 2026–27
            </Badge>
          </div>

          <Card className="border border-border/70 bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="text-xs font-bold w-16">Sl.</TableHead>
                  <TableHead className="text-xs font-bold">Admission Event / Activity</TableHead>
                  <TableHead className="text-xs font-bold w-44">Date / Timeline</TableHead>
                  <TableHead className="text-xs font-bold text-right w-32">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admissionSchedule.map((row, idx) => (
                  <TableRow key={idx} className="hover:bg-muted/20">
                    <TableCell className="font-mono text-xs text-muted-foreground">{idx + 1}</TableCell>
                    <TableCell className="font-bold text-xs text-foreground">{row.event}</TableCell>
                    <TableCell className="font-mono text-xs text-primary font-semibold">{row.date}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={row.status === "Active" ? "default" : "secondary"}
                        className={`text-[10px] font-mono ${
                          row.status === "Active" ? "bg-emerald-600 text-white" : ""
                        }`}
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Reservation Policy & Quotas */}
        <div className="space-y-6">
          <div className="border-b pb-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" />
              Statutory Reservation Policy & Quotas
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Strict adherence to Government of Odisha reservation statutes and affirmative inclusion mandates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reservationRoster.map((r, i) => (
              <Card key={i} className="p-4 border border-border/70 bg-card space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground">{r.category}</span>
                  <Badge className="bg-primary/10 text-primary border-primary/20 font-mono text-xs">
                    {r.quota}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{r.criteria}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Navigation to Fee Structure & Prospectus */}
        <div className="p-6 rounded-2xl bg-muted/40 border border-border/70 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-base text-foreground">Explore Complete Fee Structure & Prospectuses</h3>
            <p className="text-xs text-muted-foreground">View approved semester fees, online payment gateways, and information brochures.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm" variant="outline" asChild className="gap-1.5 text-xs text-primary border-primary/30">
              <Link to="/college/admissions/prospectus">
                <FileText className="size-3.5" />
                <span>Prospectus Library</span>
              </Link>
            </Button>
            <Button size="sm" asChild className="gap-1.5 bg-primary text-white text-xs font-bold shadow-xs">
              <Link to="/college/admissions/fee-structure">
                <span>Fee Structure & Payment</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
