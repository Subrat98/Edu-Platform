import { Hero } from "@/components/sections/Hero";
import { RichText } from "@/components/sections/RichText";
import { AccreditationStrip } from "@/components/sections/AccreditationStrip";
import { FacultyGrid } from "@/components/sections/FacultyGrid";
import { Downloads } from "@/components/sections/Downloads";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { collegeHeroUrl } from "@/mocks/data/images";
import { accreditationBadges } from "@/mocks/data/accreditation";

export default function CollegeIQAC() {
  return (
    <>
      <Hero variant="compact" title="IQAC, NAAC & NIRF" imageUrl={collegeHeroUrl(1)} />
      <Breadcrumbs items={[{ label: "Home", href: "/college" }, { label: "IQAC / NAAC / NIRF" }]} />

      <AccreditationStrip items={accreditationBadges} tone="surface" />

      <RichText
        eyebrow="Internal Quality Assurance Cell"
        title="Driving continuous quality improvement"
        paragraphs={[
          "The IQAC coordinates quality-related activities across the college, including curriculum review, teaching-learning evaluation, feedback analysis and preparation of the Annual Quality Assurance Report (AQAR).",
          "The cell works closely with departments to institutionalize best practices and prepare the college for periodic NAAC accreditation cycles and NIRF data submission.",
        ]}
      />

      <FacultyGrid
        eyebrow="Committee"
        title="IQAC Composition"
        institutionId="college"
        items={[
          { name: "Dr. Himansu Sekhar Das", role: "Chairperson (Principal)" },
          { name: "Dr. Snigdha Mohanty", role: "IQAC Coordinator" },
          { name: "Prof. Satyabrata Dash", role: "Member, Administration" },
          { name: "Dr. Rashmita Mishra", role: "Member, Academics" },
        ]}
      />

      <Downloads institutionId="college" title="AQAR, SSR & Committee Documents" category="IQAC" />
    </>
  );
}
