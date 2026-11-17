import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Users,
  Award,
  Sparkles,
  ExternalLink,
  Download,
  Building2,
  Calendar,
  CheckCircle2,
  Send,
  GraduationCap,
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

export default function SchoolAlumni() {
  const [registered, setRegistered] = useState(false);
  const [name, setName] = useState("");
  const [batch, setBatch] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profession, setProfession] = useState("");
  const [city, setCity] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistered(true);
  };

  const distinguishedAlumni = [
    {
      name: "Dr. Soumya Ranjan Mohapatra",
      batch: "Batch of 2004",
      field: "Cardiologist, AIIMS New Delhi",
      achievement: "Gold Medalist at AIIMS, pioneer in paediatric cardiology research.",
    },
    {
      name: "Smt. Lopamudra Priyadarshini, OAS",
      batch: "Batch of 2007",
      field: "Odisha Administrative Service (OAS)",
      achievement: "Sub-Collector & Sub-Divisional Magistrate, Govt. of Odisha.",
    },
    {
      name: "Shri Animesh Kumar Jena",
      batch: "Batch of 2011",
      field: "Principal Software Architect, Google",
      achievement: "Patent holder in Distributed Cloud Computing systems, Bengaluru.",
    },
    {
      name: "Ms. Suchitra Rout",
      batch: "Batch of 2016",
      field: "National Kabaddi Athlete & Coach",
      achievement: "Represented Odisha in 36th National Games; Gold Medalist at Inter-University Games.",
    },
  ];

  return (
    <>
      <Hero
        variant="compact"
        title="Alumni & 'Mo School Abhiyan'"
        subtitle="Connecting Generations of Learners, Strengthening Our Alma Mater & Odisha 'Mo School' Initiative"
        imageUrl={schoolHeroUrl(5)}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/school" }, { label: "Alumni & Mo School" }]} />

      <Container className="py-10 space-y-10">
        {/* Mo School Abhiyan Spotlight Card */}
        <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/10 via-background to-amber-500/10 p-6 shadow-md">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground font-black text-xs uppercase px-2 py-0.5 shadow-xs">
                  Government of Odisha
                </Badge>
                <Badge variant="outline" className="border-amber-500 text-amber-700 dark:text-amber-300 font-bold text-xs">
                  Mo School Abhiyan Partner
                </Badge>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-foreground">
                Rebuilding Our Alma Mater with Double the Impact
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Under the flagship <strong>"Mo School Abhiyan"</strong> of the Department of School & Mass Education, Government of Odisha, every rupee contributed by alumni or donors for school infrastructure (smart classrooms, science labs, libraries, sports) is matched with a <strong>2x contribution by the State Government</strong>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full lg:w-auto">
              <Button asChild className="gap-2 bg-primary font-bold text-xs shadow-md">
                <a href="https://moschool.odisha.gov.in" target="_blank" rel="noreferrer">
                  <span>Visit Mo School Portal</span>
                  <ExternalLink className="size-3.5" />
                </a>
              </Button>
            </div>
          </div>
        </Card>

        {/* 2-Column: Roll of Honor & Alumni Registration */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1 & 2: Distinguished Alumni Roll of Honor */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border-b pb-3">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Award className="size-5 text-primary" />
                <span>Distinguished Alumni — Roll of Honor</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Celebrating the inspiring achievements of students who began their journey in the classrooms of Our School.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {distinguishedAlumni.map((alum) => (
                <Card key={alum.name} className="border border-border/70 p-4 space-y-2 bg-card shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-primary">{alum.batch}</span>
                    <Badge variant="outline" className="text-[10px]">Alumni</Badge>
                  </div>
                  <h3 className="font-bold text-sm text-foreground">{alum.name}</h3>
                  <div className="text-xs text-primary font-semibold">{alum.field}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {alum.achievement}
                  </p>
                </Card>
              ))}
            </div>

            <div className="p-4 rounded-xl border bg-muted/30 space-y-2">
              <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                <Calendar className="size-4 text-primary" />
                <span>Annual Alumni Homecoming Conclave</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The Annual Alumni Meet is held every year on the 2nd Sunday of January in the school quadrangle. Alumni from all batches are invited to reconnect, mentor current students, and share career guidance.
              </p>
            </div>
          </div>

          {/* Column 3: Alumni Registration Form */}
          <div>
            <Card className="border border-border/70 bg-card shadow-xs">
              <CardHeader className="border-b pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <GraduationCap className="size-4 text-primary" />
                  <span>Join Alumni Association</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Stay connected with your teachers, juniors, and batchmates.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5">
                {registered ? (
                  <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                    <CheckCircle2 className="size-10 text-emerald-600 mx-auto" />
                    <div className="font-bold text-sm text-foreground">Welcome to Our School Alumni Network!</div>
                    <p className="text-xs text-muted-foreground">
                      Thank you, {name}! Your registration has been received. Our alumni coordinator will reach out with the next newsletter and meet invitation.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-foreground">Full Name *</label>
                      <Input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Full Name"
                        className="text-xs h-8"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-foreground">Passing Batch / Year *</label>
                      <Input
                        required
                        value={batch}
                        onChange={(e) => setBatch(e.target.value)}
                        placeholder="e.g. Class X (2012)"
                        className="text-xs h-8"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-foreground">Current Profession / Designation</label>
                      <Input
                        value={profession}
                        onChange={(e) => setProfession(e.target.value)}
                        placeholder="e.g. Software Engineer / Doctor"
                        className="text-xs h-8"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-foreground">Current City / Location</label>
                      <Input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Bhubaneswar / New Delhi"
                        className="text-xs h-8"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-foreground">Email ID *</label>
                      <Input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alumni@example.com"
                        className="text-xs h-8"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-foreground">Mobile Phone No. *</label>
                      <Input
                        required
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="text-xs h-8"
                      />
                    </div>

                    <Button type="submit" size="sm" className="w-full font-bold text-xs gap-1.5 mt-2">
                      <Send className="size-3" />
                      <span>Register as Alumni</span>
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </>
  );
}
