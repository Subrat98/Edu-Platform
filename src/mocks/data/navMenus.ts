import type { NavMenu } from "@/types";

export const schoolNavMenu: NavMenu = {
  institutionId: "school",
  items: [
    { label: "Home", path: "/school" },
    {
      label: "About School",
      path: "/school/about",
      children: [
        { label: "School Profile & History", path: "/school/about" },
        { label: "Vision, Mission & Motto", path: "/school/about" },
        { label: "Principal's Desk", path: "/school/about" },
        { label: "Campus & Facilities", path: "/school/facilities" },
        { label: "Virtual Tour & Map", path: "/school/about" },
      ],
    },
    {
      label: "Administration",
      path: "/school/administration",
      children: [
        { label: "Principal & Leadership", path: "/school/administration" },
        { label: "Staff Directory (PGT/TGT/PRT)", path: "/school/faculty-staff" },
        { label: "School Management Committee (SMC)", path: "/school/administration" },
        { label: "Parent-Teacher Association (PTA)", path: "/school/administration" },
        { label: "Statutory Committees & Safety", path: "/school/administration" },
        { label: "School Organisation Chart", path: "/school/administration" },
      ],
    },
    {
      label: "Academics",
      path: "/school/academics",
      children: [
        { label: "Classes & Curriculum", path: "/school/academics" },
        { label: "Annual Academic Calendar", path: "/school/academics" },
        { label: "Class Timetable", path: "/school/academics" },
        { label: "Examination Schedule", path: "/school/academics" },
        { label: "Board Results & Toppers", path: "/school/results" },
        { label: "Holistic Progress Card (HPC)", path: "/school/academics" },
      ],
    },
    {
      label: "Admissions",
      path: "/school/admissions",
      children: [
        { label: "Notice & Eligibility", path: "/school/admissions" },
        { label: "Age Criteria & Vacancies", path: "/school/admissions" },
        { label: "RTE 25% Reserved Quota", path: "/school/admissions" },
        { label: "Fee Structure 2026-27", path: "/school/admissions" },
        { label: "Admission Forms Download", path: "/school/downloads" },
        { label: "Transfer Certificate (TC) Guide", path: "/school/admissions" },
      ],
    },
    {
      label: "Students",
      path: "/school/student-life",
      children: [
        { label: "PM-POSHAN (Mid-Day Meal)", path: "/school/student-life" },
        { label: "Scholarships & Awards", path: "/school/student-life" },
        { label: "Sports & Fit India School", path: "/school/student-life" },
        { label: "Clubs, NCC, Scouts & JRC", path: "/school/student-life" },
        { label: "Student Achievements", path: "/school/results" },
        { label: "Counselling & Child Safety", path: "/school/student-life" },
      ],
    },
    {
      label: "Facilities",
      path: "/school/facilities",
      children: [
        { label: "School Library & Koha OPAC", path: "/school/library" },
        { label: "Laboratories & Atal Tinkering Lab", path: "/school/facilities" },
        { label: "Computer / ICT Lab", path: "/school/facilities" },
        { label: "Playground & Sports Complex", path: "/school/facilities" },
        { label: "Drinking Water & Sanitation", path: "/school/facilities" },
        { label: "School Transport & Routes", path: "/school/facilities" },
        { label: "CWSN Barrier-Free Ramps & Toilets", path: "/school/facilities" },
      ],
    },
    {
      label: "Notices & Circulars",
      path: "/school/notices",
      children: [
        { label: "All Notices & Circulars", path: "/school/notices" },
        { label: "School Calendar & Events", path: "/school/events" },
        { label: "Photo & Video Gallery", path: "/school/gallery" },
        { label: "Downloads & TC Forms", path: "/school/downloads" },
      ],
    },
    { label: "Mandatory Disclosure", path: "/school/mandatory-disclosure" },
    {
      label: "Grievance & RTI",
      path: "/school/grievance",
      children: [
        { label: "Online Grievance Redressal", path: "/school/grievance" },
        { label: "RTI Act & Proactive Disclosures", path: "/school/rti" },
        { label: "Mo School Abhiyan & Alumni", path: "/school/alumni" },
        { label: "Contact & How to Reach", path: "/school/contact" },
      ],
    },
  ],
  footerQuickLinks: [
    { label: "About Our School", path: "/school/about" },
    { label: "Admissions 2026-27", path: "/school/admissions" },
    { label: "Mandatory Public Disclosure", path: "/school/mandatory-disclosure" },
    { label: "Annual Academic Calendar", path: "/school/academics" },
    { label: "Board Results & Toppers", path: "/school/results" },
    { label: "Photo & Video Gallery", path: "/school/gallery" },
    { label: "Contact School Office", path: "/school/contact" },
  ],
  footerAcademicLinks: [
    { label: "CBSE Appendix IX Disclosure", path: "/school/mandatory-disclosure" },
    { label: "School Management Committee (SMC)", path: "/school/administration" },
    { label: "Parent-Teacher Association (PTA)", path: "/school/administration" },
    { label: "Curriculum & NCERT Books", path: "/school/academics" },
    { label: "Fee Structure & Rules", path: "/school/admissions" },
    { label: "School Library Catalogue", path: "/school/library" },
    { label: "PM-POSHAN Nutrition Menu", path: "/school/student-life" },
  ],
  footerSupportLinks: [
    { label: "Online Grievance Redressal", path: "/school/grievance" },
    { label: "Childline Emergency 1098", path: "/school/grievance" },
    { label: "Anti-Bullying & Safety Cell", path: "/school/administration" },
    { label: "RTE 25% Reserved Admission", path: "/school/admissions" },
    { label: "Mo School Abhiyan (Odisha)", path: "/school/alumni" },
    { label: "RTI Proactive Disclosures", path: "/school/rti" },
    { label: "Transport & Bus Routes", path: "/school/facilities" },
  ],
  footerPolicyLinks: [
    { label: "Privacy Policy", path: "/school/policies/privacy-policy" },
    { label: "Terms & Conditions", path: "/school/policies/terms-and-conditions" },
    { label: "Child Safety & POCSO Policy", path: "/school/policies/child-safety-policy" },
    { label: "Mandatory Public Disclosure", path: "/school/mandatory-disclosure" },
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
