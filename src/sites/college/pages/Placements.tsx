import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { AccreditationStrip } from "@/components/sections/AccreditationStrip";
import { Testimonials } from "@/components/sections/Testimonials";
import { RichText } from "@/components/sections/RichText";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { collegeHeroUrl } from "@/mocks/data/images";

const recruiters = [
  { id: "r1", label: "TCS", sublabel: "IT Services", logoUrl: "" },
  { id: "r2", label: "Infosys BPM", sublabel: "Business Process", logoUrl: "" },
  { id: "r3", label: "Axis Bank", sublabel: "Banking", logoUrl: "" },
  { id: "r4", label: "Byju's", sublabel: "EdTech", logoUrl: "" },
  { id: "r5", label: "State Bank of India", sublabel: "Banking", logoUrl: "" },
];

export default function CollegePlacements() {
  return (
    <>
      <Hero variant="compact" title="Placements & Career Cell" imageUrl={collegeHeroUrl(1)} />
      <Breadcrumbs items={[{ label: "Home", href: "/college" }, { label: "Placements" }]} />

      <Stats
        items={[
          { label: "Students Placed (2026)", value: "320+" },
          { label: "Average Package", value: "₹3.8 LPA" },
          { label: "Highest Package", value: "₹9.5 LPA" },
          { label: "Recruiting Companies", value: "28" },
        ]}
      />

      <AccreditationStrip items={recruiters} tone="surface" />

      <RichText
        eyebrow="Career Cell"
        title="Training, internships & career guidance"
        paragraphs={[
          "The Placement & Career Cell runs year-round employability-skills workshops covering resume building, group discussions and mock interviews, alongside internship tie-ups with regional employers.",
          "Final-year students register for campus drives directly through the cell; recruiters visit for both on-campus and virtual interview rounds.",
        ]}
      />

      <Testimonials institutionId="college" title="Alumni success stories" />
    </>
  );
}
