import { Link } from "react-router-dom";
import {
  FileText,
  Download,
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import { Container } from "@/components/common/Container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Hero } from "@/components/sections/Hero";
import { schoolHeroUrl } from "@/mocks/data/images";

export default function SchoolRti() {
  const proactiveManuals = [
    { no: "Manual 1", title: "Particulars of Organisation, Functions and Duties", file: "RTI_Manual_1_Organisation.pdf" },
    { no: "Manual 2", title: "Powers and Duties of Officers and Employees", file: "RTI_Manual_2_Powers_Duties.pdf" },
    { no: "Manual 3", title: "Procedure followed in Decision-Making Process", file: "RTI_Manual_3_Decision_Making.pdf" },
    { no: "Manual 4", title: "Norms set for the Discharge of Functions", file: "RTI_Manual_4_Norms_Discharge.pdf" },
    { no: "Manual 5", title: "Rules, Regulations, Instructions and Manuals", file: "RTI_Manual_5_Rules_Regs.pdf" },
    { no: "Manual 6", title: "Categories of Documents Held or Under Control", file: "RTI_Manual_6_Categories_Docs.pdf" },
    { no: "Manual 7", title: "Arrangement for Consultation with the Public (SMC/PTA)", file: "RTI_Manual_7_Consultation.pdf" },
    { no: "Manual 8", title: "Boards, Councils, Committees and Other Bodies", file: "RTI_Manual_8_Committees.pdf" },
    { no: "Manual 9", title: "Directory of Officers and Teaching Faculty", file: "RTI_Manual_9_Staff_Directory.pdf" },
    { no: "Manual 10", title: "Monthly Remuneration and Compensation Scales (7th CPC)", file: "RTI_Manual_10_Remuneration.pdf" },
    { no: "Manual 11", title: "Budget Allocated to School, Plans and Expenditure", file: "RTI_Manual_11_Budget_Accounts.pdf" },
    { no: "Manual 12", title: "Execution of Subsidy Programmes & RTE Entitlements", file: "RTI_Manual_12_RTE_Subsidies.pdf" },
    { no: "Manual 13", title: "Particulars of Concessions, Permits and Authorisations", file: "RTI_Manual_13_Concessions.pdf" },
    { no: "Manual 14", title: "Details in respect of Information Available in Electronic Form", file: "RTI_Manual_14_Electronic_Data.pdf" },
    { no: "Manual 15", title: "Facilities Available to Citizens for Obtaining Information", file: "RTI_Manual_15_Citizen_Facilities.pdf" },
    { no: "Manual 16", title: "Names, Designations and Particulars of Public Information Officers", file: "RTI_Manual_16_PIO_Details.pdf" },
  ];

  return (
    <>
      <Hero
        variant="compact"
        title="Right to Information (RTI)"
        subtitle="Proactive Public Disclosures under Section 4(1)(b) of the RTI Act, 2005"
        imageUrl={schoolHeroUrl(3)}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/school" }, { label: "RTI & Transparency" }]} />

      <Container className="py-10 space-y-8">
        {/* Header Notice Card */}
        <Card className="border-2 border-primary/20 bg-card p-6 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                  Statutory Transparency
                </Badge>
                <Badge variant="outline" className="text-xs">RTI Act, 2005</Badge>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-foreground">
                Public Information Cell — Our School
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
                Our School maintains an open and transparent administrative framework. In compliance with the Right to Information Act, citizens can access records, certified reports, and institutional disclosures through the designated Public Information Authorities.
              </p>
            </div>

            <Button asChild className="gap-2 bg-primary font-bold text-xs shrink-0 shadow-md">
              <a href="/documents/school/disclosure/CBSE_Annual_Report_ByeLaw_14_5.pdf" download>
                <Download className="size-4" />
                <span>Annual Report (CBSE 14.5)</span>
              </a>
            </Button>
          </div>
        </Card>

        {/* PIO & FAA Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-border/70 p-5 space-y-3 bg-card shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-primary">First Appellate Authority (FAA)</span>
              <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px]">Appellate Officer</Badge>
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Smt. Sunita Mohanty</h3>
              <p className="text-xs text-muted-foreground">Principal & Head of Institution</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/40 border border-border/50 text-xs space-y-1 text-muted-foreground">
              <div>Office: Principal's Chamber, Administrative Block</div>
              <div className="flex items-center gap-1.5"><Phone className="size-3 text-primary" /> +91 98765 43210 / 06757-223456</div>
              <div className="flex items-center gap-1.5"><Mail className="size-3 text-primary" /> principal@ourschool.edu.in</div>
            </div>
          </Card>

          <Card className="border border-border/70 p-5 space-y-3 bg-card shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-emerald-600">Public Information Officer (PIO)</span>
              <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px]">Nodal Officer</Badge>
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Shri Ramesh Chandra Swain</h3>
              <p className="text-xs text-muted-foreground">Vice-Principal & Senior Academic Officer</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/40 border border-border/50 text-xs space-y-1 text-muted-foreground">
              <div>Office: Vice-Principal's Desk, Main Block</div>
              <div className="flex items-center gap-1.5"><Phone className="size-3 text-emerald-600" /> +91 94371 98765</div>
              <div className="flex items-center gap-1.5"><Mail className="size-3 text-emerald-600" /> pio@ourschool.edu.in</div>
            </div>
          </Card>
        </div>

        {/* How to Apply Guidelines */}
        <div className="p-5 rounded-2xl border bg-card space-y-3">
          <div className="font-bold text-sm text-foreground">How to Submit an RTI Application</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
            <div className="p-3 rounded-xl bg-muted/30 border space-y-1">
              <div className="font-semibold text-foreground">1. Application Format</div>
              <p>Write an application addressed to the Public Information Officer (PIO) stating clearly the particulars of information required with full contact address.</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/30 border space-y-1">
              <div className="font-semibold text-foreground">2. Application Fee</div>
              <p>Attach a non-judicial stamp / IPO / Demand Draft of ₹10/- drawn in favour of "Our School, Khandapara". (No fee for BPL card holders).</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/30 border space-y-1">
              <div className="font-semibold text-foreground">3. Response Timeline</div>
              <p>The PIO shall furnish the information within 30 days of receipt of application (or 48 hours where it concerns the life or liberty of a person).</p>
            </div>
          </div>
        </div>

        {/* Section 4(1)(b) Proactive Disclosures Manuals Grid */}
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h2 className="text-lg font-bold text-foreground">Section 4(1)(b) Proactive Disclosure Manuals</h2>
            <p className="text-xs text-muted-foreground">Download the 16 statutory manuals prepared in accordance with the Right to Information Act.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {proactiveManuals.map((man) => (
              <div key={man.no} className="p-3 rounded-xl border bg-card hover:border-primary transition-all flex flex-col justify-between gap-2 shadow-2xs">
                <div className="space-y-1">
                  <Badge variant="outline" className="text-[10px] font-mono">{man.no}</Badge>
                  <div className="text-xs font-bold text-foreground leading-snug">{man.title}</div>
                </div>
                <Button asChild size="sm" variant="ghost" className="h-7 text-[11px] gap-1 p-0 justify-start text-primary hover:text-primary">
                  <a href={`/documents/school/rti/${man.file}`} download>
                    <Download className="size-3" />
                    <span>Download PDF</span>
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
