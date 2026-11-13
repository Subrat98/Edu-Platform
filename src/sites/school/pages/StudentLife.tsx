import { Link } from "react-router-dom";
import { Hero } from "@/components/sections/Hero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { schoolHeroUrl } from "@/mocks/data/images";
import {
  Utensils,
  Trophy,
  Users,
  ShieldCheck,
  Heart,
  Sparkles,
  Calendar,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Award,
} from "lucide-react";

export default function SchoolStudentLife() {
  const houses = [
    { name: "Subhash House", color: "border-red-500 bg-red-500/10 text-red-700 dark:text-red-300", motto: "Valour, Patriotism & Action", captain: "Master Debashish Rout (Class XII)" },
    { name: "Gandhi House", color: "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300", motto: "Truth, Humility & Non-Violence", captain: "Miss Priyanka Mohanty (Class XII)" },
    { name: "Tagore House", color: "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300", motto: "Creativity, Literature & Arts", captain: "Master Sourav Panda (Class XII)" },
    { name: "Raman House", color: "border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300", motto: "Scientific Inquiry & Innovation", captain: "Miss Archana Jena (Class XII)" },
  ];

  const clubs = [
    { title: "Atal Tinkering Club (ATL)", desc: "Robotics, 3D printing, electronics prototyping, and app development under NITI Aayog ATL.", icon: Sparkles },
    { title: "Junior Red Cross (JRC)", desc: "First-aid training, health camps, blood donation awareness, and community service drives.", icon: Heart },
    { title: "Bharat Scouts & Guides", desc: "Outdoor adventure camps, survival skills, knots, pioneering, and civic discipline for Classes VI–X.", icon: ShieldCheck },
    { title: "Eco & Green Club", desc: "Herbal garden maintenance, plastic-free campus campaigns, composting, and tree plantation drives.", icon: BookOpen },
    { title: "Literary & Debate Club", desc: "English and Odia elocution, creative writing, extempore, and inter-school model parliaments.", icon: Award },
    { title: "Heritage & Art Club", desc: "Pattachitra painting, terracotta crafts, classical dance, and conservation of Odisha heritage.", icon: Users },
  ];

  return (
    <>
      <Hero
        variant="compact"
        title="Student Life & Co-Curriculars"
        subtitle="PM-POSHAN Nutrition, Four Houses, Scouts & Guides, Sports & Child Wellness"
        imageUrl={schoolHeroUrl(2)}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/school" }, { label: "Student Life" }]} />

      <Container className="py-10 space-y-12">
        {/* PM-POSHAN Mid-Day Meal Feature Card */}
        <div id="pm-poshan" className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/15 via-background to-emerald-500/10 border-2 border-amber-500/40 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-amber-600 text-white font-bold text-xs uppercase px-2 py-0.5">
                  PM-POSHAN Scheme
                </Badge>
                <span className="text-xs font-bold text-amber-950 dark:text-amber-200">School & Mass Education Dept, Odisha</span>
              </div>
              <h2 className="text-xl font-black text-foreground flex items-center gap-2">
                <Utensils className="size-5 text-amber-600" />
                <span>Nutritious Mid-Day Meal Programme</span>
              </h2>
            </div>
            <Badge variant="outline" className="text-xs font-semibold">100% Hygienic Steam Kitchen</Badge>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
            In accordance with the National PM-POSHAN guidelines, Our School operates a dedicated modern kitchen providing hot, fresh, fortified, and protein-rich lunches to enrolled students every school day.
          </p>

          <div className="border rounded-xl overflow-hidden bg-card shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/80 text-foreground font-bold border-b">
                <tr>
                  <th className="p-3 w-28">Day</th>
                  <th className="p-3">Nutritious Daily Menu</th>
                  <th className="p-3 text-right">Caloric Energy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-muted/30">
                  <td className="p-3 font-bold text-primary">Monday</td>
                  <td className="p-3">Steamed Rice, Odia Dalma (Toor dal with Pumpkin, Raw Banana & Veggies), Boiled Egg / Apple</td>
                  <td className="p-3 text-right font-mono">580 kcal</td>
                </tr>
                <tr className="hover:bg-muted/30">
                  <td className="p-3 font-bold text-primary">Tuesday</td>
                  <td className="p-3">Rice, Soyabean & Potato Curry, Cucumber Salad</td>
                  <td className="p-3 text-right font-mono">550 kcal</td>
                </tr>
                <tr className="hover:bg-muted/30">
                  <td className="p-3 font-bold text-primary">Wednesday</td>
                  <td className="p-3">Steamed Rice, Mixed Vegetable Sambar, Boiled Egg / Seasonal Banana</td>
                  <td className="p-3 text-right font-mono">590 kcal</td>
                </tr>
                <tr className="hover:bg-muted/30">
                  <td className="p-3 font-bold text-primary">Thursday</td>
                  <td className="p-3">Nutrient-Rich Khichdi with Spinach, Roasted Papad, Tomato Sweet Chutney</td>
                  <td className="p-3 text-right font-mono">540 kcal</td>
                </tr>
                <tr className="hover:bg-muted/30">
                  <td className="p-3 font-bold text-primary">Friday</td>
                  <td className="p-3">Steamed Rice, Chana Dal with Bottle Gourd, Boiled Egg / Curd</td>
                  <td className="p-3 text-right font-mono">580 kcal</td>
                </tr>
                <tr className="hover:bg-muted/30">
                  <td className="p-3 font-bold text-primary">Saturday</td>
                  <td className="p-3">Vegetable Pulao, Potato Green Pea Curry, Roasted Gram snack</td>
                  <td className="p-3 text-right font-mono">520 kcal</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Four School Houses System */}
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Trophy className="size-5 text-primary" />
              <span>Four School Houses — Leadership & Fellowship</span>
            </h2>
            <p className="text-xs text-muted-foreground">Every student is assigned to a house to foster healthy sportsmanship, peer loyalty, and competitive spirit.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {houses.map((h) => (
              <Card key={h.name} className={`border-2 p-5 space-y-2 rounded-2xl ${h.color} shadow-xs`}>
                <h3 className="font-black text-base">{h.name}</h3>
                <div className="text-xs font-semibold">{h.motto}</div>
                <div className="text-[11px] pt-2 border-t border-current/20 opacity-90">
                  Captain: {h.captain}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Co-Curricular Clubs Grid */}
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h2 className="text-lg font-bold text-foreground">Co-Curricular Clubs & Activities</h2>
            <p className="text-xs text-muted-foreground">Every Saturday afternoon is dedicated to hands-on club projects, scouting, and social service.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {clubs.map((c) => {
              const Icon = c.icon;
              return (
                <Card key={c.title} className="border border-border/70 p-5 space-y-2 bg-card shadow-2xs hover:border-primary transition-all">
                  <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="font-bold text-sm text-foreground pt-1">{c.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Mental Health, Guidance & Child Safety */}
        <div id="safety" className="p-6 rounded-2xl border bg-card space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <Heart className="size-5 text-rose-600" />
            <h3 className="text-base font-bold text-foreground">Child Counselling & Emotional Wellbeing</h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
            Under the supervision of our qualified School Counsellor, <strong>Dr. Arpita Pattnaik (M.A. Clinical Psychology)</strong>, Our School provides confidential one-on-one counselling, exam stress management workshops, and peer mentoring. The school enforces strict POCSO compliance with regular sensitisation sessions for staff, students, and bus crew.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 font-bold">
              National Childline: 1098
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary font-bold">
              Counsellor Desk: counsellor@ourschool.edu.in
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold">
              POCSO Committee In-charge: 06757-223456
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
