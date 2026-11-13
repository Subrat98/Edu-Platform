import type { NavMenu } from "@/types";

export const schoolNavMenu: NavMenu = {
  institutionId: "school",
  items: [
    { label: "Home", path: "/school" },
    { label: "About", path: "/school/about" },
    { label: "Academics", path: "/school/academics" },
    { label: "Admissions", path: "/school/admissions" },
    {
      label: "Faculty",
      path: "/school/faculty-staff",
      children: [
        { label: "Faculty & Staff", path: "/school/faculty-staff" },
        { label: "Results & Toppers", path: "/school/results" },
      ],
    },
    {
      label: "Student Life",
      path: "/school/student-life",
      children: [
        { label: "Student Life", path: "/school/student-life" },
        { label: "Facilities", path: "/school/facilities" },
        { label: "Parent Corner", path: "/school/parent-corner" },
      ],
    },
    {
      label: "Updates",
      path: "/school/notices",
      children: [
        { label: "Notices & Circulars", path: "/school/notices" },
        { label: "Events & Calendar", path: "/school/events" },
        { label: "Gallery", path: "/school/gallery" },
        { label: "Downloads", path: "/school/downloads" },
      ],
    },
    { label: "Library", path: "/school/library" },
    { label: "Contact", path: "/school/contact" },
  ],
  footerQuickLinks: [
    { label: "About Us", path: "/school/about" },
    { label: "Admissions", path: "/school/admissions" },
    { label: "Academics", path: "/school/academics" },
    { label: "Notices & Circulars", path: "/school/notices" },
    { label: "Gallery", path: "/school/gallery" },
    { label: "Contact", path: "/school/contact" },
  ],
  footerPolicyLinks: [
    { label: "Privacy Policy", path: "/school/policies/privacy-policy" },
    { label: "Terms & Conditions", path: "/school/policies/terms-and-conditions" },
    { label: "Child Safety Policy", path: "/school/policies/child-safety-policy" },
  ],
};

export const collegeNavMenu: NavMenu = {
  institutionId: "college",
  items: [
    { label: "Home", path: "/college" },
    {
      label: "About",
      path: "/college/about",
      children: [
        { label: "History & Legacy", path: "/college/about" },
        { label: "Vision & Mission", path: "/college/about" },
        { label: "Act & Statutes", path: "/college/about" },
        { label: "Organogram", path: "/college/about" },
        { label: "Location & How to Reach", path: "/college/virtual-tour" },
        { label: "Virtual Campus Tour", path: "/college/virtual-tour" },
      ],
    },
    {
      label: "Administration",
      path: "/college/administration",
      children: [
        { label: "Chancellor & Officers", path: "/college/administration" },
        { label: "Syndicate & Executive Body", path: "/college/administration" },
        { label: "Academic Council & PG Council", path: "/college/administration" },
        { label: "Secretariats & Directory", path: "/college/administration" },
      ],
    },
    {
      label: "Academics",
      path: "/college/departments",
      children: [
        { label: "Departments & Schools", path: "/college/departments" },
        { label: "Programmes & Courses", path: "/college/programmes" },
        { label: "Faculty & Staff Directory", path: "/college/faculty-staff" },
        { label: "Examination Cell", path: "/college/examination-cell" },
      ],
    },
    {
      label: "Admissions",
      path: "/college/admissions",
      children: [
        { label: "e-Admission Portal", path: "/college/admissions" },
        { label: "Prospectus Library", path: "/college/admissions" },
        { label: "Fee Structure & Payment", path: "/college/admissions" },
        { label: "Admission FAQs", path: "/college/admissions" },
      ],
    },
    {
      label: "Quality (IQAC/NAAC)",
      path: "/college/iqac",
      children: [
        { label: "IQAC Public Portal", path: "/college/iqac" },
        { label: "Accreditation & SSR", path: "/college/iqac" },
        { label: "AQAR Archive (8 Years)", path: "/college/iqac" },
        { label: "Criteria I–VII Evidence", path: "/college/iqac" },
        { label: "Mandatory Disclosure", path: "/college/disclosure" },
      ],
    },
    {
      label: "Research",
      path: "/college/research",
      children: [
        { label: "Research & Development Cell", path: "/college/research" },
        { label: "Scopus Publications Register", path: "/college/research" },
        { label: "Sponsored Grants (DST/CSIR)", path: "/college/research" },
        { label: "Central Instrumentation Facility", path: "/college/research" },
      ],
    },
    {
      label: "Students",
      path: "/college/student-corner",
      children: [
        { label: "Student Activities & Clubs", path: "/college/student-corner" },
        { label: "Parija Central Library", path: "/college/library" },
        { label: "Placements & Career Cell", path: "/college/placements" },
        { label: "Scholarships & Freeships", path: "/college/scholarships" },
      ],
    },
    {
      label: "Updates",
      path: "/college/notices",
      children: [
        { label: "Notices & Circulars", path: "/college/notices" },
        { label: "Recruitment & Vacancies", path: "/college/recruitment" },
        { label: "Tenders & RFPs", path: "/college/tenders" },
        { label: "News & Events", path: "/college/news-events" },
        { label: "Photo Gallery", path: "/college/gallery" },
      ],
    },
    {
      label: "Grievance & Welfare",
      path: "/college/grievance",
      children: [
        { label: "Online Grievance (e-Pratikar)", path: "/college/grievance" },
        { label: "Anti-Ragging Cell & Helpline", path: "/college/grievance" },
        { label: "Internal Committee (ICC)", path: "/college/grievance" },
        { label: "Equal Opportunity & Caste Cell", path: "/college/grievance" },
        { label: "Stakeholder Feedback & ATR", path: "/college/grievance" },
      ],
    },
    {
      label: "Alumni",
      path: "/college/alumni",
      children: [
        { label: "Alumni Association", path: "/college/alumni" },
        { label: "Distinguished Alumni", path: "/college/alumni" },
        { label: "Give to the University", path: "/college/alumni" },
        { label: "Contact Us", path: "/college/contact" },
      ],
    },
  ],
  footerQuickLinks: [
    { label: "RTI Disclosure", path: "/college/disclosure" },
    { label: "Audit Reports", path: "/college/iqac" },
    { label: "Annual Budget", path: "/college/iqac" },
    { label: "e-Admission", path: "/college/admissions" },
    { label: "Examination Cell", path: "/college/examination-cell" },
    { label: "Academic Calendar", path: "/college/examination-cell" },
    { label: "Placements", path: "/college/placements" },
    { label: "Convocation", path: "/college/news-events" },
    { label: "Contact Us", path: "/college/contact" },
  ],
  footerAcademicLinks: [
    { label: "IQAC & NAAC", path: "/college/iqac" },
    { label: "Academic Departments", path: "/college/departments" },
    { label: "Anti-Ragging Helpline", path: "/college/grievance" },
    { label: "R&D Cell", path: "/college/research" },
    { label: "Scopus Register", path: "/college/research" },
    { label: "Central Library", path: "/college/library" },
    { label: "Alumni Network", path: "/college/alumni" },
    { label: "Tenders & RFPs", path: "/college/tenders" },
  ],
  footerSupportLinks: [
    { label: "Online Grievance (e-Pratikar)", path: "/college/grievance" },
    { label: "Stakeholder Feedback", path: "/college/grievance" },
    { label: "Gender Equity & ICC", path: "/college/grievance" },
    { label: "Equal Opportunity Cell", path: "/college/grievance" },
    { label: "Divyangjan Facilities", path: "/college/about" },
    { label: "Virtual Campus Tour", path: "/college/virtual-tour" },
    { label: "How to Reach", path: "/college/virtual-tour" },
    { label: "Recruitment Portal", path: "/college/recruitment" },
  ],
  footerPolicyLinks: [
    { label: "Mandatory Disclosure", path: "/college/disclosure" },
    { label: "Privacy Policy", path: "/college/policies/privacy-policy" },
    { label: "Terms & Conditions", path: "/college/policies/terms-and-conditions" },
    { label: "Hyperlink Policy", path: "/college/policies/terms-and-conditions" },
    { label: "Accessibility Statement", path: "/college/disclosure" },
  ],
};

export function getNavMenu(id: "school" | "college"): NavMenu {
  return id === "school" ? schoolNavMenu : collegeNavMenu;
}
