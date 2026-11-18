import { Hero } from "@/components/sections/Hero";
import { ContactForm } from "@/components/sections/ContactForm";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { schoolHeroUrl } from "@/mocks/data/images";
import { useLiveSiteContent } from "@/features/content/siteContentService";

export default function SchoolContact() {
  const siteContent = useLiveSiteContent("school");
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/school" }, { label: "Contact" }]} />
      <Hero
        variant="compact"
        title="Contact Us"
        imageUrl={siteContent.contact?.heroImage || schoolHeroUrl(1)}
      />
      <ContactForm title="We'd love to hear from you" />
    </>
  );
}
