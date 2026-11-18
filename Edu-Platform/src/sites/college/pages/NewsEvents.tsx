import { Hero } from "@/components/sections/Hero";
import { NoticeBoard } from "@/components/sections/NoticeBoard";
import { EventCards } from "@/components/sections/EventCards";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { collegeHeroUrl } from "@/mocks/data/images";

export default function CollegeNewsEvents() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/college" }, { label: "News & Events" }]} />
      <Hero variant="compact" title="News & Events" imageUrl={collegeHeroUrl(2)} />
      <NoticeBoard institutionId="college" showFilter title="All Notices & Circulars" />
      <EventCards institutionId="college" title="Seminars, Workshops & Fests" />
    </>
  );
}
