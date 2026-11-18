import { useEffect, useState } from "react";
import { readStorage, writeStorage } from "@/lib/storage";
import { collegeHeroUrl, schoolHeroUrl } from "@/mocks/data/images";
import type { InstitutionType } from "@/types";

// ==========================================
// 1. CONTENT INTERFACES
// ==========================================

export interface HeroSlideContent {
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  image: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

export interface StatItemContent {
  label: string;
  val: string;
  sub: string;
}

export interface EServiceItemContent {
  title: string;
  desc: string;
  href: string;
}

export interface LeadershipMessageContent {
  headTitle: string;
  headName: string;
  subTitle: string;
  badge: string;
  location: string;
  shortQuote: string;
  fullMessage: string;
}

export interface HomePageContent {
  tickerText: string;
  heroSlides: HeroSlideContent[];
  stats: StatItemContent[];
  chancellorMessage?: LeadershipMessageContent;
  vcMessage?: LeadershipMessageContent;
  principalMessage?: LeadershipMessageContent;
  qualityTitle: string;
  qualityDescription: string;
}

export interface TimelineItemContent {
  year: string;
  event: string;
}

export interface FormerLeaderContent {
  name: string;
  tenure: string;
  field: string;
}

export interface SiteBrandingContent {
  logoUrl: string;
  institutionName: string;
  tagline: string;
  affiliationBadge: string;
}

export interface AboutPageContent {
  heroImage?: string;
  heroTitle: string;
  heroSubtitle: string;
  visionTitle: string;
  visionText: string;
  missionTitle: string;
  missionText: string;
  storyTitle: string;
  storyText: string;
  timeline: TimelineItemContent[];
  formerLeaders: FormerLeaderContent[];
}

export interface AdmissionsPageContent {
  heroImage?: string;
  heroTitle: string;
  heroSubtitle: string;
  bannerTitle: string;
  bannerDescription: string;
  deadline: string;
  eligibility: string;
  steps: string[];
}

export interface ContactPageContent {
  heroImage?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  altPhone: string;
  email: string;
  officeHours: string;
  mapQuery: string;
}

export interface SiteContentBundle {
  branding: SiteBrandingContent;
  home: HomePageContent;
  about: AboutPageContent;
  admissions: AdmissionsPageContent;
  contact: ContactPageContent;
  pageBanners?: Record<string, string>;
}

// ==========================================
// 2. FACTORY DEFAULT CONTENT (COLLEGE & SCHOOL)
// ==========================================

export const DEFAULT_COLLEGE_CONTENT: SiteContentBundle = {
  branding: {
    logoUrl: "/college-logo.png",
    institutionName: "Utkal Autonomous College",
    tagline: "Premier Higher Education & NAAC A+ Accredited Institution",
    affiliationBadge: "Autonomous College · Affiliated to Utkal University · NAAC Grade A+",
  },
  pageBanners: {
    about: collegeHeroUrl(1),
    admissions: collegeHeroUrl(5),
    contact: collegeHeroUrl(6),
    academics: collegeHeroUrl(2),
    facilities: collegeHeroUrl(3),
    research: collegeHeroUrl(4),
  },
  home: {
    tickerText: "UGC Category-1 Autonomous Institution · NAAC A+ (CGPA 3.42) · Admissions Open for 2026-27 session",
    heroSlides: [
      {
        title: "Sculpting Heart, Head & Hand",
        subtitle: "First & Premier State University of Odisha · Established 1868 / 1943",
        description: "Accredited Grade A+ (CGPA 3.42) by NAAC · Recognized under UGC Category-1 · 32 PG Departments, Central Instrumentation Facility, and over 150 years of higher education leadership.",
        image: collegeHeroUrl(1),
        primaryCta: { label: "e-Admission Portal 2026-27", href: "/college/admissions" },
        secondaryCta: { label: "NAAC Accreditation Dossier", href: "/college/iqac" },
        badge: "NAAC Grade A+ · CGPA 3.42",
      },
      {
        title: "Centre for Groundbreaking Research & Innovation",
        subtitle: "₹142.50 Lakhs Extramural Grants (DST, CSIR, UGC) · 68 Scopus Papers",
        description: "Advancing frontier inquiry in Artificial Intelligence, Perovskite Nanomaterials, Biodiversity of the Eastern Ghats, and Regional Development Economics with state-of-the-art CIF facilities.",
        image: collegeHeroUrl(2),
        primaryCta: { label: "Explore Scopus Register", href: "/college/research" },
        secondaryCta: { label: "Central Instrumentation Facility", href: "/college/research" },
        badge: "Metric 3.3.1 Scopus Verified",
      },
      {
        title: "Vibrant Campus Life & Heritage Legacy",
        subtitle: "Historic Red-Brick Quadrangle · Parija Central Library · 380+ Affiliated Colleges",
        description: "Empowering 24,000+ students with Choice Based Credit System (CBCS), NEP 2020 LOCF curricula, 42 micro-credentials, active clubs, and 84% campus placement record.",
        image: collegeHeroUrl(3),
        primaryCta: { label: "Explore Programmes & Syllabi", href: "/college/programmes" },
        secondaryCta: { label: "Take 360° Virtual Tour", href: "/college/virtual-tour" },
        badge: "600,000+ Global Alumni",
      },
    ],
    stats: [
      { label: "Years of Legacy", val: "80+", sub: "Est. 1868 / 1943" },
      { label: "Affiliated Colleges", val: "380+", sub: "Across Odisha" },
      { label: "PG Departments", val: "32", sub: "Centres of Excellence" },
      { label: "Enrolled Students", val: "24,000+", sub: "UG, PG & Ph.D." },
      { label: "Full-Time Faculty", val: "450+", sub: "16:1 Ratio" },
      { label: "Research Grants", val: "₹142.5L", sub: "DST, CSIR & UGC" },
      { label: "Scopus Papers", val: "3,500+", sub: "68 in 2025-26" },
      { label: "Global Alumni", val: "600,000+", sub: "Leadership Footprint" },
    ],
    chancellorMessage: {
      headTitle: "Hon'ble Chancellor & Governor of Odisha",
      headName: "Shri Raghubar Das",
      subTitle: "Ex-Officio Head & Supreme Authority under the Odisha Universities Act",
      badge: "Head of the University",
      location: "Raj Bhavan, Odisha",
      shortQuote: "May this premier institution continue to illuminate the state through excellence in higher learning, inclusive research, and character building for future generations.",
      fullMessage: "The history of higher education in Odisha is intrinsically linked with the glorious trajectory of this university. From its historic inception in the 19th century through the pivotal university charter of 1943, this institution has nurtured scholars, freedom fighters, chief ministers, jurists, and scientists who shaped modern India. In this transformative era of NEP 2020, I commend the faculty and administration for upholding rigorous academic standards.",
    },
    vcMessage: {
      headTitle: "Vice-Chancellor's Secretariat",
      headName: "Prof. (Dr.) B. K. Ray, Vice-Chancellor",
      subTitle: "Ph.D., FNAAS · Leading Institutional Transformation & NAAC A++ Roadmap",
      badge: "Principal Academic & Executive Officer",
      location: "Vice-Chancellor's Office",
      shortQuote: "Our mission is to empower every student through NEP 2020 student-centric learning, experiential innovation, transparent governance, and world-class research.",
      fullMessage: "Welcome to Our College. We stand at the intersection of timeless heritage and groundbreaking 21st-century innovation. Our accreditation with NAAC Grade A+ (CGPA 3.42) reflects our unyielding commitment to academic integrity, student-centric pedagogical reforms, and research excellence.",
    },
    qualityTitle: "Quality Assurance, Accreditation & Transparency Repository",
    qualityDescription: "In compliance with NAAC SOP and UGC Mandatory Self-Disclosure guidelines (2024), explore verified Criteria 1–7 evidence dossiers, 8-year AQAR archive, Self Study Reports (SSR), CA-audited balance sheets, and NIRF rankings.",
  },
  about: {
    heroImage: collegeHeroUrl(1),
    heroTitle: "About Our College & University Heritage",
    heroSubtitle: "Sculpting Heart, Head & Hand since 1868",
    visionTitle: "Our Institutional Vision",
    visionText: "To be a globally recognized center of excellence in multidisciplinary education, fostering ethical leadership, pioneering research, and transformative social impact.",
    missionTitle: "Our Mission",
    missionText: "To provide world-class, inclusive, and student-centric higher education aligned with NEP 2020; to ignite curiosity through extramural scientific and humanities research; and to preserve Odisha's cultural heritage while embracing technological frontiers.",
    storyTitle: "Over 150 Years of Higher Learning Leadership",
    storyText: "Established initially as a premier collegiate institution in 1868 and chartered as an autonomous university, this temple of learning has nurtured generations of scholars, statesmen, jurists, and scientists across Eastern India.",
    timeline: [
      { year: "1868", event: "Establishment of the Collegiate Institution, marking the dawn of modern higher education in Odisha." },
      { year: "1876", event: "Upgraded to a full-fledged Degree College with Science and Arts faculties." },
      { year: "1943", event: "Chartered as the first state university of Odisha under the historic Legislative Assembly Act." },
      { year: "1989", event: "Celebrated Platinum Jubilee and established the Central Instrumentation Facility." },
      { year: "2017", event: "Awarded NAAC Cycle 2 Grade A with autonomous excellence status." },
      { year: "2023", event: "Achieved NAAC Grade A+ (CGPA 3.42) in Cycle 3; recognized as UGC Category-1 University." },
    ],
    formerLeaders: [
      { name: "Dr. Prana Krushna Parija", tenure: "1943 – 1948", field: "Eminent Botanist & Pioneer Educationist" },
      { name: "Dr. Chintamani Acharya", tenure: "1948 – 1951", field: "Legal Luminary & Scholar" },
      { name: "Prof. Trilochan Pradhan", tenure: "1989 – 1991", field: "Eminent Theoretical Physicist & IOP Founder" },
      { name: "Prof. Radhamohan", tenure: "1994 – 1997", field: "Environmentalist & Padma Shri Awardee" },
      { name: "Prof. (Dr.) Soumendra Mohan Patnaik", tenure: "2017 – 2020", field: "Anthropologist & Academic Reformer" },
    ],
  },
  admissions: {
    heroImage: collegeHeroUrl(5),
    heroTitle: "Admissions 2026–27",
    heroSubtitle: "Single-Window SAMS Digital Application Portal for UG, PG & Ph.D. Programmes",
    bannerTitle: "UG & PG admissions are now open for 2026–27",
    bannerDescription: "Applications for all undergraduate and postgraduate programmes for the 2026–27 session are open. Merit lists are published in phases based on qualifying marks and category reservation norms.",
    deadline: "31 July 2026",
    eligibility: "Varies by programme — 10+2 for UG and Graduation for PG programmes",
    steps: [
      "Create your applicant profile on the portal with verified mobile and email",
      "Select your choice of PG/UG disciplines and upload academic transcripts",
      "Pay application fees online via SBI Collect gateway",
      "Track your verified merit rank and attend online document verification",
    ],
  },
  contact: {
    heroImage: collegeHeroUrl(6),
    address: "College Square, University Campus",
    city: "Bhubaneswar & Cuttack",
    state: "Odisha",
    pincode: "751004",
    phone: "+91 674 2567387",
    altPhone: "+91 671 2201690",
    email: "registrar@ourcollege.edu.in",
    officeHours: "Monday to Saturday: 10:00 AM – 5:00 PM (2nd & 4th Saturday Closed)",
    mapQuery: "Bhubaneswar, Odisha, India",
  },
};

export const DEFAULT_SCHOOL_CONTENT: SiteContentBundle = {
  branding: {
    logoUrl: "/college-logo.png",
    institutionName: "Our School",
    tagline: "Where every child learns to shine · Estd. 1998",
    affiliationBadge: "CBSE Affiliation No. 3330123 · School Code: 15234",
  },
  pageBanners: {
    about: schoolHeroUrl(1),
    admissions: schoolHeroUrl(2),
    contact: schoolHeroUrl(3),
    academics: schoolHeroUrl(1),
    facilities: schoolHeroUrl(2),
  },
  home: {
    tickerText: "CBSE Affiliated Senior Secondary School (1998) · Admissions Open Nursery to Grade XI · Atal Tinkering Lab Active",
    heroSlides: [
      {
        title: "Nurturing Young Minds to Shine",
        subtitle: "CBSE Affiliated Senior Secondary School (Nursery to Class XII) · Estd. 1998",
        description: "Empowering 1,250+ students in Khandapara, Nayagarh with holistic NEP 2020 pedagogy, Atal Tinkering Lab innovations, PM-POSHAN nutrition, and 98.4% board result excellence.",
        image: schoolHeroUrl(1),
        primaryCta: { label: "Admissions 2026-27 (RTE 25%)", href: "/school/admissions" },
        secondaryCta: { label: "Mandatory Public Disclosure", href: "/school/mandatory-disclosure" },
        badge: "CBSE Affiliation No. 3330123 · School Code: 15234",
      },
      {
        title: "Hands-on Innovation at Atal Tinkering Lab",
        subtitle: "Robotics, 3D Printing, Electronics & Internet of Things (IoT) Kits",
        description: "Fostering STEM curiosity from Class VI onwards under NITI Aayog's ATL initiative, preparing the innovators, scientists, and engineers of tomorrow.",
        image: schoolHeroUrl(2),
        primaryCta: { label: "Explore Science & ATL Labs", href: "/school/facilities" },
        secondaryCta: { label: "ATL Student Innovations", href: "/school/student-life" },
        badge: "NITI Aayog ATL Grantee",
      },
      {
        title: "Sports, Arts & Values-Based Character Building",
        subtitle: "Four Houses System · Scouts & Guides · Safe & Caring Campus",
        description: "Cultivating character, sportsmanship, and creative expression through music, yoga, athletics, and cultural competitions.",
        image: schoolHeroUrl(3),
        primaryCta: { label: "Explore Student Life", href: "/school/student-life" },
        secondaryCta: { label: "View Photo Gallery", href: "/school/gallery" },
        badge: "Fit India Certified School",
      },
    ],
    stats: [
      { label: "Enrolled Students", val: "1,250+", sub: "Nursery to Class XII" },
      { label: "Qualified Faculty", val: "48", sub: "100% Trained Teachers" },
      { label: "Smart Classrooms", val: "42", sub: "ICT & Digital Boards" },
      { label: "Board Pass Rate", val: "98.4%", sub: "Class X & XII (2025)" },
      { label: "Atal Tinkering Lab", val: "1", sub: "NITI Aayog Grantee" },
      { label: "Campus Area", val: "4.5 Acres", sub: "Playground & Sports" },
      { label: "Library Books", val: "8,500+", sub: "Journals & Reading Room" },
      { label: "Legacy of Care", val: "28 Years", sub: "Established 1998" },
    ],
    principalMessage: {
      headTitle: "From the Principal's Desk",
      headName: "Mrs. Meenakshi Tripathy, M.A., B.Ed.",
      subTitle: "Principal & Head of School · 22 Years in K-12 Educational Leadership",
      badge: "School Leadership",
      location: "Principal's Office, Academic Block",
      shortQuote: "At Our School, every child is embraced as a unique individual with boundless potential. We cultivate intellect, empathy, and resilience.",
      fullMessage: "Welcome to Our School. For over two and a half decades, we have remained devoted to the ideal of holistic education. Our curriculum seamlessly balances rigorous academic pursuits with creative arts, physical wellness, and ethical grounding.",
    },
    qualityTitle: "CBSE Mandatory Public Disclosure & Compliance (Appendix IX)",
    qualityDescription: "In compliance with CBSE Affiliation Bye-Laws and Section 4.2 of GIGW 3.0, access verified school infrastructure reports, fee structure, SMC members, and self-declaration certificates.",
  },
  about: {
    heroImage: schoolHeroUrl(1),
    heroTitle: "About Our School",
    heroSubtitle: "Where Every Child Learns to Shine · Estd. 1998",
    visionTitle: "Our Vision",
    visionText: "To nurture confident, compassionate, and lifelong learners who excel academically and contribute positively to society.",
    missionTitle: "Our Mission",
    missionText: "To provide a secure, inclusive, and stimulating learning environment that blends modern STEM innovation with timeless cultural values.",
    storyTitle: "Our 28-Year Educational Journey",
    storyText: "Founded in 1998 in Khandapara, Nayagarh, Our School began with a humble batch of 60 students. Today, it stands as a premier CBSE-affiliated Senior Secondary institution serving over 1,250 young scholars.",
    timeline: [
      { year: "1998", event: "Foundation of Our School with Primary classes (Nursery to Grade V)." },
      { year: "2006", event: "Upgraded to Secondary School (Grade X) with permanent CBSE affiliation." },
      { year: "2014", event: "Senior Secondary affiliation granted for Science and Commerce streams." },
      { year: "2019", event: "Established NITI Aayog supported Atal Tinkering Lab (ATL)." },
      { year: "2024", event: "Celebrated Silver Jubilee with 98.4% CBSE Board exam pass rate." },
    ],
    formerLeaders: [
      { name: "Late S. N. Mohapatra", tenure: "1998 – 2008", field: "Founding Principal & Social Reformer" },
      { name: "Mr. D. K. Pradhan", tenure: "2008 – 2018", field: "Senior Educationist & Science Mentor" },
    ],
  },
  admissions: {
    heroImage: schoolHeroUrl(2),
    heroTitle: "Admissions 2026–27",
    heroSubtitle: "Admissions open for Nursery to Class XI (Science & Commerce)",
    bannerTitle: "Applications Open for 2026–27 Academic Session",
    bannerDescription: "Seats available across Pre-Primary, Primary, Middle, Secondary and Senior Secondary streams. 25% seats reserved under RTE Act for eligible applicants.",
    deadline: "15 April 2026",
    eligibility: "Age 3+ for Nursery; age-appropriate readiness for higher classes per NEP 2020",
    steps: [
      "Obtain or download the registration form online",
      "Submit completed form with birth certificate and immunisation records",
      "Informal parent-child interaction for Nursery; diagnostic assessment for Classes I–IX",
      "Confirm seat by completing fee formalities at the accounts counter",
    ],
  },
  contact: {
    heroImage: schoolHeroUrl(3),
    address: "Khandapara Road, Near Bus Stand",
    city: "Khandapara, Nayagarh",
    state: "Odisha",
    pincode: "752054",
    phone: "+91 98765 43210",
    altPhone: "+91 6757 223456",
    email: "info@ourschool.edu.in",
    officeHours: "Monday to Saturday: 8:00 AM – 3:30 PM",
    mapQuery: "Khandapara, Nayagarh, Odisha",
  },
};

// ==========================================
// 3. PERSISTENCE & STORAGE APIS
// ==========================================

export function getFullSiteContent(institutionId: InstitutionType): SiteContentBundle {
  const defaultBundle = institutionId === "school" ? DEFAULT_SCHOOL_CONTENT : DEFAULT_COLLEGE_CONTENT;
  const stored = readStorage<Partial<SiteContentBundle> | null>(`site_content_${institutionId}`, null);

  if (!stored) return defaultBundle;

  return {
    branding: { ...defaultBundle.branding, ...(stored.branding ?? {}) },
    pageBanners: { ...(defaultBundle.pageBanners ?? {}), ...(stored.pageBanners ?? {}) },
    home: { ...defaultBundle.home, ...(stored.home ?? {}) },
    about: { ...defaultBundle.about, ...(stored.about ?? {}) },
    admissions: { ...defaultBundle.admissions, ...(stored.admissions ?? {}) },
    contact: { ...defaultBundle.contact, ...(stored.contact ?? {}) },
  };
}

export function saveFullSiteContent(institutionId: InstitutionType, bundle: SiteContentBundle): void {
  writeStorage(`site_content_${institutionId}`, bundle);

  // Broadcast to other tabs and active components
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("eduplatform:site-content-changed", { detail: { institutionId, bundle } }));
    window.dispatchEvent(new Event("storage"));
  }
}

export function resetFullSiteContent(institutionId: InstitutionType): void {
  const defaultBundle = institutionId === "school" ? DEFAULT_SCHOOL_CONTENT : DEFAULT_COLLEGE_CONTENT;
  writeStorage(`site_content_${institutionId}`, null);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("eduplatform:site-content-changed", { detail: { institutionId, bundle: defaultBundle } }));
    window.dispatchEvent(new Event("storage"));
  }
}

// React hook for pages to subscribe to live content changes
export function useLiveSiteContent(institutionId: InstitutionType): SiteContentBundle {
  const [content, setContent] = useState<SiteContentBundle>(() => getFullSiteContent(institutionId));

  useEffect(() => {
    setContent(getFullSiteContent(institutionId));

    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<{ institutionId?: InstitutionType; bundle?: SiteContentBundle }>;
      if (customEvent.detail && customEvent.detail.institutionId && customEvent.detail.institutionId !== institutionId) {
        return;
      }
      setContent(getFullSiteContent(institutionId));
    };

    window.addEventListener("eduplatform:site-content-changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("eduplatform:site-content-changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, [institutionId]);

  return content;
}
