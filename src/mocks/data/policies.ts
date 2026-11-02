import type { InstitutionType } from "@/types";

export interface PolicyPageContent {
  slug: string;
  institutionId: InstitutionType;
  title: string;
  updatedDate: string;
  paragraphs: string[];
}

const SHARED_PRIVACY = [
  "This website collects only the information you choose to provide through enquiry and application forms — such as your name, contact details and message — to respond to your query.",
  "We do not sell or share personal information with third parties except where required to process admissions or by law. Data is retained only as long as necessary for the stated purpose.",
  "This is a demonstration platform; forms on this site do not transmit data to a live backend and are shown for illustration only.",
];

const SHARED_TERMS = [
  "By using this website you agree to use it for lawful purposes only and not to misuse forms, content or facilities described here.",
  "Content on this site, including text, images and the EduPlatform design system, is the property of the respective institution and Intulet Technologies and may not be reproduced without permission.",
  "The institution reserves the right to update fees, policies, curricula and admission criteria at its discretion, with reasonable notice to stakeholders.",
];

export const policyPages: PolicyPageContent[] = [
  {
    slug: "privacy-policy",
    institutionId: "school",
    title: "Privacy Policy",
    updatedDate: "2026-08-01",
    paragraphs: SHARED_PRIVACY,
  },
  {
    slug: "terms-and-conditions",
    institutionId: "school",
    title: "Terms & Conditions",
    updatedDate: "2026-08-01",
    paragraphs: SHARED_TERMS,
  },
  {
    slug: "child-safety-policy",
    institutionId: "school",
    title: "Child Safety Policy",
    updatedDate: "2026-07-15",
    paragraphs: [
      "Pathani Samanta Public School is committed to providing a safe environment for every student. All staff undergo background verification and periodic child-safety training.",
      "The campus is monitored by CCTV at all entry points and common areas, with controlled visitor access and mandatory sign-in at the front gate.",
      "Any concerns about student safety or wellbeing can be raised confidentially with the Principal or the designated Child Protection Officer.",
    ],
  },
  {
    slug: "privacy-policy",
    institutionId: "college",
    title: "Privacy Policy",
    updatedDate: "2026-08-01",
    paragraphs: SHARED_PRIVACY,
  },
  {
    slug: "terms-and-conditions",
    institutionId: "college",
    title: "Terms & Conditions",
    updatedDate: "2026-08-01",
    paragraphs: SHARED_TERMS,
  },
];

export function getPolicyPage(institutionId: InstitutionType, slug: string): PolicyPageContent | undefined {
  return policyPages.find((p) => p.institutionId === institutionId && p.slug === slug);
}
