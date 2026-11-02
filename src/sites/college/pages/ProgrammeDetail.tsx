import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, IndianRupee, Users } from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { RichText } from "@/components/sections/RichText";
import { FacultyGrid } from "@/components/sections/FacultyGrid";
import { Downloads } from "@/components/sections/Downloads";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { collegeHeroUrl } from "@/mocks/data/images";
import { academicService } from "@/features/academics/academicService";
import { queryKeys } from "@/lib/queryKeys";
import { departments } from "@/mocks/data/departments";
import { collegeStaff } from "@/mocks/data/staff";

export default function CollegeProgrammeDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: programme, isLoading } = useQuery({
    queryKey: queryKeys.programme(slug ?? ""),
    queryFn: () => academicService.getProgramme(slug!),
    enabled: !!slug,
  });

  if (isLoading) return <PageLoadingSkeleton />;

  if (!programme) {
    return (
      <Container className="py-16">
        <EmptyState title="Programme not found" description="This programme page doesn't exist." />
      </Container>
    );
  }

  const department = departments.find((d) => d.id === programme.departmentId);
  const deptFaculty = collegeStaff.filter((s) => s.departmentId === programme.departmentId).slice(0, 4);

  return (
    <>
      <Hero variant="compact" title={programme.name} imageUrl={collegeHeroUrl(1)} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/college" },
          { label: "Programmes & Courses", href: "/college/programmes" },
          { label: programme.name },
        ]}
      />

      <Container className="py-10">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="border-border bg-surface rounded-xl border p-4 text-center">
            <Clock className="text-accent mx-auto size-5" />
            <p className="mt-2 text-sm font-semibold">{programme.durationYears} years</p>
            <p className="text-muted-foreground text-xs">Duration</p>
          </div>
          <div className="border-border bg-surface rounded-xl border p-4 text-center">
            <Users className="text-accent mx-auto size-5" />
            <p className="mt-2 text-sm font-semibold">{programme.seats}</p>
            <p className="text-muted-foreground text-xs">Seats</p>
          </div>
          <div className="border-border bg-surface rounded-xl border p-4 text-center">
            <IndianRupee className="text-accent mx-auto size-5" />
            <p className="mt-2 text-sm font-semibold">₹{programme.feePerYear.toLocaleString("en-IN")}</p>
            <p className="text-muted-foreground text-xs">Per year</p>
          </div>
          <div className="border-border bg-surface rounded-xl border p-4 text-center">
            <CheckCircle2 className="text-accent mx-auto size-5" />
            <p className="mt-2 text-sm font-semibold">{programme.level}</p>
            <p className="text-muted-foreground text-xs">Level</p>
          </div>
        </div>
        <div className="mt-6">
          <Button asChild size="lg" className="bg-highlight text-highlight-foreground hover:bg-highlight/90">
            <Link to="/college/admissions">Apply for this programme</Link>
          </Button>
        </div>
      </Container>

      <RichText
        eyebrow={department?.name}
        title="About this programme"
        paragraphs={[programme.description, `Eligibility: ${programme.eligibility}.`]}
      />

      {deptFaculty.length > 0 ? (
        <FacultyGrid
          eyebrow="Taught by"
          title={`${department?.name} Faculty`}
          institutionId="college"
          items={deptFaculty.map((f) => ({ name: f.name, role: f.designation, meta: f.qualification }))}
        />
      ) : null}

      <Downloads institutionId="college" title="Syllabus & Semester Structure" category="Academics" />
    </>
  );
}
