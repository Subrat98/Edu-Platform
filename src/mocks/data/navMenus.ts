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
    { label: "About", path: "/college/about" },
    {
      label: "Academics",
      path: "/college/departments",
      children: [
        { label: "Departments", path: "/college/departments" },
        { label: "Programmes & Courses", path: "/college/programmes" },
        { label: "Faculty & Staff", path: "/college/faculty-staff" },
        { label: "Examination Cell", path: "/college/examination-cell" },
      ],
    },
    { label: "Admissions", path: "/college/admissions" },
    { label: "Accreditation", path: "/college/iqac" },
    { label: "Library", path: "/college/library" },
    {
      label: "More",
      path: "/college/news-events",
      children: [
        { label: "Notices & Circulars", path: "/college/notices" },
        { label: "Research & Publications", path: "/college/research" },
        { label: "Placements & Career Cell", path: "/college/placements" },
        { label: "Student Corner", path: "/college/student-corner" },
        { label: "Scholarships & Welfare", path: "/college/scholarships" },
        { label: "News & Events", path: "/college/news-events" },
        { label: "Gallery", path: "/college/gallery" },
      ],
    },
    { label: "Contact", path: "/college/contact" },
  ],
  footerQuickLinks: [
    { label: "About", path: "/college/about" },
    { label: "Departments", path: "/college/departments" },
    { label: "Programmes & Courses", path: "/college/programmes" },
    { label: "Admissions", path: "/college/admissions" },
    { label: "Notices & Circulars", path: "/college/notices" },
    { label: "Placements", path: "/college/placements" },
    { label: "Contact", path: "/college/contact" },
  ],
  footerPolicyLinks: [
    { label: "Mandatory Disclosure", path: "/college/disclosure" },
    { label: "Privacy Policy", path: "/college/policies/privacy-policy" },
    { label: "RTI", path: "/college/disclosure" },
  ],
};

export function getNavMenu(id: "school" | "college"): NavMenu {
  return id === "school" ? schoolNavMenu : collegeNavMenu;
}
