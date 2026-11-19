import { Hero } from "@/components/sections/Hero";
import { NoticeBoard } from "@/components/sections/NoticeBoard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { schoolHeroUrl } from "@/mocks/data/images";

export default function SchoolNotices() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/school" }, { label: "Notices & Circulars" }]} />
      <Hero variant="compact" title="Notices & Circulars" imageUrl={schoolHeroUrl(1)} />
      <NoticeBoard institutionId="school" showFilter title="All Notices & Circulars" />
    </>
  );
}
