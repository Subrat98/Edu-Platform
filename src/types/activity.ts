import type { InstitutionType } from "./institution";

export type ActivityCategory = "Admissions" | "Students" | "Attendance" | "Examinations" | "Finance" | "CMS" | "Settings";

export interface ActivityEvent {
  id: string;
  institutionId: InstitutionType;
  category: ActivityCategory;
  action: string;
  actor: string;
  timestamp: string;
  detail?: string;
}
