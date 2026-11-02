import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { FacultyGrid } from "@/components/sections/FacultyGrid";
import { RichText } from "@/components/sections/RichText";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { collegeHeroUrl } from "@/mocks/data/images";
import { collegeStaff } from "@/mocks/data/staff";

export default function CollegeResearch() {
  const researchers = [...collegeStaff]
    .filter((s) => (s.publications ?? 0) > 0)
    .sort((a, b) => (b.publications ?? 0) - (a.publications ?? 0))
    .slice(0, 8);

  return (
    <>
      <Hero variant="compact" title="Research & Publications" imageUrl={collegeHeroUrl(1)} />
      <Breadcrumbs items={[{ label: "Home", href: "/college" }, { label: "Research" }]} />

      <Stats
        items={[
          { label: "Faculty Publications", value: "150+" },
          { label: "Ongoing Projects", value: "12" },
          { label: "Ph.D. Supervisors", value: "9" },
          { label: "Research Centres", value: "3" },
        ]}
      />

      <RichText
        eyebrow="Centres"
        title="Research Centres & Focus Areas"
        paragraphs={[
          "The college hosts research activity in Applied Chemistry, Condensed Matter Physics, Data Science & Machine Learning, and Development Economics, with faculty regularly publishing in peer-reviewed journals and presenting at national seminars.",
          "Postgraduate students in Physics, Chemistry and Computer Science complete a mandatory dissertation component supervised by departmental faculty.",
        ]}
      />

      <FacultyGrid
        eyebrow="Our researchers"
        title="Faculty Publications Leaderboard"
        institutionId="college"
        items={researchers.map((r) => ({
          name: r.name,
          role: r.designation,
          meta: r.department,
          bio: `${r.publications} publications`,
        }))}
      />
    </>
  );
}
