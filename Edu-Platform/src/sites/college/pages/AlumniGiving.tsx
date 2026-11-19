import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Gift,
  Heart,
  DollarSign,
  Award,
  CreditCard,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Building,
  TrendingUp,
  Download,
  ArrowRight,
  FileText,
  Landmark,
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

interface DonorHonor {
  name: string;
  tier: "Platinum Benefactor" | "Gold Benefactor" | "Silver Benefactor";
  batch: string;
  amount: string;
  cause: string;
}

const DONOR_HONOR_ROLL: DonorHonor[] = [
  {
    name: "Shri Subroto Bagchi & Smt. Susmita Bagchi",
    tier: "Platinum Benefactor",
    batch: "Batch of 1977",
    amount: "₹1,50,00,000",
    cause: "Bagchi Advanced Centre for Computer Science & Skill Labs",
  },
  {
    name: "Dr. Pratibha Ray (Jnanpith Awardee)",
    tier: "Platinum Benefactor",
    batch: "Batch of 1965",
    amount: "₹25,00,000",
    cause: "Yajnaseni Endowment Scholarship for Women in Literature",
  },
  {
    name: "Dr. Harekrushna Mahatab Memorial Trust",
    tier: "Gold Benefactor",
    batch: "Class of 1920 Foundation",
    amount: "₹20,00,000",
    cause: "Mahatab Chair for Historical Research & Archive Digitization",
  },
  {
    name: "Alumni Batch of 1985 (Golden Silver Reunion)",
    tier: "Gold Benefactor",
    batch: "Class of 1985",
    amount: "₹15,00,000",
    cause: "Modernization of Central Library Reading Hall & E-Reserves",
  },
  {
    name: "Justice B. K. Ray Family Endowment",
    tier: "Silver Benefactor",
    batch: "Class of 1938 Legacy",
    amount: "₹10,00,000",
    cause: "Annual Gold Medal for Legal Studies & Jurisprudence Topper",
  },
  {
    name: "Dr. Alok Nayak & Faculty Circle",
    tier: "Silver Benefactor",
    batch: "Faculty Alumni Endowment",
    amount: "₹5,00,000",
    cause: "Emergency Medical Relief Corpus for Enrolled Students",
  },
];

export default function AlumniGiving() {
  const [donationAmount, setDonationAmount] = useState("5000");
  const [cause, setCause] = useState("Scholarships");
  const [donorName, setDonorName] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim() || !email.trim()) {
      toast.error("Please provide your name and contact email");
      return;
    }
    setSubmitted(true);
    toast.success("Contribution pledge registered! Redirecting to SBI Collect...");
  };

  return (
    <div>
      {/* Hero Section */}
      <Hero
        title="Give to the University & Mo College Endowments"
        subtitle="Empowering future generations of scholars, funding transformative research chairs, and preserving our historic academic heritage through tax-exempted philanthropic contributions."
        backgroundImage={collegeHeroUrl}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/college" },
          { label: "Alumni", href: "/college/alumni" },
          { label: "Give to the University", href: "/college/alumni/giving" },
        ]}
      />

      <Container className="py-12 space-y-12">
        {/* Tax Exemption & Mo College Multiplier Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-emerald-500/10 via-card to-background border-emerald-500/30 shadow-sm lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-600 text-white text-xs font-semibold">
                  100% Tax Deductible
                </Badge>
                <Badge variant="outline" className="text-xs text-emerald-700 dark:text-emerald-300 border-emerald-300">
                  Section 80G (IT Act 1961)
                </Badge>
                <Badge variant="outline" className="text-xs text-blue-700 dark:text-blue-300 border-blue-300">
                  Govt Matching Grant
                </Badge>
              </div>
              <CardTitle className="text-2xl font-black text-foreground mt-2">
                Double Your Impact with Mo College Abhiyan
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm leading-relaxed">
                Under the Government of Odisha's flagship <em>Mo College Abhiyan</em>, every alumni contribution for infrastructure, laboratories, and student welfare receives a 2x matching government grant from the state budget.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-muted-foreground leading-relaxed pt-0">
              <p>
                All donations are administered under strict oversight by the Comptroller of Finance and the Syndicate Endowment Board, backed by certified annual audits and instant automated 80G tax exemption certificates.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-foreground font-medium text-xs">
                <div className="p-3 rounded-lg border border-border/60 bg-muted/30">
                  <span className="font-bold block text-emerald-600">₹4.85+ Crore</span>
                  <span className="text-[11px] text-muted-foreground">Total Endowment Corpus</span>
                </div>
                <div className="p-3 rounded-lg border border-border/60 bg-muted/30">
                  <span className="font-bold block text-emerald-600">180+ Scholars</span>
                  <span className="text-[11px] text-muted-foreground">Annual Fee Waivers</span>
                </div>
                <div className="p-3 rounded-lg border border-border/60 bg-muted/30">
                  <span className="font-bold block text-emerald-600">24 Smart Labs</span>
                  <span className="text-[11px] text-muted-foreground">Alumni-Funded Upgrades</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Mo College Link Card */}
          <Card className="border border-border/80 bg-card shadow-sm flex flex-col justify-between">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Landmark className="w-4 h-4 text-primary" /> State Mo College Portal
              </CardTitle>
              <CardDescription className="text-xs">
                Direct integration with Government of Odisha matching grant registry.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-muted-foreground">
              <p>
                Alumni who wish to contribute directly through the state portal can select our institution (College Code: 1204) to trigger instantaneous government matching matching allocations.
              </p>
              <div className="p-3 rounded-lg bg-muted/40 font-mono text-[11px] text-foreground">
                College AISHE Code: C-39812<br />
                Mo College ID: MC-OD-1204
              </div>
            </CardContent>
            <div className="p-4 pt-0">
              <Button asChild variant="outline" size="sm" className="w-full text-xs font-semibold gap-1.5">
                <a href="https://mocollege.odisha.gov.in" target="_blank" rel="noreferrer">
                  <span>Visit Mo College Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </Button>
            </div>
          </Card>
        </div>

        {/* Priority Contribution Causes */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Designated Endowment Causes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-border/80 bg-card hover:border-primary/50 transition-all space-y-2">
              <Badge className="bg-primary/10 text-primary text-[10px]">Highest Need</Badge>
              <h4 className="font-bold text-foreground text-sm">Merit-cum-Means Scholarships</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Full and partial semester fee waivers for economically disadvantaged undergraduate and postgraduate scholars.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border/80 bg-card hover:border-primary/50 transition-all space-y-2">
              <Badge className="bg-blue-500/10 text-blue-600 text-[10px]">Research</Badge>
              <h4 className="font-bold text-foreground text-sm">Ph.D. Seed Grants & Travel Support</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Empowering doctoral fellows to present papers at IEEE/ACM international conferences and publish in Q1 journals.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border/80 bg-card hover:border-primary/50 transition-all space-y-2">
              <Badge className="bg-purple-500/10 text-purple-600 text-[10px]">Heritage</Badge>
              <h4 className="font-bold text-foreground text-sm">Hostel Living Modernization</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Renovation of heritage hostel rooms, dining halls, continuous solar water heaters, and gym facilities.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border/80 bg-card hover:border-primary/50 transition-all space-y-2">
              <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">Digital</Badge>
              <h4 className="font-bold text-foreground text-sm">Rare Manuscript Digitization</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                High-resolution optical scanning and digital preservation of 4,000+ palm-leaf and archival manuscripts in Parija Library.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Giving / Donation Pledge Form */}
        <Card className="border border-primary/30 bg-card shadow-md">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Gift className="w-5 h-5 text-primary" /> Make an Endowment Gift
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Select your contribution amount and cause. Official 80G tax receipt is dispatched to your email immediately.
                </CardDescription>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs">
                80G Verified
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {!submitted ? (
              <form onSubmit={handleDonate} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Donor Full Name *</label>
                    <Input
                      type="text"
                      placeholder="e.g. Satyajit Mohapatra"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      required
                      className="text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">PAN Number (For 80G Tax Exemption)</label>
                    <Input
                      type="text"
                      placeholder="e.g. ABCDE1234F"
                      value={panNumber}
                      onChange={(e) => setPanNumber(e.target.value)}
                      className="text-xs h-9 uppercase font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Designated Endowment Cause *</label>
                    <select
                      value={cause}
                      onChange={(e) => setCause(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-primary font-medium"
                    >
                      <option value="Scholarships">Merit-cum-Means Student Scholarships</option>
                      <option value="Research">Ph.D. Seed Money & Innovation Labs</option>
                      <option value="Library">Central Library Digitization & Rare Books</option>
                      <option value="Hostel">Hostel Living Modernization</option>
                      <option value="General">General University Endowment Corpus</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Email Address (For Tax Receipt) *</label>
                    <Input
                      type="email"
                      placeholder="e.g. donor@gmail.com"
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
                </div>

                <div className="space-y-1.5 pt-1">
                  <label className="font-semibold text-foreground">Select Contribution Amount (INR)</label>
                  <div className="flex flex-wrap items-center gap-2">
                    {["1000", "5000", "10000", "25000", "50000", "100000"].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setDonationAmount(amt)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                          donationAmount === amt
                            ? "bg-primary text-primary-foreground border-primary shadow-xs"
                            : "bg-background text-foreground border-border hover:bg-muted"
                        }`}
                      >
                        ₹{Number(amt).toLocaleString()}
                      </button>
                    ))}
                    <div className="w-32">
                      <Input
                        type="number"
                        placeholder="Custom"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        className="text-xs h-8 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-border/50">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Secure 256-Bit SSL SBI Collect Checkout
                  </span>
                  <Button type="submit" className="font-bold gap-2 text-xs">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Proceed to Gift ₹{Number(donationAmount).toLocaleString()}</span>
                  </Button>
                </div>
              </form>
            ) : (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-foreground">Contribution Pledge Registered</h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Thank you, <strong>{donorName}</strong>. Your generous gift of <strong>₹{Number(donationAmount).toLocaleString()}</strong> towards <strong>{cause}</strong> has been logged. An 80G tax receipt has been dispatched to <strong>{email}</strong>.
                </p>
                <Button size="sm" variant="outline" onClick={() => setSubmitted(false)}>
                  Make Another Gift
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Wall of Benefactors / Donor Honor Roll */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Wall of Benefactors (Honor Roll)</h2>
              <p className="text-xs text-muted-foreground">
                In grateful recognition of extraordinary alumni and philanthropic families whose endowments transform our campus.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert("Downloading Audited Annual Endowment Report (PDF)")}
              className="gap-2 text-xs shrink-0"
            >
              <Download className="w-3.5 h-3.5" /> Audited Endowment Report (PDF)
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DONOR_HONOR_ROLL.map((donor, idx) => (
              <Card key={idx} className="border border-border/80 bg-card p-4 space-y-2 hover:border-primary/40 transition-all shadow-xs">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={
                      donor.tier.includes("Platinum")
                        ? "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-300 text-[10px]"
                        : donor.tier.includes("Gold")
                        ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300 text-[10px]"
                        : "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-300 text-[10px]"
                    }
                  >
                    {donor.tier}
                  </Badge>
                  <span className="font-mono text-xs font-bold text-emerald-600">{donor.amount}</span>
                </div>
                <h4 className="text-sm font-bold text-foreground mt-1">
                  {donor.name}
                </h4>
                <div className="text-[11px] font-mono text-muted-foreground">
                  {donor.batch}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pt-1 border-t border-border/50">
                  {donor.cause}
                </p>
              </Card>
            ))}
          </div>
        </div>

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
