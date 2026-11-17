import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Landmark,
  ShieldCheck,
  Users,
  Award,
  FileText,
  Mail,
  Phone,
  Building2,
  Calendar,
  Download,
  ExternalLink,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { collegeHeroUrl } from "@/mocks/data/images";

export default function CollegeAdministration() {
  const [activeTab, setActiveTab] = useState<"officers" | "syndicate" | "academic_council" | "secretariats">("officers");

  const administrators = [
    {
      title: "Chancellor",
      name: "Hon'ble Governor of Odisha",
      designation: "Head of the University & Supreme Authority",
      office: "Raj Bhavan, Odisha",
      phone: "+91 674 2536100",
      email: "governor@odisha.gov.in",
      roleBadge: "Statutory Head",
    },
    {
      title: "Vice-Chancellor / Principal",
      name: "Prof. (Dr.) B. K. Ray",
      designation: "Principal Academic & Executive Officer",
      office: "Principal's Secretariat",
      phone: "+91 674 2567101",
      email: "principal@ourcollege.edu.in",
      roleBadge: "Executive Head",
    },
    {
      title: "Chairperson, P.G. Council",
      name: "Prof. Satyabrata Dash",
      designation: "Dean of Postgraduate Affairs & Research",
      office: "P.G. Council Secretariat",
      phone: "+91 674 2567202",
      email: "cpgc@ourcollege.edu.in",
      roleBadge: "Academic Head",
    },
    {
      title: "Registrar / Vice-Principal",
      name: "Dr. Ashok Panigrahi, OAS (SAG)",
      designation: "Head of Administration & Custodian of Records",
      office: "Administrative Block",
      phone: "+91 674 2567387",
      email: "registrar@ourcollege.edu.in",
      roleBadge: "Administrative Head",
    },
    {
      title: "Controller of Examinations",
      name: "Dr. Rashmita Patnaik",
      designation: "Examination Cell & Degree Certification",
      office: "Examination Directorate",
      phone: "+91 671 2201690",
      email: "coe@ourcollege.edu.in",
      roleBadge: "Examinations",
    },
    {
      title: "Comptroller of Finance",
      name: "Shri Debasish Mallick, OFS",
      designation: "Financial Oversight, Budget & Accounts",
      office: "Finance & Accounts Wing",
      phone: "+91 674 2567404",
      email: "cof@ourcollege.edu.in",
      roleBadge: "Finance",
    },
    {
      title: "Director, IQAC",
      name: "Dr. Snigdha Mohanty",
      designation: "Director, Internal Quality Assurance Cell",
      office: "IQAC Directorate, Golden Jubilee Block",
      phone: "+91 674 2567505",
      email: "iqac.director@ourcollege.edu.in",
      roleBadge: "Quality Assurance",
    },
    {
      title: "Chief Warden",
      name: "Prof. Animesh Senapati",
      designation: "Residential Student Welfare & Hostels",
      office: "Board of Residence",
      phone: "+91 674 2567606",
      email: "chiefwarden@ourcollege.edu.in",
      roleBadge: "Student Welfare",
    },
  ];

  const syndicateMembers = [
    { role: "Chairperson", name: "Prof. (Dr.) B. K. Ray", desc: "Principal / Executive Head, Our College" },
    { role: "Ex-Officio Member", name: "Commissioner-cum-Secretary", desc: "Dept. of Higher Education, Govt. of Odisha" },
    { role: "Ex-Officio Member", name: "Director, Higher Education", desc: "Government of Odisha" },
    { role: "Member", name: "Prof. Satyabrata Dash", desc: "Chairperson, P.G. Council" },
    { role: "Member", name: "Prof. Rashmita Mishra", desc: "Senior Professor, Dept. of Computer Science" },
    { role: "Member (Eminent Educationist)", name: "Prof. (Dr.) S. K. Mahapatra", desc: "Nominated by the Hon'ble Chancellor" },
    { role: "Member (Legislative Nominee)", name: "Shri Ashok Kumar Sahu", desc: "Vice President, Odisha Industries Association" },
    { role: "Member Secretary", name: "Dr. Ashok Panigrahi, OAS", desc: "Registrar / Vice-Principal, Our College" },
  ];

  return (
    <>
      <Hero variant="compact" title="Administration & Governance" imageUrl={collegeHeroUrl(4)} />
      <Breadcrumbs items={[{ label: "Home", href: "/college" }, { label: "Administration" }]} />

      <Container className="py-10 space-y-8">
        {/* Governance Overview Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                Statutory Governance Matrix
              </Badge>
              <Badge variant="outline" className="text-xs">
                Odisha Universities Act
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground">
              University Administrators & Statutory Bodies
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl">
              Constitutional governance framework overseeing academic standards, financial auditing, policy formulation, and administrative operations.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <Button asChild size="sm" variant="outline" className="text-xs gap-1">
              <Link to="/college/disclosure">
                <FileText className="size-3.5" />
                <span>Acts & Statutes (PDF)</span>
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="text-xs gap-1">
              <Link to="/college/iqac">
                <ShieldCheck className="size-3.5 text-primary" />
                <span>IQAC Governance</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/50 border border-border/70 overflow-x-auto">
          {[
            { id: "officers", label: "University Administrators" },
            { id: "syndicate", label: "The Syndicate (Executive Body)" },
            { id: "academic_council", label: "Academic Council & Councils" },
            { id: "secretariats", label: "Secretariats & Directory" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-card text-primary shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Administrators Grid */}
        {activeTab === "officers" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {administrators.map((admin, idx) => (
              <Card key={idx} className="border border-border/70 bg-card hover:border-primary/40 transition-all flex flex-col justify-between">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                      {admin.roleBadge}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                      {admin.title}
                    </span>
                  </div>
                  <CardTitle className="text-sm font-bold text-foreground mt-2">
                    {admin.name}
                  </CardTitle>
                  <CardDescription className="text-[11px] leading-snug">
                    {admin.designation}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2 border-t border-border/40 space-y-1.5 text-[11px]">
                  <div className="text-muted-foreground flex items-center gap-1.5">
                    <Building2 className="size-3 shrink-0" />
                    <span className="truncate">{admin.office}</span>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-1.5">
                    <Phone className="size-3 shrink-0" />
                    <span>{admin.phone}</span>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-1.5 truncate">
                    <Mail className="size-3 shrink-0" />
                    <a href={`mailto:${admin.email}`} className="text-primary hover:underline truncate">
                      {admin.email}
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tab 2: The Syndicate */}
        {activeTab === "syndicate" && (
          <div className="space-y-4">
            <Card className="border border-border/60 bg-muted/10 p-5">
              <h3 className="text-base font-bold text-foreground">
                The Syndicate (Highest Executive Body)
              </h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Under the Odisha Universities Act, the Syndicate is the apex executive authority exercising general management of institutional affairs, property, finances, statutes ratification, and recruitment approvals.
              </p>
            </Card>

            <div className="rounded-xl border border-border/60 overflow-hidden bg-card">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b border-border/60">
                  <tr>
                    <th className="p-3 font-bold text-foreground">Role / Designation</th>
                    <th className="p-3 font-bold text-foreground">Name</th>
                    <th className="p-3 font-bold text-foreground">Affiliation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {syndicateMembers.map((m, i) => (
                    <tr key={i} className="hover:bg-muted/20">
                      <td className="p-3 font-semibold text-primary">{m.role}</td>
                      <td className="p-3 font-bold text-foreground">{m.name}</td>
                      <td className="p-3 text-muted-foreground">{m.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Academic Council & PG Council */}
        {activeTab === "academic_council" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border border-border/60 bg-card p-5 space-y-3">
              <Badge className="bg-blue-600 text-white text-[10px]">Academic Authority</Badge>
              <h3 className="text-base font-bold text-foreground">The Academic Council</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Responsible for the maintenance of standards of instruction, curriculum framing, NEP 2020 LOCF adoption, examinations, and university research programs. Comprises all Deans, HODs, senior college principals, and eminent educationists.
              </p>
              <Button asChild size="xs" variant="outline" className="text-xs gap-1 text-primary">
                <Link to="/college/iqac">
                  <span>View Council Minutes & ATRs</span>
                  <ExternalLink className="size-3" />
                </Link>
              </Button>
            </Card>

            <Card className="border border-border/60 bg-card p-5 space-y-3">
              <Badge className="bg-purple-600 text-white text-[10px]">Postgraduate Governance</Badge>
              <h3 className="text-base font-bold text-foreground">The Postgraduate (P.G.) Council</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Headed by the Chairperson, P.G. Council, this body coordinates all academic activities across the 32 postgraduate teaching departments, research fellowships, library allocations, and hostel administration.
              </p>
              <Button asChild size="xs" variant="outline" className="text-xs gap-1 text-primary">
                <Link to="/college/departments">
                  <span>Explore PG Departments</span>
                  <ExternalLink className="size-3" />
                </Link>
              </Button>
            </Card>
          </div>
        )}

        {/* Tab 4: Secretariats */}
        {activeTab === "secretariats" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border border-border/60 bg-card p-4 space-y-2">
              <span className="font-bold text-xs text-foreground block">Vice-Chancellor's Secretariat</span>
              <p className="text-xs text-muted-foreground">Officer on Special Duty (OSD) & Personal Secretary to VC</p>
              <div className="text-[11px] text-muted-foreground pt-1">Tel: +91 674 2567101 · principal@ourcollege.edu.in</div>
            </Card>
            <Card className="border border-border/60 bg-card p-4 space-y-2">
              <span className="font-bold text-xs text-foreground block">Registrar's Secretariat</span>
              <p className="text-xs text-muted-foreground">General Administration, Syndicate Branch & Estt.</p>
              <div className="text-[11px] text-muted-foreground pt-1">Tel: +91 674 2567387 · registrar@ourcollege.edu.in</div>
            </Card>
            <Card className="border border-border/60 bg-card p-4 space-y-2">
              <span className="font-bold text-xs text-foreground block">Examination Directorate</span>
              <p className="text-xs text-muted-foreground">Result Tabulation, Marks Verification & Degrees</p>
              <div className="text-[11px] text-muted-foreground pt-1">Tel: +91 671 2201690 · coe@ourcollege.edu.in</div>
            </Card>
          </div>
        )}
      </Container>
    </>
  );
}
