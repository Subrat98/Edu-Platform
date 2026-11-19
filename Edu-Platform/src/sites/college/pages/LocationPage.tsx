import { Link } from "react-router-dom";
import {
  MapPin,
  Plane,
  Train,
  Bus,
  Car,
  Compass,
  Navigation,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  ExternalLink,
  Building,
} from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { collegeHeroUrl } from "@/mocks/data/images";
import { institutions } from "@/mocks/data/institutions";

export default function LocationPage() {
  const institution = institutions.college;

  const transitModes = [
    {
      title: "By Air · Biju Patnaik International Airport (BBI)",
      icon: Plane,
      color: "text-blue-600 bg-blue-500/10 border-blue-500/20",
      distance: "6.5 km from Campus (15–20 minutes drive)",
      details: "Direct non-stop domestic flights connect Bhubaneswar with New Delhi, Mumbai, Bengaluru, Kolkata, Hyderabad, and Chennai, alongside international flights to Dubai, Singapore, and Bangkok.",
      connectivity: "Prepaid taxi booths, Ola/Uber app cabs, and airport-to-city Mo Bus shuttles operate round-the-clock right from the arrival terminal.",
    },
    {
      title: "By Rail · Bhubaneswar Central Railway Station (BBS)",
      icon: Train,
      color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
      distance: "4.2 km from Campus (10–12 minutes drive)",
      details: "Bhubaneswar is a premier 'A-1' category station on the East Coast Railway's main Howrah–Chennai trunk route. Frequent Rajdhani, Vande Bharat, and Superfast express trains connect all national metropolises.",
      connectivity: "24x7 pre-paid auto-rickshaw booths, city buses (Mo Bus Route 11/12), and app cabs depart directly from Platform 1 & Platform 6 circulating areas.",
    },
    {
      title: "By Road · National Highway 16 (NH-16)",
      icon: Bus,
      color: "text-amber-600 bg-amber-500/10 border-amber-500/20",
      distance: "Direct Frontage on NH-16 (Kolkata–Chennai Golden Quadrilateral)",
      details: "The university campus has wide direct arterial access off National Highway 16. Regular inter-state luxury and deluxe buses operate from Baramunda Inter-State Bus Terminal (ISBT - 8 km).",
      connectivity: "OSRTC government buses, private long-distance coaches, and intra-district express transit stop at the designated university highway overbridge stop.",
    },
    {
      title: "Local City Transit · Mo Bus Smart Mobility",
      icon: Navigation,
      color: "text-purple-600 bg-purple-500/10 border-purple-500/20",
      distance: "Dedicated Vani Vihar Bus Stop directly outside Gate 1",
      details: "The Capital Region Urban Transport (CRUT) operates frequent air-conditioned and non-AC electric Mo Buses connecting the campus across Bhubaneswar, Cuttack, and Puri.",
      connectivity: "Key Mo Bus routes stopping at university: Route 10, Route 11 (Railway Station), Route 12, Route 13, and Route 18. Shared auto services available along Janpath.",
    },
  ];

  const campusGates = [
    {
      gate: "Gate No. 1 (Main Ceremonial Gate)",
      facing: "NH-16 Highway Frontage",
      access: "Leads directly to Administrative Block, Vice-Chancellor's Secretariat, Syndicate Hall & Convocation Quadrangle.",
    },
    {
      gate: "Gate No. 2 (Parija Library Gate)",
      facing: "North-West Arterial Road",
      access: "Direct access to Parija Central Library, Science PG Departments, Central Instrumentation Facility & IQAC Cell.",
    },
    {
      gate: "Gate No. 3 (Residential & Hostels Gate)",
      facing: "Vani Vihar West Enclave",
      access: "Dedicated entrance for Boys' and Girls' PG Hostels, International Scholar Guest House & Staff Quarters.",
    },
    {
      gate: "Gate No. 4 (Sports Complex Gate)",
      facing: "South Avenue",
      access: "Direct ingress for Biju Patnaik Indoor Stadium, Cricket Ground, Gymnasium, and Open-Air Cultural Amphitheatre.",
    },
  ];

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/college" },
          { label: "About", href: "/college/about" },
          { label: "Location & How to Reach" },
        ]}
      />

      <Hero
        variant="compact"
        title="Location & How to Reach"
        subtitle="Comprehensive Transit Guidelines, Highway Coordinates & Campus Access Protocols"
        imageUrl={collegeHeroUrl(2)}
      />

      <Container className="py-10 space-y-12">
        {/* Intro */}
        <div className="space-y-4 border-b pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
              Prime Smart City Location
            </Badge>
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs">
              350+ Acre Sprawling Green Campus
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Reaching the University Campus
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl">
            {institution.name} is nestled in the prime educational and cultural heart of Bhubaneswar along National Highway 16.
            Surrounded by premier national institutes, scientific laboratories, and historic temples, the campus is superbly connected
            via international aviation, rail corridors, and high-speed express bus transit.
          </p>
        </div>

        {/* Postal Coordinates & Quick Action Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6 border-2 border-primary/20 bg-primary/5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <MapPin className="size-5" />
              <span>Official Postal & Navigational Address</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-foreground">{institution.name}</h3>
              <p className="text-xs sm:text-sm text-foreground/90 font-medium">
                Vani Vihar, National Highway 16, Bhubaneswar, Khordha District, Odisha, India – 751004
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-primary/20 text-xs text-muted-foreground">
              <div>
                <span className="font-bold text-foreground">GPS Coordinates: </span>
                <span className="font-mono">20.3015° N, 85.8458° E</span>
              </div>
              <div>
                <span className="font-bold text-foreground">Campus Land Area: </span>
                <span>350+ Acres (Green Bio-Shield)</span>
              </div>
            </div>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button size="sm" asChild className="gap-1.5 bg-primary text-white text-xs font-bold shadow-xs">
                <a
                  href="https://maps.google.com/?q=Utkal+University+Vani+Vihar+Bhubaneswar"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Navigation className="size-3.5" />
                  <span>Open in Google Maps</span>
                  <ExternalLink className="size-3" />
                </a>
              </Button>
              <Button size="sm" variant="outline" asChild className="gap-1.5 text-xs text-primary border-primary/30">
                <Link to="/college/virtual-tour">
                  <Compass className="size-3.5" />
                  <span>Explore 360° Virtual Tour</span>
                </Link>
              </Button>
            </div>
          </Card>

          {/* Contact Helpline Box */}
          <Card className="p-6 border border-border/70 bg-card space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Phone className="size-4 text-primary" />
                <span>Visitor & Secretariat Helpline</span>
              </h3>
              <div className="text-xs space-y-2 text-muted-foreground">
                <div>
                  <span className="font-bold text-foreground block">Campus Reception:</span>
                  <span>+91 674 2567387 (Extn: 101/102)</span>
                </div>
                <div>
                  <span className="font-bold text-foreground block">Security Control Room:</span>
                  <span>+91 674 2567000 (24x7 Emergency)</span>
                </div>
                <div>
                  <span className="font-bold text-foreground block">Official Registrar Email:</span>
                  <span className="font-mono text-primary">registrar@ourcollege.edu.in</span>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-border/60 text-[11px] text-muted-foreground">
              Visiting hours: Mon – Sat, 10:00 AM – 5:00 PM (Official university working days).
            </div>
          </Card>
        </div>

        {/* Detailed Transit Connectivity Modes */}
        <div className="space-y-6">
          <div className="border-b pb-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Navigation className="size-5 text-primary" />
              Modes of Travel to the University
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Comprehensive route choices from airport, railway stations, interstate bus stands, and city centers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {transitModes.map((mode, i) => {
              const Icon = mode.icon;
              return (
                <Card
                  key={i}
                  className="p-5 border border-border/70 bg-card hover:border-primary/40 transition-all shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className={`size-10 rounded-xl flex items-center justify-center border shrink-0 ${mode.color}`}>
                      <Icon className="size-5" />
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono text-foreground shrink-0">
                      {mode.distance}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-foreground leading-snug">{mode.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-2">{mode.details}</p>
                    <div className="mt-3 p-3 rounded-lg bg-muted/40 border border-border/60 text-xs text-foreground/85">
                      <span className="font-bold text-foreground">Local Transit: </span>
                      {mode.connectivity}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Campus Ingress Gates & Layout */}
        <div className="space-y-6">
          <div className="border-b pb-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Building className="size-5 text-primary" />
              Campus Entry Gates & Zoning
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Navigate to the correct gate based on whether you are visiting administrative offices, laboratories, or hostels.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {campusGates.map((gate, idx) => (
              <Card key={idx} className="p-4 border border-border/70 bg-card space-y-2">
                <Badge variant="secondary" className="text-[10px] font-mono">
                  {gate.facing}
                </Badge>
                <h4 className="font-bold text-sm text-foreground">{gate.gate}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{gate.access}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Visitor Guidelines & Safety Strip */}
        <div className="p-6 rounded-2xl bg-muted/40 border border-border/70 space-y-3">
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            Visitor Guidelines & Parking Regulations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
            <div>
              <span className="font-bold text-foreground block">Visitor Entry Pass:</span>
              <span>All external visitors and vehicles must register at Gate 1 or Gate 2 security booths with a valid government photo ID card (Aadhaar / Voter ID / Driving License).</span>
            </div>
            <div>
              <span className="font-bold text-foreground block">Designated Parking:</span>
              <span>Dedicated car and two-wheeler parking spaces are provided adjacent to the Central Library and Administrative Quadrangle. Campus speed limit is 25 km/h.</span>
            </div>
            <div>
              <span className="font-bold text-foreground block">Green Campus Transport:</span>
              <span>Battery-operated eco-shuttles run continuously between Gate 1, Parija Library, PG Departments, and Hostels for senior citizens and differently-abled visitors.</span>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
