import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Users,
  Briefcase,
  Sparkles,
  MessageSquare,
  MapPin,
  Clock,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  Send,
  Building,
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

interface Mentor {
  name: string;
  role: string;
  company: string;
  batch: string;
  slots: string;
  expertise: string[];
}

const FEATURED_MENTORS: Mentor[] = [
  {
    name: "Tanushree Pattnaik",
    role: "Director of Engineering",
    company: "Mindtree Technologies",
    batch: "Class of 2002 (Computer Science)",
    slots: "3 Slots Available",
    expertise: ["Cloud Architecture", "System Design", "Tech Leadership"],
  },
  {
    name: "Soumya Ranjan Dash, IRS",
    role: "Joint Commissioner of Income Tax",
    company: "Ministry of Finance, Govt of India",
    batch: "Class of 2008 (Economics)",
    slots: "2 Slots Available",
    expertise: ["Civil Services Preparation", "Public Policy", "Fiscal Management"],
  },
  {
    name: "Dr. Ananya Ray",
    role: "Postdoctoral Research Fellow",
    company: "University of Oxford",
    batch: "Class of 2014 (Chemistry)",
    slots: "4 Slots Available",
    expertise: ["Overseas Ph.D. Applications", "Fellowships (Rhodes/Erasmus)", "Nanotech"],
  },
  {
    name: "Aman Preet Singh",
    role: "Vice President - Investment Banking",
    company: "Goldman Sachs, Mumbai",
    batch: "Class of 2011 (Commerce & MBA)",
    slots: "2 Slots Available",
    expertise: ["Equity Research", "Financial Modeling", "Corporate M&A"],
  },
];

const UPCOMING_REUNIONS = [
  {
    title: "Annual Global Alumni Day 2026",
    batch: "All Batches Welcome",
    date: "December 24, 2026",
    venue: "Biju Patnaik Indoor Stadium & Main Quadrangle",
    desc: "The flagship annual reunion celebrating tradition, presenting Distinguished Alumnus Awards, and evening cultural gala.",
    registeredCount: "1,240+ Registered",
  },
  {
    title: "Silver Jubilee Homecoming (Batch of 2001)",
    batch: "Class of 2001 (UG & PG)",
    date: "January 16-18, 2027",
    venue: "Alumni Bhavan & Campus Hostel Courtyards",
    desc: "A special 3-day nostalgic milestone retreat commemorating 25 years since graduation with faculty felicitations.",
    registeredCount: "280+ Registered",
  },
  {
    title: "Golden Jubilee Reunion (Batch of 1976)",
    batch: "Class of 1976",
    date: "February 20, 2027",
    venue: "Syndicate Hall & Heritage Lawn",
    desc: "Honoring our golden scholars with special ceremonial citation plaques and luncheon with the Vice-Chancellor.",
    registeredCount: "95+ Registered",
  },
];

export default function AlumniConnect() {
  const [selectedTab, setSelectedTab] = useState("mentorship");
  const [sessionBooked, setSessionBooked] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentRoll, setStudentRoll] = useState("");
  const [mentorSelected, setMentorSelected] = useState("Tanushree Pattnaik");
  const [queryTopic, setQueryTopic] = useState("");

  const handleBookSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !queryTopic.trim()) {
      toast.error("Please fill in student details and consultation topic");
      return;
    }
    setSessionBooked(true);
    toast.success("Mentorship consultation request routed to alumnus!");
  };

  return (
    <div>
      {/* Hero Section */}
      <Hero
        title="Alumni Mentorship Network & Reunions"
        subtitle="Bridging current students with industry leaders through 1-on-1 career mentoring, campus homecoming meets, and exclusive alumni referral job desks."
        backgroundImage={collegeHeroUrl}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/college" },
          { label: "Alumni", href: "/college/alumni" },
          { label: "Mentorship & Reunions", href: "/college/alumni/connect" },
        ]}
      />

      <Container className="py-12 space-y-12">
        {/* Navigation Tabs for Connect Programs */}
        <Tabs defaultValue="mentorship" className="space-y-6" onValueChange={setSelectedTab}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <TabsList className="bg-muted/60 p-1">
              <TabsTrigger value="mentorship" className="gap-2 text-xs">
                <Users className="w-4 h-4" /> Alumni Mentorship Matching
              </TabsTrigger>
              <TabsTrigger value="reunions" className="gap-2 text-xs">
                <Calendar className="w-4 h-4" /> Homecoming & Batch Reunions
              </TabsTrigger>
              <TabsTrigger value="jobs" className="gap-2 text-xs">
                <Briefcase className="w-4 h-4" /> Alumni Job & Referral Desk
              </TabsTrigger>
            </TabsList>

            <span className="text-xs text-muted-foreground font-medium">
              Alumni Relations Desk: <strong className="text-foreground">connect.alumni@eduplatform.ac.in</strong>
            </span>
          </div>

          {/* Tab 1: 1-on-1 Mentorship Matching */}
          <TabsContent value="mentorship" className="space-y-8 mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Mentors Showcase (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Featured Alumni Mentors</h3>
                  <p className="text-xs text-muted-foreground">
                    Volunteering time to offer career guidance, resume reviews, and mock interview preparations for graduating students.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {FEATURED_MENTORS.map((m, idx) => (
                    <Card key={idx} className="border border-border/80 bg-card hover:border-primary/50 transition-all shadow-xs">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300 bg-emerald-50/50">
                            {m.slots}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground font-mono">{m.batch.split("(")[0]}</span>
                        </div>
                        <CardTitle className="text-base font-bold text-foreground mt-1">
                          {m.name}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {m.role} · <strong className="text-foreground">{m.company}</strong>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2 pt-0 text-xs">
                        <div className="flex flex-wrap gap-1">
                          {m.expertise.map((exp, i) => (
                            <Badge key={i} className="bg-muted text-muted-foreground text-[10px] font-normal">
                              {exp}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setMentorSelected(m.name);
                            document.getElementById("booking-box")?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="w-full text-xs font-semibold mt-2"
                        >
                          Request Consultation
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Booking Request Box (5 cols) */}
              <div className="lg:col-span-5" id="booking-box">
                <Card className="border border-primary/30 bg-card shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      <Badge className="bg-primary text-primary-foreground text-xs">Student Booking</Badge>
                    </div>
                    <CardTitle className="text-lg font-bold mt-1">
                      Schedule a 30-Min Mentorship Session
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Sessions are conducted over Google Meet / Microsoft Teams.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!sessionBooked ? (
                      <form onSubmit={handleBookSession} className="space-y-3.5 text-xs">
                        <div className="space-y-1">
                          <label className="font-semibold text-foreground">Select Alumni Mentor *</label>
                          <select
                            value={mentorSelected}
                            onChange={(e) => setMentorSelected(e.target.value)}
                            className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-primary font-medium"
                          >
                            {FEATURED_MENTORS.map((m) => (
                              <option key={m.name} value={m.name}>
                                {m.name} ({m.company})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-foreground">Student Full Name *</label>
                          <Input
                            type="text"
                            placeholder="e.g. Priyadarshini Jena"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            required
                            className="text-xs h-9"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-foreground">Student Roll No / Department *</label>
                          <Input
                            type="text"
                            placeholder="e.g. 23UG-CS-042"
                            value={studentRoll}
                            onChange={(e) => setStudentRoll(e.target.value)}
                            required
                            className="text-xs h-9"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-foreground">Specific Topic / Questions for Mentor *</label>
                          <textarea
                            rows={3}
                            placeholder="e.g. Seeking advice on transitioning into cloud engineering or guidance for campus interview preparation..."
                            value={queryTopic}
                            onChange={(e) => setQueryTopic(e.target.value)}
                            required
                            className="w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground focus:ring-1 focus:ring-primary"
                          />
                        </div>

                        <Button type="submit" className="w-full font-bold gap-2 text-xs">
                          <Send className="w-4 h-4" /> Request Mentorship Slot
                        </Button>
                      </form>
                    ) : (
                      <div className="py-6 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-sm text-foreground">Consultation Request Dispatched</h4>
                        <p className="text-xs text-muted-foreground">
                          Your request has been routed to <strong>{mentorSelected}</strong>. You will receive a calendar invite via email within 48 hours.
                        </p>
                        <Button size="sm" variant="outline" onClick={() => setSessionBooked(false)}>
                          Book Another Slot
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Homecoming & Batch Reunions */}
          <TabsContent value="reunions" className="space-y-6 mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {UPCOMING_REUNIONS.map((r, idx) => (
                <Card key={idx} className="border border-border/80 bg-card hover:border-primary/40 transition-all flex flex-col justify-between shadow-xs">
                  <div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                          {r.batch}
                        </Badge>
                        <span className="text-[11px] font-semibold text-emerald-600">{r.registeredCount}</span>
                      </div>
                      <CardTitle className="text-lg font-bold text-foreground mt-2">
                        {r.title}
                      </CardTitle>
                      <CardDescription className="text-xs flex items-center gap-1.5 pt-1">
                        <Calendar className="w-3.5 h-3.5 text-primary" /> {r.date}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-0 text-xs text-muted-foreground">
                      <div className="flex items-start gap-1.5 text-foreground font-medium text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{r.venue}</span>
                      </div>
                      <p className="leading-relaxed text-xs">
                        {r.desc}
                      </p>
                    </CardContent>
                  </div>
                  <div className="p-4 pt-0">
                    <Button
                      size="sm"
                      onClick={() => alert(`Registered for ${r.title}! Event details sent.`)}
                      className="w-full text-xs font-semibold"
                    >
                      RSVP / Register for Reunion
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab 3: Alumni Job & Referral Desk */}
          <TabsContent value="jobs" className="space-y-6 mt-0">
            <Card className="border border-border/80 bg-card shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <Badge className="bg-primary text-primary-foreground text-xs">Direct Referrals</Badge>
                </div>
                <CardTitle className="text-xl font-bold mt-1">
                  Alumni Referral & Internship Opportunities
                </CardTitle>
                <CardDescription className="text-xs">
                  Exclusive hiring drives posted by alumni working in leading technology, consulting, finance, and research corporations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl border border-border/70 bg-muted/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-blue-600 text-white text-[10px]">Full-Time</Badge>
                      <span className="text-[11px] font-mono text-muted-foreground">Referrer: Class of 2012</span>
                    </div>
                    <h4 className="font-bold text-foreground text-sm">Associate Software Engineer (Full Stack)</h4>
                    <p className="text-muted-foreground text-[11px]">
                      Mindtree Technologies · Bengaluru / Hyderabad (Hybrid)
                    </p>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      Eligibility: B.Tech / MCA graduating batch with proficiency in React, TypeScript, and Java/Go microservices.
                    </p>
                    <Button size="xs" variant="outline" onClick={() => alert("Referral application submitted")} className="text-xs">
                      Apply via Alumni Referral
                    </Button>
                  </div>

                  <div className="p-4 rounded-xl border border-border/70 bg-muted/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-emerald-600 text-white text-[10px]">Internship</Badge>
                      <span className="text-[11px] font-mono text-muted-foreground">Referrer: Class of 2018</span>
                    </div>
                    <h4 className="font-bold text-foreground text-sm">Financial Analyst Summer Intern</h4>
                    <p className="text-muted-foreground text-[11px]">
                      Goldman Sachs · Mumbai Office
                    </p>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      Eligibility: Final-year M.Com, MBA Finance, or B.Com Hons with strong quantitative and DCF valuation skills.
                    </p>
                    <Button size="xs" variant="outline" onClick={() => alert("Referral application submitted")} className="text-xs">
                      Apply via Alumni Referral
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Cross-navigation to Other Alumni Sections */}
        <div className="pt-6 border-t border-border">
          <h3 className="text-lg font-bold mb-4">Explore More in Alumni & Giving</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/college/alumni/association"
              className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-sm group flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors text-sm">
                  Alumni Association
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">Chapters, Executive Roster & Life Membership</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/college/alumni/distinguished"
              className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-sm group flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors text-sm">
                  Distinguished Alumni
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">Hall of Fame, Padma & Jnanpith Awardees</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/college/alumni/giving"
              className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-sm group flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors text-sm">
                  Give to the University
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">Endowments, 80G Tax Exemption & Scholarships</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
