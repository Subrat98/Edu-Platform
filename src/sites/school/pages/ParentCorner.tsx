import { Hero } from "@/components/sections/Hero";
import { DepartmentCards } from "@/components/sections/DepartmentCards";
import { NoticeBoard } from "@/components/sections/NoticeBoard";
import { Downloads } from "@/components/sections/Downloads";
import { Faq } from "@/components/sections/Faq";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { schoolHeroUrl } from "@/mocks/data/images";

const faqItems = [
  { id: "p1", question: "How do I access my child's attendance and results?", answer: "Log in to the Parent Portal from the header menu using your registered email. You'll see attendance, timetable, notices and results for each linked child." },
  { id: "p2", question: "How do I apply for a leave of absence?", answer: "Submit a leave request through the Parent Portal; your child's class teacher will review and approve it." },
  { id: "p3", question: "Where can I find the fee due dates?", answer: "Fee notices are published on the Notices page and in your Parent Portal fee ledger, with reminders sent ahead of each due date." },
];

export default function SchoolParentCorner() {
  return (
    <>
      <Hero variant="compact" title="Parent Corner" imageUrl={schoolHeroUrl(4)} />
      <Breadcrumbs items={[{ label: "Home", href: "/school" }, { label: "Parent Corner" }]} />

      <DepartmentCards
        eyebrow="Quick access"
        title="Everything parents need"
        items={[
          { title: "Parent Portal Login", description: "Attendance, timetable, results, fee ledger and library loans — in one place.", icon: "people", href: "/auth/login?institution=school" },
          { title: "PTM Schedules", description: "Upcoming Parent-Teacher Meeting dates by class, published on the Notices page.", icon: "academics" },
          { title: "Transport Routes", description: "Pickup and drop timings for all GPS-tracked bus routes.", icon: "transport", href: "/school/facilities" },
          { title: "School Rules", description: "Uniform policy, attendance rules and the code of conduct.", icon: "safety" },
        ]}
      />

      <NoticeBoard institutionId="school" limit={5} title="Notices for Parents" viewAllHref="/school/notices" />
      <Downloads institutionId="school" title="Forms & Lists" category="Parent Corner" />
      <Faq items={faqItems} />
    </>
  );
}
