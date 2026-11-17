import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Award,
  Heart,
  Globe,
  DollarSign,
  CreditCard,
  Building2,
  CheckCircle2,
  ExternalLink,
  Gift,
  Mail,
  Calendar,
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

export default function CollegeAlumni() {
  const [donationAmount, setDonationAmount] = useState("5000");
  const [cause, setCause] = useState("Scholarships");
  const [donorName, setDonorName] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const distinguishedAlumni = [
    {
      name: "Dr. Harekrushna Mahatab",
      batch: "Alumnus (1920)",
      field: "Statesman & Historian",
      desc: "Former Chief Minister of Odisha, Union Cabinet Minister, and founder of The Prajatantra.",
    },
    {
      name: "Justice B. K. Ray",
      batch: "Alumnus (1938)",
      field: "Judiciary & Law",
      desc: "Eminent Jurist, Former Chief Justice, and instrumental in pioneering legal education in Odisha.",
    },
    {
      name: "Prof. (Dr.) Prana Krushna Parija",
      batch: "Alumnus (1913)",
      field: "Biological Sciences",
      desc: "Renowned botanist, Vice-Chancellor of Utkal University, and Fellow of the National Institute of Sciences of India.",
    },
    {
      name: "Mayadhar Mansingh",
      batch: "Alumnus (1932)",
      field: "Literature & Education",
      desc: "Celebrated romantic poet, educator, and principal who shaped modern Odia literary consciousness.",
    },
    {
      name: "Prof. Trilochan Pradhan",
      batch: "Alumnus (1949)",
      field: "Theoretical Physics",
      desc: "Founder-Director of the Institute of Physics (IOP), Bhubaneswar and Padma Shri recipient.",
    },
    {
      name: "Smt. Pratibha Ray",
      batch: "Alumna (1965)",
      field: "Indian Literature",
      desc: "Jnanpith Awardee, Padma Bhushan recipient, and celebrated novelist representing Indian thought globally.",
    },
  ];

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName) {
      toast.error("Please enter your name");
      return;
    }
    setSubmitted(true);
    toast.success("Thank you for your generous pledge! Redirecting to SBI Collect...");
  };

  return (
    <>
      <Hero variant="compact" title="Alumni & Giving" imageUrl={collegeHeroUrl(3)} />
      <Breadcrumbs items={[{ label: "Home", href: "/college" }, { label: "Alumni & Giving" }]} />

      <Container className="py-10 space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                Global Footprint
              </Badge>
              <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs">
                600,000+ Alumni Network
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground">
              Alumni Association & Endowment Giving
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl">
              Connecting generations of scholars across five continents and advancing transformative endowments under the Mo College Odisha initiative.
            </p>
          </div>

          <Button size="sm" variant="outline" asChild className="gap-1.5 text-xs self-start md:self-auto">
            <a href="https://mocollege.odisha.gov.in" target="_blank" rel="noreferrer">
              <span>Mo College Portal (Govt of Odisha)</span>
              <ExternalLink className="size-3" />
            </a>
          </Button>
        </div>

        {/* Give to the University / Donation Section */}
        <Card className="border-primary/30 bg-gradient-to-r from-primary/5 via-card to-card shadow-xs">
          <CardHeader className="p-5 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Gift className="size-5 text-primary" />
                  Give to the University (Endowment Fund)
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  100% of contributions qualify for statutory 80G income-tax deduction under the IT Act 1961.
                </CardDescription>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs">
                80G Tax Exempted
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-5">
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
                    <label className="font-semibold text-foreground">PAN Number (for 80G Receipt)</label>
                    <Input
                      type="text"
                      placeholder="e.g. ABCDE1234F"
                      value={panNumber}
                      onChange={(e) => setPanNumber(e.target.value)}
                      className="text-xs h-9 uppercase font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Cause / Purpose</label>
                    <select
                      value={cause}
                      onChange={(e) => setCause(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      <option value="Scholarships">Merit-cum-Means Student Scholarships</option>
                      <option value="Research">Ph.D. Seed Money & Research Labs</option>
                      <option value="Library">Library Digitization & Rare Manuscripts</option>
                      <option value="Hostel">Hostel Living Facilities Modernization</option>
                      <option value="General">General Institutional Development</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Contribution Amount (INR)</label>
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
                        placeholder="Other"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        className="text-xs h-8 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-border/50">
                  <span className="text-[11px] text-muted-foreground">
                    Online receipts generated automatically via SBI Collect
                  </span>
                  <Button type="submit" size="sm" className="gap-1.5 text-xs font-bold bg-primary text-primary-foreground">
                    <CreditCard className="size-3.5" />
                    <span>Proceed to Secure Payment (₹{Number(donationAmount).toLocaleString()})</span>
                  </Button>
                </div>
              </form>
            ) : (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="size-8 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-foreground">Contribution Pledge Registered</h4>
                <p className="text-xs text-muted-foreground">
                  Thank you, <strong>{donorName}</strong>. Your support for <strong>{cause}</strong> empowers future generations of scholars.
                </p>
                <Button size="xs" variant="outline" onClick={() => setSubmitted(false)}>
                  Make Another Gift
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Distinguished Alumni Hall of Fame */}
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h3 className="text-xl font-bold text-foreground">Distinguished Alumni Hall of Fame</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Honoring illustrious scholars, leaders, and scientists who shaped national policy and culture.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {distinguishedAlumni.map((alumnus, idx) => (
              <Card key={idx} className="border border-border/60 bg-card p-4 space-y-2 hover:border-primary/40 shadow-xs transition-all">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono text-[10px] text-primary border-primary/30">
                    {alumnus.batch}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                    {alumnus.field}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-foreground mt-1">
                  {alumnus.name}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {alumnus.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
