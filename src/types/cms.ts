import type { InstitutionType } from "./institution";

export type SectionType =
  | "hero"
  | "stats"
  | "noticeBoard"
  | "programmeCards"
  | "departmentCards"
  | "facultyGrid"
  | "eventCards"
  | "gallery"
  | "testimonials"
  | "admissionsCta"
  | "downloads"
  | "richText"
  | "faq"
  | "contactForm"
  | "libraryWidget"
  | "accreditationStrip";

export interface Section<TProps = Record<string, unknown>> {
  id: string;
  type: SectionType;
  order: number;
  props: TProps;
  hidden?: boolean;
}

export interface Page {
  slug: string;
  institutionId: InstitutionType;
  title: string;
  description?: string;
  sections: Section[];
}

export type PageStatus = "Draft" | "Pending Approval" | "Published" | "Scheduled" | "Archived";
export type SiteArea = "school" | "college";

export interface CmsPageRecord {
  id: string;
  institutionId: InstitutionType;
  title: string;
  slug: string;
  siteArea: SiteArea;
  status: PageStatus;
  author: string;
  updatedAt: string;
  scheduledFor?: string;
  visibility: "Public" | "Portal Only";
  page: Page;
}

export interface MediaAsset {
  id: string;
  institutionId: InstitutionType;
  fileName: string;
  fileType: "image" | "pdf" | "video";
  url: string;
  altText: string;
  sizeLabel: string;
  uploadedDate: string;
  uploadedBy: string;
}

export interface MenuItemDraft {
  id: string;
  label: string;
  path: string;
  children?: MenuItemDraft[];
}

export type CmsNoticeStatus = "Draft" | "Pending Approval" | "Published" | "Scheduled" | "Expired" | "Archived";

