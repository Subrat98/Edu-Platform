import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Plane,
  Train,
  Bus,
  Car,
  Compass,
  Video,
  Building2,
  BookOpen,
  Award,
  ExternalLink,
  Navigation,
} from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { collegeHeroUrl } from "@/mocks/data/images";

export default function CollegeVirtualTour() {
  const [selectedSpot, setSelectedSpot] = useState(0);

  const landmarks = [
    {
      title: "Heritage Red-Brick Quadrangle",
      category: "Historic Architecture",
      desc: "Built in 1868 with iconic colonial Gothic arches, red-brick colonnades, and lush courtyards that form the soul of the university campus.",
      image: collegeHeroUrl(1),
    },
    {
      title: "Parija Central Library & Manuscript Archive",
      category: "Academic Resource",
      desc: "Named after eminent botanist Dr. P. K. Parija, housing over 250,000 catalogued volumes, rare palm-leaf manuscripts, and modern RFID-enabled reading rooms.",
      image: collegeHeroUrl(2),
    },
    {
      title: "Central Instrumentation Facility (CIF)",
      category: "Research Core",
      desc: "Advanced multi-crore research center housing XRD, FE-SEM, UV-Vis Spectrophotometers, and materials characterization workstations.",
      image: collegeHeroUrl(3),
    },
    {
      title: "Kanika Convocation Hall & Auditorium",
      category: "Cultural Venue",
      desc: "Acoustically treated 1,500-seat historic auditorium hosting annual convocations, national symposia, and cultural summits.",
      image: collegeHeroUrl(4),
    },
  ];

  return (
    <>
      <Hero variant="compact" title="Campus Tour & Location" imageUrl={collegeHeroUrl(4)} />
      <Breadcrumbs items={[{ label: "Home", href: "/college" }, { label: "Virtual Tour & How to Reach" }]} />

      <Container className="py-10 space-y-10">
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                360° Virtual Campus Experience
              </Badge>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs">
                Heritage & Smart Campus
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground">
              Explore Our Campus & "How to Reach" Guide
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl">
              Discover university landmarks, central research laboratories, residential facilities, and detailed transport connectivity across Odisha.
            </p>
          </div>
        </div>

        {/* 360° Interactive Landmark Viewer */}
        <div className="space-y-4">
          <div className="border-b pb-2 flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Compass className="size-4 text-primary" />
              Interactive Campus Landmark Showcase
            </h3>
            <span className="text-xs text-muted-foreground">Select a spot to preview</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 relative rounded-2xl overflow-hidden aspect-video border border-border/70 shadow-lg bg-black">
              <img
                src={landmarks[selectedSpot].image}
                alt={landmarks[selectedSpot].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-6 text-white space-y-1">
                <Badge className="w-fit bg-amber-400 text-slate-950 font-bold text-[10px]">
                  {landmarks[selectedSpot].category}
                </Badge>
                <h4 className="text-lg sm:text-xl font-bold">{landmarks[selectedSpot].title}</h4>
                <p className="text-xs text-slate-200 max-w-xl leading-relaxed">
                  {landmarks[selectedSpot].desc}
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {landmarks.map((spot, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedSpot(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center gap-3 ${
                    selectedSpot === idx
                      ? "border-primary bg-primary/10 shadow-xs"
                      : "border-border/60 bg-card hover:bg-muted/40"
                  }`}
                >
                  <div className="size-12 rounded-lg overflow-hidden shrink-0">
                    <img src={spot.image} alt={spot.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-foreground truncate">{spot.title}</div>
                    <div className="text-[10px] text-muted-foreground">{spot.category}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* How to Reach Guide */}
        <div className="space-y-4 pt-4">
          <div className="border-b pb-2">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Navigation className="size-4 text-primary" />
              How to Reach Our College
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Well connected via international airport, major railway junctions, and national highways.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border border-border/60 bg-card p-4 space-y-2">
              <div className="size-9 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Plane className="size-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">By Air</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Biju Patnaik International Airport (BBI), Bhubaneswar is located just 6 km from the Vani Vihar campus with direct domestic and international flights.
              </p>
            </Card>

            <Card className="border border-border/60 bg-card p-4 space-y-2">
              <div className="size-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Train className="size-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">By Rail</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Bhubaneswar Railway Station (BBS) & Cuttack Junction (CTC) are on the main Howrah-Chennai corridor, with taxis and auto-rickshaws available 24x7.
              </p>
            </Card>

            <Card className="border border-border/60 bg-card p-4 space-y-2">
              <div className="size-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Bus className="size-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">By Road / Bus</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Situated right alongside National Highway 16 (NH-16). Regular Mo Bus routes and OSRTC state transport buses stop at the university gate.
              </p>
            </Card>

            <Card className="border border-border/60 bg-card p-4 space-y-2">
              <div className="size-9 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <MapPin className="size-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">Campus Navigation</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Spanning 300+ lush acres. Barrier-free ramps, battery-operated e-shuttles, and digital signboards guide visitors to faculties and hostels.
              </p>
            </Card>
          </div>
        </div>
      </Container>
    </>
  );
}
