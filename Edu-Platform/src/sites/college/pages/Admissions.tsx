import { Link } from "react-router-dom";
import {
  GraduationCap,
  FileText,
  CreditCard,
  HelpCircle,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { AdmissionsCTA } from "@/components/sections/AdmissionsCTA";
import { Faq } from "@/components/sections/Faq";
import { Downloads } from "@/components/sections/Downloads";
import { ContactForm } from "@/components/sections/ContactForm";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { collegeHeroUrl } from "@/mocks/data/images";
import { useLiveSiteContent } from "@/features/content/siteContentService";

const faqItems = [
  { id: "f1", question: "What is the eligibility for UG programmes?", answer: "A pass in 10+2 from a recognized board, with subject-specific requirements varying by programme — see each programme's detail page." },
  { id: "f2", question: "Is there an entrance examination?", answer: "Most UG programmes admit on merit based on 10+2 marks; PG programmes may require a department-level interaction." },
  { id: "f3", question: "Are scholarships available?", answer: "Yes — state merit scholarships and institutional fee concessions are available for eligible students. See the Scholarships page." },
  { id: "f4", question: "How do I track my application status?", answer: "Once submitted, your application status can be tracked using your application number through the admissions portal." },
  { id: "f5", question: "Is hostel accommodation available?", answer: "Hostel and transport facilities are managed separately from admissions — contact the administrative office for current availability." },
];

export default function CollegeAdmissions() {
  const siteContent = useLiveSiteContent("college");
  const adm = siteContent?.admissions;

  const admissionPortals = [
    {
      title: "Online e-Admission Portal",
      desc: "Apply online for 4-year FYUGP undergraduate and postgraduate degrees via SAMS Odisha single-window counseling.",
      path: "/college/admissions/apply",
      badge: "Apply Online",
      icon: GraduationCap,
    },
    {
      title: "Prospectus Library",
      desc: "Download official UG, PG, and Ph.D. information brochures, seat matrices, reservation rules, and course syllabi.",
      path: "/college/admissions/prospectus",
      badge: "Brochures & PDF",
      icon: FileText,
    },
    {
      title: "Fee Structure & Payment",
      desc: "Approved government semester fee schedules, category-wise breakdowns, SBI Collect online payment, and UGC refund norms.",
      path: "/college/admissions/fee-structure",
      badge: "Dues & Gateway",
      icon: CreditCard,
    },
    {
      title: "Admission FAQs & Helpdesk",
      desc: "Frequently asked questions regarding eligibility, reservation certificates, choice locking, intimation slips, and hostel boarding.",
      path: "/college/admissions/faqs",
      badge: "Candidate Support",
      icon: HelpCircle,
    },
  ];

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/college" }, { label: "Admissions" }]} />
      <Hero
        variant="compact"
        title={adm?.heroTitle || "Admissions 2026–27"}
        subtitle={adm?.heroSubtitle}
        imageUrl={adm?.heroImage || collegeHeroUrl(7)}
      />

      <Container className="pt-8">
        {/* Admission Portals Directory Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {admissionPortals.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <Card
                key={idx}
                className="p-5 border border-border/70 bg-card hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="size-4" />
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-mono">
                      {sec.badge}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                    {sec.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {sec.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/50">
                  <Button size="xs" variant="ghost" asChild className="w-full justify-between text-xs text-primary font-bold p-0 hover:bg-transparent">
                    <Link to={sec.path}>
                      <span>Open Dedicated Page</span>
                      <ChevronRight className="size-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>

      <AdmissionsCTA
        title={adm?.bannerTitle || "UG & PG admissions are now open"}
        description={adm?.bannerDescription || "Applications for all undergraduate and postgraduate programmes for the 2026–27 session are open. Merit lists are published in phases based on qualifying marks and category reservation norms."}
        deadline={adm?.deadline || "31 July 2026"}
        eligibility={adm?.eligibility || "Varies by programme — see Programmes & Courses"}
        steps={adm?.steps && adm.steps.length > 0 ? adm.steps : [
          "Create your application account and select your programme choices",
          "Upload scanned mark sheets and category/reservation documents",
          "Track your merit status and complete admission formalities online",
        ]}
        ctaLabel="Submit Enquiry"
        ctaHref="#enquiry"
      />

      <Faq items={faqItems} />
      <Downloads institutionId="college" title="Admission Documents" category="Admissions" />
      <div id="enquiry">
        <ContactForm title="Admission Enquiry" showInstitutionDetails />
      </div>
    </>
  );
}
