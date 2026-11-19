import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  Download,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  FileCheck2,
  AlertCircle,
  Receipt,
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

export default function FeeStructure() {
  const institution = institutions.college;
  const [selectedProgramme, setSelectedProgramme] = useState<"ug" | "pg" | "prof" | "phd">("ug");

  const ugFees = [
    { course: "B.A. (Honours) — Humanities & Social Sciences", tuition: "₹1,800", exam: "₹1,200", other: "₹1,450", total: "₹4,450 / Year" },
    { course: "B.Com. (Honours) — Accounting & Finance", tuition: "₹2,200", exam: "₹1,200", other: "₹1,550", total: "₹4,950 / Year" },
    { course: "B.Sc. (Honours) — Physics, Chemistry, Mathematics", tuition: "₹2,800", exam: "₹1,400", other: "₹2,200", total: "₹6,400 / Year" },
    { course: "B.Sc. (Honours) — Botany, Zoology, Biotechnology", tuition: "₹3,200", exam: "₹1,400", other: "₹2,600", total: "₹7,200 / Year" },
    { course: "B.Sc. (Honours) — Computer Science & Data Science", tuition: "₹4,500", exam: "₹1,500", other: "₹3,000", total: "₹9,000 / Year" },
  ];

  const pgFees = [
    { course: "M.A. (All Humanities & Languages Subjects)", tuition: "₹2,400", exam: "₹1,600", other: "₹1,850", total: "₹5,850 / Year" },
    { course: "M.Com. (Finance / Marketing / Taxation)", tuition: "₹3,000", exam: "₹1,600", other: "₹2,050", total: "₹6,650 / Year" },
    { course: "M.Sc. (Physical & Chemical Sciences)", tuition: "₹4,200", exam: "₹1,800", other: "₹3,200", total: "₹9,200 / Year" },
    { course: "M.Sc. (Life Sciences, Biotechnology, Microbiology)", tuition: "₹5,500", exam: "₹1,800", other: "₹3,800", total: "₹11,100 / Year" },
    { course: "M.Sc. (Computer Science / IT)", tuition: "₹7,000", exam: "₹2,000", other: "₹4,200", total: "₹13,200 / Year" },
  ];

  const profFees = [
    { course: "Master of Business Administration (MBA)", tuition: "₹25,000", exam: "₹3,000", other: "₹7,000", total: "₹35,000 / Sem" },
    { course: "Master of Computer Applications (MCA)", tuition: "₹22,000", exam: "₹2,500", other: "₹5,500", total: "₹30,000 / Sem" },
    { course: "Integrated B.Sc. - B.Ed. (4-Year)", tuition: "₹14,000", exam: "₹2,000", other: "₹4,000", total: "₹20,000 / Year" },
    { course: "M.Tech in Computer Science & Engineering", tuition: "₹28,000", exam: "₹3,500", other: "₹8,500", total: "₹40,000 / Sem" },
    { course: "Master of Social Work (MSW)", tuition: "₹12,000", exam: "₹2,000", other: "₹3,500", total: "₹17,500 / Year" },
  ];

  const phdFees = [
    { course: "Ph.D. Registration & Coursework Fee (Arts & Commerce)", tuition: "₹6,000", exam: "₹3,000", other: "₹3,500", total: "₹12,500 (One-time)" },
    { course: "Ph.D. Registration & Coursework Fee (Sciences & Tech)", tuition: "₹8,000", exam: "₹3,500", other: "₹5,500", total: "₹17,000 (One-time)" },
    { course: "Annual Research & Lab Contingency Fee", tuition: "₹3,000", exam: "—", other: "₹2,500", total: "₹5,500 / Year" },
    { course: "Thesis Submission & External Evaluation Fee", tuition: "—", exam: "₹15,000", other: "₹2,000", total: "₹17,000 (At submission)" },
  ];

  const refundPolicies = [
    { timeline: "15 days or more before the officially notified last date", refund: "100%", deduction: "Subject to maximum ₹1,000 processing fee" },
    { timeline: "Less than 15 days before the officially notified last date", refund: "90%", deduction: "10% deduction of aggregate course fee" },
    { timeline: "15 days or less after the officially notified last date", refund: "80%", deduction: "20% deduction of aggregate course fee" },
    { timeline: "30 days or less, but more than 15 days after last date", refund: "50%", deduction: "50% deduction of aggregate course fee" },
    { timeline: "More than 30 days after the officially notified last date", refund: "0%", deduction: "No refund applicable (Caution deposit refundable)" },
  ];

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/college" },
          { label: "Admissions", href: "/college/admissions" },
          { label: "Fee Structure & Payment" },
        ]}
      />

      <Hero
        variant="compact"
        title="Fee Structure & Online Payment"
        subtitle="Approved Government Fee Schedules, Semester Dues & Digital Payment Gateway"
        imageUrl={collegeHeroUrl(4)}
      />

      <Container className="py-10 space-y-12">
        {/* Intro */}
        <div className="space-y-4 border-b pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
              State Government Approved
            </Badge>
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs">
              UGC Fee Refund Norms Compliant
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Academic Fee Schedules for 2026–27 Session
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl">
            {institution.name} upholds affordable, highly subsidized public higher education for all students.
            Tuition fees are structured in accordance with Department of Higher Education, Government of Odisha guidelines.
            Payments can be completed securely through SBI Collect or Odisha Treasury digital portals with instant receipt generation.
          </p>
        </div>

        {/* Digital Payment Gateway Card */}
        <Card className="border-2 border-emerald-500/30 bg-emerald-500/5 p-6 sm:p-8 space-y-6 shadow-sm overflow-hidden relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-500/20 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CreditCard className="size-5 text-emerald-600" />
                <Badge className="bg-emerald-600 text-white text-[10px] uppercase font-mono">
                  Online Payment Active
                </Badge>
              </div>
              <h2 className="text-2xl font-black text-foreground">
                Pay Semester & Admission Fees Online
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                Pay tuition fees, examination dues, hostel charges, and convocation fees using Net Banking, UPI,
                RuPay, Debit Cards, or credit cards through SBI e-Pay.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md gap-2">
                <a href="https://www.onlinesbi.sbi/sbicollect/icollecthome.htm" target="_blank" rel="noreferrer">
                  <CreditCard className="size-4" />
                  <span>Pay via SBI Collect</span>
                  <ExternalLink className="size-3.5" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-emerald-600/30 text-emerald-700 dark:text-emerald-400 text-sm gap-2">
                <Link to="/college/scholarships">
                  <Receipt className="size-4" />
                  <span>View Fee Concessions</span>
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-muted-foreground">
            <div>
              <span className="font-bold text-foreground block">Merchant / Payment Code:</span>
              <span className="font-mono text-primary font-bold">STATE-EDU-OD-VANI-VIHAR</span>
            </div>
            <div>
              <span className="font-bold text-foreground block">Supported Modes:</span>
              <span>UPI (GPay / PhonePe / Paytm), Net Banking, RuPay, Visa, MC</span>
            </div>
            <div>
              <span className="font-bold text-foreground block">Payment Helpdesk:</span>
              <span>accounts@ourcollege.edu.in · +91 674 2567408</span>
            </div>
          </div>
        </Card>

        {/* Programme Filter Tabs */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-3">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Detailed Fee Breakdown by Programme
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Includes tuition fee, semester exam fees, laboratory consumables, and library dues.
              </p>
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/70 overflow-x-auto text-xs">
              {[
                { id: "ug", label: "Undergraduate (UG)" },
                { id: "pg", label: "Post-Graduate (PG)" },
                { id: "prof", label: "Professional & Self-Financing" },
                { id: "phd", label: "Doctoral (Ph.D.)" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedProgramme(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                    selectedProgramme === tab.id
                      ? "bg-card text-primary shadow-xs border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <Card className="border border-border/70 bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="text-xs font-bold">Course / Academic Programme</TableHead>
                  <TableHead className="text-xs font-bold w-28">Tuition Fee</TableHead>
                  <TableHead className="text-xs font-bold w-28">Exam Fee</TableHead>
                  <TableHead className="text-xs font-bold w-32">Other Dues *</TableHead>
                  <TableHead className="text-xs font-bold text-right w-36">Total Dues</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(selectedProgramme === "ug"
                  ? ugFees
                  : selectedProgramme === "pg"
                  ? pgFees
                  : selectedProgramme === "prof"
                  ? profFees
                  : phdFees
                ).map((row, idx) => (
                  <TableRow key={idx} className="hover:bg-muted/20">
                    <TableCell className="font-bold text-xs text-foreground">{row.course}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{row.tuition}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{row.exam}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{row.other}</TableCell>
                    <TableCell className="font-mono text-xs font-bold text-primary text-right">{row.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-3 bg-muted/20 border-t border-border/40 text-[11px] text-muted-foreground">
              * Other dues include Laboratory Consumables, Library Fund, Red Cross, Student Union, Athletic Council, Identity Card, and Refundable Caution Money.
            </div>
          </Card>
        </div>

        {/* UGC Statutory Fee Refund Policy */}
        <div className="space-y-6">
          <div className="border-b pb-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" />
              Statutory Fee Refund Policy (UGC Mandated)
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Transparent percentage refund schedules in compliance with the University Grants Commission notification.
            </p>
          </div>

          <Card className="border border-border/70 bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="text-xs font-bold w-24">Refund %</TableHead>
                  <TableHead className="text-xs font-bold">Formal Withdrawal Request Receipt Timeline</TableHead>
                  <TableHead className="text-xs font-bold text-right w-56">Deduction Rule</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {refundPolicies.map((p, idx) => (
                  <TableRow key={idx} className="hover:bg-muted/20">
                    <TableCell className="font-mono text-xs font-black text-primary">{p.refund}</TableCell>
                    <TableCell className="text-xs text-foreground font-medium">{p.timeline}</TableCell>
                    <TableCell className="text-xs text-muted-foreground text-right">{p.deduction}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Quick Nav */}
        <div className="p-6 rounded-2xl bg-muted/40 border border-border/70 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-base text-foreground">Have Questions Regarding Admissions or Fees?</h3>
            <p className="text-xs text-muted-foreground">Browse frequently asked questions or contact our dedicated admissions helpdesk.</p>
          </div>
          <Button size="sm" asChild className="gap-1.5 bg-primary text-white text-xs font-bold shadow-xs">
            <Link to="/college/admissions/faqs">
              <span>View Admission FAQs</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </Container>
    </>
  );
}
