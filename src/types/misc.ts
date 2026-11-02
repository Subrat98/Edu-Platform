import type { InstitutionType } from "./institution";

export interface DownloadDocument {
  id: string;
  institutionId: InstitutionType;
  title: string;
  category: string;
  fileType: "pdf" | "doc" | "xls";
  sizeLabel: string;
  updatedDate: string;
}

export interface AccreditationBadge {
  id: string;
  label: string;
  sublabel: string;
  logoUrl: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}
