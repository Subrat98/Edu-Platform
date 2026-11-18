import { Hero } from "@/components/sections/Hero";
import { Gallery } from "@/components/sections/Gallery";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { schoolHeroUrl } from "@/mocks/data/images";

export default function SchoolGalleryPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/school" }, { label: "Gallery" }]} />
      <Hero variant="compact" title="Gallery" imageUrl={schoolHeroUrl(5)} />
      <Gallery institutionId="school" title="Photo & Video Albums" />
    </>
  );
}
