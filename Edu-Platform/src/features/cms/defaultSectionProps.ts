import { schoolHeroUrl, collegeHeroUrl } from "@/mocks/data/images";
import { accreditationBadges } from "@/mocks/data/accreditation";
import type { InstitutionType, SectionType } from "@/types";

export function defaultPropsFor(type: SectionType, institutionId: InstitutionType): Record<string, unknown> {
  const heroUrl = institutionId === "school" ? schoolHeroUrl(1) : collegeHeroUrl(1);
  switch (type) {
    case "hero":
      return { title: "New headline", description: "Supporting description text.", imageUrl: heroUrl, primaryCta: { label: "Learn more", href: `/${institutionId}` } };
    case "stats":
      return { items: [{ label: "Students", value: "0" }, { label: "Faculty", value: "0" }] };
    case "noticeBoard":
      return { institutionId, limit: 5, title: "Latest Notices" };
    case "programmeCards":
      return { title: "Programmes", items: [] };
    case "departmentCards":
      return { title: "Departments", items: [] };
    case "facultyGrid":
      return { title: "Our People", institutionId };
    case "eventCards":
      return { institutionId, title: "Upcoming Events" };
    case "gallery":
      return { institutionId, title: "Gallery" };
    case "testimonials":
      return { institutionId, title: "What people say" };
    case "admissionsCta":
      return { title: "Admissions open", description: "Add a description.", ctaLabel: "Apply now", ctaHref: `/${institutionId}/admissions` };
    case "downloads":
      return { institutionId, title: "Downloads" };
    case "richText":
      return { title: "New section", paragraphs: ["Add your content here."] };
    case "faq":
      return { items: [{ id: `faq-${Date.now()}`, question: "New question?", answer: "Add an answer." }] };
    case "contactForm":
      return { title: "Get in touch" };
    case "libraryWidget":
      return { volumeCount: "0", hours: "9:00 AM – 5:00 PM", catalogueHref: `/${institutionId}/library`, loginHref: "/auth/login" };
    case "accreditationStrip":
      return { items: accreditationBadges };
    default:
      return {};
  }
}
