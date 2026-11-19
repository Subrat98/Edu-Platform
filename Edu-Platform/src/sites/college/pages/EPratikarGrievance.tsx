import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Send,
  Lock,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  UserCheck,
  Phone,
  Mail,
  ArrowRight,
  HelpCircle,
  Scale,
  Building,
  Upload,
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

export default function EPratikarGrievance() {
  const [trackId, setTrackId] = useState("");
  const [trackResult, setTrackResult] = useState<any>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [userRole, setUserRole] = useState("Student");
  const [category, setCategory] = useState("Academic & CIE");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [isConfidential, setIsConfidential] = useState(true);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackId.trim()) {
      toast.error("Please enter a valid Grievance Tracking ID");
      return;
    }
    const cleanId = trackId.trim().toUpperCase();
    if (cleanId.includes("4891") || cleanId.includes("RESOLVED")) {
      setTrackResult({
        id: cleanId,
        date: "28-Oct-2026",
        category: "Examination Marks Scrutiny & Re-addition",
        status: "Resolved",
        assignedOfficer: "Controller of Examinations & SGRC Committee",
        actionTaken: "Marks verified against physical answer scripts by three-member scrutiny committee. Corrected grade sheet updated in e-Samarth portal.",
        timeline: [
          { date: "28-Oct-2026", stage: "Grievance Lodged", done: true },
          { date: "29-Oct-2026", stage: "Preliminary Scrutiny Passed", done: true },
          { date: "02-Nov-2026", stage: "Committee Hearing & Verification", done: true },
          { date: "04-Nov-2026", stage: "Final Resolution Dispatched", done: true },
        ],
      });
      toast.success("Grievance Status: Resolved");
    } else {
      setTrackResult({
        id: cleanId,
        date: "08-Nov-2026",
        category: "Hostel Wi-Fi Bandwidth & Water Filtration Unit",
        status: "Under Investigation",
        assignedOfficer: "Chief Warden & Estate Maintenance Officer",
        actionTaken: "Inspection carried out on 10-Nov-2026. Commercial filter cartridge replacement requisition approved by Comptroller of Finance. Installation scheduled for 18-Nov-2026.",
        timeline: [
          { date: "08-Nov-2026", stage: "Grievance Lodged", done: true },
          { date: "10-Nov-2026", stage: "Site Inspection Completed", done: true },
          { date: "12-Nov-2026", stage: "Vendor Procurement Initiated", done: true },
          { date: "Pending", stage: "Final Closure & Verification", done: false },
        ],
      });
      toast.info("Grievance Record Retrieved");
    }
  };

  const handleSubmitGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !rollNo || !description) {
      toast.error("Please fill in all mandatory fields (*)");
      return;
    }
    const newId = `PRK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedTicket(newId);
    setFormSubmitted(true);
    toast.success(`Grievance Lodged: ${newId}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <Hero
        title="e-Pratikar Online Grievance Redressal Portal"
        subtitle="Statutory single-window digital redressal platform for students, scholars, faculty, and non-teaching staff in compliance with UGC (Redressal of Grievances of Students) Regulations 2023."
        backgroundImage={collegeHeroUrl}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/college" },
          { label: "Grievance & Welfare", href: "/college/grievance" },
          { label: "Online Grievance (e-Pratikar)", href: "/college/grievance/e-pratikar" },
        ]}
      />

      <Container className="py-12 space-y-12">
        {/* Compliance & Emergency Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-background to-rose-500/10 border border-primary/20">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-primary text-primary-foreground font-semibold text-xs">
                UGC SGRC Portal 2023
              </Badge>
              <Badge variant="outline" className="text-xs font-semibold text-emerald-600 border-emerald-300 bg-emerald-50/50">
                Guaranteed 15-Day Time-Bound Redressal
              </Badge>
              <Badge variant="outline" className="text-xs font-semibold text-purple-600 border-purple-300">
                Independent University Ombudsperson
              </Badge>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-foreground">
              Direct & Encrypted Redressal Mechanism
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm max-w-3xl leading-relaxed">
              Every complaint is logged with tamper-proof timestamps, directly routed to the Student Grievance Redressal Committee (SGRC) or Employee Grievance Cell, and monitored with strict whistleblower confidentiality.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <div className="p-3 rounded-xl border border-border bg-card shadow-xs text-xs space-y-0.5">
              <div className="text-muted-foreground">SGRC Convener Desk:</div>
              <div className="font-bold text-foreground">Prof. Satyabrata Dash</div>
              <div className="font-mono text-primary text-[11px]">sgrc@eduplatform.ac.in</div>
            </div>
          </div>
        </div>

        {/* Main 2-Column: File Grievance + Track Status */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Column (7 cols) */}
          <div className="lg:col-span-7">
            <Card className="border border-border/80 bg-card shadow-sm">
              <CardHeader className="pb-4 border-b border-border/60">
                <CardTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
                  <ShieldCheck className="w-5 h-5 text-primary" /> Lodge a New Grievance
                </CardTitle>
                <CardDescription className="text-xs">
                  Fill in the details below. All submissions are encrypted and forwarded directly to the designated grievance officer.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {!formSubmitted ? (
                  <form onSubmit={handleSubmitGrievance} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="font-semibold text-foreground">Stakeholder Category *</label>
                        <select
                          value={userRole}
                          onChange={(e) => setUserRole(e.target.value)}
                          className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-primary"
                        >
                          <option value="Student">Enrolled Student</option>
                          <option value="Research Scholar">PhD Scholar / JRF</option>
                          <option value="Faculty">Teaching Faculty</option>
                          <option value="Staff">Non-Teaching Staff</option>
                          <option value="Parent">Parent / Guardian</option>
                          <option value="Alumni">Alumnus</option>
                        </select>
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="font-semibold text-foreground">Full Name *</label>
                        <Input
                          type="text"
                          placeholder="e.g. Priyadarshini Jena"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="text-xs h-9"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-semibold text-foreground">Roll No / Scholar ID / Employee Code *</label>
                        <Input
                          type="text"
                          placeholder="e.g. 24UG-CS-018"
                          value={rollNo}
                          onChange={(e) => setRollNo(e.target.value)}
                          required
                          className="text-xs h-9"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-foreground">Department / School / Branch</label>
                        <Input
                          type="text"
                          placeholder="e.g. Department of Physics"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="text-xs h-9"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-semibold text-foreground">Official Email *</label>
                        <Input
                          type="email"
                          placeholder="e.g. student@eduplatform.ac.in"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="text-xs h-9"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-foreground">Mobile Phone (For SMS updates)</label>
                        <Input
                          type="tel"
                          placeholder="e.g. +91 98765 43210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="text-xs h-9"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-foreground">Grievance Classification *</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-primary"
                      >
                        <option value="Academic & CIE">Academic & Continuous Internal Evaluation (CIE)</option>
                        <option value="Examinations & Marksheet">Examination, Backlog, Result & Degree Certificates</option>
                        <option value="Hostel & Canteen Amenities">Hostel Accommodation, Mess Quality & Maintenance</option>
                        <option value="Fee & Scholarships">Tuition Fee Refund, Freeships & Scholarship Disbursement</option>
                        <option value="Library & ICT">Library Book Issue, Koha OPAC & Wi-Fi Internet Access</option>
                        <option value="Divyangjan Barrier-Free">Divyangjan Accessibility & Facilities</option>
                        <option value="Administrative Delay">Administrative Delay in Issuing TC / Migration / Transcripts</option>
                        <option value="Other">Other Specific Grievance</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-foreground">Detailed Statement of Facts *</label>
                      <textarea
                        rows={5}
                        placeholder="Please provide chronological sequence of events, personnel contacted, room/lab numbers, dates, and the specific redressal or relief sought..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="w-full rounded-md border border-input bg-background p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                      />
                    </div>

                    <div className="p-3 rounded-lg border border-border/80 bg-muted/30 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-emerald-600" />
                        <div>
                          <p className="font-semibold text-foreground text-xs">Whistleblower Protection</p>
                          <p className="text-[11px] text-muted-foreground">Keep my identity strictly confidential to the SGRC Chairman only.</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isConfidential}
                        onChange={(e) => setIsConfidential(e.target.checked)}
                        className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Scale className="w-3.5 h-3.5 text-primary" /> Regulated under UGC Regulations 2023
                      </span>
                      <Button type="submit" className="gap-2 font-bold text-xs">
                        <Send className="w-4 h-4" /> Submit Grievance
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="py-10 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Grievance Registered Successfully</h3>
                      <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                        Your submission has been cataloged under encrypted ticket reference:
                      </p>
                      <div className="inline-block mt-3 px-4 py-2 bg-primary/10 text-primary font-mono text-base font-extrabold rounded-lg border border-primary/20">
                        {generatedTicket}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                      An official SMS & email confirmation has been dispatched. The concerned SGRC member has been notified and an initial hearing or status update will be delivered within 7 working days.
                    </p>
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFormSubmitted(false);
                          setName("");
                          setRollNo("");
                          setDescription("");
                        }}
                      >
                        Lodge Another Grievance
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tracker & Escalation Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Tracker Card */}
            <Card className="border border-border/80 bg-card shadow-sm">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Search className="w-4 h-4 text-primary" /> Track Grievance Status
                </CardTitle>
                <CardDescription className="text-xs">
                  Enter your Ticket ID (e.g., PRK-2026-4891 or GRV-2026-1042) to inspect real-time redressal progress.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <form onSubmit={handleTrack} className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="e.g. PRK-2026-4891"
                      value={trackId}
                      onChange={(e) => setTrackId(e.target.value)}
                      className="font-mono text-xs uppercase h-9"
                    />
                    <Button type="submit" size="sm" className="shrink-0 text-xs font-semibold">
                      Track
                    </Button>
                  </div>
                </form>

                {trackResult && (
                  <div className="p-4 rounded-xl border border-border/70 bg-muted/20 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-primary">{trackResult.id}</span>
                      <Badge
                        className={
                          trackResult.status === "Resolved"
                            ? "bg-emerald-600 text-white"
                            : "bg-amber-500 text-white"
                        }
                      >
                        {trackResult.status}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-[11px]">
                      <div>
                        <span className="text-muted-foreground">Category: </span>
                        <span className="font-medium text-foreground">{trackResult.category}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Assigned Authority: </span>
                        <span className="font-medium text-foreground">{trackResult.assignedOfficer}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-background border border-border/50 text-[11px]">
                      <span className="font-semibold text-foreground block mb-0.5">Official Action / Note:</span>
                      <p className="text-muted-foreground leading-relaxed">{trackResult.actionTaken}</p>
                    </div>

                    {/* Timeline Stages */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Progress Audit</span>
                      {trackResult.timeline.map((step: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px]">
                          {step.done ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          )}
                          <span className={step.done ? "text-foreground font-medium" : "text-muted-foreground"}>
                            {step.stage}
                          </span>
                          <span className="text-[10px] text-muted-foreground ml-auto">{step.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statutory Redressal Escalation Hierarchy */}
            <Card className="border border-border/80 bg-card shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Scale className="w-4 h-4 text-primary" /> Statutory 3-Tier Escalation Matrix
                </CardTitle>
                <CardDescription className="text-xs">
                  In accordance with Gazette of India Notification on Student Grievance Redressal Regulations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                  <div className="flex items-center justify-between font-bold text-foreground">
                    <span>Tier 1: Departmental Grievance Cell (DGRC)</span>
                    <Badge variant="outline" className="text-[10px]">7 Days</Badge>
                  </div>
                  <p className="text-muted-foreground text-[11px] mt-1 leading-relaxed">
                    Head of Department & faculty mentors resolve day-to-day continuous evaluation, attendance, or lab equipment queries.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                  <div className="flex items-center justify-between font-bold text-foreground">
                    <span>Tier 2: Institutional SGRC Committee</span>
                    <Badge variant="outline" className="text-[10px]">15 Days</Badge>
                  </div>
                  <p className="text-muted-foreground text-[11px] mt-1 leading-relaxed">
                    Senior Professors, Dean of Student Welfare, and student special invitee review unresolved college-level matters.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                  <div className="flex items-center justify-between font-bold text-foreground">
                    <span>Tier 3: University Ombudsperson</span>
                    <Badge variant="outline" className="text-[10px]">Appellate Body</Badge>
                  </div>
                  <p className="text-muted-foreground text-[11px] mt-1 leading-relaxed">
                    Former High Court Judge / Distinguished Vice-Chancellor appointed under UGC guidelines. Decisions are binding.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Cross-navigation to Other Grievance & Welfare Sections */}
        <div className="pt-6 border-t border-border">
          <h3 className="text-lg font-bold mb-4">Statutory Welfare & Support Cells</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
