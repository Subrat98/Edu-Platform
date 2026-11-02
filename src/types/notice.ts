import type { InstitutionType } from "./institution";

export type NoticeCategory =
  | "Admission"
  | "Examination"
  | "Holiday"
  | "Circular"
  | "Event"
  | "General"
  | "Scholarship"
  | "Library";

export type NoticeAudience = "Public" | "Students" | "Parents" | "Staff";

export interface Notice {
  id: string;
  institutionId: InstitutionType;
  title: string;
  category: NoticeCategory;
  summary: string;
  date: string;
  expiryDate?: string;
  pinned: boolean;
  fileName?: string;
  status?: "Draft" | "Pending Approval" | "Published" | "Scheduled" | "Expired" | "Archived";
  audience?: NoticeAudience[];
  author?: string;
}
