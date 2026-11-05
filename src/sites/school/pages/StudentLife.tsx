import { Hero } from "@/components/sections/Hero";
import { DepartmentCards } from "@/components/sections/DepartmentCards";
import { EventCards } from "@/components/sections/EventCards";
import { Gallery } from "@/components/sections/Gallery";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { schoolHeroUrl } from "@/mocks/data/images";

export default function SchoolStudentLife() {
  return (
    <>
      <Hero variant="compact" title="Student Life" imageUrl={schoolHeroUrl(2)} />
      <Breadcrumbs items={[{ label: "Home", href: "/school" }, { label: "Student Life" }]} />

      <DepartmentCards
        eyebrow="Beyond the classroom"
        title="Houses, Clubs & Activities"
        items={[
          { title: "Four School Houses", meta: "Aravali · Nilgiri · Shivalik · Vindhya", description: "Inter-house competitions in sports, debate, quiz and cultural events throughout the year.", icon: "people" },
          { title: "Eco Club", description: "Campus gardening, waste segregation drives and environmental awareness campaigns.", icon: "science" },
          { title: "NCC & Scouts", description: "Discipline, leadership and community service training for Classes VIII and above.", icon: "safety" },
          { title: "Art & Craft Club", description: "Weekly sessions culminating in the annual Founders' Day exhibition.", icon: "building" },
          { title: "Sports Teams", description: "Athletics, football, kabaddi and badminton teams that compete at district level.", icon: "sports" },
          { title: "Student Council", description: "Elected student representatives who voice peer concerns and help organize events.", icon: "people" },
        ]}
      />

      <EventCards institutionId="school" title="Student Life Events" viewAllHref="/school/events" />
      <Gallery institutionId="school" title="Student Life Gallery" albumLimit={2} imagesPerAlbumLimit={4} />
    </>
  );
}
