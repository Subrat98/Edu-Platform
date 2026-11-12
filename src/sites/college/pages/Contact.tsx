import { Hero } from "@/components/sections/Hero";
import { ContactForm } from "@/components/sections/ContactForm";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { collegeHeroUrl } from "@/mocks/data/images";

export default function CollegeContact() {
  return (
    <>
      <Hero variant="compact" title="Contact Us" imageUrl={collegeHeroUrl(6)} />
      <Breadcrumbs items={[{ label: "Home", href: "/college" }, { label: "Contact" }]} />
      <ContactForm title="We'd love to hear from you" />
    </>
  );
}
