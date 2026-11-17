import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Hero } from "@/components/sections/Hero";
import { RichText } from "@/components/sections/RichText";
import { FacultyGrid } from "@/components/sections/FacultyGrid";
import { ProgrammeCards } from "@/components/sections/ProgrammeCards";
import { Downloads } from "@/components/sections/Downloads";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { Container } from "@/components/common/Container";
import { collegeHeroUrl } from "@/mocks/data/images";
import { academicService } from "@/features/academics/academicService";
import { queryKeys } from "@/lib/queryKeys";
import { collegeStaff } from "@/mocks/data/staff";
import { programmes } from "@/mocks/data/programmes";

export default function CollegeDepartmentDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: department, isLoading } = useQuery({
    queryKey: queryKeys.department(slug ?? ""),
    queryFn: () => academicService.getDepartment(slug!),
    enabled: !!slug,
  });

  if (isLoading) return <PageLoadingSkeleton />;

  if (!department) {
    return (
      <Container className="py-16">
        <EmptyState title="Department not found" description="This department page doesn't exist." />
      </Container>
    );
  }

  const deptFaculty = collegeStaff.filter((s) => s.departmentId === department.id);
  const deptProgrammes = programmes.filter((p) => p.departmentId === department.id);

  return (
    <>
      <Hero variant="compact" title={department.name} imageUrl={collegeHeroUrl(1)} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/college" },
          { label: "Departments", href: "/college/departments" },
          { label: department.name },
        ]}
      />

      <RichText
        eyebrow={`Established ${department.establishedYear}`}
        title="Department Overview"
        paragraphs={[department.description, `${department.facultyCount} faculty members and ${department.labCount} dedicated laboratories support teaching and research in this department.`]}
      />

      <FacultyGrid
        eyebrow="HOD's message"
        title={`Head of Department: ${department.hod}`}
        institutionId="college"
        items={[{ name: department.hod, role: "Head of Department", bio: `Leads ${department.name} with a focus on academic rigour and student-centred mentorship.` }]}
      />

      {deptFaculty.length > 0 ? (
        <FacultyGrid
          eyebrow="Our team"
          title="Department Faculty"
          institutionId="college"
          items={deptFaculty.map((f) => ({ name: f.name, role: f.designation, meta: f.qualification, bio: f.bio }))}
        />
      ) : null}

      {deptProgrammes.length > 0 ? (
        <ProgrammeCards
          eyebrow="Programmes offered"
          title={`Programmes in ${department.name}`}
          items={deptProgrammes.map((p) => ({
            title: p.name,
            subtitle: `${p.level} · ${p.durationYears} years`,
            description: p.description,
            href: `/college/programmes/${p.slug}`,
          }))}
        />
      ) : null}

      <Downloads institutionId="college" title="Department Notices & Syllabus" category="Academics" />
    </>
  );
}
