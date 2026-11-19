import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileCheck2,
  Users,
  Award,
  TrendingUp,
  Download,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
  Calendar,
  Building,
  Star,
  ArrowRight,
  Send,
  PieChart,
} from "lucide-react";
import { toast } from "sonner";
import { Hero } from "@/components/sections/Hero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { collegeHeroUrl } from "@/mocks/data/images";

interface AtrRecord {
  year: string;
  stakeholder: string;
  feedbackSummary: string;
  actionTaken: string;
  syndicateResolution: string;
  documentUrl: string;
}

const ATR_ARCHIVE: AtrRecord[] = [
  {
    year: "2024-25",
    stakeholder: "Students (Curriculum & Lab)",
    feedbackSummary: "Demand for hands-on machine learning modules and expanded cloud computing lab hours for final-year students.",
    actionTaken: "Introduced 4-credit elective 'Applied Deep Learning with PyTorch' in semester VII; High-Performance Computing (HPC) lab opened with 24x7 remote GPU access.",
    syndicateResolution: "Syndicate Resolution No. 44/2025 dt. 18-May-2025",
    documentUrl: "https://documents.eduplatform.ac.in/iqac/ATR-Student-2024-25.pdf",
  },
  {
    year: "2024-25",
    stakeholder: "Employers / Industry Recruiters",
    feedbackSummary: "Suggested enhancing communication fluency, corporate etiquette, and industry-standard agile methodology practices.",
    actionTaken: "Pre-placement soft-skills bootcamp mandatory from semester V; invited industry leads for mock scrum sprints and project reviews.",
    syndicateResolution: "Syndicate Resolution No. 49/2025 dt. 18-May-2025",
    documentUrl: "https://documents.eduplatform.ac.in/iqac/ATR-Employer-2024-25.pdf",
  },
  {
    year: "2023-24",
    stakeholder: "Alumni Association",
    feedbackSummary: "Recommended establishment of an incubation fund to seed student-led tech startups and intellectual property patents.",
    actionTaken: "Allocated ₹15 Lakhs annual corpus for PSC Innovation & Startup Hub; filed 4 collaborative patents with faculty-student teams.",
    syndicateResolution: "Syndicate Resolution No. 31/2024 dt. 22-Apr-2024",
    documentUrl: "https://documents.eduplatform.ac.in/iqac/ATR-Alumni-2023-24.pdf",
  },
  {
    year: "2023-24",
    stakeholder: "Teaching Faculty",
    feedbackSummary: "Requested institutional subscription to high-tier IEEE Xplore, ScienceDirect, and enhanced seed grant disbursements.",
    actionTaken: "Subscribed to full IEEE All-Society Periodicals Package (ASPP); institutional seed grant maximum ceiling raised to ₹2.5 Lakhs per PI.",
    syndicateResolution: "Syndicate Resolution No. 35/2024 dt. 22-Apr-2024",
    documentUrl: "https://documents.eduplatform.ac.in/iqac/ATR-Faculty-2023-24.pdf",
  },
  {
    year: "2022-23",
    stakeholder: "Students (Hostel & Living Amenities)",
    feedbackSummary: "Requested commercial-grade water purifiers in hostels and Wi-Fi mesh network expansion across sports grounds.",
    actionTaken: "Installed RO water purification plants across Blocks A, B, and C; installed 18 outdoor enterprise access points covering grounds.",
    syndicateResolution: "Syndicate Resolution No. 27/2023 dt. 11-May-2023",
    documentUrl: "https://documents.eduplatform.ac.in/iqac/ATR-Hostel-2022-23.pdf",
  },
];

export default function StakeholderFeedbackAtr() {
  const [selectedStakeholder, setSelectedStakeholder] = useState<string>("All");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [surveyRole, setSurveyRole] = useState("Student");
  const [rating, setRating] = useState("5");
  const [feedbackText, setFeedbackText] = useState("");

  const filteredAtr = selectedStakeholder === "All"
    ? ATR_ARCHIVE
    : ATR_ARCHIVE.filter((a) => a.stakeholder.toLowerCase().includes(selectedStakeholder.toLowerCase()));

  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      toast.error("Please enter your comments");
      return;
    }
    setFeedbackSubmitted(true);
    toast.success("Feedback submitted to IQAC Review Committee");
  };

  return (
    <div>
      {/* Hero Section */}
      <Hero
        title="Stakeholder Feedback System & Action Taken Reports (ATR)"
        subtitle="NAAC Metric 1.4 structured continuous feedback mechanism on syllabus, teaching-learning, research facilities, and institutional governance with published Action Taken Reports."
        backgroundImage={collegeHeroUrl}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/college" },
          { label: "Grievance & Welfare", href: "/college/grievance" },
          { label: "Stakeholder Feedback & ATR", href: "/college/grievance/feedback-atr" },
        ]}
      />

      <Container className="py-12 space-y-12">
        {/* Metric & Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card border-primary/20 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">NAAC Metric 1.4</p>
                  <p className="text-3xl font-extrabold text-primary mt-1">100%</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Structured Feedback System</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <FileCheck2 className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-emerald-500/20 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Annual Respondents</p>
                  <p className="text-3xl font-extrabold text-emerald-600 mt-1">3,420+</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Students, Faculty & Alumni</p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-blue-500/20 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Satisfaction Index</p>
                  <p className="text-3xl font-extrabold text-blue-600 mt-1">92.4%</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Favorable Institutional Rating</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600">
                  <Star className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-purple-500/20 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Published ATRs</p>
                  <p className="text-3xl font-extrabold text-purple-600 mt-1">5 Years</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Publicly Accessible Compliance</p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-600">
                  <Award className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Taken Reports (ATR) Archive */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Action Taken Reports (ATR) Archive</h2>
              <p className="text-xs text-muted-foreground">
                Formal feedback analysis submitted to Academic Council & Syndicate with binding administrative actions.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-semibold uppercase">Filter Stakeholder:</span>
              <select
                value={selectedStakeholder}
                onChange={(e) => setSelectedStakeholder(e.target.value)}
                aria-label="Filter Action Taken Reports by Stakeholder"
                className="h-9 px-3 text-xs rounded-md border border-input bg-background focus:ring-1 focus:ring-primary"
              >
                <option value="All">All Stakeholders</option>
                <option value="Student">Students</option>
                <option value="Faculty">Faculty</option>
                <option value="Employer">Employers</option>
                <option value="Alumni">Alumni</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredAtr.map((atr, idx) => (
              <Card key={idx} className="border border-border/80 bg-card hover:border-primary/40 transition-all hover:shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-bold">
                        Academic Year {atr.year}
                      </Badge>
                      <Badge variant="outline" className="text-xs font-semibold">
                        {atr.stakeholder}
                      </Badge>
                    </div>
                    <span className="text-[11px] font-mono text-muted-foreground">{atr.syndicateResolution}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-1 text-xs">
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50 space-y-1">
                    <span className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
                      <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" /> Stakeholder Feedback Highlight:
                    </span>
                    <p className="text-muted-foreground leading-relaxed italic text-[11px]">
                      "{atr.feedbackSummary}"
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-1">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Action Taken by Institution:
                    </span>
                    <p className="text-emerald-900 dark:text-emerald-200 leading-relaxed text-[11px]">
                      {atr.actionTaken}
                    </p>
                  </div>

                  <div className="flex items-center justify-end pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => alert(`Downloading Audited ATR Report PDF for ${atr.year}`)}
                      className="h-8 text-xs font-semibold text-primary hover:text-primary gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Full Signed ATR (PDF)
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Live Stakeholder Feedback Submission Desk */}
        <Card className="border border-primary/30 bg-card shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              <Badge className="bg-primary text-primary-foreground text-xs">IQAC Feedback Window 2026</Badge>
            </div>
            <CardTitle className="text-xl font-bold mt-1">
              Submit Annual Stakeholder Feedback (Criterion 1.4)
            </CardTitle>
            <CardDescription className="text-xs">
              Your confidential observations guide board of studies syllabus revisions, laboratory procurements, and campus infrastructure developments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!feedbackSubmitted ? (
              <form onSubmit={handleSurveySubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">I am a *</label>
                    <select
                      value={surveyRole}
                      onChange={(e) => setSurveyRole(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-primary"
                    >
                      <option value="Student">Enrolled Student</option>
                      <option value="Teacher">Teaching Faculty</option>
                      <option value="Employer">Employer / Recruiter</option>
                      <option value="Alumni">Alumnus / Alumna</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Department / Organization</label>
                    <input
                      type="text"
                      placeholder="e.g. Dept of Chemistry or TCS"
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Overall Satisfaction (1 to 5 Stars)</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-primary"
                    >
                      <option value="5">★★★★★ Excellent (5/5)</option>
                      <option value="4">★★★★☆ Very Good (4/5)</option>
                      <option value="3">★★★☆☆ Good (3/5)</option>
                      <option value="2">★★☆☆☆ Satisfactory (2/5)</option>
                      <option value="1">★☆☆☆☆ Needs Improvement (1/5)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Suggestions for Curriculum & Campus Enhancement *</label>
                  <textarea
                    rows={4}
                    placeholder="Provide constructive feedback regarding course content relevance, laboratory equipment, pedagogy, library resources, or placement mentoring..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    required
                    className="w-full rounded-md border border-input bg-background p-3 text-xs text-foreground focus:ring-1 focus:ring-primary leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-muted-foreground">
                    Aggregated annually for IQAC & NAAC Criterion 1.4 compilation.
                  </span>
                  <Button type="submit" className="font-bold gap-2 text-xs">
                    <Send className="w-4 h-4" /> Submit Feedback
                  </Button>
                </div>
              </form>
            ) : (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-foreground">Feedback Recorded by IQAC</h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Thank you for contributing to the continuous quality improvement cycle. Your suggestions will be deliberated in the upcoming Academic Council.
                </p>
                <Button size="sm" variant="outline" onClick={() => setFeedbackSubmitted(false)}>
                  Submit Another Response
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
          </div>
        </div>
      </Container>
    </div>
  );
}
