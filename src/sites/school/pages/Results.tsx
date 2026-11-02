import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { FacultyGrid } from "@/components/sections/FacultyGrid";
import { Testimonials } from "@/components/sections/Testimonials";
import { RichText } from "@/components/sections/RichText";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { schoolHeroUrl } from "@/mocks/data/images";

const toppers = [
  { name: "Aditi Mohapatra", role: "Class X · 98.2%", meta: "CBSE Board 2026" },
  { name: "Rakesh Prusty", role: "Class XII Science · 97.6%", meta: "CBSE Board 2026" },
  { name: "Swagatika Behera", role: "Class XII Commerce · 96.8%", meta: "CBSE Board 2026" },
  { name: "Manas Ranjan Giri", role: "Class X · 97.4%", meta: "CBSE Board 2026" },
];

export default function SchoolResults() {
  return (
    <>
      <Hero variant="compact" title="Results & Toppers" imageUrl={schoolHeroUrl(1)} />
      <Breadcrumbs items={[{ label: "Home", href: "/school" }, { label: "Results & Toppers" }]} />

      <Stats
        items={[
          { label: "Class X Pass %", value: "100%" },
          { label: "Class XII Pass %", value: "98%" },
          { label: "Students scoring 90%+", value: "62" },
          { label: "Board Session", value: "2025–26" },
        ]}
      />

      <FacultyGrid eyebrow="Celebrating excellence" title="Board Toppers 2025–26" institutionId="school" items={toppers} />

      <RichText
        tone="background"
        title="Published results"
        paragraphs={[
          "Individual mark sheets and detailed subject-wise results are available through the Student and Parent Portal login for privacy. The figures above reflect aggregate, publicly shareable board results.",
        ]}
      />

      <Testimonials institutionId="school" title="Families on our academic outcomes" />
    </>
  );
}
