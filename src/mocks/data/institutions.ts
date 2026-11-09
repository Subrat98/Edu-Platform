import { COLLEGE_THEME, SCHOOL_THEME } from "@/theme/tokens";
import type { Institution } from "@/types";

export const institutions: Record<"school" | "college", Institution> = {
  school: {
    id: "school",
    type: "school",
    name: "Our School",
    shortName: "PSPS",
    tagline: "Where every child learns to shine",
    description:
      "A CBSE-affiliated Nursery-to-Grade-12 school in Khandapara, Nayagarh, known for strong academics, caring teachers and a safe, activity-rich campus.",
    establishedYear: 1998,
    affiliation: "CBSE Affiliation No. 3330123",
    theme: SCHOOL_THEME,
    contact: {
      address: "Khandapara Road, Near Bus Stand",
      city: "Khandapara",
      state: "Odisha",
      pincode: "752054",
      phone: "+91 98765 43210",
      altPhone: "+91 674 223 4567",
      email: "info@psps.eduplatform.demo",
      mapQuery: "Khandapara, Nayagarh, Odisha",
    },
    socials: {
      facebook: "#",
      youtube: "#",
      instagram: "#",
    },
    stats: [
      { label: "Students", value: "1,250+" },
      { label: "Qualified Teachers", value: "65+" },
      { label: "Years of Excellence", value: "27" },
      { label: "Board Result Success", value: "98%" },
    ],
  },
  college: {
    id: "college",
    type: "college",
    name: "Our College",
    shortName: "PSC",
    tagline: "Knowledge. Research. Leadership.",
    description:
      "A UGC-recognized degree college in Khandapara, Nayagarh offering undergraduate and postgraduate programmes across Science, Commerce and Arts, with an active IQAC and a growing research footprint.",
    establishedYear: 1975,
    affiliation: "Affiliated to Utkal University · UGC 2(f) & 12(B)",
    theme: COLLEGE_THEME,
    contact: {
      address: "College Square, Khandapara",
      city: "Khandapara",
      state: "Odisha",
      pincode: "752054",
      phone: "+91 98765 11223",
      altPhone: "+91 674 223 9988",
      email: "info@psc.eduplatform.demo",
      mapQuery: "Pathani Samanta College, Khandapara, Nayagarh, Odisha",
    },
    socials: {
      facebook: "#",
      youtube: "#",
      linkedin: "#",
      twitter: "#",
    },
    stats: [
      { label: "Students", value: "4,200+" },
      { label: "Faculty", value: "180+" },
      { label: "Programmes", value: "32" },
      { label: "Library Volumes", value: "60,000+" },
    ],
  },
};

export function getInstitution(id: "school" | "college"): Institution {
  return institutions[id];
}
