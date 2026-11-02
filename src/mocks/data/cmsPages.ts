import { schoolHomePage, collegeHomePage } from "./pages";
import { schoolHeroUrl, collegeHeroUrl } from "./images";
import type { CmsPageRecord, Page, Section } from "@/types";

function richTextPage(opts: {
  slug: string;
  institutionId: "school" | "college";
  title: string;
  heroTitle: string;
  paragraph: string;
}): Page {
  const sections: Section[] = [
    {
      id: `${opts.slug}-hero`,
      type: "hero",
      order: 1,
      props: {
        title: opts.heroTitle,
        imageUrl: opts.institutionId === "school" ? schoolHeroUrl(1) : collegeHeroUrl(1),
        variant: "compact",
      },
    },
    {
      id: `${opts.slug}-body`,
      type: "richText",
      order: 2,
      props: { title: opts.title, paragraphs: [opts.paragraph] },
    },
  ];
  return { slug: opts.slug, institutionId: opts.institutionId, title: opts.title, sections };
}

let seq = 1;
function record(opts: Omit<CmsPageRecord, "id">): CmsPageRecord {
  const rec = { id: `cms-page-${String(seq).padStart(3, "0")}`, ...opts };
  seq += 1;
  return rec;
}

export const cmsPages: CmsPageRecord[] = [
  record({
    institutionId: "school",
    title: "Home",
    slug: "home",
    siteArea: "school",
    status: "Published",
    author: "Sujata Rout",
    updatedAt: "2026-10-26T09:30:00",
    visibility: "Public",
    page: schoolHomePage,
  }),
  record({
    institutionId: "school",
    title: "About Us",
    slug: "about",
    siteArea: "school",
    status: "Published",
    author: "Sujata Rout",
    updatedAt: "2026-10-18T11:00:00",
    visibility: "Public",
    page: richTextPage({ slug: "about", institutionId: "school", title: "About Us", heroTitle: "About Pathani Samanta Public School", paragraph: "A CBSE-affiliated Nursery-to-Grade-12 school in Khandapara, Nayagarh." }),
  }),
  record({
    institutionId: "school",
    title: "Admissions",
    slug: "admissions",
    siteArea: "school",
    status: "Published",
    author: "Priyanka Senapati",
    updatedAt: "2026-10-20T15:10:00",
    visibility: "Public",
    page: richTextPage({ slug: "admissions", institutionId: "school", title: "Admissions", heroTitle: "Admissions 2027–28", paragraph: "Applications are open for Nursery through Class XI." }),
  }),
  record({
    institutionId: "school",
    title: "Contact Us",
    slug: "contact",
    siteArea: "school",
    status: "Published",
    author: "Sujata Rout",
    updatedAt: "2026-09-30T10:00:00",
    visibility: "Public",
    page: richTextPage({ slug: "contact", institutionId: "school", title: "Contact Us", heroTitle: "Contact Us", paragraph: "Reach out to PSPS through the front office or the enquiry form." }),
  }),
  record({
    institutionId: "school",
    title: "Founders' Day 2026 — Celebration Page",
    slug: "founders-day-2026",
    siteArea: "school",
    status: "Scheduled",
    author: "Ramesh Nayak",
    updatedAt: "2026-10-27T16:40:00",
    scheduledFor: "2026-12-10T06:00:00",
    visibility: "Public",
    page: richTextPage({ slug: "founders-day-2026", institutionId: "school", title: "Founders' Day 2026", heroTitle: "Founders' Day 2026 — Shining Stars", paragraph: "Join us as we celebrate the school's founding anniversary with performances and an art exhibition." }),
  }),
  record({
    institutionId: "school",
    title: "New Smart Classroom Initiative",
    slug: "smart-classroom-initiative",
    siteArea: "school",
    status: "Draft",
    author: "Sujata Rout",
    updatedAt: "2026-10-25T13:20:00",
    visibility: "Public",
    page: richTextPage({ slug: "smart-classroom-initiative", institutionId: "school", title: "Smart Classroom Initiative", heroTitle: "Digital classrooms are coming to PSPS", paragraph: "Draft copy — details to be confirmed with the facilities committee before publishing." }),
  }),
  record({
    institutionId: "school",
    title: "Winter Break Advisory",
    slug: "winter-break-advisory",
    siteArea: "school",
    status: "Pending Approval",
    author: "Ramesh Nayak",
    updatedAt: "2026-10-28T09:05:00",
    visibility: "Public",
    page: richTextPage({ slug: "winter-break-advisory", institutionId: "school", title: "Winter Break Advisory", heroTitle: "Winter Break Advisory", paragraph: "Awaiting Principal approval before publishing to the public site." }),
  }),

  record({
    institutionId: "college",
    title: "Home",
    slug: "home",
    siteArea: "college",
    status: "Published",
    author: "Dr. Snigdha Mohanty",
    updatedAt: "2026-10-26T10:15:00",
    visibility: "Public",
    page: collegeHomePage,
  }),
  record({
    institutionId: "college",
    title: "About",
    slug: "about",
    siteArea: "college",
    status: "Published",
    author: "Dr. Snigdha Mohanty",
    updatedAt: "2026-10-15T09:00:00",
    visibility: "Public",
    page: richTextPage({ slug: "about", institutionId: "college", title: "About", heroTitle: "About Pathani Samanta College", paragraph: "A UGC-recognized degree college offering UG and PG programmes across Science, Commerce and Arts." }),
  }),
  record({
    institutionId: "college",
    title: "Admissions",
    slug: "admissions",
    siteArea: "college",
    status: "Published",
    author: "Pratikshya Barik",
    updatedAt: "2026-10-21T12:30:00",
    visibility: "Public",
    page: richTextPage({ slug: "admissions", institutionId: "college", title: "Admissions", heroTitle: "Admissions 2027–28", paragraph: "UG and PG applications are open for the 2027–28 session." }),
  }),
  record({
    institutionId: "college",
    title: "Contact Us",
    slug: "contact",
    siteArea: "college",
    status: "Published",
    author: "Dr. Snigdha Mohanty",
    updatedAt: "2026-09-28T08:40:00",
    visibility: "Public",
    page: richTextPage({ slug: "contact", institutionId: "college", title: "Contact Us", heroTitle: "Contact Us", paragraph: "Reach out to PSC through the administrative office or the enquiry form." }),
  }),
  record({
    institutionId: "college",
    title: "NAAC Peer Visit — Preparation Notes",
    slug: "naac-peer-visit-2026",
    siteArea: "college",
    status: "Pending Approval",
    author: "Dr. Snigdha Mohanty",
    updatedAt: "2026-10-27T17:00:00",
    visibility: "Portal Only",
    page: richTextPage({ slug: "naac-peer-visit-2026", institutionId: "college", title: "NAAC Peer Visit", heroTitle: "NAAC Peer Team Visit — Preparation", paragraph: "Internal staging page awaiting IQAC sign-off before publishing." }),
  }),
  record({
    institutionId: "college",
    title: "Convocation 2026",
    slug: "convocation-2026",
    siteArea: "college",
    status: "Scheduled",
    author: "Pratikshya Barik",
    updatedAt: "2026-10-26T14:50:00",
    scheduledFor: "2026-12-18T06:00:00",
    visibility: "Public",
    page: richTextPage({ slug: "convocation-2026", institutionId: "college", title: "Convocation 2026", heroTitle: "Convocation 2026", paragraph: "Degree conferral ceremony details will go live two weeks before the event." }),
  }),
  record({
    institutionId: "college",
    title: "New Robotics Lab",
    slug: "robotics-lab",
    siteArea: "college",
    status: "Draft",
    author: "Dr. Soumya Ranjan Pattnaik",
    updatedAt: "2026-10-24T11:10:00",
    visibility: "Public",
    page: richTextPage({ slug: "robotics-lab", institutionId: "college", title: "New Robotics Lab", heroTitle: "A new Robotics Lab for Computer Science", paragraph: "Draft announcement — pending final photos before publishing." }),
  }),
];

export function getCmsPagesBySite(siteArea: "school" | "college"): CmsPageRecord[] {
  return cmsPages.filter((p) => p.siteArea === siteArea);
}

export function getCmsPage(id: string): CmsPageRecord | undefined {
  return cmsPages.find((p) => p.id === id);
}
