import { Hero } from "@/components/sections/Hero";
import { FacultyGrid } from "@/components/sections/FacultyGrid";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { schoolHeroUrl } from "@/mocks/data/images";

export default function SchoolFacultyStaff() {
  return (
    <>
      <Hero variant="compact" title="Faculty & Staff" imageUrl={schoolHeroUrl(1)} />
      <Breadcrumbs items={[{ label: "Home", href: "/school" }, { label: "Faculty & Staff" }]} />
      <FacultyGrid
        eyebrow="Our people"
        title="Meet our teachers & staff"
        description="65+ qualified, experienced educators across every stage from Pre-Primary to Senior Secondary."
        institutionId="school"
        showDepartmentFilter
      />
    </>
  );
}
