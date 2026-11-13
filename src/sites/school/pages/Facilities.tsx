import { Link } from "react-router-dom";
import { Hero } from "@/components/sections/Hero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { schoolHeroUrl } from "@/mocks/data/images";
import {
  Building2,
  BookOpen,
  FlaskConical,
  Laptop,
  Trophy,
  Bus,
  Droplets,
  Heart,
  ShieldCheck,
  Video,
  Download,
  ExternalLink,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

export default function SchoolFacilities() {
  const facilitiesList = [
    {
      title: "36 Smart & Interactive Classrooms",
      specs: "48.0 sq. metres (516 sq. ft) per classroom",
      desc: "Spacious, well-ventilated, naturally lit rooms equipped with digital interactive panels, green ceramic chalkboards, and ergonomic age-appropriate dual benches.",
      icon: Building2,
      badge: "100% ICT Enabled",
    },
    {
      title: "Atal Tinkering Lab (ATL - NITI Aayog)",
      specs: "110.0 sq. metres · NITI Aayog Sanctioned",
      desc: "State-of-the-art innovation workspace with 3D printer, robotics kits, Arduino boards, sensors, drone kits, and mechanical tools for hands-on invention.",
      icon: Laptop,
      badge: "Robotics & IoT",
    },
    {
      title: "Physics, Chemistry & Biology Labs",
      specs: "3 Senior Secondary Labs · 82.0 sq. metres each",
      desc: "Full-fledged experimental setups conforming to CBSE Senior Secondary norms, complete with gas distribution pipeline, chemical fume hoods, and safety showers.",
      icon: FlaskConical,
      badge: "CBSE Certified",
    },
    {
      title: "Central School Library",
      specs: "115.0 sq. metres · 8,500+ Volumes",
      desc: "Fully computerized with Koha Open Source Library Management, 15 national periodicals, 4 daily newspapers, reference encyclopedias, and a quiet reading hall.",
      icon: BookOpen,
      badge: "Koha ILMS OPAC",
      link: "/school/library",
    },
    {
      title: "Playground & Sports Complex",
      specs: "8,200 sq. metres dedicated sports field",
      desc: "Standard 200m athletic track, football ground, cricket nets, basketball and volleyball courts, kho-kho field, and indoor table tennis and chess arenas.",
      icon: Trophy,
      badge: "Fit India Gold",
    },
    {
      title: "Barrier-Free Ramps & CWSN Toilets",
      specs: "100% Physically Accessible",
      desc: "Gentle gradient ramps with stainless steel grab rails at all ground-to-first floor entry points. 4 dedicated accessible toilets designed for children with special needs.",
      icon: Heart,
      badge: "Inclusive Access",
    },
    {
      title: "Safe Drinking Water & Sanitation",
      specs: "Commercial RO Plant (1,000 LPH)",
      desc: "3 heavy-duty RO water filtration plants with chilled water dispensers. 36 boys & girls toilets with sanitary napkin vending machines and incinerators.",
      icon: Droplets,
      badge: "PHED Tested",
    },
    {
      title: "GPS-Tracked School Transport",
      specs: "Fleet of 8 Registered School Buses",
      desc: "All vehicles equipped with GPS live tracking, speed governors, CCTV cameras, first-aid kits, fire extinguishers, and verified female attendants.",
      icon: Bus,
      badge: "Safe Transport",
    },
  ];

  const busRoutes = [
    { routeNo: "Route 1", origin: "Nayagarh Town (Bus Stand & Court)", stops: "Nayagarh Town, Sinduria, Lenkudipada, Khandapara School", busNo: "OD-25-A-1204", incharge: "Shri S. K. Nayak (+91 94370 11223)" },
    { routeNo: "Route 2", origin: "Bhapur & Fategarh", stops: "Bhapur Bazar, Padmabati, Fategarh Chhak, School Campus", busNo: "OD-25-A-1205", incharge: "Shri B. C. Rout (+91 94370 22334)" },
    { routeNo: "Route 3", origin: "Kantilo & Nilamadhaba", stops: "Kantilo Temple Chhak, Badasahara, Benagadia, Khandapara", busNo: "OD-25-A-1206", incharge: "Shri R. K. Jena (+91 94370 33445)" },
    { routeNo: "Route 4", origin: "Gania & Dashapalla Border", stops: "Gania Block HQ, Belapadapatna, Koska, School Campus", busNo: "OD-25-A-1207", incharge: "Shri D. N. Sahoo (+91 94370 44556)" },
  ];

  return (
    <>
      <Hero
        variant="compact"
        title="Campus Infrastructure & Facilities"
        subtitle="4.0 Acres Green Campus, Atal Tinkering Lab, 6 Specialized Labs, Library & Safe Transport"
        imageUrl={schoolHeroUrl(2)}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/school" }, { label: "Facilities" }]} />

      <Container className="py-10 space-y-10">
        {/* Campus Overview Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-background to-emerald-500/10 border-2 border-primary/20 space-y-3 shadow-xs">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground font-bold text-xs">
                  CBSE Appendix IX Verified
                </Badge>
                <Badge variant="outline" className="text-xs">4.00 Acres Land</Badge>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-foreground">
                State-of-the-Art Infrastructure for Joyful Learning
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
                Our School campus is designed to meet and exceed every physical, sanitary, safety, and pedagogical norm laid down by the Central Board of Secondary Education (CBSE) and National Building Code (NBC 2016).
              </p>
            </div>

            <Button asChild size="sm" variant="outline" className="gap-2 text-xs font-bold shrink-0">
              <Link to="/school/mandatory-disclosure">
                <span>View Appendix IX Disclosures</span>
                <ChevronRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {facilitiesList.map((fac) => {
            const Icon = fac.icon;
            return (
              <Card key={fac.title} className="border border-border/70 p-5 space-y-3 bg-card flex flex-col justify-between shadow-2xs hover:border-primary transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="size-5" />
                    </div>
                    <Badge variant="outline" className="text-[10px] font-semibold">
                      {fac.badge}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-sm text-foreground pt-1">{fac.title}</h3>
                  <div className="text-[11px] font-mono text-primary font-semibold">{fac.specs}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{fac.desc}</p>
                </div>

                {fac.link && (
                  <Button asChild size="sm" variant="ghost" className="h-7 text-xs text-primary gap-1 p-0 justify-start">
                    <Link to={fac.link}>
                      <span>Explore Library OPAC</span>
                      <ChevronRight className="size-3.5" />
                    </Link>
                  </Button>
                )}
              </Card>
            );
          })}
        </div>

        {/* School Transport Bus Routes Table */}
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Bus className="size-5 text-primary" />
              <span>School Transport Network & GPS Bus Routes</span>
            </h2>
            <p className="text-xs text-muted-foreground">Safe student pickup and drop service across Khandapara, Bhapur, Kantilo, and Nayagarh town.</p>
          </div>

          <div className="border rounded-xl overflow-hidden bg-card shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/80 text-foreground font-bold border-b">
                <tr>
                  <th className="p-3 w-24">Route No.</th>
                  <th className="p-3 w-1/4">Origin / Sector</th>
                  <th className="p-3">Key Stoppages & Boarding Points</th>
                  <th className="p-3">Bus Vehicle No.</th>
                  <th className="p-3">Driver / In-charge Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {busRoutes.map((route) => (
                  <tr key={route.routeNo} className="hover:bg-muted/30">
                    <td className="p-3 font-bold text-primary font-mono">{route.routeNo}</td>
                    <td className="p-3 font-semibold text-foreground">{route.origin}</td>
                    <td className="p-3 text-muted-foreground">{route.stops}</td>
                    <td className="p-3 font-mono font-medium text-foreground">{route.busNo}</td>
                    <td className="p-3 font-semibold text-foreground">{route.incharge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Safety, CCTV & Sanitation Guarantee Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border bg-card space-y-1.5 text-xs shadow-2xs">
            <div className="font-bold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-emerald-600" />
              <span>48 CCTV Cameras (24x7)</span>
            </div>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Every school gate, corridor, lab, and playground area is monitored round the clock with digital backup preserved for 90 days.
            </p>
          </div>

          <div className="p-4 rounded-xl border bg-card space-y-1.5 text-xs shadow-2xs">
            <div className="font-bold text-foreground flex items-center gap-1.5">
              <Droplets className="size-4 text-blue-600" />
              <span>Potable Water Testing</span>
            </div>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Bacteriological and chemical water purity testing conducted semi-annually by District Public Health Engineering Lab.
            </p>
          </div>

          <div className="p-4 rounded-xl border bg-card space-y-1.5 text-xs shadow-2xs">
            <div className="font-bold text-foreground flex items-center gap-1.5">
              <Heart className="size-4 text-rose-600" />
              <span>Medical First-Aid & Infirmary</span>
            </div>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Full-time trained medical nurse, infirmary beds, oxygen kit, and tie-up with nearby Khandapara Community Health Centre (CHC).
            </p>
          </div>
        </div>
      </Container>
    </>
  );
}
