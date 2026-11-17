import type { InstitutionType } from "./institution";
import type { RoleKey } from "./user";

export type NotificationCategory = "Academics" | "Finance" | "Admissions" | "Library" | "General";

export interface AppNotification {
  id: string;
  institutionId: InstitutionType;
  category: NotificationCategory;
  title: string;
  body: string;
  timestamp: string;
  /** When set, only these roles see the notification; omitted means everyone at the institution. */
  roles?: RoleKey[];
  /** When set, only the student/guardian tied to this studentId sees it (in addition to role targeting). */
  studentId?: string;
}
