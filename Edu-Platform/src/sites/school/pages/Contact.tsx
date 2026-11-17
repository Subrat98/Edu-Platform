import { Hero } from "@/components/sections/Hero";
import { ContactForm } from "@/components/sections/ContactForm";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { schoolHeroUrl } from "@/mocks/data/images";

export default function SchoolContact() {
  return (
    <>
      <Hero variant="compact" title="Contact Us" imageUrl={schoolHeroUrl(1)} />
      <Breadcrumbs items={[{ label: "Home", href: "/school" }, { label: "Contact" }]} />
      <ContactForm title="We'd love to hear from you" />
    </>
  );
}
