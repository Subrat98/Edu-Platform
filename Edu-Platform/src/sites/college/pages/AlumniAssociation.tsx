import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Award,
  Globe,
  MapPin,
  Calendar,
  Phone,
  Mail,
  CheckCircle2,
  FileText,
  CreditCard,
  Download,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Send,
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

interface ExecutiveMember {
  name: string;
  role: string;
  batch: string;
  profession: string;
  contact: string;
  email: string;
}

const EXECUTIVE_COMMITTEE: ExecutiveMember[] = [
  {
    name: "Shri Ashok Kumar Tripathy, IAS (Retd.)",
    role: "President",
    batch: "Batch of 1974 (Economics)",
    profession: "Former Member, Board of Revenue & Principal Secretary",
    contact: "+91 94370 11223",
    email: "president.alumni@eduplatform.ac.in",
  },
  {
    name: "Prof. (Dr.) Jayant Kumar Mohapatra",
    role: "Vice President",
    batch: "Batch of 1978 (Physics)",
    profession: "Former Vice-Chancellor & Emeritus Scientist",
    contact: "+91 94371 44556",
    email: "vp.alumni@eduplatform.ac.in",
  },
  {
    name: "Dr. Satyabrata Dash",
    role: "General Secretary",
    batch: "Batch of 1988 (Chemistry)",
    profession: "Professor & Proctor, Department of Chemistry",
    contact: "+91 94370 12345",
    email: "gensec.alumni@eduplatform.ac.in",
  },
  {
    name: "CA Sumanth Jena",
    role: "Treasurer",
    batch: "Batch of 1995 (Commerce)",
    profession: "Senior Partner, Jena & Associates Chartered Accountants",
    contact: "+91 98610 88990",
    email: "treasurer.alumni@eduplatform.ac.in",
  },
  {
    name: "Smt. Tanushree Pattnaik",
    role: "Joint Secretary",
    batch: "Batch of 2002 (Computer Science)",
    profession: "Director of Engineering, Mindtree Technologies",
    contact: "+91 94380 77665",
    email: "jointsec.alumni@eduplatform.ac.in",
  },
  {
    name: "Dr. Snigdha Mohanty",
    role: "Faculty Coordinator (Institutional)",
    batch: "Batch of 1999 (Economics)",
    profession: "Assistant Professor, Dept of Economics",
    contact: "+91 98612 34567",
    email: "alumni.coordinator@eduplatform.ac.in",
  },
];

const REGIONAL_CHAPTERS = [
  {
    chapter: "Bhubaneswar & Cuttack (HQ)",
    convenor: "Dr. Alok Nayak",
    members: "12,400+ Members",
    venue: "Alumni Bhavan, Central Campus",
    contact: "+91 674 230 4586",
    email: "chapter.odisha@eduplatform.ac.in",
  },
  {
    chapter: "Bengaluru Tech Chapter",
    convenor: "Mr. Rakesh Rout (VP, Infosys)",
    members: "4,800+ Members",
    venue: "Koramangala Club, Bengaluru",
    contact: "+91 98450 12345",
    email: "chapter.blr@eduplatform.ac.in",
  },
  {
    chapter: "Delhi-NCR Chapter",
    convenor: "Ms. Smita Mohanty (Director, Ministry of Commerce)",
    members: "3,600+ Members",
    venue: "India International Centre (IIC), New Delhi",
    contact: "+91 98110 56789",
    email: "chapter.delhi@eduplatform.ac.in",
  },
  {
    chapter: "Hyderabad & Telangana Chapter",
    convenor: "Dr. Subrat Tripathy (Scientist G, DRDO)",
    members: "2,200+ Members",
    venue: "HITEC City Convention Center, Hyderabad",
    contact: "+91 94400 98765",
    email: "chapter.hyd@eduplatform.ac.in",
  },
  {
    chapter: "North America & Canada Chapter (PSC-NA)",
    convenor: "Dr. Debasis Mishra (Silicon Valley, California)",
    members: "1,500+ Members",
    venue: "San Jose & Virtual Global Meet",
    contact: "+1 408 555 0192",
    email: "chapter.na@eduplatform.ac.in",
  },
  {
    chapter: "United Kingdom & Europe Chapter",
    convenor: "Dr. Ananya Ray (University of Oxford)",
    members: "850+ Members",
    venue: "London & Hybrid Online Sessions",
    contact: "+44 20 7946 0912",
    email: "chapter.uk@eduplatform.ac.in",
  },
];

export default function AlumniAssociation() {
  const [name, setName] = useState("");
  const [degree, setDegree] = useState("B.Tech / B.Sc. Hons");
  const [gradYear, setGradYear] = useState("2020");
  const [membershipTier, setMembershipTier] = useState("Life Member (₹2,500)");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [registered, setRegistered] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in your name and email");
      return;
    }
    setRegistered(true);
    toast.success("Membership Application Registered! Acknowledgment sent.");
  };

  return (
    <div>
      {/* Hero Section */}
      <Hero
        title="Alumni Association & Global Chapters"
        subtitle="A vibrant registered network of over 600,000 alumni across six continents, preserving cherished traditions, mentoring future scholars, and empowering institutional growth."
        backgroundImage={collegeHeroUrl}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/college" },
          { label: "Alumni", href: "/college/alumni" },
          { label: "Alumni Association", href: "/college/alumni/association" },
        ]}
      />

      <Container className="py-12 space-y-12">
        {/* Overview & Society Registration Badge */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-primary/10 via-card to-background border-primary/20 shadow-sm lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground text-xs font-semibold">
                  Registered Society
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Regd. No. 2481/1972 (Act XXI of 1860)
                </Badge>
              </div>
              <CardTitle className="text-2xl font-black text-foreground mt-2">
                Fostering Lifelong Fellowship & Legacy
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm leading-relaxed">
                The Alumni Association serves as the institutional bridge uniting generations of scholars who have graduated from our historic halls. It actively participates in campus governance, offers career mentorship, institutes student endowments, and hosts annual reunions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-muted-foreground leading-relaxed pt-0">
              <p>
                From civil servants and Supreme Court jurists to pioneering scientists and international entrepreneurs, our alumni form the moral and intellectual bedrock of the institution. All alumni are invited to register for Life Membership and connect with their nearest regional chapter.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-foreground font-medium text-xs">
                <div className="p-3 rounded-lg border border-border/60 bg-muted/30">
                  <span className="font-bold block text-primary">600,000+</span>
                  <span className="text-[11px] text-muted-foreground">Global Alumni Base</span>
                </div>
                <div className="p-3 rounded-lg border border-border/60 bg-muted/30">
                  <span className="font-bold block text-primary">6 Active Chapters</span>
                  <span className="text-[11px] text-muted-foreground">India & International</span>
                </div>
                <div className="p-3 rounded-lg border border-border/60 bg-muted/30">
                  <span className="font-bold block text-primary">Annual Alumni Day</span>
                  <span className="text-[11px] text-muted-foreground">Every Year on Dec 24th</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alumni Secretariats Desk */}
          <Card className="border border-border/80 bg-card shadow-sm flex flex-col justify-between">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Building className="w-4 h-4 text-primary" /> Alumni Secretariat Office
              </CardTitle>
              <CardDescription className="text-xs">
                Located at Alumni Bhavan on campus.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-muted/30 border border-border/60 space-y-1">
                <span className="text-muted-foreground block text-[11px]">General Secretary:</span>
                <span className="font-bold text-foreground text-sm block">Dr. Satyabrata Dash</span>
                <span className="text-[11px] text-muted-foreground">Alumni Bhavan, Near Central Library</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  <span className="font-mono text-foreground font-semibold">+91 674 230 4586</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  <a href="mailto:alumni@eduplatform.ac.in" className="text-primary hover:underline font-mono">
                    alumni@eduplatform.ac.in
                  </a>
                </div>
              </div>
            </CardContent>
            <div className="p-4 pt-0">
              <Button asChild size="sm" className="w-full text-xs font-bold gap-2">
                <a href="#membership-form">
                  <Users className="w-3.5 h-3.5" /> Register for Life Membership
                </a>
              </Button>
            </div>
          </Card>
        </div>

        {/* Executive Committee Roster Table */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Executive Committee (2025-2027)</h2>
              <p className="text-xs text-muted-foreground">
                Elected governing body leading the statutory Alumni Association, managing endowment funds and annual events.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                alert("Downloading Official Alumni Association Bylaws & Constitution (PDF)");
              }}
              className="gap-2 text-xs shrink-0"
            >
              <Download className="w-3.5 h-3.5" /> Download Bylaws (PDF)
            </Button>
          </div>

          <div className="overflow-x-auto border border-border rounded-xl bg-card shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-foreground font-semibold border-b border-border">
                <tr>
                  <th className="p-3">Name & Profession</th>
                  <th className="p-3">Office Bearer Role</th>
                  <th className="p-3">Graduation Batch</th>
                  <th className="p-3">Phone Contact</th>
                  <th className="p-3">Official Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {EXECUTIVE_COMMITTEE.map((m, idx) => (
                  <tr key={idx} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-foreground">{m.name}</div>
                      <div className="text-muted-foreground text-[11px]">{m.profession}</div>
                    </td>
                    <td className="p-3">
                      <Badge
                        variant={m.role === "President" ? "default" : "outline"}
                        className={m.role === "President" ? "bg-primary text-primary-foreground text-[11px]" : "text-[11px]"}
                      >
                        {m.role}
                      </Badge>
                    </td>
                    <td className="p-3 font-mono font-medium text-foreground">{m.batch}</td>
                    <td className="p-3 font-mono text-muted-foreground">{m.contact}</td>
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

        {/* Regional & Global Chapters Grid */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Regional & Global Chapter Network</h2>
            <p className="text-xs text-muted-foreground">
              Connecting alumni living and working in major metropolises across India and overseas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {REGIONAL_CHAPTERS.map((ch, idx) => (
              <Card key={idx} className="border border-border/80 bg-card hover:border-primary/50 transition-all hover:shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs font-semibold text-primary border-primary/30">
                      {ch.members}
                    </Badge>
                    <Globe className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-base font-bold text-foreground mt-1.5">
                    {ch.chapter}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Convenor: <strong className="text-foreground">{ch.convenor}</strong>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 pt-1 text-xs">
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span>Venue: {ch.venue}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground pt-1 border-t border-border/50">
                    <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                    <a href={`mailto:${ch.email}`} className="text-primary hover:underline">
                      {ch.email}
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Life Membership Registration Form */}
        <Card className="border border-primary/30 bg-card shadow-md" id="membership-form">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <Badge className="bg-primary text-primary-foreground text-xs">Official Registration</Badge>
            </div>
            <CardTitle className="text-xl font-bold mt-1">
              Apply for Alumni Life Membership
            </CardTitle>
            <CardDescription className="text-xs">
              Receive your permanent Life Membership Certificate, Digital Alumni Smart ID, and reciprocal guest house booking privileges.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!registered ? (
              <form onSubmit={handleRegister} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Full Name *</label>
                    <Input
                      type="text"
                      placeholder="e.g. Satyajit Mohapatra"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Degree Earned *</label>
                    <select
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-primary"
                    >
                      <option value="B.Tech / B.Sc. Hons">B.Tech / B.Sc. (Hons)</option>
                      <option value="B.A. / B.Com Hons">B.A. / B.Com (Hons)</option>
                      <option value="M.Sc. / M.Tech / MCA">M.Sc. / M.Tech / MCA</option>
                      <option value="M.A. / M.Com / MBA">M.A. / M.Com / MBA</option>
                      <option value="Ph.D. / M.Phil">Ph.D. / M.Phil</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Graduation Year *</label>
                    <Input
                      type="number"
                      placeholder="e.g. 2018"
                      value={gradYear}
                      onChange={(e) => setGradYear(e.target.value)}
                      className="text-xs h-9 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Email Address *</label>
                    <Input
                      type="email"
                      placeholder="e.g. alumni@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Mobile Phone</label>
                    <Input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Current City / Country</label>
                    <Input
                      type="text"
                      placeholder="e.g. Bengaluru, India"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="text-xs h-9"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Membership Category *</label>
                  <select
                    value={membershipTier}
                    onChange={(e) => setMembershipTier(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-primary font-medium"
                  >
                    <option value="Life Member (₹2,500)">Life Member (₹2,500 One-Time)</option>
                    <option value="Donor Member (₹10,000)">Donor Member (₹10,000 One-Time with Memento)</option>
                    <option value="Patron Member (₹50,000)">Patron Life Member (₹50,000 with Syndicate Dinner Invite)</option>
                    <option value="Recent Graduate (₹500)">Recent Graduate (Within 2 years - ₹500)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-primary" /> Online Payment via SBI Collect
                  </span>
                  <Button type="submit" className="font-bold gap-2 text-xs">
                    <Send className="w-4 h-4" /> Submit Application & Proceed to Payment
                  </Button>
                </div>
              </form>
            ) : (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-foreground">Life Membership Registration Initiated</h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Thank you, <strong>{name}</strong>. An application acknowledgement with temporary reference <strong>ALM-2026-8912</strong> has been sent to <strong>{email}</strong>.
                </p>
                <Button size="sm" variant="outline" onClick={() => setRegistered(false)}>
                  Register Another Alumnus
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cross-navigation to Other Alumni Sections */}
        <div className="pt-6 border-t border-border">
          <h3 className="text-lg font-bold mb-4">Explore More in Alumni & Giving</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <Link
              to="/college/alumni/connect"
              className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-sm group flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors text-sm">
                  Mentorship & Reunions
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">Alumni Meet, Mentoring & Career Network</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
