import { Link } from "react-router-dom";
import {
  FileText,
  Download,
  ShieldCheck,
  Building2,
  Scale,
  BookOpen,
  Calendar,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { Card } from "@/components/ui/card";
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

export default function ActStatutes() {
  const institution = institutions.college;

  const actsAndCompendiums = [
    {
      title: "The Odisha Universities Act, 1989 (Act 5 of 1989)",
      description: "The primary legislative enactment of the Odisha Legislative Assembly providing for the establishment, incorporation, and governance of state universities across Odisha.",
      gazetteNo: "No. 320/Law, Bhubaneswar",
      effectiveDate: "November 15, 1989 (As amended up to 2020)",
      fileSize: "2.4 MB",
      href: "/documents/statutes/Odisha_Universities_Act_Gazette.pdf",
    },
    {
      title: "The Compendium of University Statutes",
      description: "Comprehensive statutory ordinances regulating service conditions of university teachers, administrative cadres, constitution of Academic Council, Board of Studies, and PG Council.",
      gazetteNo: "Statute Compendium Vol. I–IV",
      effectiveDate: "Revised Edition 2022",
      fileSize: "4.8 MB",
      href: "/documents/statutes/University_Statutes_Compendium.pdf",
    },
    {
      title: "Statutes on Conduct of Examinations & Degree Conferral",
      description: "Statutory provisions governing confidential examination operations, evaluation integrity, unfair means regulations, thesis evaluations, and annual convocation ceremonies.",
      gazetteNo: "Ordinance Exam Reg. 1991/2021",
      effectiveDate: "Updated 2023",
      fileSize: "1.9 MB",
      href: "/documents/statutes/Examination_Regulations_Statutes.pdf",
    },
    {
      title: "NEP 2020 Academic & Credit Framework Ordinance",
      description: "Statutory adoption of the National Higher Education Qualifications Framework (NHEQF), 4-year FYUGP degree structures, Academic Bank of Credits (ABC), and multiple entry/exit norms.",
      gazetteNo: "Academic Council Res. 2023/NEP",
      effectiveDate: "July 2023",
      fileSize: "3.1 MB",
      href: "/documents/statutes/NEP_2020_Regulations_Odisha.pdf",
    },
  ];

  const gazetteRepository = [
    {
      id: "GZ-2023-09",
      date: "14-Sep-2023",
      subject: "Odisha Universities (Amendment) Act — Implementation of NEP 2020 Credit Framework & Multiple Entry/Exit Options",
      authority: "Department of Higher Education, Govt. of Odisha",
      fileSize: "1.2 MB",
    },
    {
      id: "GZ-2021-04",
      date: "28-Apr-2021",
      subject: "Statutory Notification on Direct Faculty Recruitment Rules (UGC 7th CPC Guidelines)",
      authority: "Chancellor's Secretariat / Higher Education Dept.",
      fileSize: "850 KB",
    },
    {
      id: "GZ-2020-11",
      date: "05-Nov-2020",
      subject: "The Odisha Universities (Amendment) Act, 2020 (Odisha Act 22 of 2020) — Senate & Syndicate Restructuring",
      authority: "Law Department, Government of Odisha",
      fileSize: "1.7 MB",
    },
    {
      id: "GZ-2018-06",
      date: "19-Jun-2018",
      subject: "Compendium of Ph.D. Minimum Standards & Procedure for Award of Degrees (UGC Regulations)",
      authority: "PG Council & Academic Council",
      fileSize: "920 KB",
    },
    {
      id: "GZ-2015-02",
      date: "12-Feb-2015",
      subject: "Statutes on Prevention, Prohibition and Redressal of Sexual Harassment of Women Employees and Students (POSH)",
      authority: "Internal Complaints Committee & Syndicate",
      fileSize: "680 KB",
    },
  ];

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/college" },
          { label: "About", href: "/college/about" },
          { label: "Act & Statutes" },
        ]}
      />

      <Hero
        variant="compact"
        title="Act, Statutes & Legal Framework"
        subtitle="Constitutional Governance, Legislative Charters & University Regulations"
        imageUrl={collegeHeroUrl(3)}
      />

      <Container className="py-10 space-y-12">
        {/* Intro Strip */}
        <div className="space-y-4 border-b pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
              Statutory University
            </Badge>
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs">
              UGC Act 1956 · Section 2(f) & 12(B)
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Legal Foundation & Legislative Authorities
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl">
            {institution.name} operates under the solemn authority of the Odisha Legislative Assembly,
            governed by the Odisha Universities Act, 1989 and statutory ordinances framed thereunder.
            The Hon'ble Governor of Odisha serves as the Ex-Officio Chancellor and the supreme constitutional authority,
            ensuring academic independence, fiscal transparency, and adherence to national higher education guidelines.
          </p>
        </div>

        {/* Primary Legislative Acts & Compendiums */}
        <div className="space-y-6">
          <div className="border-b pb-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Scale className="size-5 text-primary" />
              Primary Statutes & Compendiums
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              The foundational legal texts that define institutional powers, executive committees, and academic jurisdiction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {actsAndCompendiums.map((doc, idx) => (
              <Card key={idx} className="p-5 border border-border/70 bg-card hover:border-primary/40 transition-all shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground">
                      {doc.gazetteNo}
                    </Badge>
                    <span className="text-[11px] font-mono text-primary font-bold">{doc.fileSize}</span>
                  </div>
                  <h3 className="font-bold text-base text-foreground leading-snug">{doc.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{doc.description}</p>
                  <div className="text-[11px] text-muted-foreground pt-1 flex items-center gap-1.5">
                    <Calendar className="size-3 text-primary" />
                    <span>In Force: {doc.effectiveDate}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground font-medium">Official PDF Gazette</span>
                  <Button size="sm" variant="outline" asChild className="gap-1.5 text-xs text-primary border-primary/30">
                    <a href={doc.href} target="_blank" rel="noreferrer">
                      <Download className="size-3.5" />
                      <span>Download Document</span>
                    </a>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Official Gazette Notifications Repository */}
        <div className="space-y-6">
          <div className="border-b pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <FileText className="size-5 text-primary" />
                Gazette Notifications & Statutory Orders Archive
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Chronological gazette orders published by the Department of Higher Education and University Secretariat.
              </p>
            </div>
            <Badge variant="secondary" className="text-xs w-fit">
              Public Legal Repository
            </Badge>
          </div>

          <Card className="border border-border/70 bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-28 text-xs font-bold">Gazette Ref.</TableHead>
                  <TableHead className="w-28 text-xs font-bold">Date</TableHead>
                  <TableHead className="text-xs font-bold">Notification Subject</TableHead>
                  <TableHead className="w-48 text-xs font-bold hidden md:table-cell">Issuing Authority</TableHead>
                  <TableHead className="w-28 text-xs font-bold text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gazetteRepository.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-mono text-xs font-semibold text-primary">{row.id}</TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{row.date}</TableCell>
                    <TableCell className="text-xs font-medium text-foreground">{row.subject}</TableCell>
                    <TableCell className="text-xs text-muted-foreground hidden md:table-cell">{row.authority}</TableCell>
                    <TableCell className="text-right">
                      <Button size="xs" variant="ghost" className="gap-1 text-primary text-xs hover:bg-primary/10">
                        <Download className="size-3" />
                        <span className="hidden sm:inline">PDF</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Statutory Compliance Checklist Strip */}
        <div className="p-6 rounded-2xl bg-muted/40 border border-border/70 space-y-4">
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            Statutory Accreditations & Regulatory Recognitions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-foreground block">UGC Section 2(f) & 12(B)</span>
                <span className="text-muted-foreground">Recognized by University Grants Commission, New Delhi for central development grants.</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-foreground block">NAAC Grade A+ (Cycle 3)</span>
                <span className="text-muted-foreground">Accredited with CGPA 3.42 by the National Assessment and Accreditation Council.</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-foreground block">State Legislature Act</span>
                <span className="text-muted-foreground">Enacted under Odisha Universities Act 5 of 1989 with full statutory powers.</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-foreground block">RTI Act Compliance</span>
                <span className="text-muted-foreground">Public proactive disclosures under Section 4(1)(b) of the Right to Information Act, 2005.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Step Nav */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl border border-border/70 bg-card">
          <div className="text-xs text-muted-foreground text-center sm:text-left">
            Explore the organizational hierarchy executing these statutory mandates.
          </div>
          <Button size="sm" asChild className="gap-1.5 bg-primary text-white text-xs font-bold shadow-xs">
            <Link to="/college/about/organogram">
              <span>View Governance Organogram</span>
              <ExternalLink className="size-3.5" />
            </Link>
          </Button>
        </div>
      </Container>
    </>
  );
}
