import { Link } from "react-router-dom";
import {
  Landmark,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  Award,
  ChevronRight,
  BookOpen,
  UserCheck,
  GraduationCap,
  Scale,
} from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { collegeHeroUrl } from "@/mocks/data/images";
import { institutions } from "@/mocks/data/institutions";
import { useLiveSiteContent } from "@/features/content/siteContentService";

export default function ChancellorOfficers() {
  const institution = institutions.college;
  const siteContent = useLiveSiteContent("college");
  const chancellorMsg = siteContent?.home?.chancellorMessage;
  const vcMsg = siteContent?.home?.vcMessage;

  const keyOfficers = [
    {
      title: "Vice-Chancellor / Principal",
      name: vcMsg?.headName || "Prof. (Dr.) B. K. Ray",
      designation: "Principal Academic & Executive Officer",
      qualifications: "Ph.D., FNAAS · Senior Professor",
      office: "Vice-Chancellor's Secretariat, Administrative Quadrangle",
      phone: "+91 674 2567101",
      email: "principal@ourcollege.edu.in",
      roleBadge: "Executive Head",
      mandate: "Exercising general supervision over academic, administrative, and financial functions under Section 10 of the Odisha Universities Act.",
    },
    {
      title: "Chairperson, P.G. Council",
      name: "Prof. Satyabrata Dash",
      designation: "Dean of Postgraduate Affairs & Research",
      qualifications: "Ph.D., Senior Professor in Sciences",
      office: "P.G. Council Secretariat, Ground Floor",
      phone: "+91 674 2567202",
      email: "cpgc@ourcollege.edu.in",
      roleBadge: "Academic Head",
      mandate: "Chief academic officer for all postgraduate teaching departments, Ph.D. admissions, university research colloquiums, and student fellowships.",
    },
    {
      title: "Registrar",
      name: "Dr. Ashok Panigrahi, OAS (SAG)",
      designation: "Head of Administration & Custodian of Common Seal",
      qualifications: "M.A., Ph.D. · Odisha Administrative Service",
      office: "Registrar's Directorate, Administrative Block",
      phone: "+91 674 2567387",
      email: "registrar@ourcollege.edu.in",
      roleBadge: "Administrative Head",
      mandate: "Custodian of university records, common seal, and estate; Member Secretary of the Syndicate, Senate, and Academic Council.",
    },
    {
      title: "Controller of Examinations (COE)",
      name: "Dr. Rashmita Patnaik",
      designation: "Examination Cell & Evaluation Directorate",
      qualifications: "Ph.D., Former Dean of Examinations",
      office: "Examination Directorate, New Academic Block",
      phone: "+91 671 2201690",
      email: "coe@ourcollege.edu.in",
      roleBadge: "Examinations",
      mandate: "Statutory authority in charge of all university examinations, answer script coding, result tabulation, marksheet publication, and convocation degrees.",
    },
    {
      title: "Comptroller of Finance (COF)",
      name: "Shri Debasish Mallick, OFS",
      designation: "Financial Oversight, Budget & Treasury",
      qualifications: "M.Com., Odisha Finance Service",
      office: "Finance & Accounts Wing, First Floor",
      phone: "+91 674 2567404",
      email: "cof@ourcollege.edu.in",
      roleBadge: "Finance",
      mandate: "Advising the Syndicate on financial policies, state government block grants, university budget estimates, and statutory CAG audit compliance.",
    },
    {
      title: "Director, IQAC",
      name: "Dr. Snigdha Mohanty",
      designation: "Director, Internal Quality Assurance Cell",
      qualifications: "Ph.D., Professor & NAAC Coordinator",
      office: "IQAC Directorate, Golden Jubilee Block",
      phone: "+91 674 2567505",
      email: "iqac.director@ourcollege.edu.in",
      roleBadge: "Quality Assurance",
      mandate: "Spearheading NAAC benchmarks, NIRF rankings, stakeholder feedback consolidation, and annual quality assurance reporting (AQAR).",
    },
    {
      title: "Dean, Students' Welfare (DSW)",
      name: "Prof. Manas Ranjan Pradhan",
      designation: "Student Affairs, Cultural & Grievance Welfare",
      qualifications: "Ph.D., Professor of Humanities",
      office: "Students' Welfare Centre, Campus Complex",
      phone: "+91 674 2567707",
      email: "dsw@ourcollege.edu.in",
      roleBadge: "Student Welfare",
      mandate: "Overseeing student co-curricular activities, university youth festivals, anti-ragging committees, NSS/NCC battalions, and student aid funds.",
    },
    {
      title: "Chief Warden",
      name: "Prof. Animesh Senapati",
      designation: "Residential Student Welfare & Hostels",
      qualifications: "Ph.D., Board of Residence",
      office: "Board of Residence Office, Central Avenue",
      phone: "+91 674 2567606",
      email: "chiefwarden@ourcollege.edu.in",
      roleBadge: "Hostel Admin",
      mandate: "Supervising 14 residential hostels (Boys' and Girls' hostels), mess facilities, hostel security, and residential student discipline.",
    },
  ];

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/college" },
          { label: "Administration", href: "/college/administration" },
          { label: "Chancellor & Officers" },
        ]}
      />

      <Hero
        variant="compact"
        title="Chancellor & Officers"
        subtitle="Constitutional Leadership, Statutory Authority & Executive Administration"
        imageUrl={collegeHeroUrl(3)}
      />

      <Container className="py-10 space-y-12">
        {/* Intro */}
        <div className="space-y-4 border-b pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
              Statutory Governance
            </Badge>
            <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs">
              Odisha Universities Act, 1989
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            University Chancellor & Principal Administrative Officers
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl">
            Under the Odisha Universities Act, executive authority is anchored in the constitutional office of the Chancellor
            and exercised through the Vice-Chancellor alongside statutory officers designated to administer academic, financial,
            examination, and student welfare operations.
          </p>
        </div>

        {/* Apex Office: The Chancellor */}
        <Card className="border-2 border-primary/30 bg-primary/5 p-6 sm:p-8 space-y-6 shadow-sm overflow-hidden relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-primary/20 pb-6">
            <div className="flex items-start gap-4">
              <div className="size-16 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-md">
                <Landmark className="size-8" />
              </div>
              <div className="space-y-1">
                <Badge className="bg-primary text-white text-[10px] uppercase tracking-wider font-mono">
                  Constitutional Head of the University
                </Badge>
                <h2 className="text-2xl font-black text-foreground">
                  The Hon'ble Chancellor
                </h2>
                <div className="text-sm font-bold text-primary">
                  {chancellorMsg?.headName || "His Excellency the Governor of Odisha"}
                </div>
                <div className="text-xs text-muted-foreground">
                  Raj Bhavan, Bhubaneswar, Odisha
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-card border border-primary/20 space-y-1.5 text-xs text-muted-foreground shrink-0 md:w-72">
              <div className="font-bold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-primary" />
                <span>Chancellor's Secretariat</span>
              </div>
              <div>Tel: +91 674 2536100 (EPABX)</div>
              <div>Email: governor@odisha.gov.in</div>
              <div className="text-[11px] text-primary">Website: rajbhavanodisha.gov.in</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-muted-foreground leading-relaxed">
            <div>
              <span className="font-bold text-foreground text-sm block mb-1">
                Constitutional Powers & Duties:
              </span>
              <p>
                The Hon'ble Governor of Odisha, by virtue of his office, is the Chancellor of the university.
                The Chancellor is the supreme visitor and constitutional head empowered to appoint the Vice-Chancellor,
                sanction university statutes, confirm degree honoris causa, preside over Annual Convocations, and hear statutory appeals.
              </p>
            </div>
            <div>
              <span className="font-bold text-foreground text-sm block mb-1">
                Chancellor's Vision for Higher Education:
              </span>
              <p className="italic text-foreground/90">
                "{chancellorMsg?.shortQuote || "May this premier institution continue to illuminate the state through excellence in higher learning, inclusive research, and character building for future generations."}"
              </p>
            </div>
          </div>
        </Card>

        {/* Officers Grid */}
        <div className="space-y-6">
          <div className="border-b pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <UserCheck className="size-5 text-primary" />
                Principal Executive & Academic Officers
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Statutory officers executing day-to-day administration under university ordinances.
              </p>
            </div>
            <Badge variant="outline" className="text-xs font-mono w-fit">
              {keyOfficers.length} Statutory Portfolios
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {keyOfficers.map((officer, idx) => (
              <Card
                key={idx}
                className="border border-border/70 bg-card hover:border-primary/40 transition-all shadow-xs flex flex-col justify-between p-5 space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                      {officer.roleBadge}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                      {officer.title}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-foreground">{officer.name}</h3>
                    <div className="text-xs text-primary font-medium">{officer.designation}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{officer.qualifications}</div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                    {officer.mandate}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/50 space-y-1.5 text-xs text-muted-foreground bg-muted/20 -mx-5 -mb-5 p-4 rounded-b-xl">
                  <div className="flex items-center gap-2">
                    <Building2 className="size-3.5 text-primary shrink-0" />
                    <span className="truncate">{officer.office}</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Phone className="size-3.5 text-primary shrink-0" />
                      <span>{officer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="size-3.5 text-primary shrink-0" />
                      <a href={`mailto:${officer.email}`} className="text-primary hover:underline font-mono">
                        {officer.email}
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Next Subpage Nav */}
        <div className="p-6 rounded-2xl bg-muted/40 border border-border/70 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-base text-foreground">Explore The Syndicate (Highest Executive Body)</h3>
            <p className="text-xs text-muted-foreground">View the composition, powers, and resolutions of the University Syndicate.</p>
          </div>
          <Button size="sm" asChild className="gap-1.5 bg-primary text-white text-xs font-bold shadow-xs">
            <Link to="/college/administration/syndicate">
              <span>View The Syndicate</span>
              <ChevronRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </Container>
    </>
  );
}
