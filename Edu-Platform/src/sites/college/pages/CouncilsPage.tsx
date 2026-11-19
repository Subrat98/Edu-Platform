import { Link } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  Award,
  Layers,
  FileText,
  Download,
  Calendar,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building,
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

export default function CouncilsPage() {
  const institution = institutions.college;

  const academicCouncilMandates = [
    {
      title: "NEP 2020 Curriculum & LOCF",
      desc: "Framing Learning Outcomes-based Curriculum Framework (LOCF), multidisciplinary minors, value-added courses, and skill enhancement programs.",
    },
    {
      title: "Board of Studies (BOS) Oversight",
      desc: "Approving model syllabi formulated by specialized Boards of Studies across all disciplines in Arts, Science, Commerce, and Technology.",
    },
    {
      title: "Academic Bank of Credits (ABC)",
      desc: "Supervising national credit mobility, multiple entry/exit parameters, online MOOCs credit transfers, and semester evaluation schemes.",
    },
    {
      title: "Degrees & Convocation Merit",
      desc: "Recommending candidates for the conferral of Bachelor's, Master's, M.Phil., Ph.D., and D.Litt./D.Sc. degrees at Annual Convocations.",
    },
  ];

  const pgCouncilCommittees = [
    {
      title: "Central PG Admission Committee",
      mandate: "Administers statewide SAMS PG common entrance counseling, document verification, reservation rosters, and departmental seat seatings.",
      lead: "Chairman, P.G. Council & Admission OSD",
    },
    {
      title: "Research Advisory & Ph.D. Scrutiny Cell",
      mandate: "Oversees Doctoral Research Committees (DRC), synopsis presentations, coursework evaluations, and research ethics certifications.",
      lead: "Dean of Research & Development",
    },
    {
      title: "Inter-Departmental Elective Coordination",
      mandate: "Schedules open-elective courses, interdisciplinary seminars, CBCS subject selection, and common academic timetables.",
      lead: "Academic Coordination Wing",
    },
    {
      title: "Library & Resource Advisory Committee",
      mandate: "Allocates central library book purchase grants, e-journal subscriptions (EBSCO/Inflibnet), and computing lab upgrades.",
      lead: "University Librarian & PG Council Reps",
    },
  ];

  const boardsOfStudies = [
    { faculty: "Faculty of Physical Sciences", subjects: "Physics, Chemistry, Geology, Mathematics, Statistics, Computer Science & Applications" },
    { faculty: "Faculty of Life Sciences", subjects: "Botany, Zoology, Biotechnology, Environmental Science, Microbiology, Life Sciences" },
    { faculty: "Faculty of Humanities", subjects: "English, Odia, Sanskrit, Hindi, Philosophy, History, Ancient History & Archaeology" },
    { faculty: "Social Sciences & Commerce", subjects: "Economics, Commerce, Business Administration, Political Science, Public Admin, Sociology, Law" },
  ];

  const councilProceedings = [
    {
      ref: "AC-RES-2024-02",
      date: "04-Sep-2024",
      subject: "Adoption of Revised NEP 2020 Four-Year Undergraduate Programme (FYUGP) Syllabi for Semesters III & IV",
      council: "Academic Council",
    },
    {
      ref: "PGC-NOTIF-2024-11",
      date: "19-Aug-2024",
      subject: "Guidelines for Ph.D. Pre-Submission Seminars and Research Publication Mandatory Scopus/UGC-CARE Requirements",
      council: "P.G. Council",
    },
    {
      ref: "AC-RES-2024-01",
      date: "28-Feb-2024",
      subject: "Approval of New Postgraduate Diploma Courses in Artificial Intelligence, Cyber Security, and Climate Science",
      council: "Academic Council",
    },
    {
      ref: "PGC-NOTIF-2023-09",
      date: "15-Nov-2023",
      subject: "Inter-Departmental Credit Transfer Policy under Academic Bank of Credits (ABC) Framework",
      council: "P.G. Council",
    },
  ];

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/college" },
          { label: "Administration", href: "/college/administration" },
          { label: "Academic & P.G. Council" },
        ]}
      />

      <Hero
        variant="compact"
        title="Academic & P.G. Council"
        subtitle="Apex Authorities for Academic Standards, NEP 2020 Curricula & Postgraduate Governance"
        imageUrl={collegeHeroUrl(5)}
      />

      <Container className="py-10 space-y-12">
        {/* Intro */}
        <div className="space-y-4 border-b pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
              Academic Preeminence
            </Badge>
            <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs">
              Sections 12 & 13, Odisha Universities Act
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Academic Governance & Postgraduate Councils
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl">
            Academic standards, curricula, pedagogy, and research at {institution.name} are guided by two pivotal statutory councils.
            The **Academic Council** serves as the highest authority for university-wide academic policy,
            while the **Post-Graduate Council (P.G. Council)** directs the operational, departmental, and research administration
            of postgraduate faculties.
          </p>
        </div>

        {/* Section 1: The Academic Council */}
        <div className="space-y-6">
          <div className="border-b pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]">
                  Supreme Academic Body
                </Badge>
              </div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mt-1">
                <BookOpen className="size-5 text-primary" />
                The Academic Council
              </h2>
            </div>
            <div className="text-xs text-muted-foreground">
              Chaired by the Vice-Chancellor · Secretary: Registrar
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {academicCouncilMandates.map((m, idx) => (
              <Card key={idx} className="p-5 border border-border/70 bg-card space-y-2">
                <span className="font-mono text-xl font-black text-blue-600/40">Pillar 0{idx + 1}</span>
                <h3 className="font-bold text-sm text-foreground">{m.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
              </Card>
            ))}
          </div>

          {/* Boards of Studies */}
          <Card className="p-5 border border-border/70 bg-card space-y-3">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Layers className="size-4 text-primary" />
              Boards of Studies (BOS) Structure
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {boardsOfStudies.map((b, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border/50 space-y-1">
                  <span className="font-bold text-foreground block">{b.faculty}</span>
                  <span className="text-muted-foreground leading-relaxed block">{b.subjects}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Section 2: The P.G. Council */}
        <div className="space-y-6">
          <div className="border-b pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 text-[10px]">
                  Departmental Administration
                </Badge>
              </div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mt-1">
                <GraduationCap className="size-5 text-primary" />
                The Post-Graduate (P.G.) Council
              </h2>
            </div>
            <div className="text-xs text-muted-foreground">
              Chairperson: Prof. Satyabrata Dash · Location: P.G. Council Building
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pgCouncilCommittees.map((c, idx) => (
              <Card key={idx} className="p-5 border border-border/70 bg-card hover:border-primary/40 transition-all space-y-2.5">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] text-purple-600 border-purple-500/30">
                    Statutory Committee
                  </Badge>
                  <span className="text-[11px] font-mono text-muted-foreground">{c.lead}</span>
                </div>
                <h3 className="font-bold text-base text-foreground">{c.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{c.mandate}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Council Proceedings & Notifications Table */}
        <div className="space-y-6">
          <div className="border-b pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <FileText className="size-5 text-primary" />
                Council Proceedings & Notifications Repository
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Public academic notifications and resolution compendiums.
              </p>
            </div>
            <Button size="xs" variant="outline" asChild className="gap-1.5 text-xs text-primary border-primary/30 w-fit">
              <Link to="/college/departments">
                <span>Explore All Departments</span>
                <ExternalLink className="size-3" />
              </Link>
            </Button>
          </div>

          <Card className="border border-border/70 bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="text-xs font-bold w-44">Reference No.</TableHead>
                  <TableHead className="text-xs font-bold w-28">Date</TableHead>
                  <TableHead className="text-xs font-bold">Notification Subject</TableHead>
                  <TableHead className="text-xs font-bold hidden sm:table-cell w-36">Issuing Body</TableHead>
                  <TableHead className="text-xs font-bold text-right w-24">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {councilProceedings.map((row, i) => (
                  <TableRow key={i} className="hover:bg-muted/20">
                    <TableCell className="font-mono text-xs font-bold text-primary">{row.ref}</TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{row.date}</TableCell>
                    <TableCell className="text-xs font-medium text-foreground">{row.subject}</TableCell>
                    <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">
                      <Badge variant="outline" className="text-[10px]">
                        {row.council}
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
            <h3 className="font-bold text-base text-foreground">Explore Secretariats & Directory</h3>
            <p className="text-xs text-muted-foreground">Find direct contact extensions, building locations, and email addresses for all administrative wings.</p>
          </div>
          <Button size="sm" asChild className="gap-1.5 bg-primary text-white text-xs font-bold shadow-xs">
            <Link to="/college/administration/directory">
              <span>View Secretariats & Directory</span>
              <ChevronRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </Container>
    </>
  );
}
