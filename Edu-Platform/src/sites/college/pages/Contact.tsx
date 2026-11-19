import { Hero } from "@/components/sections/Hero";
import { ContactForm } from "@/components/sections/ContactForm";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { collegeHeroUrl } from "@/mocks/data/images";
import { useLiveSiteContent } from "@/features/content/siteContentService";

export default function CollegeContact() {
  const siteContent = useLiveSiteContent("college");
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/college" }, { label: "Contact" }]} />
      <Hero
        variant="compact"
        title="Contact Us"
        imageUrl={siteContent.contact?.heroImage || collegeHeroUrl(6)}
      />
      <ContactForm title="We'd love to hear from you" />
    </>
  );
}
