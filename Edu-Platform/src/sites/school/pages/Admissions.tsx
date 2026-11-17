import { useState } from "react";
import { Link } from "react-router-dom";
import { Hero } from "@/components/sections/Hero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Faq } from "@/components/sections/Faq";
import { ContactForm } from "@/components/sections/ContactForm";
import { schoolHeroUrl } from "@/mocks/data/images";
import {
  GraduationCap,
  Download,
  Calendar,
  CreditCard,
  FileCheck2,
  Users,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

const faqItems = [
  { id: "f1", question: "What is the age criteria for Nursery and Class I admission?", answer: "As per NEP 2020 guidelines, a child must be 3+ years for Nursery and 6+ years for Class I as of 31 March of the academic admission year." },
  { id: "f2", question: "What is the RTE 25% quota process?", answer: "Under Section 12(1)(c) of the Right to Education Act, 25% of seats at the entry level (Nursery/Class I) are reserved for children from economically disadvantaged and weaker sections without any tuition fee, processed through the state RTE portal." },
  { id: "f3", question: "What documents are required for admission?", answer: "Birth Certificate from municipal authority, previous school TC & progress report (for Class II onwards), Aadhaar card copy, blood group report, caste/income certificate (for reserved quota), and 4 passport-size photographs." },
  { id: "f4", question: "Does the school charge any capitation fee or donation?", answer: "No. Strictly prohibited. Our School does not take any donation or capitation fees. All fee components are pre-approved by the School Management Committee." },
  { id: "f5", question: "How can I obtain a Transfer Certificate (TC)?", answer: "Submit a written TC request application along with clearance certificates from the library, laboratory, and accounts desks. The TC is issued within 3 working days." },
];

export default function SchoolAdmissions() {
  const ageCriteria = [
    { classLevel: "Nursery / Pre-School", age: "3 Years to 4 Years", cutoff: "Born between 01.04.2023 and 31.03.2024" },
    { classLevel: "LKG (Lower Kindergarten)", age: "4 Years to 5 Years", cutoff: "Born between 01.04.2022 and 31.03.2023" },
    { classLevel: "UKG (Upper Kindergarten)", age: "5 Years to 6 Years", cutoff: "Born between 01.04.2021 and 31.03.2022" },
    { classLevel: "Class I (Foundational Stage 2)", age: "6 Years to 7 Years", cutoff: "Completed 6 Years as on 31.03.2027" },
    { classLevel: "Classes II to VIII", age: "Corresponding Age Criteria", cutoff: "TC & Report Card of recognized school" },
    { classLevel: "Classes IX & XI", age: "Secondary / Sr. Secondary", cutoff: "Registration & CBSE qualifying marks" },
  ];

  const feeStructure = [
    { grade: "Pre-Primary (Nursery, LKG, UKG)", tuitionPerMonth: "₹1,200", annualCompositeFee: "₹14,400", labActivity: "Included" },
    { grade: "Primary (Classes I to V)", tuitionPerMonth: "₹1,500", annualCompositeFee: "₹18,000", labActivity: "₹1,200 / yr" },
    { grade: "Middle (Classes VI to VIII)", tuitionPerMonth: "₹1,800", annualCompositeFee: "₹21,600", labActivity: "₹1,800 / yr" },
    { grade: "Secondary (Classes IX & X)", tuitionPerMonth: "₹2,100", annualCompositeFee: "₹25,200", labActivity: "₹2,400 / yr" },
    { grade: "Sr. Secondary Science (XI & XII)", tuitionPerMonth: "₹2,600", annualCompositeFee: "₹31,200", labActivity: "₹3,600 / yr" },
    { grade: "Sr. Secondary Commerce/Arts", tuitionPerMonth: "₹2,400", annualCompositeFee: "₹28,800", labActivity: "₹2,000 / yr" },
  ];

  return (
    <>
      <Hero
        variant="compact"
        title="Admissions 2026–27"
        subtitle="Transparent Admissions, Age Criteria under NEP 2020, RTE 25% Reserved Quota & Approved Fee Schedule"
        imageUrl={schoolHeroUrl(4)}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/school" }, { label: "Admissions" }]} />

      <Container className="py-10 space-y-10">
        {/* RTE 25% Reserved Quota Notification Strip */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-600 text-white font-bold text-xs uppercase px-2 py-0.5">
                RTE Section 12(1)(c)
              </Badge>
              <span className="text-xs font-bold text-amber-900 dark:text-amber-200">25% Free Seats for Weaker & Disadvantaged Groups</span>
            </div>
            <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
              In accordance with the Right of Children to Free and Compulsory Education Act 2009, 25% of entry-level seats are reserved without tuition or admission charges for eligible disadvantaged children residing within the neighborhood radius.
            </p>
          </div>
          <Button asChild size="sm" variant="outline" className="border-amber-600 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 text-xs font-bold shrink-0">
            <a href="https://rteparadarshi.odisha.gov.in" target="_blank" rel="noreferrer">
              <span>Odisha RTE Portal</span>
              <ExternalLink className="size-3.5 ml-1" />
            </a>
          </Button>
        </div>

        {/* Age Criteria Table as per NEP 2020 */}
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h2 className="text-lg font-bold text-foreground">Class-wise Age Eligibility (NEP 2020 Guidelines)</h2>
            <p className="text-xs text-muted-foreground">Cut-off date calculated strictly as on 31st March 2027.</p>
          </div>

          <div className="border rounded-xl overflow-hidden bg-card shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/80 text-foreground font-bold border-b">
                <tr>
                  <th className="p-3">Class / Level</th>
                  <th className="p-3">Prescribed Age Limit</th>
                  <th className="p-3">Date of Birth Window / Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ageCriteria.map((row) => (
                  <tr key={row.classLevel} className="hover:bg-muted/30">
                    <td className="p-3 font-bold text-foreground">{row.classLevel}</td>
                    <td className="p-3 font-semibold text-primary">{row.age}</td>
                    <td className="p-3 text-muted-foreground">{row.cutoff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fee Structure Table */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-2">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <CreditCard className="size-4 text-emerald-600" />
                <span>Approved Fee Structure (Session 2026–27)</span>
              </h2>
              <p className="text-xs text-muted-foreground">Approved by the School Management Committee; payable quarterly or monthly.</p>
            </div>
            <Button asChild size="sm" variant="outline" className="text-xs font-semibold gap-1.5">
              <a href="/documents/school/disclosure/Fee_Structure_2026_27.pdf" download>
                <Download className="size-3.5" />
                <span>Download Fee PDF</span>
              </a>
            </Button>
          </div>

          <div className="border rounded-xl overflow-hidden bg-card shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/80 text-foreground font-bold border-b">
                <tr>
                  <th className="p-3">Grade / Class Level</th>
                  <th className="p-3">Tuition Fee (Monthly)</th>
                  <th className="p-3">Composite Annual Tuition</th>
                  <th className="p-3">Lab & Atal Tinkering Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {feeStructure.map((f) => (
                  <tr key={f.grade} className="hover:bg-muted/30">
                    <td className="p-3 font-bold text-foreground">{f.grade}</td>
                    <td className="p-3 font-mono font-semibold text-primary">{f.tuitionPerMonth}</td>
                    <td className="p-3 font-mono font-bold text-foreground">{f.annualCompositeFee}</td>
                    <td className="p-3 text-muted-foreground">{f.labActivity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-muted-foreground italic">
            * Note: Concessions are available for siblings and children of defense/police martyrs as per school policy.
          </p>
        </div>

        {/* Transfer Certificate (TC) Issuance Procedure */}
        <div className="p-5 rounded-2xl border bg-card space-y-3 shadow-xs">
          <div className="font-bold text-sm text-foreground flex items-center gap-2">
            <FileCheck2 className="size-4 text-primary" />
            <span>Transfer Certificate (TC) Issuance Procedure</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs text-muted-foreground">
            <div className="p-3 rounded-lg bg-muted/40 border space-y-1">
              <strong className="text-foreground block">Step 1: Application</strong>
              <span>Submit a handwritten or downloaded TC application form signed by parent.</span>
            </div>
            <div className="p-3 rounded-lg bg-muted/40 border space-y-1">
              <strong className="text-foreground block">Step 2: Clearances</strong>
              <span>Obtain clearance slips from Library, Science Labs, and Accounts desk.</span>
            </div>
            <div className="p-3 rounded-lg bg-muted/40 border space-y-1">
              <strong className="text-foreground block">Step 3: Verification</strong>
              <span>Academic records and CBSE registration verified by Examination In-charge.</span>
            </div>
            <div className="p-3 rounded-lg bg-muted/40 border space-y-1">
              <strong className="text-foreground block">Step 4: Issue</strong>
              <span>Original TC signed by Principal issued within 3 working days.</span>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <Faq items={faqItems} />

        {/* Admission Enquiry Form */}
        <div id="enquiry">
          <ContactForm title="Online Admission Enquiry (Session 2026–27)" showInstitutionDetails />
        </div>
      </Container>
    </>
  );
}
