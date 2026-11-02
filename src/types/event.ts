import type { InstitutionType } from "./institution";

export type EventCategory =
  | "Academic"
  | "Sports"
  | "Cultural"
  | "Seminar"
  | "Holiday"
  | "Admission"
  | "Placement";

export interface EventItem {
  id: string;
  institutionId: InstitutionType;
  title: string;
  category: EventCategory;
  date: string;
  endDate?: string;
  location: string;
  description: string;
  imageUrl: string;
}
