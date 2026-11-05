import { useQuery } from "@tanstack/react-query";
import { Hero } from "@/components/sections/Hero";
import { ProgrammeCards } from "@/components/sections/ProgrammeCards";
import { RichText } from "@/components/sections/RichText";
import { Downloads } from "@/components/sections/Downloads";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { schoolHeroUrl } from "@/mocks/data/images";
import { academicService } from "@/features/academics/academicService";
import { queryKeys } from "@/lib/queryKeys";

export default function SchoolAcademics() {
  const { data: classes, isLoading } = useQuery({
    queryKey: queryKeys.classes(),
    queryFn: academicService.listSchoolClasses,
  });

  return (
    <>
      <Hero variant="compact" title="Academics" imageUrl={schoolHeroUrl(3)} />
      <Breadcrumbs items={[{ label: "Home", href: "/school" }, { label: "Academics" }]} />

      <RichText
        eyebrow="Curriculum"
        title="A CBSE curriculum built stage by stage"
        paragraphs={[
          "From Nursery through Senior Secondary, our curriculum follows the NCERT framework with continuous and comprehensive assessment at every stage. Classroom teaching is supplemented with project work, lab sessions and regular formative assessments.",
          "At the Senior Secondary level, students choose between Science (PCM/PCB), Commerce and Arts/Humanities streams, each supported by dedicated subject teachers and well-equipped laboratories.",
        ]}
      />

      {isLoading || !classes ? (
        <PageLoadingSkeleton />
      ) : (
        <ProgrammeCards
          eyebrow="Structure"
          title="Classes & Streams"
          ctaLabel="See subjects"
          items={classes.map((c) => ({
            title: c.streams ? `${c.name} — ${c.streams.join(" / ")}` : c.name,
            subtitle: c.stage,
            description: c.description,
            href: "/school/faculty-staff",
          }))}
        />
      )}

      <Downloads institutionId="school" title="Syllabus & Academic Calendar" category="Academics" />
    </>
  );
}
