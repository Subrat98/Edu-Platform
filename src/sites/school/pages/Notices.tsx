import { Hero } from "@/components/sections/Hero";
import { NoticeBoard } from "@/components/sections/NoticeBoard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { schoolHeroUrl } from "@/mocks/data/images";

export default function SchoolNotices() {
  return (
    <>
      <Hero variant="compact" title="Notices & Circulars" imageUrl={schoolHeroUrl(1)} />
      <Breadcrumbs items={[{ label: "Home", href: "/school" }, { label: "Notices & Circulars" }]} />
      <NoticeBoard institutionId="school" showFilter title="All Notices & Circulars" />
    </>
  );
}
