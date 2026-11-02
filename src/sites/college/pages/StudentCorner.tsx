import { Hero } from "@/components/sections/Hero";
import { DepartmentCards } from "@/components/sections/DepartmentCards";
import { EventCards } from "@/components/sections/EventCards";
import { Gallery } from "@/components/sections/Gallery";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { collegeHeroUrl } from "@/mocks/data/images";

export default function CollegeStudentCorner() {
  return (
    <>
      <Hero variant="compact" title="Student Corner" imageUrl={collegeHeroUrl(1)} />
      <Breadcrumbs items={[{ label: "Home", href: "/college" }, { label: "Student Corner" }]} />

      <DepartmentCards
        eyebrow="Get involved"
        title="Clubs, NSS/NCC & Student Council"
        items={[
          { title: "NSS Unit", description: "Community service, blood donation camps and village outreach programmes.", icon: "people" },
          { title: "NCC Wing", description: "Discipline, leadership and national-integration training for enrolled cadets.", icon: "safety" },
          { title: "Literary & Debate Society", description: "Weekly debates, elocution and creative-writing competitions.", icon: "academics" },
          { title: "Cultural Society", description: "Music, dance and drama groups that headline the annual fest, Utsav.", icon: "building" },
          { title: "Sports Council", description: "Inter-department tournaments in cricket, volleyball, kabaddi and athletics.", icon: "sports" },
          { title: "Alumni Association", description: "Mentorship, networking events and annual alumni meet.", icon: "people" },
        ]}
      />

      <EventCards institutionId="college" title="Student Events" viewAllHref="/college/news-events" />
      <Gallery institutionId="college" title="Student Corner Gallery" albumLimit={2} imagesPerAlbumLimit={4} />
    </>
  );
}
