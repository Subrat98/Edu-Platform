import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  HelpCircle,
  Search,
  Phone,
  Mail,
  Building2,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  FileQuestion,
} from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/sections/ContactForm";
import { collegeHeroUrl } from "@/mocks/data/images";
import { institutions } from "@/mocks/data/institutions";

export default function AdmissionFaqs() {
  const institution = institutions.college;
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      category: "Eligibility & Application",
      q: "What is the basic eligibility criteria for 4-Year UG Programmes (FYUGP)?",
      a: "Candidates must have passed the Higher Secondary (10+2) Examination from the Council of Higher Secondary Education (CHSE), Odisha or an equivalent examination recognized by CBSE / ICSE with minimum 45% aggregate marks (40% for SC/ST candidates). Subject-specific eligibility (such as Mathematics for Physics/Chemistry honours) applies as detailed in the Prospectus.",
    },
    {
      category: "Eligibility & Application",
      q: "Can students from outside Odisha or other education boards apply?",
      a: "Yes. All applicants passing 10+2 from CBSE, CISCE, National Institute of Open Schooling (NIOS), and other recognized state boards are eligible on par with CHSE Odisha students without any mark reduction. AIU equivalency applies for international school boards.",
    },
    {
      category: "SAMS & Choice Locking",
      q: "How does the SAMS Odisha choice locking and preference system work?",
      a: "Applicants can select up to 5 subject/department choices in order of priority. During choice locking, arrange your most preferred department as Choice 1. If selected in a lower choice in Phase 1, you can exercise the 'Slide-Up' option to automatically upgrade to your higher preference in the second round without losing your current seat.",
    },
    {
      category: "SAMS & Choice Locking",
      q: "What is an Intimation Slip and how do I download it?",
      a: "An Intimation Slip is the official provisional selection letter generated on the SAMS Odisha portal. Once the merit list is published, log into your student dashboard, view your allotted department, and download the color Intimation Slip specifying the reporting date and venue.",
    },
    {
      category: "Reservations & Certificates",
      q: "What documents are required to claim SC / ST / EWS reservation benefits?",
      a: "Applicants must furnish digital caste / EWS certificates issued by a competent revenue authority (Tahasildar / Sub-Collector) through the Odisha e-District portal with a verifiable barcode. Offline handwritten certificates without digital verification codes are not accepted.",
    },
    {
      category: "Reservations & Certificates",
      q: "Is there weightage for NCC, NSS, and Sports achievements?",
      a: "Yes. NCC 'C' certificate holders receive 5% weightage; NCC 'B' certificate holders receive 3% weightage. NSS volunteers who have represented the university at the National Integration Camp receive 3% weightage. State/National medal winners in AIU-recognized sports receive up to 5% direct score additions.",
    },
    {
      category: "Fee Payment & Refunds",
      q: "What should I do if money is debited from my account but the receipt is not generated?",
      a: "If an online payment fails to reflect on SBI Collect or SAMS within 15 minutes, do not make an immediate duplicate transaction. Note your Bank Transaction Reference Number (UTR) and email accounts@ourcollege.edu.in. Reconciliation occurs automatically within 24–48 banking hours.",
    },
    {
      category: "Fee Payment & Refunds",
      q: "How do I apply for a fee refund if I withdraw my admission?",
      a: "Submit a formal written application along with your original admission fee receipt and bank account details (passbook copy / canceled cheque) to the Chairman, P.G. Council / Admission Cell. Refunds are processed via Direct Bank Transfer (NEFT/RTGS) as per UGC percentage refund schedules within 15 working days.",
    },
    {
      category: "Hostels & Campus Services",
      q: "How do I apply for hostel accommodation during the admission process?",
      a: "Hostel accommodation is opted for simultaneously in the online admission form. Allotment is merit-cum-distance based, prioritizing students residing outside a 50 km radius of Bhubaneswar. Shortlisted hostel lists are published within one week of academic commencement.",
    },
    {
      category: "Hostels & Campus Services",
      q: "Are bus passes and subsidized city transit available for admitted students?",
      a: "Yes. Admitted students are eligible for subsidized Capital Region Urban Transport (CRUT) Mo Bus student passes. Institutional concession forms can be endorsed at the Dean of Students' Welfare (DSW) counter upon collecting your permanent college identity card.",
    },
  ];

  const categories = ["All", "Eligibility & Application", "SAMS & Choice Locking", "Reservations & Certificates", "Fee Payment & Refunds", "Hostels & Campus Services"];

  const filteredFaqs = useMemo(() => {
    return faqs.filter((item) => {
      const matchCat = selectedCategory === "All" || item.category === selectedCategory;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.q.toLowerCase().includes(q) ||
        item.a.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [faqs, selectedCategory, search]);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/college" },
          { label: "Admissions", href: "/college/admissions" },
          { label: "Admission FAQs" },
        ]}
      />

      <Hero
        variant="compact"
        title="Admission FAQs & Helpdesk"
        subtitle="Frequently Asked Questions, SAMS Support, Grievance Cell & Counseling Assistance"
        imageUrl={collegeHeroUrl(5)}
      />

      <Container className="py-10 space-y-12">
        {/* Intro */}
        <div className="space-y-4 border-b pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
              Candidate Helpdesk
            </Badge>
            <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs">
              SAMS & Central Admission Cell
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Frequently Asked Questions (FAQs)
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl">
            Find answers to commonly asked questions regarding eligibility criteria, choice locking, reservation guidelines,
            fee payments, intimation slips, and hostel boarding. If you require further assistance, our dedicated admission officers
            are available via phone, email, and at physical campus counters.
          </p>
        </div>

        {/* Helplines Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5 border border-primary/20 bg-primary/5 space-y-1.5">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
              <Phone className="size-4" />
              <span>Central Admission Helpline</span>
            </div>
            <div className="font-bold text-base text-foreground">+91 674 2567210</div>
            <div className="text-[11px] text-muted-foreground">Mon – Sat, 10:00 AM – 5:00 PM</div>
          </Card>

          <Card className="p-5 border border-emerald-500/20 bg-emerald-500/5 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
              <Mail className="size-4" />
              <span>Official Admission Email</span>
            </div>
            <div className="font-mono font-bold text-sm text-foreground truncate">admissions@ourcollege.edu.in</div>
            <div className="text-[11px] text-muted-foreground">Queries answered within 24 hours</div>
          </Card>

          <Card className="p-5 border border-blue-500/20 bg-blue-500/5 space-y-1.5">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
              <Building2 className="size-4" />
              <span>Physical Helpdesk Counter</span>
            </div>
            <div className="font-bold text-sm text-foreground">P.G. Council Building, Counter 1–4</div>
            <div className="text-[11px] text-muted-foreground">Main Campus, Vani Vihar, Bhubaneswar</div>
          </Card>
        </div>

        {/* Search & Categories */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search FAQs by question or keyword…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>
            <span className="text-xs text-muted-foreground">
              Showing {filteredFaqs.length} of {faqs.length} answered questions
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-primary text-white shadow-xs font-bold"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <Card
                key={idx}
                className={`border transition-all overflow-hidden ${
                  isOpen ? "border-primary/50 shadow-sm bg-card" : "border-border/70 bg-card hover:border-primary/30"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-[10px] font-mono text-primary border-primary/20">
                      {faq.category}
                    </Badge>
                    <h3 className="font-bold text-sm sm:text-base text-foreground leading-snug">
                      {faq.q}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`size-4 text-muted-foreground shrink-0 mt-1 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-5 pt-0 border-t border-border/40 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    <p className="pt-3">{faq.a}</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Still have questions enquiry form */}
        <div className="space-y-4 pt-4">
          <div className="border-b pb-2">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <FileQuestion className="size-5 text-primary" />
              Still Have an Admission Question?
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Submit your direct enquiry to the Central Admission Nodal Officer.
            </p>
          </div>
          <ContactForm title="Admission Assistance Enquiry" showInstitutionDetails />
        </div>
      </Container>
    </>
  );
}
