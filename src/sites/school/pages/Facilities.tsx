import { Hero } from "@/components/sections/Hero";
import { DepartmentCards } from "@/components/sections/DepartmentCards";
import { RichText } from "@/components/sections/RichText";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { schoolHeroUrl } from "@/mocks/data/images";

export default function SchoolFacilities() {
  return (
    <>
      <Hero variant="compact" title="Campus Facilities" imageUrl={schoolHeroUrl(1)} />
      <Breadcrumbs items={[{ label: "Home", href: "/school" }, { label: "Facilities" }]} />

      <DepartmentCards
        eyebrow="Our campus"
        title="Facilities built for learning"
        items={[
          { title: "Smart Classrooms", description: "Digital boards and projector-equipped classrooms from Class III onward.", icon: "building" },
          { title: "Science Laboratories", description: "Dedicated Physics, Chemistry and Biology labs for Senior Secondary students.", icon: "science" },
          { title: "Computer Lab", description: "40-seat computer lab with internet access for Classes VI and above.", icon: "computer" },
          { title: "Library", description: "12,000+ volumes, a quiet reading room and a weekly reading-club programme.", icon: "library", href: "/school/library" },
          { title: "Sports Ground", description: "A full-size playground with a running track, basketball and volleyball courts.", icon: "sports" },
          { title: "Transport", description: "GPS-tracked buses covering major routes across Khandapara and nearby villages.", icon: "transport" },
          { title: "Canteen", description: "A hygienic, nutritionist-reviewed canteen menu for staff and students.", icon: "canteen" },
          { title: "Medical Room & Safety", description: "A full-time nurse, CCTV-monitored campus and a trained security team.", icon: "medical" },
        ]}
      />

      <RichText
        tone="background"
        title="Safety first"
        paragraphs={[
          "The entire campus is covered by CCTV monitoring, with controlled entry points and visitor sign-in at the front gate. All staff undergo periodic child-safety training, and the school maintains a dedicated Child Safety Policy — see our Policy pages for details.",
        ]}
      />
    </>
  );
}
