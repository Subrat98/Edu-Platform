import type { AccreditationBadge } from "@/types";

// Demo badges only — intentionally not real accreditation body logos.
// logoUrl is left empty; AccreditationStrip renders a generated badge
// (label + sublabel inside a themed ring) instead of an image.
export const accreditationBadges: AccreditationBadge[] = [
  { id: "accred-naac", label: "NAAC", sublabel: "Grade A (Demo)", logoUrl: "" },
  { id: "accred-nirf", label: "NIRF", sublabel: "Ranked Band (Demo)", logoUrl: "" },
  { id: "accred-ugc", label: "UGC", sublabel: "2(f) & 12(B) (Demo)", logoUrl: "" },
  { id: "accred-university", label: "Utkal University", sublabel: "Affiliated (Demo)", logoUrl: "" },
];
