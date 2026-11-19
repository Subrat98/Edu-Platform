import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Heart,
  Users,
  Lock,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Download,
  ExternalLink,
  Send,
  HelpCircle,
  Building,
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

interface IccMember {
  name: string;
  designation: string;
  role: string;
  contact: string;
  email: string;
}

const ICC_COMMITTEE_MEMBERS: IccMember[] = [
  {
    name: "Prof. (Dr.) Rashmita Mishra",
    designation: "Professor & Head, Dept of Computer Science",
    role: "Presiding Officer",
    contact: "+91 94371 98765",
    email: "icc.chair@eduplatform.ac.in",
  },
  {
    name: "Dr. Suchitra Sahoo",
    designation: "Associate Professor, Dept of Zoology",
    role: "Faculty Member",
    contact: "+91 94380 65432",
    email: "sahoo.suchitra@eduplatform.ac.in",
  },
  {
    name: "Dr. Snigdha Mohanty",
    designation: "Assistant Professor, Dept of Economics",
    role: "Faculty Member",
    contact: "+91 98612 34567",
    email: "snigdha.m@eduplatform.ac.in",
  },
  {
    name: "Mrs. Bijayalaxmi Nayak",
    designation: "Senior Administrative Assistant",
    role: "Non-Teaching Staff Member",
    contact: "+91 674 230 4583",
    email: "admin.icc@eduplatform.ac.in",
  },
  {
    name: "Mr. Satish Panda",
    designation: "Senior Technical Officer (CIF)",
    role: "Non-Teaching Staff Member",
    contact: "+91 674 230 4585",
    email: "spanda.cif@eduplatform.ac.in",
  },
  {
    name: "Adv. Namrata Tripathy",
    designation: "High Court of Orissa & Human Rights Activist",
    role: "External Legal / NGO Member",
    contact: "+91 94372 88990",
    email: "adv.namrata@gmail.com",
  },
  {
    name: "Ms. Monalisa Swain",
    designation: "Ph.D. Scholar, Dept of Chemistry",
    role: "Research Scholar Representative",
    contact: "+91 70085 11223",
    email: "monalisa.phd@eduplatform.ac.in",
  },
  {
    name: "Ms. Dikshya Priyadarshini",
    designation: "Postgraduate Student (M.Sc. Physics)",
    role: "PG Student Representative",
    contact: "+91 79781 44556",
    email: "dikshya.pg@eduplatform.ac.in",
  },
];

export default function InternalComplaintsCommittee() {
  const [complaintSubmitted, setComplaintSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [narrative, setNarrative] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!narrative.trim()) {
      toast.error("Please provide the details of your complaint");
      return;
    }
    setComplaintSubmitted(true);
    toast.success("Confidential complaint submitted to Presiding Officer");
  };

  return (
    <div>
      {/* Hero Section */}
      <Hero
        title="Internal Committee (ICC) & Gender Sensitization"
        subtitle="Safeguarding women's dignity, prevention of sexual harassment at workplace, and cultivating an equitable learning ecosystem under PoSH Act 2013 and UGC Regulations 2015."
        backgroundImage={collegeHeroUrl}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/college" },
          { label: "Grievance & Welfare", href: "/college/grievance" },
          { label: "Internal Committee (ICC)", href: "/college/grievance/icc" },
        ]}
      />

      <Container className="py-12 space-y-12">
        {/* Mandate & Core Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-purple-500/10 via-card to-background border-purple-500/30 shadow-sm lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-600 text-white text-xs">Statutory Body</Badge>
                <Badge variant="outline" className="text-xs text-purple-700 dark:text-purple-300 border-purple-300">
                  PoSH Act 2013 & UGC 2015
                </Badge>
              </div>
              <CardTitle className="text-2xl font-black text-foreground mt-2">
                Zero Tolerance for Gender-Based Harassment
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm leading-relaxed">
                The Internal Complaints Committee (ICC) functions as a quasi-judicial statutory body dedicated to preventing, prohibiting, and redressing sexual harassment of female students, research scholars, teaching faculty, and administrative staff.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-muted-foreground leading-relaxed pt-0">
              <p>
                In compliance with the Hon'ble Supreme Court guidelines (Vishaka Judgement) and the Gazette Notification of the University Grants Commission, our college enforces strict confidentiality and uncompromising legal accountability across all academic blocks, laboratories, libraries, and campus living premises.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-border/60 text-xs">
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  <Lock className="w-4 h-4 text-emerald-600" /> Complete Whistleblower Anonymity
                </div>
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  <Clock className="w-4 h-4 text-primary" /> 90-Day Statutory Time-Bound Inquiry
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Contact Desk */}
          <Card className="border border-border/80 bg-card shadow-sm flex flex-col justify-between">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" /> ICC Presiding Officer Contact
              </CardTitle>
              <CardDescription className="text-xs">
                Direct confidential communications are received exclusively by the Presiding Officer.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-muted/30 border border-border/60 space-y-1">
                <span className="text-muted-foreground block text-[11px]">Presiding Officer:</span>
                <span className="font-bold text-foreground text-sm block">Prof. (Dr.) Rashmita Mishra</span>
                <span className="text-[11px] text-muted-foreground">Department of Computer Science</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  <span className="font-mono text-foreground font-semibold">+91 94371 98765</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  <a href="mailto:icc@eduplatform.ac.in" className="text-primary hover:underline font-mono">
                    icc@eduplatform.ac.in
                  </a>
                </div>
              </div>
            </CardContent>
            <div className="p-4 pt-0">
              <Button asChild size="sm" className="w-full text-xs font-bold gap-2">
                <a href="#confidential-form">
                  <FileText className="w-3.5 h-3.5" /> Submit Confidential Complaint
                </a>
              </Button>
            </div>
          </Card>
        </div>

        {/* 5-Step Statutory Inquiry Procedure */}
        <Card className="border border-border/80 bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" /> Redressal Process & Step-by-Step Inquiry Protocol
            </CardTitle>
            <CardDescription className="text-xs">
              Standard operating procedure established in alignment with Section 9 & 11 of the PoSH Act 2013:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-border/70 bg-muted/20 relative">
                <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-xs mb-2">
                  1
                </div>
                <h4 className="font-bold text-foreground mb-1">Filing of Complaint</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Aggrieved woman submits complaint within 3 months of incident via email, letter, or digital portal.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/70 bg-muted/20 relative">
                <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-xs mb-2">
                  2
                </div>
                <h4 className="font-bold text-foreground mb-1">Notice & Response</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Notice dispatched to respondent within 7 working days. Respondent must reply within 10 days with defense.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/70 bg-muted/20 relative">
                <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-xs mb-2">
                  3
                </div>
                <h4 className="font-bold text-foreground mb-1">Interim Reliefs</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Restraining orders, hostel room relocation, or class reassignment granted to safeguard the complainant.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/70 bg-muted/20 relative">
                <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-xs mb-2">
                  4
                </div>
                <h4 className="font-bold text-foreground mb-1">Formal Hearing</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  ICC conducts closed-door examination of witnesses, electronic logs, and evidence within 90 days.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/70 bg-muted/20 relative">
                <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-xs mb-2">
                  5
                </div>
                <h4 className="font-bold text-foreground mb-1">Report & Sanctions</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Final findings submitted to Principal within 10 days. Mandatory implementation enforced within 30 days.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Committee Roster Table */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Statutory ICC Committee Composition (2026-28)</h2>
              <p className="text-xs text-muted-foreground">
                Duly constituted by the Executive Syndicate incorporating woman professors, administrative officers, student representatives, and external legal experts.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                alert("Downloading Official ICC Constitution Notification (PDF)");
              }}
              className="gap-2 text-xs shrink-0"
            >
              <Download className="w-3.5 h-3.5" /> Download Notification (PDF)
            </Button>
          </div>

          <div className="overflow-x-auto border border-border rounded-xl bg-card shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-foreground font-semibold border-b border-border">
                <tr>
                  <th className="p-3">Name & Designation</th>
                  <th className="p-3">Role in ICC</th>
                  <th className="p-3">Phone Contact</th>
                  <th className="p-3">Official Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {ICC_COMMITTEE_MEMBERS.map((m, idx) => (
                  <tr key={idx} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-foreground">{m.name}</div>
                      <div className="text-muted-foreground text-[11px]">{m.designation}</div>
                    </td>
                    <td className="p-3">
                      <Badge
                        variant={m.role === "Presiding Officer" ? "default" : "outline"}
                        className={
                          m.role === "Presiding Officer"
                            ? "bg-purple-600 text-white text-[11px]"
                            : "text-[11px]"
                        }
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

        {/* Shaktishree Cell Initiatives & Confidential Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="confidential-form">
          {/* Shaktishree Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border border-border/80 bg-card shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500" /> Shaktishree Women's Empowerment Cell
                </CardTitle>
                <CardDescription className="text-xs">
                  Proactive gender sensitization and holistic self-defense initiatives across all departments.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-muted-foreground">
                <div className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1">
                  <h4 className="font-bold text-foreground">Self-Defense Masterclasses (Project Abhaya)</h4>
                  <p className="text-[11px]">
                    Bi-weekly martial arts and Krav Maga physical defense training for female students and hostellers.
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1">
                  <h4 className="font-bold text-foreground">Legal Awareness & Cyber-Safety Seminars</h4>
                  <p className="text-[11px]">
                    Workshops conducted by visiting senior advocates on digital privacy, combating deepfakes, and PoSH rights.
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1">
                  <h4 className="font-bold text-foreground">Sanitary Hygiene Amenities (Project Swasthya)</h4>
                  <p className="text-[11px]">
                    Automated sanitary napkin vending machines and incinerators installed in every ladies' washroom.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Confidential Complaint Form (7 cols) */}
          <div className="lg:col-span-7">
            <Card className="border border-purple-500/30 bg-card shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-purple-600" />
                  <Badge className="bg-purple-600 text-white text-xs">Confidential Filing Box</Badge>
                </div>
                <CardTitle className="text-xl font-bold mt-1">
                  Confidential Communication to Presiding Officer
                </CardTitle>
                <CardDescription className="text-xs">
                  This form routes directly to Dr. Rashmita Mishra. Your disclosure is protected under statutory privacy laws.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!complaintSubmitted ? (
                  <form onSubmit={handleComplaintSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-semibold text-foreground">Complainant Name (Optional if anonymous)</label>
                        <Input
                          type="text"
                          placeholder="Your Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={isAnonymous}
                          className="text-xs h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-foreground">Confidential Phone / Email</label>
                        <Input
                          type="text"
                          placeholder="Contact information for follow-up"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          disabled={isAnonymous}
                          className="text-xs h-9"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-foreground">Statement of Incident / Grievance *</label>
                      <textarea
                        rows={5}
                        placeholder="Please state details regarding dates, locations, respondent names, and specifics of the conduct..."
                        value={narrative}
                        onChange={(e) => setNarrative(e.target.value)}
                        required
                        className="w-full rounded-md border border-input bg-background p-3 text-xs text-foreground focus:ring-1 focus:ring-purple-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                          className="h-4 w-4 rounded border-input text-purple-600 focus:ring-purple-500"
                        />
                        <span className="font-semibold text-foreground text-xs">
                          Keep My Identity Strictly Redacted
                        </span>
                      </label>

                      <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold gap-2 text-xs">
                        <Send className="w-4 h-4" /> Transmit to Presiding Officer
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="py-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-base text-foreground">Complaint Dispatched to Presiding Officer</h4>
                    <p className="text-xs text-muted-foreground max-w-md mx-auto">
                      Dr. Rashmita Mishra will review the submission in strict confidence and initiate preliminary assessment within 48 hours.
                    </p>
                    <Button size="sm" variant="outline" onClick={() => setComplaintSubmitted(false)}>
                      Submit Additional Information
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

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
