import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  AlertTriangle,
  Heart,
  Users,
  CheckCircle2,
  Phone,
  Mail,
  Search,
  ExternalLink,
  MessageSquare,
  FileCheck2,
  Lock,
  Send,
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

export default function CollegeGrievance() {
  const [trackId, setTrackId] = useState("");
  const [trackResult, setTrackResult] = useState<any>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [category, setCategory] = useState("Academic");
  const [description, setDescription] = useState("");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackId.trim()) {
      toast.error("Please enter a valid Grievance Tracking ID");
      return;
    }
    // Mock tracking lookup
    if (trackId.toUpperCase().includes("GRV")) {
      setTrackResult({
        id: trackId.toUpperCase(),
        date: "28-Oct-2026",
        category: "Examination Marks Recheck",
        status: "Resolved",
        officer: "Controller of Examinations Cell",
        resolution: "Result verified by Scrutiny Committee. Updated marksheet issued on student portal.",
      });
      toast.success("Grievance Record Found");
    } else {
      setTrackResult({
        id: trackId.toUpperCase(),
        date: "04-Nov-2026",
        category: "Hostel Wi-Fi Connectivity",
        status: "Under Investigation",
        officer: "Chief Warden & ICT Cell",
        resolution: "Network switch replacement scheduled for Block C on 15-Nov-2026.",
      });
      toast.info("Grievance Status Retrieved");
    }
  };

  const handleSubmitGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) {
      toast.error("Please complete the required fields");
      return;
    }
    const generatedId = `GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setFormSubmitted(true);
    toast.success(`Grievance Registered Successfully: ${generatedId}`);
  };

  return (
    <>
      <Hero variant="compact" title="Support, Welfare & Grievance Redressal" imageUrl={collegeHeroUrl(2)} />
      <Breadcrumbs items={[{ label: "Home", href: "/college" }, { label: "Grievance & Support" }]} />

      <Container className="py-10 space-y-10">
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 text-xs">
                Zero Tolerance Campus
              </Badge>
              <Badge variant="outline" className="text-xs">
                UGC & Statutory Compliance
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground">
              e-Pratikar Grievance Portal & Welfare Cells
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl">
              Confidential, time-bound grievance redressal mechanism supporting students, faculty, and staff in adherence to UGC regulations.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="p-2.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <Phone className="size-4 animate-pulse" />
              <div>
                <div className="font-bold">24x7 Anti-Ragging Helpline</div>
                <div className="font-mono text-[11px]">1800-180-5522 (Toll Free)</div>
              </div>
            </div>
          </div>
        </div>

        {/* e-Pratikar Online Filing & Status Tracker Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File a Grievance Form */}
          <Card className="lg:col-span-2 border border-border/70 bg-card shadow-xs">
            <CardHeader className="p-5 border-b border-border/60">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="size-5 text-primary" />
                Submit Online Grievance (e-Pratikar Portal)
              </CardTitle>
              <CardDescription className="text-xs">
                All submissions are encrypted, logged with tamper-evident audit timestamps, and forwarded directly to the designated statutory cell.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              {!formSubmitted ? (
                <form onSubmit={handleSubmitGrievance} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-foreground">Full Name *</label>
                      <Input
                        type="text"
                        placeholder="e.g. Ananya Tripathy"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="text-xs h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-foreground">Roll No / Staff ID / Email *</label>
                      <Input
                        type="text"
                        placeholder="e.g. 23UG-CS-042 or email"
                        value={rollNo}
                        onChange={(e) => setRollNo(e.target.value)}
                        required
                        className="text-xs h-9"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-foreground">Grievance Nature / Category *</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      >
                        <option value="Academic">Academic & Continuous Evaluation (CIE)</option>
                        <option value="Examinations">Examination / Results / Marksheet</option>
                        <option value="Hostel">Hostel & Living Amenities</option>
                        <option value="Ragging">Anti-Ragging Incident</option>
                        <option value="Harassment">Internal Complaints (ICC / Gender Harassment)</option>
                        <option value="Caste">Caste Discrimination / Equal Opportunity</option>
                        <option value="Divyangjan">Barrier-Free Accessibility (Divyangjan)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-foreground">Department / Hostel Wing</label>
                      <Input
                        type="text"
                        placeholder="e.g. Dept of Physics or Block B"
                        className="text-xs h-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Detailed Statement of Grievance *</label>
                    <textarea
                      rows={4}
                      placeholder="Please provide concise facts, dates, personnel involved, and specific relief requested..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      className="w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Lock className="size-3 text-emerald-600" />
                      Statutory confidentiality assured
                    </span>
                    <Button type="submit" size="sm" className="gap-1.5 text-xs font-bold">
                      <Send className="size-3.5" />
                      <span>Submit Grievance</span>
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="py-8 text-center space-y-3">
                  <div className="size-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="size-6" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">Grievance Registered Successfully</h3>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    Your grievance has been assigned Tracking ID: <strong className="text-primary font-mono">GRV-2026-4891</strong>. An acknowledgement has been dispatched. You will receive an official response within 7 statutory working days.
                  </p>
                  <Button size="sm" variant="outline" onClick={() => setFormSubmitted(false)} className="text-xs">
                    Submit Another Query
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Grievance Tracker Card */}
          <Card className="border border-border/70 bg-muted/10 shadow-xs flex flex-col justify-between">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Search className="size-4 text-primary" />
                Track Grievance Status
              </CardTitle>
              <CardDescription className="text-xs">
                Enter your Grievance Tracking ID to view live redressal progress.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              <form onSubmit={handleTrack} className="space-y-2">
                <Input
                  type="text"
                  placeholder="e.g. GRV-2026-1042"
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                  className="text-xs h-9 font-mono uppercase"
                />
                <Button type="submit" size="sm" variant="outline" className="w-full text-xs font-semibold">
                  Track Application Status
                </Button>
              </form>

              {trackResult && (
                <div className="p-3.5 rounded-lg border border-border/60 bg-card space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-primary">{trackResult.id}</span>
                    <Badge
                      className={
                        trackResult.status === "Resolved"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      }
                    >
                      {trackResult.status}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Assigned: {trackResult.officer}
                  </div>
                  <div className="p-2 rounded bg-muted/30 text-[11px] text-foreground leading-relaxed">
                    <strong>Action:</strong> {trackResult.resolution}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-border/40 space-y-2 text-xs">
                <div className="font-bold text-foreground text-[11px]">Direct Support Channels:</div>
                <div className="text-[11px] text-muted-foreground">
                  Grievance Officer: Dr. S. K. Mahapatra<br />
                  Email: <a href="mailto:grievance@ourcollege.edu.in" className="text-primary hover:underline">grievance@ourcollege.edu.in</a><br />
                  State Grievance: <a href="https://janasunani.odisha.gov.in" target="_blank" rel="noreferrer" className="text-primary hover:underline">Janasunani Odisha Portal</a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statutory Welfare & Protection Cells Grid */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground">
            Statutory Committees & Welfare Cells (UGC Norms)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Anti-Ragging Cell */}
            <Card className="border border-border/60 bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-4 text-rose-600" />
                <span className="text-sm font-bold text-foreground">Anti-Ragging Squad & Cell</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Strict compliance with Hon'ble Supreme Court directives. Regular campus patrol, hostel surveillance, and mandatory online undertaking.
              </p>
              <div className="text-[11px] text-muted-foreground pt-1">
                Convener: Prof. Satyabrata Dash · Tel: +91 94370 12345
              </div>
            </Card>

            {/* Internal Complaints Committee (ICC) / Shaktishree */}
            <Card className="border border-border/60 bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-purple-600" />
                <span className="text-sm font-bold text-foreground">ICC & Shaktishree Women's Cell</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Prevention, prohibition, and redressal of sexual harassment of women employees and students (PoSH Act 2013).
              </p>
              <div className="text-[11px] text-muted-foreground pt-1">
                Presiding Officer: Dr. Rashmita Mishra · icc@ourcollege.edu.in
              </div>
            </Card>

            {/* Equal Opportunity & Caste Discrimination */}
            <Card className="border border-border/60 bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-blue-600" />
                <span className="text-sm font-bold text-foreground">Equal Opportunity & SC/ST Cell</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Monitors implementation of reservation policies, welfare schemes, remedial coaching, and addresses caste discrimination complaints.
              </p>
              <div className="text-[11px] text-muted-foreground pt-1">
                Liaison Officer: Dr. Alok Nayak · eoc@ourcollege.edu.in
              </div>
            </Card>

            {/* HEPSN Cell (Divyangjan) */}
            <Card className="border border-border/60 bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Heart className="size-4 text-emerald-600" />
                <span className="text-sm font-bold text-foreground">HEPSN Divyangjan Cell</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Ensures barrier-free physical infrastructure, ramps, accessible washrooms, tactile pathways, and Braille reading materials.
              </p>
              <div className="text-[11px] text-muted-foreground pt-1">
                Coordinator: Dr. Snigdha Mohanty · hepsn@ourcollege.edu.in
              </div>
            </Card>

            {/* Counselling Cell ("Sambhab") */}
            <Card className="border border-border/60 bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="size-4 text-amber-600" />
                <span className="text-sm font-bold text-foreground">Sambhab Psychological Counselling</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Free confidential mental health counseling, stress management workshops, and career transition mentoring for enrolled students.
              </p>
              <div className="text-[11px] text-muted-foreground pt-1">
                Counselor: Dr. Suchitra Sahoo · sambhab@ourcollege.edu.in
              </div>
            </Card>

            {/* Student Feedback & ATR */}
            <Card className="border border-border/60 bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <FileCheck2 className="size-4 text-teal-600" />
                <span className="text-sm font-bold text-foreground">Stakeholder Feedback & ATR</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Annual feedback collection from students, teachers, employers, and alumni with published Action Taken Reports (ATRs).
              </p>
              <Button asChild size="xs" variant="outline" className="w-full text-xs text-primary mt-1">
                <Link to="/college/iqac">View Feedback ATR Releases →</Link>
              </Button>
            </Card>
          </div>
        </div>
      </Container>
    </>
  );
}
