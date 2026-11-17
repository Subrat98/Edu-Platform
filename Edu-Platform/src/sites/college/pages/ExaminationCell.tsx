import { Hero } from "@/components/sections/Hero";
import { NoticeBoard } from "@/components/sections/NoticeBoard";
import { Downloads } from "@/components/sections/Downloads";
import { Faq } from "@/components/sections/Faq";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { collegeHeroUrl } from "@/mocks/data/images";

const faqItems = [
  { id: "e1", question: "Where can I find the exam datesheet?", answer: "Datesheets are published under Notices below and in the Examination Cell downloads section ahead of each semester." },
  { id: "e2", question: "How do I apply for revaluation?", answer: "Submit a revaluation request with the prescribed fee within the window announced after result publication — see current notices." },
  { id: "e3", question: "How are results published?", answer: "Semester results combine internal assessment and end-semester marks and are published through the student login once verified by the Exam Cell." },
];

export default function CollegeExamCell() {
  return (
    <>
      <Hero variant="compact" title="Examination Cell" imageUrl={collegeHeroUrl(1)} />
      <Breadcrumbs items={[{ label: "Home", href: "/college" }, { label: "Examination Cell" }]} />
      <NoticeBoard institutionId="college" title="Examination Notices" />
      <Downloads institutionId="college" title="Datesheets & Forms" category="Academics" />
      <Faq items={faqItems} />
    </>
  );
}
