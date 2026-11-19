import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  ShieldCheck,
  Heart,
  BookOpen,
  Award,
  CheckCircle2,
  Lock,
  Phone,
  Mail,
  FileText,
  Clock,
  ArrowRight,
  Download,
  ExternalLink,
  Send,
  Accessibility,
  Eye,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";
import { Hero } from "@/components/sections/Hero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { collegeHeroUrl } from "@/mocks/data/images";

interface CommitteeMember {
  name: string;
  designation: string;
  role: string;
  contact: string;
  email: string;
}

const EOC_COMMITTEE_MEMBERS: CommitteeMember[] = [
  {
    name: "Dr. Alok Nayak",
    designation: "Associate Professor & SC/ST Liaison Officer",
    role: "Liaison Officer / Convener",
    contact: "+91 98610 54321",
    email: "eoc.liaison@eduplatform.ac.in",
  },
  {
    name: "Dr. B. K. Ray",
    designation: "Associate Professor, Dept of Botany",
    role: "OBC Welfare Member",
    contact: "+91 94373 55667",
    email: "bkray.eoc@eduplatform.ac.in",
  },
  {
    name: "Dr. Snigdha Mohanty",
    designation: "Assistant Professor & HEPSN Coordinator",
    role: "Divyangjan Cell In-Charge",
    contact: "+91 98612 34567",
    email: "hepsn.coord@eduplatform.ac.in",
  },
  {
    name: "Mr. Satish Panda",
    designation: "Senior Scientific Officer",
    role: "Staff Representative",
    contact: "+91 674 230 4585",
    email: "spanda.eoc@eduplatform.ac.in",
  },
  {
    name: "Mr. Rakesh Soren",
    designation: "Postgraduate Student (M.Sc. Computer Science)",
    role: "ST Student Nominee",
    contact: "+91 70089 33221",
    email: "rakesh.st@eduplatform.ac.in",
  },
  {
    name: "Ms. Priyanka Behera",
    designation: "Undergraduate Student (B.A. English Hons)",
    role: "SC Student Nominee",
    contact: "+91 79788 11445",
    email: "priyanka.sc@eduplatform.ac.in",
  },
];

export default function EqualOpportunityCell() {
  const [complaintSubmitted, setComplaintSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [socialCategory, setSocialCategory] = useState("SC");
  const [complaintText, setComplaintText] = useState("");

  const handleCasteComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintText.trim()) {
      toast.error("Please enter the statement of grievance");
      return;
    }
    setComplaintSubmitted(true);
    toast.success("Complaint submitted to SC/ST Liaison Officer & Principal");
  };

  return (
    <div>
      {/* Hero Section */}
      <Hero
        title="Equal Opportunity Cell, SC/ST/OBC Cell & Divyangjan Welfare"
        subtitle="Dedicated statutory framework ensuring affirmative action, prevention of caste discrimination, barrier-free physical and digital accessibility, and socio-economic empowerment across all academic streams."
        backgroundImage={collegeHeroUrl}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/college" },
          { label: "Grievance & Welfare", href: "/college/grievance" },
          { label: "Equal Opportunity & Caste Cell", href: "/college/grievance/equal-opportunity" },
        ]}
      />

      <Container className="py-12 space-y-12">
        {/* Affirmative Action & Constitutional Framework Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-500/10 via-card to-background border-blue-500/30 shadow-sm lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-600 text-white text-xs">UGC Mandated Cell</Badge>
                <Badge variant="outline" className="text-xs text-blue-700 dark:text-blue-300 border-blue-300">
                  Prevention of Caste Discrimination
                </Badge>
              </div>
              <CardTitle className="text-2xl font-black text-foreground mt-2">
                Affirmative Inclusion & Social Justice
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm leading-relaxed">
                The Equal Opportunity Cell oversees the equitable execution of government reservation policies in admissions, financial aids, hostel seat allocations, and recruitment, while upholding an uncompromising barrier against discrimination based on caste, creed, or disability.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-muted-foreground leading-relaxed pt-0">
              <p>
                In strict adherence to UGC guidelines, the college maintains a physical and digital Caste Discrimination Complaint Register monitored directly by the Liaison Officer and the Principal. Remedial tutoring, free book bank services, and fellowship helpdesks operate throughout each academic session.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-foreground font-medium text-xs">
                <div className="p-2.5 rounded-lg border border-border/60 bg-muted/30">
                  <span className="font-bold block text-primary">SC/ST Book Bank</span>
                  <span className="text-[11px] text-muted-foreground">3,200+ reserved textbooks</span>
                </div>
                <div className="p-2.5 rounded-lg border border-border/60 bg-muted/30">
                  <span className="font-bold block text-primary">Remedial Classes</span>
                  <span className="text-[11px] text-muted-foreground">Free NET/GATE coaching</span>
                </div>
                <div className="p-2.5 rounded-lg border border-border/60 bg-muted/30">
                  <span className="font-bold block text-primary">100% Ramps & Lifts</span>
                  <span className="text-[11px] text-muted-foreground">Barrier-free campus facilities</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liaison Officer Quick Desk */}
          <Card className="border border-border/80 bg-card shadow-sm flex flex-col justify-between">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" /> SC/ST Liaison Officer
              </CardTitle>
              <CardDescription className="text-xs">
                Appointed pursuant to Department of Personnel and Training (DoPT) and UGC guidelines.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-muted/30 border border-border/60 space-y-1">
                <span className="text-muted-foreground block text-[11px]">Liaison Officer:</span>
                <span className="font-bold text-foreground text-sm block">Dr. Alok Nayak</span>
                <span className="text-[11px] text-muted-foreground">Associate Professor & Chief Warden</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  <span className="font-mono text-foreground font-semibold">+91 98610 54321</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  <a href="mailto:eoc@eduplatform.ac.in" className="text-primary hover:underline font-mono">
                    eoc@eduplatform.ac.in
                  </a>
                </div>
              </div>
            </CardContent>
            <div className="p-4 pt-0">
              <Button asChild size="sm" className="w-full text-xs font-bold gap-2">
                <a href="#caste-complaint-desk">
                  <FileText className="w-3.5 h-3.5" /> Lodge Caste Grievance
                </a>
              </Button>
            </div>
          </Card>
        </div>

        {/* Tabbed Section: Caste Cell / HEPSN Divyangjan / Welfare Schemes */}
        <Tabs defaultValue="welfare" className="space-y-6">
          <TabsList className="bg-muted/60 p-1">
            <TabsTrigger value="welfare" className="gap-2 text-xs">
              <Award className="w-4 h-4" /> Schemes & Remedial Coaching
            </TabsTrigger>
            <TabsTrigger value="divyangjan" className="gap-2 text-xs">
              <Accessibility className="w-4 h-4" /> HEPSN & Divyangjan Facilities
            </TabsTrigger>
            <TabsTrigger value="committee" className="gap-2 text-xs">
              <Users className="w-4 h-4" /> Advisory Committee Roster
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Schemes & Remedial Coaching */}
          <TabsContent value="welfare" className="space-y-6 mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border border-border/80 bg-card shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" /> SC/ST & EWS Book Bank Scheme
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                  <p>
                    Full sets of syllabus textbooks are loaned to enrolled SC, ST, OBC (non-creamy layer), and Divyangjan students for the entire semester without renewal penalties.
                  </p>
                  <p className="font-semibold text-foreground pt-1">
                    Location: Parija Central Library (Special Stack Wing)
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-border/80 bg-card shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-600" /> Remedial & Career Mentoring
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                  <p>
                    Special tutorial hours conducted on Saturdays in English communication, quantitative reasoning, and domain-specific coaching for CSIR-NET, GATE, and Banking PO examinations.
                  </p>
                  <p className="font-semibold text-foreground pt-1">
                    Coordinator: Dr. B. K. Ray (Botany)
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-border/80 bg-card shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-600" /> Scholarship Facilitation Desk
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                  <p>
                    Single-window assistance for State Scholarship Portal Odisha (Prerana, Medhabruti) and National Scholarship Portal (NSP Post-Matric, Top Class Scheme, Rajiv Gandhi Fellowship).
                  </p>
                  <p className="font-semibold text-foreground pt-1">
                    Helpdesk: Academic Counter 3 (Admin Block)
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab 2: HEPSN Divyangjan Facilities */}
          <TabsContent value="divyangjan" className="space-y-6 mt-0">
            <Card className="border border-border/80 bg-card shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Accessibility className="w-5 h-5 text-emerald-600" />
                  <Badge className="bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 text-xs">
                    RPwD Act 2016 Compliant
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold mt-2">
                  Higher Education for Persons with Special Needs (HEPSN) Enabling Unit
                </CardTitle>
                <CardDescription className="text-xs">
                  Ensuring a barrier-free physical, academic, and technological learning environment for persons with disabilities.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs text-muted-foreground">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 space-y-1">
                    <h4 className="font-bold text-foreground text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Barrier-Free Built Architecture
                    </h4>
                    <p className="text-[11px] leading-relaxed">
                      Gentle slope ramps (1:12) with handrails at all building entrances, tactile tiles from entrance to classrooms, dedicated reserved ground floor seating, and customized accessible washrooms in every academic block.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 space-y-1">
                    <h4 className="font-bold text-foreground text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Assistive Technology in Library
                    </h4>
                    <p className="text-[11px] leading-relaxed">
                      Equipped with NVDA and JAWS screen readers, digital Braille embossers, handheld video magnifiers, and DAISY digital talking books repository for visually impaired scholars.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 space-y-1">
                    <h4 className="font-bold text-foreground text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Statutory Scribe & Compensatory Time
                    </h4>
                    <p className="text-[11px] leading-relaxed">
                      Provision of eligible scribes/readers for semester examinations and compensatory extra time of 20 minutes per hour of examination as per Ministry of Social Justice guidelines.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 space-y-1">
                    <h4 className="font-bold text-foreground text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Campus Wheelchairs & Mobility Buggy
                    </h4>
                    <p className="text-[11px] leading-relaxed">
                      Wheelchairs stationed at Main Gate Security, Central Library, and Health Centre. Battery-operated transit buggy available upon call for inner-campus transit between hostel and lecture halls.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Advisory Committee Roster */}
          <TabsContent value="committee" className="space-y-4 mt-0">
            <div className="overflow-x-auto border border-border rounded-xl bg-card shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60 text-foreground font-semibold border-b border-border">
                  <tr>
                    <th className="p-3">Name & Designation</th>
                    <th className="p-3">Role in EOC</th>
                    <th className="p-3">Phone Contact</th>
                    <th className="p-3">Official Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {EOC_COMMITTEE_MEMBERS.map((m, idx) => (
                    <tr key={idx} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-foreground">{m.name}</div>
                        <div className="text-muted-foreground text-[11px]">{m.designation}</div>
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={m.role.includes("Liaison") ? "default" : "outline"}
                          className="text-[11px]"
                        >
                          {m.role}
                        </Badge>
                      </td>
                      <td className="p-3 font-mono font-medium text-foreground">{m.contact}</td>
                      <td className="p-3">
                        <a href={`mailto:${m.email}`} className="text-primary hover:underline">
                          {m.email}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>

        {/* Caste Discrimination Complaint Submission Desk */}
        <Card className="border border-blue-500/30 bg-card shadow-md" id="caste-complaint-desk">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <Badge className="bg-blue-600 text-white text-xs">Statutory Caste Grievance Desk</Badge>
            </div>
            <CardTitle className="text-xl font-bold mt-1">
              Lodging of Complaints Concerning Caste-Based Discrimination
            </CardTitle>
            <CardDescription className="text-xs">
              Mandatory portal under UGC instructions. The complaint is recorded directly in the Statutory Register under the supervision of the Liaison Officer and the Principal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!complaintSubmitted ? (
              <form onSubmit={handleCasteComplaint} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Complainant Name *</label>
                    <Input
                      type="text"
                      placeholder="e.g. Student / Staff Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="text-xs h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Roll No / Staff Code *</label>
                    <Input
                      type="text"
                      placeholder="e.g. 24PG-CH-012"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      required
                      className="text-xs h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Social Category *</label>
                    <select
                      value={socialCategory}
                      onChange={(e) => setSocialCategory(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="SC">Scheduled Caste (SC)</option>
                      <option value="ST">Scheduled Tribe (ST)</option>
                      <option value="OBC">Other Backward Classes (OBC)</option>
                      <option value="EWS">Economically Weaker Section (EWS)</option>
                      <option value="Divyangjan">Persons with Disabilities (PwD)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Detailed Statement of Allegation / Discrimination *</label>
                  <textarea
                    rows={4}
                    placeholder="Provide details regarding dates, locations, persons involved, nature of discrimination, and specific incident description..."
                    value={complaintText}
                    onChange={(e) => setComplaintText(e.target.value)}
                    required
                    className="w-full rounded-md border border-input bg-background p-3 text-xs text-foreground focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" /> Direct recording in Statutory Register
                  </span>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 text-xs">
                    <Send className="w-4 h-4" /> Submit to SC/ST Liaison Officer
                  </Button>
                </div>
              </form>
            ) : (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-foreground">Caste Grievance Recorded in Statutory Register</h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Your complaint has been acknowledged by the Liaison Officer. An inquiry committee will examine the submission in adherence with statutory UGC guidelines.
                </p>
                <Button size="sm" variant="outline" onClick={() => setComplaintSubmitted(false)}>
                  Submit Another Record
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cross-navigation to Other Grievance Sections */}
        <div className="pt-6 border-t border-border">
          <h3 className="text-lg font-bold mb-4">Statutory Welfare & Support Cells</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/college/grievance/e-pratikar"
              className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-sm group flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors text-sm">
                  Online Grievance (e-Pratikar)
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">Lodge & Track Grievance Status</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/college/grievance/anti-ragging"
              className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-sm group flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors text-sm">
                  Anti-Ragging Cell & Helpline
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">24x7 Helpline, Squad & Undertaking</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/college/grievance/icc"
              className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-sm group flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors text-sm">
                  Internal Committee (ICC)
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">PoSH Act 2013 & Gender Equity</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/college/grievance/feedback-atr"
              className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-sm group flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors text-sm">
                  Stakeholder Feedback & ATR
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">NAAC 1.4 Feedback & Action Reports</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
