import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldAlert,
  ShieldCheck,
  Phone,
  Mail,
  AlertTriangle,
  Heart,
  CheckCircle2,
  Clock,
  Search,
  Send,
  Building2,
  ExternalLink,
  MessageSquare,
  Lock,
} from "lucide-react";
import { Container } from "@/components/common/Container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Hero } from "@/components/sections/Hero";
import { schoolHeroUrl } from "@/mocks/data/images";

export default function SchoolGrievance() {
  const [submittedToken, setSubmittedToken] = useState<string | null>(null);
  const [trackingId, setTrackingId] = useState("");
  const [trackedStatus, setTrackedStatus] = useState<any>(null);

  // Form State
  const [fullName, setFullName] = useState("");
  const [userRole, setUserRole] = useState("Parent");
  const [contactNo, setContactNo] = useState("");
  const [email, setEmail] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [category, setCategory] = useState("Academic / Teaching");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const generated = `SCH-GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedToken(generated);
      setIsSubmitting(false);
    }, 700);
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    setTrackedStatus({
      id: trackingId.trim().toUpperCase(),
      status: "Under Review by Grievance Redressal Committee",
      category: "Academic & Class Evaluation",
      filedDate: "10 November 2026",
      officer: "Shri Ashok Kumar Sahoo, Grievance Officer",
      remarks: "The concerned PGT Department Head has been assigned to look into the matter. Parent interview scheduled for 15 November 2026.",
      resolved: false,
    });
  };

  return (
    <>
      <Hero
        variant="compact"
        title="Student & Parent Grievance Cell"
        subtitle="Confidential Online Grievance Submission, Anti-Bullying Monitoring & 24x7 Child Helpline"
        imageUrl={schoolHeroUrl(4)}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/school" }, { label: "Grievance Redressal" }]} />

      <Container className="py-10 space-y-10">
        {/* Child Safety & Helpline Emergency Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-transparent border-2 border-rose-500/30">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-rose-600 text-white font-bold text-xs uppercase px-2 py-0.5">
                  24x7 Emergency Helplines
                </Badge>
                <Badge variant="outline" className="border-rose-400 text-rose-700 dark:text-rose-300 text-xs">
                  POCSO & Childline
                </Badge>
              </div>
              <h2 className="text-lg font-black text-foreground">
                Child Safety, POCSO & Anti-Bullying Protocol
              </h2>
              <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
                Our School maintains a strict zero-tolerance policy against any form of child abuse, harassment, discrimination, or corporal punishment. All grievances received are treated with utmost confidentiality.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="p-3 rounded-xl bg-card border shadow-xs text-center min-w-32">
                <div className="text-xs text-muted-foreground font-semibold">National Childline</div>
                <div className="text-xl font-black text-rose-600">1098</div>
                <div className="text-[10px] text-muted-foreground">Toll-Free 24x7</div>
              </div>
              <div className="p-3 rounded-xl bg-card border shadow-xs text-center min-w-32">
                <div className="text-xs text-muted-foreground font-semibold">Women Helpline</div>
                <div className="text-xl font-black text-purple-600">181</div>
                <div className="text-[10px] text-muted-foreground">Odisha State</div>
              </div>
              <div className="p-3 rounded-xl bg-card border shadow-xs text-center min-w-32">
                <div className="text-xs text-muted-foreground font-semibold">School Helpline</div>
                <div className="text-sm font-black text-primary">06757-223456</div>
                <div className="text-[10px] text-muted-foreground">Working Hours</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column: Form & Tracking */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1 & 2: Online Grievance Submission Form */}
          <div className="lg:col-span-2">
            <Card className="border border-border/70 bg-card shadow-xs">
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <MessageSquare className="size-5 text-primary" />
                  <span>Online Grievance Submission Form</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Fill in the details below. You will receive an instant tracking acknowledgement token.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {submittedToken ? (
                  <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
                    <CheckCircle2 className="size-12 text-emerald-600 mx-auto" />
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-emerald-950 dark:text-emerald-100">
                        Grievance Registered Successfully
                      </h3>
                      <p className="text-xs text-emerald-800 dark:text-emerald-200">
                        Your complaint has been forwarded to the School Grievance Redressal Committee.
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-card border inline-block text-center space-y-1">
                      <div className="text-[10px] uppercase font-bold text-muted-foreground">Tracking ID</div>
                      <div className="font-mono text-xl font-black text-primary">{submittedToken}</div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Please save this token number for future tracking. Expected response time: 3 working days.
                    </p>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSubmittedToken(null);
                        setFullName("");
                        setDescription("");
                      }}
                      className="text-xs font-semibold"
                    >
                      Submit Another Grievance
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-foreground">Complainant Name *</label>
                        <Input
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Parent / Student Full Name"
                          className="text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-foreground">I am a *</label>
                        <select
                          value={userRole}
                          onChange={(e) => setUserRole(e.target.value)}
                          className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-xs"
                        >
                          <option value="Parent">Parent / Guardian</option>
                          <option value="Student">Enrolled Student</option>
                          <option value="Staff">Teacher / Staff</option>
                          <option value="Alumni">Alumni / Citizen</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-foreground">Contact Mobile No. *</label>
                        <Input
                          required
                          type="tel"
                          value={contactNo}
                          onChange={(e) => setContactNo(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-foreground">Email ID</label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="parent@example.com"
                          className="text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-foreground">Student Name & Class (if applicable)</label>
                        <Input
                          value={studentClass}
                          onChange={(e) => setStudentClass(e.target.value)}
                          placeholder="e.g. Master Anshuman Das, Class VIII-B"
                          className="text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-foreground">Grievance Nature / Category *</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-xs"
                        >
                          <option value="Academic">Academic / Classroom Teaching</option>
                          <option value="Bullying">Bullying / Peer Harassment</option>
                          <option value="Transport">School Bus & Transport</option>
                          <option value="Canteen">PM-POSHAN / Drinking Water / Sanitation</option>
                          <option value="Fee">Fee / Accounts Billing</option>
                          <option value="Examination">Examinations & Evaluation</option>
                          <option value="SpecialNeeds">Special Needs / CWSN Support</option>
                          <option value="Other">Other Institutional Matter</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground">Detailed Description of Grievance *</label>
                      <Textarea
                        required
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Please describe the incident, dates, persons involved, and specific redressal sought..."
                        className="text-xs leading-relaxed"
                      />
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1">
                      <Lock className="size-3 text-emerald-600" />
                      <span>Submissions are encrypted and reviewed solely by the designated statutory committee.</span>
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto font-bold text-xs gap-1.5 shadow-md">
                      <Send className="size-3.5" />
                      <span>{isSubmitting ? "Registering Grievance..." : "Submit Grievance"}</span>
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Column 3: Live Grievance Tracking & Officer Contacts */}
          <div className="space-y-6">
            <Card className="border border-border/70 bg-card p-5 space-y-4 shadow-xs">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Search className="size-4 text-primary" />
                  <span>Track Grievance Status</span>
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Enter your 16-character acknowledgment token to check the current review stage.
                </p>
              </div>

              <form onSubmit={handleTrack} className="space-y-2">
                <Input
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="e.g. SCH-GRV-2026-4819"
                  className="text-xs font-mono"
                />
                <Button type="submit" size="sm" className="w-full text-xs font-bold">
                  Track Grievance
                </Button>
              </form>

              {trackedStatus && (
                <div className="p-3 rounded-lg bg-muted/40 border space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-primary">{trackedStatus.id}</span>
                    <Badge variant="outline" className="text-[10px] text-amber-600">{trackedStatus.status}</Badge>
                  </div>
                  <div className="text-muted-foreground text-[11px]">
                    Filed On: {trackedStatus.filedDate} · Assigned to: {trackedStatus.officer}
                  </div>
                  <div className="p-2 rounded bg-background border text-[11px] text-foreground leading-relaxed">
                    <strong>Action Remarks:</strong> {trackedStatus.remarks}
                  </div>
                </div>
              )}
            </Card>

            {/* Statutory Contacts */}
            <Card className="border border-border/70 bg-card p-5 space-y-3 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-primary block">
                Grievance Redressal Officer
              </span>
              <div>
                <div className="text-sm font-bold text-foreground">Shri Ashok Kumar Sahoo</div>
                <div className="text-xs text-muted-foreground">Senior PGT & Designated Grievance In-charge</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><Phone className="size-3 text-primary" /> +91 94372 34567</div>
                <div className="flex items-center gap-1.5"><Mail className="size-3 text-primary" /> grievance@ourschool.edu.in</div>
                <div>Office: Staff Council Chamber, First Floor</div>
              </div>

              <div className="pt-2 border-t border-border/40 text-xs">
                <div className="text-[11px] text-muted-foreground">
                  State Higher Authority: <a href="https://janasunani.odisha.gov.in" target="_blank" rel="noreferrer" className="text-primary hover:underline font-semibold">Odisha Janasunani Grievance Portal</a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </>
  );
}
