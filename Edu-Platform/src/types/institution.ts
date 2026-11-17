import type { ThemeTokens } from "./theme";

export type InstitutionType = "school" | "college";

export interface ContactInfo {
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  altPhone?: string;
  email: string;
  mapQuery: string;
}

export interface SocialLinks {
  facebook?: string;
  youtube?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}

export interface Institution {
  id: InstitutionType;
  type: InstitutionType;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  establishedYear: number;
  affiliation: string;
  theme: ThemeTokens;
  contact: ContactInfo;
  socials: SocialLinks;
  stats: { label: string; value: string }[];
}
