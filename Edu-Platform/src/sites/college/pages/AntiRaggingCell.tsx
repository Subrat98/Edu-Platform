import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Phone,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Users,
  ExternalLink,
  Lock,
  ArrowRight,
  Download,
  AlertCircle,
  Clock,
  MapPin,
  Send,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { Hero } from "@/components/sections/Hero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { collegeHeroUrl } from "@/mocks/data/images";

interface CommitteeMember {
  name: string;
  designation: string;
  role: string;
  contact: string;
  email: string;
}

const ANTI_RAGGING_COMMITTEE: CommitteeMember[] = [
  {
    name: "Prof. (Dr.) Manas Ranjan Pujari",
    designation: "Principal / Head of Institution",
    role: "Chairman",
    contact: "+91 674 230 4581",
    email: "principal@eduplatform.ac.in",
  },
  {
    name: "Dr. Satyabrata Dash",
    designation: "Professor & Proctor",
    role: "Convener",
    contact: "+91 94370 12345",
    email: "proctor@eduplatform.ac.in",
  },
  {
    name: "Inspector-in-Charge, Capital Police Station",
    designation: "Police Administration Representative",
    role: "Member (Statutory)",
    contact: "0674-2530100",
    email: "iic.capital@odishapolice.gov.in",
  },
  {
    name: "Sub-Collector / Executive Magistrate",
    designation: "Civil Administration Nominee",
    role: "Member (Statutory)",
    contact: "0674-2401200",
    email: "subcollector.bhubaneswar@nic.in",
  },
  {
    name: "Dr. Rashmita Mishra",
    designation: "Dean of Student Welfare & ICC",
    role: "Member",
    contact: "+91 94371 98765",
    email: "dsw@eduplatform.ac.in",
  },
  {
    name: "Dr. Alok Nayak",
    designation: "Chief Warden (Boys' Hostels)",
    role: "Member",
    contact: "+91 98610 54321",
    email: "warden.boys@eduplatform.ac.in",
  },
  {
    name: "Dr. Suchitra Sahoo",
    designation: "Chief Warden (Girls' Hostels)",
    role: "Member",
    contact: "+91 94380 65432",
    email: "warden.girls@eduplatform.ac.in",
  },
  {
    name: "Smt. Jayashree Pattnaik",
    designation: "President, People's Forum (Registered Youth NGO)",
    role: "External NGO Representative",
    contact: "+91 94372 11223",
    email: "ngo.peoplesforum@gmail.com",
  },
  {
    name: "Shri Prasanna Kumar Das",
    designation: "Parents' Association Representative",
    role: "Member",
    contact: "+91 94390 33445",
    email: "parents.rep@eduplatform.ac.in",
  },
  {
    name: "Mr. Ayush Mohanty",
    designation: "Student Representative (Senior Wing)",
    role: "Student Member",
    contact: "+91 70081 22334",
    email: "ayush.senior@eduplatform.ac.in",
  },
  {
    name: "Ms. Ananya Swastika",
    designation: "Student Representative (Fresher Wing)",
    role: "Student Member",
    contact: "+91 79782 55667",
    email: "ananya.fresher@eduplatform.ac.in",
  },
];

const SQUAD_PATROL_ZONES = [
  { zone: "Biju Patnaik Central Library & Common Rooms", timings: "10:00 AM - 04:00 PM (Surprise Checks)", officer: "Dr. B. K. Ray" },
  { zone: "Hostel Blocks A, B & C (Boys' Campus)", timings: "07:30 PM - 11:30 PM (Daily Night Vigils)", officer: "Dr. Alok Nayak & Squad 1" },
  { zone: "Kasturba & Sarojini Hostels (Girls' Campus)", timings: "06:30 PM - 10:00 PM (Daily Evening Vigils)", officer: "Dr. Suchitra Sahoo & Squad 2" },
  { zone: "Central Canteen, Food Kiosks & Bus Parking", timings: "12:30 PM - 03:00 PM (Lunch Hours)", officer: "Mr. Satish Panda" },
];

export default function AntiRaggingCell() {
  const [reportName, setReportName] = useState("");
  const [reportPhone, setReportPhone] = useState("");
  const [reportIncident, setReportIncident] = useState("");
  const [reportLocation, setReportLocation] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const handleSOSReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportIncident.trim()) {
      toast.error("Please enter incident details");
      return;
    }
    setReportSubmitted(true);
    toast.success("URGENT: Incident reported to Anti-Ragging Quick Response Squad!");
  };

  return (
    <div>
      {/* Hero Section */}
      <Hero
        title="Anti-Ragging Cell & 24x7 Emergency Helpline"
        subtitle="Zero tolerance policy against ragging in any form, maintaining campus safety, student dignity, and strict enforcement of Hon'ble Supreme Court and UGC Regulations 2009."
        backgroundImage={collegeHeroUrl}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/college" },
          { label: "Grievance & Welfare", href: "/college/grievance" },
          { label: "Anti-Ragging Cell & Helpline", href: "/college/grievance/anti-ragging" },
        ]}
      />

      <Container className="py-12 space-y-12">
        {/* Urgent National & Institutional Helplines Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-rose-500/10 via-card to-background border-rose-500/30 shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge className="bg-rose-600 text-white font-bold text-xs">National 24x7 Toll Free</Badge>
                <Phone className="w-5 h-5 text-rose-600 animate-pulse" />
              </div>
              <CardTitle className="text-2xl font-black text-rose-700 dark:text-rose-400 mt-2">
                1800-180-5522
              </CardTitle>
              <CardDescription className="text-xs">
                UGC National Anti-Ragging Helpline (Toll Free Round-the-Clock).
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 text-xs text-muted-foreground">
              Email: <a href="mailto:helpline@antiragging.in" className="text-primary hover:underline font-semibold">helpline@antiragging.in</a><br />
              Web: <a href="https://www.antiragging.in" target="_blank" rel="noreferrer" className="text-primary hover:underline">www.antiragging.in</a>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 via-card to-background border-primary/30 shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge className="bg-primary text-primary-foreground font-bold text-xs">Campus Flying Squad</Badge>
                <AlertTriangle className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-2xl font-black text-foreground mt-2">
                +91 94370 12345
              </CardTitle>
              <CardDescription className="text-xs">
                Campus Proctorial Emergency & Immediate Intervention Hotline.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 text-xs text-muted-foreground">
              Proctor Office: Ground Floor, Administrative Block<br />
              Direct Email: <a href="mailto:antiragging@eduplatform.ac.in" className="text-primary hover:underline font-semibold">antiragging@eduplatform.ac.in</a>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 via-card to-background border-blue-500/30 shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge className="bg-blue-600 text-white font-bold text-xs">Mandatory Online Undertaking</Badge>
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <CardTitle className="text-lg font-bold text-foreground mt-2">
                Annual Student Affidavit
              </CardTitle>
              <CardDescription className="text-xs">
                Compulsory compliance for every student at the start of each academic year.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button asChild size="sm" variant="outline" className="w-full text-xs font-semibold gap-1.5">
                <a href="https://www.antiragging.in/affidavit_registration_disclaimer.html" target="_blank" rel="noreferrer">
                  Fill Anti-Ragging Undertaking <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Zero Tolerance Policy Statement & Definitions */}
        <Card className="bg-card border-border/80 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <Badge className="bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-xs">
                Zero Tolerance Campus
              </Badge>
            </div>
            <CardTitle className="text-xl font-bold mt-2">
              Statutory Definition of Ragging & Zero Tolerance Framework
            </CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              In terms of the Supreme Court of India judgement and the UGC Regulations on Curbing the Menace of Ragging in Higher Educational Institutions, 2009:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs text-muted-foreground leading-relaxed">
            <p>
              Ragging constitutes any act by any student or students whether by words spoken or written or by an act which has the effect of teasing, treating or handling with rudeness a fresher or any other student, generating a sense of shame, embarrassment, physical discomfort, mental agony, or danger to health or life.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20">
                <h4 className="font-bold text-foreground text-xs mb-1">Verbal & Mental Abuse</h4>
                <p className="text-[11px]">
                  Unkind mockery, vulgar jokes, insulting remarks based on regionalism, appearance, socio-economic background, caste, or gender.
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20">
                <h4 className="font-bold text-foreground text-xs mb-1">Physical Assault & Coercion</h4>
                <p className="text-[11px]">
                  Forcing dress codes, confining students to hostel rooms, requiring personal menial tasks, or any act that impairs physical safety.
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20">
                <h4 className="font-bold text-foreground text-xs mb-1">Cyber-Bullying & Blackmail</h4>
                <p className="text-[11px]">
                  Intimidating messages, non-consensual recordings, social media trolling, or spreading defamatory rumours about fellow scholars.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Anti-Ragging Committee Matrix */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Statutory Anti-Ragging Committee (2026-27)</h2>
              <p className="text-xs text-muted-foreground">
                Appointed in strict alignment with UGC norms, incorporating district administration, police authorities, media, faculty, and student representatives.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                alert("Downloading Statutory Anti-Ragging Notification Order (PDF)");
              }}
              className="gap-2 text-xs shrink-0"
            >
              <Download className="w-3.5 h-3.5" /> Download Committee Gazette (PDF)
            </Button>
          </div>

          <div className="overflow-x-auto border border-border rounded-xl bg-card shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-foreground font-semibold border-b border-border">
                <tr>
                  <th className="p-3">Name & Designation</th>
                  <th className="p-3">Role in Committee</th>
                  <th className="p-3">Contact Number</th>
                  <th className="p-3">Official Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {ANTI_RAGGING_COMMITTEE.map((m, idx) => (
                  <tr key={idx} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-foreground">{m.name}</div>
                      <div className="text-muted-foreground text-[11px]">{m.designation}</div>
                    </td>
                    <td className="p-3">
                      <Badge
                        variant={m.role === "Chairman" ? "default" : m.role === "Convener" ? "secondary" : "outline"}
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
        </div>

        {/* Flying Squad Patrol Roster & Statutory Penalties */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Anti-Ragging Flying Squad */}
          <Card className="border border-border/80 bg-card shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" /> Anti-Ragging Squad (Flying Squad) Vigil
              </CardTitle>
              <CardDescription className="text-xs">
                Conducts round-the-clock unannounced patrols across vulnerable campus hubs and residential hostels.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {SQUAD_PATROL_ZONES.map((zone, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> {zone.zone}
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">{zone.timings}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Supervising Officer: <strong className="text-foreground">{zone.officer}</strong>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Statutory Penalties */}
          <Card className="border border-border/80 bg-card shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" /> Statutory Punitive Penalties
              </CardTitle>
              <CardDescription className="text-xs">
                Students found guilty of ragging face non-negotiable statutory punishments under Section 9.1 of UGC Regulations:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-start gap-2 p-2 rounded bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span><strong>Immediate Suspension</strong> from attending classes and academic privileges.</span>
              </div>
              <div className="flex items-start gap-2 p-2 rounded bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span><strong>Withholding & Forfeiture</strong> of scholarships, stipends, and placement recommendation.</span>
              </div>
              <div className="flex items-start gap-2 p-2 rounded bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span><strong>Debarment from Examinations</strong> and cancellation of university results.</span>
              </div>
              <div className="flex items-start gap-2 p-2 rounded bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span><strong>Immediate Eviction</strong> from hostels and institutional rustication (1 to 4 semesters).</span>
              </div>
              <div className="flex items-start gap-2 p-2 rounded bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span><strong>Criminal Prosecution:</strong> Mandatory registration of FIR with Capital Police Station under non-bailable clauses.</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Confidential SOS Incident Flash Reporting */}
        <Card className="border-2 border-rose-500/40 bg-card shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600 animate-bounce" />
              <Badge className="bg-rose-600 text-white text-xs">Immediate Response Channel</Badge>
            </div>
            <CardTitle className="text-xl font-bold mt-1 text-foreground">
              Confidential Whistleblower Incident Reporting Desk
            </CardTitle>
            <CardDescription className="text-xs">
              If you witness or experience any ragging incident, report it immediately. Whistleblower identity is legally protected.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!reportSubmitted ? (
              <form onSubmit={handleSOSReport} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Location of Incident *</label>
                    <Input
                      type="text"
                      placeholder="e.g. Hostel Block B 2nd Floor or Central Canteen"
                      value={reportLocation}
                      onChange={(e) => setReportLocation(e.target.value)}
                      required
                      className="text-xs h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Optional Name & Contact (If not anonymous)</label>
                    <Input
                      type="text"
                      placeholder="e.g. Student Name / Phone"
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                      disabled={isAnonymous}
                      className="text-xs h-9"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Incident Description & Persons Involved *</label>
                  <textarea
                    rows={4}
                    placeholder="Describe what occurred, timing, specific acts, and current situation..."
                    value={reportIncident}
                    onChange={(e) => setReportIncident(e.target.value)}
                    required
                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="h-4 w-4 rounded border-input text-rose-600 focus:ring-rose-500"
                    />
                    <span className="font-semibold text-foreground text-xs flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" /> Keep My Report Strictly Anonymous
                    </span>
                  </label>

                  <Button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white font-bold gap-2 text-xs">
                    <Send className="w-4 h-4" /> Dispatch Urgent Report to Squad
                  </Button>
                </div>
              </form>
            ) : (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-foreground">Alert Dispatched to Quick Response Squad</h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  The Proctor and Flying Squad have been alerted. Emergency patrol teams are deploying to the specified location.
                </p>
                <Button size="sm" variant="outline" onClick={() => setReportSubmitted(false)}>
                  Submit Additional Information
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
              to="/college/grievance/equal-opportunity"
              className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-sm group flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors text-sm">
                  Equal Opportunity & Caste Cell
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">SC/ST/OBC & Divyangjan Welfare</p>
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
