import { Hero } from "@/components/sections/Hero";
import { AdmissionsCTA } from "@/components/sections/AdmissionsCTA";
import { Faq } from "@/components/sections/Faq";
import { Downloads } from "@/components/sections/Downloads";
import { ContactForm } from "@/components/sections/ContactForm";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { schoolHeroUrl } from "@/mocks/data/images";

const faqItems = [
  { id: "f1", question: "What is the age criteria for Nursery admission?", answer: "Children must be 3 years old on or before 31 March of the admission year for Nursery." },
  { id: "f2", question: "Is there an entrance test for lateral admissions?", answer: "Yes, students applying to Classes II and above take a short written assessment and an interaction with parents." },
  { id: "f3", question: "What documents are required?", answer: "Birth certificate, previous school's transfer certificate and report card, Aadhaar card, and passport-size photographs." },
  { id: "f4", question: "Does the school offer transport facilities?", answer: "Yes, GPS-tracked buses cover major routes across Khandapara and surrounding areas — see the Facilities page for details." },
  { id: "f5", question: "Can I apply online?", answer: "Yes, the online application form is available on this page and through the Parent Portal." },
];

export default function SchoolAdmissions() {
  return (
    <>
      <Hero variant="compact" title="Admissions 2027–28" imageUrl={schoolHeroUrl(4)} />
      <Breadcrumbs items={[{ label: "Home", href: "/school" }, { label: "Admissions" }]} />

      <AdmissionsCTA
        title="Admissions are now open"
        description="We welcome applications for Nursery through Class XI for the 2027–28 academic session. Seats are limited per section and allotted on a first-come, first-served basis after document verification."
        deadline="15 February 2027"
        eligibility="Age criteria vary by class — see FAQs below"
        steps={[
          "Submit the online enquiry or application form",
          "Attend a campus visit and a brief parent-student interaction",
          "Submit documents and pay the admission fee to confirm the seat",
        ]}
        ctaLabel="Submit Enquiry"
        ctaHref="#enquiry"
      />

      <Faq items={faqItems} />
      <Downloads institutionId="school" title="Admission Documents" category="Admissions" />
      <div id="enquiry">
        <ContactForm title="Admission Enquiry" showInstitutionDetails />
      </div>
    </>
  );
}
