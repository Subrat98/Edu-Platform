import { Hero } from "@/components/sections/Hero";
import { NoticeBoard } from "@/components/sections/NoticeBoard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { collegeHeroUrl } from "@/mocks/data/images";

export default function CollegeNotices() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/college" }, { label: "Notices & Circulars" }]} />
      <Hero variant="compact" title="Notices & Circulars" imageUrl={collegeHeroUrl(2)} />
      <NoticeBoard institutionId="college" showFilter title="All Notices & Circulars" />
    </>
  );
}
