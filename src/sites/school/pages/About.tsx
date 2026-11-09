import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { RichText } from "@/components/sections/RichText";
import { FacultyGrid } from "@/components/sections/FacultyGrid";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { schoolHeroUrl } from "@/mocks/data/images";
import { institutions } from "@/mocks/data/institutions";

export default function SchoolAbout() {
  const institution = institutions.school;

  return (
    <>
      <Hero variant="compact" title="About Our School" imageUrl={schoolHeroUrl(1)} />
      <Breadcrumbs items={[{ label: "Home", href: "/school" }, { label: "About Us" }]} />

      <RichText
        eyebrow="Our story"
        title="History, Vision & Mission"
        paragraphs={[
          `Founded in ${institution.establishedYear}, Our School began as a small neighbourhood school in Khandapara with a handful of classrooms and a determination to make quality education accessible to every family in the region. Over nearly three decades, it has grown into a full Nursery-to-Grade-12 CBSE institution trusted by generations of local families.`,
          "Our vision is to nurture confident, curious and compassionate learners who are ready for the challenges of higher education and life beyond the classroom.",
          "Our mission is to combine strong academic fundamentals with activity-based learning, individual attention and a safe, values-driven campus environment — so that every child, regardless of background, has the opportunity to shine.",
        ]}
        columns={1}
      />

      <Stats tone="primary" items={institution.stats} />

      <FacultyGrid
        eyebrow="Leadership"
        title="Principal & Vice Principal's Message"
        institutionId="school"
        items={[
          {
            name: "Dr. Bimal Patra",
            role: "Principal",
            bio: "“We believe every child learns differently, and our job is to meet them where they are — academically, socially and emotionally.”",
          },
          {
            name: "Mrs. Lipika Sahoo",
            role: "Vice Principal",
            bio: "“Our Primary and Middle school programmes are built around curiosity-led, activity-based learning.”",
          },
        ]}
      />

      <RichText
        eyebrow="Affiliation"
        title="Recognition & Affiliation"
        tone="background"
        paragraphs={[
          `${institution.name} is affiliated with the Central Board of Secondary Education (${institution.affiliation}) and follows the NCERT curriculum framework across all stages.`,
          "The school campus spans 3.5 acres and includes dedicated blocks for Primary, Middle and Senior Secondary wings, along with science and computer laboratories, a library, an auditorium and sports facilities.",
        ]}
      />
    </>
  );
}
