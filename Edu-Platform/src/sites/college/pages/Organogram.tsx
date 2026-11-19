import { Link } from "react-router-dom";
import {
  Network,
  Users,
  Building2,
  Landmark,
  ShieldCheck,
  Award,
  ChevronDown,
  Download,
  BookOpen,
  GraduationCap,
  Briefcase,
  Layers,
} from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { collegeHeroUrl } from "@/mocks/data/images";
import { institutions } from "@/mocks/data/institutions";

export default function Organogram() {
  const institution = institutions.college;

  const statutoryBodies = [
    {
      title: "The Syndicate (Executive Council)",
      role: "Supreme Executive Body",
      mandate: "Administers university assets, passes annual budget estimates, sanctions faculty recruitments, and manages general institutional affairs in accordance with statutory acts.",
      composition: "Chaired by the Vice-Chancellor; includes Principal Secretary (Higher Ed.), eminent academicians, elected legislators, and senior deans.",
    },
    {
      title: "The Academic Council",
      role: "Apex Academic Authority",
      mandate: "Formulates all academic policies, approves curricula and syllabi under NEP 2020, establishes examination ordinances, and recommends degree conferrals to the Senate.",
      composition: "Headed by Vice-Chancellor; comprises Deans of Faculties, Chairman PG Council, all Heads of PG Departments, and nominated subject experts.",
    },
    {
      title: "The Post-Graduate Council (PG Council)",
      role: "Central PG Academic Governance",
      mandate: "Coordinates centralized PG admissions, inter-departmental academic schedules, research colloquiums, library resources, and departmental welfare.",
      composition: "Chaired by an elected senior Professor (Chairman PG Council), with all PG Department Heads acting as ex-officio members.",
    },
    {
      title: "The Finance Committee",
      role: "Fiscal Prudence & Budgetary Sanctions",
      mandate: "Oversees university endowment funds, government block grants, CAG/local fund audit replies, and capital expenditure allocations.",
      composition: "Vice-Chancellor (Chairman), Comptroller of Finance (Secretary), Special Secretary (Finance Dept., Govt. of Odisha), and Syndicate representatives.",
    },
  ];

  const administrativePillars = [
    {
      officer: "Registrar's Secretariat",
      lead: "Registrar (OAS / Academic Cadre)",
      responsibilities: ["General Administration & Establishment", "Council & Syndicate Affairs", "Legal & Statutory Compliance", "Estate, Security & Infrastructure"],
    },
    {
      officer: "Comptroller of Finance (COF)",
      lead: "Comptroller of Finance (OFS Cadre)",
      responsibilities: ["Annual University Budget & Accounts", "Salary, Pension & PF Disbursals", "Procurement & Gem Portal Tenders", "Government Grants & Audit Compliance"],
    },
    {
      officer: "Examination Cell",
      lead: "Controller of Examinations (COE)",
      responsibilities: ["Conduct of UG/PG Semester Exams", "Question Paper Setting & Confidentiality", "Tabulation, Results & Marksheet Issuance", "Annual Convocation & Degree Diplomas"],
    },
    {
      officer: "Dean of Students' Welfare (DSW)",
      lead: "Dean, Students' Welfare",
      responsibilities: ["Hostel Administration & Mess Committees", "Sports Council & Fit India Initiatives", "NSS, NCC & Youth Red Cross Wings", "Anti-Ragging & Student Grievances"],
    },
  ];

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/college" },
          { label: "About", href: "/college/about" },
          { label: "Institutional Organogram" },
        ]}
      />

      <Hero
        variant="compact"
        title="Institutional Organogram"
        subtitle="Hierarchical Administrative Governance, Statutory Bodies & Reporting Matrix"
        imageUrl={collegeHeroUrl(4)}
      />

      <Container className="py-10 space-y-12">
        {/* Intro */}
        <div className="space-y-4 border-b pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
              Governance Architecture
            </Badge>
            <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs">
              Odisha Universities Act Structure
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Administrative Hierarchy & Governance Organogram
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl">
            The governance matrix of {institution.name} balances constitutional executive leadership with participative academic democracy.
            Headed by His Excellency the Governor of Odisha as Chancellor and the Vice-Chancellor as chief academic officer,
            statutory authority flows through specialized executive bodies to departmental faculties and student services.
          </p>
        </div>

        {/* Visual Hierarchical Flowchart Tree */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Network className="size-5 text-primary" />
                University Governance Flowchart
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Visual reporting structure from constitutional authorities to academic faculties.
              </p>
            </div>
            <Button size="xs" variant="outline" asChild className="gap-1.5 text-xs text-primary border-primary/30 w-fit">
              <a href="/documents/statutes/Institutional_Organogram_Full.pdf" target="_blank" rel="noreferrer">
                <Download className="size-3" />
                <span>Download PDF Organogram</span>
              </a>
            </Button>
          </div>

          {/* Structured Visual Flowchart */}
          <div className="space-y-4">
            {/* Level 1: Chancellor */}
            <div className="flex justify-center">
              <Card className="w-full max-w-md p-4 bg-primary text-white text-center shadow-md border-0 space-y-1">
                <Badge className="bg-white/20 text-white text-[10px] uppercase tracking-wider mx-auto font-mono">
                  Constitutional Head
                </Badge>
                <div className="font-black text-base">The Hon'ble Chancellor</div>
                <div className="text-xs text-white/80">His Excellency the Governor of Odisha</div>
                <div className="text-[11px] text-white/70 pt-0.5">Supreme Visitor & Constitutional Authority under State University Act</div>
              </Card>
            </div>

            <div className="flex justify-center text-primary">
              <ChevronDown className="size-6" />
            </div>

            {/* Level 2: Vice-Chancellor */}
            <div className="flex justify-center">
              <Card className="w-full max-w-md p-4 bg-card border-2 border-primary/40 text-center shadow-md space-y-1">
                <Badge className="bg-primary/10 text-primary text-[10px] uppercase tracking-wider mx-auto font-mono">
                  Principal Academic & Executive Officer
                </Badge>
                <div className="font-black text-base text-foreground">The Vice-Chancellor</div>
                <div className="text-xs text-muted-foreground">Chief Executive, Academic Leader & Chairman of Syndicate & Academic Council</div>
              </Card>
            </div>

            <div className="flex justify-center text-primary">
              <ChevronDown className="size-6" />
            </div>

            {/* Level 3: Statutory Bodies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {["The Syndicate (Executive Body)", "The Academic Council", "The Senate", "The Finance Committee"].map((body, i) => (
                <div key={i} className="p-3 rounded-xl border border-primary/20 bg-primary/5 text-center space-y-1">
                  <Badge variant="outline" className="text-[9px] font-mono text-primary border-primary/30">
                    Statutory Body
                  </Badge>
                  <div className="text-xs font-bold text-foreground">{body}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-center text-primary">
              <ChevronDown className="size-6" />
            </div>

            {/* Level 4: Senior Administrative & Academic Wings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Secretariat & Administration */}
              <Card className="p-4 border border-border/70 bg-card space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                  <Briefcase className="size-4" />
                  <span>Administrative Cadre</span>
                </div>
                <div className="font-bold text-sm text-foreground">Registrar's Office</div>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Establishment & Faculty Services</li>
                  <li>Legal Cell & Syndicate Affairs</li>
                  <li>Estate, Security & Infrastructure</li>
                  <li>Public Relations & RTI Cell</li>
                </ul>
              </Card>

              {/* Finance & Audit */}
              <Card className="p-4 border border-border/70 bg-card space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                  <Landmark className="size-4" />
                  <span>Fiscal Management</span>
                </div>
                <div className="font-bold text-sm text-foreground">Comptroller of Finance (COF)</div>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Annual Financial Budget & Balances</li>
                  <li>Salaries, Grants & Extramural Funds</li>
                  <li>GeM Portal & e-Procurement Tenders</li>
                  <li>Audit Compliances (CAG & Local Fund)</li>
                </ul>
              </Card>

              {/* Examination & Convocations */}
              <Card className="p-4 border border-border/70 bg-card space-y-2">
                <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
                  <GraduationCap className="size-4" />
                  <span>Evaluation & Degrees</span>
                </div>
                <div className="font-bold text-sm text-foreground">Controller of Examinations (COE)</div>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>UG, PG & Ph.D. Semester Exams</li>
                  <li>Question Paper Setting & Confidentiality</li>
                  <li>Tabulation, Transcripts & Digilocker</li>
                  <li>Annual Convocation & Degrees</li>
                </ul>
              </Card>
            </div>

            <div className="flex justify-center text-primary">
              <ChevronDown className="size-6" />
            </div>

            {/* Level 5: Academic Faculties & PG Departments */}
            <Card className="p-5 border-2 border-border/70 bg-muted/20 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2">
                <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                  <BookOpen className="size-4 text-primary" />
                  <span>Academic Hierarchy: P.G. Council & Faculty Deans</span>
                </div>
                <Badge variant="outline" className="text-[10px] w-fit">
                  Chairman, P.G. Council
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-card border border-border/60 space-y-1">
                  <div className="font-bold text-foreground">Faculty of Science</div>
                  <div className="text-[11px] text-muted-foreground">Physics, Chemistry, Botany, Zoology, Biotech, Geology, Computer Science</div>
                </div>
                <div className="p-3 rounded-lg bg-card border border-border/60 space-y-1">
                  <div className="font-bold text-foreground">Faculty of Humanities</div>
                  <div className="text-[11px] text-muted-foreground">English, Odia, Sanskrit, Hindi, Philosophy, History, Archaeology</div>
                </div>
                <div className="p-3 rounded-lg bg-card border border-border/60 space-y-1">
                  <div className="font-bold text-foreground">Social Sciences & Commerce</div>
                  <div className="text-[11px] text-muted-foreground">Economics, Commerce, Business Admin, Sociology, Political Science, Law</div>
                </div>
                <div className="p-3 rounded-lg bg-card border border-border/60 space-y-1">
                  <div className="font-bold text-foreground">Interdisciplinary & Centers</div>
                  <div className="text-[11px] text-muted-foreground">CIF, Center for Disability Studies, IQAC, Women's Studies, Remote Sensing</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Statutory Governance Bodies Detail Cards */}
        <div className="space-y-6">
          <div className="border-b pb-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" />
              Statutory Authorities & Mandates
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Specific functions, delegated authorities, and composition under the University Act.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {statutoryBodies.map((body, i) => (
              <Card key={i} className="p-5 border border-border/70 bg-card hover:border-primary/40 transition-all shadow-xs space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-[10px] text-primary border-primary/30 font-mono">
                    {body.role}
                  </Badge>
                </div>
                <h3 className="font-bold text-base text-foreground">{body.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{body.mandate}</p>
                <div className="pt-2 border-t border-border/50 text-[11px] text-foreground/80">
                  <span className="font-bold text-foreground">Composition: </span>
                  {body.composition}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Administrative Officer Pillars */}
        <div className="space-y-6">
          <div className="border-b pb-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Users className="size-5 text-primary" />
              Executive Secretariats & Key Portfolios
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Core administrative pillars ensuring day-to-day operational excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {administrativePillars.map((p, idx) => (
              <Card key={idx} className="p-4 border border-border/70 bg-card space-y-2.5">
                <Badge variant="secondary" className="text-[10px] font-mono">
                  {p.lead}
                </Badge>
                <h4 className="font-bold text-sm text-foreground">{p.officer}</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {p.responsibilities.map((r, ri) => (
                    <li key={ri} className="flex items-start gap-1.5">
                      <span className="text-primary font-bold">·</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Nav */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl border border-border/70 bg-card">
          <div className="text-xs text-muted-foreground text-center sm:text-left">
            View the distinguished roll of former academic leaders who headed this hierarchy.
          </div>
          <Button size="sm" asChild className="gap-1.5 bg-primary text-white text-xs font-bold shadow-xs">
            <Link to="/college/about/former-leaders">
              <span>View Former Vice-Chancellors</span>
              <Award className="size-3.5" />
            </Link>
          </Button>
        </div>
      </Container>
    </>
  );
}
