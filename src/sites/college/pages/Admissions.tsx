import { Hero } from "@/components/sections/Hero";
import { AdmissionsCTA } from "@/components/sections/AdmissionsCTA";
import { Faq } from "@/components/sections/Faq";
import { Downloads } from "@/components/sections/Downloads";
import { ContactForm } from "@/components/sections/ContactForm";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { collegeHeroUrl } from "@/mocks/data/images";

const faqItems = [
  { id: "f1", question: "What is the eligibility for UG programmes?", answer: "A pass in 10+2 from a recognized board, with subject-specific requirements varying by programme — see each programme's detail page." },
  { id: "f2", question: "Is there an entrance examination?", answer: "Most UG programmes admit on merit based on 10+2 marks; PG programmes may require a department-level interaction." },
  { id: "f3", question: "Are scholarships available?", answer: "Yes — state merit scholarships and institutional fee concessions are available for eligible students. See the Scholarships page." },
  { id: "f4", question: "How do I track my application status?", answer: "Once submitted, your application status can be tracked using your application number through the admissions portal." },
  { id: "f5", question: "Is hostel accommodation available?", answer: "Hostel and transport facilities are managed separately from admissions — contact the administrative office for current availability." },
];

export default function CollegeAdmissions() {
  return (
    <>
      <Hero variant="compact" title="Admissions 2027–28" imageUrl={collegeHeroUrl(1)} />
      <Breadcrumbs items={[{ label: "Home", href: "/college" }, { label: "Admissions" }]} />

      <AdmissionsCTA
        title="UG & PG admissions are now open"
        description="Applications for all undergraduate and postgraduate programmes for the 2027–28 session are open. Merit lists are published in phases based on qualifying marks and category reservation norms."
        deadline="31 January 2027"
        eligibility="Varies by programme — see Programmes & Courses"
        steps={[
          "Create your application account and select your programme choices",
          "Upload scanned mark sheets and category/reservation documents",
          "Track your merit status and complete admission formalities online",
        ]}
        ctaLabel="Submit Enquiry"
        ctaHref="#enquiry"
      />

      <Faq items={faqItems} />
      <Downloads institutionId="college" title="Admission Documents" category="Admissions" />
      <div id="enquiry">
        <ContactForm title="Admission Enquiry" showInstitutionDetails />
      </div>
    </>
  );
}
