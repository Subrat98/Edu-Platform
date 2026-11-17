import { Hero } from "@/components/sections/Hero";
import { Downloads } from "@/components/sections/Downloads";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { schoolHeroUrl } from "@/mocks/data/images";

export default function SchoolDownloadsPage() {
  return (
    <>
      <Hero variant="compact" title="Downloads" imageUrl={schoolHeroUrl(1)} />
      <Breadcrumbs items={[{ label: "Home", href: "/school" }, { label: "Downloads" }]} />
      <Downloads institutionId="school" title="All Downloads" />
    </>
  );
}
