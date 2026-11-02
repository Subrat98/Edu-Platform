import { Hero } from "@/components/sections/Hero";
import { EventCards } from "@/components/sections/EventCards";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { schoolHeroUrl } from "@/mocks/data/images";

export default function SchoolEvents() {
  return (
    <>
      <Hero variant="compact" title="Events & Calendar" imageUrl={schoolHeroUrl(1)} />
      <Breadcrumbs items={[{ label: "Home", href: "/school" }, { label: "Events & Calendar" }]} />
      <EventCards institutionId="school" title="School Events Calendar" />
    </>
  );
}
