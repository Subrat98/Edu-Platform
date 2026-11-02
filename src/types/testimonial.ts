import type { InstitutionType } from "./institution";

export interface Testimonial {
  id: string;
  institutionId: InstitutionType;
  name: string;
  role: string;
  quote: string;
  avatarUrl: string;
  rating: number;
}
