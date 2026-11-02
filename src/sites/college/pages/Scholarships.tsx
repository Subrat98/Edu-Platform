import { Hero } from "@/components/sections/Hero";
import { DepartmentCards } from "@/components/sections/DepartmentCards";
import { Downloads } from "@/components/sections/Downloads";
import { RichText } from "@/components/sections/RichText";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { collegeHeroUrl } from "@/mocks/data/images";

export default function CollegeScholarships() {
  return (
    <>
      <Hero variant="compact" title="Scholarships & Student Welfare" imageUrl={collegeHeroUrl(1)} />
      <Breadcrumbs items={[{ label: "Home", href: "/college" }, { label: "Scholarships" }]} />

      <DepartmentCards
        eyebrow="Support services"
        title="Scholarships & Welfare Cells"
        items={[
          { title: "State Merit Scholarship", description: "For students scoring above 85% in the qualifying examination.", icon: "academics" },
          { title: "SC/ST Welfare Cell", description: "Scholarship guidance and grievance support for SC/ST students.", icon: "people" },
          { title: "Women's Cell", description: "Counselling, safety awareness and grievance redressal for women students.", icon: "safety" },
          { title: "Anti-Ragging Cell", description: "Zero-tolerance policy with a dedicated reporting and response mechanism.", icon: "safety" },
          { title: "Grievance Redressal", description: "A formal channel for academic and administrative grievances.", icon: "people" },
          { title: "Counselling Services", description: "Confidential academic and personal counselling support for all students.", icon: "people" },
        ]}
      />

      <RichText
        tone="background"
        title="Government scholarship schemes"
        paragraphs={[
          "Eligible students can also apply for Odisha state government scholarship schemes and central government schemes through the National Scholarship Portal. The college's scholarship cell assists with documentation and verification.",
        ]}
      />

      <Downloads institutionId="college" title="Scholarship Forms" category="Scholarships" />
    </>
  );
}
