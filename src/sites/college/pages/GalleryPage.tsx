import { Hero } from "@/components/sections/Hero";
import { Gallery } from "@/components/sections/Gallery";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { collegeHeroUrl } from "@/mocks/data/images";

export default function CollegeGalleryPage() {
  return (
    <>
      <Hero variant="compact" title="Gallery" imageUrl={collegeHeroUrl(1)} />
      <Breadcrumbs items={[{ label: "Home", href: "/college" }, { label: "Gallery" }]} />
      <Gallery institutionId="college" title="Photo & Video Albums" />
    </>
  );
}
