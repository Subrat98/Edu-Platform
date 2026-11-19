import { Hero } from "@/components/sections/Hero";
import { Gallery } from "@/components/sections/Gallery";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { collegeHeroUrl } from "@/mocks/data/images";

export default function CollegeGalleryPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/college" }, { label: "Gallery" }]} />
      <Hero variant="compact" title="Gallery" imageUrl={collegeHeroUrl(2)} />
      <Gallery institutionId="college" title="Photo & Video Albums" />
    </>
  );
}
