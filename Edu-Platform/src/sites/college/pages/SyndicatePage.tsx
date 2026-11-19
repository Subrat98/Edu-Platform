import { Link } from "react-router-dom";
import {
  Users,
  ShieldCheck,
  Building2,
  FileText,
  Download,
  Calendar,
  CheckCircle2,
  Scale,
  ChevronRight,
  ExternalLink,
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

export default function SyndicatePage() {
  const institution = institutions.college;

  const syndicateMembers = [
    {
      role: "Chairperson",
      name: "Prof. (Dr.) B. K. Ray",
      designation: "Vice-Chancellor / Principal Executive Officer",
      category: "Ex-Officio",
    },
    {
      role: "Ex-Officio Member",
      name: "Shri Bishnupada Sethi, IAS",
      designation: "Principal Secretary, Dept. of Higher Education, Govt. of Odisha",
      category: "Government Nominee",
    },
    {
      role: "Ex-Officio Member",
      name: "Dr. Balaram Sahu",
      designation: "Director of Higher Education, Government of Odisha",
      category: "Government Nominee",
    },
    {
      role: "Member",
      name: "Prof. Satyabrata Dash",
      designation: "Chairperson, Post-Graduate Council",
      category: "Academic Leadership",
    },
    {
      role: "Member",
      name: "Prof. Rashmita Mishra",
      designation: "Senior Professor, Department of Computer Science",
      category: "University Faculty",
    },
    {
      role: "Member",
      name: "Prof. (Dr.) S. N. Tripathy",
      designation: "Professor & Head, Department of Economics",
      category: "University Faculty",
    },
    {
      role: "Member (Eminent Educationist)",
      name: "Prof. (Dr.) S. K. Mahapatra",
      designation: "Former Director, Xavier Institute of Management; Chancellor Nominee",
      category: "Chancellor Nominee",
    },
    {
      role: "Member (Eminent Scientist)",
      name: "Dr. P. K. Jena, FNA",
      designation: "Former Director, Regional Research Laboratory (CSIR-IMMT)",
      category: "Chancellor Nominee",
    },
    {
      role: "Member (Legislative Nominee)",
      name: "Hon'ble Member, Odisha Legislative Assembly",
      designation: "Nominated by the Hon'ble Speaker, Odisha Legislative Assembly",
      category: "Legislative Representative",
    },
    {
      role: "Member Secretary",
      name: "Dr. Ashok Panigrahi, OAS (SAG)",
      designation: "Registrar, Our College & University",
      category: "Ex-Officio Secretary",
    },
  ];

  const syndicatePowers = [
    {
      title: "Fiscal & Estate Management",
      desc: "Custody and control of all university lands, infrastructure, endowments, government block grants, and annual capital budgets.",
    },
    {
      title: "Faculty & Cadre Sanctions",
      desc: "Creating, sanctioning, and appointing statutory professors, associate professors, administrative officers, and technical staff.",
    },
    {
      title: "Statutes Ratification",
      desc: "Formulating and amending university statutes, framing ordinances, and ratifying regulations passed by the Academic Council.",
    },
    {
      title: "Constituent College Affiliation",
      desc: "Granting academic affiliation, monitoring infrastructure standards, conducting statutory inspections, and derecognition where applicable.",
    },
  ];

  const recentResolutions = [
    {
      resNo: "SYN-RES-2024-03/12",
      date: "18-Oct-2024",
      subject: "Approval of Comprehensive NEP 2020 FYUGP Credit Architecture and Curriculum for 2024–28 Session",
      category: "Academic Policy",
      fileSize: "1.4 MB",
    },
    {
      resNo: "SYN-RES-2024-02/08",
      date: "25-Jul-2024",
      subject: "Sanction of Capital Outlay for Central Instrumentation Facility (CIF) High-Resolution Mass Spectrometry Equipment",
      category: "Infrastructure",
      fileSize: "890 KB",
    },
    {
      resNo: "SYN-RES-2024-01/05",
      date: "12-Apr-2024",
      subject: "Annual Budget Estimates for Financial Year 2024–25 and Adoption of Local Fund Audit Compliance Report",
      category: "Finance & Budget",
      fileSize: "2.8 MB",
    },
    {
      resNo: "SYN-RES-2023-04/22",
      date: "14-Dec-2023",
      subject: "Implementation of UGC 7th CPC Career Advancement Scheme (CAS) Faculty Promotions for Stage 3 to Stage 4",
      category: "Establishment",
      fileSize: "1.1 MB",
    },
  ];

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/college" },
          { label: "Administration", href: "/college/administration" },
          { label: "The Syndicate" },
        ]}
      />

      <Hero
        variant="compact"
        title="The Syndicate (Executive Body)"
        subtitle="Apex Governing Council of the University under the Odisha Universities Act"
        imageUrl={collegeHeroUrl(4)}
      />

      <Container className="py-10 space-y-12">
        {/* Intro */}
        <div className="space-y-4 border-b pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
              Apex Executive Authority
            </Badge>
            <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs">
              Section 11, Odisha Universities Act
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            The University Syndicate (Executive Council)
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl">
            The Syndicate is the supreme executive body of {institution.name}, entrusted with the administration of all university
            property, finances, human resources, academic regulations, and strategic planning.
            Chaired by the Vice-Chancellor with high-level government representatives and eminent scholars,
            it ensures compliance with state legislative policies and UGC autonomous benchmarks.
          </p>
        </div>

        {/* Powers & Mandate Cards */}
        <div className="space-y-6">
          <div className="border-b pb-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Scale className="size-5 text-primary" />
              Statutory Mandate & Powers
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Core statutory functions defined under the Odisha Universities Act and University Statutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {syndicatePowers.map((p, idx) => (
              <Card key={idx} className="p-5 border border-border/70 bg-card hover:border-primary/40 transition-all shadow-xs space-y-2">
                <span className="font-mono text-2xl font-black text-primary/30">0{idx + 1}</span>
                <h3 className="font-bold text-sm text-foreground">{p.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Syndicate Member Roster */}
        <div className="space-y-6">
          <div className="border-b pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Users className="size-5 text-primary" />
                Current Syndicate Member Roster
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Statutory composition comprising executive leadership, government secretaries, eminent scholars, and legislative nominees.
              </p>
            </div>
            <Badge variant="outline" className="text-xs font-mono w-fit">
              Tenure: 2024 – 2027
            </Badge>
          </div>

          <Card className="border border-border/70 bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="text-xs font-bold w-44">Role / Office</TableHead>
                  <TableHead className="text-xs font-bold">Member Name</TableHead>
                  <TableHead className="text-xs font-bold hidden md:table-cell">Designation / Affiliation</TableHead>
                  <TableHead className="text-xs font-bold text-right w-36">Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {syndicateMembers.map((m, i) => (
                  <TableRow key={i} className="hover:bg-muted/20">
                    <TableCell className="font-bold text-xs text-primary">{m.role}</TableCell>
                    <TableCell className="font-bold text-xs text-foreground">{m.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground hidden md:table-cell">{m.designation}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="text-[10px] font-mono">
                        {m.category}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Resolutions Archive Table */}
        <div className="space-y-6">
          <div className="border-b pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <FileText className="size-5 text-primary" />
                Syndicate Resolutions & Action Taken Reports (ATRs)
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Public transparency repository of ratified syndicate resolutions and executive orders.
              </p>
            </div>
            <Button size="xs" variant="outline" asChild className="gap-1.5 text-xs text-primary border-primary/30 w-fit">
              <Link to="/college/disclosure">
                <span>View All RTI Disclosures</span>
                <ExternalLink className="size-3" />
              </Link>
            </Button>
          </div>

          <Card className="border border-border/70 bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="text-xs font-bold w-44">Resolution No.</TableHead>
                  <TableHead className="text-xs font-bold w-28">Meeting Date</TableHead>
                  <TableHead className="text-xs font-bold">Subject Matter</TableHead>
                  <TableHead className="text-xs font-bold hidden sm:table-cell w-32">Classification</TableHead>
                  <TableHead className="text-xs font-bold text-right w-28">Download</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentResolutions.map((res, i) => (
                  <TableRow key={i} className="hover:bg-muted/20">
                    <TableCell className="font-mono text-xs font-bold text-primary">{res.resNo}</TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{res.date}</TableCell>
                    <TableCell className="text-xs font-medium text-foreground">{res.subject}</TableCell>
                    <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">
                      <Badge variant="outline" className="text-[10px]">
                        {res.category}
                      </Badge>
                    </TableCell>
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

        {/* Quick Nav */}
        <div className="p-6 rounded-2xl bg-muted/40 border border-border/70 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-base text-foreground">Explore Academic Council & P.G. Council</h3>
            <p className="text-xs text-muted-foreground">Learn about academic curricula approval, LOCF frameworks, and postgraduate governance.</p>
          </div>
          <Button size="sm" asChild className="gap-1.5 bg-primary text-white text-xs font-bold shadow-xs">
            <Link to="/college/administration/councils">
              <span>View Academic & P.G. Council</span>
              <ChevronRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </Container>
    </>
  );
}
