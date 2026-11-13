import { COLLEGE_THEME, SCHOOL_THEME } from "@/theme/tokens";
import type { Institution } from "@/types";

export const institutions: Record<"school" | "college", Institution> = {
  school: {
    id: "school",
    type: "school",
    name: "Our School",
    shortName: "OS",
    tagline: "Where Every Child Learns to Shine · Estd. 1998",
    description:
      "A premier CBSE-affiliated Senior Secondary School (Nursery to Class XII) in Nayagarh, Odisha. Dedicated to value-based holistic education, Atal Tinkering Lab innovation, PM-POSHAN nutrition, inclusive learning, and child safety compliance under NEP 2020.",
    establishedYear: 1998,
    affiliation: "CBSE Affiliation No. 3330123 · School Code: 15234 · UDISE+ 21160401201",
    theme: SCHOOL_THEME,
    contact: {
      address: "Khandapara Road, Near Bus Stand",
      city: "Khandapara, Nayagarh",
      state: "Odisha",
      pincode: "752054",
      phone: "+91 98765 43210",
      altPhone: "+91 6757 223456",
      email: "info@ourschool.edu.in",
      mapQuery: "Khandapara, Nayagarh, Odisha",
    },
    socials: {
      facebook: "https://facebook.com",
      youtube: "https://youtube.com",
      instagram: "https://instagram.com",
    },
    stats: [
      { label: "Enrolled Students", value: "1,250+" },
      { label: "Qualified Teachers", value: "48" },
      { label: "Smart Classrooms & Labs", value: "42" },
      { label: "Class X/XII Pass Rate", value: "98.4%" },
    ],
  },
  college: {
    id: "college",
    type: "college",
    name: "Our College",
    shortName: "OC",
    tagline: "Sculpting Heart, Head & Hand · Established 1868 / 1943",
    description:
      "Premier autonomous degree college of Odisha, NAAC Accredited A+ (CGPA 3.42), recognized under UGC Category-1 with 32 PG Departments, Central Instrumentation Facility, and over 150 years of higher education leadership.",
    establishedYear: 1868,
    affiliation: "Autonomous College under State Universities Act · UGC 2(f) & 12(B) · NAAC A+ (CGPA 3.42)",
    theme: COLLEGE_THEME,
    contact: {
      address: "College Campus, College Square",
      city: "Bhubaneswar & Cuttack",
      state: "Odisha",
      pincode: "751004",
      phone: "+91 674 2567387",
      altPhone: "+91 671 2201690",
      email: "registrar@ourcollege.edu.in",
      mapQuery: "Odisha, India",
    },
    socials: {
      facebook: "https://facebook.com",
      youtube: "https://youtube.com",
      linkedin: "https://linkedin.com",
      twitter: "https://x.com",
    },
    stats: [
      { label: "Years of Legacy", value: "80+" },
      { label: "Affiliated Colleges", value: "380+" },
      { label: "Enrolled Students", value: "24,000+" },
      { label: "Scopus & WoS Papers", value: "3,500+" },
    ],
  },
};

export function getInstitution(id: "school" | "college"): Institution {
  return institutions[id];
}
