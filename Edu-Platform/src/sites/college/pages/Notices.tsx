import { Hero } from "@/components/sections/Hero";
import { NoticeBoard } from "@/components/sections/NoticeBoard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { collegeHeroUrl } from "@/mocks/data/images";

export default function CollegeNotices() {
  return (
    <>
      <Hero variant="compact" title="Notices & Circulars" imageUrl={collegeHeroUrl(2)} />
      <Breadcrumbs items={[{ label: "Home", href: "/college" }, { label: "Notices & Circulars" }]} />
      <NoticeBoard institutionId="college" showFilter title="All Notices & Circulars" />
    </>
  );
}
