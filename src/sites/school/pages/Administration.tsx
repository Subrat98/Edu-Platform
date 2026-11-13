import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  ShieldCheck,
  Building2,
  Calendar,
  FileText,
  UserCheck,
  Download,
  AlertTriangle,
  Heart,
  ChevronRight,
  Phone,
  Mail,
  Award,
  BookOpen,
} from "lucide-react";
import { Container } from "@/components/common/Container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Hero } from "@/components/sections/Hero";
import { schoolHeroUrl } from "@/mocks/data/images";

export default function SchoolAdministration() {
  const [activeTab, setActiveTab] = useState<"leadership" | "smc" | "pta" | "committees" | "organogram">("leadership");

  const leadership = [
    {
      title: "Principal",
      name: "Smt. Sunita Mohanty",
      qual: "M.Sc. (Physics), B.Ed., CTET Qualified",
      experience: "22 Years of Educational Leadership",
      phone: "+91 98765 43210",
      email: "principal@ourschool.edu.in",
      message: "At Our School, we look upon every child as a unique reservoir of potential. Guided by NEP 2020 and CBSE core standards, we foster an environment where scientific curiosity meets empathetic character building.",
    },
    {
      title: "Vice-Principal",
      name: "Shri Ramesh Chandra Swain",
      qual: "M.A. (English), M.Ed.",
      experience: "18 Years of Teaching & Academic Administration",
      phone: "+91 94371 98765",
      email: "vp@ourschool.edu.in",
      message: "Coordination between parents, teachers, and students is our prime focus. We ensure robust discipline, joyful classrooms, and transparent compliance with every statutory board requirement.",
    },
  ];

  const smcMembers = [
    { sNo: 1, name: "Dr. P. K. Mohapatra", role: "Chairman / President", category: "Eminent Educationist" },
    { sNo: 2, name: "Smt. Sunita Mohanty", role: "Member Secretary", category: "Principal, Our School" },
    { sNo: 3, name: "Shri Bipin Bihari Nayak", role: "Member (Parent)", category: "Parent of Class VIII Student" },
    { sNo: 4, name: "Smt. Manorama Rout", role: "Member (Parent - RTE Quota)", category: "Parent Representative" },
    { sNo: 5, name: "Shri Ashok Kumar Sahoo", role: "Teacher Member", category: "Senior Faculty (PGT Math)" },
    { sNo: 6, name: "Smt. Jayanti Das", role: "Teacher Member", category: "TGT (Science)" },
    { sNo: 7, name: "Shri Santosh Kumar Parida", role: "Local Authority", category: "Khandapara NAC Councillor" },
    { sNo: 8, name: "Nominee of DEO Nayagarh", role: "Ex-Officio Member", category: "Dept of School & Mass Education" },
    { sNo: 9, name: "Dr. Alaka Mishra", role: "Academic Expert", category: "Professor of Education" },
    { sNo: 10, name: "Smt. Pratima Barik", role: "Social Worker / Women Rep", category: "Child Welfare Activist" },
  ];

  const ptaMembers = [
    { name: "Shri Debendra Nath Sahoo", designation: "PTA President", childClass: "Class X-A" },
    { name: "Smt. Sunita Mohanty", designation: "Ex-Officio Secretary", childClass: "Principal" },
    { name: "Smt. Namita Priyadarshini", designation: "Vice President", childClass: "Class VII-B" },
    { name: "Shri Ramesh Chandra Swain", designation: "Joint Secretary", childClass: "Vice-Principal" },
    { name: "Shri Pradeep Kumar Jena", designation: "Treasurer", childClass: "Class IV-A" },
  ];

  const committees = [
    {
      title: "School Safety & Child Protection Committee (POCSO)",
      purpose: "Zero-tolerance framework for child abuse, bullying, or corporal punishment as per POCSO Act 2012 and CBSE guidelines.",
      head: "Presiding Officer: Smt. Sunita Mohanty (Principal)",
      members: "Dr. Arpita Pattnaik (Counsellor), Smt. Manorama Rout (Parent), Sub-Inspector Khandapara PS",
      helpline: "National Childline: 1098 · School Safe Line: 06757-223456",
    },
    {
      title: "Anti-Bullying & Anti-Ragging Committee",
      purpose: "Campus monitoring, peer counselling, sensitisation workshops, and swift disciplinary inquiries against harassment.",
      head: "Convener: Shri Ramesh Chandra Swain (Vice-Principal)",
      members: "Shri Rajesh Kumar Behera (PET), Smt. Jayanti Das (TGT), Head Boy & Head Girl",
      helpline: "antibullying@ourschool.edu.in",
    },
    {
      title: "Internal Complaints Committee (ICC — Women & Staff)",
      purpose: "Prevention, prohibition, and redressal of sexual harassment of women employees under the PoSH Act 2013.",
      head: "Presiding Officer: Dr. Subhashree Dash (PGT Chemistry)",
      members: "Smt. Priyadarshini Jena (PGT), Smt. Pratima Barik (External NGO), Shri Debidatta Mohanty",
      helpline: "icc@ourschool.edu.in",
    },
    {
      title: "School Grievance Redressal Committee",
      purpose: "Transparent hearing of academic, examination, transport, fee, or canteen grievances from parents and students.",
      head: "Grievance Officer: Shri Ashok Kumar Sahoo (PGT)",
      members: "Shri Sanjib Kumar Rout, 2 Parent Representatives, Student Council Secretary",
      helpline: "grievance@ourschool.edu.in",
    },
  ];

  return (
    <>
      <Hero
        variant="compact"
        title="Administration & Governance"
        subtitle="Leadership, School Management Committee (SMC), PTA, and Child Safety Governance"
        imageUrl={schoolHeroUrl(2)}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/school" }, { label: "Administration" }]} />

      <Container className="py-10 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b pb-3">
          {[
            { id: "leadership", label: "School Leadership" },
            { id: "smc", label: "School Management Committee (SMC)" },
            { id: "pta", label: "Parent-Teacher Association (PTA)" },
            { id: "committees", label: "Statutory & Safety Cells" },
            { id: "organogram", label: "Organisation Chart" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Leadership */}
        {activeTab === "leadership" && (
          <div className="space-y-6">
            <div className="border-b pb-3">
              <h2 className="text-xl font-bold text-foreground">Executive School Leadership</h2>
              <p className="text-xs text-muted-foreground">The administrative and pedagogical custodians of Our School.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leadership.map((leader) => (
                <Card key={leader.title} className="border border-border/70 bg-card p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="size-16 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center font-black text-primary text-2xl shrink-0">
                      {leader.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold">
                        {leader.title}
                      </Badge>
                      <h3 className="text-base font-bold text-foreground mt-1">{leader.name}</h3>
                      <p className="text-xs text-muted-foreground">{leader.qual}</p>
                      <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">{leader.experience}</p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed italic bg-muted/30 p-3 rounded-lg border border-border/40">
                    "{leader.message}"
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-border/50 text-muted-foreground">
                    <div className="flex items-center gap-1.5 truncate">
                      <Phone className="size-3 text-primary shrink-0" />
                      <span>{leader.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="size-3 text-primary shrink-0" />
                      <span>{leader.email}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Quick Link to Faculty Staff Directory */}
            <div className="p-4 rounded-xl border bg-muted/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="space-y-0.5 text-center sm:text-left">
                <div className="font-bold text-sm text-foreground">Complete Staff Directory</div>
                <div className="text-xs text-muted-foreground">View all 48 qualified PGTs, TGTs, PRTs, Special Educator, and PET coaches.</div>
              </div>
              <Button asChild size="sm" className="gap-1.5 text-xs font-bold">
                <Link to="/school/faculty-staff">
                  <span>Open Staff Directory</span>
                  <ChevronRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* TAB 2: SMC / SDMC */}
        {activeTab === "smc" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
              <div>
                <h2 className="text-xl font-bold text-foreground">School Management Committee (SMC / SDMC)</h2>
                <p className="text-xs text-muted-foreground">Constituted in accordance with Section 21 of the RTE Act 2009 and CBSE Affiliation Bye-Laws.</p>
              </div>
              <Button asChild size="sm" variant="outline" className="gap-1.5 text-xs font-semibold">
                <a href="/documents/school/disclosure/SMC_Resolution_2026.pdf" download>
                  <Download className="size-3.5" />
                  <span>Download SMC Constitution & Minutes</span>
                </a>
              </Button>
            </div>

            <div className="border rounded-xl overflow-hidden bg-card shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/80 text-foreground font-bold border-b">
                  <tr>
                    <th className="p-3 w-16 text-center">S.No.</th>
                    <th className="p-3">Member Name</th>
                    <th className="p-3">Committee Designation</th>
                    <th className="p-3">Category / Representation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {smcMembers.map((m) => (
                    <tr key={m.sNo} className="hover:bg-muted/30">
                      <td className="p-3 text-center font-mono text-muted-foreground font-semibold">{m.sNo}</td>
                      <td className="p-3 font-bold text-foreground">{m.name}</td>
                      <td className="p-3 font-semibold text-primary">{m.role}</td>
                      <td className="p-3 text-muted-foreground">{m.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border border-border/70 p-4 space-y-2 bg-card">
                <div className="font-bold text-xs text-foreground flex items-center gap-2">
                  <Calendar className="size-4 text-primary" />
                  <span>SMC Meeting Frequency & Quorum</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The SMC meets once every two months (minimum 6 meetings annually) to review academic progress, infrastructure utilization, PM-POSHAN mid-day meals, safety compliance, and annual budget.
                </p>
              </Card>

              <Card className="border border-border/70 p-4 space-y-2 bg-card">
                <div className="font-bold text-xs text-foreground flex items-center gap-2">
                  <FileText className="size-4 text-emerald-600" />
                  <span>School Development Plan (SDP)</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  A 3-year rolling School Development Plan (2025–2028) prepared by SMC focusing on smart classroom expansion, Atal Tinkering Lab equipment upgradation, and inclusive sensory park facilities.
                </p>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 3: PTA */}
        {activeTab === "pta" && (
          <div className="space-y-6">
            <div className="border-b pb-3">
              <h2 className="text-xl font-bold text-foreground">Parent-Teacher Association (PTA)</h2>
              <p className="text-xs text-muted-foreground">Fostering active partnership between home and school for holistic student growth.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ptaMembers.map((pta) => (
                <Card key={pta.name} className="border border-border/70 p-4 space-y-1 bg-card">
                  <Badge variant="outline" className="text-[10px] font-semibold text-primary">
                    {pta.designation}
                  </Badge>
                  <div className="font-bold text-sm text-foreground pt-1">{pta.name}</div>
                  <div className="text-xs text-muted-foreground">Representation: {pta.childClass}</div>
                </Card>
              ))}
            </div>

            <div className="p-4 rounded-xl border bg-card space-y-3">
              <div className="font-bold text-sm text-foreground">Parent-Teacher Meeting (PTM) Calendar 2026-27</div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-muted/40 border">
                  <div className="font-bold text-primary">Quarter 1 PTM</div>
                  <div className="text-muted-foreground mt-0.5">25 July 2026</div>
                  <div className="text-[11px] text-muted-foreground mt-1">Periodic Assessment 1 Review</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/40 border">
                  <div className="font-bold text-primary">Quarter 2 PTM</div>
                  <div className="text-muted-foreground mt-0.5">17 October 2026</div>
                  <div className="text-[11px] text-muted-foreground mt-1">Half-Yearly Exam Evaluation</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/40 border">
                  <div className="font-bold text-primary">Quarter 3 PTM</div>
                  <div className="text-muted-foreground mt-0.5">09 January 2027</div>
                  <div className="text-[11px] text-muted-foreground mt-1">Periodic Assessment 2 & Pre-Board</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/40 border">
                  <div className="font-bold text-primary">Annual PTM</div>
                  <div className="text-muted-foreground mt-0.5">27 March 2027</div>
                  <div className="text-[11px] text-muted-foreground mt-1">Final Holistic Report Card Release</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Statutory Committees */}
        {activeTab === "committees" && (
          <div className="space-y-6">
            <div className="border-b pb-3">
              <h2 className="text-xl font-bold text-foreground">Statutory Safety, Protection & Redressal Cells</h2>
              <p className="text-xs text-muted-foreground">Mandated under CBSE Bye-Laws, POCSO Act 2012, PoSH Act 2013, and Supreme Court directives.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {committees.map((comm) => (
                <Card key={comm.title} className="border border-border/70 p-5 space-y-3 bg-card shadow-xs">
                  <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                    <ShieldCheck className="size-4 text-emerald-600" />
                    <span>{comm.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {comm.purpose}
                  </p>
                  <div className="p-2.5 rounded-lg bg-muted/40 border border-border/50 space-y-1 text-xs">
                    <div className="font-semibold text-primary">{comm.head}</div>
                    <div className="text-muted-foreground text-[11px]">Members: {comm.members}</div>
                    <div className="text-emerald-700 dark:text-emerald-300 font-mono text-[11px] pt-0.5">
                      {comm.helpline}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Organogram */}
        {activeTab === "organogram" && (
          <div className="space-y-6">
            <div className="border-b pb-3">
              <h2 className="text-xl font-bold text-foreground">School Governance Organogram</h2>
              <p className="text-xs text-muted-foreground">Hierarchical administration structure of Our School.</p>
            </div>

            <div className="p-6 rounded-2xl border bg-card text-center space-y-6">
              {/* Top Tier */}
              <div className="inline-block px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md">
                School Managing Committee (SMC) & Trust Board
              </div>

              <div className="w-0.5 h-6 bg-border mx-auto" />

              {/* Tier 2 */}
              <div className="inline-block px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm shadow-md">
                Principal & Head of School (Smt. Sunita Mohanty)
              </div>

              <div className="w-0.5 h-6 bg-border mx-auto" />

              {/* Tier 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
                <div className="p-4 rounded-xl border bg-muted/40 text-left space-y-1">
                  <div className="font-bold text-xs text-primary">Academic & Curriculum Wing</div>
                  <div className="text-xs text-foreground font-semibold">Vice-Principal & Headmistress</div>
                  <div className="text-[11px] text-muted-foreground">PGTs · TGTs · PRTs · Pre-Primary Teachers · Special Educator</div>
                </div>

                <div className="p-4 rounded-xl border bg-muted/40 text-left space-y-1">
                  <div className="font-bold text-xs text-emerald-600">Student Welfare & Co-Curricular</div>
                  <div className="text-xs text-foreground font-semibold">Activity In-Charge & PET</div>
                  <div className="text-[11px] text-muted-foreground">Houses · Sports · NCC · Scouts · ATL Lab · Counsellor</div>
                </div>

                <div className="p-4 rounded-xl border bg-muted/40 text-left space-y-1">
                  <div className="font-bold text-xs text-purple-600">Administration & Accounts</div>
                  <div className="text-xs text-foreground font-semibold">Administrative Officer</div>
                  <div className="text-[11px] text-muted-foreground">Admissions Desk · Accounts · Transport · Security & Housekeeping</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </>
  );
}
