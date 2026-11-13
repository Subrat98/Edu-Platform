import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileCheck2,
  Download,
  ExternalLink,
  ShieldCheck,
  Building2,
  Calendar,
  Users,
  Award,
  CheckCircle2,
  FileText,
  AlertCircle,
  Video,
  Eye,
  Search,
  Phone,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/common/Container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Hero } from "@/components/sections/Hero";
import { schoolHeroUrl } from "@/mocks/data/images";

export default function SchoolMandatoryDisclosure() {
  const [activeTab, setActiveTab] = useState<"A" | "B" | "C" | "D" | "E">("A");
  const [staffFilter, setStaffFilter] = useState<string>("ALL");

  const generalInfo = [
    { sNo: 1, label: "Name of the School", value: "OUR SCHOOL" },
    { sNo: 2, label: "Affiliation No. (CBSE)", value: "3330123 (Senior Secondary Level)" },
    { sNo: 3, label: "School Code (CBSE)", value: "15234" },
    { sNo: 4, label: "UDISE+ School Code", value: "21160401201 (School & Mass Education, Odisha)" },
    { sNo: 5, label: "Complete Address with PIN Code", value: "Khandapara Road, Near Bus Stand, Khandapara, Nayagarh District, Odisha — 752054" },
    { sNo: 6, label: "Principal Name & Qualification", value: "Smt. Sunita Mohanty, M.Sc. (Physics), B.Ed., CTET Qualified" },
    { sNo: 7, label: "School Official Email ID", value: "info@ourschool.edu.in / principal@ourschool.edu.in" },
    { sNo: 8, label: "Contact Details (Phone / Mobile)", value: "+91 98765 43210 / 06757-223456" },
  ];

  const documents = [
    {
      sNo: 1,
      docName: "Copies of Affiliation / Upgradation Letter & Recent Extension",
      issuingAuthority: "Central Board of Secondary Education (CBSE), New Delhi",
      validity: "Valid through 31.03.2029",
      fileSize: "1.4 MB PDF",
      fileUrl: "/documents/school/disclosure/CBSE_Affiliation_Extension_Letter_2029.pdf",
    },
    {
      sNo: 2,
      docName: "Copy of Societies / Trust Registration / Renewal Certificate",
      issuingAuthority: "Registrar of Societies, Govt. of Odisha (Reg No. 1422/1998)",
      validity: "Permanent / In Effect",
      fileSize: "920 KB PDF",
      fileUrl: "/documents/school/disclosure/Society_Registration_Certificate.pdf",
    },
    {
      sNo: 3,
      docName: "Copy of No Objection Certificate (NOC) from State Government",
      issuingAuthority: "School & Mass Education Department, Govt. of Odisha (Letter No. 1842/SME)",
      validity: "Unconditional Permanent NOC",
      fileSize: "1.1 MB PDF",
      fileUrl: "/documents/school/disclosure/Odisha_Govt_NOC_School.pdf",
    },
    {
      sNo: 4,
      docName: "Copy of Recognition Certificate under RTE Act, 2009",
      issuingAuthority: "District Education Officer (DEO), Nayagarh, Odisha",
      validity: "Valid through 31.03.2027",
      fileSize: "850 KB PDF",
      fileUrl: "/documents/school/disclosure/RTE_Act_Recognition_Nayagarh.pdf",
    },
    {
      sNo: 5,
      docName: "Copy of Valid Building Safety Certificate (NBC 2016)",
      issuingAuthority: "Executive Engineer, R&B Division, Works Dept., Govt. of Odisha",
      validity: "Valid through 30.06.2028",
      fileSize: "1.8 MB PDF",
      fileUrl: "/documents/school/disclosure/Building_Safety_Certificate_NBC.pdf",
    },
    {
      sNo: 6,
      docName: "Copy of Valid Fire Safety Certificate",
      issuingAuthority: "Directorate of Fire & Emergency Services, Odisha (Cert No. FS-2025-OD-781)",
      validity: "Valid through 15.04.2028",
      fileSize: "1.3 MB PDF",
      fileUrl: "/documents/school/disclosure/Fire_Safety_Certificate_Odisha.pdf",
    },
    {
      sNo: 7,
      docName: "Copy of DEO Certificate Submitted for Extension / Self-Certification",
      issuingAuthority: "District Education Officer, Nayagarh & Management Self-Certification",
      validity: "Certified 2026",
      fileSize: "1.5 MB PDF",
      fileUrl: "/documents/school/disclosure/DEO_Self_Certification_Appendix_III.pdf",
    },
    {
      sNo: 8,
      docName: "Copies of Valid Drinking Water, Health and Sanitation Certificates",
      issuingAuthority: "District Public Health Engineering Laboratory & CHC Medical Officer",
      validity: "Valid through 31.05.2027",
      fileSize: "1.2 MB PDF",
      fileUrl: "/documents/school/disclosure/Water_Health_Sanitation_Report.pdf",
    },
  ];

  const resultsClassX = [
    { year: "2023-24", registered: 98, appeared: 98, passed: 98, passPct: "100.0%", remarks: "School Avg 81.4% · 18 scored above 90%" },
    { year: "2024-25", registered: 104, appeared: 104, passed: 102, passPct: "98.1%", remarks: "School Avg 82.8% · 24 scored above 90%" },
    { year: "2025-26", registered: 110, appeared: 110, passed: 109, passPct: "99.1%", remarks: "School Topper 97.8% · District 2nd Rank" },
  ];

  const resultsClassXII = [
    { year: "2023-24", registered: 65, appeared: 65, passed: 63, passPct: "96.9%", remarks: "Science 97.5% · Commerce 96.0%" },
    { year: "2024-25", registered: 72, appeared: 72, passed: 71, passPct: "98.6%", remarks: "14 Students qualified JEE / NEET" },
    { year: "2025-26", registered: 80, appeared: 80, passed: 79, passPct: "98.8%", remarks: "Science Topper 96.4% · Commerce 95.8%" },
  ];

  const smcMembers = [
    { name: "Dr. P. K. Mohapatra", role: "President / Chairman", category: "Educationist & Former Principal" },
    { name: "Smt. Sunita Mohanty", role: "Member Secretary", category: "Principal, Our School" },
    { name: "Shri Bipin Bihari Nayak", role: "Member (Parent)", category: "Parent Representative" },
    { name: "Smt. Manorama Rout", role: "Member (Parent)", category: "Mother Representative (RTE Category)" },
    { name: "Shri Ashok Kumar Sahoo", role: "Member (Teacher)", category: "Senior PGT (Mathematics)" },
    { name: "Smt. Jayanti Das", role: "Member (Teacher)", category: "TGT (Science)" },
    { name: "Dr. Alaka Mishra", role: "Member (Educationist)", category: "Prof. of Education, Utkal University" },
    { name: "District Education Officer / Nominee", role: "Ex-Officio Member", category: "Dept. of School & Mass Education" },
    { name: "Local Sarpanch / Ward Member", role: "Local Authority", category: "Elected Local Body Representative" },
  ];

  const teachingStaff = [
    { name: "Smt. Sunita Mohanty", role: "Principal", category: "Admin", qualification: "M.Sc. (Physics), B.Ed., CTET", exp: "22 Years" },
    { name: "Shri Ramesh Chandra Swain", role: "Vice-Principal / PGT", category: "PGT", qualification: "M.A. (English), M.Ed.", exp: "18 Years" },
    { name: "Shri Ashok Kumar Sahoo", role: "PGT Mathematics", category: "PGT", qualification: "M.Sc. (Math), B.Ed.", exp: "15 Years" },
    { name: "Dr. Subhashree Dash", role: "PGT Chemistry", category: "PGT", qualification: "Ph.D., M.Sc., B.Ed.", exp: "12 Years" },
    { name: "Shri Bikash Kumar Panda", role: "PGT Physics", category: "PGT", qualification: "M.Sc. (Physics), B.Ed.", exp: "10 Years" },
    { name: "Smt. Priyadarshini Jena", role: "PGT Biology", category: "PGT", qualification: "M.Sc. (Botany), B.Ed.", exp: "11 Years" },
    { name: "Shri Debidatta Mohanty", role: "PGT Computer Science", category: "PGT", qualification: "MCA, B.Ed.", exp: "9 Years" },
    { name: "Smt. Jayanti Das", role: "TGT Science", category: "TGT", qualification: "B.Sc. (PCM), B.Ed., OTET", exp: "8 Years" },
    { name: "Shri Sanjib Kumar Rout", role: "TGT Social Science", category: "TGT", qualification: "M.A. (History), B.Ed.", exp: "11 Years" },
    { name: "Smt. Tapaswini Samal", role: "TGT Odia", category: "TGT", qualification: "M.A. (Odia), B.Ed.", exp: "7 Years" },
    { name: "Shri Manoranjan Das", role: "Special Educator", category: "Special", qualification: "M.Ed. (Special Education), RCI Regd.", exp: "9 Years" },
    { name: "Dr. Arpita Pattnaik", role: "Counsellor & Wellness Teacher", category: "Counsellor", qualification: "M.A. Psychology, PGDCG", exp: "8 Years" },
    { name: "Shri Rajesh Kumar Behera", role: "Physical Education Teacher (PET)", category: "PET", qualification: "M.P.Ed., NIS Coach", exp: "10 Years" },
    { name: "Smt. Geetanjali Biswal", role: "PRT Primary English/EVS", category: "PRT", qualification: "B.A., D.El.Ed., CTET", exp: "6 Years" },
    { name: "Shri Satyajit Tripathy", role: "PRT Primary Math", category: "PRT", qualification: "B.Sc., D.El.Ed.", exp: "5 Years" },
  ];

  const infrastructureData = [
    { sNo: 1, item: "Total Campus Area of the School", details: "16,187 sq. metres (4.00 Acres)" },
    { sNo: 2, item: "Built-up Area of School Building", details: "4,820 sq. metres (Pucca RCC 3-Storey Structure)" },
    { sNo: 3, item: "Area of Playground", details: "8,200 sq. metres (Dedicated Athletics, Football, Cricket, Kho-Kho)" },
    { sNo: 4, item: "Number & Size of Classrooms", details: "36 Classrooms · 48.0 sq. metres (516 sq. ft) each" },
    { sNo: 5, item: "Composite Science Laboratory", details: "1 Lab · 75.0 sq. metres (Fully equipped for Classes VI-X)" },
    { sNo: 6, item: "Physics, Chemistry & Biology Labs", details: "3 Senior Labs · 82.0 sq. metres each with gas pipelines and fume hood" },
    { sNo: 7, item: "Atal Tinkering Lab (ATL - NITI Aayog)", details: "1 Innovation Lab · 110.0 sq. metres (Robotics, 3D Printer, IoT kits)" },
    { sNo: 8, item: "Computer / ICT Laboratory", details: "1 Lab · 95.0 sq. metres (42 Multimedia PC nodes, LAN & 100 Mbps fiber)" },
    { sNo: 9, item: "Central School Library", details: "1 Library · 115.0 sq. metres (8,500+ books, 15 periodicals, Koha OPAC)" },
    { sNo: 10, item: "Internet Facility & Bandwidth", details: "Yes · 100 Mbps dedicated BSNL optical fiber leased line" },
    { sNo: 11, item: "Number of Girls' Toilets & Urinals", details: "18 Urinals & Toilets (with sanitary napkin incinerator & dispenser)" },
    { sNo: 12, item: "Number of Boys' Toilets & Urinals", details: "18 Urinals & Toilets (clean running water & daily sanitation logs)" },
    { sNo: 13, item: "Toilets for Children with Special Needs (CWSN)", details: "4 Disabled-friendly accessible toilets with support handrails" },
    { sNo: 14, item: "Barrier-Free Access / Ramps / Lifts", details: "Permanent gentle slope ramps connecting ground and upper floor levels" },
    { sNo: 15, item: "RO Drinking Water Plants", details: "3 Commercial RO filtration units with water coolers (1,000 LPH capacity)" },
    { sNo: 16, item: "Inspection Video of School Infrastructure", details: "Official YouTube video walkthrough certified during affiliation renewal" },
  ];

  const filteredStaff = teachingStaff.filter((s) => {
    if (staffFilter === "ALL") return true;
    if (staffFilter === "PGT") return s.category === "PGT";
    if (staffFilter === "TGT") return s.category === "TGT";
    if (staffFilter === "PRT") return s.category === "PRT";
    if (staffFilter === "SUPPORT") return s.category === "Special" || s.category === "Counsellor" || s.category === "PET";
    return true;
  });

  return (
    <>
      <Hero
        variant="compact"
        title="Mandatory Public Disclosure"
        subtitle="Mandatory Statutory Disclosures under CBSE Affiliation Bye-Laws (Appendix IX) & GIGW 3.0"
        imageUrl={schoolHeroUrl(1)}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/school" }, { label: "Mandatory Public Disclosure" }]} />

      <Container className="py-10 space-y-8">
        {/* Compliance Header Card */}
        <Card className="border-2 border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-background to-amber-500/5 shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-amber-500 text-slate-950 font-black text-xs uppercase px-2 py-0.5 shadow-xs">
                    CBSE Appendix IX (Circular 1/2026)
                  </Badge>
                  <Badge variant="outline" className="border-emerald-600 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="size-3" />
                    Self-Attested & Complete
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    Last Verified: 12 January 2026
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-foreground">
                  Our School — Statutory Transparency Dossier
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
                  Published in compliance with CBSE Affiliation Bye-Laws (Clauses 2.3.8, 2.4.9, 14.5), Right to Education (RTE) Act 2009, and Guidelines for Indian Government Websites (GIGW 3.0). Every document link connects to a self-attested certified digital copy.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full lg:w-auto">
                <Button asChild className="gap-2 bg-primary font-bold text-xs shadow-md">
                  <a href="/documents/school/disclosure/Consolidated_Appendix_IX_Dossier_2026.pdf" download>
                    <Download className="size-4" />
                    <span>Download Full Dossier (PDF)</span>
                  </a>
                </Button>
                <Button asChild variant="outline" className="gap-2 text-xs font-semibold">
                  <a href="https://cbse.gov.in" target="_blank" rel="noreferrer">
                    <span>CBSE SARAS Portal</span>
                    <ExternalLink className="size-3.5" />
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section Navigation Tabs (A through E) */}
        <div className="flex flex-wrap items-center gap-2 border-b pb-3">
          {[
            { id: "A", label: "A. General Information", count: "8 Items" },
            { id: "B", label: "B. Documents & Information", count: "8 Certificates" },
            { id: "C", label: "C. Results & Academics", count: "3 Years Data" },
            { id: "D", label: "D. Staff (Teaching)", count: "48 Faculty" },
            { id: "E", label: "E. School Infrastructure", count: "16 Parameters" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === tab.id ? "bg-white/20 text-white" : "bg-background/80 text-foreground"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* SECTION A: General Information */}
        {activeTab === "A" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">A. General Information</h2>
                <p className="text-xs text-muted-foreground">Official identification and contact parameters registered with CBSE & UDISE+.</p>
              </div>
              <Badge variant="outline" className="text-xs">Section A Norms</Badge>
            </div>

            <div className="border rounded-xl overflow-hidden bg-card shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/80 text-foreground font-bold border-b">
                  <tr>
                    <th className="p-3 w-16 text-center">S.No.</th>
                    <th className="p-3 w-1/3">Information Parameter</th>
                    <th className="p-3">Details / Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {generalInfo.map((item) => (
                    <tr key={item.sNo} className="hover:bg-muted/30">
                      <td className="p-3 text-center font-mono text-muted-foreground font-semibold">{item.sNo}</td>
                      <td className="p-3 font-semibold text-foreground">{item.label}</td>
                      <td className="p-3 font-medium text-foreground">{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION B: Documents and Information */}
        {activeTab === "B" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">B. Documents and Information</h2>
                <p className="text-xs text-muted-foreground">Self-attested copies of statutory recognitions, safety certificates, and government permissions.</p>
              </div>
              <Badge className="bg-emerald-600 text-white text-xs">All 8 Uploaded</Badge>
            </div>

            <div className="border rounded-xl overflow-hidden bg-card shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/80 text-foreground font-bold border-b">
                  <tr>
                    <th className="p-3 w-14 text-center">S.No.</th>
                    <th className="p-3 w-2/5">Statutory Document / Certificate</th>
                    <th className="p-3 hidden sm:table-cell">Issuing Authority & Validity</th>
                    <th className="p-3 text-right">Upload Proof</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {documents.map((doc) => (
                    <tr key={doc.sNo} className="hover:bg-muted/30">
                      <td className="p-3 text-center font-mono text-muted-foreground font-semibold">{doc.sNo}</td>
                      <td className="p-3">
                        <div className="font-bold text-foreground">{doc.docName}</div>
                        <div className="text-[11px] text-muted-foreground sm:hidden mt-0.5">
                          {doc.issuingAuthority} · <span className="font-medium text-emerald-600">{doc.validity}</span>
                        </div>
                      </td>
                      <td className="p-3 hidden sm:table-cell">
                        <div className="text-foreground font-medium">{doc.issuingAuthority}</div>
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="size-3" />
                          <span>{doc.validity}</span>
                        </div>
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <Button asChild size="sm" variant="outline" className="gap-1.5 h-8 text-xs font-semibold hover:border-primary">
                          <a href={doc.fileUrl} download>
                            <Download className="size-3 text-primary" />
                            <span>Download PDF</span>
                            <span className="text-[10px] text-muted-foreground">({doc.fileSize})</span>
                          </a>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
              <AlertCircle className="size-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <span>
                <strong>CBSE Circular Mandate:</strong> The school uploads the self-attested copies of the above documents signed by the Principal and Chairman of the Trust/Society. In case any certificate is found defective or non-genuine, affiliation is liable to be cancelled as per CBSE bye-laws.
              </span>
            </div>
          </div>
        )}

        {/* SECTION C: Results and Academics */}
        {activeTab === "C" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">C. Results and Academics</h2>
              <p className="text-xs text-muted-foreground">Fee structure, annual academic calendar, governance committees, and last 3 years board examination performance.</p>
            </div>

            {/* Quick Academics Downloads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border border-border/70 p-4 space-y-2 bg-card">
                <span className="text-xs font-bold text-foreground block">Fee Structure 2026-27</span>
                <p className="text-[11px] text-muted-foreground">Class-wise tuition, admission & lab fees approved by SMC.</p>
                <Button asChild size="sm" variant="outline" className="w-full text-xs gap-1.5">
                  <a href="/documents/school/disclosure/Fee_Structure_2026_27.pdf" download>
                    <Download className="size-3" />
                    <span>Download Fee PDF</span>
                  </a>
                </Button>
              </Card>

              <Card className="border border-border/70 p-4 space-y-2 bg-card">
                <span className="text-xs font-bold text-foreground block">Academic Calendar 2026-27</span>
                <p className="text-[11px] text-muted-foreground">220 working days, term exams, holidays, activities.</p>
                <Button asChild size="sm" variant="outline" className="w-full text-xs gap-1.5">
                  <a href="/documents/school/disclosure/Academic_Calendar_2026_27.pdf" download>
                    <Download className="size-3" />
                    <span>Download Calendar</span>
                  </a>
                </Button>
              </Card>

              <Card className="border border-border/70 p-4 space-y-2 bg-card">
                <span className="text-xs font-bold text-foreground block">SMC Committee Members</span>
                <p className="text-[11px] text-muted-foreground">16 Members constituted under Section 21 of RTE Act 2009.</p>
                <Button asChild size="sm" variant="outline" className="w-full text-xs gap-1.5">
                  <a href="/documents/school/disclosure/SMC_Member_List_2026.pdf" download>
                    <Download className="size-3" />
                    <span>Download SMC List</span>
                  </a>
                </Button>
              </Card>

              <Card className="border border-border/70 p-4 space-y-2 bg-card">
                <span className="text-xs font-bold text-foreground block">PTA Executive Committee</span>
                <p className="text-[11px] text-muted-foreground">Parent-Teacher Association executive list & quarterly PTMs.</p>
                <Button asChild size="sm" variant="outline" className="w-full text-xs gap-1.5">
                  <a href="/documents/school/disclosure/PTA_Executive_List_2026.pdf" download>
                    <Download className="size-3" />
                    <span>Download PTA List</span>
                  </a>
                </Button>
              </Card>
            </div>

            {/* Board Results Tables: Class X & Class XII */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Award className="size-4 text-primary" />
                <span>Last Three Years' Board Examination Results (Class X)</span>
              </h3>
              <div className="border rounded-xl overflow-hidden bg-card shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/80 text-foreground font-bold border-b">
                    <tr>
                      <th className="p-3">Academic Year</th>
                      <th className="p-3 text-center">No. of Registered Students</th>
                      <th className="p-3 text-center">No. of Students Passed</th>
                      <th className="p-3 text-center">Pass Percentage</th>
                      <th className="p-3">Remarks / Academic Highlights</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {resultsClassX.map((r) => (
                      <tr key={r.year} className="hover:bg-muted/30">
                        <td className="p-3 font-bold text-foreground">{r.year}</td>
                        <td className="p-3 text-center font-mono">{r.registered}</td>
                        <td className="p-3 text-center font-mono">{r.passed}</td>
                        <td className="p-3 text-center">
                          <Badge className="bg-emerald-600 text-white font-bold text-xs">{r.passPct}</Badge>
                        </td>
                        <td className="p-3 text-muted-foreground">{r.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Award className="size-4 text-primary" />
                <span>Last Three Years' Board Examination Results (Class XII)</span>
              </h3>
              <div className="border rounded-xl overflow-hidden bg-card shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/80 text-foreground font-bold border-b">
                    <tr>
                      <th className="p-3">Academic Year</th>
                      <th className="p-3 text-center">No. of Registered Students</th>
                      <th className="p-3 text-center">No. of Students Passed</th>
                      <th className="p-3 text-center">Pass Percentage</th>
                      <th className="p-3">Remarks / Academic Highlights</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {resultsClassXII.map((r) => (
                      <tr key={r.year} className="hover:bg-muted/30">
                        <td className="p-3 font-bold text-foreground">{r.year}</td>
                        <td className="p-3 text-center font-mono">{r.registered}</td>
                        <td className="p-3 text-center font-mono">{r.passed}</td>
                        <td className="p-3 text-center">
                          <Badge className="bg-emerald-600 text-white font-bold text-xs">{r.passPct}</Badge>
                        </td>
                        <td className="p-3 text-muted-foreground">{r.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SECTION D: Staff (Teaching) */}
        {activeTab === "D" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-foreground">D. Staff (Teaching)</h2>
                <p className="text-xs text-muted-foreground">Certified teaching faculty directory categorized by PGT, TGT, PRT, Special Educator, and Wellness Teacher.</p>
              </div>
              <Button asChild size="sm" variant="outline" className="gap-1.5 text-xs font-semibold">
                <a href="/documents/school/disclosure/Faculty_Staff_Qualification_List_2026.pdf" download>
                  <Download className="size-3.5" />
                  <span>Download Complete Staff Matrix</span>
                </a>
              </Button>
            </div>

            {/* Teaching Statistics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3 rounded-xl border bg-card text-center space-y-1">
                <div className="text-xl font-black text-primary">48</div>
                <div className="text-[11px] text-muted-foreground font-medium">Total Teachers</div>
              </div>
              <div className="p-3 rounded-xl border bg-card text-center space-y-1">
                <div className="text-xl font-black text-foreground">14</div>
                <div className="text-[11px] text-muted-foreground font-medium">PGTs</div>
              </div>
              <div className="p-3 rounded-xl border bg-card text-center space-y-1">
                <div className="text-xl font-black text-foreground">18</div>
                <div className="text-[11px] text-muted-foreground font-medium">TGTs</div>
              </div>
              <div className="p-3 rounded-xl border bg-card text-center space-y-1">
                <div className="text-xl font-black text-foreground">16</div>
                <div className="text-[11px] text-muted-foreground font-medium">PRTs</div>
              </div>
              <div className="p-3 rounded-xl border bg-card text-center space-y-1">
                <div className="text-xl font-black text-emerald-600">1.5 : 1</div>
                <div className="text-[11px] text-muted-foreground font-medium">Teacher-Section Ratio</div>
              </div>
              <div className="p-3 rounded-xl border bg-card text-center space-y-1">
                <div className="text-xl font-black text-purple-600">100%</div>
                <div className="text-[11px] text-muted-foreground font-medium">Trained & B.Ed.</div>
              </div>
            </div>

            {/* Special Roles Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border border-border/70 p-4 space-y-2 bg-card">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Details of Special Educator</span>
                  <Badge variant="outline" className="text-[10px]">RCI Registered</Badge>
                </div>
                <div className="text-xs font-semibold text-primary">Shri Manoranjan Das</div>
                <p className="text-xs text-muted-foreground">
                  Qualification: M.Ed. in Special Education (Mental Retardation / LD) · Rehabilitation Council of India (RCI) Central CRR No. A42190. Appointed for inclusive education and barrier-free learning.
                </p>
              </Card>

              <Card className="border border-border/70 p-4 space-y-2 bg-card">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Details of Counsellor and Wellness Teacher</span>
                  <Badge variant="outline" className="text-[10px]">Psychology & Guidance</Badge>
                </div>
                <div className="text-xs font-semibold text-primary">Dr. Arpita Pattnaik</div>
                <p className="text-xs text-muted-foreground">
                  Qualification: M.A. in Clinical Psychology, Post Graduate Diploma in Guidance & Counselling (NCERT). Dedicated to mental health, adolescent guidance, and examination stress management.
                </p>
              </Card>
            </div>

            {/* Filterable Staff List Table */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs font-bold text-foreground">Sample Faculty Directory (15 of 48 shown):</div>
                <div className="flex items-center gap-1">
                  {["ALL", "PGT", "TGT", "PRT", "SUPPORT"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setStaffFilter(cat)}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                        staffFilter === cat
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border rounded-xl overflow-hidden bg-card shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/80 text-foreground font-bold border-b">
                    <tr>
                      <th className="p-3">Staff Name</th>
                      <th className="p-3">Designation / Role</th>
                      <th className="p-3">Academic & Professional Qualification</th>
                      <th className="p-3 text-center">Experience</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredStaff.map((staff, idx) => (
                      <tr key={idx} className="hover:bg-muted/30">
                        <td className="p-3 font-bold text-foreground">{staff.name}</td>
                        <td className="p-3">
                          <span className="font-semibold text-primary">{staff.role}</span>
                          <span className="ml-1 text-[10px] text-muted-foreground">({staff.category})</span>
                        </td>
                        <td className="p-3 text-muted-foreground">{staff.qualification}</td>
                        <td className="p-3 text-center font-mono">{staff.exp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SECTION E: School Infrastructure */}
        {activeTab === "E" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-foreground">E. School Infrastructure</h2>
                <p className="text-xs text-muted-foreground">Physical campus land, built-up classrooms, specialized laboratories, sanitation, and safety parameters.</p>
              </div>
              <Button asChild size="sm" variant="outline" className="gap-1.5 text-xs font-semibold">
                <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="text-rose-600 hover:text-rose-700">
                  <Video className="size-3.5" />
                  <span>Watch YouTube Infrastructure Tour</span>
                </a>
              </Button>
            </div>

            <div className="border rounded-xl overflow-hidden bg-card shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/80 text-foreground font-bold border-b">
                  <tr>
                    <th className="p-3 w-16 text-center">S.No.</th>
                    <th className="p-3 w-2/5">Infrastructure Parameter</th>
                    <th className="p-3">Details / Specifications (as per CBSE Norms)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {infrastructureData.map((item) => (
                    <tr key={item.sNo} className="hover:bg-muted/30">
                      <td className="p-3 text-center font-mono text-muted-foreground font-semibold">{item.sNo}</td>
                      <td className="p-3 font-semibold text-foreground">{item.item}</td>
                      <td className="p-3 font-medium text-foreground">
                        {item.details.includes("YouTube") ? (
                          <a
                            href="https://youtube.com"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline font-bold"
                          >
                            <span>Click here to view official inspection video</span>
                            <ExternalLink className="size-3" />
                          </a>
                        ) : (
                          item.details
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border bg-card space-y-1.5 text-xs">
                <div className="font-bold text-foreground">Fire Safety Provision</div>
                <p className="text-muted-foreground text-[11px]">
                  Equipped with ABC type fire extinguishers in every wing, sand buckets, hose reel system, and illuminated exit signage. Regular bi-annual mock drills conducted.
                </p>
              </div>
              <div className="p-4 rounded-xl border bg-card space-y-1.5 text-xs">
                <div className="font-bold text-foreground">CCTV Surveillance & Boundary</div>
                <p className="text-muted-foreground text-[11px]">
                  Campus perimeter secured by 8-foot masonry boundary wall. 48 high-definition CCTV cameras monitor gates, corridors, playgrounds, and common zones 24x7.
                </p>
              </div>
              <div className="p-4 rounded-xl border bg-card space-y-1.5 text-xs">
                <div className="font-bold text-foreground">Safe Drinking Water & Testing</div>
                <p className="text-muted-foreground text-[11px]">
                  Commercial RO filtration plant with chilling units. Certified bacteriological and chemical water testing conducted every six months by District Water Testing Lab.
                </p>
              </div>
            </div>
          </div>
        )}
      </Container>
    </>
  );
}
