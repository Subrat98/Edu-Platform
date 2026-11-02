import { Hero } from "@/components/sections/Hero";
import { FacultyGrid } from "@/components/sections/FacultyGrid";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { collegeHeroUrl } from "@/mocks/data/images";

export default function CollegeFacultyStaff() {
  return (
    <>
      <Hero variant="compact" title="Faculty & Staff" imageUrl={collegeHeroUrl(1)} />
      <Breadcrumbs items={[{ label: "Home", href: "/college" }, { label: "Faculty & Staff" }]} />
      <FacultyGrid
        eyebrow="Our people"
        title="Meet our faculty"
        description="180+ faculty members across eight departments, including Ph.D. holders and active researchers."
        institutionId="college"
        showDepartmentFilter
      />
    </>
  );
}
