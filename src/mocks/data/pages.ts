import { schoolHeroUrl, collegeHeroUrl } from "./images";
import { accreditationBadges } from "./accreditation";
import { departments } from "./departments";
import { schoolClasses } from "./classes";
import type { Page } from "@/types";

export const schoolHomePage: Page = {
  slug: "home",
  institutionId: "school",
  title: "Home",
  sections: [
    {
      id: "sch-home-hero",
      type: "hero",
      order: 1,
      props: {
        badge: "Admissions Open for 2027–28",
        title: "Where every child learns to shine",
        description: "Nursery to Grade 12 · Caring teachers · Safe, activity-rich campus in Khandapara, Nayagarh.",
        imageUrl: schoolHeroUrl(1),
        images: [schoolHeroUrl(1), schoolHeroUrl(2), schoolHeroUrl(3), schoolHeroUrl(4), schoolHeroUrl(5)],
        primaryCta: { label: "Apply for Admission", href: "/school/admissions" },
        secondaryCta: { label: "Explore Academics", href: "/school/academics" },
      },
    },
    {
      id: "sch-home-stats",
      type: "stats",
      order: 2,
      props: {
        items: [
          { label: "Students", value: "1,250+" },
          { label: "Qualified Teachers", value: "65+" },
          { label: "Board Result Success", value: "98%" },
          { label: "Years of Excellence", value: "27" },
        ],
      },
    },
    {
      id: "sch-home-why",
      type: "departmentCards",
      order: 3,
      props: {
        eyebrow: "Why parents choose us",
        title: "A school built around every child",
        items: [
          { title: "Academics Pre-Primary to XII", description: "A CBSE curriculum spanning early years through Senior Secondary streams.", icon: "academics", href: "/school/academics" },
          { title: "Activities & Sports", description: "Houses, clubs, athletics and the arts alongside academics.", icon: "sports", href: "/school/student-life" },
          { title: "Parent Portal", description: "Attendance, notices, results and fees — all in one login.", icon: "people", href: "/school/parent-corner" },
          { title: "Safety & Transport", description: "CCTV-monitored campus with GPS-tracked transport routes.", icon: "safety", href: "/school/facilities" },
        ],
      },
    },
    {
      id: "sch-home-classes",
      type: "programmeCards",
      order: 4,
      props: {
        eyebrow: "Academics",
        title: "Classes & Streams",
        description: "A structured curriculum from Nursery through Senior Secondary Science, Commerce and Arts.",
        ctaLabel: "View curriculum",
        items: schoolClasses.slice(0, 6).map((c) => ({
          title: c.name,
          subtitle: c.stage,
          description: c.description,
          href: "/school/academics",
        })),
      },
    },
    {
      id: "sch-home-notices",
      type: "noticeBoard",
      order: 5,
      props: { institutionId: "school", limit: 5, title: "Latest Notices", viewAllHref: "/school/notices" },
    },
    {
      id: "sch-home-events",
      type: "eventCards",
      order: 6,
      props: { institutionId: "school", limit: 3, title: "Upcoming Events", viewAllHref: "/school/events" },
    },
    {
      id: "sch-home-testimonials",
      type: "testimonials",
      order: 7,
      props: { institutionId: "school", title: "What parents say" },
    },
    {
      id: "sch-home-admissions",
      type: "admissionsCta",
      order: 8,
      props: {
        title: "Admissions open for Session 2027–28",
        description: "Nursery to Class XI — apply online or visit the front office. Limited seats per section.",
        deadline: "15 February 2027",
        eligibility: "Age criteria vary by class",
        steps: ["Submit the online enquiry form", "Attend a campus visit & interaction", "Submit documents & pay admission fee"],
        ctaLabel: "Start Application",
        ctaHref: "/school/admissions",
      },
    },
  ],
};

export const collegeHomePage: Page = {
  slug: "home",
  institutionId: "college",
  title: "Home",
  sections: [
    {
      id: "col-home-hero",
      type: "hero",
      order: 1,
      props: {
        badge: "UG & PG Admissions Open",
        title: "Knowledge. Research. Leadership.",
        description: "UG & PG programmes across Science, Commerce and Arts · NAAC accredited · Modern library.",
        imageUrl: collegeHeroUrl(1),
        images: [collegeHeroUrl(1), collegeHeroUrl(2), collegeHeroUrl(3)],
        primaryCta: { label: "Apply Online", href: "/college/admissions" },
        secondaryCta: { label: "Explore Programmes", href: "/college/programmes" },
      },
    },
    {
      id: "col-home-stats",
      type: "stats",
      order: 2,
      props: {
        items: [
          { label: "Students", value: "4,200+" },
          { label: "Faculty", value: "180+" },
          { label: "Programmes", value: "32" },
          { label: "Library Volumes", value: "60,000+" },
        ],
      },
    },
    {
      id: "col-home-accreditation",
      type: "accreditationStrip",
      order: 3,
      props: { items: accreditationBadges, tone: "surface" },
    },
    {
      id: "col-home-departments",
      type: "departmentCards",
      order: 4,
      props: {
        eyebrow: "Academics",
        title: "Departments & Programmes",
        items: departments.slice(0, 4).map((d) => ({
          title: d.name,
          meta: `HOD: ${d.hod}`,
          description: d.description,
          href: `/college/departments/${d.slug}`,
          icon: "building" as const,
        })),
      },
    },
    {
      id: "col-home-notices",
      type: "noticeBoard",
      order: 5,
      props: { institutionId: "college", limit: 5, title: "Notices & Circulars", viewAllHref: "/college/news-events" },
    },
    {
      id: "col-home-events",
      type: "eventCards",
      order: 6,
      props: { institutionId: "college", limit: 3, title: "Events & IQAC", viewAllHref: "/college/news-events" },
    },
    {
      id: "col-home-testimonials",
      type: "testimonials",
      order: 7,
      props: { institutionId: "college", title: "What our students say" },
    },
    {
      id: "col-home-admissions",
      type: "admissionsCta",
      order: 8,
      props: {
        title: "Admissions open for Session 2027–28",
        description: "UG, PG, diploma and certificate programmes — apply online with merit-based selection.",
        deadline: "31 January 2027",
        eligibility: "Varies by programme",
        steps: ["Create your application account", "Fill programme choices & upload documents", "Track status & pay fees online"],
        ctaLabel: "Apply Online",
        ctaHref: "/college/admissions",
      },
    },
  ],
};

export function getHomePage(institutionId: "school" | "college"): Page {
  return institutionId === "school" ? schoolHomePage : collegeHomePage;
}
