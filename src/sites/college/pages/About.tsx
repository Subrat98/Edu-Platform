import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { RichText } from "@/components/sections/RichText";
import { FacultyGrid } from "@/components/sections/FacultyGrid";
import { AccreditationStrip } from "@/components/sections/AccreditationStrip";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { collegeHeroUrl } from "@/mocks/data/images";
import { institutions } from "@/mocks/data/institutions";
import { accreditationBadges } from "@/mocks/data/accreditation";

export default function CollegeAbout() {
  const institution = institutions.college;

  return (
    <>
      <Hero variant="compact" title="About Our College" imageUrl={collegeHeroUrl(3)} />
      <Breadcrumbs items={[{ label: "Home", href: "/college" }, { label: "About" }]} />

      <RichText
        eyebrow="Our story"
        title="History, Vision & Mission"
        paragraphs={[
          `Established in ${institution.establishedYear}, Our College has grown from a small degree college into a multi-disciplinary institution offering undergraduate and postgraduate programmes across Science, Commerce and Arts to over 4,200 students.`,
          "Our vision is to be a centre of academic excellence and research in Odisha, producing graduates who combine strong subject knowledge with critical thinking and civic responsibility.",
          "Our mission is to provide accessible, high-quality higher education, support active faculty research, and prepare students for both further study and meaningful careers.",
        ]}
      />

      <Stats tone="primary" items={institution.stats} />
      <AccreditationStrip items={accreditationBadges} tone="surface" />

      <FacultyGrid
        eyebrow="Leadership"
        title="Principal's Message"
        institutionId="college"
        items={[
          {
            name: "Dr. Himansu Sekhar Das",
            role: "Principal",
            bio: "“Our goal is to combine rigorous academics with research opportunities, so every student graduates ready to lead.”",
          },
        ]}
      />

      <RichText
        tone="background"
        eyebrow="Governance"
        title="Governing Body & Affiliation"
        paragraphs={[
          `${institution.name} is ${institution.affiliation} and is governed by a Governing Body comprising academic, administrative and community representatives who oversee institutional policy and development.`,
          "The college campus includes dedicated departmental blocks, a central library, science laboratories, a computer centre, an auditorium and sports facilities across its grounds in Khandapara.",
        ]}
      />
    </>
  );
}
