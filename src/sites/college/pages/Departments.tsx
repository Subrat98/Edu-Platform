import { useQuery } from "@tanstack/react-query";
import { Hero } from "@/components/sections/Hero";
import { DepartmentCards } from "@/components/sections/DepartmentCards";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { collegeHeroUrl } from "@/mocks/data/images";
import { academicService } from "@/features/academics/academicService";
import { queryKeys } from "@/lib/queryKeys";

export default function CollegeDepartments() {
  const { data, isLoading } = useQuery({ queryKey: queryKeys.departments(), queryFn: academicService.listDepartments });

  return (
    <>
      <Hero variant="compact" title="Departments" imageUrl={collegeHeroUrl(1)} />
      <Breadcrumbs items={[{ label: "Home", href: "/college" }, { label: "Departments" }]} />
      {isLoading || !data ? (
        <PageLoadingSkeleton />
      ) : (
        <DepartmentCards
          eyebrow="Academics"
          title="Eight departments, one campus"
          description="Each department runs its own faculty, laboratories and student societies under a Head of Department."
          items={data.map((d) => ({
            title: d.name,
            meta: `HOD: ${d.hod} · Est. ${d.establishedYear}`,
            description: d.description,
            href: `/college/departments/${d.slug}`,
            icon: "building" as const,
          }))}
        />
      )}
    </>
  );
}
